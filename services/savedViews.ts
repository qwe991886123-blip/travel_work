import { createClient } from '@/lib/supabase/client'
import type { SavedView, SavedViewFilters } from '@/types'
import type { DbSavedViewInsert, DbSavedViewUpdate, Json } from '@/types/database.types'

// ─── Serialisation ─────────────────────────────────────────────────────────────
function filtersToJson(filters: SavedViewFilters): Json {
  // SavedViewFilters is a plain object with string/string[] values — safe cast
  return filters as unknown as Json
}

function jsonToFilters(json: Json): SavedViewFilters {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) return {}
  const obj = json as Record<string, Json>
  const result: SavedViewFilters = {}
  if (typeof obj.region === 'string') result.region = obj.region
  if (typeof obj.search === 'string') result.search = obj.search
  if (Array.isArray(obj.categories)) {
    result.categories = obj.categories.filter((c): c is string => typeof c === 'string')
  }
  return result
}

// ─── Row → domain ──────────────────────────────────────────────────────────────
function toSavedView(row: {
  id: string
  name: string
  filters: Json
  created_at: string
}): SavedView {
  return { ...row, filters: jsonToFilters(row.filters) }
}

// ─── fetchSavedViews ──────────────────────────────────────────────────────────
export async function fetchSavedViews(): Promise<SavedView[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('saved_views')
    .select('id, name, filters, created_at')
    .order('created_at')
  if (error) throw new Error(error.message)
  return data.map(toSavedView)
}

// ─── createSavedView ──────────────────────────────────────────────────────────
export async function createSavedView(
  name: string,
  filters: SavedViewFilters
): Promise<SavedView> {
  const supabase = createClient()
  const payload: DbSavedViewInsert = { name, filters: filtersToJson(filters) }
  const { data, error } = await supabase
    .from('saved_views')
    .insert(payload)
    .select('id, name, filters, created_at')
    .single()
  if (error) throw new Error(error.message)
  return toSavedView(data)
}

// ─── updateSavedView ──────────────────────────────────────────────────────────
export async function updateSavedView(
  id: string,
  updates: { name?: string; filters?: SavedViewFilters }
): Promise<SavedView> {
  const supabase = createClient()
  const payload: DbSavedViewUpdate = {}
  if (updates.name !== undefined)    payload.name    = updates.name
  if (updates.filters !== undefined) payload.filters = filtersToJson(updates.filters)

  const { data, error } = await supabase
    .from('saved_views')
    .update(payload)
    .eq('id', id)
    .select('id, name, filters, created_at')
    .single()
  if (error) throw new Error(error.message)
  return toSavedView(data)
}

// ─── deleteSavedView ──────────────────────────────────────────────────────────
export async function deleteSavedView(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('saved_views').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
