import { APIGuild, APIUser } from 'discord-api-types/v10'

export type Nullable<T> = T | null | undefined
export type PartialNullable<T> = { [P in keyof T]?: Nullable<T[P]> }

export type clientDataMapType = Nullable<{
  [clientId: string]: {
    guilds: string[]
    users: number
    readyTimestamp: EpochTimeStamp
    ping: number
    displayAvatarURL: string
    displayName: string
    version: string
  }
}>
export type playerListType = Nullable<Set<string>>
export type guildClientMapType = Nullable<{ [guildId: string]: string }>

export type User = APIUser & { guilds: APIGuild[] }

export type WebSocketData = {
  type: string
  userId?: string
  clientId?: string
  guildId?: string
  query?: string
  filter?: string
  index?: number
  volume?: number
}

export type Player = {
  guildId: string
  voiceChannelId: string | null
  textChannelId: string | null
  paused: boolean
  volume: number
  position: number
  repeatMode: 'queue' | 'track' | 'off'
  settings: {
    autoplay?: boolean
    sponsorblock: boolean
    sponsorblockSupport: boolean
  },
  queue: {
    tracks: Track[]
    current: Track & { segments: [{ start: number, end: number }] | null }
  }
  filters: {
    current: string
    timescale: number
  }
}

export type Track = {
  info: {
    identifier: string
    title: string
    author: string
    duration: number
    artworkUrl: string | null
    uri: string
    sourceName: 'youtube' | 'youtubemusic' | 'soundcloud' | 'bandcamp' | 'twitch'
    isSeekable: boolean
    isStream: boolean
    isrc: string | null
  },
  requester: {
    displayName: string
    displayAvatarURL: string
  }
}
