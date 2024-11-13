import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { Nullable, User, UserAPIResult } from '../types/types'
import { useNavigate } from 'react-router-dom'

export const DiscordUserContext = createContext<Nullable<User>>(undefined)

export function DiscordUserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Nullable<User>>(null)
  const navigate = useNavigate()

  const fetchUser = useCallback(async () => {
    const csrfToken = document.cookie.split('; ').find((cookie) => cookie.startsWith('csrf_token='))?.split('=')[1]

    const userResponse = await fetch('/api/user', {
      method: 'GET',
      headers: { 'X-CSRF-Token': csrfToken ?? '' },
      credentials: 'include'
    })
      .then(async (response) => {
        if (response.status === 401) {
          console.info('Requesting user authentication...')
          setTimeout(() => window.location.replace('/login'), 1000)
          return
        }
        const result = await response.json() as UserAPIResult
        if ('error' in result) {
          navigate(`/?error=${encodeURIComponent(result.error)}`)
          return
        }
        if (!response.ok) {
          navigate(`/?error=${encodeURIComponent('Unknown error')}`)
          return
        }
        return result
      })
      .catch(() => {
        navigate(`/?error=${encodeURIComponent('Unknown error')}`)
      })

    if (!userResponse) { return }
    setUser(userResponse)
  }, [navigate])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser])

  return (
    <DiscordUserContext.Provider value={user}>
      {children}
    </DiscordUserContext.Provider>
  )
}
