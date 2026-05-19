import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { NoteSegment } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url)
}

export function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url)
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (!match) return null
  return `https://www.youtube.com/embed/${match[1]}`
}

export function parseNotes(notes: string): NoteSegment[] {
  const lines = notes.split('\n')
  const result: NoteSegment[] = []
  const textBuffer: string[] = []

  const flushText = () => {
    const joined = textBuffer.join('\n').trim()
    if (joined) result.push({ type: 'text', content: joined })
    textBuffer.length = 0
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && isYouTubeUrl(trimmed)) {
      flushText()
      result.push({ type: 'youtube', content: trimmed })
    } else if (trimmed && isImageUrl(trimmed)) {
      flushText()
      result.push({ type: 'image', content: trimmed })
    } else {
      textBuffer.push(line)
    }
  }

  flushText()
  return result
}
