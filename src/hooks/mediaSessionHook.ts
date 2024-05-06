import { Track } from '../types/types'
import { useCallback, useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/websocketContext'
import { useToasts } from './toastHook'
import nearSilence from '../assets/near-silence.mp3'

export function useMediaSession(guildId?: string, track?: Track, paused?: boolean) {
  const [hasError, setHasError] = useState<boolean>(false)
  const webSocket = useContext(WebSocketContext)
  const toasts = useToasts()

  const displayAlert = useCallback(() => {
    console.warn('Autoplay disabled!')
    const toast = toasts.persistent(
      'error',
      'Autoplay disabled! Close this message to enable media notifications or enable autoplay for this website in your browser.'
    )
    return () => {
      toasts.remove(toast)
      setHasError(false)
    }
  }, [toasts])

  useEffect(() => {
    if (hasError) { return displayAlert() }
  }, [hasError])

  useEffect(() => {
    if (!('mediaSession' in navigator)) { return displayAlert() }

    const audio = new Audio(nearSilence)
    audio.volume = 0.00001
    audio.play()
      .catch(() => {
        setHasError(true)
      })
      .then(() => {
        setTimeout(() => audio.pause(), 100)
      })
  }, [displayAlert])
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
}
