import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Nullable, User } from '../types/types'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Routes } from 'discord-api-types/v10'
import { toast } from 'react-toastify'

export const DiscordUserContext = createContext<Nullable<User>>(undefined)

export function DiscordUserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Nullable<User>>(JSON.parse(localStorage.getItem('user') ?? 'null'))
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

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
    localStorage.setItem('oauth-state', JSON.stringify({ state: randomState, redirect: location.pathname }))
    window.location.replace('/login?state=' + btoa(randomState))
  }, [location.pathname])

  const fetchUser = useCallback(async () => {
    const oauthState = JSON.parse(localStorage.getItem('oauth-state') ?? 'null')
    if (!state || atob(state) !== oauthState.state) { throw 'OAuth state is missing or does not match stored value.' }

    const discordUser = await fetch('https://discord.com/api' + Routes.user(), {
      method: 'GET',
      headers: { authorization: `${type} ${token}` }
    }).then(async (response) => {
      if (!response.ok) { throw 'Failed to fetch user info: ' + (await response.json()).message }
      return response.json()
    })

    const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
      method: 'GET',
      headers: { authorization: `${type} ${token}` }
    }).then(async (response) => {
      if (!response.ok) { throw 'Failed to fetch guild info: ' + (await response.json()).message }
      return response.json()
    })

    if (!discordUser || !guilds) { throw 'Failed to fetch user or guild info.' }

    discordUser.guilds = guilds
    localStorage.setItem('user', JSON.stringify(discordUser))
    setUser(discordUser)

    toast.success('Successfully logged in with Discord.')
    navigate(oauthState.redirect, { replace: true })
  }, [navigate, state, token, type])

  useEffect(() => {
    if (user) { return }

    if (!token) {
      console.info('No OAuth token provided. Requesting user authentication...')
      const redirectTimeout = setTimeout(requestAuth, 2000)
      return () => { clearTimeout(redirectTimeout) }
    }

    fetchUser().catch((e) => {
      console.error(e)
      navigate('/?error=' + encodeURIComponent(e))
    })
  }, [fetchUser, navigate, requestAuth, token, user])

  return (
    <DiscordUserContext.Provider value={user}>
      {children}
    </DiscordUserContext.Provider>
  )

}
