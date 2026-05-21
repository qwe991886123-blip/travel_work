'use client'

import { useState, useCallback } from 'react'
import type { ToastData, ToastType } from '@/components/Toast'

let _id = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const show = useCallback((message: string, type: ToastType = 'success') => {
    const id = String(++_id)
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, show, dismiss }
}
