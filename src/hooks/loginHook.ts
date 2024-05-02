import { Routes } from 'discord-api-types/v10'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { User } from '../types/types'

export function useDiscordLogin() {
  // @ts-expect-error JSON.parse() correctly handles null values and returns null
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem('user')))
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (user) {
      history.replaceState(null, '', location.href.split('?')[0])
      return
    }

    const token = searchParams.get('token')
    const type = searchParams.get('type')
    if (!token) {
      setTimeout(() => {
        window.location.replace(window.location.origin + '/login')
      }, 3000)
      return
    }

    async function fetchUser() {
      if (!token) { return window.location.replace(window.location.origin + '/login') }

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
    fetchUser().catch(() => { window.location.replace(window.location.origin + '/login') })
  }, [searchParams, user])

  return user
}
