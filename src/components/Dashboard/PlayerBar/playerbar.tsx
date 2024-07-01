import React, { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Nullable, Player, Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { Thumbnail } from '../Thumbnail/thumbnail'
import { LoadingButton } from '../../LoadingButton/loadingbutton'
import {
  Infinity,
  PauseCircle,
  PlayCircle,
  Queue, Repeat, RepeatOnce,
  Shuffle,
  SkipBack,
  SkipForward, SpeakerHigh,
  SpeakerLow, SpeakerNone,
  SpeakerX
} from '@phosphor-icons/react'
import './playerbar.scss'

type PlayerBarProps = {
  guildId: Nullable<string>,
  current: Nullable<Track>,
  position: Nullable<number>,
  volume: Nullable<number>,
  timescale: Nullable<number>,
  paused: Nullable<boolean>,
  repeatMode: Nullable<Player['repeatMode']>,
  settings: Nullable<Player['settings']>
}

export function PlayerBar({ guildId, current, position, volume, timescale, paused, repeatMode, settings }: PlayerBarProps) {
  const webSocket = useContext(WebSocketContext)
  const [currentPosition, setCurrentPosition] = useState(position ?? 0)
  const [currentVolume, setCurrentVolume] = useState(volume ?? 50)

  const msToHMS = useCallback((ms: number) => {
    let totalSeconds = ms / 1000
    const hours = Math.floor(totalSeconds / 3600).toString()
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60).toString()
    const seconds = Math.floor(totalSeconds % 60).toString()
    return hours === '0' ? `${minutes}:${seconds.padStart(2, '0')}` : `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (!current?.info.artworkUrl) {
      document.querySelector<HTMLDivElement>('.player-bar')!.style.setProperty('--dominant-color', 'var(--accent)')
      return
    }

    fetch(window.location.origin + '/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: current.info.artworkUrl,
        preventSimilar: getComputedStyle(document.documentElement).getPropertyValue('--hover')
      })
    }).then((res) => res.json()).then((body: { color?: string }) => {
      document.querySelector<HTMLDivElement>('.player-bar')!.style.setProperty('--dominant-color', body.color ?? 'var(--accent)')
    }).catch((error) => console.warn(error))
  }, [current])

  const disabled = !guildId || !current

  useEffect(() => {
    if (!Number.isFinite(position) || disabled || paused) { return }
    setCurrentPosition(position!)
    const interval = setInterval(() => {
      setCurrentPosition((prevPosition) => {
        if (prevPosition >= current.info.duration) {
          clearInterval(interval)
          return current.info.duration
        }
        return prevPosition + 1000
      })
    }, 1000 * (1 / (timescale ?? 1)))
    return () => { clearInterval(interval) }
  }, [position, current, disabled, paused, timescale])

  return (
    <div className={`player-bar flex-container space-between nowrap`}>
      <div className={'flex-container start nowrap'}>
        {!disabled && (
          <>
            <div className={'player-song-gradient'}></div>
            <a className={'flex-container nowrap'} href={current.info.uri} rel={'noreferrer'} target={'_blank'}>
              <Thumbnail image={current.info.artworkUrl} size={'5rem'}/>
              <div className={'player-song flex-container column nowrap'}>
                <b>{current.info.title}</b>
                <span>{current.info.author}</span>
              </div>
            </a>
          </>
        )}
      </div>
      <div className={'flex-container column nowrap'}>
        <div className={'player-buttons flex-container nowrap'}>
          <LoadingButton
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
            <Shuffle/>
          </LoadingButton>
          <LoadingButton
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
            <SkipBack/>
          </LoadingButton>
          <LoadingButton
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
            {paused ? <PlayCircle size={'2rem'} weight={'fill'}/> : <PauseCircle size={'2rem'} weight={'fill'}/>}
          </LoadingButton>
          <LoadingButton
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
            <SkipForward/>
          </LoadingButton>
          <LoadingButton
            className={`player-repeat-button ${repeatMode}`}
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
            {repeatMode === 'track' ? <RepeatOnce/> : <Repeat/>}
          </LoadingButton>
        </div>
        <div className={'progress-wrapper flex-container nowrap'}>
          <span>{disabled ? '-:-' : msToHMS(currentPosition)}</span>
          <div className={'progress-bar-container'}>
            <div
              className={'progress-bar'}
              style={{ width: `${disabled ? '0%' : current.info.isStream ? '100%' : currentPosition / current.info.duration * 100 + '%'}` }}
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
              <LoadingButton
                className={`autoplay-button ${settings?.autoplay ? 'active' : ''} tooltip`}
                onClick={() => {
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
                <Queue/>
              </LoadingButton>
              {settings?.sponsorblockSupport && (
                <LoadingButton
                  className={`sponsorblock-button ${settings?.sponsorblock ? 'active' : ''} tooltip`}
                  onClick={() => {
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
                </LoadingButton>
              )}
            </div>
            <div className={'volume-container flex-container column nowrap'}>
              <div className={'volume-text'}>
                {currentVolume === 0 ? <SpeakerX/> : currentVolume <= 33 ? <SpeakerNone/> : currentVolume <= 66 ? <SpeakerLow/> : <SpeakerHigh/>}
                {currentVolume}
              </div>
              <div className={'volume-slider-container'}>
                <input
                  className={'volume-slider-input'}
                  type={'range'}
                  defaultValue={currentVolume.toString()}
                  step={'1'}
                  min={'0'}
                  max={'100'}
                  onInput={() => {
                    setCurrentVolume(parseInt(document.querySelector<HTMLInputElement>('.volume-slider-input')!.value))
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
                <div className={'volume-slider-range'} style={{ width: `${currentVolume}%` }}></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
