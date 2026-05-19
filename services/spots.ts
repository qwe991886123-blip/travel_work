import { createClient } from '@/lib/supabase/client'
import type { Spot, SpotFormData, SavedViewFilters } from '@/types'
import type { DbSpotInsert, DbSpotUpdate, DbSpotCategoryInsert } from '@/types/database.types'

// ─── Join result shape ────────────────────────────────────────────────────────
interface FetchedCategory {
  id: string; name: string; icon: string | null; created_at: string
}
interface FetchedRegion {
  id: string; name: string; country: string | null; created_at: string
}
interface FetchedSpotCategoryJoin {
  category_id: string
  categories: FetchedCategory | null
}
interface FetchedSpotRow {
  id: string; title: string; description: string | null
  address: string | null; map_url: string | null
  region_id: string | null; cover_image: string | null
  notes: string | null; is_favorite: boolean
  deleted_at: string | null; created_at: string; updated_at: string
  region: FetchedRegion | null
  spot_categories: FetchedSpotCategoryJoin[]
}

function toSpot(row: FetchedSpotRow): Spot {
  return {
    id: row.id, title: row.title, description: row.description,
    address: row.address, map_url: row.map_url, region_id: row.region_id,
    cover_image: row.cover_image, notes: row.notes, is_favorite: row.is_favorite,
    deleted_at: row.deleted_at, created_at: row.created_at, updated_at: row.updated_at,
    region: row.region,
    categories: row.spot_categories
      .map(sc => sc.categories)
      .filter((c): c is FetchedCategory => c !== null),
  }
}

const SPOT_SELECT =
  'id, title, description, address, map_url, region_id, cover_image, notes, is_favorite, deleted_at, created_at, updated_at, ' +
  'region:regions(id, name, country, created_at), ' +
  'spot_categories(category_id, categories(id, name, icon, created_at))'

// ─── fetchSpots ───────────────────────────────────────────────────────────────
export async function fetchSpots(filters?: SavedViewFilters): Promise<Spot[]> {
  const supabase = createClient()

  let query = supabase
    .from('spots')
    .select(SPOT_SELECT)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }

  if (filters?.region) {
    const { data: regionRow, error: rErr } = await supabase
      .from('regions')
      .select('id')
      .eq('name', filters.region)
      .maybeSingle()
    if (rErr) throw new Error(rErr.message)
    if (!regionRow) return []
    query = query.eq('region_id', regionRow.id)
  }

  if (filters?.categories && filters.categories.length > 0) {
    const { data: catRows, error: cErr } = await supabase
      .from('categories').select('id').in('name', filters.categories)
    if (cErr) throw new Error(cErr.message)
    if (catRows && catRows.length > 0) {
      const catIds = catRows.map(c => c.id)
      const { data: scRows, error: scErr } = await supabase
        .from('spot_categories').select('spot_id').in('category_id', catIds)
      if (scErr) throw new Error(scErr.message)
      const spotIds = [...new Set((scRows ?? []).map(s => s.spot_id))]
      if (spotIds.length === 0) return []
      query = query.in('id', spotIds)
    }
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return ((data ?? []) as unknown as FetchedSpotRow[]).map(toSpot)
}

// ─── fetchSpotById ────────────────────────────────────────────────────────────
export async function fetchSpotById(id: string): Promise<Spot | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('spots').select(SPOT_SELECT).eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return toSpot(data as unknown as FetchedSpotRow)
}

// ─── createSpot ───────────────────────────────────────────────────────────────
export async function createSpot(formData: SpotFormData): Promise<Spot> {
  const supabase = createClient()
  const { category_ids, ...fields } = formData

  const payload: DbSpotInsert = {
    title: fields.title,
    region_id: fields.region_id || null,
    map_url: fields.map_url || null,
    address: fields.address || null,
    description: fields.description || null,
    notes: fields.notes || null,
    cover_image: fields.cover_image || null,
  }

  const { data: created, error } = await supabase
    .from('spots').insert(payload).select('id').single()
  if (error) throw new Error(error.message)

  if (category_ids.length > 0) {
    const catPayload: DbSpotCategoryInsert[] = category_ids.map(cid => ({
      spot_id: created.id, category_id: cid,
    }))
    const { error: catErr } = await supabase.from('spot_categories').insert(catPayload)
    if (catErr) throw new Error(catErr.message)
  }

  const spot = await fetchSpotById(created.id)
  if (!spot) throw new Error('Created spot not found')
  return spot
}

// ─── updateSpot ───────────────────────────────────────────────────────────────
export async function updateSpot(id: string, formData: Partial<SpotFormData>): Promise<Spot> {
  const supabase = createClient()
  const { category_ids, ...fields } = formData

  const payload: DbSpotUpdate = { updated_at: new Date().toISOString() }
  if (fields.title       !== undefined) payload.title       = fields.title
  if (fields.region_id   !== undefined) payload.region_id   = fields.region_id   || null
  if (fields.map_url     !== undefined) payload.map_url     = fields.map_url     || null
  if (fields.address     !== undefined) payload.address     = fields.address     || null
  if (fields.description !== undefined) payload.description = fields.description || null
  if (fields.notes       !== undefined) payload.notes       = fields.notes       || null
  if (fields.cover_image !== undefined) payload.cover_image = fields.cover_image || null

  const { error } = await supabase.from('spots').update(payload).eq('id', id)
  if (error) throw new Error(error.message)

  if (category_ids !== undefined) {
    const { error: delErr } = await supabase
      .from('spot_categories').delete().eq('spot_id', id)
    if (delErr) throw new Error(delErr.message)
    if (category_ids.length > 0) {
      const catPayload: DbSpotCategoryInsert[] = category_ids.map(cid => ({
        spot_id: id, category_id: cid,
      }))
      const { error: catErr } = await supabase.from('spot_categories').insert(catPayload)
      if (catErr) throw new Error(catErr.message)
    }
  }

  const spot = await fetchSpotById(id)
  if (!spot) throw new Error('Updated spot not found')
  return spot
}

// ─── softDeleteSpot (v1.1: soft delete) ──────────────────────────────────────
export async function softDeleteSpot(id: string): Promise<void> {
  const supabase = createClient()
  const payload: DbSpotUpdate = { deleted_at: new Date().toISOString() }
  const { error } = await supabase.from('spots').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── deleteSpot (hard delete, kept for admin use) ─────────────────────────────
export async function deleteSpot(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('spots').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── toggleFavorite ───────────────────────────────────────────────────────────
export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const supabase = createClient()
  const payload: DbSpotUpdate = { is_favorite: isFavorite, updated_at: new Date().toISOString() }
  const { error } = await supabase.from('spots').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── uploadCoverImage ─────────────────────────────────────────────────────────
export async function uploadCoverImage(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('spot-images').upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('spot-images').getPublicUrl(filename)
  return data.publicUrl
}
