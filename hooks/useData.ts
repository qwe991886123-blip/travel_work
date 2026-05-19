'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRegions, fetchCategories } from '@/services/regions'
import {
  fetchSavedViews,
  createSavedView,
  deleteSavedView,
  updateSavedView,
} from '@/services/savedViews'
import { fetchComments, createComment, deleteComment } from '@/services/comments'
import type { SavedViewFilters } from '@/types'

// ─── Regions & Categories ─────────────────────────────────────────────────────
export function useRegions() {
  return useQuery({ queryKey: ['regions'], queryFn: fetchRegions, staleTime: Infinity })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: Infinity })
}

// ─── Saved Views ──────────────────────────────────────────────────────────────
export function useSavedViews() {
  return useQuery({ queryKey: ['saved-views'], queryFn: fetchSavedViews })
}

export function useCreateSavedView() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ name, filters }: { name: string; filters: SavedViewFilters }) =>
      createSavedView(name, filters),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-views'] }),
  })
}

export function useUpdateSavedView() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: { name?: string; filters?: SavedViewFilters }
    }) => updateSavedView(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-views'] }),
  })
}

export function useDeleteSavedView() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSavedView(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-views'] }),
  })
}

// ─── Comments ─────────────────────────────────────────────────────────────────
export function useComments(spotId: string) {
  return useQuery({
    queryKey: ['comments', spotId],
    queryFn: () => fetchComments(spotId),
    enabled: !!spotId,
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ spotId, content }: { spotId: string; content: string }) =>
      createComment(spotId, content),
    onSuccess: (_data, { spotId }) =>
      qc.invalidateQueries({ queryKey: ['comments', spotId] }),
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, spotId }: { id: string; spotId: string }) =>
      deleteComment(id).then(() => spotId),
    onSuccess: (spotId) => qc.invalidateQueries({ queryKey: ['comments', spotId] }),
  })
}
