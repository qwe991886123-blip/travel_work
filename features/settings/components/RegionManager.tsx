'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, Loader2, Globe } from 'lucide-react'
import { useRegions, useCreateRegion, useUpdateRegion, useDeleteRegion } from '@/hooks/useData'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import type { Region } from '@/types'

interface InlineEditProps {
  value: string
  subValue: string
  onSave: (name: string, country: string) => void
  onCancel: () => void
  isPending: boolean
}

function InlineEdit({ value, subValue, onSave, onCancel, isPending }: InlineEditProps) {
  const [name, setName]       = useState(value)
  const [country, setCountry] = useState(subValue)

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), country.trim())
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-3 py-2">
      <input value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }}
        placeholder="地區名稱" autoFocus
        className="min-w-0 flex-1 text-sm font-medium text-stone-900 outline-none" />
      <span className="text-stone-300">·</span>
      <input value={country} onChange={e => setCountry(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }}
        placeholder="國家（選填）"
        className="w-24 text-sm text-stone-500 outline-none" />
      <div className="flex gap-1">
        <button onClick={handleSave} disabled={!name.trim() || isPending}
          className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-40"
          aria-label="Save">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button onClick={onCancel} className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100" aria-label="Cancel">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface AddRowProps {
  onSave: (name: string, country: string) => void
  isPending: boolean
}

function AddRow({ onSave, isPending }: AddRowProps) {
  const [name, setName]       = useState('')
  const [country, setCountry] = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), country.trim())
    setName(''); setCountry('')
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-3 py-2">
      <input value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
        placeholder="新地區名稱"
        className="min-w-0 flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400" />
      <span className="text-stone-300">·</span>
      <input value={country} onChange={e => setCountry(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
        placeholder="國家（選填）"
        className="w-24 bg-transparent text-sm text-stone-500 outline-none placeholder:text-stone-400" />
      <button onClick={handleSave} disabled={!name.trim() || isPending}
        className="flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40">
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
        Add
      </button>
    </div>
  )
}

export default function RegionManager() {
  const { data: regions, isLoading } = useRegions()
  const createRegion = useCreateRegion()
  const updateRegion = useUpdateRegion()
  const deleteRegion = useDeleteRegion()

  const [editingId, setEditingId]   = useState<string | null>(null)
  const [deletingRegion, setDeletingRegion] = useState<Region | null>(null)

  const grouped = (regions ?? []).reduce<Record<string, Region[]>>((acc, r) => {
    const key = r.country ?? '其他'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
          <Globe className="h-4 w-4 text-stone-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">Regions</h2>
          <p className="text-xs text-stone-400">{regions?.length ?? 0} 個地區</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-11 animate-pulse rounded-2xl bg-stone-100" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([country, items]) => (
            <div key={country}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">{country}</p>
              <div className="space-y-2">
                {items.map(r => (
                  <div key={r.id}>
                    {editingId === r.id ? (
                      <InlineEdit
                        value={r.name}
                        subValue={r.country ?? ''}
                        isPending={updateRegion.isPending}
                        onSave={(name, country) =>
                          updateRegion.mutate({ id: r.id, data: { name, country } }, {
                            onSuccess: () => setEditingId(null),
                          })
                        }
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <div className="group flex items-center justify-between rounded-2xl border border-stone-100 bg-white px-4 py-2.5 transition hover:border-stone-200">
                        <span className="text-sm font-medium text-stone-800">{r.name}</span>
                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button onClick={() => setEditingId(r.id)}
                            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                            aria-label={`Edit ${r.name}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setDeletingRegion(r)}
                            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                            aria-label={`Delete ${r.name}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {(!regions || regions.length === 0) && (
            <p className="rounded-2xl border border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
              尚無地區。新增你的第一個旅遊地區。
            </p>
          )}
        </div>
      )}

      {/* Add row */}
      <AddRow
        isPending={createRegion.isPending}
        onSave={(name, country) => createRegion.mutate({ name, country })}
      />

      {/* Delete confirm */}
      {deletingRegion && (
        <DeleteConfirmDialog
          title={`Delete "${deletingRegion.name}"?`}
          description="This will remove the region. Spots in this region will become unlinked."
          isPending={deleteRegion.isPending}
          onConfirm={() => deleteRegion.mutate(deletingRegion.id, { onSuccess: () => setDeletingRegion(null) })}
          onCancel={() => setDeletingRegion(null)}
        />
      )}
    </div>
  )
}
