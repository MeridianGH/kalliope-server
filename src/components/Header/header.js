import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './header.css'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'

export function Header() {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const element = document.querySelector('.scroll-hint')
      if (!element) { return }
      // noinspection JSUnresolvedVariable
      element.style.opacity = entry.isIntersecting ? '1' : '0'
    }, { threshold: [0.95] })
    observer.observe(document.querySelector('header'))
  })
  return (
    <header>
      <div className={'header-container flex-container column nowrap'}>
        <img className={'header-title-logo'} src={kalliopeTransparentPNG} alt={'Logo'}/>
        <h1 className={'header-title'}>Kalliope.</h1>
        <p className={'header-slogan'}>A Discord music bot that still supports all platforms.</p>
        <div className={'source-icons-container flex-container row'}>
          <i className={'fab fa-youtube'} style={{ color: '#ff0000' }}/>
          <i className={'fab fa-spotify'} style={{ color: '#1db954' }}/>
          <i className={'fab fa-soundcloud'} style={{ color: '#ff8800' }}/>
          <i className={'fab fa-bandcamp'} style={{ color: '#629aa9' }}/>
          <i className={'fab fa-twitch'} style={{ color: '#9146FF' }}/>
          <i className={'fab fa-vimeo'} style={{ color: '#19b7ea' }}/>
          <i className={'fas fa-cloud-music'} style={{ color: '#f0f0f0' }}/>
        </div>
        <Link to={'/dashboard'}><div className={'dashboard-button'}>Dashboard.</div></Link>
        <a className={'scroll-hint'} href={'#features'}><i className={'fas fa-chevron-down'}/> Scroll</a>
      </div>
    </header>
  )
}
