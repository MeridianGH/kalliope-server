import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Nullable } from '../types/types'
import { useDiscordLogin } from '../hooks/loginHook'

export const WebSocketContext = createContext<Nullable<WebSocket>>(null)

export function WebsocketProvider({ children }) {
  const [webSocket, setWebSocket] = useState<Nullable<WebSocket>>(null)
  const user = useDiscordLogin()

  useEffect(() => {
    if (DEV_SERVER) { return }
    const ws = new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`)
    ws.sendData = (type = 'none', guildId, data = {}) => {
      data.type = type
      data.userId = user?.id
      data.guildId = guildId
      if (!PRODUCTION) { console.log('client sent:', data) }
      try {
        ws.send(JSON.stringify(data))
      } catch (error) {
        console.error(error)
      }
    }
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
