import React from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './components/Layout/layout.js'
import { Home } from './components/Home/home.js'
import { Dashboard } from './components/Dashboard/dashboard.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './index.css'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'

document.querySelector('link[rel=icon]').href = kalliopeTransparentPNG

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path={'/dashboard'} element={<Dashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


const root = createRoot(document.getElementById('app'))
root.render(<App/>)
