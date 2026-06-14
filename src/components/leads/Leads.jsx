import React, { useState } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'
import KanbanBoard from './KanbanBoard'

export default function Leads() {
  const [view, setView] = useState('board')
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-gray-800 dark:text-white">Leads</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <button onClick={() => setView('board')} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${view==='board' ? 'bg-[#1a6b3c] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><LayoutGrid size={13} />Board View</button>
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${view==='list' ? 'bg-[#1a6b3c] text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}><List size={13} />List View</button>
          </div>
          <button className="btn-primary"><Plus size={15} />Add Lead</button>
        </div>
      </div>
      <KanbanBoard />
    </div>
  )
}
