// noinspection JSUnresolvedVariable

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MediaSession } from './components/MediaSession/mediasession.js'
import { NowPlaying } from './components/NowPlaying/nowplaying.js'
import { Queue } from './components/Queue/queue.js'

export function Player({ player }) {
  const [position, setPosition] = useState(player.position)
  useEffect(() => {
    setPosition(player.position)
    const interval = setInterval(() => {
      if (player && !player.paused && player.current) {
        setPosition((prevPosition) => {
          if (prevPosition >= player.current.duration) {
            clearInterval(interval)
            return player.current.duration
          }
          return prevPosition + 1000
        })
      }
    }, 1000 * (1 / player?.timescale ?? 1))

    return () => { clearInterval(interval) }
  }, [player])

  if (!player?.current) {
    return (
      <div className={'flex-container'}>
        <p style={{ marginTop: '15vh' }}>Nothing currently playing!<br/>Join a voice channel and type &quot;/play&quot; to get started!</p>
      </div>
    )
  }
  return (
    <div className={'flex-container'}>
      <MediaSession track={player.current} paused={player.paused}/>
      <NowPlaying track={player.current} paused={player.paused} position={position} repeatMode={player.repeatMode} initialVolume={player.volume}/>
      <Queue tracks={player.queue}/>
    </div>
  )
}

Player.propTypes = { player: PropTypes.object.isRequired }
