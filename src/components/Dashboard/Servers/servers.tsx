import React, { useContext, useEffect } from 'react'
import { GuildClientMapType, Nullable, PlayerListType } from '../../../types/types'
import { APIGuild } from 'discord-api-types/v10'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Visualizer } from '../Vizualizer/visualizer'
import { Loader } from '../../Loader/loader'
import { DiscordLogo } from '@phosphor-icons/react'
import genericServer from '../../../assets/generic_server.png'
import './servers.scss'

type ServersProps = {
  guildClientMap: Nullable<GuildClientMapType>,
  playerList: Nullable<PlayerListType>,
  userGuilds: Nullable<APIGuild[]>,
  guildId: Nullable<string>,
  setGuildId: (id: string) => void
}

export function Servers({ guildClientMap, playerList, userGuilds, guildId, setGuildId }: ServersProps) {
  const webSocket = useContext(WebSocketContext)

  useEffect(() => {
    if (webSocket?.readyState === 1) {
      // Always ask for new playerList in order to allow server to update this connection
      webSocket.request({ type: 'requestPlayerList' })
    } else {
      webSocket?.addEventListener('open', () => {
        webSocket.request({ type: 'requestPlayerList' })
      }, { once: true })
    }
  }, [webSocket])
  useEffect(() => {
    if (!guildClientMap) {
      if (webSocket?.readyState === 1) {
        webSocket.request({ type: 'requestGuildClientMap' })
      } else {
        webSocket?.addEventListener('open', () => {
          webSocket.request({ type: 'requestGuildClientMap' })
        }, { once: true })
      }
    }
  }, [webSocket, guildClientMap])

  console.log(userGuilds, guildClientMap)

  return (
    <div className={'server-container flex-container column start nowrap'}>
      <div className={'flex-container nowrap'}>
        <DiscordLogo/>
        <h5 className={'server-title'}>{'Your Servers'}</h5>
      </div>

      {(!userGuilds || !guildClientMap) && <div className={'flex-container'} style={{ width: '100%', height: '100%' }}><Loader/></div>}

      {guildClientMap && Object.keys(guildClientMap).length === 0 && (
        <div className={'flex-container'} style={{ width: '100%' }}>
          <p>{'You have no servers in common with any instance of Kalliope.'}<br/>{'Host your own instance now using the '}<a href={'https://github.com/MeridianGH/kalliope#installation'} className={'underline'}>{'instructions'}</a>{' and make sure it\'s properly configured.'}</p>
        </div>
      )}

      {userGuilds?.filter((guild) => Object.keys(guildClientMap ?? {}).includes(guild.id)).map((guild, index) => (
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
