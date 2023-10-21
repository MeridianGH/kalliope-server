import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const WebsocketContext = createContext(null)

export function WebsocketProvider({ children }) {
  const [websocket, setWebsocket] = useState(null)

  useEffect(() => {
    const ws = new WebSocket(`wss://${location.host}`)
    setWebsocket(ws)
    return () => { ws.close(1001, 'Remote peer navigated away from page.') }
  }, [])

  return (
    <WebsocketContext.Provider value={websocket}>
      {children}
    </WebsocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
