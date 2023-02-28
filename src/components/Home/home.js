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

export function Home() {
  useEffect(() => {
    document.querySelectorAll('.discord-messages').forEach((element) => {
      element.style.marginBottom = 0 - element.offsetHeight * (1 - getComputedStyle(element).getPropertyValue('--scale')) + 'px'
    })
  })
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
  return (
    <div id={'home'}>
      <Header/>
      <section id={'features'}>
        <h1><i className={'fas fa-th'}/> Features</h1>
        <div>
          <h2>The Kalliope network</h2>
          <p>
            Kalliope is active in <b id={'servers'}>...</b> servers with <b id={'clients'}>...</b> clients<br/>
            and providing clean music to <b id={'users'}>...</b> users.
          </p>
        </div>
        <div>
          <h2>Full support</h2>
          <p>
            Kalliope still offers full support for almost every platform you can imagine:<br/>
            YouTube, Spotify<span style={{ color: '#8b8b8b' }}>*</span>, Twitch and many others!<br/>
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
                  <DiscordButton type={'secondary'} emoji={'../../assets/emojis/track_previous.svg'} emojiName={'⏮️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={'../../assets/emojis/play_pause.svg'} emojiName={'⏯️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={'../../assets/emojis/track_next.svg'} emojiName={'⏭️'}></DiscordButton>
                  <DiscordButton type={'secondary'} emoji={'../../assets/emojis/stop_button.svg'} emojiName={'⏹️'}></DiscordButton>
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
            You can even use your keyboard&apos;s built-in music buttons to skip songs and pause or resume playback.<span style={{ color: '#8b8b8b' } }>*</span><br/>
            <span className={'small-text'}> * Currently only available on Firefox. Requires browser permissions.</span>
          </p>
          <a className={'dashboard-button'}>Dashboard.</a>
        </div>
        <div>
          <h2>Genius Lyrics</h2>
          <p>
            Kalliope supports Genius Lyrics! Quite literally actually, because they are directly accessible in Discord itself via a command.<br/>
            <span className={'small-text'}>*Discord will show more text, this is just a demo.</span>
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
            But don&apos;t worry, it&apos;s really easy and fast:
          </p>
          <details>
            <summary>
              <span>1. Install Java 13 (OpenJDK 13.0.2)</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Download the OpenJDK 13.0.2 installer either from the official <a className={'underline'} href={'https://www.oracle.com/java/technologies/javase/jdk13-archive-downloads.html'}>Oracle Archive website</a> (Account creation required)<br/>
              <b>OR</b><br/>
              Download the binaries from the <a className={'underline'} href={'https://jdk.java.net/archive/'}>Java Archives</a> and unzip it to a location you can remember.<br/><br/>
              Regardless of your method, make sure to add the &apos;/bin&apos; folder to your path variable. If you don&apos;t know how to do that, a quick Google search will help you.<br/><br/>
              Make sure Java is installed properly by running <span style={{ whiteSpace: 'nowrap' }}>&apos;java --version&apos;</span> in your terminal. If it displays the correct version, you are good to go!
            </span>
          </details>
          <details>
            <summary>
              <span>2. Install the latest version of FFmpeg</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Go to <a className={'underline'} href={'https://ffmpeg.org/download.html'}>ffmpeg.org</a> and look for the binaries for your system.<br/>
              There is also a <a className={'underline'} href={'https://www.wikihow.com/Install-FFmpeg-on-Windows'}>concise guide</a> available explaining the installation process on Windows.<br/><br/>
              Popular Linux distributions usually have FFmpeg packages in their respective package managers.
            </span>
          </details>
          <details>
            <summary>
              <span>3. Install node.js</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Download and install node.js from <a className={'underline'} href={'https://nodejs.org/en/download/'}>nodejs.org</a>.<br/>
              This should be fairly straight-forward.<br/><br/>
              Linux packages for most package managers are available <a className={'underline'} href={'https://nodejs.org/en/download/package-manager/'}>here.</a>
            </span>
          </details>
          <details>
            <summary>
              <span>4. Download and setup Kalliope</span>
              <span className={'icon'}><i className={'fas fa-angle-down'}/></span>
            </summary>
            <span>
              Go to the <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope'}>GitHub repository</a> and either clone or download the code to a folder of your choice.<br/><br/>
              Follow the installation instructions available in the <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope#installation'}>README</a>.
            </span>
          </details>
        </div>
      </section>
      <section id={'commands'}>
        <h1><i className={'fas fa-list-ul'}/> Commands</h1>
        <div className={'commands-container flex-container row'}>
          <p><span>/play</span><span>/search</span><span>/lyrics</span><span>/shuffle</span><span>/pause</span><span>/nowplaying</span><span>/queue</span><span>And more...</span></p>
          <p>View all commands <a className={'underline'}>here</a>.</p>
        </div>
      </section>
      <section id={'github'}>
        <h1><i className={'fab fa-github'}/> GitHub</h1>
        <div>
          <p>
            Kalliope is open-source! You can find it&apos;s source-code, releases and more info using the link below.<br/>
            However, please be mindful of the license if you&apos;re interested in redistributing code from the repository.<br/><br/>
            <a className={'underline'} href={'https://github.com/MeridianGH/Kalliope'}>GitHub</a>
          </p>
        </div>
      </section>
    </div>
  )
}
