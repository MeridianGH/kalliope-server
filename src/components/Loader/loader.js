import React from 'react'
import './loader.scss'

export function Loader() {
  return (
    <div className={'loader'}>
      <svg className={'gooey-filter'} width={'0'} height={'0'} xmlns={'http://www.w3.org/2000/svg'} version={'1.1'}>
        <defs>
          <filter id={'goo'}>
            <feGaussianBlur in={'SourceGraphic'} stdDeviation={'12'} result={'blur'}/>
            <feColorMatrix in={'blur'} mode={'matrix'} values={'1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12'} result={'goo'}/>
            <feComposite in={'SourceGraphic'} in2={'goo'} operator={'atop'}/>
          </filter>
        </defs>
      </svg>
      <div className={'dot animated'}/>
      <div className={'dot'}/>
    </div>
  )
}
