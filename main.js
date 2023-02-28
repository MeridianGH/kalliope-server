import express from 'express'
import url from 'url'
import path from 'path'
import fetch from 'node-fetch'
import { server as WebSocketServer } from 'websocket'
import { logging } from './src/utilities/logging.js'

const app = express()

const port = 8080
const domain = 'kalliope.xyz'
const host = domain + (port !== 80 ? `:${port}` : '')
const hostname = 'http://' + host

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
  if (req.hostname == domain) { return fetch(req.query.url).then((response) => { response.body.pipe(res) }) }
  res.status(403).end()
})

// Allow client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = app.listen(port, null, null, () => {
  console.log(`Started server on ${hostname}.`)
})

const clientGuilds = {}
const userConnections = {}
const clientConnections = {}

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

    let guildId, userId

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)
      console.log(data)

      // Return client guilds
      if (data.type == 'requestClientGuilds') {
        ws.sendData('clientGuilds', { guilds: clientGuilds })
        return
      }

      // Verify and store user connection
      // noinspection JSUnresolvedVariable
      if (!data.guildId || !data.userId) { return }
      userConnections[data.guildId] = { ...userConnections[data.guildId], [data.userId]: ws }
      guildId = data.guildId
      userId = data.userId

      // Forward data to client
      const clientWs = clientConnections[data.clientId ?? clientGuilds[data.guildId]]
      if (!clientWs) { return }
      clientWs.sendData(null, data)
    })

    ws.on('close', (reasonCode, description) => {
      logging.warn(`[WebSocket] User websocket closed with reason: ${reasonCode} | ${description}`)
      try {
        delete userConnections[guildId][userId]
        if (Object.keys(userConnections[guildId]).length === 0) { delete userConnections[guildId] }
      } catch (e) {
        logging.warn('[WebSocket] Failed to delete websocket.')
      }
    })

    return
  }

  // Client WebSocket
  if (request.host === 'clients.' + host && (request.origin === undefined || request.origin === '*')) {
    const ws = request.accept(null, request.origin)

    ws.sendData = (type = 'none', data = {}) => {
      console.log('sent', data)
      data.type = data.type ?? type
      ws.sendUTF(JSON.stringify(data))
    }

    let clientId

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)
      console.log('received', data)

      // Verify and store client connection
      if (!data.clientId) { return }
      clientConnections[data.clientId] = ws
      clientId = data.clientId

      // Update clientData
      if (data.type === 'clientData') {
        data.guilds.forEach((guild) => { clientGuilds[guild] = data.clientId })
        return
      }

      // Forward data to users
      // noinspection JSUnresolvedVariable
      if (!data.guildId) { return }
      Object.values(userConnections[data.guildId]).forEach((userWs) => {
        userWs?.sendData(null, data)
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
