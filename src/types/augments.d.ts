import { UserMessage, UserMessageTypes } from './types'

declare global {
  const PRODUCTION: boolean
  const DEV_SERVER: boolean

  export interface WebSocket {
    sendData<T extends UserMessageTypes>(type: T, data?: Omit<UserMessage<T>, 'type' | 'userId'>): void
  }
}
