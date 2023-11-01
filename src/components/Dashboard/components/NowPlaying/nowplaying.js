// noinspection JSUnresolvedVariable

import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { WebsocketContext } from '../../../WebSocket/websocket.js'
import { Thumbnail } from '../Thumbnail/thumbnail.js'
import { FastAverageColor } from 'fast-average-color'
import './nowplaying.scss'

function msToHMS(ms) {
  let totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600).toString()
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60).toString()
  const seconds = Math.floor(totalSeconds % 60).toString()
  return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function NowPlaying({ player }) {
  const websocket = useContext(WebsocketContext)
  const [position, setPosition] = useState(player?.position ?? 0)
  useEffect(() => {
    const current = player?.queue?.current
    if (!current) { return }
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
    }, 1000 * (1 / player.filters.timescale ?? 1))
    return () => { clearInterval(interval) }
  }, [player])
  const [volume, setVolume] = React.useState(player?.volume ?? 50)
  useEffect(() => {
    const slider = document.querySelector('.volume-slider-input')
    if (!slider) { return }

    const container = document.querySelector('.volume-slider-container')
    slider.ontouchstart = () => { container.classList.add('active') }
    slider.ontouchend = () => { container.classList.remove('active') }
  }, [])
  useEffect(() => {
    if (!player?.queue?.current?.info.artworkUrl) { return }
    const fac = new FastAverageColor()
    fetch(window.location.origin + '/cors?url=' + encodeURIComponent(player.queue.current.info.artworkUrl)).then((response) => response.blob()).then((image) => {
      // noinspection JSCheckFunctionSignatures
      fac.getColorAsync(window.URL.createObjectURL(image), { algorithm: 'dominant', ignoredColor: [[0, 0, 0, 255, 50], [255, 255, 255, 255, 25]] }).then((color) => {
        document.querySelector('.now-playing-container').style.setProperty('--dominant-color', color.hex)
      }).catch((e) => { console.warn(e.message) })
    })
    return () => { fac.destroy() }
  }, [player])

  const current = player?.queue?.current
  if (!current) { return <div className={'now-playing-container flex-container'}>Nothing currently playing! Join a voice channel and start playback using &apos;/play&apos;!</div> }
  return (
    <div className={'now-playing-container flex-container column'}>
      <Thumbnail image={current.info.artworkUrl} size={'35vh'}/>
      <div className={'flex-container nowrap'}>
        <span>{msToHMS(position)}</span>
        <div className={'progress-container'}>
          <div className={'progress-bar'} style={{ width: `${current.info.isStream ? '100%' : position / current.info.duration * 100 + '%'}` }}/>
        </div>
        <span>{!current.info.isStream ? msToHMS(current.info.duration) : '🔴 Live'}</span>
      </div>
      <div className={'flex-container column'}>
        <a href={current.info.uri} rel='noreferrer' target='_blank'><b className={'now-playing-title'}>{current.info.title}</b></a>
        <span>{current.info.author}</span>
      </div>
      <div className={'music-buttons flex-container nowrap'}>
        <button onClick={() => { websocket.sendData('shuffle') }}><i className={'fas fa-random'}/></button>
        <button onClick={() => { websocket.sendData('previous') }}><i className={'fas fa-angle-left'}/></button>
        <button onClick={() => { websocket.sendData('pause') }}><i className={player.paused ? 'fas fa-play' : 'fas fa-pause'}/></button>
        <button onClick={() => { websocket.sendData('skip') }}><i className={'fas fa-angle-right'}/></button>
        <button onClick={() => { websocket.sendData('repeat') }}><i className={player.repeatMode === 'off' ? 'fad fa-repeat-alt' : player.repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}/></button>
      </div>
      <div className={'flex-container column'}>
        <div className={'volume-slider-container'}>
          <input className={'volume-slider-input'} type={'range'} defaultValue={volume.toString()} step={'1'} min={'0'} max={'100'} onInput={(event) => { setVolume(event.target.value) }} onMouseUp={(event) => { websocket.sendData('volume', { volume: event.target.value }) }}/>
          <div className={'volume-slider-range'} style={{ width: `${100 - volume}%`, borderRadius: volume === 0 ? '5px' : '0 5px 5px 0' }}></div>
        </div>
        <div className={'volume-display'}><i className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'}/> {volume}</div>
      </div>
    </div>
  )
}

NowPlaying.propTypes = { player: PropTypes.object }
