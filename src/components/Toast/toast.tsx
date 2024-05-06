import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useToasts } from '../../hooks/toastHook'
import './toast.scss'

export interface ToastProps {
  id: number,
  type: 'info' | 'success' | 'warn' | 'error',
  message: string,
  persistent?: boolean,
  onDismiss?: (toast: ToastProps) => unknown
}

export function Toast({ id, type = 'info', message, persistent = false, onDismiss }: ToastProps) {
  const toasts = useToasts()
  const timeoutRef = useRef<number | undefined>()
  const progressRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState<boolean>(false)
  const [remainingTime, setRemainingTime] = useState<number>()

  const handleDismiss = useCallback((force= false) => {
    if (!persistent || force) {
      setDismissed(true)
      setTimeout(() => {
        toasts.remove(id)
      }, 500)
      if (onDismiss) { onDismiss({ id, type, message, persistent, onDismiss }) }
    }
  }, [persistent, onDismiss, toasts, id, type, message])

  function handleMouseEnter() {
    if (persistent || !progressRef.current) { return }
    progressRef.current.style.animationPlayState = 'paused'
    setRemainingTime(progressRef.current.offsetWidth / (progressRef.current.parentElement?.offsetWidth ?? 1) * 5000)
    clearTimeout(timeoutRef.current)
  }
  function handleMouseLeave() {
    if (persistent || !progressRef.current) { return }
    progressRef.current.style.animationPlayState = 'running'
    timeoutRef.current = setTimeout(handleDismiss, remainingTime)
  }

  useEffect(() => {
    if (persistent) { return }
    const remaining = progressRef.current ? progressRef.current.offsetWidth / (progressRef.current.parentElement?.offsetWidth ?? 1) * 5000 : 5000
    timeoutRef.current = setTimeout(handleDismiss, remaining)
    return () => {
      clearTimeout(timeoutRef.current)
      setRemainingTime(remaining)
    }
  }, [handleDismiss, persistent])

  const icon =
        type === 'info' ? 'fa-info-circle' :
          type === 'success' ? 'fa-check-circle' :
            type === 'warn' ? 'fa-exclamation-circle' :
              type === 'error' ? 'fa-times-circle' : ''

  return (
    <div className={`toast ${type} ${persistent ? 'persistent' : ''} ${dismissed ? 'dismissed' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <i className={`far ${icon}`}/>
      <span>{message}</span>
      <button className={'toast-dismiss-button'} onClick={() => handleDismiss(true)}><i className={'fas fa-times'}/></button>
      <div ref={progressRef} className={'toast-progress-bar'}/>
    </div>
  )
}
