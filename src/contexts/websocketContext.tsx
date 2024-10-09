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
    let ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)

    ws.addEventListener('close', (event) => {
      if (event.code === 1000) { return }
      void toast.promise(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)
            ws.addEventListener('open', () => { resolve() }, { once: true })
          }, 1000)
        }),
        {
          pending: 'WebSocket has been closed unexpectedly. Reloading...',
          success: 'Reloaded WebSocket.'
        }
      )
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
        throw new Error(`WebSocket request ${requestId} failed with error: ${e}`)
      }
      if (!awaitResponse) { return }

      return new Promise((resolve, reject) => {
        const messageListener = (message: MessageEvent<string>) => {
          const data = JSON.parse(message.data) as MessageToUser
          if (data.requestId === requestId) {
            clearTimeout(timeout)
            ws.removeEventListener('message', messageListener)
            if (data.type === 'error') { reject(new Error(data.errorMessage)) }
            resolve(data)
          }
        }
        ws.addEventListener('message', messageListener)

        const timeout = setTimeout(() => {
          ws.removeEventListener('message', messageListener)
          reject(new Error(`WebSocket request ${requestId} timed out.`))
        }, 30000)
      })
    }
    ws.request = request
    setWebSocket(ws)

    const close = () => { ws.close(1000, 'WebSocket was closed by user.') }
    window.addEventListener('beforeunload', close)

    return () => {
      window.removeEventListener('beforeunload', close)
      close()
    }
  }, [user?.id])

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  )
}
