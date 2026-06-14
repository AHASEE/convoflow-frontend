import React, { useState, useEffect } from 'react'
import { QrCode, CheckCircle, Loader } from 'lucide-react'

export default function QRModal({ qrCode, onClose, waStatus }) {
  const [phase, setPhase] = useState('qr') // qr → scanned → loading → done
  const [progress, setProgress] = useState(0)
  const [loadingMsg, setLoadingMsg] = useState('Connecting to WhatsApp...')

  const loadingMessages = [
    'QR Scanned! ✅',
    'Handshaking with WhatsApp...',
    'Creating session...',
    'Syncing messages...',
    'Almost done...',
    'Connected! 🎉',
  ]

  // Jab waStatus connected ho jaye
  useEffect(() => {
    if (waStatus === 'connected' && phase !== 'done') {
      setPhase('done')
      setProgress(100)
    }
  }, [waStatus])

  // Jab QR scan hota hai — progress simulate karo
  useEffect(() => {
    if (phase !== 'loading') return

    let current = 0
    let msgIndex = 0

    const interval = setInterval(() => {
      // Progress slowly barhao — 95% tak (last 5% connected event pe)
      if (current < 95) {
        const increment = current < 30 ? 8 : current < 60 ? 5 : current < 80 ? 3 : 1
        current = Math.min(current + increment, 95)
        setProgress(current)

        // Message update karo
        const newMsgIndex = Math.floor((current / 95) * (loadingMessages.length - 1))
        if (newMsgIndex !== msgIndex && newMsgIndex < loadingMessages.length) {
          msgIndex = newMsgIndex
          setLoadingMsg(loadingMessages[newMsgIndex])
        }
      }
    }, 400)

    return () => clearInterval(interval)
  }, [phase])

  // Backend se loading_screen event aane pe
  useEffect(() => {
    // Agar QR scan hua toh phase change karo
    // yeh socket event se trigger hoga — parent se prop pass hoga
  }, [])

  const handleScanDetected = () => {
    setPhase('loading')
    setProgress(5)
    setLoadingMsg('QR Scanned! ✅')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl p-6 text-center shadow-2xl max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 justify-center mb-1">
          <QrCode size={20} className="text-green-600" />
          <h3 className="font-semibold text-gray-800">
            {phase === 'done' ? 'WhatsApp Connected! 🎉' : 'Connect WhatsApp'}
          </h3>
        </div>

        {/* QR Phase */}
        {(phase === 'qr') && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Open WhatsApp → Linked Devices → Link a Device
            </p>
            <div className="relative">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`}
                alt="WhatsApp QR"
                className="w-56 h-56 mx-auto rounded-xl border border-gray-200"
              />
              {/* Scan animation overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-0.5 bg-green-400/60 animate-scan-line" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              After scanning, it will connect automatically
            </p>

            {/* Manual scan detect button */}
            <button
              onClick={handleScanDetected}
              className="mt-3 text-xs text-green-600 hover:text-green-700 underline"
            >
              Already scanned? Click here
            </button>
          </>
        )}

        {/* Loading Phase */}
        {(phase === 'loading' || phase === 'done') && (
          <>
            <p className="text-sm text-gray-500 mb-5 mt-1">{loadingMsg}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? '#1a6b3c'
                    : 'linear-gradient(90deg, #1a6b3c, #25D366)',
                }}
              />
            </div>

            <p className="text-xs text-gray-400 mb-4">{progress}% complete</p>

            {/* WhatsApp Logo Animation */}
            <div className="flex items-center justify-center mb-4">
              {phase === 'done' ? (
                <CheckCircle size={48} className="text-green-500 animate-bounce" />
              ) : (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Loader size={24} className="text-green-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {phase === 'done' && (
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1a6b3c] text-white rounded-xl text-sm font-medium hover:bg-[#155c33] transition-colors"
              >
                Start Chatting! 🚀
              </button>
            )}
          </>
        )}

        {phase === 'qr' && (
          <button
            onClick={onClose}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 block mx-auto"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

// =============================================
// ActiveChats.jsx mein yeh changes karo:
// =============================================

// 1. Import karo:
// import QRModal from './QRModal'

// 2. State add karo:
// const [scanPhase, setScanPhase] = useState('qr')

// 3. Socket events mein add karo:
// socket.on('whatsapp:loading', ({ percent }) => {
//   setScanPhase('loading')  
// })

// 4. QR Modal replace karo:
// {showQR && qrCode && (
//   <QRModal
//     qrCode={qrCode}
//     onClose={() => setShowQR(false)}
//     waStatus={waStatus}
//   />
// )}

// 5. whatsappService.js mein add karo:
// client.on("loading_screen", (percent, message) => {
//   if (io) io.emit("whatsapp:loading", { percent, message })
// })