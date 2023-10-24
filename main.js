import express from 'express'
import https from 'https'
import http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { server as WebSocketServer } from 'websocket'
import { logging } from './src/utilities/logging.js'

const app = express()

const mode = process.argv[2] ?? 'production'
const ssl = mode === 'production'

const port = ssl ? 443 : 80
const domain = 'kalliope.cc'
const hostname = `http${ssl ? 's' : ''}://${domain}`

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Distribute folder
app.use(express.static('dist', { index: '' }))

// Validate URLs
app.use((req, res, next) => {
  try {
    decodeURIComponent(req.path)
  } catch (error) {
    res.redirect(hostname)
  }
  next()
})

// Endpoints
// Login endpoint
app.get('/login', (req, res) => {
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${hostname}/callback`)}`
  res.redirect(loginUrl)
})

// CORS Proxy
app.get('/cors', (req, res) => {
  if (req.hostname !== domain) { return res.status(403).end() }
  fetch(req.query.url).then((response) => { response.body.pipe(res) })
})

// Main endpoint
app.get('*', (req, res) => {
  if (req.hostname === 'lavalink.' + domain) {
    console.log(req)
    return fetch('http://127.0.0.1:2333' + req.path).then((response) => {
      console.log(response)
      response.body.pipe(res)
    })
  }
  if (req.hostname === 'clients.' + domain) { return res.redirect(hostname) }
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = (ssl ? https : http).createServer(ssl ? {
  cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain.pem`),
  key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`)
} : null, app).listen(port, null, null, () => {
  logging.success(`Started server on ${hostname}.`)
})

const clientGuilds = {}
const clientConnections = {}
const userConnections = { noGuild: {} }

const wss = new WebSocketServer({ httpServer: server })
// noinspection JSUnresolvedFunction
wss.on('request', (request) => {
  // User WebSocket
  if (request.origin === hostname) {
    const ws = request.accept(null, request.origin)

    ws.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      ws.sendUTF(JSON.stringify(data))
    }

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)

      // Verify and store user connection
      if (!data.userId) { return }
      userConnections[data.guildId ?? 'noGuild'] = { ...userConnections[data.guildId ?? 'noGuild'], [data.userId]: ws }
      if (data.guildId && Object.keys(userConnections.noGuild).includes(data.userId)) { delete userConnections.noGuild[data.userId] }
      ws.guildId = data.guildId ?? 'noGuild'
      ws.userId = data.userId

      // Return client guilds
      if (data.type === 'requestClientGuilds') {
        ws.sendData('clientGuilds', { guilds: clientGuilds })
        return
      }

      // Forward data to client
      const clientWs = clientConnections[data.clientId ?? clientGuilds[data.guildId]]
      if (!clientWs) { return }
      clientWs.sendData(null, data)
    })

    ws.on('close', (reasonCode, description) => {
      logging.warn(`[WebSocket] User websocket closed with reason: ${reasonCode} | ${description}`)
      if (userConnections[ws.guildId]) {
        delete userConnections[ws.guildId][ws.userId]
        if (Object.keys(userConnections[ws.guildId]).length === 0 && ws.guildId !== 'noGuild') { delete userConnections[ws.guildId] }
      }
    })

    return
  }

  // Client WebSocket
  if (request.host === 'clients.' + domain && (request.origin === undefined || request.origin === '*')) {
    const ws = request.accept(null, request.origin)

    ws.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      ws.sendUTF(JSON.stringify(data))
    }

    let clientId

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)

      // Verify and store client connection
      if (!data.clientId) { return }
      clientConnections[data.clientId] = ws
      clientId = data.clientId

      // Update clientData
      if (data.type === 'clientData') {
        data.guilds.forEach((guild) => {
          clientGuilds[guild] = data.clientId
        })
        Object.values(userConnections.noGuild).forEach((userWs) => {
          userWs.sendData('clientGuilds', { guilds: clientGuilds })
        })
        return
      }

      // Forward data to users
      if (!data.guildId || !userConnections[data.guildId]) { return }
      Object.values(userConnections[data.guildId]).forEach((userWs) => {
        userWs.sendData(null, data)
      })
    })

    ws.on('close', (reasonCode, description) => {
      logging.warn(`[WebSocket] Client connection closed with reason: ${reasonCode} | ${description}`)
      delete clientConnections[clientId]
    })

    return
  }
  // Invalid WebSocket request
  request.reject('Invalid request.')
})
