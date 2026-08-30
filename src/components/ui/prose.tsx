import { cn } from '@/lib/utils/cn'

/**
 * Long-form copy container. Measure capped at 68ch (docs/03 §3.4) and heading
 * rhythm handled here so legal and policy pages do not each invent their own.
 */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'max-w-[var(--container-prose)]',
        '[&_h2]:text-h3 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:first:mt-0',
        '[&_h3]:text-h4 [&_h3]:mt-8 [&_h3]:mb-2',
        '[&_p]:text-body [&_p]:text-fg-muted [&_p]:mb-4',
        '[&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2',
        '[&_li]:text-body [&_li]:text-fg-muted [&_li]:flex [&_li]:gap-3',
        "[&_li]:before:text-fg-subtle [&_li]:before:content-['—'] [&_li]:before:font-mono",
        '[&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4',
        '[&_strong]:text-fg [&_strong]:font-medium',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Shown at the top of every legal page.
 *
 * These documents are drafted to be accurate to how the product actually
 * works, but they have not been reviewed by a lawyer. Publishing them without
 * that review — particularly the paid-training framing — is a real risk
 * (docs/01 §13, docs/00 Pay1/Pay5).
 */
export function DraftNotice() {
  return (
    <div className="border-warning/30 bg-warning-subtle mb-10 rounded-md border p-4">
      <p className="text-body-sm text-warning">
        <strong className="font-medium">Draft — pending legal review.</strong> This document
        describes how Tecxcodr actually operates, but it has not yet been reviewed by a qualified
        professional and must not be treated as final before launch.
      </p>
    </div>
  )
}
