// noinspection JSUnresolvedVariable

import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { WebsocketContext } from '../../../WebSocket/websocket.js'
import { Thumbnail } from '../Thumbnail/thumbnail.js'
import { FastAverageColor } from 'fast-average-color'
import './nowplaying.css'

function msToHMS(ms) {
  let totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600).toString()
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60).toString()
  const seconds = Math.floor(totalSeconds % 60).toString()
  return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function NowPlaying({ track, position, paused, repeatMode, initialVolume }) {
  const websocket = useContext(WebsocketContext)
  const [volume, setVolume] = React.useState(initialVolume)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const element = document.querySelector('.scroll-hint')
      if (!element) { return }
      element.style.opacity = entry.isIntersecting ? '1' : '0'
    }, { threshold: [0.95] })
    observer.observe(document.querySelector('.now-playing-container'))

    const slider = document.querySelector('.volume-slider-input')
    const container = document.querySelector('.volume-slider-container')
    slider.ontouchstart = () => { container.classList.add('active') }
    slider.ontouchend = () => { container.classList.remove('active') }
  }, [])
  useEffect(() => {
    const fac = new FastAverageColor()
    fetch(window.location.origin + '/cors?url=' + encodeURIComponent(track.thumbnail)).then((response) => response.blob()).then((image) => {
      fac.getColorAsync(window.URL.createObjectURL(image), { algorithm: 'dominant', ignoredColor: [[0, 0, 0, 255, 50], [255, 255, 255, 255, 25]] }).then((color) => {
        document.querySelector('.now-playing-container').style.setProperty('--dominant-color', color.hex)
      }).catch((e) => {
        console.warn(e.message)
      })
    })
    return () => { fac.destroy() }
  }, [track])
  return (
    <div className={'now-playing-container flex-container column'}>
      <Thumbnail image={track.thumbnail} size={'35vh'}/>
      <div className={'flex-container nowrap'} style={{ gap: '1em' }}>
        <span>{msToHMS(position)}</span>
        <div className={'progress-container'}>
          <div className={'progress-bar'} style={{ width: `${track.isStream ? '100%' : position / track.duration * 100 + '%'}` }}/>
        </div>
        <span>{!track.isStream ? msToHMS(track.duration) : '🔴 Live'}</span>
      </div>
      <div className={'flex-container column'}>
        <a href={track.uri} rel='noreferrer' target='_blank'><b>{track.title}</b></a>
        <span>{track.author}</span>
      </div>
      <div className={'music-buttons flex-container nowrap'}>
        <button onClick={() => { websocket.sendData('shuffle') }}><i className={'fas fa-random'}/></button>
        <button onClick={() => { websocket.sendData('previous') }}><i className={'fas fa-angle-left'}/></button>
        <button onClick={() => { websocket.sendData('pause') }}><i className={paused ? 'fas fa-play' : 'fas fa-pause'}/></button>
        <button onClick={() => { websocket.sendData('skip') }}><i className={'fas fa-angle-right'}/></button>
        <button onClick={() => { websocket.sendData('repeat') }}><i className={repeatMode === 'none' ? 'fad fa-repeat-alt' : repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}/></button>
      </div>
      <div className={'flex-container column'}>
        <div className={'volume-slider-container'}>
          <input className={'volume-slider-input'} type={'range'} defaultValue={volume.toString()} step={'1'} min={'0'} max={'100'} onInput={(event) => { setVolume(event.target.value) }} onMouseUp={(event) => { websocket.sendData('volume', { volume: event.target.value }) }}/>
          <div className={'volume-slider-range'} style={{ width: `${100 - volume}%`, borderRadius: volume == 0 ? '5px' : '0 5px 5px 0' }}></div>
        </div>
        <div className={'volume-display'}><i className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'}/> {volume}</div>
      </div>
      <a className={'scroll-hint'} href={'#queue'}><i className={'fas fa-chevron-down'}/> Scroll</a>
    </div>
  )
}

NowPlaying.propTypes = {
  track: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired,
  paused: PropTypes.bool.isRequired,
  repeatMode: PropTypes.oneOf(['none', 'track', 'queue']).isRequired,
  initialVolume: PropTypes.number.isRequired
}
