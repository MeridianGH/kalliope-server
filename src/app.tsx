import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Navbar } from './components/Navbar/navbar'
import { Header } from './components/Header/header'
import { Home } from './components/Home/home'
import { Footer } from './components/Footer/footer'
import { Dashboard } from './components/Dashboard/dashboard'
import { WebsocketProvider } from './contexts/websocketContext'
import { Statistics } from './components/Statistics/statistics'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'
import './app.scss'
import { ToastProvider } from './contexts/toastContext';

(document.querySelector('link[rel=icon]') as HTMLLinkElement).href = kalliopeTransparentPNG

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={
          <div>
            <Navbar displayLinks={true}/>
            <Header/>
            <Home/>
            <Footer/>
          </div>
        }/>
        <Route path={'/dashboard'} element={
          <ToastProvider>
            <WebsocketProvider>
              <Dashboard/>
            </WebsocketProvider>
          </ToastProvider>
        }/>
        <Route path={'/statistics'} element={
          <WebsocketProvider>
            <Statistics/>
          </WebsocketProvider>
        }/>
      </Routes>
    </BrowserRouter>
  )
}


const root = createRoot(document.querySelector('.app') as HTMLElement)
root.render(<App/>)
