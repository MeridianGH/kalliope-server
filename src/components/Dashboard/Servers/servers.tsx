import React, { useContext, useEffect } from 'react'
import { GuildClientMapType, Nullable, PlayerListType, User } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Loader } from '../../Loader/loader'
import genericServer from '../../../assets/generic_server.png'
import './servers.scss'

export interface ServersProps {
  setActiveTab: (tab: number) => void,
  userGuilds: Nullable<User['guilds']>,
  guildClientMap: GuildClientMapType,
  playerList: PlayerListType
}

export function Servers({ setActiveTab, userGuilds = [], guildClientMap, playerList }: ServersProps) {
  const webSocket = useContext(WebSocketContext)

  useEffect(() => {
    if (webSocket?.readyState === 1) {
      // Always ask for new playerList in order to allow server to update this connection
      webSocket.request({ type: 'requestPlayerList' })
    }
  }, [webSocket])
  useEffect(() => {
    if (webSocket?.readyState === 1 && !guildClientMap) {
      webSocket.request({ type: 'requestGuildClientMap' })
    }
  }, [webSocket, guildClientMap])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLDivElement>('.server-card-text')
    elements.forEach((element) => {
      const span = element.querySelector<HTMLSpanElement>('span')!
      if (span.offsetWidth > element.offsetWidth) {
        span.style.transitionDuration = `${(1 - element.offsetWidth / span.offsetWidth) * 3}s`
        element.onmouseenter = () => { span.style.marginLeft = element.offsetWidth - span.offsetWidth + 'px' }
        element.onmouseleave = () => { span.style.marginLeft = '0' }
      }
    })
  }, [])

  if (!userGuilds || !guildClientMap) {
    return (
      <div className={'server-container flex-container'}>
        <Loader/>
      </div>
    )
  }

  if (Object.keys(guildClientMap).length === 0) {
    return (
      <div className={'server-container flex-container'}>
        <p>You have no servers in common with any instance of Kalliope.<br/>Host your own instance now using the <a href={'https://github.com/MeridianGH/Kalliope#installation'} className={'underline'}>instructions</a> and make sure it&apos;s properly configured.</p>
      </div>
    )
  }

  return (
    <div className={'server-container flex-container'}>
      {/* eslint-disable-next-line no-extra-parens */}
      {userGuilds.filter((guild) => Object.keys(guildClientMap ?? {}).includes(guild.id)).map((guild, index) => (
        <div
          key={index}
          className={`server-card ${playerList?.has(guild.id) ? 'playing' : ''} flex-container column`}
          onClick={() => {
            webSocket?.request({ type: 'requestPlayerData', guildId: guild.id })
            setActiveTab(2)
          }}
        >
          <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=1024` : genericServer} alt={'Server Icon'}></img>
          <div className={'server-card-text'}><span>{guild.name}</span></div>
        </div>
      ))}
    </div>
  )
}
