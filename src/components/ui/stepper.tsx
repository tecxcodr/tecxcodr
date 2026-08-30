import { Check } from 'lucide-react'
import { MonoLabel } from '@/components/ui/mono-label'
import { Progress } from '@/components/ui/progress'
import { pad2 } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

/**
 * docs/03-DESIGN-SYSTEM.md §5.11.
 *
 * Desktop shows the full node/connector track. Below `md` it collapses to
 * "STEP 02 / 03" plus a bar — three labelled nodes on a 360px screen either
 * truncate to uselessness or force a horizontal scroll.
 */
export function Stepper({
  steps,
  current,
  className,
}: {
  steps: readonly string[]
  /** 1-based. */
  current: number
  className?: string
}) {
  return (
    <div className={className}>
      {/* Mobile */}
      <div className="md:hidden">
        <Progress
          value={current}
          max={steps.length}
          label={`step ${pad2(current)} · ${steps[current - 1] ?? ''}`}
        />
      </div>

      {/* Desktop */}
      <ol className="hidden items-center md:flex">
        {steps.map((step, i) => {
          const index = i + 1
          const done = index < current
          const active = index === current

          return (
            <li key={step} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-mono-label',
                    done && 'bg-accent text-accent-fg border-transparent',
                    active && 'border-fg text-fg ring-border ring-2 ring-offset-0',
                    !done && !active && 'border-border text-fg-subtle',
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} /> : pad2(index)}
                </span>
                <MonoLabel tone={active ? 'default' : done ? 'muted' : 'subtle'}>
                  {step}
                </MonoLabel>
              </div>

              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn('mx-4 h-px flex-1', done ? 'bg-fg-muted' : 'bg-border')}
                />
              )}
            </li>
          )
        })}
      </ol>

      <p className="sr-only" aria-live="polite">
        Step {current} of {steps.length}: {steps[current - 1]}
      </p>
    </div>
  )
}
