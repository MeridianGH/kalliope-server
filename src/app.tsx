import React, { Fragment, lazy, PropsWithChildren } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Slide, ToastContainer } from 'react-toastify'
import { WebsocketProvider } from './contexts/websocketContext'
import { DiscordUserProvider } from './contexts/discordUserContext'
import { Navbar } from './components/Navbar/navbar'
import { Header } from './components/Header/header'
import { Home } from './components/Home/home'
import { Footer } from './components/Footer/footer'
import kalliopeTransparentPNG from './assets/kalliope_transparent.png'
import './app.scss'

const Dashboard = lazy(() => import(/* webpackChunkName: 'dashboard' */ './components/Dashboard/dashboard'))
const Statistics = lazy(() => import(/* webpackChunkName: 'statistics' */ './components/Statistics/statistics'))

document.querySelector<HTMLLinkElement>('link[rel=icon]')!.href = kalliopeTransparentPNG

const UserWebsocketProvider = ({ children }: PropsWithChildren) => (
  <DiscordUserProvider>
    <WebsocketProvider>
      {children}
    </WebsocketProvider>
  </DiscordUserProvider>
)

const isMobile = window.matchMedia('screen and (max-width: 768px)').matches

export function App() {
  return (
    <Fragment>
      <ToastContainer position={isMobile ? 'top-center' : 'bottom-right'} theme={'dark'} transition={Slide}/>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={(
              <Fragment>
                <Navbar displayLinks={true}/>
                <Header/>
                <Home/>
                <Footer/>
              </Fragment>
            )}
          />
          <Route
            path={'/dashboard'}
            element={(
              <UserWebsocketProvider>
                <Dashboard/>
              </UserWebsocketProvider>
            )}
          />
          <Route
            path={'/statistics'}
            element={(
              <UserWebsocketProvider>
                <Statistics/>
              </UserWebsocketProvider>
            )}
          />
        </Routes>
      </BrowserRouter>
    </Fragment>
  )
}

const root = createRoot(document.querySelector<HTMLDivElement>('.app')!)
root.render(<App/>)
