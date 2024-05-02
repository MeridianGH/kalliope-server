import React, { createContext, ReactElement, useReducer } from 'react'
import { ToastContainer } from '../components/ToastContainer/toastContainer'
import { ToastProps } from '../components/Toast/toast'

type toastContextType = {
  info: (message: ToastProps['message']) => void,
  success: (message: ToastProps['message']) => void,
  warn: (message: ToastProps['message']) => void,
  error: (message: ToastProps['message']) => void,
  persistent: (type: ToastProps['type'], message: ToastProps['message'], onDismiss?: ToastProps['onDismiss']) => void,
  remove: (id: ToastProps['id']) => void
}

export const ToastContext = createContext<toastContextType | undefined>(undefined)

type toastReducerAddAction = { type: 'ADD', payload: ToastProps }
type toastReducerRemoveAction = { type: 'REMOVE', payload: number }
type toastReducerActionType = toastReducerAddAction | toastReducerRemoveAction


function toastReducer(state: { toasts: ToastProps[] }, action: toastReducerActionType) {
  switch (action.type) {
    case 'ADD':
      return { toasts: [...state.toasts, action.payload] }
    case 'REMOVE':
      return { toasts: state.toasts.filter((toast) => toast.id !== action.payload) }
  }
}

export function ToastProvider({ children }: { children: ReactElement }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  function addToast(type: ToastProps['type'], message: ToastProps['message'], persistent?: ToastProps['persistent'], onDismiss?: ToastProps['onDismiss']) {
    let id = Math.floor(Math.random() * 10000000)
    while (state.toasts.map((toast) => toast.id).includes(id)) {
      id = Math.floor(Math.random() * 10000000)
    }
    dispatch({ type: 'ADD', payload: { id: id, type: type, message: message, persistent: persistent, onDismiss: onDismiss } })
    return id
  }

  const info: toastContextType['info'] = (message) => addToast('info', message)

  const success: toastContextType['success'] = (message) => addToast('success', message)

  const warn: toastContextType['warn'] = (message) => addToast('warn', message)

  const error: toastContextType['error'] = (message) => addToast('error', message)

  const persistent: toastContextType['persistent'] = (type, message, onDismiss) => addToast(type, message, true, onDismiss)

  const remove: toastContextType['remove'] = (id) => {
    dispatch({ type: 'REMOVE', payload: id })
  }

  return (
    <ToastContext.Provider value={{ info, success, warn, error, persistent, remove }}>
      <ToastContainer toasts={state.toasts}/>
      {children}
    </ToastContext.Provider>
  )
}
