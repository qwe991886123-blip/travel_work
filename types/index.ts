import type { DbRegion, DbCategory, DbSpot, DbComment, DbSavedView } from './database.types'

// Re-export DB rows as domain types
export type Region = DbRegion
export type Category = DbCategory
export type Comment = DbComment

// Enriched Spot (with joined relations)
export interface Spot extends DbSpot {
  region: Region | null
  categories: Category[]
}

// Saved Views
export interface SavedViewFilters {
  region?: string
  categories?: string[]
  search?: string
}

export interface SavedView extends Omit<DbSavedView, 'filters'> {
  filters: SavedViewFilters
}

// Form
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

// Note segments
export type NoteSegmentType = 'text' | 'youtube' | 'image'

export interface NoteSegment {
  type: NoteSegmentType
  content: string
}
