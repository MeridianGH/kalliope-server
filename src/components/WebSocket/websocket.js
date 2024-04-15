/* global PRODUCTION, DEV_SERVER */

import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDiscordLogin } from '../../utilities/loginHook.js'

/**
 * Type definition for the WebSocket context.
 * @typedef {{ webSocket: WebSocket, setWebSocket: Function } | null} WebsocketContextObject
 */

/**
 * The React Context providing the WebSocket.
 * @type {React.Context<WebsocketContextObject>}
 */
export const WebSocketContext = createContext(null)

export function WebsocketProvider({ children }) {
  const [webSocket, setWebSocket] = useState(null)
  const user = useDiscordLogin()

  useEffect(() => {
    const ws = !DEV_SERVER ? new WebSocket(`ws${PRODUCTION ? 's' : ''}://${location.host}`) : new EventTarget()
    ws.sendData = (type = 'none', guildId, data = {}) => {
      data.type = type
      data.userId = user?.id
      data.guildId = guildId
      if (!PRODUCTION) { console.log('client sent:', data) }
      try {
        if (!DEV_SERVER) { ws.send(JSON.stringify(data)) }
      } catch (error) {
        console.error(error)
      }
    }
    setWebSocket(ws)

    function closeWs() {
      if (!DEV_SERVER) { ws.close(1000, 'WebSocket was closed by user.') }
    }
    window.addEventListener('unload', closeWs, { once: true })
    return closeWs
  }, [user?.id])

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
