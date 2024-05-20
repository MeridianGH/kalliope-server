import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MessageToUser, Nullable, UserMessageTypes } from '../types/types'
import { useDiscordLogin } from '../hooks/discordLoginHook'

export const WebSocketContext = createContext<Nullable<WebSocket>>(null)

export function WebsocketProvider({ children }) {
  const [webSocket, setWebSocket] = useState<Nullable<WebSocket>>(null)
  const user = useDiscordLogin()

  useEffect(() => {
    if (DEV_SERVER) { return }
    const ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)

    function request(data: UserMessageTypes): void
    function request(data: UserMessageTypes, awaitResponse: true): Promise<MessageToUser>
    function request(data: UserMessageTypes, awaitResponse?: true) {
      const requestId = new Date().getTime() + '-' + Math.floor(Math.random() * 10)
      Object.assign(data, { requestId: requestId, userId: user?.id })

      try {
        if (!PRODUCTION) { console.log('client sent:', data) }
        ws.send(JSON.stringify(data))
      } catch (e) {
        throw `WebSocket request ${requestId} failed with error: ${e}`
      }
      if (!awaitResponse) { return }

      return new Promise((resolve, reject) => {
        const messageListener = (message: MessageEvent) => {
          const data: MessageToUser = JSON.parse(message.data)
          if (data.requestId === requestId) {
            clearTimeout(timeout)
            ws.removeEventListener('message', messageListener)
            if (data.type === 'error') { reject(data.errorMessage) }
            resolve(data)
          }
        }
        ws.addEventListener('message', messageListener)

        const timeout = setTimeout(() => {
          ws.removeEventListener('message', messageListener)
          reject(`WebSocket request ${requestId} timed out.`)
        })
      })
    }
    ws.request = request
    setWebSocket(ws)

    function closeWs() {
      ws.close(1000, 'WebSocket was closed by user.')
    }
    window.addEventListener('unload', closeWs, { once: true })
    return closeWs
  }, [user?.id])

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
