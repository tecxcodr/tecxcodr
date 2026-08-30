import { Section, SectionHeader } from '@/components/ui/section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'
import { PROCESS_STEPS } from '@/lib/constants/site'

/**
 * Section [03] — remove process uncertainty. docs/03 §8.
 *
 * A vertical connected timeline at every breakpoint. Pinning was specified as
 * desktop-only in docs/03 §6.3; it is deliberately not used here because the
 * step content is long enough that a pinned horizontal track would hurt
 * readability more than it would impress.
 */
export function Process() {
  return (
    <Section id="process">
      <SectionHeader
        index="03"
        eyebrow="how it works"
        title="Five steps. No surprises in the middle."
        lede="You can see the whole path before you commit to any of it."
      />

      <Reveal as="ol" stagger className="mt-12 flex flex-col">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.id} className="group relative flex gap-6 pb-10 last:pb-0 md:gap-10">
            {/* Connector — hidden on the last item so the line does not
                trail into nothing. */}
            {i < PROCESS_STEPS.length - 1 && (
              <span
                aria-hidden
                className="bg-border absolute top-10 bottom-0 left-[15px] w-px md:left-[19px]"
              />
            )}

            <span
              aria-hidden
              className="border-border bg-surface text-fg-muted relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-mono-label md:size-10"
            >
              {step.id}
            </span>

            <div className="min-w-0 flex-1 pt-1">
              <h3 className="text-h3">{step.title}</h3>
              <p className="text-body text-fg-muted mt-2 max-w-prose">{step.body}</p>
              <div className="border-border bg-surface-code mt-4 inline-flex max-w-full items-center gap-2 overflow-x-auto rounded-md border px-3 py-2">
                <span aria-hidden className="text-fg-subtle shrink-0 font-mono text-mono-sm">
                  $
                </span>
                <code className="text-fg-muted text-mono-sm whitespace-nowrap">
                  {step.command}
                </code>
              </div>
            </div>
          </li>
        ))}
      </Reveal>

      <MonoLabel as="p" tone="subtle" className="mt-4">
        commands shown are illustrative — everything happens in the dashboard
      </MonoLabel>
    </Section>
  )
}
