import React, { useState } from 'react'
import { MessageCircle, Phone, MoreVertical, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'
import API from '../../services/api'

const TAG_CLASSES = {
  'Hot Prospect': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'New Lead':     'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Customer':     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Pending':      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}

const SOURCE_CLASSES = {
  'WhatsApp': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Manual':   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  'Website':  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Referral': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

const AVATAR_COLORS = [
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
]

function Avatar({ name }) {
  const initials = name?.slice(0, 2).toUpperCase() || '??'
  const colorClass = AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${colorClass}`}>
      {initials}
    </div>
  )
}

const HEADERS = ['Name', 'Phone', 'Email', 'Tag', 'Source', 'Last Activity', 'Actions']

export default function ContactsTable({ contacts, loading, page, pages, total, onPageChange, onRefresh }) {
  const [menuOpen, setMenuOpen] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return
    try {
      await API.delete(`/leads/${id}`)
      onRefresh()
    } catch (err) {
      console.error('Delete failed:', err.message)
    }
    setMenuOpen(null)
  }

  if (loading) return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500">
      <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-600 border-t-green-500 rounded-full animate-spin" />
      <span className="text-sm">Loading contacts...</span>
    </div>
  )

  if (contacts.length === 0) return (
    <div className="py-16 flex flex-col items-center justify-center gap-2">
      <span className="text-3xl">📭</span>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No contacts found</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
    </div>
  )

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
              {HEADERS.map(h => (
                <th key={h} className="table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr
                key={c.id}
                className={`table-row ${i < contacts.length - 1 ? 'border-b border-gray-50 dark:border-gray-700/50' : ''}`}
              >
                {/* Name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} />
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                        {c.name}
                      </div>
                      {c.source && (
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          via {c.source}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {c.phone || <span className="text-gray-300 dark:text-gray-600">—</span>}
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                  {c.email || <span className="text-gray-300 dark:text-gray-600">—</span>}
                </td>

                {/* Tag */}
                <td className="px-4 py-3">
                  {c.tag
                    ? <span className={`badge ${TAG_CLASSES[c.tag] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{c.tag}</span>
                    : <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>
                  }
                </td>

                {/* Source */}
                <td className="px-4 py-3">
                  {c.source
                    ? <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${SOURCE_CLASSES[c.source] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{c.source}</span>
                    : <span className="text-gray-300 dark:text-gray-600 text-sm">—</span>
                  }
                </td>

                {/* Last Activity */}
                <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                  {c.updatedAt
                    ? new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : <span className="text-gray-300 dark:text-gray-600">—</span>
                  }
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 relative">
                    {/* Chat */}
                    <button className="w-7 h-7 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                      <MessageCircle size={13} className="text-green-600 dark:text-green-400" />
                    </button>
                    {/* Phone */}
                    <button className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <Phone size={13} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    {/* More */}
                    <button
                      onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                      className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <MoreVertical size={13} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    {menuOpen === c.id && (
                      <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden w-40 p-1">
                        <button className="w-full px-3 py-2 rounded-lg text-xs font-medium text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                          <Edit2 size={12} className="text-gray-400 dark:text-gray-500" /> Edit Contact
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="w-full px-3 py-2 rounded-lg text-xs font-medium text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{contacts.length}</span> of <span className="font-semibold text-gray-700 dark:text-gray-300">{total}</span> contacts
        </p>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={13} className="text-gray-500 dark:text-gray-400" />
          </button>

          {/* Pages */}
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                n === page
                  ? 'bg-green-500 text-white shadow-sm shadow-green-200 dark:shadow-green-900/30'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {n}
            </button>
          ))}

          {pages > 5 && (
            <>
              <span className="text-xs text-gray-400 dark:text-gray-500 px-1">...</span>
              <button
                onClick={() => onPageChange(pages)}
                className="w-7 h-7 rounded-lg text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {pages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={13} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}