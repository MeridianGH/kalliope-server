import React, { useEffect } from 'react'
import { Header } from '../Header/header.js'
import './home.css'

export function Home() {
  useEffect(() => {
    document.querySelector('.features-container').onmousemove = (event) => {
      for (const card of document.querySelectorAll('.feature-card')) {
        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        card.style.setProperty('--mouse-x', `${x}px`)
        card.style.setProperty('--mouse-y', `${y}px`)
      }
    }
  }, [])
  return (
    <div id={'home'}>
      <Header/>
      <section id={'features'}>
        <h1><i className={'fas fa-th'}/> Features</h1>
        <div className={'features-container'}>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-stream'}></i>
              <h2>Full support</h2>
              <p>
                Kalliope still offers full support for almost every platform you can imagine:<br/>
                YouTube, Spotify, Twitch and many others!<br/>
                It also supports playlists, livestreams and HTTP sources.<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-headphones'}></i>
              <h2>High quality</h2>
              <p>
                Kalliope is using the well established Lavalink library.<br/>
                It allows for high quality playback by hosting its own audio server and streaming directly to Discord.<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-search'}></i>
              <h2>YouTube Search</h2>
              <p>
                Search up to five songs from YouTube and play one directly from Discord, without ever opening a browser!
                Playing music in your channel was never this easy.
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-window-maximize'}></i>
              <h2>Dashboard</h2>
              <p>
                Use the web dashboard to control your bot without having to type out commands ever again.<br/>
                You can even use your keyboard&apos;s built-in music buttons to skip songs and pause or resume playback.<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-list-music'}></i>
              <h2>Genius Lyrics</h2>
              <p>
                Kalliope supports Genius Lyrics! Quite literally actually, because they are directly accessible in Discord itself via a command.<br/>
              </p>
            </div>
          </div>
          <div className={'feature-card'}>
            <div className={'feature-card-content'}>
              <i className={'fad fa-terminal'}></i>
              <h2>Easy commands</h2>
              <p>
                Kalliope uses slash-commands to integrate into Discord, which allows for easy command usage.<br/>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id={'install'}>
        <h1><i className={'fas fa-download'}/> Install</h1>
        <div>
          <p>
            You&apos;ll need to install your own version of Kalliope in order to add it to your server.
            But don&apos;t worry, it&apos;s really easy and fast. In four easy steps you&apos;ll have your own version ready in no time:
          </p>
          <details>
            <summary>
              <span>Prerequisites</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Download and install the latest versions of <a className={'underline'} href={'https://nodejs.org/en/download/'}>Node.js</a> and <a className={'underline'} href={'https://www.oracle.com/java/technologies/downloads/'}>Java</a>.<br/><br/>
              Make sure Java is installed properly by running <code>java --version</code> in your terminal. If it displays the correct version, you are good to go!<br/><br/>
              If you encounter any issues with playback, try installing OpenJDK 13.0.2 instead of the latest Java version. Instructions on how to do that can be found <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope#installation'}>here</a>.
            </span>
          </details>
          <details>
            <summary>
              <span>Getting started</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Download and install the latest version of Kalliope using git:
              <code>
                git clone https://github.com/MeridianGH/kalliope.git<br/>
                cd kalliope<br/>
                npm install<br/>
              </code>
              Alternatively use <a className={'underline'} href={'https://desktop.github.com/'}>GitHub Desktop</a> or download as <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope/archive/refs/heads/main.zip'}>.zip</a>.
            </span>
          </details>
          <details>
            <summary>
              <span>Configuration</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Rename &apos;config_example.json&apos; to &apos;config.json&apos; and replace the placeholders inside with your info.<br/>
              Guides on how to get these values are available <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope#configuration'}>here</a>.
            </span>
          </details>
          <details>
            <summary>
              <span>Run</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Start the bot using:
              <code>node .</code>
            </span>
          </details>
        </div>
      </section>
      <section id={'commands'}>
        <h1><i className={'fas fa-list-ul'}/> Commands</h1>
        <div className={'commands-container flex-container column'}>
          <p><span>/play</span><span>/search</span><span>/lyrics</span><span>/shuffle</span><span>/pause</span><span>/nowplaying</span><span>/queue</span><span>And more...</span></p>
          <a href={'https://github.com/MeridianGH/Kalliope'}><div className={'dashboard-button'}>View all commands</div></a>
        </div>
      </section>
      <section id={'github'}>
        <h1><i className={'fab fa-github'}/> GitHub</h1>
        <div className={'flex-container column'}>
          <p>
            Kalliope is open-source! You can find it&apos;s source-code, releases and more info using the link below.<br/>
            However, please be mindful of the license if you&apos;re interested in redistributing code from the repository.<br/><br/>
          </p>
          <a href={'https://github.com/MeridianGH/Kalliope'}><div className={'dashboard-button'}>GitHub</div></a>
        </div>
      </section>
    </div>
  )
}
