import React from 'react'
import './start.css'

export function Start() {
  return (
    <div className={'start-container flex-container column'}>
      <div className={'flex-container'}>
        <a href={'https://youtube.com'} className={'source'} style={{ backgroundColor: '#ff0000' }}><i className={'fab fa-youtube'}/></a>
        <a href={'https://spotify.com'} className={'source'} style={{ backgroundColor: '#1db954' }}><i className={'fab fa-spotify'}/></a>
        <a href={'https://twitch.tv'} className={'source'} style={{ backgroundColor: '#9146ff' }}><i className={'fab fa-twitch'}/></a>
        <a href={'https://soundcloud.com'} className={'source'} style={{ backgroundColor: '#ff8800' }}><i className={'fab fa-soundcloud'}/></a>
        <a href={'https://bandcamp.com'} className={'source'} style={{ backgroundColor: '#629aa9' }}><i className={'fab fa-bandcamp'}/></a>
        <a href={'https://vimeo.com'} className={'source'} style={{ backgroundColor: '#19b7ea' }}><i className={'fab fa-vimeo'}/></a>
      </div>
    </div>
  )
}
