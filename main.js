import express from 'express'
import { server as WebSocketServer } from 'websocket'
import url from 'url'
import path from 'path'

const app = express()

const port = 8080
const domain = 'kalliope.xyz' + (port !== 80 ? `:${port}` : '')
const host = 'http://' + domain

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Distribute folder
app.use(express.static('dist'))

// Endpoints
// Login endpoint.
app.get('/login', (req, res) => {
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${host}/callback`)}`
  res.redirect(loginUrl)
})

// Allow client-side routing.
app.get('*', (req, res) => {
  console.log('[Server] Request: ' + req.hostname)
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = app.listen(port, null, null, () => {
  console.log(`Started server on ${host}.`)
})

function send(ws, type = 'none', data = {}) {
  data.type = data.type ?? type
  ws.sendUTF(JSON.stringify(data))
}

const guilds = {}
const userConnections = {}
const clientConnections = {}

const wss = new WebSocketServer({ httpServer: server })
wss.on('request', (request) => {
  // User WebSocket.
  if (request.origin === host) {
    const ws = request.accept(null, request.origin)

    let guildId, userId

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)
      console.log(data)

      // Return client guilds if guild is not set
      if (data.type == 'requestClientGuilds') {
        console.log(guilds)
        send(ws, 'clientGuilds', { guilds: guilds })
        return
      }

      // Verify and store user connection
      if (!data.guildId || !data.userId) { return }
      userConnections[data.guildId] = { ...userConnections[data.guildId], [data.userId]: ws }
      guildId = data.guildId
      userId = data.userId

      // Forward data to client
      const clientWs = clientConnections[data.clientId]
      if (!clientWs) { return }
      send(clientWs, data.type, data)
    })

    ws.on('close', (reasonCode, description) => {
      console.log(`WebSocket closed with reason: ${reasonCode} | ${description}`)
      // delete userConnections[guildId][userId]
      // if (Object.keys(userConnections[guildId]).length === 0) { delete userConnections[guildId] }
    })

    return
  }

  // Client WebSocket.
  if (request.host === 'clients.' + domain && (request.origin === undefined || request.origin === '*')) {
    const ws = request.accept(null, request.origin)

    let clientId

    ws.on('message', (message) => {
      if (message.type !== 'utf8') { return }
      const data = JSON.parse(message.utf8Data)
      console.log('Server received message:')
      console.log(data)

      // Verify and store client connection
      if (!data.clientId) { return }
      clientConnections[data.clientId] = ws
      clientId = data.clientId

      // Update clientData
      if (data.type === 'clientData') {
        data.guilds.forEach((guild) => { guilds[guild] = data.clientId })
        console.log(guilds)
      }

      // Forward data to users
      // noinspection JSUnresolvedVariable
      if (!data.guildId) { return }
      for (const userWs in userConnections[data.guildId]) {
        send(userWs, data.type, data)
      }
    })

    ws.on('close', (reasonCode, description) => {
      console.log(`WebSocket closed with reason: ${reasonCode} | ${description}`)
      delete clientConnections[clientId]
    })

    return
  }
  // Invalid WebSocket request.
  request.reject('Invalid request.')
})
