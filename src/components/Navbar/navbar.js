import React from 'react'

import './navbar.css'

export function Navbar() {
  return (
    <nav className={'flex-container row space-between nowrap'}>
      <div className={'flex-container row nowrap'}>
        <img className={'nav-logo'} src={'../../assets/kalliope_transparent.png'} alt={'Logo'}/>
        <h1 className={'nav-title'}>Kalliope.</h1>
      </div>
      <div className={'nav-link-container flex-container row nowrap'}>
        <a className={'nav-link'} href={'#features'}>Features</a>
        <a className={'nav-link'} href={'#install'}>Install</a>
        <a className={'nav-link'} href={'#commands'}>Commands</a>
        <a className={'nav-link'} href={'#github'}>GitHub</a>
      </div>
    </nav>
  )
}
