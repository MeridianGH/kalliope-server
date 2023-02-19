import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Routes } from 'discord-api-types/v10'

import './dashboard.css'
import genericServer from '../../assets/generic_server.png'
import { Player } from '../Player/player.js'

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/dashboard`)}`

  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [clientGuilds, setClientGuilds] = useState({})
  const [player, setPlayer] = useState(null)
  const websocket = useRef(null)

  useEffect(() => {
    // WebSocket Effect
    if (!user) { return }
    const ws = new WebSocket(`ws://${location.host}`)

    ws.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      data.userId = user.id
      ws.send(JSON.stringify(data))
    }

    ws.addEventListener('open', () => {
      ws.sendData('requestClientGuilds')
    })
    ws.addEventListener('close', () => {
      console.warn('WebSocket closed.')
    })
    ws.addEventListener('message', (message) => {
      const data = JSON.parse(message?.data)
      console.log('Dashboard received message:')
      console.log(data)
      switch (data.type) {
        case 'clientGuilds': {
          setClientGuilds(data.guilds)
          console.log('Guilds:', data.guilds)
          break
        }
        case 'playerData': {
          setPlayer(data.player)
          console.log('PlayerData:', data.player)
          break
        }
      }
    })

    websocket.current = ws
    return () => { ws.close() }
  }, [user])
  useEffect(() => {
    // Login Effect
    const code = searchParams.get('code')
    if (user) { return }
    if (!code) {
      window.location.replace(loginUrl)
      return
    }

    async function fetchUser() {
      const body = new URLSearchParams({
        'client_id': '1053262351803093032',
        'client_secret': 'z3rbrd_dNS-sR6JJ3UvciefXljqwqv0o',
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': `${location.protocol}//${location.host}/dashboard`
      })

      const token = await fetch('https://discord.com/api' + Routes.oauth2TokenExchange(), {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching token while authenticating: ' + e)
      })
      console.log(token)
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
      console.log(discordUser)
      const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
        method: 'GET',
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching guilds while authenticating: ' + e)
      })
      console.log(guilds)
      if (!discordUser || !guilds) {
        window.location.replace(loginUrl)
        return
      }

      discordUser.guilds = guilds
      localStorage.setItem('user', JSON.stringify(discordUser))
      setUser(discordUser)
    }
    fetchUser().catch((e) => { console.error(e) })
  })
  useEffect(() => {
    // Scrollable Titles Effect
    const elements = document.querySelectorAll('.server-card > span')
    elements.forEach((element) => {
      if (element.offsetWidth < element.scrollWidth) {
        element.style.transitionDuration = `${(1 - element.offsetWidth / element.scrollWidth) * 3}s`
        element.onmouseenter = () => { element.style.marginLeft = 2 * (element.offsetWidth - element.scrollWidth) + 'px' }
        element.onmouseleave = () => { element.style.marginLeft = 0 }
      }
    })
  })

  return (
    player ? <Player initialPlayer={player} websocket={websocket.current}/> :
      user ?
        <div className={'dashboard flex-container'}>
          <h1><i className={'fas fa-th'}/> Select a server...</h1>
          <div className={'server-container flex-container row'}>
            {/* eslint-disable-next-line no-extra-parens */}
            {user.guilds.filter((guild) => Object.keys(clientGuilds).includes(guild.id)).map((guild, index) => (
              <div className={'server-card flex-container column'} key={index} onClick={() => websocket.current.sendData('requestPlayerData', { guildId: guild.id, clientId: clientGuilds[guild.id] })}>
                <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=1024` : genericServer} alt={'Server Icon'}></img>
                <span>{guild.name}</span>
              </div>
            ))}
          </div>
        </div> :
        <div></div>
  )
}
