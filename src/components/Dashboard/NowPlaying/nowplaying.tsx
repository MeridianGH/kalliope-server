import React, { useContext, useEffect, useState } from 'react'
import { Nullable, Player } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Thumbnail } from '../Thumbnail/thumbnail'
import { Visualizer } from '../Vizualizer/visualizer'
import './nowplaying.scss'

function msToHMS(ms: number) {
  let totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600).toString()
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60).toString()
  const seconds = Math.floor(totalSeconds % 60).toString()
  return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export type NowPlayingProps = {
  player: Nullable<Player>
}

export function NowPlaying({ player }: NowPlayingProps) {
  const webSocket = useContext(WebSocketContext)
  const [position, setPosition] = useState(player?.position ?? 0)
  const [volume, setVolume] = useState(player?.volume ?? 50)

  useEffect(() => {
    if (!webSocket || !player?.guildId) { return }
    webSocket.request({ type: 'requestPlayerData', guildId: player.guildId })
  }, [player?.guildId, webSocket])

  useEffect(() => {
    const current = player?.queue.current
    if (!current || !player?.position) { return }
    setPosition(player.position)
    const interval = setInterval(() => {
      if (!player.paused) {
        setPosition((prevPosition) => {
          if (prevPosition >= current.info.duration) {
            clearInterval(interval)
            return current.info.duration
          }
          return prevPosition + 1000
        })
      }
    }, 1000 * (1 / (player.filters.timescale ?? 1)))
    return () => { clearInterval(interval) }
  }, [player?.filters.timescale, player?.paused, player?.position, player?.queue])

  useEffect(() => {
    const slider = document.querySelector<HTMLInputElement>('.volume-slider-input')
    if (!slider) { return }
    const container = document.querySelector<HTMLDivElement>('.volume-slider-container')
    slider.ontouchstart = () => { container?.classList.add('active') }
    slider.ontouchend = () => { container?.classList.remove('active') }
  }, [])

  useEffect(() => {
    if (!player?.queue.current?.info.artworkUrl) { return }

    fetch(window.location.origin + '/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: player?.queue.current.info.artworkUrl,
        preventSimilar: getComputedStyle(document.documentElement).getPropertyValue('--hover')
      })
    }).then((res) => res.json()).then((body: { color?: string }) => {
      document.querySelector<HTMLDivElement>('.now-playing-container')!.style.setProperty('--dominant-color', body.color ?? 'var(--accent)')
    }).catch((error) => console.warn(error))
  }, [player])

  const current = player?.queue.current
  if (!current) {
    return (
      <div className={'now-playing-container flex-container'}>
        <p>{'Nothing currently playing! Join a voice channel and start playback using \'/play\'!'}</p>
      </div>
    )
  }
  return (
    <div className={'now-playing-container flex-container column nowrap'}>
      <Thumbnail image={current.info.artworkUrl} size={'35vh'}/>
      <div className={'flex-container nowrap'}>
        <span>{msToHMS(position)}</span>
        <div className={'progress-container'}>
          <div className={'progress-bar'} style={{ width: `${current.info.isStream ? '100%' : position / current.info.duration * 100 + '%'}` }}/>
        </div>
        <span>{!current.info.isStream ? msToHMS(current.info.duration) : '🔴 Live'}</span>
      </div>
      <div className={'flex-container column'}>
        <a href={current.info.uri} rel={'noreferrer'} target={'_blank'}><b className={'now-playing-title'}>{current.info.title}</b></a>
        <span>{current.info.author}</span>
        <Visualizer style={'color'} color={'var(--dominant-color)'} paused={player?.paused}/>
      </div>
      <div className={'music-buttons flex-container nowrap'}>
        <button onClick={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'shuffle' }) }}><i className={'fas fa-random'}/></button>
        <button onClick={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'previous' }) }}><i className={'fas fa-angle-left'}/></button>
        <button onClick={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'pause' }) }}><i className={player.paused ? 'fas fa-play' : 'fas fa-pause'}/></button>
        <button onClick={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'skip' }) }}><i className={'fas fa-angle-right'}/></button>
        <button onClick={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'repeat' }) }}><i className={player.repeatMode === 'off' ? 'fad fa-repeat-alt' : player.repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}/></button>
      </div>
      <div className={'flex-container column'}>
        <div className={'volume-slider-container'}>
          <input
            className={'volume-slider-input'}
            type={'range'}
            defaultValue={volume.toString()}
            step={'1'}
            min={'0'}
            max={'100'}
            onInput={() => { setVolume(parseInt(document.querySelector<HTMLInputElement>('.volume-slider-input')!.value)) }}
            onMouseUp={() => { webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'volume', payload: { volume: parseInt(document.querySelector<HTMLInputElement>('.volume-slider-input')!.value) } }) }}
          />
          <div className={'volume-slider-range'} style={{ width: `${100 - volume}%`, borderRadius: volume === 0 ? '5px' : '0 5px 5px 0' }}></div>
        </div>
        <div className={'volume-display'}><i className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'}/> {volume}</div>
      </div>
    </div>
  )
}
