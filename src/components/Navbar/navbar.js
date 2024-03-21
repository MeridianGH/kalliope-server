import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './navbar.scss'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'

export function Navbar({ displayLinks = false }) {
  return (
    <nav className={'navbar flex-container space-between nowrap'}>
      <Link to={'/'} className={'nav-logo-container'}>
        <div className={'flex-container nowrap'}>
          <img className={'nav-logo'} src={kalliopeTransparentPNG} alt={'Logo'}/>
          <h1 className={'nav-title'}>Kalliope.</h1>
        </div>
      </Link>
      {displayLinks ?
        <div className={'nav-link-container flex-container nowrap'}>
          <Link to={'/dashboard'}>Dashboard</Link>
          <a href={'#features'}>Features</a>
          <a href={'#install'}>Install</a>
          <a href={'#commands'}>Commands</a>
          <a href={'#github'}>GitHub</a>
        </div> : null
      }
    </nav>
  )
}

Navbar.propTypes = { displayLinks: PropTypes.bool }
