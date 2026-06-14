import React, { useState } from 'react'
import { Plus, Send, Eye, Reply, CheckCheck, MoreVertical, Users, Clock } from 'lucide-react'
import { campaigns } from '../../data/mockData'

const statusConfig = {
  Sent: { bg: 'bg-green-50', text: 'text-green-700' },
  Scheduled: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
}

const extraCampaigns = [
  { id: 4, name: 'Eid Special Deals', date: 'Scheduled · Apr 20, 2024 9:00 AM', sent: 3200, delivered: 0, read: 0, replied: 0, status: 'Scheduled' },
  { id: 5, name: 'Monthly Newsletter', date: 'Draft', sent: 0, delivered: 0, read: 0, replied: 0, status: 'Draft' },
]

const allCampaigns = [
  ...campaigns.map(c => ({ ...c, status: 'Sent' })),
  ...extraCampaigns,
]

const tabs = ['All', 'Sent', 'Scheduled', 'Draft']

export default function Broadcast() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' ? allCampaigns : allCampaigns.filter(c => c.status === activeTab)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-gray-800">Broadcast Campaigns</h2>
          <p className="text-sm text-gray-500 mt-0.5">Send messages to multiple contacts at once</p>
        </div>
        <button className="btn-primary">
          <Plus size={15} />
          Create Campaign
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: '5', icon: Send, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Total Sent', value: '4,102', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Avg. Read Rate', value: '68%', icon: Eye, bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Avg. Reply Rate', value: '14%', icon: Reply, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} shrink-0`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-display font-semibold text-xl text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab ? 'border-[#1a6b3c] text-[#1a6b3c]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="space-y-4">
        {filtered.map((c) => {
          const cfg = statusConfig[c.status]
          const isSent = c.status === 'Sent'
          return (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#e8f5ee] rounded-xl flex items-center justify-center shrink-0">
                    {c.status === 'Scheduled' ? <Clock size={18} className="text-[#1a6b3c]" /> : <Send size={18} className="text-[#1a6b3c]" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{c.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{c.date}</p>
                    <span className={`badge mt-1.5 ${cfg.bg} ${cfg.text}`}>{c.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSent && (
                    <button className="text-xs font-medium text-[#1a6b3c] border border-[#1a6b3c] px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors">
                      View Report
                    </button>
                  )}
                  {c.status === 'Scheduled' && (
                    <button className="text-xs font-medium text-blue-600 border border-blue-300 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors">
                      Edit Schedule
                    </button>
                  )}
                  {c.status === 'Draft' && (
                    <button className="text-xs font-medium text-gray-600 border border-gray-300 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                      Continue Editing
                    </button>
                  )}
                  <button className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <MoreVertical size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {isSent && (
                <div className="border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-8 mb-3">
                    {[
                      { label: 'Sent', value: c.sent, color: 'text-gray-800' },
                      { label: 'Delivered', value: c.delivered, color: 'text-blue-600' },
                      { label: 'Read', value: c.read, color: 'text-[#1a6b3c]' },
                      { label: 'Replied', value: c.replied, color: 'text-purple-600' },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className={`font-display font-semibold text-lg ${stat.color}`}>{stat.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                    <div className="flex-1 ml-4 space-y-2">
                      {[
                        { label: 'Delivered', val: c.delivered, color: 'bg-blue-400' },
                        { label: 'Read', val: c.read, color: 'bg-[#1a6b3c]' },
                        { label: 'Replied', val: c.replied, color: 'bg-purple-400' },
                      ].map((bar) => (
                        <div key={bar.label} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-14 shrink-0">{bar.label}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${bar.color} rounded-full`} style={{ width: `${Math.round((bar.val / c.sent) * 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-400 w-8 text-right">{Math.round((bar.val / c.sent) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {c.status === 'Scheduled' && (
                <div className="border-t border-gray-50 pt-3 flex items-center gap-2">
                  <Clock size={13} className="text-blue-400" />
                  <p className="text-xs text-gray-500">Will be sent to <span className="font-medium text-gray-700">{c.sent.toLocaleString()} contacts</span></p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
