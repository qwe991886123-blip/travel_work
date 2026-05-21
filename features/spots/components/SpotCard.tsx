'use client'

import { Heart } from 'lucide-react'
import type { Spot } from '@/types'
import { cn } from '@/utils'
import { useToggleFavorite } from '@/hooks/useSpots'
import SpotActionsMenu from './SpotActionsMenu'

interface SpotCardProps {
  spot: Spot
  isSelected: boolean
  onSelect: (spot: Spot) => void
  onEdit: (spot: Spot) => void
  onDelete: (spot: Spot) => void
}

export default function SpotCard({ spot, isSelected, onSelect, onEdit, onDelete }: SpotCardProps) {
  const toggleFav = useToggleFavorite()

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFav.mutate({ id: spot.id, isFavorite: !spot.is_favorite })
  }

  return (
    <article
      onClick={() => onSelect(spot)}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        isSelected ? 'border-stone-900 ring-2 ring-stone-900/10' : 'border-stone-200'
      )}
      aria-label={`View details for ${spot.title}`}
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {spot.cover_image ? (
          <img src={spot.cover_image} alt={spot.title} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <span className="text-4xl">📍</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold leading-tight text-stone-900">{spot.title}</h2>
            {spot.region && (
              <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                <span className="text-xs">📍</span>
                {spot.region.name}
              </p>
            )}
          </div>

          {/* Actions: favorite + more menu */}
          <div className="flex flex-shrink-0 items-center gap-1" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleFavorite}
              aria-label={spot.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              className={cn(
                'rounded-full p-2 transition hover:bg-stone-100',
                spot.is_favorite ? 'text-rose-500' : 'text-stone-300 hover:text-stone-500'
              )}
            >
              <Heart className={cn('h-4 w-4', spot.is_favorite && 'fill-current')} />
            </button>
            <SpotActionsMenu
              spotId={spot.id}
              spotTitle={spot.title}
              onOpenDetail={() => onSelect(spot)}
              onEdit={() => onEdit(spot)}
              onDelete={() => onDelete(spot)}
            />
          </div>
        </div>

        {spot.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {spot.categories.map(cat => (
              <span key={cat.id}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 transition-colors">
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {spot.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">{spot.description}</p>
        )}
      </div>
    </article>
  )
}
