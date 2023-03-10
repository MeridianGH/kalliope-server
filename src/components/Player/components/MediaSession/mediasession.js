import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { WebsocketContext } from '../../../WebSocket/websocket.js'
import './mediasession.css'
import nearSilence from './near-silence.mp3'

export function MediaSession({ track, paused }) {
  const websocket = useContext(WebsocketContext)

  function displayAlert() {
    console.warn('Autoplay disabled!')
    const div = document.querySelector('.autoplay-alert')
    div.innerHTML = '<i class="far fa-exclamation-triangle fa-1.5x"/><span class="autoplay-text">Autoplay seems to be disabled. Enable Media Autoplay to use media buttons to control the music bot!'
  }

  React.useEffect(() => {
    if ('mediaSession' in navigator) {
      const audio = new Audio(nearSilence)
      audio.volume = 0.00001
      audio.load()
      audio.play().then(() => { setTimeout(() => audio.pause(), 100) }).catch(() => { displayAlert() })
    } else {
      displayAlert()
    }
  }, [])
  React.useEffect(() => {
    function htmlDecode(input) { return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: htmlDecode(track.title),
        artist: htmlDecode(track.author),
        album: htmlDecode(track.author),
        artwork: [{ src: htmlDecode(track.thumbnail) }]
      })
      navigator.mediaSession.playbackState = paused ? 'paused' : 'playing'

      navigator.mediaSession.setActionHandler('play', () => { websocket.sendData('pause') })
      navigator.mediaSession.setActionHandler('pause', () => { websocket.sendData('pause') })
      navigator.mediaSession.setActionHandler('nexttrack', () => { websocket.sendData('skip') })
      navigator.mediaSession.setActionHandler('previoustrack', () => { websocket.sendData('previous') })
    }
  }, [track, paused, websocket])
  return <div className={'autoplay-alert flex-container row nowrap'}/>
}

MediaSession.propTypes = {
  track: PropTypes.object.isRequired,
  paused: PropTypes.bool.isRequired
}
