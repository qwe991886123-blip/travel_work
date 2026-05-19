'use client'

import { parseNotes, getYouTubeEmbedUrl } from '@/utils'

interface NotesRendererProps {
  notes: string
}

export default function NotesRenderer({ notes }: NotesRendererProps) {
  const segments = parseNotes(notes)

  return (
    <div className="space-y-4">
      {segments.map((seg, i) => {
        if (seg.type === 'youtube') {
          const embedUrl = getYouTubeEmbedUrl(seg.content)
          if (!embedUrl) return null
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-stone-200">
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )
        }

        if (seg.type === 'image') {
          return (
            <div key={i} className="overflow-hidden rounded-2xl border border-stone-200">
              <img
                src={seg.content}
                alt="Note image"
                loading="lazy"
                className="w-full object-cover"
              />
            </div>
          )
        }

        return (
          <p key={i} className="whitespace-pre-wrap text-sm leading-7 text-stone-600">
            {seg.content}
          </p>
        )
      })}
    </div>
  )
}
