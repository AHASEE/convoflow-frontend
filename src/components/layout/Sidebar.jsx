import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard, MessageCircle, Users, TrendingUp, Calendar,
  Megaphone, Zap, BarChart2, Settings, MessageSquare, Sun, Moon,
  MoreHorizontal, LogOut,
} from 'lucide-react'
import { io } from 'socket.io-client'
import API from '../../services/api'

const socket = io('http://localhost:5000', { autoConnect: true })

const navLinks = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: 'dashboard' },
  { label: 'Active Chats', icon: MessageCircle,   path: 'chats',        badge: 12, badgeType: 'solid' },
  { label: 'Contacts',     icon: Users,           path: 'contacts' },
  { label: 'Leads',        icon: TrendingUp,      path: 'leads',        badge: 8,  badgeType: 'soft' },
  { label: 'Appointments', icon: Calendar,        path: 'appointments' },
]
const toolLinks = [
  { label: 'Broadcast',  icon: Megaphone, path: 'broadcast' },
  { label: 'Automation', icon: Zap,       path: 'automation', tag: 'NEW' },
  { label: 'Reports',    icon: BarChart2, path: 'reports' },
]
const bottomLinks = [
  { label: 'Settings', icon: Settings, path: 'settings' },
]

function NavButton({ link, isActive, onClick }) {
  const Icon = link.icon
  return (
    <button onClick={() => onClick(link.path)} style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 12px', borderRadius: '8px', border: 'none',
      background: isActive ? 'rgba(34,197,94,0.16)' : 'transparent',
      cursor: 'pointer', width: '100%', textAlign: 'left',
      fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
      fontWeight: isActive ? 600 : 500,
      color: isActive ? '#fff' : 'rgba(187,247,208,0.8)',
      position: 'relative', transition: 'all 0.15s ease',
    }}
      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff' } }}
      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(187,247,208,0.8)' } }}
    >
      {isActive && <span style={{ position: 'absolute', left: 0, top: '4px', bottom: '4px', width: '3px', background: '#22C55E', borderRadius: '0 2px 2px 0' }} />}
      <Icon size={16} style={{ color: isActive ? '#22C55E' : 'inherit', flexShrink: 0 }} />
      <span style={{ flex: 1, lineHeight: 1.3 }}>{link.label}</span>
      {link.badge && link.badgeType === 'solid' && <span style={{ background: '#22C55E', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{link.badge}</span>}
      {link.badge && link.badgeType === 'soft' && <span style={{ background: 'rgba(34,197,94,0.2)', color: '#86EFAC', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>{link.badge}</span>}
      {link.tag && <span style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(251,191,36,0.2)', color: '#FCD34D', padding: '2px 6px', borderRadius: '4px' }}>{link.tag}</span>}
    </button>
  )
}

export default function Sidebar({ activePage, setActivePage, darkMode, setDarkMode, onLogout, user: propUser }) {
  const [waStatus, setWaStatus] = useState('disconnected')
  const [waPic, setWaPic]       = useState(null)
  const [waNumber, setWaNumber] = useState(null)
  const [waName, setWaName]     = useState(null)
  const [user, setUser]         = useState(propUser || null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // ✅ Agar prop se user aaya toh use karo — warna API se fetch karo
    if (propUser) {
      setUser(propUser)
    } else {
      API.get('/auth/me').then(({ data }) => {
        if (data.user) setUser(data.user)
      }).catch(() => {})
    }

    API.get('/whatsapp/status').then(({ data }) => {
      if (data.isConnected) {
        setWaStatus('connected')
        setWaNumber(data.number || null)
        setWaPic(data.profilePic || null)
        setWaName(data.name || null)
      }
    }).catch(() => {})

    socket.on('whatsapp:connected', ({ number, name, profilePic } = {}) => {
      setWaStatus('connected')
      setWaNumber(number || null)
      setWaName(name || null)
      setWaPic(profilePic || null)
    })

    socket.on('whatsapp:disconnected', () => {
      setWaStatus('disconnected')
      setWaPic(null)
      setWaNumber(null)
      setWaName(null)
    })

    return () => {
      socket.off('whatsapp:connected')
      socket.off('whatsapp:disconnected')
    }
  }, [propUser])

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AA'

  return (
    <aside style={{
      width: '232px', height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(175deg, #0F3D2A 0%, #0e3526 60%, #0c2d20 100%)',
      boxShadow: '4px 0 32px rgba(0,0,0,0.22)',
      fontFamily: "'DM Sans', sans-serif", flexShrink: 0, overflowY: 'auto',
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width: '36px', height: '36px', background: '#22C55E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 12px rgba(34,197,94,0.35)' }}>
          <MessageSquare size={18} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, lineHeight: 1.2 }}>ConvoFlow</div>
          <div style={{ color: 'rgba(134,239,172,0.6)', fontSize: '10px', fontWeight: 500 }}>WhatsApp CRM</div>
        </div>
        <div style={{
          marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%',
          background: waStatus === 'connected' ? '#22C55E' : '#ef4444',
          boxShadow: `0 0 0 2px rgba(${waStatus === 'connected' ? '34,197,94' : '239,68,68'},0.25)`,
        }} />
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '16px 8px 0', overflowY: 'auto' }}>
        <SectionLabel>Main Menu</SectionLabel>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navLinks.map(link => <NavButton key={link.path} link={link} isActive={activePage === link.path} onClick={setActivePage} />)}
        </nav>
        <Divider />
        <SectionLabel>Tools</SectionLabel>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {toolLinks.map(link => <NavButton key={link.path} link={link} isActive={activePage === link.path} onClick={setActivePage} />)}
        </nav>
        <Divider />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {bottomLinks.map(link => <NavButton key={link.path} link={link} isActive={activePage === link.path} onClick={setActivePage} />)}
        </nav>
      </div>

      {/* WhatsApp Card */}
      <div style={{
        margin: '12px',
        background: 'rgba(0,0,0,0.22)',
        border: `0.5px solid ${waStatus === 'connected' ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.2)'}`,
        borderRadius: '14px', padding: '16px', textAlign: 'center',
      }}>
        {waStatus === 'connected' ? (
          <>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
              {waPic ? (
                <img src={waPic} alt="WhatsApp Profile"
                  style={{ width: '65px', height: '65px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #22C55E', boxShadow: '0 2px 10px rgba(37,211,102,0.4)' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div style={{ width: '65px', height: '65px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(37,211,102,0.3)' }}>
                  <MessageSquare size={20} color="#fff" />
                </div>
              )}
              <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '11px', height: '11px', background: '#22C55E', borderRadius: '50%', border: '2px solid #0F3D2A' }} />
            </div>
            <div style={{ color: '#22C55E', fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>✅ WhatsApp Connected</div>
            {waName && <div style={{ color: '#fff', fontSize: '11px', fontWeight: 600, marginBottom: '2px' }}>{waName}</div>}
            {waNumber && <div style={{ color: 'rgba(134,239,172,0.7)', fontSize: '10px', marginBottom: '6px' }}>+{waNumber}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <div style={{ width: '5px', height: '5px', background: '#22C55E', borderRadius: '50%' }} />
              <span style={{ color: 'rgba(134,239,172,0.6)', fontSize: '10px' }}>Active & receiving messages</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ width: '38px', height: '38px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 2px 10px rgba(37,211,102,0.3)' }}>
              <MessageSquare size={18} color="#fff" />
            </div>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Connect WhatsApp</div>
            <div style={{ color: 'rgba(134,239,172,0.6)', fontSize: '10px', lineHeight: 1.6, marginBottom: '12px' }}>
              Link your account to manage chats & grow sales.
            </div>
            <button
              onClick={() => setActivePage('chats')}
              style={{ width: '100%', background: '#22C55E', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = '#16A34A')}
              onMouseLeave={e => (e.currentTarget.style.background = '#22C55E')}
            >
              Connect Now
            </button>
          </>
        )}
      </div>

      {/* Dark Mode */}
      <div style={{ padding: '0 8px 8px' }}>
        <button onClick={() => setDarkMode(!darkMode)} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px', border: 'none',
          background: 'rgba(255,255,255,0.05)', cursor: 'pointer', width: '100%',
          fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500,
          color: 'rgba(187,247,208,0.8)',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          {darkMode ? <Sun size={15} color="#FCD34D" /> : <Moon size={15} color="rgba(187,247,208,0.7)" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* ✅ User Section — logout dropdown */}
      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', padding: '8px 8px 12px', position: 'relative' }}>

        {/* ✅ Logout dropdown menu */}
        {showUserMenu && (
          <div style={{
            position: 'absolute', bottom: '60px', left: '8px', right: '8px',
            background: '#1a3d28', border: '0.5px solid rgba(34,197,94,0.2)',
            borderRadius: '10px', overflow: 'hidden', zIndex: 50,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={() => { setShowUserMenu(false); setActivePage('settings') }}
              style={{
                width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                textAlign: 'left', fontSize: '12px', fontWeight: 500,
                color: 'rgba(187,247,208,0.8)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Settings size={13} /> Settings
            </button>
            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            <button
              onClick={() => { setShowUserMenu(false); onLogout && onLogout() }}
              style={{
                width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                textAlign: 'left', fontSize: '12px', fontWeight: 500,
                color: '#ef4444', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        )}

        {/* User row */}
        <div
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F3D2A', fontSize: '11px', fontWeight: 700 }}>
              {userInitials}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%', border: '1.5px solid #0F3D2A' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Loading...'}
            </div>
            <div style={{ color: 'rgba(134,239,172,0.6)', fontSize: '10px', fontWeight: 500 }}>
              {user?.role || 'Admin'}
            </div>
          </div>
          <MoreHorizontal size={15} color="rgba(134,239,172,0.5)" />
        </div>
      </div>
    </aside>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(134,239,172,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '6px' }}>{children}</div>
}

function Divider() {
  return <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '10px 4px 14px' }} />
}