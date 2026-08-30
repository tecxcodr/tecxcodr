import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

/**
 * Native <select>, styled.
 *
 * This revises docs/03-DESIGN-SYSTEM.md §5.3, which said "never a native
 * select" because the OS-drawn popup ignores our token layer. Two things
 * changed that call:
 *
 *  1. styles/tokens.css sets `color-scheme: dark|light` per theme, so modern
 *     browsers already render the native popup in the matching scheme. The
 *     original objection — a white system dropdown on a near-black page — does
 *     not actually occur.
 *  2. Radix Select cost ~60 kB on /apply/[slug] and /dashboard/profile, pushing
 *     both past their budgets in docs/02-TRD §10.1. That is a real cost on the
 *     two most intent-heavy authenticated pages.
 *
 * Native also wins on mobile, where the OS wheel picker beats a custom
 * listbox, and it brings keyboard, type-ahead and screen-reader support for
 * free. Reach for Radix again only if a control needs search, multi-select or
 * rich option content — none of ours do.
 */
export function Select({
  options,
  placeholder,
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: {
  options: readonly SelectOption[]
  placeholder?: string
  className?: string
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}) {
  return (
    <div className="relative">
      <select
        {...props}
        // Controlled only when a value is supplied; otherwise uncontrolled,
        // so the placeholder option stays selectable.
        value={value ?? (defaultValue === undefined ? '' : undefined)}
        defaultValue={defaultValue}
        onChange={(e) => onValueChange?.(e.target.value)}
        className={cn(
          'border-border-strong bg-surface h-11 w-full appearance-none rounded-md border pr-10 pl-3',
          'text-body text-fg',
          'transition-colors duration-[--duration-instant]',
          'hover:border-fg-subtle focus:border-fg focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-[invalid=true]:border-destructive',
          // Placeholder styling: the empty option is the only one with value=""
          !value && 'text-fg-subtle',
          className,
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-fg bg-surface">
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        aria-hidden
        className="text-fg-subtle pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
      />
    </div>
  )
}
