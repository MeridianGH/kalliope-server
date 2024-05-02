import React from 'react'
import { Toast, ToastProps } from '../Toast/toast'
import './toastContainer.scss'

interface ToastsContainerProps {
  toasts: ToastProps[]
}

export function ToastContainer({ toasts }: ToastsContainerProps) {
  return (
    <div className={'toasts-container'}>
      {toasts.map((toast) => <Toast key={toast.id} {...toast} />)}
    </div>
  )
}
