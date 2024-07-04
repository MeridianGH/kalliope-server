import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Id, toast } from 'react-toastify'
import { WebSocketContext } from '../../../contexts/websocketContext'
import { QueueTrack } from '../QueueTrack/queuetrack'
import { Nullable, Track } from '../../../types/types'
import { Playlist } from '@phosphor-icons/react'
import './queue.scss'

type QueueProps = {
  guildId: Nullable<string>,
  tracks: Nullable<Track[]>
}

export function Queue({ guildId, tracks }: QueueProps) {
  const webSocket = useContext(WebSocketContext)
  const [items, setItems] = useState(Array.from({ length: tracks?.length ?? 0 }, (_, i) => i + 1))
  const toastId = useRef<Id>()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    setItems(Array.from({ length: tracks?.length ?? 0 }, (_, i) => i + 1))
  }, [tracks?.length])

  const handleToastClose = useCallback(() => {
    if (!webSocket || !guildId) { return }
    if (items.every((id, index) => id - 1 === index)) { return }
    if (items) {
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
  }, [guildId, items, webSocket])

  useEffect(() => {
    console.log(items)
    if (items.every((id, index) => id - 1 === index)) {
      console.log('no change')
      if (toastId.current) {
        toast.dismiss(toastId.current)
        toastId.current = undefined
      }
      return
    }

    if (toastId.current) {
      toast.update(toastId.current, { autoClose: 5000 })
    } else {
      toastId.current = toast.info('Reordering queue...', { closeButton: false, autoClose: 5000, onClose: handleToastClose })
    }
  }, [handleToastClose, items])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      setItems((items) => {
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
    <div className={'queue-container flex-container column start nowrap'}>
      <div className={'flex-container nowrap'}>
        <Playlist/>
        <h5 className={'queue-title'}>{'Queue'}</h5>
      </div>
      {items.length > 0 ?
        (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((id) => <QueueTrack key={id} index={id - 1} guildId={guildId} trackInfo={tracks![id - 1].info}/>)}
              </SortableContext>
            </DndContext>
          </>
        ) :
        (
          <div className={'queue-item flex-container'}>
            {'No upcoming songs! Add songs with \'/play\' or by using the field on the right.'}
          </div>
        )}
    </div>
  )
}
