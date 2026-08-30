import { MonoLabel } from '@/components/ui/mono-label'

export function DashboardPageHeader({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: string
  title: string
  lede?: string
  action?: React.ReactNode
}) {
  return (
    <div className="border-border mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
      <div>
        {eyebrow && (
          <MonoLabel as="p" tone="subtle" className="mb-2">
            {eyebrow}
          </MonoLabel>
        )}
        <h1 className="text-h1">{title}</h1>
        {lede && <p className="text-body text-fg-muted mt-2 max-w-prose">{lede}</p>}
      </div>
      {action}
    </div>
  )
}
