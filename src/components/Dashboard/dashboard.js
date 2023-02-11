import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Routes } from 'discord-api-types/v10'

import './dashboard.css'
import genericServer from '../../assets/generic_server.png'
import { Player } from '../Queue/player.js'

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'
  const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/dashboard`)}`

  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [clientGuilds, setClientGuilds] = useState([])
  const [player, setPlayer] = useState(null)
  const websocket = useRef(null)

  useEffect(() => {
    if (!user) { return }
    websocket.current = new WebSocket(`ws://${location.host}`)

    websocket.current.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      data.userId = user.id
      websocket.current.send(JSON.stringify(data))
    }

    websocket.current.addEventListener('open', () => {
      websocket.current.sendData('requestClientGuilds')
    })
    websocket.current.addEventListener('close', () => {
      console.warn('WebSocket closed.')
    })

    const current = websocket.current
    return () => { current.close() }
  }, [user])
  useEffect(() => {
    if (!websocket.current) { return }
    websocket.current.addEventListener('message', (message) => {
      const data = JSON.parse(message?.data)
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
  })
  useEffect(() => {
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
    const elements = document.querySelectorAll('.server-card > span')
    elements.forEach((element) => {
      if (element.offsetWidth < element.scrollWidth) {
        element.style.transitionDuration = `${(1 - element.offsetWidth / element.scrollWidth) * 3}s`
        element.onmouseenter = () => { element.style.marginLeft = 2 * (element.offsetWidth - element.scrollWidth) + 'px' }
        element.onmouseleave = () => { element.style.marginLeft = 0 }
      }
    })
  })

  return player ? <Player player={player} websocket={websocket.current}/> :
    <div className={'dashboard flex-container'}>
      <h1><i className={'fas fa-th'}/> Select a server...</h1>
      <div className={'server-container flex-container row'}>
        {/* eslint-disable-next-line no-extra-parens */}
        {user.guilds.filter((guild) => clientGuilds.includes(guild.id)).map((guild, index) => (
          <div className={'server-card flex-container column'} key={index}>
            <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}?size=1024` : genericServer} alt={'Server Icon'}></img>
            <span>{guild.name}</span>
          </div>
        ))}
      </div>
    </div>
}
