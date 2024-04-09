/* global PRODUCTION */

import React, { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../WebSocket/websocket.js'
import './dashboard.scss'
import { Sidebar } from './components/Sidebar/sidebar.js'
import { NowPlaying } from './components/NowPlaying/nowplaying.js'
import { Queue } from './components/Queue/queue.js'
import { MediaSession } from './components/MediaSession/mediasession.js'
import { Start } from './components/Start/start.js'
import { Background } from '../Background/background.js'
import { Servers } from './components/Servers/servers.js'
import { Loader } from '../Loader/loader.js'
import { useDiscordLogin } from '../../utilities/loginHook.js'

const playerObject = {
  'guildId': '610498937874546699',
  'voiceChannelId': '658690208295944232',
  'textChannelId': '658690163290931220',
  'paused': false,
  'volume': 50,
  'position': 48660,
  'repeatMode': 'off',
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
      }
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
  const webSocketContext = useContext(WebSocketContext)
  const [player, setPlayer] = useState(!PRODUCTION ? playerObject : null)
  const [guildClientMap, setGuildClientMap] = useState({})
  const [activeTab, setActiveTab] = useState(0)

  // WebSocket Effect
  useEffect(() => {
    const webSocket = webSocketContext.webSocket
    if (!webSocket || !user) { return }

    function onMessage(message) {
      const data = JSON.parse(message?.data)
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'guildClientMap') {
        setGuildClientMap(data.map)
      } else if (data.type === 'playerData') {
        setPlayer(data.player)
      }
    }

    function onClose() {
      setPlayer(null)
    }

    webSocket.addEventListener('message', onMessage)
    webSocket.addEventListener('close', onClose)

    return () => {
      webSocket.removeEventListener('message', onMessage)
      webSocket.removeEventListener('close', onClose)
    }
  }, [webSocketContext, user, player?.guildId])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} hasPlayer={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userGuilds={user?.guilds} guildClientMap={guildClientMap}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} guildId={player?.guildId} current={player?.queue?.current} tracks={player?.queue?.tracks ?? []}/>
  ]

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} hasPlayer={!!player}/>
      <div className={'sidebar-margin'}>
        {!user ? <div className={'flex-container'} style={{ height: '100%' }}><Loader/></div> : tabs[activeTab]}
      </div>
      <MediaSession guildId={player?.guildId} track={player?.queue?.current} paused={player?.paused}/>
    </div>
  )
}
