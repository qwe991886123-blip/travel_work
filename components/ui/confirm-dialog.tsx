'use client'

import { Loader2 } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  confirmClassName?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
  icon?: React.ReactNode
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  confirmClassName = 'bg-stone-900 text-white hover:opacity-90',
  isPending = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
        {icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50">
            {icon}
          </div>
        )}
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-stone-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{description}</p>
        )}
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
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition disabled:opacity-50 min-h-[48px] ${confirmClassName}`}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
