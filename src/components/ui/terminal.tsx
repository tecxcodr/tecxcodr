import { cn } from '@/lib/utils/cn'

/**
 * Terminal window chrome — docs/03-DESIGN-SYSTEM.md §5.12.
 *
 * A server component: the chrome is static markup. Any typing animation is a
 * separate client island passed in as children, so the terminal itself costs
 * zero JS.
 */
export function TerminalWindow({
  path = '~/tecxcodr',
  children,
  className,
}: {
  path?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border bg-surface-code overflow-hidden rounded-md border',
        className,
      )}
    >
      <div className="border-border bg-bg-subtle flex h-8 items-center gap-2 border-b px-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="border-fg-subtle/60 size-2.5 rounded-full border" />
          <span className="border-fg-subtle/60 size-2.5 rounded-full border" />
          <span className="border-fg-subtle/60 size-2.5 rounded-full border" />
        </div>
        <span className="text-fg-subtle font-mono text-mono-label ml-2 truncate">{path}</span>
      </div>
      <div className="text-mono-code p-4 font-mono md:p-5">{children}</div>
    </div>
  )
}

/** A static (non-animated) prompt line. */
export function PromptLine({
  children,
  comment = false,
}: {
  children: React.ReactNode
  comment?: boolean
}) {
  if (comment) {
    return <div className="text-fg-subtle"># {children}</div>
  }
  return (
    <div className="flex gap-2">
      <span aria-hidden className="text-fg-subtle shrink-0 select-none">
        $
      </span>
      <span className="text-fg">{children}</span>
    </div>
  )
}

/** Command output — dimmer than the command that produced it. */
export function OutputLine({
  children,
  tone = 'muted',
}: {
  children: React.ReactNode
  tone?: 'muted' | 'success'
}) {
  return (
    <div className={tone === 'success' ? 'text-success' : 'text-fg-muted'}>{children}</div>
  )
}
