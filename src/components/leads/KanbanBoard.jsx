import React, { useState, useEffect } from 'react'
import {
  DndContext, DragOverlay,
  PointerSensor, TouchSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove, sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import API from '../../services/api'

/* ─────────────────────────────────────────── */
/* Column config — backend status se match     */
/* ─────────────────────────────────────────── */
const COLUMNS = [
  { id: 'new',      label: 'New Lead',      bg: 'bg-blue-50 dark:bg-blue-900/20',     dot: 'bg-blue-400'   },
  { id: 'contacted',label: 'Contacted',     bg: 'bg-yellow-50 dark:bg-yellow-900/20', dot: 'bg-yellow-400' },
  { id: 'proposal', label: 'Proposal Sent', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-400' },
  { id: 'won',      label: 'Won',           bg: 'bg-green-50 dark:bg-green-900/20',   dot: 'bg-green-500'  },
]

const COL_IDS = COLUMNS.map(c => c.id)

/* ─────────────────────────────────────────── */
/* Single Card (sortable)                      */
/* ─────────────────────────────────────────── */
function KanbanCard({ card, isDragging = false }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging: isSorting,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card group ${isDragging ? 'shadow-xl rotate-1 scale-105' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ background: card.color || '#10b981' }}
        >
          {card.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{card.name}</p>
          {card.dealSize && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Budget: {card.dealSize}
            </p>
          )}
          {card.phone && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{card.phone}</p>
          )}
        </div>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
        >
          <GripVertical size={13} className="text-gray-400" />
        </div>
      </div>

      {/* Tag */}
      {card.tag && (
        <div className="mt-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {card.tag}
          </span>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Single Column                               */
/* ─────────────────────────────────────────── */
function KanbanColumn({ col, cards, isOver }) {
  const ids = cards.map(c => c.id)

  return (
    <div className={`kanban-col ${col.bg} ${isOver ? 'ring-2 ring-green-400 ring-offset-1' : ''} transition-all`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.dot}`} />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{col.label}</span>
        <span className="ml-auto bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
          {cards.length}
        </span>
      </div>

      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {cards.map(card => (
            <KanbanCard key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* Main KanbanBoard                            */
/* ─────────────────────────────────────────── */
export default function KanbanBoard() {
  const [leads, setLeads]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeId, setActiveId] = useState(null)
  const [overId, setOverId]     = useState(null)
  const [savingId, setSavingId] = useState(null) // optimistic update tracking

  // ── Fetch all leads (no pagination — board view needs all) ──
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const { data } = await API.get('/leads', {
          params: { limit: 200 }, // sab le aao
        })
        setLeads(data.leads || [])
      } catch (err) {
        console.error('Failed to fetch leads:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor,  { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,    { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeLead   = leads.find(l => l.id === activeId)
  const getColLeads  = (colId) => leads.filter(l => l.status === colId)
  const findColOfId  = (id) => leads.find(l => l.id === id)?.status

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragOver = ({ active, over }) => {
    if (!over) return
    setOverId(over.id)

    const activeCol = findColOfId(active.id)
    const overCol   = COL_IDS.includes(over.id)
      ? over.id
      : findColOfId(over.id)

    if (!activeCol || !overCol || activeCol === overCol) return

    // Optimistic UI update — backend call dragEnd mein
    setLeads(prev =>
      prev.map(l => l.id === active.id ? { ...l, status: overCol } : l)
    )
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null)
    setOverId(null)
    if (!over) return

    const activeCol = findColOfId(active.id)
    const overCol   = COL_IDS.includes(over.id)
      ? over.id
      : findColOfId(over.id)

    if (!activeCol || !overCol) return

    // Same column — reorder only (no API call needed)
    if (activeCol === overCol) {
      const colLeads = getColLeads(activeCol)
      const oldIdx   = colLeads.findIndex(l => l.id === active.id)
      const newIdx   = colLeads.findIndex(l => l.id === over.id)
      if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
        const reordered = arrayMove(colLeads, oldIdx, newIdx)
        setLeads(prev => [
          ...prev.filter(l => l.status !== activeCol),
          ...reordered,
        ])
      }
      return
    }

    // Different column — PATCH /:id/status API call
    try {
      setSavingId(active.id)
      await API.patch(`/leads/${active.id}/status`, { status: overCol })
    } catch (err) {
      console.error('Status update failed:', err.message)
      // Rollback on error
      setLeads(prev =>
        prev.map(l => l.id === active.id ? { ...l, status: activeCol } : l)
      )
    } finally {
      setSavingId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-400 dark:text-gray-500">
      <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-600 border-t-green-500 rounded-full animate-spin" />
      <span className="text-sm">Loading leads...</span>
    </div>
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            col={col}
            cards={getColLeads(col.id)}
            isOver={
              overId === col.id ||
              getColLeads(col.id).some(l => l.id === overId)
            }
          />
        ))}
      </div>

      {/* Floating card while dragging */}
      <DragOverlay>
        {activeLead ? (
          <div className="kanban-card shadow-2xl rotate-2 scale-105 w-52 opacity-95">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: activeLead.color || '#10b981' }}
              >
                {activeLead.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activeLead.name}</p>
                {activeLead.dealSize && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Budget: {activeLead.dealSize}</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}