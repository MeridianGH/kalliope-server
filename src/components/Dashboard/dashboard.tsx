import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { IconContext, SignOut } from '@phosphor-icons/react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { GuildClientMapType, MessageToUser, Nullable, Player, PlayerListType } from '../../types/types'
import { useDiscordLogin } from '../../hooks/discordLoginHook'
import { useWebSocket } from '../../hooks/webSocketHook'
import { useMediaSession } from '../../hooks/mediaSessionHook'
import { Background } from '../Background/background'
import { PlayerBar } from './PlayerBar/playerbar'
import { Servers } from './Servers/servers'
import { Queue } from './Queue/queue'
import { Controls } from './Controls/controls'
import { usePageTitle } from '../../hooks/pageTitleHook'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'
import 'react-loading-skeleton/dist/skeleton.css'
import './dashboard.scss'
import {
  SiBandcamp, SiBandcampHex,
  SiSoundcloud, SiSoundcloudHex,
  SiSpotify, SiSpotifyHex,
  SiTwitch, SiTwitchHex,
  SiVimeo, SiVimeoHex,
  SiYoutube,
  SiYoutubeHex
} from '@icons-pack/react-simple-icons'

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
  const webSocket = useWebSocket()
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
          toast.error(data.errorMessage)
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
      <SkeletonTheme baseColor={'#3f3f3f'} customHighlightBackground={'linear-gradient(to right, #3f3f3f 0%, #484848 80%, #3f3f3f 100%)'}>
        <div className={'dashboard'}>
          <Background style={'transparent'}/>
          <div className={'dashboard-header flex-container space-between nowrap'}>
            <Link to={'/'} className={'dashboard-header-title flex-container'}>
              <img src={kalliopeTransparentPNG} alt={'Logo'}/>
              <span>{'Kalliope.'}</span>
            </Link>
            <div className={'dashboard-header-links flex-container nowrap'}>
              <a href={'https://youtube.com'} target={'_blank'} style={{ backgroundColor: SiYoutubeHex }} rel={'noreferrer'}>
                <SiYoutube size={'1rem'}/>
              </a>
              <a href={'https://spotify.com'} target={'_blank'} className={'source'} style={{ backgroundColor: SiSpotifyHex }} rel={'noreferrer'}>
                <SiSpotify size={'1rem'}/>
              </a>
              <a href={'https://twitch.tv'} target={'_blank'} style={{ backgroundColor: SiTwitchHex }} rel={'noreferrer'}>
                <SiTwitch size={'1rem'}/>
              </a>
              <a href={'https://soundcloud.com'} target={'_blank'} style={{ backgroundColor: SiSoundcloudHex }} rel={'noreferrer'}>
                <SiSoundcloud size={'1rem'}/>
              </a>
              <a href={'https://bandcamp.com'} target={'_blank'} style={{ backgroundColor: SiBandcampHex }} rel={'noreferrer'}>
                <SiBandcamp size={'1rem'}/>
              </a>
              <a href={'https://vimeo.com'} target={'_blank'} style={{ backgroundColor: SiVimeoHex }} rel={'noreferrer'}>
                <SiVimeo size={'1rem'}/>
              </a>
            </div>
            <div className={'dashboard-header-user-container flex-container'}>
              <div className={'dashboard-header-user flex-container nowrap'}>
                {user ? <span>{user.global_name}</span> : <Skeleton width={'5rem'} containerClassName={'skeleton'}/>}
                {user ? <img className={'dashboard-header-icon'} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`} alt={'Avatar'}/> : <Skeleton height={'2rem'} width={'2rem'} circle={true} containerClassName={'skeleton'}/>}
                <a href={'/logout'} className={'dashboard-header-logout flex-container nowrap'}>
                  <SignOut weight={'bold'}/>
                  {'Logout'}
                </a>
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
      </SkeletonTheme>
    </IconContext.Provider>
  )
}
