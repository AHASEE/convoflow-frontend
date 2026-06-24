import React, { useState, useEffect, useRef } from 'react'
import { Search, RefreshCw, Edit, Phone, Video, MoreVertical, Paperclip, Send, ChevronDown, Wifi, WifiOff, LogOut } from 'lucide-react'
import { socket } from '../../App' // ✅ App.jsx se global socket import
import API from '../../services/api'
import QRModal from './QRModal'

const quickReplies = ['Send Price List', 'Send Welcome Msg', 'Book Appointment']

export default function ActiveChats() {
  const [chats, setChats]           = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage]       = useState('')
  const [loading, setLoading]       = useState(true)
  const [sending, setSending]       = useState(false)
  const [waStatus, setWaStatus]     = useState('disconnected')
  const [qrCode, setQrCode]         = useState(null)
  const [showQR, setShowQR]         = useState(false)
  const [qrLoading, setQrLoading]   = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedChat?.messages])

  const fetchChats = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/leads')
      setChats(data.leads || [])
      if (data.leads?.length > 0 && !selectedChat) {
        setSelectedChat(data.leads[0])
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkWAStatus = async () => {
    try {
      const { data } = await API.get('/whatsapp/status')
      if (data.isConnected) setWaStatus('connected')
      else if (data.hasQR) setWaStatus('qr')
      else setWaStatus('disconnected')
    } catch (err) {
      setWaStatus('disconnected')
    }
  }

  // ✅ Cache bust fix + bounded retries with backoff (prevents runaway
  // polling that overlaps Puppeteer init calls and crashes the backend)
  const fetchQR = async (attempt = 0) => {
    const MAX_ATTEMPTS = 10
    try {
      setQrLoading(true)
      setShowQR(true)
      const { data } = await API.get('/whatsapp/qr', {
        params: { t: Date.now() },
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (data.qr) {
        setQrCode(data.qr)
        setWaStatus('qr')
        return
      }
      if (attempt >= MAX_ATTEMPTS) {
        console.error('QR not available after several attempts. Please try again.')
        setShowQR(false)
        return
      }
      // Backoff: 3s, then 5s for subsequent attempts (slower than the
      // server's own WhatsApp-init retry cycle, so we don't pile up
      // requests faster than the backend can actually process them)
      const delay = attempt === 0 ? 3000 : 5000
      setTimeout(() => fetchQR(attempt + 1), delay)
    } catch (err) {
      // 429 = rate limited by backend; back off longer instead of hammering
      if (err.response?.status === 429) {
        if (attempt < MAX_ATTEMPTS) {
          setTimeout(() => fetchQR(attempt + 1), 8000)
          return
        }
      }
      console.error('QR fetch failed:', err.message)
      setShowQR(false)
    } finally {
      setQrLoading(false)
    }
  }

  const handleWALogout = async () => {
    try {
      await API.post('/whatsapp/logout')
      setWaStatus('disconnected')
      setQrCode(null)
      setShowQR(false)
    } catch (err) {
      console.error('Logout failed:', err.message)
    }
  }

  useEffect(() => {
    fetchChats()
    checkWAStatus()

    socket.on('connect', () => console.log('✅ Socket Connected'))
    socket.on('connect_error', (err) => console.log('❌ Socket Error:', err.message))

    socket.on('whatsapp:qr', ({ qr }) => {
      setQrCode(qr)
      setWaStatus('qr')
      setShowQR(true)
    })

    socket.on('whatsapp:connected', () => {
      setWaStatus('connected')
      setQrCode(null)
      setShowQR(false)
    })

    socket.on('whatsapp:disconnected', () => setWaStatus('disconnected'))

    socket.on('whatsapp:new_lead', ({ lead }) => {
      setChats(prev => [lead, ...prev])
    })

    socket.on('whatsapp:message', ({ leadId, message: newMsg }) => {
      setChats(prev => prev.map(c =>
        c.id === leadId ? { ...c, messages: [...(c.messages || []), newMsg] } : c
      ))
      setSelectedChat(prev =>
        prev?.id === leadId ? { ...prev, messages: [...(prev.messages || []), newMsg] } : prev
      )
    })

    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('whatsapp:qr')
      socket.off('whatsapp:connected')
      socket.off('whatsapp:disconnected')
      socket.off('whatsapp:new_lead')
      socket.off('whatsapp:message')
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return
    const textToSend = message.trim()
    setMessage('')
    try {
      setSending(true)
      const { data } = await API.post(`/leads/${selectedChat.id}/messages`, {
        from: 'me', text: textToSend,
      })
      setSelectedChat(prev => ({ ...prev, messages: data.messages }))
      setChats(prev => prev.map(c =>
        c.id === selectedChat.id ? { ...c, messages: data.messages } : c
      ))
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      if (waStatus === 'connected' && selectedChat.phone) {
        await API.post('/whatsapp/send', {
          phone: selectedChat.phone, text: textToSend,
        }).catch(err => console.error('WA send error:', err.message))
      }
    } catch (err) {
      console.error('Send failed:', err.message)
      setMessage(textToSend)
    } finally {
      setSending(false)
    }
  }

  const sendQuickReply = (text) => setMessage(text)

  const selectChat = async (chat) => {
    try {
      const { data } = await API.get(`/leads/${chat.id}`)
      setSelectedChat(data.lead)
    } catch {
      setSelectedChat(chat)
    }
  }

  const WABadge = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={waStatus === 'connected' ? null : fetchQR}
        disabled={qrLoading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
          waStatus === 'connected'
            ? 'bg-green-100 text-green-700 cursor-default'
            : waStatus === 'qr'
            ? 'bg-amber-100 text-amber-700 cursor-pointer hover:bg-amber-200'
            : 'bg-red-100 text-red-600 cursor-pointer hover:bg-red-200'
        } ${qrLoading ? 'opacity-70 cursor-wait' : ''}`}
      >
        {waStatus === 'connected'
          ? <Wifi size={12} />
          : qrLoading
          ? <RefreshCw size={12} className="animate-spin" />
          : <WifiOff size={12} />
        }
        {waStatus === 'connected'
          ? 'WhatsApp Connected'
          : qrLoading ? 'Loading QR...'
          : waStatus === 'qr' ? 'Scan QR'
          : 'Connect WhatsApp'
        }
      </button>
      {waStatus === 'connected' && (
        <button
          onClick={handleWALogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
        >
          <LogOut size={12} /> Logout
        </button>
      )}
    </div>
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <h2 className="font-semibold text-gray-800 dark:text-white">Active Chats</h2>
        <WABadge />
      </div>

      {showQR && (
        <QRModal
          qrCode={qrCode}
          qrLoading={qrLoading}
          onClose={() => { setShowQR(false); setQrCode(null) }}
          onRefresh={fetchQR}
          waStatus={waStatus}
        />
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Chat List */}
        <div className="w-72 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 dark:text-white text-lg">Chats</span>
              <div className="flex gap-2">
                <button onClick={fetchChats} className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600">
                  <RefreshCw size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600">
                  <Edit size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search leads..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-400">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">No chats yet</div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-green-50/60 dark:bg-green-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-[#e8f5ee] dark:bg-green-900/30 rounded-full flex items-center justify-center text-[#1a6b3c] dark:text-green-400 text-xs font-bold">
                        {chat.avatar || chat.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{chat.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                          {new Date(chat.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {chat.messages?.at(-1)?.text || 'No messages yet'}
                      </p>
                      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {chat.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-w-0 overflow-hidden">
          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              Koi chat select karo 👈
            </div>
          ) : (
            <>
              <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#e8f5ee] dark:bg-green-900/30 rounded-full flex items-center justify-center text-[#1a6b3c] dark:text-green-400 text-xs font-bold">
                      {selectedChat.avatar || selectedChat.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{selectedChat.name}</h3>
                    <p className="text-xs text-green-500 font-medium">● Active Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {[Phone, Video, MoreVertical].map((Icon, i) => (
                    <button key={i} className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Icon size={15} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                <div className="text-center">
                  <span className="text-xs text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">Today</span>
                </div>
                {(selectedChat.messages || []).length === 0 ? (
                  <div className="text-center text-sm text-gray-400 mt-10">Koi message nahi — pehla message bhejo! 👋</div>
                ) : (
                  (selectedChat.messages || []).map((msg, i) => (
                    <div key={msg.id || i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl ${
                        msg.from === 'me'
                          ? 'bg-[#1a6b3c] text-white rounded-tr-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 ${msg.from === 'me' ? 'text-green-200' : 'text-gray-400'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 px-4 py-3 shrink-0">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2.5">
                  <button className="text-gray-400 hover:text-gray-600 shrink-0"><Paperclip size={16} /></button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || sending}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      message.trim() ? 'bg-[#1a6b3c] text-white hover:bg-[#155c33]' : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                    }`}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Lead Details */}
        {selectedChat && (
          <div className="w-72 border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto shrink-0">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white">Lead Details</h3>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: 'Phone',     value: selectedChat.phone },
                { label: 'Email',     value: selectedChat.email },
                { label: 'Deal Size', value: selectedChat.dealSize },
                { label: 'Source',    value: selectedChat.source },
              ].filter(f => f.value).map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">{field.label}</label>
                  <div className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-gray-200">
                    {field.value}
                  </div>
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Notes..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm dark:text-gray-200 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700">
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">Quick Replies</h3>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
              <div className="px-4 pb-4 space-y-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendQuickReply(reply)}
                    className="w-full py-2.5 border border-[#1a6b3c] dark:border-green-700 text-[#1a6b3c] dark:text-green-400 text-sm font-medium rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}