'use client'

import { useState, useCallback } from 'react'
import { Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import type { Spot, SavedViewFilters } from '@/types'
import { useSpots, useSoftDeleteSpot } from '@/hooks/useSpots'
import { useToast } from '@/hooks/useToast'
import SpotCard from '@/features/spots/components/SpotCard'
import SpotCardSkeleton from '@/features/spots/components/SpotCardSkeleton'
import DetailPanel from '@/features/spots/components/DetailPanel'
import SavedViewTabs from '@/features/views/components/SavedViewTabs'
import SpotFormModal from '@/features/spots/components/SpotFormModal'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import SearchBar from '@/components/SearchBar'
import { ToastContainer } from '@/components/Toast'

export default function WorkspacePage() {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null)
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [filters, setFilters]           = useState<SavedViewFilters>({})
  const [search, setSearch]             = useState('')
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingSpot, setEditingSpot]   = useState<Spot | undefined>(undefined)
  const [deletingSpot, setDeletingSpot] = useState<Spot | null>(null)

  const activeFilters: SavedViewFilters = { ...filters, search: search || undefined }
  const { data: spots, isLoading, error } = useSpots(activeFilters)
  const softDelete = useSoftDeleteSpot()
  const { toasts, show: showToast, dismiss } = useToast()

  const handleViewChange = useCallback((id: string | null, viewFilters: SavedViewFilters) => {
    setActiveViewId(id)
    setFilters(viewFilters)
    setSelectedSpot(null)
  }, [])

  const handleSpotSelect = useCallback((spot: Spot) => {
    setSelectedSpot(prev => prev?.id === spot.id ? null : spot)
  }, [])

  const handleEdit = useCallback((spot: Spot) => {
    setEditingSpot(spot)
    setModalOpen(true)
  }, [])

  const handleDelete = useCallback((spot: Spot) => {
    setDeletingSpot(spot)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setEditingSpot(undefined)
  }, [])

  const confirmDelete = () => {
    if (!deletingSpot) return
    softDelete.mutate(deletingSpot.id, {
      onSuccess: () => {
        showToast(`"${deletingSpot.title}" deleted`)
        setDeletingSpot(null)
        if (selectedSpot?.id === deletingSpot.id) setSelectedSpot(null)
      },
      onError: () => {
        showToast('Failed to delete spot', 'error')
        setDeletingSpot(null)
      },
    })
  }

  const panelOpen = selectedSpot !== null

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f5f3]">

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#f6f5f3]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900">
                    <span className="text-sm">🗺️</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                    Travel Workspace
                  </h1>
                </div>
                <p className="mt-1 text-sm text-stone-500">Save places you want to visit.</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/settings"
                  className="flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 min-h-[44px]">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>
                <button
                  onClick={() => { setEditingSpot(undefined); setModalOpen(true) }}
                  className="flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 sm:px-5 sm:py-3 min-h-[44px]">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Spot</span>
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="w-full sm:w-64">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <div className="flex-1 overflow-hidden">
                <SavedViewTabs activeViewId={activeViewId} onViewChange={handleViewChange} />
              </div>
            </div>
          </div>
        </header>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            {isLoading ? (
              <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${panelOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-4'}`}>
                {Array.from({ length: 8 }).map((_, i) => <SpotCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl">⚠️</div>
                <h2 className="mt-4 text-lg font-semibold text-stone-700">Failed to load spots</h2>
                <p className="mt-2 text-sm text-stone-500">Check your Supabase connection and environment variables.</p>
              </div>
            ) : !spots || spots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl">🗺️</div>
                <h2 className="mt-5 text-lg font-semibold text-stone-700">
                  {search || filters.region ? 'No spots found' : 'No spots yet'}
                </h2>
                <p className="mt-2 text-sm text-stone-400">
                  {search || filters.region
                    ? 'Try a different search or filter.'
                    : 'Start collecting places you want to visit.'}
                </p>
                {!search && !filters.region && (
                  <button
                    onClick={() => { setEditingSpot(undefined); setModalOpen(true) }}
                    className="mt-6 flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
                    <Plus className="h-4 w-4" />
                    Add your first spot
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${panelOpen ? 'xl:grid-cols-2' : 'xl:grid-cols-4'} transition-all duration-300`}>
                {spots.map(spot => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    isSelected={selectedSpot?.id === spot.id}
                    onSelect={handleSpotSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Detail panel — desktop ───────────────────────────────────── */}
      {selectedSpot && (
        <aside className="hidden w-[420px] flex-shrink-0 overflow-hidden border-l border-stone-200 bg-white xl:flex xl:flex-col">
          <DetailPanel spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
        </aside>
      )}

      {/* ── Detail panel — mobile bottom sheet ──────────────────────── */}
      {selectedSpot && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedSpot(null)} aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl">
            <div className="flex justify-center py-2.5" aria-hidden>
              <div className="h-1 w-10 rounded-full bg-stone-200" />
            </div>
            <div className="flex-1 overflow-hidden">
              <DetailPanel spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit modal ─────────────────────────────────────────── */}
      {modalOpen && (
        <SpotFormModal
          spot={editingSpot}
          onClose={handleModalClose}
          onSuccess={(msg) => showToast(msg)}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {/* ── Delete confirmation ──────────────────────────────────────── */}
      {deletingSpot && (
        <DeleteConfirmDialog
          title={`Delete "${deletingSpot.title}"?`}
          description="This spot will be removed from your workspace."
          isPending={softDelete.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingSpot(null)}
        />
      )}

      {/* ── Toast notifications ──────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
