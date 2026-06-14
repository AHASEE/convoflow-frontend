import React, { useState } from 'react'
import { Plus, Zap, MessageCircle, Clock, Users, ToggleLeft, ToggleRight, ChevronRight, Star } from 'lucide-react'

const automations = [
  {
    id: 1,
    name: 'Welcome New Lead',
    trigger: 'New contact added',
    action: 'Send WhatsApp message',
    message: 'Assalam o Alaikum! ConvoFlow mein khush aamdeed. Hum aapki kaise madad kar sakte hain?',
    runs: 248,
    active: true,
    icon: MessageCircle,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    name: 'Appointment Reminder',
    trigger: '1 hour before appointment',
    action: 'Send reminder message',
    message: 'Yaad dihani: Aapka appointment 1 ghante mein hai. Waqt par aa jaayein!',
    runs: 134,
    active: true,
    icon: Clock,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 3,
    name: 'Follow Up — No Reply',
    trigger: 'No reply in 48 hours',
    action: 'Send follow-up message',
    message: 'Kya aap humara offer consider kar rahe hain? Koi sawaal ho to zaroor poochein!',
    runs: 89,
    active: true,
    icon: MessageCircle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 4,
    name: 'Hot Prospect Tag',
    trigger: 'Contact opens message 3+ times',
    action: 'Add "Hot Prospect" tag',
    message: null,
    runs: 56,
    active: false,
    icon: Star,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    id: 5,
    name: 'New Lead Notify Agent',
    trigger: 'New lead from website',
    action: 'Notify assigned agent',
    message: 'Naya lead aaya hai! Jaldi follow-up karein.',
    runs: 312,
    active: true,
    icon: Users,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
]

export default function Automation() {
  const [items, setItems] = useState(automations)

  const toggleActive = (id) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  const activeCount = items.filter(a => a.active).length

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-gray-800">Automation</h2>
          <p className="text-sm text-gray-500 mt-0.5">Automatic workflows for WhatsApp messages</p>
        </div>
        <button className="btn-primary">
          <Plus size={15} />
          New Automation
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Automations', value: items.length, color: 'text-gray-800', bg: 'bg-gray-50' },
          { label: 'Active', value: activeCount, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Total Runs', value: items.reduce((s, a) => s + a.runs, 0).toLocaleString(), color: 'text-blue-700', bg: 'bg-blue-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`font-display font-semibold text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((auto) => {
          const Icon = auto.icon
          return (
            <div key={auto.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${auto.active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.iconBg} shrink-0`}>
                  <Icon size={18} className={auto.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{auto.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{auto.runs} runs</span>
                      <button onClick={() => toggleActive(auto.id)}>
                        {auto.active
                          ? <ToggleRight size={22} className="text-[#1a6b3c]" />
                          : <ToggleLeft size={22} className="text-gray-300" />
                        }
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      Trigger: {auto.trigger}
                    </div>
                    <ChevronRight size={14} className="text-gray-300 shrink-0" />
                    <div className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {auto.action}
                    </div>
                  </div>
                  {auto.message && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-start gap-2">
                      <MessageCircle size={13} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-500 leading-relaxed">{auto.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
