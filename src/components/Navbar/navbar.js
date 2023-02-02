import React from 'react'
import { Link } from 'react-router-dom'

import './navbar.css'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'

export function Navbar() {
  return (
    <nav className={'flex-container row space-between nowrap'}>
      <div className={'flex-container row nowrap'}>
        <img className={'nav-logo'} src={kalliopeTransparentPNG} alt={'Logo'}/>
        <h1 className={'nav-title'}>Kalliope.</h1>
      </div>
      <div className={'nav-link-container flex-container row nowrap'}>
        <Link to={'/dashboard'}>Dashboard</Link>
        <a href={'#features'}>Features</a>
        <a href={'#install'}>Install</a>
        <a href={'#commands'}>Commands</a>
        <a href={'#github'}>GitHub</a>
      </div>
    </nav>
  )
}
