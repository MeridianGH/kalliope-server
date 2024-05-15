import React, { Fragment, PropsWithChildren } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { WebsocketProvider } from './contexts/websocketContext'
import { DiscordUserProvider } from './contexts/discordUserContext'
import { Navbar } from './components/Navbar/navbar'
import { Header } from './components/Header/header'
import { Home } from './components/Home/home'
import { Footer } from './components/Footer/footer'
import { Dashboard } from './components/Dashboard/dashboard'
import { Statistics } from './components/Statistics/statistics'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'
import './app.scss'
import { ToastProvider } from './contexts/toastContext'
import { Auth } from './components/Auth/auth'

(document.querySelector('link[rel=icon]') as HTMLLinkElement).href = kalliopeTransparentPNG

// eslint-disable-next-line no-extra-parens
const UserWebsocketProvider = ({ children }: PropsWithChildren) => (
  <DiscordUserProvider>
    <WebsocketProvider>
      {children}
    </WebsocketProvider>
  </DiscordUserProvider>
)


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={
          <Fragment>
            <Navbar displayLinks={true}/>
            <Header/>
            <Home/>
            <Footer/>
          </Fragment>
        }/>
        <Route path={'/auth'} element={
          <DiscordUserProvider>
            <Auth/>
          </DiscordUserProvider>
        }/>
        <Route path={'/dashboard'} element={
          <UserWebsocketProvider>
            <ToastProvider>
              <Dashboard/>
            </ToastProvider>
          </UserWebsocketProvider>
        }/>
        <Route path={'/statistics'} element={
          <UserWebsocketProvider>
            <Statistics/>
          </UserWebsocketProvider>
        }/>
      </Routes>
    </BrowserRouter>
  )
}


const root = createRoot(document.querySelector('.app') as HTMLElement)
root.render(<App/>)
