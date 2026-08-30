import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * Label + control + help + error, wired together with the right ARIA.
 *
 * docs/03-DESIGN-SYSTEM.md §5.3 and docs/01 FR-7.5: errors live inline next to
 * the field, never in a toast, and are announced rather than only coloured.
 *
 * The render-prop hands back the ids the control must adopt, so a field can
 * never ship with a dangling `aria-describedby`.
 */
export function Field({
  id,
  label,
  help,
  error,
  required,
  className,
  children,
}: {
  id: string
  label: string
  help?: string
  error?: string
  required?: boolean
  className?: string
  children: (props: {
    id: string
    'aria-describedby': string | undefined
    'aria-invalid': true | undefined
    'aria-required': true | undefined
  }) => React.ReactNode
}) {
  const helpId = help ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-body-sm text-fg font-medium">
        {label}
        {required && (
          <span className="text-fg-subtle ml-1" aria-hidden>
            *
          </span>
        )}
      </label>

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}

      {help && !error && (
        <p id={helpId} className="text-caption text-fg-muted">
          {help}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-caption text-destructive flex items-start gap-1.5">
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
