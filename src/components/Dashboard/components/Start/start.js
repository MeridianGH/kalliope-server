import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './start.css'

export function Start({ setActiveTab, player }) {
  return (
    <div className={'start-container flex-container column'}>
      <h1>Welcome to the Kalliope Dashboard!</h1>
      <div className={'dashboard-links-container'}>
        <Link to={'/'} className={'dashboard-link'}><i className={'fad fa-door-open'}/><p>Back to homepage</p></Link>
        <button className={'dashboard-link'} onClick={() => { setActiveTab(1) }}><i className={'fad fa-th-list'}/><p>Servers</p></button>
        <button className={'dashboard-link'} disabled={!player} onClick={() => { setActiveTab(2) }}><i className={'fad fa-turntable'}/><p>Player</p></button>
        <button className={'dashboard-link'} disabled={!player} onClick={() => { setActiveTab(3) }}><i className={'fad fa-list-music'}/><p>Queue</p></button>
      </div>
      <p>Quick links to the most common sources used:</p>
      <div className={'flex-container'}>
        <a href={'https://youtube.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#ff0000' }} rel="noreferrer"><i className={'fab fa-youtube'}/></a>
        <a href={'https://spotify.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#1db954' }} rel="noreferrer"><i className={'fab fa-spotify'}/></a>
        <a href={'https://twitch.tv'} target={'_blank'} className={'source'} style={{ backgroundColor: '#9146ff' }} rel="noreferrer"><i className={'fab fa-twitch'}/></a>
        <a href={'https://soundcloud.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#ff8800' }} rel="noreferrer"><i className={'fab fa-soundcloud'}/></a>
        <a href={'https://bandcamp.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#629aa9' }} rel="noreferrer"><i className={'fab fa-bandcamp'}/></a>
        <a href={'https://vimeo.com'} target={'_blank'} className={'source'} style={{ backgroundColor: '#19b7ea' }} rel="noreferrer"><i className={'fab fa-vimeo'}/></a>
      </div>
    </div>
  )
}

Start.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  player: PropTypes.bool.isRequired
}
