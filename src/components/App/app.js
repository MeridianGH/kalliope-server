import React, { useState } from 'react'
import { Home } from '../Home/home.js'
import { Dashboard } from '../Dashboard/dashboard.js'

import './app.css'

export function App() {
  const [showDashboard, setDashboard] = useState(false)
  return showDashboard ? <Dashboard/> : <Home setDashboard={setDashboard}/>
}
