import React, { useState, useEffect } from 'react'
import { Plus, Search, Users, RefreshCw, X } from 'lucide-react'
import ContactsTable from './ContactsTable'
import API from '../../services/api'

const SOURCES = ['All Sources', 'WhatsApp', 'Manual', 'Website', 'Referral']
const SOURCE_ICONS = {
  'All Sources': '🌐',
  'WhatsApp':    '💬',
  'Manual':      '✏️',
  'Website':     '🌍',
  'Referral':    '🤝',
}

export default function Contacts() {
  const [contacts, setContacts]         = useState([])
  const [total, setTotal]               = useState(0)
  const [page, setPage]                 = useState(1)
  const [pages, setPages]               = useState(1)
  const [source, setSource]             = useState('')
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/leads', {
        params: { page, limit: 10, source: source || undefined, search: search || undefined },
      })
      setContacts(data.leads || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch (err) {
      console.error('Failed to fetch contacts:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [page, source])
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchContacts() }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const handleAddContact = async (formData) => {
    try {
      await API.post('/leads', formData)
      fetchContacts()
      setShowAddModal(false)
    } catch (err) {
      console.error('Failed to add contact:', err.message)
    }
  }

  return (
    <div className="p-7 min-h-full bg-gray-50 dark:bg-gray-900">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md shadow-green-200 dark:shadow-green-900/30 shrink-0">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              Contacts
            </h2>
            <p className="text-xs font-medium text-green-500 mt-0.5">
              {total.toLocaleString()} total contacts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={fetchContacts}
            title="Refresh"
            className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={14} className="text-gray-500 dark:text-gray-400" />
          </button>

          {/* Add Contact */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-md shadow-green-200 dark:shadow-green-900/40 transition-all"
          >
            <Plus size={15} />
            Add Contact
          </button>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap mb-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-[260px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[34px] pl-8 pr-8 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />

        {/* Source pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SOURCES.map(f => {
            const isActive = (f === 'All Sources' && !source) || source === f
            return (
              <button
                key={f}
                onClick={() => { setSource(f === 'All Sources' ? '' : f); setPage(1) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-green-500 text-white shadow-sm shadow-green-200 dark:shadow-green-900/30'
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <span className="text-[11px]">{SOURCE_ICONS[f]}</span>
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="card overflow-hidden">
        <ContactsTable
          contacts={contacts}
          loading={loading}
          page={page}
          pages={pages}
          total={total}
          onPageChange={setPage}
          onRefresh={fetchContacts}
        />
      </div>

      {/* ── Modal ── */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddContact}
        />
      )}
    </div>
  )
}

/* ─────────────────────────── */
/*  Add Contact Modal          */
/* ─────────────────────────── */
function AddContactModal({ onClose, onSave }) {
  const [form, setForm]     = useState({ name: '', phone: '', email: '', source: 'Manual', tag: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
  }

  const fields = [
    { label: 'Full Name',     key: 'name',  type: 'text',  placeholder: 'Kamran Khan',        required: true },
    { label: 'Phone Number',  key: 'phone', type: 'text',  placeholder: '+92 300 1234567' },
    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'email@example.com' },
  ]

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Plus size={15} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Add New Contact</div>
              <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Fill in the contact details below</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <X size={13} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {fields.map(({ label, key, type, placeholder, required }) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => {
                  setForm(prev => ({ ...prev, [key]: e.target.value }))
                  if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
                }}
                className={`input-field ${
                  errors[key]
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/10 focus:ring-red-100 dark:focus:ring-red-900/20 focus:border-red-400'
                    : ''
                }`}
              />
              {errors[key] && (
                <p className="text-[11px] text-red-500 font-medium mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          {/* Source + Tag */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Source', key: 'source', options: ['Manual', 'WhatsApp', 'Website', 'Referral'] },
              { label: 'Tag',    key: 'tag',    options: ['', 'New Lead', 'Hot Prospect', 'Customer', 'Pending'] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide">
                  {label}
                </label>
                <select
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="input-field"
                >
                  {options.map(o => <option key={o} value={o}>{o || 'None'}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-md shadow-green-200 dark:shadow-green-900/30 transition-all"
          >
            Save Contact
          </button>
        </div>
      </div>
    </div>
  )
}