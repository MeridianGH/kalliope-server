import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import VanillaTilt from 'vanilla-tilt'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../../hooks/pageTitleHook'
import './home.scss'
import {
  AppWindow, ArrowSquareOut, Download, GithubLogo,
  Headphones, List,
  Playlist,
  SquaresFour, Terminal,
  Waveform,
  YoutubeLogo
} from '@phosphor-icons/react'

export function Home() {
  usePageTitle('Kalliope.')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.size > 0) {
      if (searchParams.has('logout')) { toast.success('Successfully logged out.') }
      if (searchParams.has('error')) { toast.error(`Discord authentication error:\n${decodeURIComponent(searchParams.get('error') ?? 'Unknown error')}`) }
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
        <div className={'flex-container nowrap'}><SquaresFour size={'3rem'} weight={'fill'}/><h1>{' Features'}</h1></div>
        <div className={'features-container'}>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <Waveform size={'5rem'} color={'var(--accent)'}/>
              <h2>{'Full support'}</h2>
              <p>
                {'Kalliope still offers full support for almost every platform you can imagine.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <Headphones size={'5rem'} color={'var(--accent)'}/>
              <h2>{'High quality'}</h2>
              <p>
                {'Kalliope is using the well established library LavaLink for high quality playback.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <YoutubeLogo size={'5rem'} color={'var(--accent)'}/>
              <h2>{'YouTube Search'}</h2>
              <p>
                {'Search up to five songs from YouTube and play one directly from Discord.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <AppWindow size={'5rem'} color={'var(--accent)'}/>
              <h2>{'Dashboard'}</h2>
              <p>
                {'Use the web dashboard to control your bot without having to type out commands ever again.\r'}
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <Playlist size={'5rem'} color={'var(--accent)'}/>
              <h2>{'Genius Lyrics'}</h2>
              <p>
                {'Kalliope supports Genius Lyrics, directly accessible in Discord via a command.'}<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <Terminal size={'5rem'} color={'var(--accent)'}/>
              <h2>{'Easy commands'}</h2>
              <p>
                {'Kalliope uses slash-commands to integrate into Discord, which allows for easy command usage.'}<br/>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id={'install'} className={'diagonal'}>
        <div className={'flex-container nowrap'}><Download size={'3rem'} weight={'fill'}/><h1>{' Install'}</h1></div>
        <div className={'flex-container column'}>
          <p>
            {'You\'ll need to install your own version of Kalliope in order to add it to your server.'}
            <br/>
            {'But don\'t worry, it\'s really easy and fast.'}
            <br/>
            <br/>
          </p>
          <a href={'https://github.com/MeridianGH/kalliope#installation'} className={'cta-button flex-container nowrap'}>
            {'Get Started'}
            <ArrowSquareOut/>
          </a>
        </div>
      </section>
      <section id={'commands'}>
        <div className={'flex-container nowrap'}>
          <List size={'3rem'} weight={'fill'}/>
          <h1>{' Commands'}</h1>
        </div>
        <div className={'commands-container'}>
          {['/play', '/search', '/lyrics', '/shuffle', '/pause', '/nowplaying', '/queue', '/filter', '/autoplay', '/sponsorblock', '/skip', '/previous', '/seek', '/clear', '/volume', '/repeat', 'And more...']
            .map((command, index) => <code key={index}>{command}</code>
            )}
        </div>
        <a href={'https://github.com/MeridianGH/kalliope#commands'} className={'cta-button flex-container nowrap'}>
          {'View all commands'}
          <ArrowSquareOut/>
        </a>
      </section>
      <section id={'github'} className={'diagonal reverse'}>
        <div className={'flex-container nowrap'}>
          <GithubLogo size={'3rem'} weight={'duotone'}/>
          <h1>{' GitHub'}</h1>
        </div>
        <div className={'flex-container column'}>
          <p>
            {'Kalliope is open-source! You can find it\'s source-code, releases and more info using the link below.'}
            <br/>
            {'However, please be mindful of the license if you\'re interested in redistributing code from the repository.'}
            <br/>
            <br/>
          </p>
          <a href={'https://github.com/MeridianGH/kalliope'} className={'cta-button flex-container nowrap'}>
            {'GitHub'}
            <ArrowSquareOut/>
          </a>
        </div>
      </section>
    </div>
  )
}
