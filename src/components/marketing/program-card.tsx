import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MonoLabel } from '@/components/ui/mono-label'
import { DOMAIN_LABEL, type Program } from '@/types/program'
import { formatPrice, pad2 } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

/**
 * docs/03-DESIGN-SYSTEM.md §5.4.
 *
 * The whole card is the hit area via a stretched pseudo-element on the title
 * link, so the accessible name still comes from the heading — not from a
 * wrapper <a> swallowing the entire card's text content.
 *
 * Hover is CSS only. A grid of these must not run a GSAP instance per card.
 */
export function ProgramCard({ program, className }: { program: Program; className?: string }) {
  const hours = program.tasks.reduce((sum, t) => sum + t.estimatedHours, 0)

  return (
    <article
      className={cn(
        'group border-border bg-surface relative flex flex-col rounded-md border p-5 md:p-6',
        'transition-[border-color,transform] duration-[--duration-base] ease-[--ease-out-expo]',
        'hover:border-border-strong hover:-translate-y-0.5',
        'focus-within:border-border-strong',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <MonoLabel>{DOMAIN_LABEL[program.domain]}</MonoLabel>
        <ArrowUpRight
          aria-hidden
          className={cn(
            'text-fg-subtle size-4 shrink-0',
            'transition-transform duration-[--duration-base] ease-[--ease-out-expo]',
            'group-hover:translate-x-1 group-hover:-translate-y-1',
          )}
        />
      </div>

      <h3 className="text-h3 mt-4">
        <Link
          href={`/programs/${program.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {program.title}
        </Link>
      </h3>

      <p className="text-body-sm text-fg-muted mt-2 line-clamp-2">{program.tagline}</p>

      <div className="border-border mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-4">
        <MonoLabel tone="subtle">{pad2(program.durationWeeks)} weeks</MonoLabel>
        <span aria-hidden className="text-fg-subtle">
          ·
        </span>
        <MonoLabel tone="subtle">{pad2(program.totalTaskCount)} tasks</MonoLabel>
        <span aria-hidden className="text-fg-subtle">
          ·
        </span>
        <MonoLabel tone="subtle">~{hours}h</MonoLabel>
        <MonoLabel tone="default" className="ml-auto">
          {formatPrice(program.priceAmountMinor, program.currency)}
        </MonoLabel>
      </div>
    </article>
  )
}
