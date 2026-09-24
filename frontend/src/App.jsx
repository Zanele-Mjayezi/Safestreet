import React from 'react'
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Shield, LayoutDashboard, AlertTriangle, Map, CreditCard, LogOut, User, Menu, X, Palette } from 'lucide-react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import IncidentReport from './pages/IncidentReport'
import PatrolMap from './pages/PatrolMap'
import Subscriptions from './pages/Subscriptions'
import StyleGuide from './pages/StyleGuide'
import Landing from './pages/Landing'

function Navbar() {
  const { user, logout, isAdmin, isGuard } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  if (!user) return null

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/incidents', label: 'Report', icon: AlertTriangle },
    { path: '/map', label: 'Patrol Map', icon: Map },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/style-guide', label: 'Style Guide', icon: Palette },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="nav-brand">
          <div className="nav-brand-icon">
            <Shield size={20} />
          </div>
          <span className="nav-brand-text">Safe<span>Street</span></span>
        </Link>

        <div className="nav-links" style={{ display: mobileOpen ? 'flex' : undefined }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="nav-avatar">
            <User size={16} />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'none' }} className="hide-mobile">
            {user.fullName || user.username}
          </span>
          <button onClick={logout} className="btn btn-ghost btn-sm" title="Logout">
            <LogOut size={16} />
          </button>
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ display: 'none' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/incidents" element={user ? <IncidentReport /> : <Navigate to="/login" />} />
        <Route path="/map" element={user ? <PatrolMap /> : <Navigate to="/login" />} />
        <Route path="/subscriptions" element={user ? <Subscriptions /> : <Navigate to="/login" />} />
        <Route path="/style-guide" element={user ? <StyleGuide /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      </Routes>
    </div>
  )
}

export default App
