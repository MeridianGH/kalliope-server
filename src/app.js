import React from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './components/Home/home.js'
import { Dashboard } from './components/Dashboard/dashboard.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './app.css'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'

document.querySelector('link[rel=icon]').href = kalliopeTransparentPNG

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path={'/dashboard'} element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}


const root = createRoot(document.getElementById('app'))
root.render(<App/>)
