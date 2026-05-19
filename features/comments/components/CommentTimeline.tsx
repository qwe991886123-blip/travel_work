'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useData'
import { formatDate } from '@/utils'

interface CommentTimelineProps {
  spotId: string
}

export default function CommentTimeline({ spotId }: CommentTimelineProps) {
  const [content, setContent] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const { data: comments, isLoading } = useComments(spotId)
  const createComment = useCreateComment()
  const deleteComment = useDeleteComment()

  const handleSubmit = async () => {
    const trimmed = content.trim()
    if (!trimmed) return
    await createComment.mutateAsync({ spotId, content: trimmed })
    setContent('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.metaKey) handleSubmit()
    if (e.key === 'Escape') setIsAdding(false)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-stone-900">Comments</h3>
        <button
          onClick={() => setIsAdding(v => !v)}
          className="flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-50 hover:text-stone-900"
          aria-expanded={isAdding}
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mb-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="記錄你的想法... (⌘+Enter 送出)"
            rows={3}
            autoFocus
            className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-400/10"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => { setIsAdding(false); setContent('') }}
              className="rounded-xl border border-stone-200 px-3 py-1.5 text-xs text-stone-500 transition hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || createComment.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {createComment.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border border-stone-100 p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-stone-100" />
              <div className="mt-2 h-10 w-full animate-pulse rounded bg-stone-100" />
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="group rounded-2xl border border-stone-100 p-4 transition hover:border-stone-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">{formatDate(comment.created_at)}</span>
                <button
                  onClick={() => deleteComment.mutate({ id: comment.id, spotId })}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-3.5 w-3.5 text-stone-400 hover:text-rose-500" />
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-700">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <p className="rounded-2xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-400">
            尚無記錄。點擊 Add 新增你的第一條筆記。
          </p>
        )
      )}
    </div>
  )
}
