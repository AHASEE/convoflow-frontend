import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { chartData } from '../../data/mockData'

export default function LeadsChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-800">Leads & Conversations</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#86efac" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
            cursor={{ stroke: '#e5e7eb' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
          <Area type="monotone" dataKey="leads" name="New Leads" stroke="#16a34a" strokeWidth={2} fill="url(#colorLeads)" dot={false} />
          <Area type="monotone" dataKey="conversations" name="Conversations" stroke="#86efac" strokeWidth={2} fill="url(#colorConv)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
