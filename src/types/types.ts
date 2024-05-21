import { APIGuild, APIUser } from 'discord-api-types/v10'

export type Nullable<T> = T | null | undefined

export type User = APIUser & { guilds: APIGuild[] }

export type ClientData = {
  guilds: string[],
  users: number,
  readyTimestamp: EpochTimeStamp,
  ping: number,
  displayAvatarURL: string,
  displayName: string,
  version: string
}

export type ClientDataMapType = Nullable<{ [clientId: string]: ClientData }>
export type PlayerListType = Nullable<Set<string>>
export type GuildClientMapType = Nullable<{ [guildId: string]: string }>

export type ClientMessageTypes =
  { type: 'playerData', guildId: string, player: Player } |
  { type: 'clientData', clientData: ClientData } |
  { type: 'error', errorMessage: string, guildId?: string }
export type ClientMessage = ClientMessageTypes & { requestId?: string, clientId: string }

type PlayerAction =
  { action: 'pause' | 'previous' | 'shuffle' | 'repeat' | 'autoplay' | 'sponsorblock' | 'clear' } |
  { action: 'skip', payload?: { index: number }} |
  { action: 'remove', payload: { index: number }} |
  { action: 'volume', payload: { volume: number }} |
  { action: 'play', payload: { query: string }} |
  { action: 'filter', payload: { filter: string, filterText: string }}
export type UserMessageTypes =
  { type: 'requestClientDataMap' | 'requestGuildClientMap' | 'requestPlayerList' } |
  { type: 'requestClientData', clientId: string } |
  { type: 'requestPlayerData', guildId: string } |
  { type: 'requestPlayerAction', guildId: string } & PlayerAction
export type UserMessage = UserMessageTypes & { requestId: string, userId: string }


type ServerMessageTypes =
  { type: 'clientDataMap', map: ClientDataMapType } |
  { type: 'guildClientMap', map: GuildClientMapType } |
  { type: 'playerList', list: string[] } |
  { type: 'error', errorMessage: string }
export type ServerMessage = ServerMessageTypes & { requestId: string }

export type MessageToUser = ServerMessage | ClientMessage
export type MessageToServer = UserMessage | ClientMessage
export type MessageToClient = UserMessage

export type Player = {
  timestamp: EpochTimeStamp,
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
