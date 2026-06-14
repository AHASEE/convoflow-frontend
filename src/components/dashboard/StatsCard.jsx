import React from 'react'
import { TrendingUp } from 'lucide-react'

export default function StatsCard({ icon: Icon, label, value, change, changePositive, iconBg }) {
  return (
    <div className="stat-card flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-[#1a6b3c]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="font-display font-semibold text-2xl text-gray-800 leading-none">{value}</p>
        <p className={`text-xs mt-1.5 flex items-center gap-1 ${changePositive ? 'text-green-600' : 'text-red-500'}`}>
          <TrendingUp size={11} />
          {change} from last month
        </p>
      </div>
    </div>
  )
}
