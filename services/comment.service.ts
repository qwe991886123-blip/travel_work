import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/types'
import type { DbCommentInsert } from '@/types/database.types'

export async function fetchComments(spotId: string): Promise<Comment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('id, spot_id, content, created_at')
    .eq('spot_id', spotId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createComment(spotId: string, content: string): Promise<Comment> {
  const supabase = createClient()
  const payload: DbCommentInsert = { spot_id: spotId, content }
  const { data, error } = await supabase
    .from('comments')
    .insert(payload)
    .select('id, spot_id, content, created_at')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteComment(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
