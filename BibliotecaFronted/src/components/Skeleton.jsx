function SkeletonLine({ className = "" }) {
  return <div className={`bg-madera-200 rounded animate-pulse ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-pergamino-50 rounded-xl border-2 border-madera-200 p-5 space-y-4">
      <SkeletonLine className="h-5 w-1/3" />
      <SkeletonLine className="h-8 w-1/2" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonLine key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonBarChart({ bars = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-4 w-8" />
          </div>
          <SkeletonLine className="h-3 w-full" />
        </div>
      ))}
    </div>
  )
}
