'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Pencil, Trash2, ExternalLink, PanelRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils'

interface SpotActionsMenuProps {
  spotId: string
  spotTitle: string
  onOpenDetail: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function SpotActionsMenu({
  spotId,
  spotTitle,
  onOpenDetail,
  onEdit,
  onDelete,
}: SpotActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const item = (icon: React.ReactNode, label: string, onClick: () => void, danger = false) => (
    <button
      onClick={() => { setOpen(false); onClick() }}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
        danger
          ? 'text-rose-500 hover:bg-rose-50'
          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
      )}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <div ref={menuRef} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={open}
        className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-8 z-50 w-44 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
          role="menu"
          aria-label={`Actions for ${spotTitle}`}
        >
          {item(<PanelRight className="h-4 w-4" />, 'Open Detail', onOpenDetail)}
          {item(<ExternalLink className="h-4 w-4" />, 'Open Page', () => router.push(`/spots/${spotId}`))}
          <div className="my-1 border-t border-stone-100" />
          {item(<Pencil className="h-4 w-4" />, 'Edit', onEdit)}
          {item(<Trash2 className="h-4 w-4" />, 'Delete', onDelete, true)}
        </div>
      )}
    </div>
  )
}
