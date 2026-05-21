export default function DetailPanelSkeleton() {
  return (
    <div className="flex h-full flex-col" aria-hidden>
      {/* Hero image */}
      <div className="aspect-[16/10] flex-shrink-0 animate-pulse bg-stone-100" />

      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-7 w-2/3 animate-pulse rounded-xl bg-stone-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-stone-100" />
        </div>
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-stone-100" />
        </div>
        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-stone-100" />
        </div>
        {/* Map box */}
        <div className="h-16 animate-pulse rounded-2xl bg-stone-100" />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-stone-100 p-5">
        <div className="h-11 animate-pulse rounded-2xl bg-stone-100" />
      </div>
    </div>
  )
}
