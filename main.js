import express from 'express'
import { server as WebSocketServer } from 'websocket'

const app = express()

const port = 80
const domain = 'kalliope.xyz'
const host = 'http://' + domain

// Bundle folder
app.use(express.static('src'))

// Endpoint
app.get('*', (req, res) => {
  console.log('[Server] Request: ' + req.hostname)
  res.sendFile('src/index.html')
})

const server = app.listen(port, null, null, () => {
  console.log(`Started server on ${host}:${port}.`)
})

function send(ws, type = 'none', data = {}) {
  data.type = data.type ?? type
  ws.sendUTF(JSON.stringify(data))
}

const clientData = {}
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

      // Verify and store user connection
      // noinspection JSUnresolvedVariable
      if (!data.clientId || !data.guildId || !data.userId) { return }
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
      delete userConnections[guildId][userId]
      if (Object.keys(userConnections[guildId]).length === 0) { delete userConnections[guildId] }
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
        clientData[data.clientId] = { guilds: data.guilds, users: data.users }
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
