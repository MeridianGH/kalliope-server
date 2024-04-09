import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { WebSocketContext } from '../../../WebSocket/websocket.js'
import './servers.scss'
import genericServer from '../../../../assets/generic_server.png'
import { Loader } from '../../../Loader/loader.js'

export function Servers({ setActiveTab, userGuilds = [], guildClientMap }) {
  const webSocket = useContext(WebSocketContext).webSocket

  useEffect(() => {
    if (webSocket.readyState === 1 && Object.keys(guildClientMap).length === 0) {
      webSocket.sendData('requestGuildClientMap')
    }
  }, [webSocket, guildClientMap])

  useEffect(() => {
    const elements = document.querySelectorAll('.server-card-text')
    elements.forEach((element) => {
      const span = element.querySelector('span')
      if (span.offsetWidth > element.offsetWidth) {
        span.style.transitionDuration = `${(1 - element.offsetWidth / span.offsetWidth) * 3}s`
        element.onmouseenter = () => { span.style.marginLeft = element.offsetWidth - span.offsetWidth + 'px' }
        element.onmouseleave = () => { span.style.marginLeft = '0' }
      }
    })
  }, [])

  if (!userGuilds || Object.keys(guildClientMap).length === 0) {
    return (
      <div className={'server-container flex-container'}>
        <Loader/>
      </div>
    )
  }

  return (
    <div className={'server-container flex-container'}>
      {/* eslint-disable-next-line no-extra-parens */}
      {userGuilds.filter((guild) => Object.keys(guildClientMap).includes(guild.id)).map((guild, index) => (
        <div
          key={index}
          className={'server-card flex-container column'}
          onClick={() => {
            webSocket.sendData('requestPlayerData', guild.id, { clientId: guildClientMap[guild.id] })
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

Servers.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  userGuilds: PropTypes.array,
  guildClientMap: PropTypes.object.isRequired
}
