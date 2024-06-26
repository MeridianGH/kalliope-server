import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Nullable, User } from '../../../types/types'
import kalliopeTransparentPNG from '../../../assets/kalliope_transparent.png'
import kalliopePNG from '../../../assets/kalliope.png'
import './sidebar.scss'

export type SidebarProps = {
  activeTab: number,
  setActiveTab: (tab: number) => void,
  user: Nullable<User>,
  hasPlayer: boolean
}

export function Sidebar({ activeTab = 0, setActiveTab, user, hasPlayer }: SidebarProps) {
  function toggleCollapsed() {
    document.querySelector<HTMLDivElement>('.sidebar')!.classList.toggle('collapsed')
  }
  function linkHandler(tab: number) {
    setActiveTab(tab)
    if (screen.width <= 768) { toggleCollapsed() }
  }
  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('.sidebar-link').forEach((link, index) => {
      index === activeTab ? link.classList.add('active') : link.classList.remove('active')
    })
  }, [activeTab])
  // noinspection JSUnresolvedReference
  return (
    <div className={'sidebar'}>
      <button className={'menu-toggle'} onClick={toggleCollapsed}>
        <i className={'fad fa-chevron-left fa-fw'}></i>
        <i className={'fad fa-bars fa-fw'}></i>
      </button>
      <div className={'sidebar-links'}>
        <Link to={'/'} className={'sidebar-title'}>
          <img className={'sidebar-icon'} src={kalliopeTransparentPNG} alt={'Logo'}/>
          <span>{'Kalliope.'}</span>
        </Link>
        <button className={'sidebar-link'} onClick={() => { linkHandler(0) }}><i className={'fad fa-home fa-fw'}></i><span>{' Home'}</span></button>
        <button className={'sidebar-link'} onClick={() => { linkHandler(1) }}><i className={'fad fa-th-list fa-fw'}></i><span>{' Servers'}</span></button>
        <button className={'sidebar-link'} disabled={!hasPlayer} onClick={() => { linkHandler(2) }}><i className={'fad fa-turntable fa-fw'}></i><span>{' Player'}</span></button>
        <button className={'sidebar-link'} disabled={!hasPlayer} onClick={() => { linkHandler(3) }}><i className={'fad fa-list-music fa-fw'}></i><span>{' Queue'}</span></button>
      </div>
      <div className={'sidebar-user'}>
        <img className={'sidebar-icon'} src={user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}` : kalliopePNG} alt={'Avatar'}/>
        <span>{user?.global_name ?? 'Logging in...'}</span>
        <Link to={'/?logout'} className={'sidebar-link logout-button'} onClick={() => { localStorage.removeItem('user') }}><i className={'fad fa-sign-out-alt fa-fw'}></i><span>{' Logout'}</span></Link>
      </div>
    </div>
  )
}
