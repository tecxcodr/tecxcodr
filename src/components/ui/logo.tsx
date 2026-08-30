import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { SITE } from '@/lib/constants/site'

/**
 * Wordmark. Display face for the name, mono caret for the technical layer —
 * the same two-layer idea the whole type system is built on (docs/03 §3.2).
 *
 * Deliberately not an SVG mark: at this stage a typographic wordmark is
 * stronger, scales perfectly, costs nothing, and cannot look like a stock icon.
 */
export function Logo({ className, showCaret = true }: { className?: string; showCaret?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        'group text-fg inline-flex items-baseline gap-0.5 tracking-tight',
        'font-display text-[1.0625rem] font-bold',
        className,
      )}
      aria-label={`${SITE.name} home`}
    >
      <span>{SITE.wordmark}</span>
      {showCaret && (
        <span
          aria-hidden
          className={cn(
            'text-fg-subtle font-mono text-[0.9em]',
            'transition-colors duration-[--duration-instant] group-hover:text-fg',
          )}
        >
          _
        </span>
      )}
    </Link>
  )
}
