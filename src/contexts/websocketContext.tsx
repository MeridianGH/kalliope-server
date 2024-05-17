import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MessageToUser, Nullable } from '../types/types'
import { useDiscordLogin } from '../hooks/discordLoginHook'

export const WebSocketContext = createContext<Nullable<WebSocket>>(null)

export function WebsocketProvider({ children }) {
  const [webSocket, setWebSocket] = useState<Nullable<WebSocket>>(null)
  const user = useDiscordLogin()

  useEffect(() => {
    if (DEV_SERVER) { return }
    const ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)

    ws.request = (data, awaitResponse = true) => new Promise((resolve, reject) => {
      const requestId = new Date().getTime() + '-' + Math.floor(Math.random() * 10)
      Object.assign(data, { requestId: requestId })

      try {
        if (!PRODUCTION) { console.log('client sent:', data) }
        ws.send(JSON.stringify(data))
      } catch (e) {
        reject(`WebSocket request ${requestId} failed with error: ${e}`)
        return
      }
      if (!awaitResponse) {
        resolve()
        return
      }

      const messageListener = (message: MessageEvent) => {
        const data: MessageToUser = JSON.parse(message.data)
        if (data.requestId === requestId) {
          clearTimeout(timeout)
          ws.removeEventListener('message', messageListener)
          resolve(data)
        }
      }
      ws.addEventListener('message', messageListener)

      const timeout = setTimeout(() => {
        ws.removeEventListener('message', messageListener)
        reject(`WebSocket request ${requestId} timed out.`)
      })
    })
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
