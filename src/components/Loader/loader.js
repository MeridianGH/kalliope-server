import React from 'react'
import './loader.scss'

export function Loader() {
  return (
    <div className={'loader'}>
      <div className={'bar'}></div>
      <div className={'bar'}></div>
      <div className={'bar'}></div>
      <div className={'bar'}></div>
    </div>
  )
}
