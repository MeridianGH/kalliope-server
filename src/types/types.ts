import { APIGuild, APIUser } from 'discord-api-types/v10'

export type Nullable<T> = T | null | undefined

export type User = APIUser & { guilds: APIGuild[] }

type ClientData = {
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

export type ClientMessage =
  { type: 'playerData', guildId: string, player: Player } |
  { type: 'clientData', data: ClientData }

type PlayerAction =
  { action: 'pause' | 'previous' | 'shuffle' | 'repeat' | 'autoplay' | 'sponsorblock' | 'clear' } |
  { action: 'skip', payload?: { index: number }} |
  { action: 'remove', payload: { index: number }} |
  { action: 'volume', payload: { volume: number }} |
  { action: 'play', payload: { query: string }} |
  { action: 'filter', payload: { filter: string }}
type RequestPlayerActionMessage = { type: 'requestPlayerAction', guildId: string } & PlayerAction
export type UserMessage =
  { type: 'requestPlayerData' | 'requestClientData' | 'requestClientDataMap' | 'requestGuildClientMap' | 'requestPlayerList' } |
  RequestPlayerActionMessage


export type ServerMessage =
  { type: 'clientDataMap', map: ClientDataMapType } |
  { type: 'guildClientMap', map: GuildClientMapType } |
  { type: 'playerList', list: string[] }

export type MessageToUser = (ServerMessage | ClientMessage) & { requestId: string }
export type MessageToServer = (UserMessage | ClientMessage) & { requestId: string }
export type MessageToClient = (RequestPlayerActionMessage) & { requestId: string }

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
