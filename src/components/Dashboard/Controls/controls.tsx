import React, { createRef, FormEvent, useCallback, useContext } from 'react'
import './controls.scss'
import { toast } from 'react-toastify'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Nullable, Player } from '../../../types/types'

type ControlsProps = {
  guildId: Nullable<string>,
  filter: Nullable<Player['filters']['current']>
}

export function Controls({ guildId, filter }: ControlsProps) {
  const webSocket = useContext(WebSocketContext)
  const inputRef = createRef<HTMLInputElement>()

  const handlePlay = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!guildId) { return }
    const input = inputRef.current
    const query = input?.value
    if (!query) { return }
    if (webSocket) {
      void toast.promise(
        webSocket.request({ type: 'requestPlayerAction', guildId: guildId, action: 'play', payload: { query: query } }, true),
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
  }, [guildId, inputRef, webSocket])

  return (
    <div className={'controls-container flex-container column start nowrap'}>
      <h5 className={'controls-title'}>{'Controls'}</h5>
      <form onSubmit={handlePlay} className={`controls-input controls-form ${!guildId ? 'disabled' : ''}`}>
        <input type={'text'} placeholder={'Add to queue'} ref={inputRef}/>
        <button tabIndex={-1}><i className={'fas fa-plus'}></i></button>
      </form>
      <div className={`controls-input controls-select ${!guildId ? 'disabled' : ''}`}>
        <i className={'fas fa-sliders-v-square'}></i>
        <select
          name={'filter'}
          id={'filter'}
          value={filter ?? 'none'}
          onChange={(event) => {
            const filter = event.target.value
            const filterText = event.target.options.item(event.target.options.selectedIndex)?.label ?? 'Unknown filter'
            if (webSocket && guildId) {
              void toast.promise(
                webSocket?.request({
                  type: 'requestPlayerAction',
                  guildId: guildId,
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
        className={`controls-input controls-button ${!guildId ? 'disabled' : ''}`}
        onClick={() => {
          if (webSocket && guildId) {
            void toast.promise(
              webSocket.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'clear'
              }, true),
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
  )
}
