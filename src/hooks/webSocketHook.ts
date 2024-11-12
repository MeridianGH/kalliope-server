import { useContext } from 'react'
import { WebSocketContext } from '../contexts/websocketContext'

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}
