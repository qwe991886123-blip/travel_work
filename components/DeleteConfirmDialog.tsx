'use client'

import { Trash2 } from 'lucide-react'
import ConfirmDialog from './ui/confirm-dialog'

interface DeleteConfirmDialogProps {
  title: string
  description?: string
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({
  title,
  description = 'This action cannot be undone.',
  isPending = false,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      title={title}
      description={description}
      confirmLabel="Delete"
      confirmClassName="bg-rose-500 text-white hover:bg-rose-600"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
      icon={<Trash2 className="h-5 w-5 text-rose-500" />}
    />
  )
}
