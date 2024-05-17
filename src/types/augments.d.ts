import { MessageToUser, UserMessage } from './types'

declare global {
  const PRODUCTION: boolean
  const DEV_SERVER: boolean

  export interface WebSocket {
    request(data: UserMessage, awaitResponse?: boolean): Promise<MessageToUser | void>
  }
}
