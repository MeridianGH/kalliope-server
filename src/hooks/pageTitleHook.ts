import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export function usePageTitle(title: string) {
  const location = useLocation()
  useEffect(() => {
    document.title = title
  }, [location, title])
}
