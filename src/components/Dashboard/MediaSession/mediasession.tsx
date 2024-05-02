import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import nearSilence from './near-silence.mp3'
import './mediasession.scss'
import { useToasts } from '../../../hooks/toastHook'

export interface MediaSessionProps {
  guildId?: string,
  track?: Track,
  paused?: boolean
}

export function MediaSession({ guildId, track, paused }: MediaSessionProps) {
  const webSocket = useContext(WebSocketContext)
  const toasts = useToasts()

  useEffect(() => {
    async function playAudio() {
      const audio = document.querySelector('audio')
      try {
        await audio?.play()
        setTimeout(() => audio?.pause(), 100)
      } catch {
        displayAlert()
      }
    }
    function displayAlert() {
      console.warn('Autoplay disabled!')
      toasts.persistent(
        'error',
        'Autoplay disabled! Click this message to enable media notifications or allow autoplay.',
        (toast) => { playAudio().then(() => { toasts.remove(toast.id) }) }
      )
    }

    if (!('mediaSession' in navigator)) {
      displayAlert()
      return
    }

    // const audio = React.createElement('audio', { src: nearSilence, volume: 0.00001 })
    const audio = document.createElement('audio')
    audio.src = nearSilence
    document.querySelector('.media-session')?.appendChild(audio)
    audio.volume = 0.00001
    audio.load()
    // noinspection JSIgnoredPromiseFromCall
    playAudio()
  }, [])
  useEffect(() => {
    function htmlDecode(input: string) { return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent }
    if ('mediaSession' in navigator) {
      if (!webSocket || !guildId || !track) {
        navigator.mediaSession.metadata = null
        return
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        title: htmlDecode(track.info.title) ?? 'Unknown title',
        artist: htmlDecode(track.info.author) ?? 'Unknown artist',
        album: htmlDecode(track.info.author) ?? 'Unknown album',
        artwork: [{ src: htmlDecode(track.info.artworkUrl ?? '') ?? '' }]
      })
      navigator.mediaSession.playbackState = paused ? 'paused' : 'playing'

      navigator.mediaSession.setActionHandler('play', () => { webSocket.sendData('pause', { guildId: guildId }) })
      navigator.mediaSession.setActionHandler('pause', () => { webSocket.sendData('pause', { guildId: guildId }) })
      navigator.mediaSession.setActionHandler('nexttrack', () => { webSocket.sendData('skip', { guildId: guildId }) })
      navigator.mediaSession.setActionHandler('previoustrack', () => { webSocket.sendData('previous', { guildId: guildId }) })
    }
  }, [track, paused, webSocket, guildId])
  return <div className={'media-session'}/>
}

MediaSession.propTypes = {
  guildId: PropTypes.string,
  track: PropTypes.object,
  paused: PropTypes.bool
}
