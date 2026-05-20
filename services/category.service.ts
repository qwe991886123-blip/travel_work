import { createClient } from '@/lib/supabase/client'
import type { Category, CategoryFormData } from '@/types'
import type { DbCategoryInsert, DbCategoryUpdate } from '@/types/database.types'

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

export async function updateCategory(
  id: string,
  formData: Partial<CategoryFormData>,
): Promise<Category> {
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
