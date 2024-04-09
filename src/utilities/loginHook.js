import { Routes } from 'discord-api-types/v10'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useDiscordLogin() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [searchParams] = useSearchParams()

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

  return user
}
