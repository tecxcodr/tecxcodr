'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * 18px visual box inside a 44px hit area supplied by the surrounding label
 * padding — docs/03-DESIGN-SYSTEM.md §5.3. The box is never enlarged to reach
 * the touch target; the label is.
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
      <CheckboxPrimitive.Root
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange?.(v === true)}
        {...aria}
        className={cn(
          'border-border-strong bg-surface mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-sm border',
          'transition-colors duration-[--duration-instant]',
          'hover:border-fg-subtle',
          'data-[state=checked]:bg-accent data-[state=checked]:border-accent',
          'aria-[invalid=true]:border-destructive',
        )}
      >
        <CheckboxPrimitive.Indicator className="text-accent-fg">
          <Check aria-hidden className="size-3" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      <label htmlFor={id} className="text-body-sm text-fg-muted -my-1.5 cursor-pointer py-1.5">
        {label}
        {description && <span className="text-caption text-fg-subtle mt-1 block">{description}</span>}
      </label>
    </div>
  )
}
