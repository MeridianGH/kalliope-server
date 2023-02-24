/* eslint-disable react/prop-types */
import React, { createContext } from 'react'

const websocket = new WebSocket(`ws://${location.host}`)
websocket.sendData = (type = 'none', data = {}) => {
  data.type = data.type ?? type
  websocket.send(JSON.stringify(data))
}
export const WebsocketContext = createContext(websocket)

export function WebsocketProvider({ children }) {
  return (
    <WebsocketContext.Provider value={websocket}>
      {children}
    </WebsocketContext.Provider>
  )
}
