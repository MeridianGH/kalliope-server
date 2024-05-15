import React, { useContext, useEffect, useState } from 'react'
import { GuildClientMapType, Nullable, Player, PlayerListType, ServerMessage } from '../../types/types'
import { useDiscordLogin } from '../../hooks/discordLoginHook'
import { WebSocketContext } from '../../contexts/websocketContext'
import { useToasts } from '../../hooks/toastHook'
import { useMediaSession } from '../../hooks/mediaSessionHook'
import { Sidebar } from './Sidebar/sidebar'
import { NowPlaying } from './NowPlaying/nowplaying'
import { Queue } from './Queue/queue'
import { Start } from './Start/start'
import { Background } from '../Background/background'
import { Servers } from './Servers/servers'
import { Loader } from '../Loader/loader'
import './dashboard.scss'

const playerObject: Player = {
  'guildId': '610498937874546699',
  'voiceChannelId': '658690208295944232',
  'textChannelId': '658690163290931220',
  'paused': false,
  'volume': 50,
  'position': 10000,
  'repeatMode': 'off',
  'settings': {
    'sponsorblock': true,
    'sponsorblockSupport': true
  },
  'queue': {
    'tracks': [
      {
        'info': {
          'identifier': 'bgyO9bNbfb8',
          'title': 'Jim Yosef x RIELL - Hate You (Official Lyric Video)',
          'author': 'Jim Yosef',
          'duration': 200000,
          'artworkUrl': 'https://i.ytimg.com/vi/bgyO9bNbfb8/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=bgyO9bNbfb8',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'requester': {
          'displayName': 'Meridian',
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      }
    ],
    'current': {
      'info': {
        'identifier': 'QQX2hpmtMJs',
        'title': 'Jim Yosef x RIELL - Animal (Lyric Video)',
        'author': 'Jim Yosef',
        'duration': 177000,
        'artworkUrl': 'https://i.ytimg.com/vi/QQX2hpmtMJs/maxresdefault.jpg',
        'uri': 'https://www.youtube.com/watch?v=QQX2hpmtMJs',
        'sourceName': 'youtube',
        'isSeekable': true,
        'isStream': false,
        'isrc': null
      },
      'requester': {
        'displayName': 'Meridian',
        'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
      },
      'segments': null
    }
  },
  'filters': {
    'current': 'none',
    'timescale': 1
  }
}

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'

  const user = useDiscordLogin()
  const webSocket = useContext(WebSocketContext)
  const toasts = useToasts()
  const [player, setPlayer] = useState<Nullable<Player>>(!PRODUCTION ? playerObject : null)
  const [guildClientMap, setGuildClientMap] = useState<Nullable<GuildClientMapType>>(null)
  const [playerList, setPlayerList] = useState<Nullable<PlayerListType>>(null)
  const [activeTab, setActiveTab] = useState(0)

  useMediaSession(player?.guildId, player?.queue.current, player?.paused)

  // WebSocket Effect
  useEffect(() => {
    if (!webSocket || !user?.id) { return }

    function onMessage(message: MessageEvent) {
      const data: ServerMessage = JSON.parse(message?.data)
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'guildClientMap') {
        setGuildClientMap(data.map)
      } else if (data.type === 'playerList') {
        setPlayerList(new Set(data.list))
      } else if (data.type === 'playerData') {
        setPlayer(data.player)
        if (user?.id && data.responseTo?.userId === user.id) {
          let toast = ''
          switch (data.responseTo.type) {
            case 'play':
              toast = `Successfully added "${data.player.queue.tracks.at(-1)?.info.title}" to the queue.`
              break
          }
          if (toast !== '') { toasts.success(toast) }
        }
      }
    }

    function onClose() {
      setGuildClientMap(null)
      setPlayerList(null)
      setPlayer(null)
    }

    webSocket.addEventListener('message', onMessage)
    webSocket.addEventListener('close', onClose)

    return () => {
      webSocket.removeEventListener('message', onMessage)
      webSocket.removeEventListener('close', onClose)
    }
  }, [toasts, user?.id, webSocket])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} hasPlayer={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userGuilds={user?.guilds} guildClientMap={guildClientMap} playerList={playerList}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} guildId={player?.guildId} current={player?.queue?.current} tracks={player?.queue?.tracks ?? []} settings={player?.settings}/>
  ]

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} hasPlayer={!!player}/>
      <div className={'sidebar-margin'}>
        {!user ? <div className={'flex-container'} style={{ height: '100%' }}><Loader/></div> : tabs[activeTab]}
      </div>
    </div>
  )
}
