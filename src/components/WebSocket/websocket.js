import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const WebsocketContext = createContext(null)

export function WebsocketProvider({ children }) {
  const [websocket, setWebsocket] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}`)
    setWebsocket(ws)

    function closeWs() { ws.close(1000, 'WebSocket was closed by user.') }
    window.addEventListener('unload', closeWs)
    return () => { closeWs() }
  }, [])

  return (
    <WebsocketContext.Provider value={websocket}>
      {children}
    </WebsocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
