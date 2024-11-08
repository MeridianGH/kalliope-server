import React, { useContext, useEffect, useState } from 'react'
import { GuildClientMapType, Nullable, PlayerListType } from '../../../types/types'
import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Visualizer } from '../Vizualizer/visualizer'
import { Loader } from '../../Loader/loader'
import { CaretUp, DiscordLogo } from '@phosphor-icons/react'
import genericServer from '../../../assets/generic_server.png'
import './servers.scss'
import { useDiscordLogin } from '../../../hooks/discordLoginHook'

export type ServersProps = {
  guildClientMap: Nullable<GuildClientMapType>,
  playerList: Nullable<PlayerListType>,
  userGuilds: Nullable<RESTAPIPartialCurrentUserGuild[]>,
  guildId: Nullable<string>,
  setGuildId: (id: string) => void
}

export function Servers({ guildClientMap, playerList, userGuilds, guildId, setGuildId }: ServersProps) {
  const user = useDiscordLogin()
  const webSocket = useContext(WebSocketContext)
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = window.matchMedia('screen and (max-width: 768px)').matches

  useEffect(() => {
    if (!user) { return }
    if (webSocket?.readyState === 1) {
      // Always ask for new playerList in order to allow server to update this connection
      webSocket.request({ type: 'requestPlayerList' })
    } else {
      webSocket?.addEventListener('open', () => {
        webSocket.request({ type: 'requestPlayerList' })
      }, { once: true })
    }
  }, [user, webSocket])
  useEffect(() => {
    if (!user || !webSocket) { return }
    if (!guildClientMap) {
      if (webSocket.readyState === 1) {
        webSocket.request({ type: 'requestGuildClientMap' })
      } else {
        webSocket.addEventListener('open', () => {
          webSocket.request({ type: 'requestGuildClientMap' })
        }, { once: true })
      }
    }
  }, [webSocket, guildClientMap, user])

  return (
    <div className={`server-container ${collapsed ? 'collapsed' : ''} flex-container column start nowrap`}>
      <div className={'server-title-container flex-container space-between nowrap'}>
        <div className={'flex-container nowrap'}>
          <DiscordLogo/>
          <h5 className={'server-title'}>{'Your Servers'}</h5>
        </div>
        {isMobile && <button onClick={() => setCollapsed(!collapsed)}><CaretUp style={collapsed ? { rotate: '180deg' } : undefined}/></button>}
      </div>

      {(!userGuilds || !guildClientMap) && <div className={'flex-container'} style={{ width: '100%', height: '100px' }}><Loader/></div>}

      {guildClientMap && Object.keys(guildClientMap).length === 0 && (
        <div className={'flex-container'} style={{ width: '100%' }}>
          <p>{'You have no servers in common with any instance of Kalliope.'}<br/>{'Host your own instance now using the '}<a href={'https://github.com/MeridianGH/kalliope#installation'} className={'underline'}>{'instructions'}</a>{' and make sure it\'s properly configured.'}</p>
        </div>
      )}

      {guildClientMap && userGuilds?.filter((guild) => Object.keys(guildClientMap).includes(guild.id)).map((guild, index) => (
        <div
          key={index}
          className={`server-item ${guildId === guild.id ? 'active' : ''} ${playerList?.has(guild.id) ? 'playing' : ''} flex-container nowrap`}
          onClick={() => { setGuildId(guild.id) }}
        >
          <img
            src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : genericServer}
            alt={'Server Icon'}
            onError={(event) => { event.currentTarget.src = genericServer }}
          />
          <div className={'server-item-text flex-container space-between nowrap'}>
            <span>{guild.name}</span>
            {playerList?.has(guild.id) && <Visualizer style={'white'}/>}
          </div>
        </div>
      ))}
    </div>
  )
}
