import express from 'express'
import https from 'https'
import http from 'http'
import url from 'url'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import httpProxy from 'http-proxy'
import { WebSocketServer } from 'ws'
import { logging } from './src/utilities/logging.js'
import { Routes } from 'discord-api-types/v10'
import os from 'os'
import 'dotenv/config'

const app = express()
const lavalinkProxy = httpProxy.createProxyServer({ target: 'http://localhost:2333', ws: true })

const production = process.argv[2] !== 'development'

const port = production ? 443 : 80
const domain = production ? 'kalliope.cc' : 'localhost'
const hostname = `http${production ? 's' : ''}://${domain}`

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
  if (req.hostname !== domain) { return res.status(401).end() }
  fetch(req.query.url).then((response) => { response.body.pipe(res) })
})

app.get('/auth', async (req, res) => {
  if (req.hostname !== domain) { return res.status(401).end() }
  if (!req.query.code) { return res.status(400).end() }

  const body = new URLSearchParams({
    'client_id': process.env.clientId,
    'client_secret': process.env.clientSecret,
    'code': req.query.code,
    'grant_type': 'authorization_code',
    'redirect_uri': `${hostname}/auth`
  })

  const token = await fetch('https://discord.com/api' + Routes.oauth2TokenExchange(), {
    method: 'POST',
    body: body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((response) => response.json()).catch((e) => {
    logging.error('[OAuth Req] Error fetching token while authenticating: ' + e)
  })

  res.redirect(`${hostname}/dashboard?token=${token.access_token}&type=${token.token_type}`)
})

// Lavalink endpoint
app.all('/v4/*', (req, res) => {
  if (req.hostname !== 'lavalink.' + domain) { return res.status(401).end() }
  lavalinkProxy.web(req, res)
})

// Main endpoint
app.get('*', (req, res) => {
  if (req.hostname === 'clients.' + domain) { return res.redirect(hostname) }
  if (req.hostname === 'lavalink.' + domain) {
    if (req.path !== '/version' || req.path !== '/metrics') { return res.redirect(hostname) }
    return lavalinkProxy.web(req, res, null, console.log)
  }
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = (production ? https : http).createServer(production ? {
  cert: fs.readFileSync(`${os.homedir()}/.certbot/live/${domain}/fullchain.pem`),
  key: fs.readFileSync(`${os.homedir()}/.certbot/live/${domain}/privkey.pem`)
} : null, app)
  .listen(port, null, null, () => {
    logging.success(`Started server on ${hostname}.`)
  })

const wsServer = new WebSocketServer({ noServer: true })

server.on('upgrade', (request, socket, head) => {
  const { origin, host } = request.headers
  if (host === 'lavalink.' + domain) {
    return lavalinkProxy.ws(request, socket, head)
  }
  if (origin === hostname || host === 'clients.' + domain) {
    return wsServer.handleUpgrade(request, socket, head, (socket) => {
      wsServer.emit('connection', socket, request)
    })
  }
  socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
  socket.destroy()
})

/**
 * A map containing client data organized by clientId.
 * @description Structure: { clientId: { guildIds: string[], userCount: number } }
 * @type {{[key: string]: { guilds: string[], users: number }}}
 */
const clientDataMap = {}
/**
 * A map containing the single responsible clientId for each guildId.
 * @description Structure: { guildId: clientId }
 * @type {{[key: string]: string}}
 */
const guildClientMap = {}
/**
 * A map containing the respective WebSocket object for each clientId.
 * @description Structure: { clientId: ws }
 * @type {{[key: string]: WebSocket}}
 */
const clientConnectionMap = {}
/**
 * A map containing WebSocket objects for each connected user organized by guildId.
 * @description Structure: { guildId: { userId: ws } }
 * @type {{[key: string]: {[key: string]: WebSocket}}}
 */
const userConnectionsByGuildMap = {}

// WebSocket Heartbeat
const heartbeat = setInterval(() => {
  wsServer.clients.forEach((ws) => {
    // noinspection JSUnresolvedReference
    if (!ws.isAlive) { return ws.terminate() }
    ws.isAlive = false
    ws.ping()
  })
}, 60 * 1000)
wsServer.on('close', () => {
  clearInterval(heartbeat)
})

wsServer.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString())

    // User WebSocket
    if (req.headers.host === domain) {
      // Verify and store user connection
      if (!data.userId) { return }
      userConnectionsByGuildMap[data.guildId ?? 'noGuild'] = { ...userConnectionsByGuildMap[data.guildId ?? 'noGuild'], [data.userId]: ws }
      // eslint-disable-next-line dot-notation
      if (data.guildId && Object.keys(userConnectionsByGuildMap['noGuild'] ?? {}).includes(data.userId)) { delete userConnectionsByGuildMap['noGuild'][data.userId] }

      // Return guildClientMap
      if (data.type === 'requestGuildClientMap') {
        ws.send(JSON.stringify({ type: 'guildClientMap', map: guildClientMap }))
        return
      }
      // Return clientDataMap
      if (data.type === 'requestClientDataMap') {
        ws.send(JSON.stringify({ type: 'clientDataMap', map: clientDataMap }))
        return
      }

      // Forward data to client
      const clientWs = clientConnectionMap[data.clientId ?? guildClientMap[data.guildId]]
      if (!clientWs) { return }
      clientWs.send(JSON.stringify(data))
    }

    // Client WebSocket
    if (req.headers.host === 'clients.' + domain) {
      // Verify and store client connection
      if (!data.clientId) { return }
      clientConnectionMap[data.clientId] = ws

      // Update clientData
      if (data.type === 'clientData') {
        data.guilds.forEach((guildId) => {
          guildClientMap[guildId] = data.clientId
        })
        clientDataMap[data.clientId] = { guilds: data.guilds, users: data.users }
        // eslint-disable-next-line dot-notation
        Object.values(userConnectionsByGuildMap['noGuild'] ?? {}).forEach((userWs) => {
          userWs.send(JSON.stringify({ type: 'guildClientMap', map: guildClientMap }))
          userWs.send(JSON.stringify({ type: 'clientDataMap', map: clientDataMap }))
        })
        return
      }

      // Forward data to users
      if (!data.guildId || !userConnectionsByGuildMap[data.guildId]) { return }
      Object.values(userConnectionsByGuildMap[data.guildId]).forEach((userWs) => {
        userWs.send(JSON.stringify(data))
      })
    }
  })

  ws.on('close', (code, reason) => {
    for (const guildId in userConnectionsByGuildMap) {
      const userId = Object.keys(userConnectionsByGuildMap[guildId]).find((key) => userConnectionsByGuildMap[guildId][key] === ws)
      if (userId) {
        logging.info(`[WebSocket] User websocket closed with reason: ${code} | ${reason}`)
        delete userConnectionsByGuildMap[guildId][userId]
        if (Object.keys(userConnectionsByGuildMap[guildId]).length === 0 && guildId !== 'noGuild') {
          delete userConnectionsByGuildMap[guildId]
        }
        return
      }
    }

    const clientId = Object.keys(clientConnectionMap).find((key) => clientConnectionMap[key] === ws)
    if (clientId) {
      logging.info(`[WebSocket] Client connection closed with reason: ${code} | ${reason}`)
      delete clientConnectionMap[clientId]
    }
  })

  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })

  ws.on('error', (error) => {
    logging.error(`[WebSocket] Encountered error: ${error}`)
  })
})
