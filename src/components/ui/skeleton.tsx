import { cn } from '@/lib/utils/cn'

/**
 * Skeletons must match the resolved layout's dimensions so nothing shifts when
 * data arrives — docs/03-DESIGN-SYSTEM.md §5.14.
 *
 * The shimmer is a CSS animation, so the global reduced-motion rule in
 * globals.css turns it into a static block automatically.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('bg-bg-subtle animate-pulse rounded-md', className)}
    />
  )
}
