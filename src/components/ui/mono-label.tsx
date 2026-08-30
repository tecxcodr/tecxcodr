import { cn } from '@/lib/utils/cn'

/**
 * The "machine layer" — docs/03-DESIGN-SYSTEM.md §3.2.
 *
 * Mono, uppercase, tracked out, muted. Used for section indices, eyebrows,
 * metadata, counts, table headers and IDs. Never for sentences.
 */
export function MonoLabel({
  children,
  className,
  as: Tag = 'span',
  tone = 'muted',
}: {
  children: React.ReactNode
  className?: string
  as?: 'span' | 'div' | 'p' | 'dt' | 'dd' | 'li'
  tone?: 'muted' | 'subtle' | 'default'
}) {
  const Comp = Tag as React.ElementType
  return (
    <Comp
      className={cn(
        'font-mono text-mono-label uppercase',
        tone === 'muted' && 'text-fg-muted',
        tone === 'subtle' && 'text-fg-subtle',
        tone === 'default' && 'text-fg',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
