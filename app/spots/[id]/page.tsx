'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, ExternalLink, Map, Loader2 } from 'lucide-react'
import { useSpot } from '@/hooks/useSpots'
import NotesRenderer from '@/components/NotesRenderer'
import CommentTimeline from '@/features/comments/components/CommentTimeline'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SpotPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: spot, isLoading, error } = useSpot(id)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f3]">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    )
  }

  if (error || !spot) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f3]">
        <div className="text-5xl">🗺️</div>
        <h1 className="mt-4 text-xl font-semibold text-stone-700">Spot not found</h1>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-stone-500 transition hover:text-stone-900"
        >
          ← Back to workspace
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f5f3]">
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-stone-200 bg-[#f6f5f3]/95 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Travel Workspace
          </button>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-10">
        {/* Hero */}
        {spot.cover_image && (
          <div className="mb-8 aspect-video overflow-hidden rounded-3xl shadow-sm">
            <img
              src={spot.cover_image}
              alt={spot.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">{spot.title}</h1>
          {spot.address && (
            <p className="mt-3 flex items-center gap-2 text-stone-500">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {spot.address}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {spot.region && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                📍 {spot.region.name}
              </span>
            )}
            {spot.categories.map(cat => (
              <span
                key={cat.id}
                className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600"
              >
                {cat.icon && <span className="mr-1">{cat.icon}</span>}
                {cat.name}
              </span>
            ))}
          </div>
        </header>

        {/* Description */}
        {spot.description && (
          <section className="mb-8">
            <p className="text-lg leading-8 text-stone-600">{spot.description}</p>
          </section>
        )}

        {/* Map */}
        {spot.map_url && (
          <section className="mb-8">
            <a
              href={spot.map_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100">
                <Map className="h-5 w-5 text-stone-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Map
                </div>
                <div className="truncate text-sm text-stone-700">{spot.map_url}</div>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-stone-400" />
            </a>
          </section>
        )}

        {/* Notes */}
        {spot.notes && (
          <section className="mb-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
              Travel Notes
            </h2>
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <NotesRenderer notes={spot.notes} />
            </div>
          </section>
        )}

        {/* Comments */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <CommentTimeline spotId={spot.id} />
        </section>
      </article>
    </div>
  )
}
