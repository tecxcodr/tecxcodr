import { MonoLabel } from '@/components/ui/mono-label'
import { pad2 } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

/**
 * docs/03-DESIGN-SYSTEM.md §5.11.
 *
 * Always paired with a count — a bar alone tells a student "some progress"
 * when what they need is "one more task". The bar is decorative; the label
 * carries the information, which is also why the bar is aria-hidden and the
 * accessible value lives on the wrapper.
 */
export function Progress({
  value,
  max,
  label = 'tasks approved',
  className,
}: {
  value: number
  max: number
  label?: string
  className?: string
}) {
  const safeMax = Math.max(1, max)
  const pct = Math.min(100, Math.round((value / safeMax) * 100))

  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${value} of ${max} ${label}`}
    >
      <div className="flex items-center justify-between gap-4">
        <MonoLabel tone="subtle">{label}</MonoLabel>
        <MonoLabel tone="default">
          <span data-numeric>
            {pad2(value)} / {pad2(max)}
          </span>
        </MonoLabel>
      </div>
      <div aria-hidden className="bg-bg-subtle h-1.5 w-full overflow-hidden rounded-sm">
        <div
          className="bg-fg h-full transition-[width] duration-[--duration-slow] ease-[--ease-out-expo]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
