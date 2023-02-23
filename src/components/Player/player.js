/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'

import './player.css'
import imagePlaceholder from '/src/assets/image_placeholder.png'
import { Navbar } from '../Navbar/navbar.js'

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
  }, [initialPlayer])

  if (!player) { return null }
  if (!player.current) { return <div>Nothing currently playing!<br/>Join a voice channel and type &quot;/play&quot; to get started!</div> }
  return (
    <div>
      <Navbar/>
      {/*<MediaSession track={player.current} paused={player.paused} websocket={websocket}/>*/}
      <NowPlaying track={player.current} paused={player.paused} position={player.position} repeatMode={player.repeatMode} initialVolume={player.volume} websocket={websocket}/>
      {/*<div style={{ marginBottom: '20px' }}/>*/}
      <Queue tracks={[player.current]} websocket={websocket}/>
    </div>
  )
}

function NowPlaying({ track, position, paused, repeatMode, initialVolume, websocket }) {
  const [volume, setVolume] = React.useState(initialVolume)
  return (
    <div className={'now-playing-container flex-container column'}>
      <Thumbnail image={track.thumbnail} size={'350px'}/>
      <div className={'flex-container row nowrap'} style={{ gap: '1em' }}>
        <span>{!track.isStream ? msToHMS(position) : ''}</span>
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
        <button onClick={() => { websocket.sendData({ type: 'shuffle' }) }}><i className={'fas fa-random'}/></button>
        <button onClick={() => { websocket.sendData({ type: 'previous' }) }}><i className={'fas fa-angle-left'}/></button>
        <button onClick={() => { websocket.sendData({ type: 'pause' }) }}><i className={paused ? 'fas fa-play' : 'fas fa-pause'}/></button>
        <button onClick={() => { websocket.sendData({ type: 'skip' }) }}><i className={'fas fa-angle-right'}/></button>
        <button onClick={() => { websocket.sendData({ type: 'repeat' }) }}><i className={repeatMode === 'none' ? 'fad fa-repeat-alt' : repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}/></button>
      </div>
      <div className={'flex-container column'}>
        <div className={'volume-slider-container'}>
          <input className={'volume-slider-input'} type={'range'} defaultValue={volume.toString()} step={'1'} min={'0'} max={'100'} onInput={(event) => { setVolume(event.target.value) }} onMouseUp={(event) => { websocket.sendData({ type: 'volume', volume: event.target.value }) }}/>
          <div className={'volume-slider-range'} style={{ marginLeft: `${volume}%` }}></div>
        </div>
        <div className={'volume-display'}><i className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'}/> {volume}</div>
      </div>
    </div>
  )
}

/*function Queue({ tracks, websocket }) {
  // noinspection JSMismatchedCollectionQueryUpdate
  const rows = []
  for (let i = 0; i < tracks.length; i++) {
    rows.push(
      <tr key={i + 1}>
        <td><span className={'text-nowrap'}>${i + 1}</span></td>
        <td><span className={'text-nowrap'}>${tracks[i].title}</span></td>
        <td><span className={'text-nowrap'}>${tracks[i].author}</span></td>
        <td><span className={'text-nowrap'}>${tracks[i].isStream ? '🔴 Live' : msToHMS(tracks[i].duration)}</span></td>
        <td><span className={'text-nowrap'}><button className={'button icon'} onClick={() => { websocket.sendData({ type: 'remove', index: i + 1 }) }}><i className={'fas fa-trash-alt'}/></button><button className={'button icon'} onClick={() => { websocket.sendData({ type: 'skipto', index: i + 1 }) }}><i className={'fas fa-forward'}/></button></span></td>
      </tr>
    )
  }
  return (
    <div>
      <h1 className={'queue-title'}>Queue</h1>
      {/!*<QueueButtons websocket={websocket}/>*!/}
      <div className={'table-responsive'}>
        <table className={'table table-dark'}>
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
}*/
function Queue({ tracks, websocket }) {
  return (
    <div className={'flex-container column nowrap'}>
      {/* eslint-disable-next-line no-extra-parens */}
      {tracks.map((track, index) => (
        <div className={'queue-track flex-container row space-between nowrap'} key={index}>
          <div className={'flex-container row nowrap'} style={{ gap: '1em' }}>
            <Thumbnail image={track.thumbnail} size={'3em'}/>
            {track.title}
          </div>

        </div>
      ))}
    </div>
  )
}

function Thumbnail({ image, size }) {
  return (
    <div className={'thumbnail-container'} style={{ width: size, height: size }}>
      <img className={'thumbnail-backdrop'} src={image ?? imagePlaceholder} alt='Thumbnail Background'/>
      <img className={'thumbnail'} src={image ?? imagePlaceholder} alt='Video Thumbnail'/>
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
    <div className={'queue-button-container'}>
      <div style={{ display: 'flex' }}>
        <form onSubmit={handlePlay}>
          <input type='text' className={'textfield'} placeholder='Add to queue' ref={input}/>
          <button className={'button'}><i className={'fas fa-plus'}/> Play</button>
        </form>
        <select className="button select" style={{ marginLeft: '20px' } } name="filter" id="filter" onChange={(event) => { websocket.sendData({ type: 'filter', filter: event.target.value }) }}>
          <option disabled hidden>Select a filter...</option>
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
      <button className={'button'} style={{ marginRight: 0 }} onClick={() => { websocket.sendData({ type: 'clear' }) }}><i className={'fas fa-trash-alt'}/> Clear queue</button>
    </div>
  )
}

function MediaSession({ track, paused, websocket }) {
  React.useEffect(() => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      const audio = document.createElement('audio')
      audio.src = '/queue/near-silence.mp3'
      audio.volume = 0.00001
      audio.load()
      audio.play().then(() => { setTimeout(() => audio.pause(), 100) }).catch(() => {
        const div = document.getElementById('autoplay-alert')
        div.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show')
        div.setAttribute('role', 'alert')
        div.style.cssText = 'position: fixed; right: 1em; bottom: 0;'
        div.innerHTML = '<i class="far fa-exclamation-triangle fa-1.5x"></i><span style="font-size: 1em; margin-left: 5px">Autoplay seems to be disabled. Enable Media Autoplay to use media buttons to control the music bot!<button type="button" class="btn-close" data-bs-dismiss="alert"></button>'
      })
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
