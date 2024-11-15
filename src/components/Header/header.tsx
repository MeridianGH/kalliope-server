import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CaretCircleDown, Cloud } from '@phosphor-icons/react'
import { SiBandcamp, SiSoundcloud, SiSpotify, SiTwitch, SiVimeo, SiYoutube } from '@icons-pack/react-simple-icons'
import Background from '../Background/background'
import './header.scss'

export default function Header() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('header')!
    const observer = new IntersectionObserver(([entry]) => {
      const scrollHint = document.querySelector<HTMLLinkElement>('.scroll-hint')
      const nav = document.querySelector<HTMLElement>('nav')
      if (!scrollHint || !nav) { return }
      scrollHint.style.opacity = entry.isIntersecting ? '1' : '0'
      if (entry.isIntersecting) {
        nav.classList.add('transparent')
      } else {
        nav.classList.remove('transparent')
      }
    }, { threshold: [0.95] })
    observer.observe(header)
  }, [])
  return (
    <header className={'flex-container column nowrap'}>
      <Background style={'gradient'}/>
      <h1 className={'header-title'}>Kalliope.</h1>
      <p className={'header-slogan'}>Stream high quality music in your Discord server.</p>
      <div className={'source-icons-container flex-container'}>
        <SiYoutube color={'default'} size={'2rem'}/>
        <SiSpotify color={'default'} size={'2rem'}/>
        <SiTwitch color={'default'} size={'2rem'}/>
        <SiSoundcloud color={'default'} size={'2rem'}/>
        <SiBandcamp color={'default'} size={'2rem'}/>
        <SiVimeo color={'default'} size={'2rem'}/>
        <Cloud weight={'fill'} size={'2rem'}/>
      </div>
      <Link to={'/dashboard'} className={'cta-button'}>Dashboard</Link>
      <a className={'scroll-hint'} href={'#features'} tabIndex={-1}><CaretCircleDown weight={'fill'}/></a>
    </header>
  )
}
