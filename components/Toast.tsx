'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/utils'

export type ToastType = 'success' | 'error'

export interface ToastData {
  id: string
  type: ToastType
  message: string
}

interface ToastItemProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg',
        'animate-in slide-in-from-bottom-2 fade-in duration-200',
        toast.type === 'success'
          ? 'border-stone-200 bg-white text-stone-800'
          : 'border-rose-100 bg-white text-rose-700',
      )}
      role="status"
      aria-live="polite"
    >
      {toast.type === 'success' ? (
        <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 rounded-full p-0.5 text-stone-400 transition hover:text-stone-600"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
