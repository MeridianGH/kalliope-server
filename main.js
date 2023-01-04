import express from 'express'
import { server as WebSocketServer } from 'websocket'
import url from 'url'
import path from 'path'
import { Routes } from 'discord-api-types/v10'
import fetch from 'node-fetch'
import { logging } from './src/utilities/logging.js'

const app = express()

const port = 80
const domain = 'kalliope.xyz'
const host = 'http://' + domain

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Bundle folder
app.use(express.static('src'))

// Endpoints
app.get('/', (req, res) => {
  console.log('[Server] Request: ' + req.hostname)
  res.sendFile(path.resolve(__dirname, './src/endpoints/index/index.html'))
})

// Login endpoint.
app.get('/login', (req, res) => {
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${host}/callback`)}`
  res.redirect(loginUrl)
})

// Callback endpoint.
app.get('/callback', async (req, res) => {
  if (!req.query.code) { return res.redirect('/') }

  const body = new URLSearchParams({ 'client_id': '1053262351803093032', 'client_secret': 'z3rbrd_dNS-sR6JJ3UvciefXljqwqv0o', 'code': req.query.code, 'grant_type': 'authorization_code', 'redirect_uri': `${host}/callback` })
  const token = await fetch('https://discord.com/api' + Routes.oauth2TokenExchange(), { method: 'POST', body: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => response.json()).catch((e) => { logging.warn('Error while fetching token while authenticating: ' + e) })
  console.log(token)
  if (!token?.access_token) { return res.redirect('/login') }

  const user = await fetch('https://discord.com/api' + Routes.user(), { method: 'GET', headers: { authorization: `${token.token_type} ${token.access_token}` } }).then((response) => response.json()).catch((e) => { logging.warn('Error while fetching user while authenticating: ' + e) })
  const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), { method: 'GET', headers: { authorization: `${token.token_type} ${token.access_token}` } }).then((response) => response.json()).catch((e) => { logging.warn('Error while fetching guilds while authenticating: ' + e) })
  if (!user || !guilds) { return res.redirect('/login') }

  user.guilds = guilds
  // req.session.user = user
  console.log(user)

  res.redirect('/')
})

// Logout endpoint.
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
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
