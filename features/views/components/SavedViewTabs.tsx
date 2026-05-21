'use client'

import { useState } from 'react'
import { Plus, X, LayoutGrid } from 'lucide-react'
import { useSavedViews, useCreateSavedView, useDeleteSavedView } from '@/hooks/useData'
import type { SavedViewFilters } from '@/types'
import { cn } from '@/utils'

interface SavedViewTabsProps {
  activeViewId: string | null
  onViewChange: (id: string | null, filters: SavedViewFilters) => void
}

export default function SavedViewTabs({ activeViewId, onViewChange }: SavedViewTabsProps) {
  const { data: views, isLoading } = useSavedViews()
  const createView = useCreateSavedView()
  const deleteView = useDeleteSavedView()

  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    await createView.mutateAsync({ name: trimmed, filters: {} })
    setNewName('')
    setIsCreating(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') { setIsCreating(false); setNewName('') }
  }

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Saved filter views"
    >
      {/* All spots tab */}
      <button
        role="tab"
        aria-selected={activeViewId === null}
        onClick={() => onViewChange(null, {})}
        className={cn(
          'flex flex-shrink-0 items-center gap-1.5 rounded-2xl border px-4 py-2 text-sm font-medium transition min-h-[40px]',
          activeViewId === null
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        全部
      </button>

      {/* Dynamic views */}
      {!isLoading &&
        views?.map(view => (
          <div key={view.id} className="group relative flex-shrink-0">
            <button
              role="tab"
              aria-selected={activeViewId === view.id}
              onClick={() => onViewChange(view.id, view.filters)}
              className={cn(
                'flex items-center gap-1.5 rounded-2xl border px-4 py-2 pr-8 text-sm font-medium transition min-h-[40px]',
                activeViewId === view.id
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
              )}
            >
              {view.name}
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                deleteView.mutate(view.id)
                if (activeViewId === view.id) onViewChange(null, {})
              }}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 opacity-0 transition group-hover:opacity-100',
                activeViewId === view.id
                  ? 'text-white/60 hover:text-white'
                  : 'text-stone-400 hover:text-stone-700'
              )}
              aria-label={`Delete ${view.name} view`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

      {/* Create new view */}
      {isCreating ? (
        <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl border border-stone-300 bg-white px-3 py-1.5">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="View name..."
            aria-label="New view name"
            className="w-28 text-sm outline-none"
          />
          <button
            onClick={handleCreate}
            className="text-stone-500 hover:text-stone-900"
            aria-label="Confirm create view"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => { setIsCreating(false); setNewName('') }}
            className="text-stone-400 hover:text-stone-600"
            aria-label="Cancel create view"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="flex flex-shrink-0 items-center gap-1 rounded-2xl border border-dashed border-stone-300 px-3 py-2 text-sm text-stone-400 transition hover:border-stone-400 hover:text-stone-600"
          aria-label="Create new view"
        >
          <Plus className="h-3.5 w-3.5" />
          New View
        </button>
      )}
    </div>
  )
}
