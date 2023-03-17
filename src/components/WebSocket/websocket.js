import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const WebsocketContext = createContext(null)

export function WebsocketProvider({ children }) {
  const [websocket, setWebsocket] = useState(null)

  useEffect(() => {
    // const ws = new WebSocket(`ws://${location.host}`)
    const ws = {}
    setWebsocket(ws)
    return () => { ws.close() }
  }, [])

  return (
    <WebsocketContext.Provider value={websocket}>
      {children}
    </WebsocketContext.Provider>
  )
}

WebsocketProvider.propTypes = { children: PropTypes.node }
