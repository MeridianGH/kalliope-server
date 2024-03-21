/* global PRODUCTION */

import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { WebSocketContext } from '../WebSocket/websocket.js'
import { Routes } from 'discord-api-types/v10'
import './dashboard.scss'
import { Sidebar } from './components/Sidebar/sidebar.js'
import { NowPlaying } from './components/NowPlaying/nowplaying.js'
import { Queue } from './components/Queue/queue.js'
import { MediaSession } from './components/MediaSession/mediasession.js'
import { Start } from './components/Start/start.js'
import { Background } from '../Background/background.js'
import { Servers } from './components/Servers/servers.js'
import { Loader } from '../Loader/loader.js'

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

  const webSocketContext = useContext(WebSocketContext)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [player, setPlayer] = useState(!PRODUCTION ? playerObject : null)
  const [guildClientMap, setGuildClientMap] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [searchParams] = useSearchParams()

  // WebSocket Effect
  useEffect(() => {
    const webSocket = webSocketContext.webSocket
    if (!webSocket || !user) { return }
    webSocket.sendData = (type = 'none', data = {}) => {
      data.type = type
      data.userId = user.id
      data.guildId = player?.guildId ?? data.guildId
      if (!PRODUCTION) { console.log('client sent:', data) }
      try {
        webSocket.send(JSON.stringify(data))
      } catch (error) {
        console.error(error)
      }
    }
    webSocketContext.setWebSocket(webSocket)

    function onMessage(message) {
      const data = JSON.parse(message?.data)
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'guildClientMap') {
        setTimeout(() => {
          setGuildClientMap(data.map)
        }, Math.floor(Math.random() * 2000 + 1000))
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
  // Login Effect
  useEffect(() => {
    if (user) {
      history.replaceState(null, '', location.href.split('?')[0])
      return
    }
    const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/auth')}`

    const token = searchParams.get('token')
    const type = searchParams.get('type')
    if (!token) {
      setTimeout(() => {
        window.location.replace(loginUrl)
      }, 3000)
      return
    }

    async function fetchUser() {
      if (!token) { return window.location.replace(loginUrl) }

      const discordUser = await fetch('https://discord.com/api' + Routes.user(), {
        method: 'GET',
        headers: { authorization: `${type} ${token}` }
      }).then(async (response) => {
        if (!response.ok) { throw (await response.json()).message }
        return response.json()
      }).catch((e) => {
        console.error('Error while fetching user during authentication: ' + e)
      })
      const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
        method: 'GET',
        headers: { authorization: `${type} ${token}` }
      }).then(async (response) => {
        if (!response.ok) { throw (await response.json()).message }
        return response.json()
      }).catch((e) => {
        console.error('Error while fetching guilds during authentication: ' + e)
      })
      if (!discordUser || !guilds) { throw 'Failed to fetch user or guild.' }

      discordUser.guilds = guilds
      localStorage.setItem('user', JSON.stringify(discordUser))
      setUser(discordUser)
    }
    fetchUser().catch(() => { window.location.replace(loginUrl) })
  }, [searchParams, user])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} hasPlayer={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userGuilds={user?.guilds} guildClientMap={guildClientMap}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} current={player?.queue?.current} tracks={player?.queue?.tracks ?? []}/>
  ]

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} hasPlayer={!!player}/>
      <div className={'sidebar-margin'}>
        {!user ? <div className={'flex-container'} style={{ height: '100%' }}><Loader/></div> : tabs[activeTab]}
      </div>
      {player?.queue?.current ? <MediaSession track={player.queue.current} paused={player.paused}/> : null}
    </div>
  )
}
