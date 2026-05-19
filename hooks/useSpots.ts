'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSpots,
  fetchSpotById,
  createSpot,
  updateSpot,
  deleteSpot,
  toggleFavorite,
} from '@/services/spots'
import type { SavedViewFilters, SpotFormData } from '@/types'

export const SPOTS_KEY = 'spots'

export function useSpots(filters?: SavedViewFilters) {
  return useQuery({
    queryKey: [SPOTS_KEY, filters],
    queryFn: () => fetchSpots(filters),
  })
}

export function useSpot(id: string) {
  return useQuery({
    queryKey: [SPOTS_KEY, id],
    queryFn: () => fetchSpotById(id),
    enabled: !!id,
  })
}

export function useCreateSpot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SpotFormData) => createSpot(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SPOTS_KEY] }),
  })
}

export function useUpdateSpot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpotFormData> }) =>
      updateSpot(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SPOTS_KEY] }),
  })
}

export function useDeleteSpot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSpot(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SPOTS_KEY] }),
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      toggleFavorite(id, isFavorite),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SPOTS_KEY] }),
  })
}
