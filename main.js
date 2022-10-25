import express from 'express'
import { server as WebSocketServer } from 'websocket'

const app = express()

const port = 80
const domain = 'kalliope.xyz'
const host = 'http://' + domain

// Endpoint
app.get('*', (req, res) => {
    console.log('[Server] Request: ' + req.hostname)
    res.json({ type: 'test' })
})

const server = app.listen(port, null, null, () => {
    console.log(`Started server on ${host}:${port}.`)
})

const userConnections = {}
const clientConnections = {}
const playerStates = {}
const wss = new WebSocketServer({ httpServer: server })
wss.on('request', (request) => {
    // User WebSocket.
    if (request.origin === host) {
        const ws = request.accept(null, request.origin)

        ws.on('message', (message) => {
            if (message.type !== 'utf8') { return }
            const data = JSON.parse(message.utf8Data)
            console.log(data)

            // Fetch guild, user and queue
            const guild = client.guilds.cache.get(data.guildId)
            if (!guild) { return ws.close() }
            const user = await client.users.cache.get(data.userId)
            if (!user) { return ws.close() }
            const player = client.lavalink.getPlayer(guild.id)
            if (!player) { return send(ws, {}) }

            userConnections[data.guildId] = { ...userConnections[data.guildId], [data.userId]: ws }
            ws.sendUTF({ server: 'serverMessageEvent' })
        })

        return
    }
    // Client WebSocket.
    if (request.host === 'clients.' + domain && (request.origin === undefined || request.origin === '*')) {
        const ws = request.accept(null, request.origin)

        ws.on('message', (message) => {
            if (message.type !== 'utf8') { return }
            const data = JSON.parse(message.utf8Data)
            console.log(data)

            clientConnections[data.clientId] = ws
            ws.sendUTF(JSON.stringify({ type: 'serverMessageEvent' }))
        })

        ws.on('close', (reasonCode, description) => {

        })

        return
    }
    // Invalid WebSocket request.
    request.reject('Invalid request.')
})
