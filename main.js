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
import { config } from './config.js'

const app = express()
const lavalinkProxy = httpProxy.createProxyServer({ target: 'http://localhost:2333', ws: true })

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
  if (req.hostname !== domain) { return res.status(401).end() }
  fetch(req.query.url).then((response) => { response.body.pipe(res) })
})

app.get('/auth', async (req, res) => {
  if (req.hostname !== domain) { return res.status(401).end() }
  if (!req.query.code) { return res.status(401).end(400) }

  const body = new URLSearchParams({
    'client_id': config.clientId,
    'client_secret': config.clientSecret,
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

// Main endpoint
app.get('*', (req, res) => {
  if (req.hostname === 'clients.' + domain) { return res.redirect(hostname) }
  if (req.hostname === 'lavalink.' + domain) {
    if (req.path !== '/metrics') { return res.status(418).send('HTTP/1.1 418 I\'m a Teapot') }
    return lavalinkProxy.web(req, res)
  }
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = (ssl ? https : http).createServer(ssl ? {
  cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain.pem`),
  key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`)
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

const clientGuilds = {}
const clientConnections = {}
const userConnections = { noGuild: {} }

wsServer.on('connection', (ws, req) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString())

    // User WebSocket
    if (req.headers.host === domain) {
      // Verify and store user connection
      if (!data.userId) { return }
      userConnections[data.guildId ?? 'noGuild'] = { ...userConnections[data.guildId ?? 'noGuild'], [data.userId]: ws }
      if (data.guildId && Object.keys(userConnections.noGuild).includes(data.userId)) { delete userConnections.noGuild[data.userId] }

      // Return client guilds
      if (data.type === 'requestClientGuilds') {
        ws.send(JSON.stringify({ type: 'clientGuilds', guilds: clientGuilds }))
        return
      }

      // Forward data to client
      const clientWs = clientConnections[data.clientId ?? clientGuilds[data.guildId]]
      if (!clientWs) { return }
      clientWs.send(JSON.stringify(data))
    }

    // Client WebSocket
    if (req.headers.host === 'clients.' + domain) {
      // Verify and store client connection
      if (!data.clientId) { return }
      clientConnections[data.clientId] = ws

      // Update clientData
      if (data.type === 'clientData') {
        data.guilds.forEach((guild) => {
          clientGuilds[guild] = data.clientId
        })
        Object.values(userConnections.noGuild).forEach((userWs) => {
          userWs.send(JSON.stringify({ type: 'clientGuilds', guilds: clientGuilds }))
        })
        return
      }

      // Forward data to users
      if (!data.guildId || !userConnections[data.guildId]) { return }
      Object.values(userConnections[data.guildId]).forEach((userWs) => {
        userWs.send(JSON.stringify(data))
      })
    }
  })

  ws.on('close', (code, reason) => {
    for (const guildId in userConnections) {
      const userId = Object.keys(userConnections[guildId]).find((key) => userConnections[guildId][key] === ws)
      if (userId) {
        logging.info(`[WebSocket] User websocket closed with reason: ${code} | ${reason}`)
        delete userConnections[guildId][userId]
        if (Object.keys(userConnections[guildId]).length === 0 && guildId !== 'noGuild') {
          delete userConnections[guildId]
        }
        return
      }
    }

    const clientId = Object.keys(clientConnections).find((key) => clientConnections[key] === ws)
    if (clientId) {
      logging.info(`[WebSocket] Client connection closed with reason: ${code} | ${reason}`)
      delete clientConnections[clientId]
    }
  })

  ws.on('error', (error) => {
    logging.error(`[WebSocket] Encountered error: ${error}`)
  })
})
