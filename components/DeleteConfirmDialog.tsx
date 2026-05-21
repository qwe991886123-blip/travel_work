'use client'

import { Loader2, Trash2 } from 'lucide-react'

interface DeleteConfirmDialogProps {
  title: string
  description?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  title,
  description = 'This action cannot be undone.',
  isPending = false,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
          <Trash2 className="h-5 w-5 text-rose-500" />
        </div>

        {/* Text */}
        <h2 id="delete-dialog-title" className="text-lg font-semibold text-stone-900">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{description}</p>

        {/* Actions — min-h-[48px] ensures touch targets */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex flex-1 items-center justify-center rounded-2xl border border-stone-200 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-50 min-h-[48px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 py-3 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-50 min-h-[48px]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
