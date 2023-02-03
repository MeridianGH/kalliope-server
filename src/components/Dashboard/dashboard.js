import React, { useEffect } from 'react'

import './dashboard.css'
import genericServer from '../../assets/generic_server.png'

export function Dashboard() {
  useEffect(() => { document.title = 'Kalliope | Dashboard' })
  return (
    <div className={'dashboard flex-container'}>
      <h1><i className={'fas fa-th'}/> Select a server...</h1>
      <div className={'server-container flex-container row'}>
        <div className={'server-card flex-container column'}>
          <img src={genericServer}></img>
          <span>JustLuckyLaggers</span>
        </div>
      </div>
    </div>
  )
}
