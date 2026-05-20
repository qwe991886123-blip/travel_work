'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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

interface MenuPosition {
  top: number
  left: number
}

export default function SpotActionsMenu({
  spotId,
  spotTitle,
  onOpenDetail,
  onEdit,
  onDelete,
}: SpotActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<MenuPosition>({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // getBoundingClientRect gives viewport-relative coords.
  // Use position: fixed so we don't need to account for any scroll offset.
  const openMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const MENU_WIDTH = 176 // w-44
    // Align right edge of menu with right edge of button
    // Clamp so it never goes off the left of the screen
    const left = Math.max(8, rect.right - MENU_WIDTH)
    setPos({ top: rect.bottom + 4, left })
    setOpen(v => !v)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape or any scroll (gallery container scroll included)
  useEffect(() => {
    if (!open) return
    const onKey    = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onScroll = () => setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true) // capture: catches all scroll events
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  const item = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    danger = false,
  ) => (
    <button
      onClick={(e) => { e.stopPropagation(); setOpen(false); onClick() }}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
        danger
          ? 'text-rose-500 hover:bg-rose-50'
          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900',
      )}
    >
      {icon}
      {label}
    </button>
  )

  const dropdown = (
    <div
      ref={menuRef}
      // position: fixed — viewport-relative, immune to overflow-hidden AND transform stacking contexts
      style={{ position: 'fixed', top: pos.top, left: pos.left }}
      className="z-[9999] w-44 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
      role="menu"
      aria-label={`Actions for ${spotTitle}`}
      onClick={e => e.stopPropagation()}
    >
      {item(<PanelRight   className="h-4 w-4" />, 'Open Detail', onOpenDetail)}
      {item(<ExternalLink className="h-4 w-4" />, 'Open Page', () => router.push(`/spots/${spotId}`))}
      <div className="my-1 border-t border-stone-100" />
      {item(<Pencil className="h-4 w-4" />, 'Edit',   onEdit)}
      {item(<Trash2 className="h-4 w-4" />, 'Delete', onDelete, true)}
    </div>
  )

  return (
    <div onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        onClick={openMenu}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={open}
        className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(dropdown, document.body)
        : null}
    </div>
  )
}
