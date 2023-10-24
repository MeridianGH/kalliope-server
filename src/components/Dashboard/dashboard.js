import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { WebsocketContext } from '../WebSocket/websocket.js'
import { Routes } from 'discord-api-types/v10'
import './dashboard.css'
import { Sidebar } from './components/Sidebar/sidebar.js'
import { NowPlaying } from './components/NowPlaying/nowplaying.js'
import { Queue } from './components/Queue/queue.js'
import { MediaSession } from './components/MediaSession/mediasession.js'
import { Start } from './components/Start/start.js'
import { Background } from '../Background/background.js'
import { Servers } from './components/Servers/servers.js'
import { Loader } from '../Loader/loader.js'

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'

  const websocket = useContext(WebsocketContext)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [player, setPlayer] = useState(null)
  const [clientGuilds, setClientGuilds] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [searchParams] = useSearchParams()

  // WebSocket Effect
  useEffect(() => {
    if (!websocket || !user) { return }
    websocket.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      data.userId = data.userId ?? user.id
      data.guildId = data.guildId ?? player?.guildId ?? null
      try {
        websocket.send(JSON.stringify(data))
      } catch (error) {
        console.error(error)
      }
    }

    websocket.onclose = ({ reasonCode, description }) => {
      console.warn(`WebSocket closed with reason: ${reasonCode} | ${description}`)
      setPlayer(null)
    }
    websocket.onmessage = (message) => {
      const data = JSON.parse(message?.data)
      switch (data.type) {
        case 'clientGuilds': {
          setTimeout(() => {
            setClientGuilds(data.guilds)
          }, Math.floor(Math.random() * 2000 + 1000))
          break
        }
        case 'playerData': {
          setPlayer(data.player)
          break
        }
      }
    }
  }, [websocket, user, player, clientGuilds])
  // Login Effect
  useEffect(() => {
    if (user) {
      history.replaceState(null, '', location.href.split('?')[0])
      return
    }
    const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}`

    const code = searchParams.get('code')
    if (!code) {
      setTimeout(() => {
        window.location.replace(loginUrl)
      }, 3000)
      return
    }

    async function fetchUser() {
      const body = new URLSearchParams({
        'client_id': '1053262351803093032',
        'client_secret': 'z3rbrd_dNS-sR6JJ3UvciefXljqwqv0o',
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': `${location.origin}/dashboard`
      })

      const token = await fetch('https://discord.com/api' + Routes.oauth2TokenExchange(), {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching token while authenticating: ' + e)
      })
      // noinspection JSUnresolvedVariable
      if (!token?.access_token) {
        window.location.replace(loginUrl)
        return
      }

      const discordUser = await fetch('https://discord.com/api' + Routes.user(), {
        method: 'GET',
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching user while authenticating: ' + e)
      })
      const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
        method: 'GET',
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching guilds while authenticating: ' + e)
      })
      if (!discordUser || !guilds) {
        window.location.replace(loginUrl)
        return
      }

      discordUser.guilds = guilds
      localStorage.setItem('user', JSON.stringify(discordUser))
      setUser(discordUser)
    }
    fetchUser().catch(() => { window.location.replace(loginUrl) })
  }, [searchParams, user])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} player={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userId={user?.id} userGuilds={user?.guilds} clientGuilds={clientGuilds}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} tracks={player?.queue?.tracks ?? []}/>
  ]

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} player={!!player}/>
      <div className={'sidebar-margin'}>
        {!user ? <div className={'flex-container'} style={{ height: '100%' }}><Loader/></div> : tabs[activeTab]}
      </div>
      {player?.queue?.current ? <MediaSession track={player.queue.current} paused={player.paused}/> : null}
    </div>
  )
}
