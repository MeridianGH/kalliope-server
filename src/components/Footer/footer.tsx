import React from 'react'
import './footer.scss'

export function Footer() {
  return (
    <footer>
      <div className={'social-icons flex-container nowrap'}>
        <a href={'https://github.com/MeridianGH/kalliope'}><i className={'fa-brands fa-github'}></i></a>
        <a href={'https://discord.gg/qX2CBrrUpf'}><i className={'fa-brands fa-discord'}></i></a>
        <a href={'mailto:meridianpy@gmail.com'}><i className={'fa-solid fa-envelope'}></i></a>
      </div>
      <span className={'small-text'}>{'Made with '}<i className={'fa-solid fa-heart'} style={{ color: 'var(--accent)' }}></i>{' using '}<i className={'fa-brands fa-react'} style={{ color: '#61dbfb' }}></i></span>
      <a href={'https://kalliope.cc'} className={'small-text'}>{'© 2023 | Meridian | All rights reserved.'}</a>
    </footer>
  )
}
