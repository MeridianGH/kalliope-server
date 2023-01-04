import React from 'react'

import './dashboard.css'

export function Dashboard() {
  return (
    <div className={'dashboard'}>
      This is a dashboard.
      <a href={'/login'}>Login.</a>
    </div>
  )
}
