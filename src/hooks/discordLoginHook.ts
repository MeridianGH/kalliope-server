import { useContext } from 'react'
import { DiscordUserContext } from '../contexts/discordUserContext'

export default function useDiscordLogin() {
  const context = useContext(DiscordUserContext)
  if (context === undefined) {
    throw new Error('useDiscordLogin must be within DiscordUserProvider')
  }
  return context
}
