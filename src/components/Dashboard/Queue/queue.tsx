import React, { FormEvent, useContext } from 'react'
import PropTypes from 'prop-types'
import { Nullable, Player, Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Thumbnail } from '../Thumbnail/thumbnail'
import './queue.scss'

export interface QueueProps {
  guildId: Nullable<string>,
  current: Nullable<Track>,
  tracks: Nullable<Track[]>,
  settings: Nullable<Player['settings']>
}

export function Queue({ guildId, current, tracks, settings }: QueueProps) {
  const webSocket = useContext(WebSocketContext)
  const inputRef = React.createRef<HTMLInputElement>()

  const handlePlay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!guildId) { return }
    const input = inputRef.current
    const query = input?.value
    if (!query) { return }
    webSocket?.sendData('play', { query: query, guildId: guildId })
    if (input) { input.value = '' }
  }

  if (!guildId) {
    return <div className={'queue-container flex-container column'}>Please select a valid guild!</div>
  }

  return (
    <div className={'queue-container flex-container column'}>
      <h1>Queue:</h1>
      <h4 className={'queue-current-title'}>Now playing:</h4>
      {current ?
        <div className={'flex-container'}>
          <Thumbnail image={current.info.artworkUrl} size={'3em'}/>
          <div className={'queue-current flex-container column start'}>
            <a href={current.info.uri} rel="noreferrer" target="_blank"><b
              className={'now-playing-title'}>{current.info.title}</b></a>
            <span>{current.info.author}</span>
          </div>
        </div>
        : <span>Nothing currently playing!</span>
      }
      <div className={'flex-container'}>
        <form onSubmit={handlePlay} className={'queue-input-form music-buttons'}>
          <input type="text" className={'queue-input'} placeholder="Add to queue" ref={inputRef}/>
          <button className={'queue-input-button'}><i className={'fas fa-plus'}/></button>
        </form>
        <select className={'queue-input pointer'} name="filter" id={'filter'} onChange={(event) => {
          webSocket?.sendData('filter', { filter: event.target.value, guildId: guildId })
          toasts.info('Changing filter...')
        }}>
          <option disabled hidden>Select a filter...</option>
          <option value={'none'}>No Filter</option>
          <option value={'bassboost'}>Bass Boost</option>
          <option value={'classic'}>Classic</option>
          <option value={'eightd'}>8D</option>
          <option value={'earrape'}>Earrape</option>
          <option value={'karaoke'}>Karaoke</option>
          <option value={'nightcore'}>Nightcore</option>
          <option value={'superfast'}>Superfast</option>
          <option value={'vaporwave'}>Vaporwave</option>
        </select>
        <button className={'queue-input pointer'} onClick={() => {
          webSocket?.sendData('clear', { guildId: guildId })
          toasts.info('Clearing the queue...')
        }}><i className={'fas fa-trash-alt'}/> Clear queue
        </button>
      </div>
      <div className={'flex-container'}>
        <label className={'queue-input pointer'} onClick={(event) => {
          event.preventDefault()
          webSocket?.sendData('autoplay', { guildId: guildId })
        }}>
          <div className={'queue-input-toggle'}>
            <input type={'checkbox'} checked={settings?.autoplay} readOnly={true}/>
            <span/>
          </div>
          Autoplay
        </label>
        {settings?.sponsorblockSupport ? <label className={'queue-input pointer'} onClick={(event) => {
          event.preventDefault()
          webSocket?.sendData('autoplay', { guildId: guildId })
        }}>
          <div className={'queue-input-toggle'}>
            <input type={'checkbox'} checked={settings?.sponsorblock} readOnly={true}/>
            <span/>
          </div>
          SponsorBlock
        </label> : ''}
      </div>
      {/* eslint-disable-next-line no-extra-parens */}
      {tracks && tracks.length > 0 ? tracks.map((track, index) => (
        <div className={'queue-track flex-container space-between nowrap'} key={index}>
          <div className={'flex-container nowrap'}>
            <b>{index + 1}.</b>
            <Thumbnail image={track.info.artworkUrl} size={'3em'}/>
            <a href={track.info.uri} rel='noreferrer' target='_blank'><b>{track.info.title}</b></a>
          </div>
          <div className={'queue-track-buttons flex-container'}>
            <button onClick={() => { webSocket?.sendData('remove', { index: index + 1, guildId: guildId }) }}><i className={'fas fa-trash-alt'}/></button>
            <button onClick={() => { webSocket?.sendData('skip', { index: index + 1, guildId: guildId }) }}><i className={'fas fa-forward'}/></button>
          </div>
        </div>
      )) : <div className={'queue-track flex-container'}>No upcoming songs! Add songs with &apos;/play&apos; or by using the field above.</div>}
    </div>
  )
}

Queue.propTypes = {
  guildId: PropTypes.string,
  current: PropTypes.object,
  tracks: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.object
}
