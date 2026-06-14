import React from 'react'
import { Construction } from 'lucide-react'

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-10">
      <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-4">
        <Construction size={28} className="text-[#1a6b3c]" />
      </div>
      <h2 className="font-display font-semibold text-xl text-gray-700 dark:text-gray-300 mb-2">{title}</h2>
      <p className="text-gray-400 dark:text-gray-500 text-sm">Yeh page abhi develop ho raha hai</p>
    </div>
  )
}
