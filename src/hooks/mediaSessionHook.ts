import { Track } from '../types/types'
import { useCallback, useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/websocketContext'
import { useToasts } from './toastHook'
import nearSilence from '../assets/near-silence.mp3'

export function useMediaSession(guildId?: string, track?: Track, paused?: boolean) {
  const [hasError, setHasError] = useState<boolean>(false)
  const webSocket = useContext(WebSocketContext)
  const { persistent, warn } = useToasts()

  const displayAlert = useCallback(() => {
    console.warn('Autoplay disabled!')
    persistent(
      'error',
      'Autoplay disabled! Close this message to enable media notifications or enable autoplay for this website in your browser.',
      () => { setHasError(false) }
    )
    return () => {
      setHasError(false)
    }
  }, [persistent])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) { return }
    if (hasError) {
      displayAlert()
      return
    }

    const audio = new Audio(nearSilence)
    audio.volume = 0.00001
    audio.loop = true
    audio.addEventListener('canplaythrough', () => {
      audio.play()
        .then(() => {
          console.info('MediaSession started.')
          // setTimeout(() => audio.pause(), 500)
        })
        .catch(() => {
          setHasError(true)
          audio.remove()
        })
    })
    return () => {
      audio.loop = false
    }
  }, [displayAlert, hasError, track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      warn('Your browser does not support media notifications!')
      return
    }
    if (!webSocket || !guildId || !track) {
      navigator.mediaSession.metadata = null
      return
    }

    const htmlDecode = (input: string) => new DOMParser().parseFromString(input, 'text/html').documentElement.textContent

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
  }, [guildId, paused, track, warn, webSocket])
}
