'use client'

import { X, MapPin, ExternalLink, Map } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Spot } from '@/types'
import NotesRenderer from '@/components/NotesRenderer'
import CommentTimeline from '@/features/comments/components/CommentTimeline'

interface DetailPanelProps {
  spot: Spot
  onClose: () => void
}

export default function DetailPanel({ spot, onClose }: DetailPanelProps) {
  const router = useRouter()

  return (
    <section className="flex h-full flex-col" aria-label={`Details for ${spot.title}`}>
      {/* Hero image */}
      <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden bg-stone-100">
        {spot.cover_image ? (
          <img
            src={spot.cover_image}
            alt={spot.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-12 w-12 text-stone-300" />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white xl:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close detail panel"
        >
          <X className="h-4 w-4 text-stone-700" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-5">
          {/* Title & address */}
          <div>
            <h2 className="text-2xl font-bold leading-tight text-stone-900">{spot.title}</h2>
            {spot.address && (
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-stone-500">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                {spot.address}
              </p>
            )}
          </div>

          {/* Tags */}
          {(spot.region || spot.categories.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {spot.region && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  📍 {spot.region.name}
                </span>
              )}
              {spot.categories.map(cat => (
                <span
                  key={cat.id}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600"
                >
                  {cat.icon && <span className="mr-1">{cat.icon}</span>}
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {spot.description && (
            <p className="text-sm leading-7 text-stone-700">{spot.description}</p>
          )}

          {/* Map link */}
          {spot.map_url && (
            <a
              href={spot.map_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:bg-stone-100"
              aria-label="Open map"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                <Map className="h-4 w-4 text-stone-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  MAP
                </div>
                <div className="truncate text-sm text-stone-700">{spot.map_url}</div>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-stone-400" />
            </a>
          )}

          {/* Notes */}
          {spot.notes && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                Notes
              </h3>
              <NotesRenderer notes={spot.notes} />
            </div>
          )}

          <hr className="border-stone-100" />

          <CommentTimeline spotId={spot.id} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-stone-200 p-5">
        <button
          onClick={() => router.push(`/spots/${spot.id}`)}
          className="w-full rounded-2xl bg-stone-900 py-3.5 text-sm font-medium text-white transition hover:opacity-90 min-h-[48px]"
        >
          Open Full Page →
        </button>
      </div>
    </section>
  )
}
