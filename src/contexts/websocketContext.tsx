import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useDiscordLogin } from '../hooks/discordLoginHook'
import { toast } from 'react-toastify'
import { MessageToUser, Nullable, UserMessageTypes } from '../types/types'

export const WebSocketContext = createContext<Nullable<WebSocket>>(null)

export function WebsocketProvider({ children }: PropsWithChildren) {
  const [webSocket, setWebSocket] = useState<Nullable<WebSocket>>(null)
  const user = useDiscordLogin()

  useEffect(() => {
    if (DEV_SERVER) { return }
    const ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)

    ws.addEventListener('error', () => {
      toast.error('WebSocket has been closed unexpectedly. Click or close this message to try again.', {
        autoClose: false,
        style: { cursor: 'pointer' },
        onClick: () => { window.location.reload() },
        onClose: () => { window.location.reload() }
      })
    })

    function request(data: UserMessageTypes): void
    function request(data: UserMessageTypes, awaitResponse: true): Promise<MessageToUser>
    function request(data: UserMessageTypes, awaitResponse?: true) {
      const requestId = Date.now() + '-' + Math.floor(Math.random() * 100)
      Object.assign(data, { requestId: requestId, userId: user?.id })

      try {
        if (!PRODUCTION) { console.log('client sent:', data) }
        ws.send(JSON.stringify(data))
      } catch (e) {
        throw `WebSocket request ${requestId} failed with error: ${e}`
      }
      if (!awaitResponse) { return }

      return new Promise((resolve, reject) => {
        const messageListener = (message: MessageEvent<string>) => {
          const data = JSON.parse(message.data) as MessageToUser
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
        }, 30000)
      })
    }
    ws.request = request
    setWebSocket(ws)

    return () => {
      ws.close(1000, 'WebSocket was closed by user.')
    }
  }, [user?.id])

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  )
}
