import { MonoLabel } from '@/components/ui/mono-label'

/** Shared heading block so every auth screen keeps the same rhythm. */
export function AuthShell({
  eyebrow,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  lede?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div>
      <MonoLabel tone="subtle">[ {eyebrow} ]</MonoLabel>
      <h1 className="text-h1 mt-3">{title}</h1>
      {lede && <p className="text-body text-fg-muted mt-3">{lede}</p>}

      <div className="mt-8">{children}</div>

      {footer && (
        <div className="border-border mt-8 border-t pt-6 text-center">{footer}</div>
      )}
    </div>
  )
}

/** "or" rule between OAuth and the email form. */
export function AuthDivider({ label = 'or' }: { label?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden className="bg-border h-px flex-1" />
      <MonoLabel tone="subtle">{label}</MonoLabel>
      <span aria-hidden className="bg-border h-px flex-1" />
    </div>
  )
}
