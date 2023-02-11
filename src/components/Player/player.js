/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

const msToHMS = (ms) => {
  let totalSeconds = ms / 1000
  const hours = Math.floor(totalSeconds / 3600).toString()
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60).toString()
  const seconds = Math.floor(totalSeconds % 60).toString()
  return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export function Player({ initialPlayer, websocket }) {
  const [player, setPlayer] = useState(initialPlayer)
  useEffect(() => {
    const interval = setInterval(() => {
      if (player && !player.paused && player.current && !player.current.isStream) {
        if (player.position >= player.current.duration) {
          clearInterval(interval)
          setPlayer({ ...player, position: player.current.duration })
        } else {
          setPlayer({ ...player, position: player.position += 1000 })
        }
      }
    }, 1000 * (1 / player?.timescale ?? 1))

    return () => {
      clearInterval(interval)
    }
  }, [player])

  if (!player) { return null }
  if (!player.current) { return <div>Nothing currently playing!<br/>Join a voice channel and type &quot;/play&quot; to get started!</div> }
  return (
    <div>
      <MediaSession track={player.current} paused={player.paused} websocket={websocket} />
      <NowPlaying track={player.current} paused={player.paused} position={player.position} repeatMode={player.repeatMode} volume={player.volume} websocket={websocket} />
      <div style={{ marginBottom: '20px' }} />
      <Queue tracks={player.queue} websocket={websocket} />
    </div>
  )
}

function NowPlaying({ track, position, paused, repeatMode, volume, websocket }) {
  return (
    <div>
      <h1 className='queue-title'>Now Playing</h1>
      <div className='nowplaying-container'>
        <ul className='horizontal-list'>
          <li>
            <Thumbnail image={track.thumbnail} />
            <div className='progress-container'>
              <div className='progress-bar' style={{ width: `${track.isStream ? '100%' : position / track.duration * 100 + '%'}` }} />
            </div>
          </li>
          <li>
            <a href={track.uri} rel='noreferrer' target='_blank'><h4>{track.title}</h4></a>
            <h6>{track.author}</h6>
            <h5>{track.isStream ? '🔴 Live' : `${msToHMS(position)} / ${msToHMS(track.duration)}`}</h5>
            <MusicControls paused={paused} repeatMode={repeatMode} websocket={websocket} />
          </li>
        </ul>
      </div>
      <VolumeControl volume={volume} websocket={websocket} />
    </div>
  )
}

function Thumbnail({ image }) {
  return (
    <div className='thumbnail-container'>
      <img className='thumbnail-backdrop' src={image ?? '/assets/img/image_placeholder.png'} alt='Thumbnail Background'/>
      <img className='thumbnail' src={image ?? '/assets/img/image_placeholder.png'} alt='Video Thumbnail'/>
    </div>
  )
}

