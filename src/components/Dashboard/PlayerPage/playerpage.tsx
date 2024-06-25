import React, { useContext, useEffect, useState } from 'react'
import { Nullable, Player } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import './playerpage.scss'
import { Thumbnail } from '../Thumbnail/thumbnail'
import { toast } from 'react-toastify'

type PlayerProps = {
  guildId: Nullable<string>,
  player: Nullable<Player>
}

export function PlayerPage({ guildId, player }: PlayerProps) {
  const webSocket = useContext(WebSocketContext)

  const current = player?.queue.current

  useEffect(() => {
    if (!webSocket || !guildId) { return }
    webSocket.request({ type: 'requestPlayerData', guildId: guildId })
  }, [guildId, webSocket])

  if (!current) { return <></> }

  return (
    <div className={'player-page'}>
      <div className={'server-list'}>

      </div>
    </div>
  )
}
