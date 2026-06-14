import React from 'react'
import { topAgents } from '../../data/mockData'

export default function TopAgents() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-gray-800">Top Agents</h3>
        <button className="text-xs text-[#1a6b3c] font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {topAgents.map((agent) => (
          <div key={agent.name} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#e8f5ee] rounded-full flex items-center justify-center text-[#1a6b3c] text-xs font-bold shrink-0">
              {agent.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800">{agent.name}</p>
                <span className="text-xs text-gray-500">{agent.percent}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1a6b3c] rounded-full transition-all"
                  style={{ width: `${agent.percent}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{agent.chats} Chats</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
