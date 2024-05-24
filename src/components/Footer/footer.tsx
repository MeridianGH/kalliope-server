import React from 'react'
import './footer.scss'

export function Footer() {
  return (
    <footer>
      <div className={'social-icons flex-container nowrap'}>
        <a href={'https://github.com/MeridianGH/Kalliope'}><i className={'fab fa-github'}/></a>
        <a href={'https://discord.gg/qX2CBrrUpf'}><i className={'fab fa-discord'}/></a>
        <a href={'mailto:meridianpy@gmail.com'}><i className={'fas fa-envelope'}/></a>
        <a href={'https://twitter.com/meridian_0'}><i className={'fab fa-twitter'}/></a>
      </div>
      <span className={'small-text'}>{'Made with '}<i className={'fas fa-heart'} style={{ color: 'var(--accent)' }}/>{' using '}<i className={'fab fa-react'} style={{ color: '#61dbfb' }}/></span>
      <a href={'https://kalliope.cc'} className={'small-text'}>{'© 2023 | Meridian | All rights reserved.'}</a>
    </footer>
  )
}
