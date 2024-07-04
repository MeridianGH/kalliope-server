import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { LoadingButton } from '../../LoadingButton/loadingbutton'
import { Thumbnail } from '../Thumbnail/thumbnail'
import { DotsSixVertical, Play, Trash } from '@phosphor-icons/react'
import './queuetrack.scss'
import { Track } from '../../../types/types'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type QueueTrackProps = {
  index: number,
  guildId: string,
  trackInfo: Track['info']
}

export function QueueTrack({ index, guildId, trackInfo }: QueueTrackProps) {
  const webSocket = useContext(WebSocketContext)
  const sortable = useSortable({
    id: index + 1,
    transition: {
      duration: 250,
      easing: 'ease-in-out'
    }
  })

  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    boxShadow: sortable.isDragging ? '2px 2px 5px black' : 'unset',
    zIndex: sortable.isDragging ? 999 : 'unset'
  }

  return (
    <div key={index + 1} className={'queue-track flex-container space-between nowrap'} style={style} ref={sortable.setNodeRef}>
      <div className={'flex-container nowrap'}>
        <LoadingButton
          className={'queue-track-skipto tooltip'}
          onClick={() => {
            const trackTitle = trackInfo.title
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
          <Thumbnail image={trackInfo.artworkUrl} size={'4rem'}/>
          <Play weight={'fill'}/>
        </LoadingButton>
        <div className={'queue-track-text flex-container column start nowrap'}>
          <a href={trackInfo.uri} rel={'noreferrer'} target={'_blank'}><b>{trackInfo.title}</b></a>
          <span>{trackInfo.author}</span>
        </div>
      </div>
      <div className={'flex-container nowrap'}>
        <LoadingButton
          className={'queue-track-remove'}
          onClick={() => {
            const trackTitle = trackInfo.title
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
          <Trash weight={'fill'}/>
        </LoadingButton>
        <DotsSixVertical className={'queue-track-draghandle'} style={{ cursor: sortable.isDragging ? 'grabbing' : 'grab' }} {...sortable.attributes} {...sortable.listeners}/>
      </div>
    </div>
  )
}
