import React, { useState } from 'react'
import { Search, Bell, Sun, Moon, ChevronDown, Settings } from 'lucide-react'

export default function Navbar({ title, darkMode, setDarkMode, onLogout, user }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header style={{
      height: '56px',
      background: darkMode ? '#111827' : '#ffffff',
      borderBottom: darkMode ? '0.5px solid rgba(255,255,255,0.07)' : '0.5px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: darkMode
        ? 'none'
        : '0 1px 8px rgba(0,0,0,0.04)',
    }}>

      {/* ── Left: Page Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1 style={{
          fontSize: '15px',
          fontWeight: 700,
          color: darkMode ? '#F9FAFB' : '#111827',
          margin: 0,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          {title}
        </h1>
        {/* Breadcrumb dot */}
        <span style={{
          width: '4px', height: '4px',
          background: '#22C55E',
          borderRadius: '50%',
          display: 'inline-block',
          marginTop: '1px',
        }} />
        <span style={{
          fontSize: '12px',
          color: darkMode ? 'rgba(156,163,175,0.8)' : '#9CA3AF',
          fontWeight: 500,
        }}>
          Overview
        </span>
      </div>

      {/* ── Right: Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Search Box */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}>
          <Search
            size={14}
            style={{
              position: 'absolute', left: '11px',
              color: searchFocused ? '#22C55E' : '#9CA3AF',
              transition: 'color 0.15s',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search chats, contacts..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              paddingLeft: '32px',
              paddingRight: '14px',
              height: '34px',
              background: darkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
              border: searchFocused
                ? '0.5px solid #22C55E'
                : darkMode
                  ? '0.5px solid rgba(255,255,255,0.1)'
                  : '0.5px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: darkMode ? '#F9FAFB' : '#111827',
              width: '220px',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxShadow: searchFocused ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
            }}
          />
          {/* Keyboard shortcut hint */}
          {!searchFocused && (
            <span style={{
              position: 'absolute', right: '10px',
              fontSize: '10px', fontWeight: 600,
              color: darkMode ? 'rgba(156,163,175,0.5)' : '#D1D5DB',
              letterSpacing: '0.02em',
              pointerEvents: 'none',
            }}>
              ⌘K
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{
          width: '0.5px', height: '20px',
          background: darkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
          margin: '0 2px',
        }} />

        {/* Dark Mode Toggle */}
        <IconButton onClick={() => setDarkMode(!darkMode)} darkMode={darkMode}>
          {darkMode
            ? <Sun size={15} style={{ color: '#FBBF24' }} />
            : <Moon size={15} style={{ color: '#6B7280' }} />
          }
        </IconButton>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconButton darkMode={darkMode}>
            <Bell size={15} style={{ color: darkMode ? '#9CA3AF' : '#6B7280' }} />
          </IconButton>
          {/* Red dot */}
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            width: '7px', height: '7px',
            background: '#EF4444', borderRadius: '50%',
            border: darkMode ? '1.5px solid #111827' : '1.5px solid #fff',
          }} />
        </div>

        {/* Divider */}
        <div style={{
          width: '0.5px', height: '20px',
          background: darkMode ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
          margin: '0 2px',
        }} />

        {/* User Profile */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px 4px 4px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid #E5E7EB',
            background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
            transition: 'all 0.15s',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.08)' : '#F1F5F9'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC'
          }}
        >
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '10px', fontWeight: 700,
              flexShrink: 0,
            }}>
              AA
            </div>
            {/* Online dot */}
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '7px', height: '7px',
              background: '#22C55E', borderRadius: '50%',
              border: darkMode ? '1.5px solid #111827' : '1.5px solid #F8FAFC',
            }} />
          </div>

            <div style={{ lineHeight: 1.2 }}>
            <div style={{
              fontSize: '12px', fontWeight: 600,
              color: darkMode ? '#F9FAFB' : '#111827',
              whiteSpace: 'nowrap',
            }}>
              {user?.name || 'User'}
            </div>
            <div style={{
              fontSize: '10px', fontWeight: 500,
              color: '#22C55E',
            }}>
              {user?.role || 'Admin'}
            </div>
          </div>

          <ChevronDown
            size={13}
            style={{
              color: darkMode ? '#6B7280' : '#9CA3AF',
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s',
            }}
          />

          {/* Dropdown */}
          {showDropdown && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: darkMode ? '#1F2937' : '#fff',
              border: darkMode ? '0.5px solid rgba(255,255,255,0.1)' : '0.5px solid #E5E7EB',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              minWidth: '160px',
              zIndex: 50,
              overflow: 'hidden',
              padding: '4px',
            }}>
              {[
                { label: 'Profile', icon: '👤' },
                { label: 'Settings', icon: '⚙️' },
                { label: 'Help', icon: '❓' },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 12px', borderRadius: '7px',
                    fontSize: '12px', fontWeight: 500,
                    color: darkMode ? '#D1D5DB' : '#374151',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.07)' : '#F8FAFC')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '13px' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
              <div style={{
                height: '0.5px',
                background: darkMode ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                margin: '4px 0',
              }} />
              <div
                onClick={onLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', borderRadius: '7px',
                  fontSize: '12px', fontWeight: 500,
                  color: "#EF4444", cursor: "pointer",
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '13px' }}>🚪</span>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

/* ── Small reusable icon button ── */
function IconButton({ children, onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '34px', height: '34px',
        background: darkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
        border: darkMode ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid #E5E7EB',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : '#F1F5F9'
        e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.15)' : '#D1D5DB'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : '#F8FAFC'
        e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.08)' : '#E5E7EB'
      }}
    >
      {children}
    </button>
  )
}