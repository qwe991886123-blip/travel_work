import { createClient } from '@/lib/supabase/client'
import type { Region, Category, RegionFormData, CategoryFormData } from '@/types'
import type {
  DbRegionInsert, DbRegionUpdate,
  DbCategoryInsert, DbCategoryUpdate,
} from '@/types/database.types'

// ─── Regions ──────────────────────────────────────────────────────────────────
export async function fetchRegions(): Promise<Region[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('regions')
    .select('id, name, country, created_at')
    .order('country', { ascending: true, nullsFirst: false })
    .order('name')
  if (error) throw new Error(error.message)
  return data
}

export async function createRegion(formData: RegionFormData): Promise<Region> {
  const supabase = createClient()
  const payload: DbRegionInsert = {
    name: formData.name.trim(),
    country: formData.country.trim() || null,
  }
  const { data, error } = await supabase
    .from('regions')
    .insert(payload)
    .select('id, name, country, created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateRegion(id: string, formData: Partial<RegionFormData>): Promise<Region> {
  const supabase = createClient()
  const payload: DbRegionUpdate = {}
  if (formData.name    !== undefined) payload.name    = formData.name.trim()
  if (formData.country !== undefined) payload.country = formData.country.trim() || null
  const { data, error } = await supabase
    .from('regions')
    .update(payload)
    .eq('id', id)
    .select('id, name, country, created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteRegion(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('regions').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Categories ───────────────────────────────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon, created_at')
    .order('name')
  if (error) throw new Error(error.message)
  return data
}

export async function createCategory(formData: CategoryFormData): Promise<Category> {
  const supabase = createClient()
  const payload: DbCategoryInsert = {
    name: formData.name.trim(),
    icon: formData.icon.trim() || null,
  }
  const { data, error } = await supabase
    .from('categories')
    .insert(payload)
    .select('id, name, icon, created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateCategory(id: string, formData: Partial<CategoryFormData>): Promise<Category> {
  const supabase = createClient()
  const payload: DbCategoryUpdate = {}
  if (formData.name !== undefined) payload.name = formData.name.trim()
  if (formData.icon !== undefined) payload.icon = formData.icon.trim() || null
  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select('id, name, icon, created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
