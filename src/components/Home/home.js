import React, { useEffect } from 'react'
import { Header } from '../Header/header.js'
import {
  DiscordActionRow,
  DiscordAttachments,
  DiscordButton,
  DiscordCommand,
  DiscordEmbed,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
  DiscordMessage,
  DiscordMessages
} from '@skyra/discord-components-react'
import './home.css'
import kalliopePNG from '../../assets/kalliope.png'
import playPause from '../../assets/emojis/play_pause.svg'
import stopButton from '../../assets/emojis/stop_button.svg'
import trackNext from '../../assets/emojis/track_next.svg'
import trackPrevious from '../../assets/emojis/track_previous.svg'
import { Link } from 'react-router-dom'

export function Home() {
  window.$discordMessage = {
    profiles: {
      kalliope: {
        author: 'Kalliope',
        avatar: kalliopePNG,
        bot: true,
        roleColor: '#ffffff'
      },
      meridian: {
        author: 'Meridian',
        avatar: 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.png',
        roleColor: '#ff0000'
      }
    }
  }
  useEffect(() => {
    function resizeElements() {
      document.querySelectorAll('.discord-messages').forEach((element) => {
        element.style.marginBottom = 0 - element.offsetHeight * (1 - getComputedStyle(element).getPropertyValue('--scale')) + 'px'
      })
    }
    window.onload = resizeElements
    window.onresize = resizeElements
    resizeElements()
  }, [])
  return (
    <div id={'home'}>
      <Header/>
      <section id={'features'}>
        <h1><i className={'fas fa-th'}/> Features</h1>
        <div>
          <h2>Full support</h2>
          <p>
            Kalliope still offers full support for almost every platform you can imagine:<br/>
            YouTube, Spotify<span style={{ color: 'gray' }}>*</span>, Twitch and many others!<br/>
            It also supports playlists, livestreams and HTTP sources.<br/>
            <span className={'small-text'}>* Spotify queries will be resolved on YouTube.</span>
          </p>
          <DiscordMessages>
            <DiscordMessage profile={'kalliope'}>
              <DiscordCommand slot={'reply'} profile={'meridian'} command={'/play'}></DiscordCommand>
              <DiscordEmbed
                slot={'embeds'}
                authorImage={'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.png'}
                authorName={'Added to queue.'}
                embedTitle={'Jim Yosef x RIELL - Animal (Lyric Video)'}
                url={'https://www.youtube.com/watch?v=QQX2hpmtMJs'}
                thumbnail={'https://img.youtube.com/vi/QQX2hpmtMJs/maxresdefault.jpg'}
              >
                <DiscordEmbedFields slot={'fields'}>
                  <DiscordEmbedField inline inlineIndex={1} fieldTitle={'Duration'}>2:57</DiscordEmbedField>
                  <DiscordEmbedField inline inlineIndex={2} fieldTitle={'Author'}>Jim Yosef</DiscordEmbedField>
                  <DiscordEmbedField inline inlineIndex={3} fieldTitle={'Position'}>0</DiscordEmbedField>
                </DiscordEmbedFields>
                <DiscordEmbedFooter slot={'footer'} footerImage={kalliopePNG}>Kalliope.</DiscordEmbedFooter>
              </DiscordEmbed>
              <DiscordAttachments slot={'components'}>
                <DiscordActionRow>
                  <DiscordButton type={'secondary'} emoji={trackPrevious} emojiName={'⏮️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={playPause} emojiName={'⏯️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={trackNext} emojiName={'⏭️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={stopButton} emojiName={'⏹️'}></DiscordButton>
                  <DiscordButton url={'/'}>Dashboard</DiscordButton>
                </DiscordActionRow>
              </DiscordAttachments>
            </DiscordMessage>
          </DiscordMessages>
        </div>
        <div>
          <h2>YouTube Search</h2>
          <p>
            Search up to five songs from YouTube and play one directly from Discord, without ever opening a browser!
            Playing music in your channel was never this easy.
          </p>
          <DiscordMessages>
            <DiscordMessage profile={'kalliope'}>
              <DiscordCommand slot={'reply'} profile={'meridian'} command={'/search'}></DiscordCommand>
              <DiscordEmbed
                slot={'embeds'}
                authorImage={'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.png'}
                authorName={'Search Results.'}
                embedTitle={'Here are the search results for your search "riell animal":'}
                thumbnail={'https://img.youtube.com/vi/QQX2hpmtMJs/maxresdefault.jpg'}
              >
                <DiscordEmbedFooter slot={'footer'} footerImage={kalliopePNG}>Kalliope. | This embed expires after one minute.</DiscordEmbedFooter>
              </DiscordEmbed>
              <DiscordAttachments slot={'components'}>
                <DiscordActionRow>
                  <DiscordButton className={'discord-button-select'}>Select a song... <i className={'fas fa-angle-down'} style={{ marginLeft: '150px' }}/></DiscordButton>
                </DiscordActionRow>
              </DiscordAttachments>
            </DiscordMessage>
          </DiscordMessages>
        </div>
        <div className={'flex-container'}>
          <h2>Dashboard</h2>
          <p>
            Use the web dashboard to control your bot without having to type out commands ever again.
            You can even use your keyboard&apos;s built-in music buttons to skip songs and pause or resume playback.<span style={{ color: 'gray' } }>*</span><br/>
            <span className={'small-text'}>* Requires browser permissions. Only available in supported browsers.</span>
          </p>
          <Link to={'/dashboard'}><div className={'dashboard-button'}>Dashboard.</div></Link>
        </div>
        <div>
          <h2>Genius Lyrics</h2>
          <p>
            Kalliope supports Genius Lyrics! Quite literally actually, because they are directly accessible in Discord itself via a command.<br/>
            <span className={'small-text'}>* Actual command will show more text, this is just a demo.</span>
          </p>
          <DiscordMessages>
            <DiscordMessage profile={'kalliope'}>
              <DiscordCommand slot={'reply'} profile={'meridian'} command={'/lyrics'}></DiscordCommand>
              <DiscordEmbed
                slot={'embeds'}
                authorImage={'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.png'}
                authorName={'Lyrics.'}
                embedTitle={'Jim Yosef x RIELL - Animal (Lyric Video)'}
                url={'https://www.youtube.com/watch?v=QQX2hpmtMJs'}
                thumbnail={'https://img.youtube.com/vi/QQX2hpmtMJs/maxresdefault.jpg'}
              >
                <DiscordEmbedDescription slot={'description'}>
                  [Verse]<br/>
                  Dangerous<br/>
                  How we toe the line<br/>
                  Push it every time<br/>
                  My my (La la la la)<br/>
                  <br/>
                  ...<br/>
                </DiscordEmbedDescription>
                <DiscordEmbedFooter slot={'footer'} footerImage={kalliopePNG}>Kalliope. | Repeat: ❌ | Provided by genius.com</DiscordEmbedFooter>
              </DiscordEmbed>
              <DiscordAttachments slot={'components'}>
                <DiscordActionRow>
                  <DiscordButton type={'primary'} disabled>Previous</DiscordButton>
                  <DiscordButton type={'primary'}>Next</DiscordButton>
                </DiscordActionRow>
              </DiscordAttachments>
            </DiscordMessage>
          </DiscordMessages>
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
        <div className={'commands-container flex-container row'}>
          <p><span>/play</span><span>/search</span><span>/lyrics</span><span>/shuffle</span><span>/pause</span><span>/nowplaying</span><span>/queue</span><span>And more...</span></p>
          <a href={'https://github.com/MeridianGH/Kalliope'}><div className={'dashboard-button'}>View all commands</div></a>
        </div>
      </section>
      <section id={'github'}>
        <h1><i className={'fab fa-github'}/> GitHub</h1>
        <div className={'flex-container'}>
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
