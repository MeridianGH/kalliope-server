import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { GuildClientMapType, MessageToUser, Nullable, Player, PlayerListType } from '../../types/types'
import { useDiscordLogin } from '../../hooks/discordLoginHook'
import { WebSocketContext } from '../../contexts/websocketContext'
import { useMediaSession } from '../../hooks/mediaSessionHook'
import { Background } from '../Background/background'
import { PlayerBar } from './PlayerBar/playerbar'
import { Servers } from './Servers/servers'
import { Queue } from './Queue/queue'
import { Controls } from './Controls/controls'
import { usePageTitle } from '../../hooks/pageTitleHook'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'
import kalliopePNG from '../../assets/kalliope.png'
import './dashboard.scss'
import { IconContext, SignOut } from '@phosphor-icons/react'

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
      },
      {
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
  usePageTitle('Kalliope. | Dashboard')
  const user = useDiscordLogin()
  const webSocket = useContext(WebSocketContext)
  const [guildClientMap, setGuildClientMap] = useState<Nullable<GuildClientMapType>>(null)
  const [playerList, setPlayerList] = useState<Nullable<PlayerListType>>(null)
  const [guildId, setGuildId] = useState<Nullable<string>>(DEV_SERVER ? playerObject.guildId : null)
  const [player, setPlayer] = useState<Nullable<Player>>(DEV_SERVER ? playerObject : null)
  useMediaSession(player?.guildId, player?.queue.current, player?.paused)

  useEffect(() => {
    if (!webSocket || !guildId) { return }
    webSocket.request({ type: 'requestPlayerData', guildId: guildId })
  }, [guildId, webSocket])

  // WebSocket Effect
  useEffect(() => {
    if (!webSocket) { return }

    function onMessage(message: MessageEvent<string>) {
      const data = JSON.parse(message.data) as MessageToUser
      if (!PRODUCTION) { console.log('client received:', data) }
      switch (data.type) {
        case 'guildClientMap':
          setGuildClientMap(data.map)
          break
        case 'playerList':
          setPlayerList(new Set(data.list))
          break
        case 'playerData':
          setPlayer(data.player)
          break
        case 'error':
          toast.error(data.errorMessage, { autoClose: false })
          break
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
  }, [webSocket])

  return (
    <IconContext.Provider value={{ size: '1.5rem' }}>
      <div className={'dashboard'}>
        <Background style={'transparent'}/>
        <div className={'dashboard-header flex-container space-between nowrap'}>
          <Link to={'/'} className={'dashboard-header-title flex-container'}>
            <img src={kalliopeTransparentPNG} alt={'Logo'}/>
            <span>{'Kalliope.'}</span>
          </Link>
          <div className={'dashboard-header-links flex-container nowrap'}>
            <a href={'https://youtube.com'} target={'_blank'} style={{ backgroundColor: '#ff0000' }} rel={'noreferrer'}><i className={'fa-brands fa-youtube'}></i></a>
            <a href={'https://spotify.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#1db954' }} rel={'noreferrer'}><i className={'fa-brands fa-spotify'}></i></a>
            <a href={'https://twitch.tv'} target={'_blank'} style={{ backgroundColor: '#9146ff' }} rel={'noreferrer'}><i className={'fa-brands fa-twitch'}></i></a>
            <a href={'https://soundcloud.com'} target={'_blank'} style={{ backgroundColor: '#ff8800' }} rel={'noreferrer'}><i className={'fa-brands fa-soundcloud'}></i></a>
            <a href={'https://bandcamp.com'} target={'_blank'} style={{ backgroundColor: '#629aa9' }} rel={'noreferrer'}><i className={'fa-brands fa-bandcamp'}></i></a>
            <a href={'https://vimeo.com'} target={'_blank'} style={{ backgroundColor: '#19b7ea' }} rel={'noreferrer'}><i className={'fa-brands fa-vimeo'}></i></a>
          </div>
          <div className={'dashboard-header-user-container flex-container'}>
            <div className={'dashboard-header-user flex-container nowrap'}>
              <img src={user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : kalliopePNG} alt={'Avatar'}/>
              <span>{user?.global_name ?? 'Logging in...'}</span>
              <Link to={'/?logout'} className={'dashboard-header-logout flex-container nowrap'} onClick={() => { localStorage.clear() }}>
                <SignOut weight={'bold'}/>
                {'Logout'}
              </Link>
            </div>
          </div>
        </div>
        <Servers guildClientMap={guildClientMap} playerList={playerList} userGuilds={user?.guilds} guildId={guildId} setGuildId={setGuildId}/>
        <Queue guildId={guildId} tracks={player?.queue.tracks}/>
        <Controls guildId={guildId} filter={player?.filters.current} hasPlayer={!!player}/>
        <PlayerBar
          guildId={guildId}
          current={player?.queue.current}
          position={player?.position}
          volume={player?.volume}
          timescale={player?.filters.timescale}
          paused={player?.paused}
          repeatMode={player?.repeatMode}
          settings={player?.settings}
        />
      </div>
    </IconContext.Provider>
  )
}
