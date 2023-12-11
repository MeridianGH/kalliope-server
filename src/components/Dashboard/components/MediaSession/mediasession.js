import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { WebSocketContext } from '../../../WebSocket/websocket.js'
import './mediasession.scss'
import nearSilence from './near-silence.mp3'

export function MediaSession({ track, paused }) {
  const webSocket = useContext(WebSocketContext).webSocket

  React.useEffect(() => {
    function playAudio() {
      const audio = document.querySelector('audio')
      return audio.play()
        .then(() => { setTimeout(() => audio.pause(), 100) })
        .catch(() => { displayAlert() })
    }
    function displayAlert() {
      console.warn('Autoplay disabled!')
      const div = document.querySelector('.media-session')
      const alert = document.createElement('button')
      alert.classList.add('autoplay-alert', 'flex-container', 'nowrap')
      alert.innerHTML = '<i class="far fa-exclamation-triangle fa-1.5x"></i><span class="autoplay-text">Autoplay seems to be disabled. Enable Media Autoplay or click this message to use media buttons to control the music bot!'
      alert.addEventListener('click', () => { playAudio().then(() => alert.remove()) })
      div.appendChild(alert)
    }

    if (!('mediaSession' in navigator)) {
      displayAlert()
      return
    }

    const audio = document.createElement('audio')
    audio.src = nearSilence
    document.querySelector('.media-session').appendChild(audio)
    audio.volume = 0.00001
    audio.load()
    // noinspection JSIgnoredPromiseFromCall
    playAudio()
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

      navigator.mediaSession.setActionHandler('play', () => { webSocket.sendData('pause') })
      navigator.mediaSession.setActionHandler('pause', () => { webSocket.sendData('pause') })
      navigator.mediaSession.setActionHandler('nexttrack', () => { webSocket.sendData('skip') })
      navigator.mediaSession.setActionHandler('previoustrack', () => { webSocket.sendData('previous') })
    }
  }, [track, paused, webSocket])
  return <div className={'media-session'}/>
}

MediaSession.propTypes = {
  track: PropTypes.object.isRequired,
  paused: PropTypes.bool.isRequired
}
