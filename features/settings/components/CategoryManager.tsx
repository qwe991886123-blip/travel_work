'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, Loader2, Tag } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useData'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/Toast'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import type { Category } from '@/types'

const EMOJI_SUGGESTIONS = ['☕', '🍜', '🏛️', '⛩️', '📸', '🛍️', '🌿', '🌙', '🏪', '🏖️', '🎌', '🍣', '🍺', '🎭', '🌸']

interface InlineEditProps {
  icon: string | null
  name: string
  onSave: (name: string, icon: string) => void
  onCancel: () => void
  isPending: boolean
}

function InlineEdit({ icon, name, onSave, onCancel, isPending }: InlineEditProps) {
  const [editName, setEditName] = useState(name)
  const [editIcon, setEditIcon] = useState(icon ?? '')

  const handleSave = () => {
    if (!editName.trim()) return
    onSave(editName.trim(), editIcon.trim())
  }

  return (
    <div className="space-y-2 rounded-2xl border border-stone-300 bg-white p-3">
      <div className="flex items-center gap-2">
        <input value={editIcon} onChange={e => setEditIcon(e.target.value)}
          placeholder="🏷️" maxLength={4}
          className="w-12 rounded-xl border border-stone-200 p-2 text-center text-lg outline-none focus:border-stone-400" />
        <input value={editName} onChange={e => setEditName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel() }}
          placeholder="分類名稱" autoFocus
          className="flex-1 text-sm font-medium text-stone-900 outline-none" />
        <button onClick={handleSave} disabled={!editName.trim() || isPending}
          className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 disabled:opacity-40"
          aria-label="Save">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button onClick={onCancel}
          className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100"
          aria-label="Cancel">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {EMOJI_SUGGESTIONS.map(e => (
          <button key={e} onClick={() => setEditIcon(e)}
            className={`rounded-lg px-2 py-1 text-lg transition hover:bg-stone-100 ${editIcon === e ? 'bg-stone-100' : ''}`}>
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}

interface AddRowProps {
  onSave: (name: string, icon: string) => void
  isPending: boolean
}

function AddRow({ onSave, isPending }: AddRowProps) {
  const [name, setName]         = useState('')
  const [icon, setIcon]         = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), icon.trim())
    setName(''); setIcon(''); setShowEmoji(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 px-3 py-2">
        <button onClick={() => setShowEmoji(v => !v)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-lg transition hover:bg-stone-50"
          title="Pick emoji">
          {icon || <Plus className="h-3.5 w-3.5 text-stone-400" />}
        </button>
        <input value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
          placeholder="新分類名稱"
          className="flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400" />
        <button onClick={handleSave} disabled={!name.trim() || isPending}
          className="flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40">
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
          Add
        </button>
      </div>
      {showEmoji && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-stone-100 bg-white p-3">
          {EMOJI_SUGGESTIONS.map(e => (
            <button key={e} onClick={() => { setIcon(e); setShowEmoji(false) }}
              className={`rounded-lg px-2 py-1 text-lg transition hover:bg-stone-100 ${icon === e ? 'bg-stone-100' : ''}`}>
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryManager() {
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const { toasts, show: showToast, dismiss } = useToast()

  const [editingId, setEditingId]             = useState<string | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
          <Tag className="h-4 w-4 text-stone-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">Categories</h2>
          <p className="text-xs text-stone-400">{categories?.length ?? 0} 個分類</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-11 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {(categories ?? []).map(cat => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                <InlineEdit
                  icon={cat.icon}
                  name={cat.name}
                  isPending={updateCategory.isPending}
                  onSave={(name, icon) =>
                    updateCategory.mutate(
                      { id: cat.id, data: { name, icon } },
                      {
                        onSuccess: () => { setEditingId(null); showToast('Category updated') },
                        onError:   () => showToast('Failed to update category', 'error'),
                      },
                    )
                  }
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="group flex items-center justify-between rounded-2xl border border-stone-100 bg-white px-4 py-2.5 transition hover:border-stone-200">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-stone-800">
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => setEditingId(cat.id)}
                      className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                      aria-label={`Edit ${cat.name}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeletingCategory(cat)}
                      className="rounded-lg p-1.5 text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
                      aria-label={`Delete ${cat.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {(!categories || categories.length === 0) && (
            <p className="rounded-2xl border border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
              尚無分類。新增你的第一個分類。
            </p>
          )}
        </div>
      )}

      <AddRow
        isPending={createCategory.isPending}
        onSave={(name, icon) =>
          createCategory.mutate(
            { name, icon },
            {
              onSuccess: () => showToast('Category added'),
              onError:   () => showToast('Failed to add category', 'error'),
            },
          )
        }
      />

      {deletingCategory && (
        <DeleteConfirmDialog
          title={`Delete "${deletingCategory.name}"?`}
          description="This will remove the category from all spots."
          isPending={deleteCategory.isPending}
          onConfirm={() =>
            deleteCategory.mutate(deletingCategory.id, {
              onSuccess: () => { setDeletingCategory(null); showToast('Category deleted') },
              onError:   () => { setDeletingCategory(null); showToast('Failed to delete category', 'error') },
            })
          }
          onCancel={() => setDeletingCategory(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}
