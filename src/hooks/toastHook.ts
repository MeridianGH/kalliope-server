import { useContext } from 'react'
import { ToastContext } from '../contexts/toastContext'

export function useToasts() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToasts must be within ToastProvider')
  }
  return context
}
