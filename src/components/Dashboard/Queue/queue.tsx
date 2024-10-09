import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { toast } from 'react-toastify'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { QueueTrack } from '../QueueTrack/queuetrack'
import { Nullable, Track } from '../../../types/types'
import { Playlist } from '@phosphor-icons/react'
import './queue.scss'

export type QueueProps = {
  guildId: Nullable<string>,
  tracks: Nullable<Track[]>
}

export function Queue({ guildId, tracks }: QueueProps) {
  const webSocket = useContext(WebSocketContext)
  const [items, setItems] = useState<number[] | undefined>()
  const timeoutId = useRef<number>()

  const [prevTracks, setPrevTracks] = useState<Nullable<Track[]>>()
  if (tracks !== prevTracks) {
    setPrevTracks(tracks)
    setItems(Array.from({ length: tracks?.length ?? 0 }, (_, i) => i + 1))
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    if (!items || items.length === 0) { return }

    const progress = document.querySelector<HTMLDivElement>('.queue-reorder-container')!

    if (items.every((id, index) => id - 1 === index)) {
      progress.classList.remove('reordering')
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = undefined
      }
      return
    }

    function requestReorder() {
      if (!webSocket || !guildId) { return }
      if (!items || items.length === 0) { return }
      if (items.every((id, index) => id - 1 === index)) { return }

      void toast.promise(webSocket.request({
        type: 'requestPlayerAction',
        guildId: guildId,
        action: 'reorder',
        payload: { indices: items }
      }, true), {
        pending: 'Reordering queue...',
        error: 'Failed to reorder queue.',
        success: 'Successfully reordered queue.'
      })
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }
    progress.classList.add('reordering')
    const progressBar = document.querySelector<HTMLDivElement>('.queue-reorder-progress')!
    progressBar.animate([{ width: '100%' }, { width: '0' }], { duration: 5000, fill: 'forwards' })
    timeoutId.current = setTimeout(requestReorder, 5000)
  }, [guildId, items, webSocket])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const target = event.activatorEvent.target as HTMLElement
    target.blur()

    if (over !== null && active.id !== over.id) {
      setItems((items) => {
        if (!items) { return }
        const oldIndex = items.indexOf(active.id as number)
        const newIndex = items.indexOf(over.id as number)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  if (!guildId) {
    return (
      <div className={'queue-container flex-container'}>
        <p>{'Select a server using the list on the left to view the queue.'}</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className={'queue-container flex-container column start nowrap'}>
        <div className={'flex-container nowrap'}>
          <Playlist/>
          <h5 className={'queue-title'}>{'Queue'}</h5>
        </div>
        {items && items.length > 0 && items.length === (tracks?.length ?? 0) ?
          (
            <div className={'queue-tracks-list'}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((id) => <QueueTrack key={id} index={id - 1} guildId={guildId} trackInfo={tracks![id - 1].info}/>)}
              </SortableContext>
            </div>
          ) :
          (
            <div className={'queue-item flex-container'}>
              {'No upcoming songs! Add songs with \'/play\' or by using the field on the right.'}
            </div>
          )}
        <div className={'queue-reorder-container flex-container'}>
          {'Reordering...'}
          <div className={'queue-reorder-progress'}></div>
        </div>
      </div>
    </DndContext>
  )
}
