import React, {
  ComponentProps,
  createContext,
  FC,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useReducer
} from 'react'
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

type toastReducerAddAction = { type: 'ADD', payload: Omit<ToastProps, 'id'> }
type toastReducerRemoveAction = { type: 'REMOVE', payload: number }
type toastReducerActionType = toastReducerAddAction | toastReducerRemoveAction


function toastReducer(state: { toasts: ToastProps[] }, action: toastReducerActionType) {
  let id: ToastProps['id']
  switch (action.type) {
    case 'ADD':
      id = Math.floor(Math.random() * 10000000)
      while (state.toasts.map((toast) => toast.id).includes(id)) {
        id = Math.floor(Math.random() * 10000000)
      }
      return { toasts: [...state.toasts, Object.assign(action.payload, { id: id })] }
    case 'REMOVE':
      return { toasts: state.toasts.filter((toast) => toast.id !== action.payload) }
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] })

  const addToast = useCallback((type: ToastProps['type'], message: ToastProps['message'], persistent?: ToastProps['persistent'], onDismiss?: ToastProps['onDismiss']) => {
    dispatch({ type: 'ADD', payload: { type: type, message: message, persistent: persistent, onDismiss: onDismiss } })
  }, [])

  const info: toastContextType['info'] = useCallback((message) => {
    addToast('info', message)
  }, [addToast])

  const success: toastContextType['success'] = useCallback((message) => {
    addToast('success', message)
  }, [addToast])

  const warn: toastContextType['warn'] = useCallback((message) => {
    addToast('warn', message)
  }, [addToast])

  const error: toastContextType['error'] = useCallback((message) => {
    addToast('error', message)
  }, [addToast])

  const persistent: toastContextType['persistent'] = useCallback((type, message, onDismiss) => {
    // if (state.toasts.filter((toast) => toast.message === message).length > 0) { return -1 }
    addToast(type, message, true, onDismiss)
  }, [addToast])

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
