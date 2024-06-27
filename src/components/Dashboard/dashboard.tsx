import React, { useContext, useEffect, useState } from 'react'
import { GuildClientMapType, MessageToUser, Nullable, Player, PlayerListType } from '../../types/types'
import { useDiscordLogin } from '../../hooks/discordLoginHook'
import { WebSocketContext } from '../../contexts/websocketContext'
import { useMediaSession } from '../../hooks/mediaSessionHook'
import { Background } from '../Background/background'
import './dashboard.scss'
import { ControlBar } from './ControlBar/controlbar'
import { ServerList } from './ServerList/serverlist'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'
import { Link } from 'react-router-dom'
import { Tracks } from './Tracks/tracks'
import { Controls } from './Controls/controls'
import kalliopePNG from '../../assets/kalliope.png'

const playerObject: Player = {
  guildId: '610498937874546699',
  voiceChannelId: '658690208295944232',
  textChannelId: '658690163290931220',
  paused: false,
  volume: 50,
  position: 10000,
  repeatMode: 'off',
  settings: {
    sponsorblock: true,
    sponsorblockSupport: true
  },
  queue: {
    tracks: [
      {
        info: {
          identifier: 'bgyO9bNbfb8',
          title: 'Jim Yosef x RIELL - Hate You (Official Lyric Video)',
          author: 'Jim Yosef',
          duration: 200000,
          artworkUrl: 'https://i.ytimg.com/vi/bgyO9bNbfb8/maxresdefault.jpg',
          uri: 'https://www.youtube.com/watch?v=bgyO9bNbfb8',
          sourceName: 'youtube',
          isSeekable: true,
          isStream: false,
          isrc: null
        },
        requester: {
          displayName: 'Meridian',
          displayAvatarURL: 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      }
    ],
    current: {
      info: {
        identifier: 'QQX2hpmtMJs',
        title: 'Jim Yosef x RIELL - Animal (Lyric Video)',
        author: 'Jim Yosef',
        duration: 177000,
        artworkUrl: 'https://i.ytimg.com/vi/QQX2hpmtMJs/maxresdefault.jpg',
        uri: 'https://www.youtube.com/watch?v=QQX2hpmtMJs',
        sourceName: 'youtube',
        isSeekable: true,
        isStream: false,
        isrc: null
      },
      requester: {
        displayName: 'Meridian',
        displayAvatarURL: 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
      },
      segments: null
    }
  },
  filters: {
    current: 'none',
    timescale: 1
  }
}

export function Dashboard() {
  document.title = 'Kalliope. | Dashboard'

  const user = useDiscordLogin()
  const webSocket = useContext(WebSocketContext)
  const [guildClientMap, setGuildClientMap] = useState<Nullable<GuildClientMapType>>(null)
  const [playerList, setPlayerList] = useState<Nullable<PlayerListType>>(null)
  const [guildId, setGuildId] = useState<Nullable<string>>(null)
  const [player, setPlayer] = useState<Nullable<Player>>(null)
  useMediaSession(player?.guildId, player?.queue.current, player?.paused)

  useEffect(() => {
    if (!webSocket || !guildId) { return }
    webSocket.request({ type: 'requestPlayerData', guildId: guildId })
  }, [guildId, webSocket])

  // WebSocket Effect
  useEffect(() => {
    if (!webSocket || !user?.id) { return }

    function onMessage(message: MessageEvent<string>) {
      const data = JSON.parse(message.data) as MessageToUser
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'guildClientMap') {
        setGuildClientMap(data.map)
      } else if (data.type === 'playerList') {
        setPlayerList(new Set(data.list))
      } else if (data.type === 'playerData') {
        // setGuildId(data.player?.guildId)
        setPlayer(data.player)
      }
    }

    function onClose() {
      setGuildClientMap(null)
      setPlayerList(null)
      setGuildId(null)
      setPlayer(null)
    }

    webSocket.addEventListener('message', onMessage)
    webSocket.addEventListener('close', onClose)

    return () => {
      webSocket.removeEventListener('message', onMessage)
      webSocket.removeEventListener('close', onClose)
    }
  }, [user?.id, webSocket])

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <div className={'dashboard-header flex-container space-between nowrap'}>
        <Link to={'/'} className={'dashboard-header-title flex-container'}>
          <img src={kalliopeTransparentPNG} alt={'Logo'}/>
          <span>{'Kalliope.'}</span>
        </Link>
        <div className={'dashboard-header-links flex-container nowrap'}>
          <a href={'https://youtube.com'} target={'_blank'} style={{ backgroundColor: '#ff0000' }} rel={'noreferrer'}><i className={'fab fa-youtube'}></i></a>
          <a href={'https://spotify.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#1db954' }} rel={'noreferrer'}><i className={'fab fa-spotify'}></i></a>
          <a href={'https://twitch.tv'} target={'_blank'} style={{ backgroundColor: '#9146ff' }} rel={'noreferrer'}><i className={'fab fa-twitch'}></i></a>
          <a href={'https://soundcloud.com'} target={'_blank'} style={{ backgroundColor: '#ff8800' }} rel={'noreferrer'}><i className={'fab fa-soundcloud'}></i></a>
          <a href={'https://bandcamp.com'} target={'_blank'} style={{ backgroundColor: '#629aa9' }} rel={'noreferrer'}><i className={'fab fa-bandcamp'}></i></a>
          <a href={'https://vimeo.com'} target={'_blank'} style={{ backgroundColor: '#19b7ea' }} rel={'noreferrer'}><i className={'fab fa-vimeo'}></i></a>
        </div>
        <div className={'dashboard-header-user flex-container nowrap'}>
          <span>{user?.global_name ?? 'Logging in...'}</span>
          <img src={user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : kalliopePNG} alt={'Avatar'}/>
          <Link to={'/?logout'} className={'dashboard-header-logout flex-container nowrap'} onClick={() => { localStorage.clear() }}>
            <i className={'fad fa-sign-out-alt fa-fw'}></i>
            {'Logout'}
          </Link>
        </div>
      </div>
      <ServerList guildClientMap={guildClientMap} playerList={playerList} userGuilds={user?.guilds} guildId={guildId} setGuildId={setGuildId}/>
      <Tracks guildId={guildId} tracks={player?.queue.tracks}/>
      <Controls guildId={guildId} filter={player?.filters.current}/>
      <ControlBar
        guildId={guildId}
        current={player?.queue.current}
        initialPosition={player?.position}
        initialVolume={player?.volume}
        timescale={player?.filters.timescale}
        paused={player?.paused}
        repeatMode={player?.repeatMode}
        settings={player?.settings}
      />
    </div>
  )
}
