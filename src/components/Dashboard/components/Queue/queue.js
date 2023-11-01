import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { WebsocketContext } from '../../../WebSocket/websocket.js'
import { Thumbnail } from '../Thumbnail/thumbnail.js'
import './queue.scss'

export function Queue({ tracks }) {
  const websocket = useContext(WebsocketContext)
  const input = React.createRef()
  const handlePlay = (event) => {
    event.preventDefault()
    websocket.sendData('play', { query: input.current.value })
    input.current.value = ''
  }
  return (
    <div className={'queue-container flex-container column'}>
      <h1>Queue:</h1>
      <div className={'flex-container'}>
        <form onSubmit={handlePlay} className={'queue-input-form music-buttons'}>
          <input type='text' className={'queue-input'} placeholder='Add to queue' ref={input}/>
          <button className={'queue-input-button'}><i className={'fas fa-plus'}/></button>
        </form>
        <select className={'queue-input pointer'} name="filter" id={'filter'} onChange={(event) => { websocket.sendData('filter', { filter: event.target.value }) }}>
          <option disabled hidden>Select a filter...</option>
          <option value={'none'}>No Filter</option>
          <option value={'bassboost'}>Bass Boost</option>
          <option value={'classic'}>Classic</option>
          <option value={'eightd'}>8D</option>
          <option value={'earrape'}>Earrape</option>
          <option value={'karaoke'}>Karaoke</option>
          <option value={'nightcore'}>Nightcore</option>
          <option value={'superfast'}>Superfast</option>
          <option value={'vaporwave'}>Vaporwave</option>
        </select>
        <button className={'queue-input pointer'} onClick={() => { websocket.sendData('clear') }}><i className={'fas fa-trash-alt'}/> Clear queue</button>
      </div>
      {/* eslint-disable-next-line no-extra-parens */}
      {tracks.length > 0 ? tracks.map((track, index) => (
        <div className={'queue-track flex-container space-between nowrap'} key={index}>
          <div className={'flex-container nowrap'}>
            <b>{index + 1}.</b>
            <Thumbnail image={track.info.artworkUrl} size={'3em'}/>
            <a href={track.info.uri} rel='noreferrer' target='_blank'><b>{track.info.title}</b></a>
          </div>
          <div className={'music-buttons flex-container'}>
            <button onClick={() => { websocket.sendData('remove', { index: index + 1 }) }}><i className={'fas fa-trash-alt'}/></button>
            <button onClick={() => { websocket.sendData('skip', { index: index + 1 }) }}><i className={'fas fa-forward'}/></button>
          </div>
        </div>
      )) : <div className={'queue-track flex-container'}>No upcoming songs! Add songs with &apos;/play&apos; or by using the field above.</div>}
    </div>
  )
}

Queue.propTypes = { tracks: PropTypes.arrayOf(PropTypes.object).isRequired }
