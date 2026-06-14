import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboard/Dashboard'
import ActiveChats from './components/chats/ActiveChats'
import Contacts from './components/contacts/Contacts'
import Leads from './components/leads/Leads'
import Appointments from './components/appointments/Appointments'
import Broadcast from './components/broadcast/Broadcast'
import Automation from './components/automation/Automation'
import Reports from './components/reports/Reports'
import PlaceholderPage from './components/layout/PlaceholderPage'
import API from './services/api'

// ✅ Global socket — ek jagah banao
export const socket = io('http://localhost:5000', {
  autoConnect: true,
  transports: ['websocket', 'polling'],
})

const pageTitles = {
  dashboard:    'Dashboard',
  chats:        'Active Chats',
  contacts:     'Contacts',
  leads:        'Leads',
  appointments: 'Appointments',
  broadcast:    'Broadcast',
  automation:   'Automation',
  reports:      'Reports',
  settings:     'Settings',
}

function PageContent({ page }) {
  switch (page) {
    case 'dashboard':    return <Dashboard />
    case 'chats':        return <ActiveChats />
    case 'contacts':     return <Contacts />
    case 'leads':        return <Leads />
    case 'appointments': return <Appointments />
    case 'broadcast':    return <Broadcast />
    case 'automation':   return <Automation />
    case 'reports':      return <Reports />
    default:             return <PlaceholderPage title={pageTitles[page] || page} />
  }
}

// ── Login + Register Page ──────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin]         = useState(true)
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')
  const [loading, setLoading]         = useState(false)

  const resetForm = () => {
    setName(''); setEmail(''); setPassword('')
    setConfirmPass(''); setError(''); setSuccess('')
  }

  const handleToggle = (toLogin) => { setIsLogin(toLogin); resetForm() }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true); setError('')
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('cf_token', data.token)
      onLogin(data.user)
    } catch (err) {
      setError('Email ya password galat hai!')
    } finally { setLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Name required hai!')
    if (password !== confirmPass) return setError('Passwords match nahi kar rahe!')
    if (password.length < 6) return setError('Password kam az kam 6 characters ka hona chahiye!')
    try {
      setLoading(true); setError('')
      await API.post('/auth/register', { name, email, password, role: 'admin' })
      setSuccess('Account ban gaya! Ab login karo.')
      setTimeout(() => handleToggle(true), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-xl border border-gray-800">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <h1 className="text-white font-bold text-xl">ConvoFlow</h1>
          <p className="text-gray-400 text-sm mt-1">WhatsApp CRM</p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => handleToggle(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              isLogin ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleToggle(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              !isLogin ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••" required />
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {!isLogin && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Yasir Ali" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••" required />
            </div>
            {error   && <p className="text-red-400 text-xs text-center">{error}</p>}
            {success && <p className="text-green-400 text-xs text-center">{success}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [user, setUser]             = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('cf_token')
    setUser(null)
    setActivePage('dashboard')
  }

  // ✅ Login hone ke baad socket room join karo
  useEffect(() => {
    if (user?.id) {
      socket.emit('join', user.id)
      console.log('✅ Socket joined room for user:', user.id)
    }
  }, [user?.id])

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('cf_token')
    if (token) {
      API.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('cf_token')
          setUser(null)
        })
        .finally(() => setAuthChecking(false))
    } else {
      setAuthChecking(false)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  const isChats = activePage === 'chats'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
        user={user}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isChats && (
          <Navbar
            title={pageTitles[activePage]}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
            user={user}
          />
        )}
        <main className={`flex-1 ${isChats ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <PageContent page={activePage} />
        </main>
      </div>
    </div>
  )
}