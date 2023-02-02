import React from 'react'

import './dashboard.css'

export function Dashboard() {
  return (
    <div className={'dashboard flex-container'}>
      <h1><i className={'fas fa-th'}/> Select a server...</h1>
      <div className={'server-container flex-container row'}>
        <div className={'server-card'}>
          <img src={'../../assets/kalliope.png'}></img>
          <span>Server Name</span>
        </div>
      </div>
    </div>
  )
}
