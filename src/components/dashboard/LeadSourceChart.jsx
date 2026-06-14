import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { leadSourceData } from '../../data/mockData'

export default function LeadSourceChart() {
  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-gray-800 dark:text-white mb-4">Lead Source</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={leadSourceData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {leadSourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => <span className="text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
