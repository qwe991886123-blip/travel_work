interface SectionHeaderProps {
  icon: React.ReactNode
  title: string
  count?: number
  countLabel?: string
}

export default function SectionHeader({
  icon,
  title,
  count,
  countLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-stone-900">{title}</h2>
        {count !== undefined && countLabel && (
          <p className="text-xs text-stone-400">
            {count} {countLabel}
          </p>
        )}
      </div>
    </div>
  )
}
