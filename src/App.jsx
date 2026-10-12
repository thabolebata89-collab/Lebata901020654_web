import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { LibraryProvider } from './context/LibraryContext.jsx'
import useLibrary from './context/useLibrary.js'
import Sidebar, { MobileNavigation } from './components/Sidebar.jsx'
import Toast from './components/Toast.jsx'
import IntroScreen from './components/IntroScreen.jsx'
import Overview from './pages/Overview.jsx'
import Books from './pages/Books.jsx'
import Transactions from './pages/Transactions.jsx'
import Members from './pages/Members.jsx'

function AppLayout() {
  const { currentUser, notice } = useLibrary()
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)
  const [showRouteProgress, setShowRouteProgress] = useState(false)

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return undefined

    previousPathRef.current = location.pathname
    setShowRouteProgress(true)
    const timer = window.setTimeout(() => setShowRouteProgress(false), 6000)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="app-shell">
      {showRouteProgress && <div key={location.pathname} className="route-progress" aria-hidden="true"><span /></div>}
      <Sidebar />
      <main className="main-area">
        <header className="mobile-header">
          <NavLink className="brand" to="/" aria-label="Khanya Library overview">
            <span className="brand-mark" aria-hidden="true">K</span>
            <span className="brand-copy"><strong>Khanya Library</strong><small>KNOWLEDGE THAT LIGHTS THE WAY</small></span>
          </NavLink>
          {currentUser && <span className="mobile-user">{currentUser.name} · {currentUser.role}</span>}
        </header>
        <MobileNavigation />
        <div className="page-content" key={location.pathname}><Outlet /></div>
      </main>
      <Toast notice={notice} />
    </div>
  )
}

function NotFound() {
  return <section className="empty-state"><span className="empty-icon">404</span><h2>That shelf is not here</h2><p>The page you are looking for has moved.</p><NavLink className="button button-primary" to="/">Back to overview</NavLink></section>
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (import.meta.env.DEV) return false

    try {
      return window.sessionStorage.getItem('khanya-intro-seen') !== 'true'
    } catch {
      return false
    }
  })
  const finishIntro = useCallback(() => setShowIntro(false), [])

  useEffect(() => {
    if (!showIntro) return
    try {
      window.sessionStorage.setItem('khanya-intro-seen', 'true')
    } catch (error) {
      console.error('Unable to remember that the Khanya intro has been shown.', error)
    }
  }, [showIntro])

  return (
    <>
      <LibraryProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="books" element={<Books />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="users" element={<Members />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LibraryProvider>
      {showIntro && <IntroScreen onComplete={finishIntro} />}
    </>
  )
}
