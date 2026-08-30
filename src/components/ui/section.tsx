import { MonoLabel } from '@/components/ui/mono-label'
import { cn } from '@/lib/utils/cn'

/**
 * Marketing section wrapper. Owns the vertical rhythm from docs/03 §4.1
 * (64 / 96 / 128 by breakpoint) so no page hardcodes section padding.
 */
export function Section({
  children,
  className,
  id,
  bleed = false,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  /** Skip the container so the section can go edge to edge. */
  bleed?: boolean
}) {
  return (
    <section id={id} className={cn('relative py-16 md:py-24 lg:py-32', className)}>
      {bleed ? children : <div className="container-page">{children}</div>}
    </section>
  )
}

/**
 * `[03]` index + heading + optional lede. The bracketed index is the strongest
 * single carrier of the developer-native identity — docs/03 §5.12.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
}: {
  index?: string
  eyebrow?: string
  title: React.ReactNode
  lede?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {(index ?? eyebrow) && (
        <div className="flex items-center gap-3">
          {index && <MonoLabel tone="subtle">[{index}]</MonoLabel>}
          {eyebrow && <MonoLabel>{eyebrow}</MonoLabel>}
        </div>
      )}
      <h2 className="text-h2 max-w-3xl">{title}</h2>
      {lede && (
        <p className={cn('text-body-lg text-fg-muted max-w-2xl', align === 'center' && 'mx-auto')}>
          {lede}
        </p>
      )}
    </div>
  )
}

/** Full-bleed hairline divider between marketing sections. */
export function Divider({ className }: { className?: string }) {
  return <div aria-hidden className={cn('bg-border h-px w-full', className)} />
}
