import { cn } from '@/utils'

interface SkeletonProps {
  className?: string
}

// Single skeleton bar
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-stone-100', className)} />
  )
}

// Repeating list of skeleton rows — used in Settings managers
export function SkeletonList({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 rounded-2xl" />
      ))}
    </div>
  )
}

// Skeleton for a comment entry
export function CommentSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-100 p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-10 w-full" />
    </div>
  )
}
