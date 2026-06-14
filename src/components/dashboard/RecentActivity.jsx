import React from 'react'
import { User, Calendar, MessageCircle, Globe } from 'lucide-react'
import { recentActivity } from '../../data/mockData'

const typeConfig = {
  prospect: { icon: User, bg: 'bg-red-50', color: 'text-red-500' },
  appointment: { icon: Calendar, bg: 'bg-blue-50', color: 'text-blue-500' },
  message: { icon: MessageCircle, bg: 'bg-green-50', color: 'text-green-600' },
  lead: { icon: Globe, bg: 'bg-purple-50', color: 'text-purple-500' },
}

export default function RecentActivity() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {recentActivity.map((item) => {
          const cfg = typeConfig[item.type]
          const Icon = cfg.icon
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.bg} shrink-0`}>
                <Icon size={14} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-tight">{item.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
