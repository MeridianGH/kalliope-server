import React, { Fragment, useEffect, useState } from 'react'
import { useWebSocket } from '../../hooks/webSocketHook'
import { Navbar } from '../Navbar/navbar'
import { Loader } from '../Loader/loader'
import { Background } from '../Background/background'
import { usePageTitle } from '../../hooks/pageTitleHook'
import './statistics.scss'
import { ClientDataMapType, MessageToUser, PlayerListType } from '../../types/types'
import { ArrowsClockwise } from '@phosphor-icons/react'

const clientDataMapObject = {
  '1031853575732740217': {
    guilds: ['610498937874546699'],
    users: 14,
    readyTimestamp: 1712918626950,
    ping: 138,
    displayAvatarURL: 'https://cdn.discordapp.com/avatars/1031853575732740217/5b2bcb5c07565482233ca94d177f9906.webp',
    displayName: 'Kalliope Dev',
    version: '2.0.0'
  }
}

export function Statistics() {
  usePageTitle('Kalliope. | Statistics')
  const webSocket = useWebSocket()
  const [clientDataMap, setClientDataMap] = useState<ClientDataMapType>(DEV_SERVER ? clientDataMapObject : null)
  const [playerList, setPlayerList] = useState<PlayerListType>(new Set())

  useEffect(() => {
    if (!webSocket) { return }

    function onMessage(message: MessageEvent<string>) {
      const data = JSON.parse(message.data) as MessageToUser
      if (!PRODUCTION) { console.log('client received:', data) }
      if (data.type === 'clientDataMap') {
        setClientDataMap(data.map)
      } else if (data.type === 'playerList') {
        setPlayerList(new Set(data.list))
      }
    }

    webSocket.request({ type: 'requestClientDataMap' })
    webSocket.request({ type: 'requestPlayerList' })

    webSocket.addEventListener('message', onMessage)

    return () => {
      webSocket.removeEventListener('message', onMessage)
    }
  }, [webSocket])

  const clientData = Object.values(clientDataMap ?? {})

  return (
    <Fragment>
      <Navbar hideOnMobile={false}/>
      <div className={'stats-background-container'}>
        <Background/>
      </div>
      <div className={'stats-container flex-container column'}>
        <h1>{'Statistics'}</h1>
        <div className={'stats-card'}>
          {clientDataMap === null && <div className={'flex-container column'}><Loader/></div>}
          {!!clientDataMap && clientData.length === 0 && (
            <p>
              {'This server is not managing any instance of Kalliope.'}
              <br/>
              {'Host your own instance now using the '}
              <a href={'https://github.com/MeridianGH/kalliope#installation'} className={'underline'}>{'instructions'}</a>
              {' and make sure it\'s properly configured.'}
            </p>
          )}
          {clientData.length > 0 && (
            <div>
              {'Total guilds: '}
              {clientData.reduce((acc, cur) => cur.guilds.length + acc, 0)}
              <br/>
              {'Total users: '}
              {clientData.reduce((acc, cur) => cur.users + acc, 0)}
              <br/>
              {'Average latency: '}
              {clientData.reduce((acc, cur) => (cur.ping === -1 ? 0 : cur.ping) + acc, 0) / (clientData.filter((data) => data.ping !== -1).length || 1)}
              {'ms'}
              <br/>
              {'Currently playing in '}
              {playerList?.size ?? 0}
              {' '}
              {'guilds.'}
              <br/>
              <br/>
              <div className={'stats-node-grid'}>
                {Object.entries(clientDataMap ?? {}).map(([clientId, data], index) => (
                  <div className={'stats-node-container'} key={index}>
                    <div className={`stats-node ${data.guilds.filter((guildId) => playerList?.has(guildId)).length > 0 ? 'playing' : ''}`} style={{ backgroundImage: `url(${data.displayAvatarURL})` }}/>
                    <div className={'stats-node-tooltip'}>
                      <p>
                        {data.displayName}
                        <br/>
                        {data.version ? 'v' + data.version : 'Unknown version'}
                      </p>
                      <p>
                        {'Guilds: '}
                        {data.guilds.length}
                        <br/>
                        {'Users: '}
                        {' '}
                        {data.users}
                        <br/>
                        {'Latency: '}
                        {data.ping}
                        {'ms'}
                        <br/>
                      </p>
                      <p className={'small-text'}>
                        {'Ready since:'}
                        <br/>
                        {new Date(data.readyTimestamp).toLocaleString()}
                      </p>
                      <button onClick={(event) => {
                        webSocket?.request({ type: 'requestClientData', clientId: clientId })
                        event.currentTarget.firstElementChild!.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 500, easing: 'ease-in-out' })
                      }}
                      >
                        <ArrowsClockwise/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}
