import { APIGuild, APIUser } from 'discord-api-types/v10'

export type Nullable<T> = T | null | undefined

export type ClientDataMapType = Nullable<{
  [clientId: string]: {
    guilds: string[],
    users: number,
    readyTimestamp: EpochTimeStamp,
    ping: number,
    displayAvatarURL: string,
    displayName: string,
    version: string
  }
}>
export type PlayerListType = Nullable<Set<string>>
export type GuildClientMapType = Nullable<{ [guildId: string]: string }>

export type User = APIUser & { guilds: APIGuild[] }

type PlayerDataMessage = { type: 'playerData', clientId: string, guildId: string, player: Player, isResponseTo?: string }
type ClientDataMessage = { type: 'clientData', clientId: string, guilds: string[], users: number }
export type ClientMessage = ClientDataMessage | PlayerDataMessage

interface UserServerMessageOptions {
  requestClientDataMap: unknown,
  requestGuildClientMap: unknown,
  requestPlayerList: unknown
}
interface UserClientMessageOptions {
  requestPlayerData: { clientId: string },
  requestClientData: { clientId: string },
  pause: unknown,
  previous: unknown,
  shuffle: unknown,
  repeat: unknown,
  autoplay: unknown,
  sponsorblock: unknown,
  clear: unknown,
  skip: { index?: number },
  remove: { index: number },
  volume: { volume: number },
  play: { query: string },
  filter: { filter: string }
}
export type UserServerMessage<T extends keyof UserServerMessageOptions> = { type: T, userId: string } & UserServerMessageOptions[T]
export type UserClientMessage<T extends keyof UserClientMessageOptions> = { type: T, guildId: string, userId: string } & UserClientMessageOptions[T]
export type UserMessageTypes = keyof UserServerMessageOptions | keyof UserClientMessageOptions
export type UserMessage<T = UserMessageTypes> =
  T extends keyof UserServerMessageOptions ? UserServerMessage<T> :
    T extends keyof UserClientMessageOptions ? UserClientMessage<T> :
      never
type ClientDataMapMessage = { type: 'clientDataMap', map: ClientDataMapType }
type GuildClientMapMessage = { type: 'guildClientMap', map: GuildClientMapType }
type PlayerListMessage = { type: 'playerList', list: string[] }
export type ServerMessage = ClientDataMapMessage | GuildClientMapMessage | PlayerListMessage | ClientMessage

export type Player = {
  guildId: string,
  voiceChannelId: string | null,
  textChannelId: string | null,
  paused: boolean,
  volume: number,
  position: number,
  repeatMode: 'queue' | 'track' | 'off',
  settings: {
    autoplay?: boolean,
    sponsorblock: boolean,
    sponsorblockSupport: boolean
  },
  queue: {
    tracks: Track[],
    current: Track & { segments: [{ start: number, end: number }] | null }
  },
  filters: {
    current: string,
    timescale: number
  }
}

export type Track = {
  info: {
    identifier: string,
    title: string,
    author: string,
    duration: number,
    artworkUrl: string | null,
    uri: string,
    sourceName: 'youtube' | 'youtubemusic' | 'soundcloud' | 'bandcamp' | 'twitch',
    isSeekable: boolean,
    isStream: boolean,
    isrc: string | null
  },
  requester: {
    displayName: string,
    displayAvatarURL: string
  }
}
