import React from 'react'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import usePageTitle from '../../hooks/pageTitleHook'
import Background from '../Background/background'
import Loader from '../Loader/loader'
import kalliopeTransparentPNG from '../../assets/kalliope_transparent.png'
import 'react-loading-skeleton/dist/skeleton.css'
import './dashboard.scss'

export default function DashboardFrame() {
  usePageTitle('Kalliope. | Dashboard')

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <div className={'dashboard-header flex-container space-between nowrap'}>
        <Link to={'/'} className={'dashboard-header-title flex-container'}>
          <img src={kalliopeTransparentPNG} alt={'Logo'}/>
          <span>Kalliope.</span>
        </Link>
        <Skeleton height={'2rem'} containerClassName={'skeleton'}/>
        <div className={'dashboard-header-user-container flex-container'}>
          <div className={'dashboard-header-user flex-container nowrap'}>
            <Skeleton width={'5rem'} containerClassName={'skeleton'}/>
            <Skeleton height={'2rem'} width={'2rem'} circle={true} containerClassName={'skeleton'}/>
          </div>
        </div>
      </div>
      <div className={'flex-container'}><Loader/></div>
      <div className={'flex-container'}><Loader/></div>
      <div className={'flex-container'}><Loader/></div>
      <div
        className={'player-bar'}
        style={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          zIndex: 99,
          height: '7rem',
          padding: '1rem',
          backgroundColor: 'var(--bg)',
          borderTop: '2px solid var(--accent)',
          boxSizing: 'border-box'
        }}
      >
      </div>
    </div>
  )
}
