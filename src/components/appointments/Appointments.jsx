import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { appointments } from '../../data/mockData'

const tabs = ['Upcoming', 'Completed', 'Cancelled']

const TAB_COUNTS = { Upcoming: 8, Completed: 24, Cancelled: 3 }

function Avatar({ name }) {
  const COLORS = [
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  ]
  const cls = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${cls}`}>
      {name?.slice(0, 2).toUpperCase() || '??'}
    </div>
  )
}

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('Upcoming')

  const filtered = appointments.filter(a =>
    activeTab === 'Upcoming'
      ? a.status === 'Confirmed' || a.status === 'Pending'
      : activeTab === 'Completed'
      ? a.status === 'Completed'
      : a.status === 'Cancelled'
  )

  return (
    <div className="p-7 min-h-full bg-gray-50 dark:bg-gray-900">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-blue-900/30 shrink-0">
            <Calendar size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              Appointments
            </h2>
            <p className="text-xs font-medium text-blue-500 mt-0.5">
              {TAB_COUNTS[activeTab]} {activeTab.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Date badge */}
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 shadow-sm">
            <Clock size={13} className="text-gray-400 dark:text-gray-500" />
            <span>Today — 15 Jan, 2025</span>
          </div>

          {/* Nav arrows */}
          <button className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
          <button className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChevronRight size={14} className="text-gray-500 dark:text-gray-400" />
          </button>

          {/* New Appointment */}
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-md shadow-green-200 dark:shadow-green-900/40 transition-all">
            <Plus size={15} />
            New Appointment
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 w-fit shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-green-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab}
            {TAB_COUNTS[tab] > 0 && activeTab !== tab && (
              <span className="ml-1.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                {TAB_COUNTS[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                {['Time', 'Contact', 'Purpose', 'Agent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(filtered.length > 0 ? filtered : appointments).map((appt, i, arr) => (
                <tr
                  key={appt.id}
                  className={`table-row ${i < arr.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''}`}
                >
                  {/* Time */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500 shrink-0" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {appt.time}
                      </span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={appt.contact} />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {appt.contact}
                      </span>
                    </div>
                  </td>

                  {/* Purpose */}
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-[180px]">
                    <span className="truncate block">{appt.purpose}</span>
                  </td>

                  {/* Agent */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[9px] font-bold text-gray-500 dark:text-gray-400 shrink-0">
                        {appt.agent?.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{appt.agent}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      appt.status === 'Confirmed'  ? 'badge-confirmed' :
                      appt.status === 'Completed'  ? 'badge-customer'  :
                      appt.status === 'Cancelled'  ? 'badge-cancelled' :
                      'badge-pending'
                    }`}>
                      {appt.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <Pencil size={12} className="text-blue-500 dark:text-blue-400" />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        <Trash2 size={12} className="text-red-400 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{(filtered.length > 0 ? filtered : appointments).length}</span> appointments
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <ChevronLeft size={13} className="text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-green-500 text-white text-xs font-semibold shadow-sm">1</button>
            <button className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">2</button>
            <button className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <ChevronRight size={13} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}