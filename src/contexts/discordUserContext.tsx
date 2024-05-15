import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Nullable, User } from '../types/types'
import { useSearchParams } from 'react-router-dom'
import { Routes } from 'discord-api-types/v10'

export const DiscordUserContext = createContext<Nullable<User>>(undefined)

export function DiscordUserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Nullable<User>>(JSON.parse(localStorage.getItem('user') ?? 'null'))
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')
  const type = searchParams.get('type')
  const state = searchParams.get('state')

  const generateState = () => {
    let randomString = ''
    const randomNumber = Math.floor(Math.random() * 10)
    for (let i = 0; i < 20 + randomNumber; i++) {
      randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }
    return randomString
  }

  const requestAuth = useCallback(() => {
    const randomState = generateState()
    localStorage.setItem('oauth-state', JSON.stringify({ state: randomState, redirect: window.location.href }))

    const url = new URL(window.location.origin)
    url.pathname += 'login'
    url.searchParams.set('state', btoa(randomState))
    window.location.replace(url)
  }, [])

  const fetchUser = useCallback(async () => {
    if (!token) {
      console.info('No OAuth token provided. Requesting user authentication...')
      setTimeout(requestAuth, 2000)
      return
    }

    const oauthState = JSON.parse(localStorage.getItem('oauth-state') ?? 'null')
    if (!state || atob(state) !== oauthState.state) { throw 'State does not exist or match stored value.' }

    const discordUser = await fetch('https://discord.com/api' + Routes.user(), {
      method: 'GET',
      headers: { authorization: `${type} ${token}` }
    }).then(async (response) => {
      if (!response.ok) { throw 'Error while fetching user during authentication: ' + (await response.json()).message }
      return response.json()
    })

    const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
      method: 'GET',
      headers: { authorization: `${type} ${token}` }
    }).then(async (response) => {
      if (!response.ok) { throw 'Error while fetching guilds during authentication: ' + (await response.json()).message }
      return response.json()
    })

    if (!discordUser || !guilds) { throw 'Error while authenticating: Failed to fetch user or guild.' }

    discordUser.guilds = guilds
    localStorage.setItem('user', JSON.stringify(discordUser))
    setUser(discordUser)

    window.location.href = oauthState.redirect
  }, [requestAuth, state, token, type])

  useEffect(() => {
    if (user) { return }

    fetchUser().catch((e) => {
      console.error(e)
      requestAuth()
    })
  }, [fetchUser, requestAuth, user])

  return (
    <DiscordUserContext.Provider value={user}>
      {children}
    </DiscordUserContext.Provider>
  )

}