function MusicControls({ paused, repeatMode, websocket }) {
  return (
    <div>
      <button className='button icon' onClick={() => { websocket.sendData({ type: 'previous' }) }}><i className='fas fa-backward' /></button>
      <button className='button icon' onClick={() => { websocket.sendData({ type: 'pause' }) }}><i className={paused ? 'fas fa-play' : 'fas fa-pause'} /></button>
      <button className='button icon' onClick={() => { websocket.sendData({ type: 'skip' }) }}><i className='fas fa-forward' /></button>
      <span style={{ marginRight: '10px' }}></span>
      <button className='button icon' onClick={() => { websocket.sendData({ type: 'shuffle' }) }}><i className='fas fa-random' /></button>
      <button className='button icon' onClick={() => { websocket.sendData({ type: 'repeat' }) }}><i className={repeatMode === 'none' ? 'fad fa-repeat-alt' : repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'} /></button>
    </div>
  )
}

function VolumeControl({ initialVolume, websocket }) {
  const [volume, setVolume] = React.useState(initialVolume)
  React.useEffect(() => {
    setVolume(initialVolume)
  }, [initialVolume])

  return (
    <div>
      <button className='volume-display disabled'><i className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'} /> ${volume}</button>
      <input className='volume-slider' type='range' defaultValue={volume.toString()} step='1' min='0' max='100' onInput={(event) => { setVolume(event.target.value) }} onMouseUp={(event) => { websocket.sendData({ type: 'volume', volume: event.target.value }) }} />
    </div>
  )
}

function Queue({ tracks, websocket }) {
  // noinspection JSMismatchedCollectionQueryUpdate
  const rows = []
  for (let i = 0; i < tracks.length; i++) {
    rows.push(
      <tr key={i + 1}>
        <td><span className='text-nowrap'>${i + 1}</span></td>
        <td><span className='text-nowrap'>${tracks[i].title}</span></td>
        <td><span className='text-nowrap'>${tracks[i].author}</span></td>
        <td><span className='text-nowrap'>${tracks[i].isStream ? '🔴 Live' : msToHMS(tracks[i].duration)}</span></td>
        <td><span className='text-nowrap'><button className='button icon' onClick={() => { websocket.sendData({ type: 'remove', index: i + 1 }) }}><i className='fas fa-trash-alt' /></button><button className='button icon' onClick={() => { websocket.sendData({ type: 'skipto', index: i + 1 }) }}><i className='fas fa-forward' /></button></span></td>
      </tr>
    )
  }
  return (
    <div>
      <h1 className='queue-title'>Queue</h1>
      <QueueButtons websocket={websocket}/>
      <div className='table-responsive'>
        <table className='table table-dark'>
          <thead>
            <tr>
              <th>#</th>
              <th style={{ width: '100%' }}>Track</th>
              <th>Author</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function QueueButtons({ websocket }) {
  const input = React.createRef()
  const handlePlay = (event) => {
    event.preventDefault()
    websocket.sendData({ type: 'play', query: input.current.value })
    input.current.value = ''
  }
  return (
    <div className='queue-button-container'>
      <div style="${{ display: 'flex' }}">
        <form onSubmit={handlePlay}>
          <input type='text' className='textfield' placeholder='Add to queue' ref={input} />
          <button className='button'><i className='fas fa-plus' /> Play</button>
        </form>
        <select className="button select" style="${{ marginLeft: '20px' }}" name="filter" id="filter" onChange={(event) => { websocket.sendData({ type: 'filter', filter: event.target.value }) }}>
          <option selected disabled>Select a filter...</option>
          <option value="none">None</option>
          <option value="bassboost">Bass Boost</option>
          <option value="classic">Classic</option>
          <option value="eightd">8D</option>
          <option value="earrape">Earrape</option>
          <option value="karaoke">Karaoke</option>
          <option value="nightcore">Nightcore</option>
          <option value="superfast">Superfast</option>
          <option value="vaporwave">Vaporwave</option>
        </select>
      </div>
      <button className='button' style={{ marginRight: 0 }} onClick={() => { websocket.sendData({ type: 'clear' }) }}><i className='fas fa-trash-alt' /> Clear queue</button>
    </div>
  )
}

function MediaSession({ track, paused, websocket }) {
  React.useEffect(async () => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      const audio = document.createElement('audio')
      audio.src = '/queue/near-silence.mp3'
      audio.volume = 0.00001
      audio.load()
      await audio.play().catch(() => {
        const div = document.getElementById('autoplay-alert')
        div.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show')
        div.setAttribute('role', 'alert')
        div.style.cssText = 'position: fixed; right: 1em; bottom: 0;'
        div.innerHTML = '<i class="far fa-exclamation-triangle fa-1.5x"></i><span style="font-size: 1em; margin-left: 5px">Autoplay seems to be disabled. Enable Media Autoplay to use media buttons to control the music bot!<button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
      })
      setTimeout(() => audio.pause(), 100)
    }
  }, [])
  React.useEffect(() => {
    function htmlDecode(input) { return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: htmlDecode(track.title),
      artist: htmlDecode(track.author),
      album: htmlDecode(track.author),
      artwork: [{ src: htmlDecode(track.thumbnail) }]
    })
    navigator.mediaSession.playbackState = paused ? 'paused' : 'playing'

    navigator.mediaSession.setActionHandler('play', () => { websocket.sendData({ type: 'pause' }) })
    navigator.mediaSession.setActionHandler('pause', () => { websocket.sendData({ type: 'pause' }) })
    navigator.mediaSession.setActionHandler('nexttrack', () => { websocket.sendData({ type: 'skip' }) })
    navigator.mediaSession.setActionHandler('previoustrack', () => { websocket.sendData({ type: 'previous' }) })
  }, [track, paused])
  return <div id="autoplay-alert"></div>
}
