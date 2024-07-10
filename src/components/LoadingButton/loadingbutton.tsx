import React, { useCallback, useEffect } from 'react'
import './loadingbutton.scss'
import { Warning } from '@phosphor-icons/react'

type LoadingButtonProps = {
  children: React.ReactNode,
  className?: string,
  disabled?: boolean,
  onClick: () => void | Promise<void>
}

export function LoadingButton({ children, className, disabled, onClick }: LoadingButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [failure, setFailure] = React.useState(false)

  useEffect(() => {
    if (!isLoading && failure) { setTimeout(() => setFailure(false), 5000) }
  }, [isLoading, failure])

  const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    setIsLoading(true)
    setFailure(false)
    try {
      await onClick()
    } catch {
      setFailure(true)
    }
    setIsLoading(false)
  }, [onClick])

  return (
    <button className={`loading-button ${className ?? ''}`} disabled={disabled ?? isLoading} onClick={(event) => void handleClick(event)}>
      {children}
      {isLoading && (
        <div className={'button-loader-container'}>
          <svg className={'button-loader'} viewBox={'0 0 40 40'} height={'40'} width={'40'}>
            <circle className={'track'} cx={'20'} cy={'20'} r={'17.5'} pathLength={'100'} strokeWidth={'5px'} fill={'none'}/>
            <circle className={'car'} cx={'20'} cy={'20'} r={'17.5'} pathLength={'100'} strokeWidth={'5px'} fill={'none'}/>
          </svg>
        </div>)}
      {failure && <div className={'button-loader-container'}><Warning className={'button-loader-warning'} size={'2rem'} weight={'fill'}/></div>}
    </button>
  )
}
