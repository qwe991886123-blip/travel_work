import type { DbSpot, DbSavedView } from './database.types'
import type { Region } from './region'
import type { Category } from './category'

// Enriched Spot with joined relations
export interface Spot extends DbSpot {
  region: Region | null
  categories: Category[]
}

export interface SpotFormData {
  title: string
  region_id: string
  category_ids: string[]
  map_url: string
  address: string
  description: string
  notes: string
  cover_image?: string
}

export interface SavedViewFilters {
  region?: string
  categories?: string[]
  search?: string
}

export interface SavedView extends Omit<DbSavedView, 'filters'> {
  filters: SavedViewFilters
}

export type NoteSegmentType = 'text' | 'youtube' | 'image'

export interface NoteSegment {
  type: NoteSegmentType
  content: string
}
