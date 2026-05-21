interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <p className="text-sm font-medium text-stone-500">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-stone-400">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Compact inline variant — used inside cards/panels
export function InlineEmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-stone-200 p-6 text-center text-sm text-stone-400">
      {message}
    </p>
  )
}
