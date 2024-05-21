import React, { useContext, useEffect, useState } from 'react'
import { GuildClientMapType, MessageToUser, Nullable, Player, PlayerListType } from '../../types/types'
import { useDiscordLogin } from '../../hooks/discordLoginHook'
import { WebSocketContext } from '../../contexts/websocketContext'
import { useMediaSession } from '../../hooks/mediaSessionHook'
import { Sidebar } from './Sidebar/sidebar'
import { NowPlaying } from './NowPlaying/nowplaying'
import { Queue } from './Queue/queue'
import { Start } from './Start/start'
import { Background } from '../Background/background'
import { Servers } from './Servers/servers'
import { Loader } from '../Loader/loader'
import './dashboard.scss'

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'

  const user = useDiscordLogin()
  const webSocket = useContext(WebSocketContext)
  const [player, setPlayer] = useState<Nullable<Player>>(null)
  const [guildClientMap, setGuildClientMap] = useState<Nullable<GuildClientMapType>>(null)
  const [playerList, setPlayerList] = useState<Nullable<PlayerListType>>(null)
  const [activeTab, setActiveTab] = useState(0)
  useMediaSession(player?.guildId, player?.queue.current, player?.paused)

  // WebSocket Effect
  useEffect(() => {
    if (!webSocket || !user?.id) { return }

    function onMessage(message: MessageEvent) {
      const data: MessageToUser = JSON.parse(message?.data)
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'guildClientMap') {
        setGuildClientMap(data.map)
      } else if (data.type === 'playerList') {
        setPlayerList(new Set(data.list))
      } else if (data.type === 'playerData') {
        setPlayer(data.player)
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
  }, [user?.id, webSocket])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} hasPlayer={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userGuilds={user?.guilds} guildClientMap={guildClientMap} playerList={playerList}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} guildId={player?.guildId} current={player?.queue?.current} tracks={player?.queue?.tracks ?? []} filters={player?.filters} settings={player?.settings}/>
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
