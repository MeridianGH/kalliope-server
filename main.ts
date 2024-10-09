import express, { Request } from 'express'
import { createServer as httpServer } from 'http'
import { createServer as httpsServer } from 'https'
import url from 'url'
import fs from 'fs'
import os from 'os'
import path from 'path'
import fetch from 'node-fetch'
import httpProxy from 'http-proxy'
import { RESTPostOAuth2AccessTokenResult, Routes } from 'discord-api-types/v10'
import { logging } from './utilities/logging.js'
import { findDominantColor, preventSimilarColor } from './utilities/colors.js'
import { createWebSocketServer } from './websocketServer.js'
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
  } catch {
    logging.error('Error decoding URL: ' + req.path.toString())
    return res.redirect(hostname)
  }
  next()
})

// Endpoints
// Login endpoint
app.get('/login', (req, res) => {
  let loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(hostname + '/auth')}`
  if (req.query.state && typeof req.query.state === 'string') { loginUrl += `&state=${req.query.state}` }
  res.redirect(loginUrl.toString())
})

// Authentication endpoint
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/auth', async (req, res) => {
  if (req.hostname !== domain) { return res.status(401).end() }

  if (typeof req.query.token === 'string' && typeof req.query.type === 'string' && typeof req.query.state === 'string') {
    return res.sendFile(path.resolve(__dirname, './dist/index.html'))
  }

  if (typeof req.query.code !== 'string' || typeof req.query.state !== 'string' || typeof req.query.error_description === 'string') {
    const url = new URL(hostname)
    if (typeof req.query.error_description === 'string') { url.searchParams.set('error', req.query.error_description) }
    return res.redirect(url.toString())
  }

  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    logging.error('[OAuth Req] Client ID or secret not set. OAuth will fail.')
  }

  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID ?? '',
    client_secret: process.env.CLIENT_SECRET ?? '',
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: `${hostname}/auth`
  })

  const token = await fetch('https://discord.com/api/v10' + Routes.oauth2TokenExchange(), {
    method: 'POST',
    body: body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((response) => response.json() as Promise<RESTPostOAuth2AccessTokenResult>)
    .catch((e) => {
      logging.error('[OAuth Req] Error fetching token while authenticating: ' + e)
    })

  if (!token) { return res.redirect(`${hostname}/login`) }
  res.redirect(`${hostname}/auth?token=${token.access_token}&type=${token.token_type}&state=${req.query.state}`)
})

// Colors API
const colors: Record<string, string> = {}
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/colors', express.json(), async (req: Request<never, { color: string }, { url: string, preventSimilar?: string }>, res) => {
  if (req.hostname !== domain) { return res.status(401).end() }

  if (!req.body.url?.endsWith('.jpg') && !req.body.url?.endsWith('.png')) { return res.status(400).end() }
  const color = colors[req.body.url] ?? await findDominantColor(req.body.url)
  colors[req.body.url] = color
  const notDark = preventSimilarColor(color, '#121212', true)
  const corrected = preventSimilarColor(notDark, req.body.preventSimilar ?? '#121212', true)
  res.send({ color: corrected })
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
    if (req.path !== '/version' && req.path !== '/metrics') { return res.redirect(hostname) }
    return lavalinkProxy.web(req, res, {}, console.log)
  }
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const server = production ?
  httpsServer({
    cert: fs.readFileSync(`${os.homedir()}/.certbot/live/${domain}/fullchain.pem`),
    key: fs.readFileSync(`${os.homedir()}/.certbot/live/${domain}/privkey.pem`)
  }, app) :
  httpServer({}, app)

server.listen({ port: port }, () => {
  logging.success(`Started server on ${hostname}.`)
})

const wsServer = createWebSocketServer(domain)

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
