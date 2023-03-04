import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Home } from './components/Home/home.js'
import { Navbar } from './components/Navbar/navbar.js'
import { Dashboard } from './components/Dashboard/dashboard.js'
import { WebsocketProvider } from './components/WebSocket/websocket.js'
import './app.css'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'

document.querySelector('link[rel=icon]').href = kalliopeTransparentPNG

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path={'/dashboard'} element={
          <WebsocketProvider>
            <Navbar/>
            <Dashboard/>
          </WebsocketProvider>
        }/>
      </Routes>
    </BrowserRouter>
  )
}


const root = createRoot(document.querySelector('.app'))
root.render(<App/>)
