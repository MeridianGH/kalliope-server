import React, { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { Id, toast } from 'react-toastify'
import { MessageToUser, Nullable, UserMessageTypes } from '../types/types'
import useDiscordLogin from '../hooks/discordLoginHook'

export const WebSocketContext = createContext<Nullable<WebSocket>>(null)

export default function WebsocketProvider({ children }: PropsWithChildren) {
  const [webSocket, setWebSocket] = useState<Nullable<WebSocket>>(null)
  const reloadingToast = useRef<Nullable<Id>>(null)
  const user = useDiscordLogin()

  const connectSocket = useCallback(() => {
    if (!user) { return null }
    const ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}${!PRODUCTION ? '/dev' : ''}`)

    function request(data: UserMessageTypes): void
    function request(data: UserMessageTypes, awaitResponse: true): Promise<MessageToUser>
    function request(data: UserMessageTypes, awaitResponse?: true) {
      const requestId = Date.now() + '-' + Math.floor(Math.random() * 100)
      Object.assign(data, { requestId: requestId, userId: user!.id })

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

    ws.addEventListener('open', () => {
      setWebSocket(ws)
      if (reloadingToast.current) {
        toast.update(reloadingToast.current, { type: 'success', render: 'WebSocket reconnected successfully.', isLoading: false, autoClose: 5000 })
        reloadingToast.current = null
      }
    })
    ws.addEventListener('close', (event) => {
      setWebSocket(null)
      if (event.code === 1000) { return }

      connectSocket()
      if (!reloadingToast.current) { reloadingToast.current = toast.loading('WebSocket has been closed unexpectedly. Reconnecting...') }
    })
    return ws
  }, [user])

  useEffect(() => {
    const ws = connectSocket()
    if (!ws) {
      return () => {
        if (reloadingToast.current) { toast.dismiss(reloadingToast.current) }
      }
    }

    const close = () => {
      ws.close(1000, 'WebSocket was closed by user.')
      if (reloadingToast.current) { toast.dismiss(reloadingToast.current) }
    }
    window.addEventListener('beforeunload', close)
    return () => {
      window.removeEventListener('beforeunload', close)
      close()
    }
  }, [connectSocket])

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  )
}
