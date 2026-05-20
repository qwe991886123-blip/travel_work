'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRegions, createRegion, updateRegion, deleteRegion } from '@/services/region.service'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/category.service'
import { fetchSavedViews, createSavedView, updateSavedView, deleteSavedView } from '@/services/savedView.service'
import { fetchComments, createComment, deleteComment } from '@/services/comment.service'
import type { SavedViewFilters, RegionFormData, CategoryFormData } from '@/types'

// ─── Regions ──────────────────────────────────────────────────────────────────
export function useRegions() {
  return useQuery({ queryKey: ['regions'], queryFn: fetchRegions })
}

export function useCreateRegion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: RegionFormData) => createRegion(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regions'] }),
  })
}

export function useUpdateRegion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RegionFormData> }) =>
      updateRegion(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regions'] }),
  })
}

export function useDeleteRegion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRegion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regions'] }),
  })
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CategoryFormData) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
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
