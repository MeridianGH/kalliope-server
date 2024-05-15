import React from 'react'
import { Loader } from '../Loader/loader'
import { useDiscordLogin } from '../../hooks/discordLoginHook'

export function Auth() {
  useDiscordLogin()

  return (
    <div className={'flex-container'} style={{ height: '100vh', width: '100vw' }}>
      <Loader/>
    </div>
  )
}
