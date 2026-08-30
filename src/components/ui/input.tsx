import { cn } from '@/lib/utils/cn'

/**
 * docs/03-DESIGN-SYSTEM.md §5.3.
 *
 * `border-strong` rather than `border` so the control boundary clears the 3:1
 * non-text contrast requirement — decorative dividers may be lighter, an input
 * edge may not.
 *
 * Font size stays 16px on mobile (set globally in globals.css) because iOS
 * zooms anything smaller.
 */
const base = cn(
  'w-full rounded-md border border-border-strong bg-surface px-3',
  'text-body text-fg placeholder:text-fg-subtle',
  'transition-colors duration-[--duration-instant]',
  'hover:border-fg-subtle',
  'focus:border-fg focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-fg-subtle',
  'aria-[invalid=true]:border-destructive',
)

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, 'h-11 md:h-11', className)} {...props} />
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'min-h-30 resize-y py-3', className)} {...props} />
}
