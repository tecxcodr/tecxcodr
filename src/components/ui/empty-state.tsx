import { cn } from '@/lib/utils/cn'

/**
 * docs/03-DESIGN-SYSTEM.md §5.14. Every data surface ships one of these — an
 * empty list must explain itself and offer the next action, not just be blank.
 *
 * The glyph is a monospace bracket rather than an illustration: on brand, zero
 * bytes, and it never looks like a stock icon.
 */
export function EmptyState({
  glyph = '[ ]',
  title,
  body,
  action,
  className,
}: {
  glyph?: string
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border flex flex-col items-center rounded-md border border-dashed px-6 py-14 text-center',
        className,
      )}
    >
      <p aria-hidden className="text-fg-subtle font-mono text-h3">
        {glyph}
      </p>
      <h3 className="text-h4 mt-4">{title}</h3>
      {body && <p className="text-body-sm text-fg-muted mt-2 max-w-sm">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
