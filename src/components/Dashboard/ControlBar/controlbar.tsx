import { Thumbnail } from '../Thumbnail/thumbnail'
import { toast } from 'react-toastify'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Nullable, Player, Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import './controlbar.scss'

type ControlBarProps = {
  guildId: Nullable<string>,
  current: Nullable<Track>,
  initialPosition: Nullable<number>,
  initialVolume: Nullable<number>,
  timescale: Nullable<number>,
  paused: Nullable<boolean>,
  repeatMode: Nullable<Player['repeatMode']>,
  settings: Nullable<Player['settings']>
}

export function ControlBar({ guildId, current, initialPosition, initialVolume, timescale, paused, repeatMode, settings }: ControlBarProps) {
  const webSocket = useContext(WebSocketContext)
  const [position, setPosition] = useState(initialPosition ?? 0)
  const [volume, setVolume] = useState(initialVolume ?? 50)

  const msToHMS = useCallback((ms: number) => {
    let totalSeconds = ms / 1000
    const hours = Math.floor(totalSeconds / 3600).toString()
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60).toString()
    const seconds = Math.floor(totalSeconds % 60).toString()
    return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }, [])

  const disabled = !guildId || !current

  useEffect(() => {
    if (disabled || paused) { return }
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        if (prevPosition >= current.info.duration) {
          clearInterval(interval)
          return current.info.duration
        }
        return prevPosition + 1000
      })
    }, 1000 * (1 / (timescale ?? 1)))
    return () => { clearInterval(interval) }
  }, [current, disabled, paused, timescale])

  return (
    <div className={`player-bar flex-container space-between nowrap`}>
      <div className={'flex-container start nowrap'}>
        {!disabled && (
          <>
            <div className={'player-song-gradient'}></div>
            <Thumbnail image={current.info.artworkUrl} size={'5rem'}/>
            <div className={'player-song flex-container column nowrap'}>
              <a href={current.info.uri} rel={'noreferrer'} target={'_blank'}><b>{current.info.title}</b></a>
              <span>{current.info.author}</span>
            </div>
          </>
        )}
      </div>
      <div className={'flex-container column nowrap'}>
        <div className={'player-buttons flex-container nowrap'}>
          <button
            disabled={disabled}
            onClick={() => {
              if (!guildId) { return }
              webSocket?.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'shuffle'
              })
            }}
          >
            <i className={'fas fa-random'}></i>
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              if (!guildId) { return }
              webSocket?.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'previous'
              })
            }}
          >
            <i className={'fas fa-step-backward'}></i>
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              if (!guildId) { return }
              webSocket?.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'pause'
              })
            }}
          >
            <i className={paused ? 'fas fa-play-circle' : 'fas fa-pause-circle'}></i>
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              if (!guildId) { return }
              webSocket?.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'skip'
              })
            }}
          >
            <i className={'fas fa-step-forward'}></i>
          </button>
          <button
            className={'player-repeat-button'}
            disabled={disabled}
            onClick={() => {
              if (!guildId) { return }
              webSocket?.request({
                type: 'requestPlayerAction',
                guildId: guildId,
                action: 'repeat'
              })
            }}
          >
            <i className={repeatMode === 'off' ? 'fad fa-repeat-alt' : repeatMode === 'track' ? 'fas fa-repeat-1-alt' : 'fas fa-repeat'}></i>
          </button>
        </div>
        <div className={'progress-wrapper flex-container nowrap'}>
          <span>{disabled ? '-:-' : msToHMS(position)}</span>
          <div className={'progress-bar-container'}>
            <div
              className={'progress-bar'}
              style={{ width: `${disabled ? '0%' : current.info.isStream ? '100%' : position / current.info.duration * 100 + '%'}` }}
            >
            </div>
          </div>
          <span>{disabled ? '-:-' : !current.info.isStream ? msToHMS(current.info.duration) : '🔴 Live'}</span>
        </div>
      </div>
      <div className={'extras-container flex-container nowrap'}>
        {!disabled && (
          <>
            <div className={'flex-container nowrap'}>
              <button
                className={`autoplay-button ${settings?.autoplay ? 'active' : ''} tooltip`}
                onClick={(event) => {
                  event.preventDefault()
                  // TODO: Use state value with autoplay
                  if (webSocket) {
                    void toast.promise(
                      webSocket?.request({
                        type: 'requestPlayerAction',
                        guildId: guildId,
                        action: 'autoplay'
                      }, true),
                      {
                        pending: 'Toggling autoplay...',
                        success: 'Successfully toggled autoplay.',
                        error: 'Failed to toggle autoplay. Please try again.'
                      }
                    )
                  }
                }}
              >
                <span className={'tooltip-content'}>{'Toggle Autoplay'}</span>
                <span className={'fa-stack fa-1x'} style={{ fontSize: '0.8rem' }}>
                  <i className={'fas fa-play fa-stack-1x'} style={{ fontSize: '0.5rem' }}></i>
                  <i className={'fas fa-redo-alt fa-stack-2x'}></i>
                </span>
              </button>
              {settings?.sponsorblockSupport && (
                <button
                  className={`sponsorblock-button ${settings?.sponsorblock ? 'active' : ''} tooltip`}
                  onClick={(event) => {
                    event.preventDefault()
                    // TODO: Use state value with SponsorBlock
                    if (webSocket) {
                      void toast.promise(
                        webSocket?.request({
                          type: 'requestPlayerAction',
                          guildId: guildId,
                          action: 'sponsorblock'
                        }, true),
                        {
                          pending: 'Toggling SponsorBlock...',
                          success: 'Successfully toggled SponsorBlock.',
                          error: 'Failed to toggle SponsorBlock. Please try again.'
                        }
                      )
                    }
                  }}
                >
                  <span className={'tooltip-content'}>{'Toggle SponsorBlock'}</span>
                  <div className={'sponsorblock-logo'}></div>
                </button>
              )}
            </div>
            <div className={'volume-text'}>
              <i
                className={volume === 0 ? 'fas fa-volume-off' : volume <= 33 ? 'fas fa-volume-down' : volume <= 66 ? 'fas fa-volume' : 'fas fa-volume-up'}
              >
              </i>
              {volume}
            </div>
            <div className={'volume-slider-container'}>
              <input
                type={'range'}
                defaultValue={volume.toString()}
                step={'1'}
                min={'0'}
                max={'100'}
                onInput={() => {
                  setVolume(parseInt(document.querySelector<HTMLInputElement>('.volume-slider-input')!.value))
                }}
                onMouseUp={() => {
                  if (!guildId) {
                    return
                  }
                  webSocket?.request({
                    type: 'requestPlayerAction',
                    guildId: guildId,
                    action: 'volume',
                    payload: { volume: parseInt(document.querySelector<HTMLInputElement>('.volume-slider-input')!.value) }
                  })
                }}
              />
              <div className={'volume-slider-range'} style={{ width: `${volume}%` }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
