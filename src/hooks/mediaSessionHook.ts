import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Track } from '../types/types'
import { WebSocketContext } from '../contexts/websocketContext'
import nearSilence from '../assets/near-silence.mp3'

export function useMediaSession(guildId?: string, track?: Track, paused?: boolean) {
  const [hasError, setHasError] = useState<boolean>(false)
  const webSocket = useContext(WebSocketContext)

  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) { return }
    if (hasError) {
      console.warn('Autoplay disabled!')
      document.addEventListener('click', () => { setHasError(false) }, { once: true })
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
  }, [hasError, track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      toast.warn('Your browser does not support media notifications!')
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

    navigator.mediaSession.setActionHandler('play', () => { webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'pause' }) })
    navigator.mediaSession.setActionHandler('pause', () => { webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'pause' }) })
    navigator.mediaSession.setActionHandler('nexttrack', () => { webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'skip' }) })
    navigator.mediaSession.setActionHandler('previoustrack', () => { webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'previous' }) })
  }, [guildId, paused, track, webSocket])
}
