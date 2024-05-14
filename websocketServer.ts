import { logging } from './utilities/logging.js'
import { ServerOptions, WebSocket, WebSocketServer } from 'ws'
import {
  ClientDataMapType,
  ClientMessage,
  GuildClientMapType,
  Nullable,
  PlayerListType,
  UserMessage
} from './src/types/types'
import 'dotenv/config'

const production = process.argv[2] !== 'development'

type clientConnectionMapType = Nullable<{ [clientId: string]: HeartbeatWebSocket }>
type userConnectionByGuildMapType = Nullable<{ [guildId: string]: { [userId: string]: HeartbeatWebSocket } }>

/**
 * A map containing client data organized by clientId.
 * @description Structure: { clientId: { guilds: string[], users: number } }
 */
const clientDataMap: NonNullable<ClientDataMapType> = {}
/**
 * A map containing the single responsible clientId for each guildId.
 * @description Structure: { guildId: clientId }
 */
const guildClientMap: NonNullable<GuildClientMapType> = {}
/**
 * A list containing all guild IDs with active players.
 */
const playerList: NonNullable<PlayerListType> = new Set<string>()
/**
 * A map containing the respective WebSocket object for each clientId.
 * @description Structure: { clientId: ws }
 */
const clientConnectionMap: NonNullable<clientConnectionMapType> = {}
/**
 * A map containing WebSocket objects for each connected user organized by guildId.
 * @description Structure: { guildId: { userId: WebSocket } }
 */
const userConnectionsByGuildMap: NonNullable<userConnectionByGuildMapType> = {}

class HeartbeatWebSocket extends WebSocket {
  isAlive: boolean

  constructor(...args: unknown[]) {
    // @ts-expect-error Args are simply passed to parent overload constructors
    super(...args)

    this.on('pong', () => {
      this.isAlive = true
    })

    this.on('error', (error) => {
      logging.error(`[WebSocket] Encountered error: ${error}`)
    })
  }
}

class HeartbeatWSServer extends WebSocketServer<typeof HeartbeatWebSocket> {
  constructor(options: ServerOptions<typeof HeartbeatWebSocket>) {
    super({ ...options, WebSocket: HeartbeatWebSocket })

    const heartbeat = setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          logging.warn('[WebSocket] Peer did not respond to heartbeat in 60s. Terminating WebSocket...')
          return ws.terminate()
        }
        ws.isAlive = false
        ws.ping()
      })
    }, 60 * 1000)
    this.on('close', () => {
      clearInterval(heartbeat)
    })
  }
}

