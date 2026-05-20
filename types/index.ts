// Re-export all domain types from their respective files.
// All existing imports ( @/types ) continue to work unchanged.

export type { Region, RegionFormData }          from './region'
export type { Category, CategoryFormData }       from './category'
export type { Comment }                          from './comment'
export type {
  Spot,
  SpotFormData,
  SavedViewFilters,
  SavedView,
  NoteSegmentType,
  NoteSegment,
}                                                from './spot'
