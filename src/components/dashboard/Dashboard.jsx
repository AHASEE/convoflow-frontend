import React from 'react'
import { Users, MessageCircle, Calendar, TrendingUp } from 'lucide-react'
import StatsCard from './StatsCard'
import LeadsChart from './LeadsChart'
import LeadSourceChart from './LeadSourceChart'
import RecentActivity from './RecentActivity'
import TopAgents from './TopAgents'

const stats = [
  { icon: Users, label: 'Total Leads', value: '2,450', change: '+12.5%', changePositive: true, iconBg: 'bg-green-50' },
  { icon: MessageCircle, label: 'Active Chats', value: '128', change: '+8.3%', changePositive: true, iconBg: 'bg-blue-50' },
  { icon: Calendar, label: 'Appointments', value: '45', change: '+16.2%', changePositive: true, iconBg: 'bg-purple-50' },
  { icon: TrendingUp, label: 'Conversion Rate', value: '24.6%', change: '+3.1%', changePositive: true, iconBg: 'bg-amber-50' },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Date badge */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">Overview for Jan 01 - Jan 31</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <LeadsChart />
        </div>
        <LeadSourceChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        <RecentActivity />
        <TopAgents />
      </div>
    </div>
  )
}
