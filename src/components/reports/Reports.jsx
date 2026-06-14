import React, { useState } from 'react'
import { TrendingUp, Users, MessageCircle, Calendar, Download, ChevronDown } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const monthlyData = [
  { month: 'Aug', leads: 180, chats: 120, appointments: 28 },
  { month: 'Sep', leads: 220, chats: 145, appointments: 35 },
  { month: 'Oct', leads: 195, chats: 160, appointments: 30 },
  { month: 'Nov', leads: 260, chats: 190, appointments: 42 },
  { month: 'Dec', leads: 310, chats: 210, appointments: 38 },
  { month: 'Jan', leads: 380, chats: 255, appointments: 45 },
]

const conversionData = [
  { stage: 'Leads', value: 2450 },
  { stage: 'Contacted', value: 1680 },
  { stage: 'Proposal', value: 890 },
  { stage: 'Won', value: 420 },
]

const agentData = [
  { name: 'Ahsan Ali', leads: 89, closed: 34, revenue: '42 Lacs' },
  { name: 'Sarah Khan', leads: 74, closed: 28, revenue: '35 Lacs' },
  { name: 'Usman Ahmed', leads: 61, closed: 19, revenue: '24 Lacs' },
  { name: 'Fatima Noor', leads: 53, closed: 15, revenue: '18 Lacs' },
]

const periods = ['Last 7 days', 'Last 30 days', 'Last 6 months', 'This year']

export default function Reports() {
  const [period, setPeriod] = useState('Last 6 months')
  const [showPeriod, setShowPeriod] = useState(false)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-xl text-gray-800">Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Business performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriod(!showPeriod)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors"
            >
              {period}
              <ChevronDown size={14} />
            </button>
            {showPeriod && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[160px]">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setShowPeriod(false) }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${period === p ? 'text-[#1a6b3c] font-medium' : 'text-gray-600'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: '2,450', change: '+18%', icon: Users, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'Total Chats', value: '1,280', change: '+12%', icon: MessageCircle, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Appointments', value: '218', change: '+9%', icon: Calendar, bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Conversion Rate', value: '17.1%', change: '+3.2%', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.bg}`}>
                <k.icon size={16} className={k.color} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{k.change}</span>
            </div>
            <p className="font-display font-semibold text-2xl text-gray-800">{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Leads & Chats trend */}
        <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Leads & Chats Trend</h3>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#16a34a" strokeWidth={2} fill="url(#gLeads)" dot={false} />
              <Area type="monotone" dataKey="chats" name="Chats" stroke="#3b82f6" strokeWidth={2} fill="url(#gChats)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion funnel */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-display font-semibold text-gray-800 mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {conversionData.map((item, i) => {
              const pct = Math.round((item.value / conversionData[0].value) * 100)
              const colors = ['bg-[#1a6b3c]', 'bg-green-400', 'bg-green-300', 'bg-green-200']
              const textColors = ['text-[#1a6b3c]', 'text-green-600', 'text-green-500', 'text-green-400']
              return (
                <div key={item.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 font-medium">{item.stage}</span>
                    <span className={`text-xs font-semibold ${textColors[i]}`}>{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 text-right">{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly appointments bar chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-display font-semibold text-gray-800 mb-4">Monthly Appointments</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            <Bar dataKey="appointments" name="Appointments" fill="#1a6b3c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent performance table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-display font-semibold text-gray-800">Agent Performance</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {['Agent', 'Leads Handled', 'Deals Closed', 'Revenue', 'Close Rate'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agentData.map((agent, i) => {
              const closeRate = Math.round((agent.closed / agent.leads) * 100)
              return (
                <tr key={agent.name} className={`hover:bg-gray-50/50 transition-colors ${i < agentData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[#1a6b3c] text-[10px] font-bold">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{agent.leads}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{agent.closed}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{agent.revenue}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a6b3c] rounded-full" style={{ width: `${closeRate}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-8">{closeRate}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
