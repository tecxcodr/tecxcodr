import { MonoLabel } from '@/components/ui/mono-label'
import { cn } from '@/lib/utils/cn'

/**
 * Shared hero for every non-home marketing page. Keeps page-level rhythm and
 * the `[index]` machine-layer treatment consistent without each page
 * re-deciding its own spacing.
 */
export function PageHero({
  index,
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  index?: string
  eyebrow: string
  title: string
  lede?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('border-border relative overflow-hidden border-b', className)}>
      <div
        aria-hidden
        className="grid-overlay mask-fade-edges pointer-events-none absolute inset-0"
      />
      <div className="container-page relative py-16 md:py-20 lg:py-24">
        <div className="flex items-center gap-3">
          {index && <MonoLabel tone="subtle">[{index}]</MonoLabel>}
          <MonoLabel>{eyebrow}</MonoLabel>
        </div>
        <h1 className="text-display-2 mt-6 max-w-4xl">{title}</h1>
        {lede && <p className="text-body-lg text-fg-muted mt-6 max-w-2xl">{lede}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
