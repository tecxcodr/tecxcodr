'use client'

import { useState } from 'react'
import { ProgramCard } from '@/components/marketing/program-card'
import { MonoLabel } from '@/components/ui/mono-label'
import { DOMAIN_LABEL, type Program, type ProgramDomain } from '@/types/program'
import { pad2 } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

type Filter = ProgramDomain | 'ALL'

/**
 * Filtering happens client-side over the full catalogue.
 *
 * docs/04 Q1: the published set is ~10 rows. A server round-trip per filter
 * click would be strictly slower and would add an endpoint with no other
 * consumer. Revisit if the catalogue ever outgrows a single page.
 */
export function ProgramGrid({ programs }: { programs: Program[] }) {
  const [filter, setFilter] = useState<Filter>('ALL')

  const domains = Array.from(new Set(programs.map((p) => p.domain)))
  const visible = filter === 'ALL' ? programs : programs.filter((p) => p.domain === filter)

  return (
    <div>
      <div
        role="group"
        aria-label="Filter programs by domain"
        className="flex flex-wrap items-center gap-2"
      >
        <FilterChip active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
          All ({pad2(programs.length)})
        </FilterChip>
        {domains.map((domain) => (
          <FilterChip
            key={domain}
            active={filter === domain}
            onClick={() => setFilter(domain)}
          >
            {DOMAIN_LABEL[domain]}
          </FilterChip>
        ))}
      </div>

      {/* aria-live so filtering announces its result to screen readers rather
          than silently swapping the grid. */}
      <MonoLabel as="p" tone="subtle" aria-live="polite" className="mt-6 block">
        showing {pad2(visible.length)} of {pad2(programs.length)} programs
      </MonoLabel>

      {visible.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <div className="border-border mt-4 rounded-md border border-dashed p-12 text-center">
          <p className="text-fg-subtle font-mono text-mono-label">[ ]</p>
          <p className="text-h4 mt-4">No programs in this domain yet</p>
          <p className="text-body-sm text-fg-muted mt-2">
            Try another domain, or view all programs.
          </p>
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 items-center rounded-md border px-3',
        'font-mono text-mono-label uppercase',
        'transition-colors duration-[--duration-instant]',
        active
          ? 'bg-accent text-accent-fg border-transparent'
          : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
