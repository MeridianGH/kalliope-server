import React, { FormEvent, useContext } from 'react'
import PropTypes from 'prop-types'
import { Nullable, Player, Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Thumbnail } from '../Thumbnail/thumbnail'
import './queue.scss'
import { toast } from 'react-toastify'

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
    if (webSocket) {
      // noinspection JSIgnoredPromiseFromCall
      toast.promise(
        webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'play', payload: { query: query } }, true),
        {
          pending: `Adding '${query}' to queue...`,
          success: `Successfully added '${query}' to the queue.`,
          error: `Failed to add '${query}' to the queue. Please try again.`
        }
      )
    }
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
          const filter = event.target.value
          const filterText = event.target.innerText
          if (webSocket) {
            // noinspection JSIgnoredPromiseFromCall
            toast.promise(
              webSocket?.request({ type: 'requestPlayerAction', guildId: guildId, action: 'filter', payload: { filter: filter } }, true),
              {
                pending: `Setting filter '${filterText}'...`,
                success: `Successfully set filter to '${filterText}'.`,
                error: `Failed to set filter '${filterText}'. Please try again.`
              }
            )
          }
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
          if (webSocket) {
            // noinspection JSIgnoredPromiseFromCall
            toast.promise(
              webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'clear' }, true),
              {
                pending: 'Clearing the queue...',
                success: 'Successfully cleared the queue.',
                error: 'Failed to clear the queue. Please try again.'
              }
            )
          }
        }}><i className={'fas fa-trash-alt'}/> Clear queue
        </button>
      </div>
      <div className={'flex-container'}>
        <label className={'queue-input pointer'} onClick={(event) => {
          event.preventDefault()
          // TODO: Use state value with autoplay
          if (webSocket) {
            // noinspection JSIgnoredPromiseFromCall
            toast.promise(
              webSocket?.request({ type: 'requestPlayerAction', guildId: guildId, action: 'autoplay' }, true),
              {
                pending: 'Toggling autoplay...',
                success: 'Successfully toggled autoplay.',
                error: 'Failed to toggle autoplay. Please try again.'
              }
            )
          }
        }}>
          <div className={'queue-input-toggle'}>
            <input type={'checkbox'} checked={settings?.autoplay} readOnly={true}/>
            <span/>
          </div>
          Autoplay
        </label>
        {settings?.sponsorblockSupport ? <label className={'queue-input pointer'} onClick={(event) => {
          event.preventDefault()
          // TODO: Use state value with SponsorBlock
          if (webSocket) {
            // noinspection JSIgnoredPromiseFromCall
            toast.promise(
              webSocket?.request({ type: 'requestPlayerAction', guildId: guildId, action: 'sponsorblock' }, true),
              {
                pending: 'Toggling SponsorBlock...',
                success: 'Successfully toggled SponsorBlock.',
                error: 'Failed to toggle SponsorBlock. Please try again.'
              }
            )
          }
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
            <button onClick={() => {
              const trackTitle = tracks[index].info.title
              if (webSocket) {
                // noinspection JSIgnoredPromiseFromCall
                toast.promise(
                  webSocket?.request({ type: 'requestPlayerAction', guildId: guildId, action: 'remove', payload: { index: index + 1 } }, true),
                  {
                    pending: `Removing '${trackTitle}' from the queue...`,
                    success: `Successfully removed '${trackTitle}' from the queue.`,
                    error: `Failed to remove '${trackTitle}' from the queue. Please try again.`
                  }
                )
              }
            }}><i className={'fas fa-trash-alt'}/></button>
            <button onClick={() => {
              const trackTitle = tracks[index].info.title
              if (webSocket) {
                // noinspection JSIgnoredPromiseFromCall
                toast.promise(
                  webSocket?.request({ type: 'requestPlayerAction', guildId: guildId, action: 'skip', payload: { index: index + 1 } }, true),
                  {
                    pending: `Skipping to '${trackTitle}'...`,
                    success: `Successfully skipped to '${trackTitle}'.`,
                    error: `Failed to skip to '${trackTitle}'. Please try again.`
                  }
                )
              }
            }}><i className={'fas fa-forward'}/></button>
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
