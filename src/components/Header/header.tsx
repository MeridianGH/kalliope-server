import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Background } from '../Background/background'
import './header.scss'
import { CaretCircleDown } from '@phosphor-icons/react'

export function Header() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header')!
    const observer = new IntersectionObserver(([entry]) => {
      const scrollHint = document.querySelector<HTMLLinkElement>('.scroll-hint')
      const nav = document.querySelector<HTMLElement>('nav')
      if (!scrollHint || !nav) { return }
      scrollHint.style.opacity = entry.isIntersecting ? '1' : '0'
      entry.isIntersecting ? nav.classList.add('transparent') : nav.classList.remove('transparent')
    }, { threshold: [0.95] })
    observer.observe(header)
  }, [])
  return (
    <header className={'flex-container column nowrap'}>
      <Background style={'gradient'}/>
      <h1 className={'header-title'}>{'Kalliope.'}</h1>
      <p className={'header-slogan'}>{'Stream high quality music in your Discord server.'}</p>
      <div className={'source-icons-container flex-container'}>
        <i className={'fa-brands fa-youtube'} style={{ color: '#ff0000' }}></i>
        <i className={'fa-brands fa-spotify'} style={{ color: '#1db954' }}></i>
        <i className={'fa-brands fa-twitch'} style={{ color: '#9146ff' }}></i>
        <i className={'fa-brands fa-soundcloud'} style={{ color: '#ff8800' }}></i>
        <i className={'fa-brands fa-bandcamp'} style={{ color: '#629aa9' }}></i>
        <i className={'fa-brands fa-vimeo'} style={{ color: '#19b7ea' }}></i>
        <i className={'fa-solid fa-cloud'} style={{ color: '#f0f0f0' }}></i>
      </div>
      <Link to={'/dashboard'} className={'cta-button'}>{'Dashboard'}</Link>
      <a className={'scroll-hint'} href={'#features'} tabIndex={-1}><CaretCircleDown weight={'fill'}/></a>
    </header>
  )
}
