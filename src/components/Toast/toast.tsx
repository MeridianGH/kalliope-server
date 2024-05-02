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
    if (!progressRef.current) { return }
    progressRef.current.style.animationPlayState = 'paused'
    clearTimeout(timeoutRef.current)
  }
  function handleMouseLeave() {
    if (!progressRef.current) { return }
    progressRef.current.style.animationPlayState = 'running'
    const remaining = progressRef.current.offsetWidth / (progressRef.current.parentElement?.offsetWidth ?? 1) * 5000
    timeoutRef.current = setTimeout(() => handleDismiss(), remaining)
  }

  useEffect(() => {
    timeoutRef.current = setTimeout(() => handleDismiss(), 5000)
    return () => { clearTimeout(timeoutRef.current) }
  }, [handleDismiss])

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
