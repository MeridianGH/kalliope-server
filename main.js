import express from 'express'
import url from 'url'
import path from 'path'
import fetch from 'node-fetch'
import { server as WebSocketServer } from 'websocket'
import { logging } from './src/utilities/logging.js'

const app = express()

const port = 80
const domain = 'kalliope.cc'
const host = domain + (port !== 80 ? `:${port}` : '')
const hostname = 'https://' + host

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Distribute folder
app.use(express.static('dist'))

// Endpoints
// Login endpoint
app.get('/login', (req, res) => {
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${hostname}/callback`)}`
  res.redirect(loginUrl)
})

// CORS Proxy
app.get('/cors', (req, res) => {
  if (req.hostname === domain) { return fetch(req.query.url).then((response) => { response.body.pipe(res) }) }
  res.status(403).end()
})

// Allow client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = app.listen(port, null, null, () => {
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
        if (Object.keys(userConnections[ws.guildId]).length === 0) { delete userConnections[ws.guildId] }
      }
    })

    return
  }

  // Client WebSocket
  if (request.host === 'clients.' + host && (request.origin === undefined || request.origin === '*')) {
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
