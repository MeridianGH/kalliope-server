import { Nullable, PartialNullable, WebSocketData } from './types'

declare global {
  const PRODUCTION: boolean
  const DEV_SERVER: boolean

  export interface WebSocket {
    sendData: (type: string, guildId?: Nullable<string>, data?: PartialNullable<WebSocketData>) => void
  }
}
