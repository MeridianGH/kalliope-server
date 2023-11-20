/* global production */

import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Type definition for the WebSocket context.
 * @typedef {{ webSocket: WebSocket, setWebSocket: Function }} WebsocketContextObject
 */

/**
 * The React Context providing the WebSocket.
 * @type {React.Context<WebsocketContextObject>}
 */
export const WebSocketContext = createContext(null)

export function WebsocketProvider({ children }) {
  const [webSocket, setWebSocket] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(`ws${production ? 's' : ''}://${location.host}`)
    setWebSocket(ws)

    function closeWs() { ws.close(1000, 'WebSocket was closed by user.') }
    window.addEventListener('unload', closeWs, { once: true })
    return closeWs
  }, [])

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
