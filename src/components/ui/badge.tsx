import { cn } from '@/lib/utils/cn'

type Tone = 'neutral' | 'success' | 'warning' | 'destructive' | 'info'

const TONE: Record<Tone, string> = {
  neutral: 'bg-bg-subtle text-fg-muted border-border',
  success: 'bg-success-subtle text-success border-success/30',
  warning: 'bg-warning-subtle text-warning border-warning/30',
  destructive: 'bg-destructive-subtle text-destructive border-destructive/30',
  info: 'bg-info-subtle text-info border-info/30',
}

/**
 * Status badge. docs/03-DESIGN-SYSTEM.md §5.5.
 *
 * Colour is never the only signal — the label text always carries the meaning,
 * so the component has no icon-only mode by design (WCAG 1.4.1).
 */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center rounded-sm border px-2',
        'font-mono text-mono-label uppercase',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
