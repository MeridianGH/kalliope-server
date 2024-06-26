import React, { createRef, FormEvent, useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Nullable, Player } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Thumbnail } from '../Thumbnail/thumbnail'
import { Visualizer } from '../Vizualizer/visualizer'
import './queue.scss'

export type QueueProps = {
  guildId: Nullable<string>,
  player: Nullable<Player>
}

export function Queue({ guildId, player }: QueueProps) {
  const webSocket = useContext(WebSocketContext)
  const inputRef = createRef<HTMLInputElement>()

  useEffect(() => {
    if (!webSocket || !guildId) { return }
    webSocket.request({ type: 'requestPlayerData', guildId: guildId })
  }, [guildId, webSocket])

  const handlePlay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!player?.guildId) { return }
    const input = inputRef.current
    const query = input?.value
    if (!query) { return }
    if (webSocket) {
      void toast.promise(
        webSocket.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'play', payload: { query: query } }, true),
        {
          pending: `Adding '${query}' to queue...`,
          success: {
            render: ({ data }) => {
              const trackTitle = data.type === 'playerData' ?
                (data.player.queue.tracks?.at(-1) ?? data.player.queue.current).info.title :
                'Unknown track'
              return `Successfully added '${trackTitle}' to the queue.`
            }
          },
          error: `Failed to add '${query}' to the queue. Please try again.`
        }
      )
    }
    if (input) { input.value = '' }
  }

  if (!player?.guildId) {
    return <div className={'queue-container flex-container column'}>{'Nothing currently playing! Join a voice channel and start playback using \'/play\'!'}</div>
  }

  return (
    <div className={'queue-container flex-container column'}>
      <h1>{'Queue:'}</h1>
      <h4 className={'queue-current-title'}>{'Now playing:'}</h4>
      {player?.queue.current ?
        (
          <div className={'flex-container'}>
            <Visualizer style={'gradient'} paused={player?.paused}/>
            <Thumbnail image={player?.queue.current.info.artworkUrl} size={'3em'}/>
            <div className={'queue-current flex-container column start'}>
              <div className={'flex-container nowrap'}>
                <a href={player?.queue.current.info.uri} rel={'noreferrer'} target={'_blank'}>
                  <b className={'now-playing-title'}>{player?.queue.current.info.title}</b>
                </a>
              </div>
              <span>{player?.queue.current.info.author}</span>
            </div>
          </div>
        ) :
        <span>{'Nothing currently playing!'}</span>}
      <div className={'flex-container'}>
        <form onSubmit={handlePlay} className={'queue-input queue-input-form'}>
          <input type={'text'} placeholder={'Add to queue'} ref={inputRef}/>
          <button tabIndex={-1}><i className={'fas fa-plus'}></i></button>
        </form>
        <div className={'queue-input queue-input-form'}>
          <i className={'fas fa-sliders-v-square'}></i>
          <select
            className={'queue-select'}
            name={'filter'}
            id={'filter'}
            value={player?.filters.current ?? 'none'}
            onChange={(event) => {
              const filter = event.target.value
              const filterText = event.target.options.item(event.target.options.selectedIndex)?.label ?? 'Unknown filter'
              if (webSocket) {
                void toast.promise(
                  webSocket?.request({
                    type: 'requestPlayerAction',
                    guildId: player.guildId,
                    action: 'filter',
                    payload: {
                      filter: filter,
                      filterText: filterText
                    }
                  }, true),
                  {
                    pending: `Setting filter '${filterText}'...`,
                    success: `Successfully set filter to '${filterText}'.`,
                    error: `Failed to set filter '${filterText}'. Please try again.`
                  }
                )
              }
            }}
          >
            <option disabled hidden>{'Select a filter...'}</option>
            <option value={'none'}>{'No Filter'}</option>
            <option value={'bassboost'}>{'Bass Boost'}</option>
            <option value={'classic'}>{'Classic'}</option>
            <option value={'eightd'}>{'8D'}</option>
            <option value={'earrape'}>{'Earrape'}</option>
            <option value={'karaoke'}>{'Karaoke'}</option>
            <option value={'nightcore'}>{'Nightcore'}</option>
            <option value={'superfast'}>{'Superfast'}</option>
            <option value={'vaporwave'}>{'Vaporwave'}</option>
          </select>
        </div>
        <button
          className={'queue-input'}
          onClick={() => {
            if (webSocket) {
              void toast.promise(
                webSocket.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'clear' }, true),
                {
                  pending: 'Clearing the queue...',
                  success: 'Successfully cleared the queue.',
                  error: 'Failed to clear the queue. Please try again.'
                }
              )
            }
          }}
        >
          <i className={'fas fa-trash-alt'}></i>
          {'Clear queue\r'}
        </button>
      </div>
      <div className={'flex-container'}>
        <label
          className={'queue-input'}
          onClick={(event) => {
            event.preventDefault()
            // TODO: Use state value with autoplay
            if (webSocket) {
              void toast.promise(
                webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'autoplay' }, true),
                {
                  pending: 'Toggling autoplay...',
                  success: 'Successfully toggled autoplay.',
                  error: 'Failed to toggle autoplay. Please try again.'
                }
              )
            }
          }}
        >
          <div className={'queue-input-toggle'}>
            <input type={'checkbox'} checked={!!player?.settings.autoplay} readOnly={true}/>
            <span/>
          </div>
          {'Autoplay\r'}
        </label>
        {player?.settings.sponsorblockSupport && (
          <label
            className={'queue-input'}
            onClick={(event) => {
              event.preventDefault()
              // TODO: Use state value with SponsorBlock
              if (webSocket) {
                void toast.promise(
                  webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'sponsorblock' }, true),
                  {
                    pending: 'Toggling SponsorBlock...',
                    success: 'Successfully toggled SponsorBlock.',
                    error: 'Failed to toggle SponsorBlock. Please try again.'
                  }
                )
              }
            }}
          >
            <div className={'queue-input-toggle'}>
              <input type={'checkbox'} checked={!!player?.settings.sponsorblock} readOnly={true}/>
              <span/>
            </div>
            {'SponsorBlock\r'}
          </label>
        )}
      </div>
      {/* eslint-disable-next-line no-extra-parens */}
      {player?.queue.tracks && player?.queue.tracks.length > 0 ?
        player?.queue.tracks.map((track, index) => (
          <div className={'queue-track flex-container space-between nowrap'} key={index}>
            <div className={'flex-container nowrap'}>
              <b>{index + 1}{'.'}</b>
              <Thumbnail image={track.info.artworkUrl} size={'3em'}/>
              <a href={track.info.uri} rel={'noreferrer'} target={'_blank'}><b>{track.info.title}</b></a>
            </div>
            <div className={'queue-track-buttons flex-container'}>
              <button onClick={() => {
                const trackTitle = player?.queue.tracks[index].info.title
                if (webSocket) {
                  void toast.promise(
                    webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'remove', payload: { index: index + 1 } }, true),
                    {
                      pending: `Removing '${trackTitle}' from the queue...`,
                      success: `Successfully removed '${trackTitle}' from the queue.`,
                      error: `Failed to remove '${trackTitle}' from the queue. Please try again.`
                    }
                  )
                }
              }}
              >
                <i className={'fas fa-trash-alt'}></i>
              </button>
              <button onClick={() => {
                const trackTitle = player?.queue.tracks[index].info.title
                if (webSocket) {
                  void toast.promise(
                    webSocket?.request({ type: 'requestPlayerAction', guildId: player.guildId, action: 'skip', payload: { index: index + 1 } }, true),
                    {
                      pending: `Skipping to '${trackTitle}'...`,
                      success: `Successfully skipped to '${trackTitle}'.`,
                      error: `Failed to skip to '${trackTitle}'. Please try again.`
                    }
                  )
                }
              }}
              >
                <i className={'fas fa-forward'}></i>
              </button>
            </div>
          </div>
        )) :
        <div className={'queue-track flex-container'}>{'No upcoming songs! Add songs with \'/play\' or by using the field above.'}</div>}
    </div>
  )
}
