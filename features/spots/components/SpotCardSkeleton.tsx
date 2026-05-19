export default function SpotCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-stone-100" />
      <div className="space-y-3 p-5">
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-stone-100" />
          <div className="h-4 w-1/3 animate-pulse rounded-lg bg-stone-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-stone-100" />
          <div className="h-6 w-12 animate-pulse rounded-full bg-stone-100" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-stone-100" />
        </div>
        <div className="flex justify-between border-t border-stone-100 pt-3">
          <div className="h-5 w-24 animate-pulse rounded bg-stone-100" />
          <div className="h-7 w-20 animate-pulse rounded-xl bg-stone-100" />
        </div>
      </div>
    </div>
  )
}
