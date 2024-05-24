import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import VanillaTilt from 'vanilla-tilt'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './home.scss'

export function Home() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.size > 0) {
      if (searchParams.has('logout')) { toast.success('Successfully logged out.') }
      if (searchParams.has('error')) { toast.error(`Discord authentication error:\n"${searchParams.get('error')}"`) }
      navigate('/', { replace: true })
    }
  }, [navigate, searchParams])

  useEffect(() => {
    document.querySelector<HTMLDivElement>('.features-container')!.addEventListener('mousemove', (event: MouseEvent) => {
      for (const card of document.querySelectorAll<HTMLDivElement>('.feature-card')) {
        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
      }
    })

    // noinspection JSCheckFunctionSignatures
    VanillaTilt.init(Array.from(document.querySelectorAll<HTMLElement>('.commands-container > code')), { reverse: true, startX: 10, startY: 10, scale: 1.2 })
  }, [])
  return (
    <div id={'home'}>
      <section id={'features'}>
        <h1><i className={'fas fa-th'}/>{' Features'}</h1>
        <div className={'features-container'}>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-stream'}/>
              <h2>{'Full support'}</h2>
              <p>
                {'Kalliope still offers full support for almost every platform you can imagine.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-headphones'}/>
              <h2>{'High quality'}</h2>
              <p>
                {'Kalliope is using the well established library LavaLink for high quality playback.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-search'}/>
              <h2>{'YouTube Search'}</h2>
              <p>
                {'Search up to five songs from YouTube and play one directly from Discord.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-browser'}/>
              <h2>{'Dashboard'}</h2>
              <p>
                {'Use the web dashboard to control your bot without having to type out commands ever again.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-list-music'}/>
              <h2>{'Genius Lyrics'}</h2>
              <p>
                {'Kalliope supports Genius Lyrics, directly accessible in Discord via a command.'}<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-terminal'}/>
              <h2>{'Easy commands'}</h2>
              <p>
                {'Kalliope uses slash-commands to integrate into Discord, which allows for easy command usage.'}<br/>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id={'install'} className={'diagonal'}>
        <h1><i className={'fas fa-download'}/>{' Install'}</h1>
        <div className={'flex-container column'}>
          <p>
            {'You'}
            &apos;
            {'ll need to install your own version of Kalliope in order to add it to your server.'}
            <br/>
            {'But don'}
            &apos;
            {'t worry, it'}
            &apos;
            {'s really easy and fast.'}
            <br/>
            <br/>
          </p>
          <a href={'https://github.com/MeridianGH/Kalliope#installation'} className={'cta-button'}>{'Get Started'}</a>
        </div>
      </section>
      <section id={'commands'}>
        <h1><i className={'fas fa-list-ul'}/>{' Commands'}</h1>
        <div className={'commands-container'}>
          <code>{'/play'}</code>
          <code>{'/search'}</code>
          <code>{'/lyrics'}</code>
          <code>{'/shuffle'}</code>
          <code>{'/pause'}</code>
          <code>{'/nowplaying'}</code>
          <code>{'/queue'}</code>
          <code>{'And more...'}</code>
        </div>
        <a href={'https://github.com/MeridianGH/Kalliope#commands'} className={'cta-button'}>{'View all commands'}</a>
      </section>
      <section id={'github'} className={'diagonal reverse'}>
        <h1><i className={'fab fa-github'}/>{' GitHub'}</h1>
        <div className={'flex-container column'}>
          <p>
            {'Kalliope is open-source! You can find it'}
            &apos;
            {'s source-code, releases and more info using the link below.'}
            <br/>
            {'However, please be mindful of the license if you'}
            &apos;
            {'re interested in redistributing code from the repository.'}
            <br/>
            <br/>
          </p>
          <a href={'https://github.com/MeridianGH/Kalliope'} className={'cta-button'}>{'GitHub'}</a>
        </div>
      </section>
    </div>
  )
}
