import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="border-border mb-8 border-b pb-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-full max-w-md" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}
