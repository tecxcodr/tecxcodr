import { MonoLabel } from '@/components/ui/mono-label'
import { APPLICATION_STATUS_LABEL, type StatusEvent } from '@/types/application'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

const ACTOR_COPY: Record<StatusEvent['actorKind'], string> = {
  USER: 'you',
  ADMIN: 'tecxcodr',
  SYSTEM: 'system',
}

/**
 * Rendered straight from `application_status_history` (docs/04 §5.7).
 *
 * That table exists as a product feature, not just an audit trail: a student
 * who can see every transition and its date does not need to email and ask
 * where their application is (docs/01 US-3).
 */
export function StatusTimeline({ events }: { events: StatusEvent[] }) {
  const ordered = [...events].reverse()

  return (
    <ol className="flex flex-col">
      {ordered.map((event, i) => {
        const isLatest = i === 0
        return (
          <li key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
            {i < ordered.length - 1 && (
              <span aria-hidden className="bg-border absolute top-3 bottom-0 left-[3.5px] w-px" />
            )}

            <span
              aria-hidden
              className={cn(
                'relative z-10 mt-1.5 size-2 shrink-0 rounded-full',
                isLatest ? 'bg-fg' : 'bg-border-strong',
              )}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span
                  className={cn('text-body-sm', isLatest ? 'text-fg font-medium' : 'text-fg-muted')}
                >
                  {APPLICATION_STATUS_LABEL[event.toStatus]}
                </span>
                <MonoLabel tone="subtle">
                  {formatDate(event.createdAt)} · {ACTOR_COPY[event.actorKind]}
                </MonoLabel>
              </div>
              {event.note && <p className="text-caption text-fg-muted mt-1">{event.note}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
