import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Styled native checkbox.
 *
 * Same call as the Select swap (docs/03 §5.3): a checkbox needs no popup, no
 * portal and no focus management, so Radix bought nothing here while costing
 * bundle on /sign-up and /apply/[slug]. A native input brings the label
 * association, keyboard behaviour, form participation and screen-reader
 * semantics for free.
 *
 * 18px visual box inside a 44px hit area supplied by the label padding —
 * docs/03 §5.3. The box is never enlarged to reach the touch target.
 */
export function Checkbox({
  id,
  name,
  checked,
  onCheckedChange,
  label,
  description,
  className,
  ...aria
}: {
  id: string
  name?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: React.ReactNode
  description?: string
  className?: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}) {
  return (
    <div className={cn('flex gap-3 py-1.5', className)}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...aria}
          className={cn(
            'peer border-border-strong bg-surface size-[18px] appearance-none rounded-sm border',
            'transition-colors duration-[--duration-instant]',
            'hover:border-fg-subtle',
            'checked:bg-accent checked:border-accent',
            'aria-[invalid=true]:border-destructive',
          )}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="text-accent-fg pointer-events-none absolute inset-0 m-auto size-3 opacity-0 peer-checked:opacity-100"
        />
      </span>

      <label htmlFor={id} className="text-body-sm text-fg-muted -my-1.5 cursor-pointer py-1.5">
        {label}
        {description && (
          <span className="text-caption text-fg-subtle mt-1 block">{description}</span>
        )}
      </label>
    </div>
  )
}
