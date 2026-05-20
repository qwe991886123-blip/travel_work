import { createClient } from '@/lib/supabase/client'
import type { Region, RegionFormData } from '@/types'
import type { DbRegionInsert, DbRegionUpdate } from '@/types/database.types'

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

export async function updateRegion(
  id: string,
  formData: Partial<RegionFormData>,
): Promise<Region> {
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
