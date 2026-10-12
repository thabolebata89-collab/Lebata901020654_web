import { NavLink, useNavigate } from 'react-router-dom'
import useLibrary from '../context/useLibrary.js'

const navigation = [
  { to: '/', label: 'Overview', icon: '◫', end: true },
  { to: '/books', label: 'Book collection', icon: '▤' },
  { to: '/transactions', label: 'Stock activity', icon: '↕' },
  { to: '/users', label: 'Members', icon: '◎' },
]

export function MobileNavigation() {
  return (
    <nav className="mobile-nav" aria-label="Main navigation">
      {navigation.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} aria-label={item.label} className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}>
          <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
        </NavLink>
      ))}
    </nav>
  )
}

export default function Sidebar() {
  const { currentUser, logout } = useLibrary()
  const navigate = useNavigate()

  function handleSignOut() {
    logout()
    navigate('/users')
  }

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/" aria-label="Khanya Library overview">
        <span className="brand-mark" aria-hidden="true">K</span>
        <span className="brand-copy"><strong>Khanya Library</strong><small>KNOWLEDGE THAT LIGHTS THE WAY</small></span>
      </NavLink>
      <div className="sidebar-label">LIBRARY DESK</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="status-dot" /> Knowledge that lights the way</div>
        {currentUser ? (
          <>
            <div className="profile-block">
              <span className="avatar">{currentUser.name.slice(0, 1).toUpperCase()}</span>
              <span className="profile-copy"><strong>Signed in as {currentUser.name} — {currentUser.role}</strong><small>{currentUser.membershipId}</small></span>
            </div>
            <button className="sign-in-link sign-out-link" type="button" onClick={handleSignOut}>Sign out <span aria-hidden="true">↪</span></button>
          </>
        ) : (
          <NavLink className="sign-in-link" to="/users">Sign in to your desk <span aria-hidden="true">→</span></NavLink>
        )}
      </div>
    </aside>
  )
}