export function createWebSocketServer(domain: string) {
  const wsServer = new HeartbeatWSServer({ noServer: true })

  wsServer.on('connection', (ws, req) => {
    ws.isAlive = true

    ws.on('message', (message) => {
      type WebSocketMessage = ClientMessage | UserMessage
      const data: WebSocketMessage = JSON.parse(message.toString())

      function isUserMessage(data: WebSocketMessage): data is UserMessage {
        return data ? req.headers.host === domain : false
      }

      if (isUserMessage(data)) {
        // User WebSocket
        if (!data.userId) { return }

        const websocketGuildId = 'guildId' in data ? data.guildId : 'noGuild'

        // Store user connection
        Object.keys(userConnectionsByGuildMap).forEach((guildId) => {
          if (websocketGuildId === guildId) { return } // Return acts as continue in forEach
          Object.keys(userConnectionsByGuildMap[guildId]).forEach((userId) => {
            if (data.userId === userId) {
              delete userConnectionsByGuildMap[guildId][userId]
              if (Object.keys(userConnectionsByGuildMap[guildId]).length === 0) {
                delete userConnectionsByGuildMap[guildId]
              }
            }
          })
        })
        userConnectionsByGuildMap[websocketGuildId] = { ...userConnectionsByGuildMap[websocketGuildId], [data.userId]: ws }

        // Return clientDataMap
        if (data.type === 'requestClientDataMap') {
          ws.send(JSON.stringify({ type: 'clientDataMap', map: clientDataMap }))
          return
        }
        // Return guildClientMap
        if (data.type === 'requestGuildClientMap') {
          ws.send(JSON.stringify({ type: 'guildClientMap', map: guildClientMap }))
          return
        }
        // Return playerList
        if (data.type === 'requestPlayerList') {
          ws.send(JSON.stringify({ type: 'playerList', list: Array.from(playerList) }))
          return
        }

        // Forward data to client
        const clientWs = clientConnectionMap['clientId' in data ? data.clientId : guildClientMap[websocketGuildId]]
        if (!clientWs) { return }
        clientWs.send(JSON.stringify(data))
      } else if (req.headers.host === 'clients.' + domain) {
        // Client WebSocket
        if (!data.clientId) { return }

        // if (!production) { console.log('received from client:', data) }
        clientConnectionMap[data.clientId] = ws

        const isClientData = (data: ClientMessage): data is ClientMessage<'clientData'> => data.type === 'clientData'
        // Update clientData
        if (isClientData(data)) {
          let changed = false
          if (data.guilds.length > 0) {
            data.guilds.forEach((guildId) => {
              if (guildClientMap[guildId] !== data.clientId) {
                guildClientMap[guildId] = data.clientId
                changed = true
              }
            })
            const { type, clientId, ...clientData } = data
            clientDataMap[data.clientId] = { ...clientDataMap[data.clientId], ...clientData }
          }
          // eslint-disable-next-line dot-notation
          Object.values(userConnectionsByGuildMap['noGuild'] ?? {}).forEach((userWs) => {
            if (changed) { userWs.send(JSON.stringify({ type: 'guildClientMap', map: guildClientMap })) }
            userWs.send(JSON.stringify({ type: 'clientDataMap', map: clientDataMap }))
          })
          return
        }

        const isPlayerData = (data: ClientMessage): data is ClientMessage<'playerData'> => data.type === 'playerData'
        if (isPlayerData(data)) {
          if (data.player) {
            playerList.add(data.guildId)
          } else {
            playerList.delete(data.guildId)
          }
          // eslint-disable-next-line dot-notation
          Object.values(userConnectionsByGuildMap['noGuild'] ?? {}).forEach((userWs) => {
            userWs.send(JSON.stringify({ type: 'playerList', list: Array.from(playerList) }))
          })
        }

        // Forward data to users
        if (!isPlayerData(data) || !userConnectionsByGuildMap[data.guildId]) { return }
        Object.values(userConnectionsByGuildMap[data.guildId]).forEach((userWs) => {
          userWs.send(JSON.stringify(data))
        })
      }
    })

    ws.on('close', (code, reason) => {
      for (const guildId in userConnectionsByGuildMap) {
        const userId = Object.keys(userConnectionsByGuildMap[guildId]).find((key) => userConnectionsByGuildMap[guildId][key] === ws)
        if (userId) {
          if (!production) { logging.info(`[WebSocket] User websocket closed with reason: ${code} | ${reason ?? 'Unknown reason'}`) }
          delete userConnectionsByGuildMap[guildId][userId]
          if (Object.keys(userConnectionsByGuildMap[guildId]).length === 0 && guildId !== 'noGuild') {
            delete userConnectionsByGuildMap[guildId]
          }
          return
        }
      }

      const clientId = Object.keys(clientConnectionMap).find((key) => clientConnectionMap[key] === ws)
      if (clientId) {
        if (!production) { logging.info(`[WebSocket] Client connection closed with reason: ${code} | ${reason ?? 'Unknown reason'}`) }
        delete clientConnectionMap[clientId]
        delete clientDataMap[clientId]
        Object.keys(guildClientMap).forEach((guildId) => {
          if (guildClientMap[guildId] === clientId) { delete guildClientMap[guildId] }
        })
        // eslint-disable-next-line dot-notation
        Object.values(userConnectionsByGuildMap['noGuild'] ?? {}).forEach((userWs) => {
          userWs.send(JSON.stringify({ type: 'guildClientMap', map: guildClientMap }))
          userWs.send(JSON.stringify({ type: 'clientDataMap', map: clientDataMap }))
        })
      }
    })
  })

  return wsServer
}
