'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Loader2, ExternalLink } from 'lucide-react'
import { useRegions, useCategories } from '@/hooks/useData'
import { useCreateSpot, useUpdateSpot } from '@/hooks/useSpots'
import { uploadCoverImage } from '@/services/spot.service'
import { cn } from '@/utils'
import type { Spot } from '@/types'

const schema = z.object({
  title:        z.string().min(1, 'Name is required'),
  region_id:    z.string(),
  category_ids: z.array(z.string()),
  map_url:      z.string().refine(v => !v || v.startsWith('http'), { message: 'Must be a valid URL' }),
  address:      z.string(),
  description:  z.string(),
  notes:        z.string(),
})

type FormValues = z.infer<typeof schema>

interface SpotFormModalProps {
  /** When provided, we're editing an existing spot */
  spot?: Spot
  onClose: () => void
}

export default function SpotFormModal({ spot, onClose }: SpotFormModalProps) {
  const isEditing = !!spot
  const { data: regions } = useRegions()
  const { data: categories } = useCategories()
  const createSpot = useCreateSpot()
  const updateSpot = useUpdateSpot()

  const [coverImage, setCoverImage] = useState(spot?.cover_image ?? '')
  const [uploading, setUploading]   = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const {
    register, handleSubmit, control, watch, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:        spot?.title        ?? '',
      region_id:    spot?.region_id    ?? '',
      category_ids: spot?.categories?.map(c => c.id) ?? [],
      map_url:      spot?.map_url      ?? '',
      address:      spot?.address      ?? '',
      description:  spot?.description  ?? '',
      notes:        spot?.notes        ?? '',
    },
  })

  // Re-populate if spot changes (e.g. re-opened for different spot)
  useEffect(() => {
    if (spot) {
      reset({
        title:        spot.title        ?? '',
        region_id:    spot.region_id    ?? '',
        category_ids: spot.categories?.map(c => c.id) ?? [],
        map_url:      spot.map_url      ?? '',
        address:      spot.address      ?? '',
        description:  spot.description  ?? '',
        notes:        spot.notes        ?? '',
      })
      setCoverImage(spot.cover_image ?? '')
    }
  }, [spot, reset])

  const mapUrl = watch('map_url')

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await uploadCoverImage(file)
      setCoverImage(url)
    } catch {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result
        if (typeof result === 'string') setCoverImage(result)
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  const onSubmit = async (values: FormValues) => {
    const payload = { ...values, cover_image: coverImage }
    if (isEditing && spot) {
      await updateSpot.mutateAsync({ id: spot.id, data: payload })
    } else {
      await createSpot.mutateAsync(payload)
    }
    onClose()
  }

  const isPending = isSubmitting || createSpot.isPending || updateSpot.isPending

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog" aria-modal="true"
      aria-labelledby="spot-modal-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-2xl sm:rounded-[32px]">

        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between gap-4 px-8 pb-4 pt-8">
          <div>
            <h2 id="spot-modal-title" className="text-2xl font-bold text-stone-900">
              {isEditing ? 'Edit Spot' : 'Add New Spot'}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {isEditing ? 'Update the details for this spot.' : 'Quickly save a place you want to visit.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">

              {/* Cover Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Cover Image</label>
                {coverImage ? (
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-stone-200">
                    <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setCoverImage('')}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition hover:bg-white"
                      aria-label="Remove image">
                      <X className="h-3.5 w-3.5 text-stone-700" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={cn(
                      'flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition',
                      isDragging ? 'border-stone-500 bg-stone-50' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    )}
                  >
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-stone-300" />
                        <p className="text-sm text-stone-400">Drag & drop or</p>
                        <label className="cursor-pointer rounded-xl border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-100">
                          Choose file
                          <input type="file" accept="image/*" className="sr-only"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="spot-title" className="mb-2 block text-sm font-medium text-stone-700">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input id="spot-title" {...register('title')} placeholder="例如：梵魚寺"
                  className={cn('w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-stone-400/10',
                    errors.title ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-stone-900')} />
                {errors.title && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.title.message}</p>}
              </div>

              {/* Region & Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="spot-region" className="mb-2 block text-sm font-medium text-stone-700">Region</label>
                  <select id="spot-region" {...register('region_id')}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900">
                    <option value="">Select Region</option>
                    {regions?.map(r => <option key={r.id} value={r.id}>{r.name}{r.country ? ` · ${r.country}` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-stone-700">Categories</p>
                  <Controller name="category_ids" control={control}
                    render={({ field }) => (
                      <div className="max-h-[116px] overflow-y-auto rounded-2xl border border-stone-200 p-2">
                        {categories?.map(cat => (
                          <label key={cat.id} className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-stone-50">
                            <input type="checkbox"
                              checked={field.value.includes(cat.id)}
                              onChange={e => field.onChange(
                                e.target.checked
                                  ? [...field.value, cat.id]
                                  : field.value.filter(id => id !== cat.id)
                              )}
                              className="rounded accent-stone-900" />
                            {cat.icon && <span>{cat.icon}</span>}
                            <span className="text-stone-700">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    )} />
                </div>
              </div>

              {/* Map URL */}
              <div>
                <label htmlFor="spot-map" className="mb-2 block text-sm font-medium text-stone-700">Google Map URL</label>
                <div className="flex gap-2">
                  <input id="spot-map" {...register('map_url')} placeholder="貼上 Google Maps 連結"
                    className={cn('flex-1 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-stone-400/10',
                      errors.map_url ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-stone-900')} />
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-2xl border border-stone-200 px-4 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                      <ExternalLink className="h-3.5 w-3.5" />Open
                    </a>
                  )}
                </div>
                {errors.map_url && <p className="mt-1 text-xs text-rose-500" role="alert">{errors.map_url.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="spot-address" className="mb-2 block text-sm font-medium text-stone-700">Address</label>
                <input id="spot-address" {...register('address')} placeholder="例如：부산 금정구 범어사로 250"
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-400/10" />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="spot-desc" className="mb-2 block text-sm font-medium text-stone-700">Description</label>
                <textarea id="spot-desc" {...register('description')} rows={3}
                  placeholder="簡短描述這個景點..."
                  className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-400/10" />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="spot-notes" className="mb-2 block text-sm font-medium text-stone-700">Notes</label>
                <textarea id="spot-notes" {...register('notes')} rows={5}
                  placeholder={'可以放：\n- 旅遊筆記\n- YouTube 連結\n- 圖片 URL\n- 交通資訊'}
                  className="w-full resize-none rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-400/10" />
                <p className="mt-2 rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-400">
                  支援貼上 YouTube URL、圖片網址、純文字內容，自動渲染預覽。
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose}
                className="rounded-2xl border border-stone-200 px-5 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                Cancel
              </button>
              <button type="submit" disabled={isPending}
                className="flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Save Spot'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
