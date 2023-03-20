import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './sidebar.css'
import kalliopeTransparentPNG from '../../../../assets/kalliope_transparent.png'
import kalliopePNG from '../../../../assets/kalliope.png'

export function Sidebar({ activeTab = 0, setActiveTab, user, player }) {
  useEffect(() => {
    document.querySelectorAll('.sidebar-link').forEach((link, index) => {
      index == activeTab ? link.classList.add('active') : link.classList.remove('active')
    })
  }, [activeTab])
  return (
    <div className={'sidebar'}>
      <button className={'menu-toggle'} onClick={() => { document.querySelector('.sidebar').classList.toggle('collapsed') }}><i className={'fad fa-chevron-left fa-fw'}/></button>
      <div className={'sidebar-links'}>
        <Link to={'/'} className={'sidebar-title'}>
          <img className={'sidebar-icon'} src={kalliopeTransparentPNG} alt={'Logo'}/>
          <span>Kalliope</span>
        </Link>
        <button className={'sidebar-link'} onClick={() => { setActiveTab(0) }}><i className={'fad fa-home fa-fw'}/><span> Home</span></button>
        <button className={'sidebar-link'} onClick={() => { setActiveTab(1) }}><i className={'fad fa-th-list fa-fw'}/><span> Servers</span></button>
        <button className={'sidebar-link'} disabled={!player} onClick={() => { setActiveTab(2) }}><i className={'fad fa-turntable fa-fw'}/><span> Player</span></button>
        <button className={'sidebar-link'} disabled={!player} onClick={() => { setActiveTab(3) }}><i className={'fad fa-list-music fa-fw'}/><span> Queue</span></button>
      </div>
      <div className={'sidebar-user'}>
        <img className={'sidebar-icon'} src={user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : kalliopePNG} alt={'Avatar'}/>
        <span>{user ? user.username : 'Logging in...'}</span>
        <Link to={'/'} className={'logout-button'} onClick={() => { localStorage.removeItem('user') }}><i className={'fad fa-sign-out-alt fa-fw'}/></Link>
      </div>
    </div>
  )
}

Sidebar.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  player: PropTypes.bool.isRequired
}
