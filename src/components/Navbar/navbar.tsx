import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.scss'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'

export type NavbarProps = {
  displayLinks?: boolean,
  hideOnMobile?: boolean
}

export function Navbar({ displayLinks = false, hideOnMobile = true }: NavbarProps) {
  return (
    <nav className={`navbar flex-container space-between nowrap ${hideOnMobile ? 'hideOnMobile' : ''}`}>
      <Link to={'/'} className={'nav-logo-container'}>
        <div className={'flex-container nowrap'}>
          <img className={'nav-logo'} src={kalliopeTransparentPNG} alt={'Logo'}/>
          <h1 className={'nav-title'}>{'Kalliope.'}</h1>
        </div>
      </Link>
      {displayLinks && hideOnMobile ?
        (
          <div className={'nav-link-container flex-container nowrap'}>
            <Link to={'/dashboard'}>{'Dashboard'}</Link>
            <Link to={'/statistics'}>{'Statistics'}</Link>
            <div className={'nav-separator'}></div>
            <a href={'#features'}>{'Features'}</a>
            <a href={'#install'}>{'Install'}</a>
            <a href={'#commands'}>{'Commands'}</a>
            <a href={'#github'}>{'GitHub'}</a>
          </div>
        ) :
        null}
    </nav>
  )
}
