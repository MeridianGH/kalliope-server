import React, { useContext } from 'react'
import { Nullable, Track } from '../../../types/types'
import './tracks.scss'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { toast } from 'react-toastify'
import { Thumbnail } from '../Thumbnail/thumbnail'

type TracksProps = {
  guildId: Nullable<string>,
  tracks: Nullable<Track[]>
}

export function Tracks({ guildId, tracks }: TracksProps) {
  const webSocket = useContext(WebSocketContext)

  if (!guildId) {
    return (
      <div className={'queue-container flex-container'}>
        <p>{'Select a server using the list on the left to view the queue.'}</p>
      </div>
    )
  }

  return (
    <div className={'queue-container flex-container column start nowrap'}>
      <h5 className={'queue-title'}>{'Queue'}</h5>
      {tracks && tracks.length > 0 ?
        tracks.map((track, index) => (
          <div key={index + 1} className={'queue-item flex-container space-between nowrap'}>
            <div className={'flex-container nowrap'}>
              <button
                className={'queue-item-skipto tooltip'}
                onClick={() => {
                  const trackTitle = tracks[index].info.title
                  if (webSocket) {
                    void toast.promise(
                      webSocket?.request({
                        type: 'requestPlayerAction',
                        guildId: guildId,
                        action: 'skip',
                        payload: { index: index + 1 }
                      }, true),
                      {
                        pending: `Skipping to '${trackTitle}'...`,
                        success: `Successfully skipped to '${trackTitle}'.`,
                        error: `Failed to skip to '${trackTitle}'. Please try again.`
                      }
                    )
                  }
                }}
              >
                <Thumbnail image={track.info.artworkUrl} size={'4rem'}/>
                <i className={'fas fa-play'}></i>
              </button>
              <div className={'queue-item-text flex-container column start nowrap'}>
                <a href={track.info.uri} rel={'noreferrer'} target={'_blank'}><b>{track.info.title}</b></a>
                <span>{track.info.author}</span>
              </div>
            </div>
            <button
              className={'queue-item-remove'}
              onClick={() => {
                const trackTitle = tracks[index].info.title
                if (webSocket) {
                  void toast.promise(
                    webSocket?.request({
                      type: 'requestPlayerAction',
                      guildId: guildId,
                      action: 'remove',
                      payload: { index: index + 1 }
                    }, true),
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
          </div>
        )) :
        <div className={'queue-item flex-container'}>
          {'No upcoming songs! Add songs with \'/play\' or by using the field on the right.'}
        </div>}
    </div>
  )
}
