import { createClient } from '@/lib/supabase/client'
import type { Region, Category } from '@/types'

export async function fetchRegions(): Promise<Region[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('regions')
    .select('id, country, region, created_at')
    .order('region')
  if (error) throw new Error(error.message)
  return data
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon, created_at')
    .order('name')
  if (error) throw new Error(error.message)
  return data
}
