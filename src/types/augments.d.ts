import { MessageToUser, UserMessageTypes } from './types'

declare global {
  const PRODUCTION: boolean
  const DEV_SERVER: boolean

  function request(data: UserMessageTypes): void
  function request(data: UserMessageTypes, awaitResponse: true): Promise<MessageToUser>

  export interface WebSocket {
    request: typeof request
  }
}
