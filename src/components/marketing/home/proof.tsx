import { Section, SectionHeader } from '@/components/ui/section'
import { MonoLabel } from '@/components/ui/mono-label'
import { CountUp } from '@/components/motion/count-up'
import { Reveal } from '@/components/motion/reveal'
import { getPublishedPrograms } from '@/content/programs'

const METRICS = [
  { value: 4, label: 'weeks per program', note: 'self-paced, clock starts at enrolment' },
  { value: 3, label: 'real projects', note: 'full briefs public before you pay' },
  { value: 1, label: 'human reviewer', note: 'feedback within 3 working days' },
] as const

/**
 * Section [01] — kill the "is this a scam" objection immediately, by showing
 * an actual task brief rather than claiming the tasks are good. docs/03 §8.
 */
export function Proof() {
  const sample = getPublishedPrograms()[0]?.tasks[1]

  return (
    <Section className="bg-bg-subtle">
      <SectionHeader
        index="01"
        eyebrow="what you actually get"
        title="Real briefs, not certificate templates."
        lede="Every task has written requirements a reviewer checks your code against. Here is one of them, in full, from the Web Development program."
      />

      <Reveal as="ul" stagger className="mt-12 grid gap-px md:grid-cols-3">
        {METRICS.map((metric) => (
          <li key={metric.label} className="border-border bg-bg rounded-md border p-6">
            <p className="text-mono-metric font-mono">
              <CountUp value={metric.value} />
            </p>
            <MonoLabel as="p" tone="default" className="mt-2">
              {metric.label}
            </MonoLabel>
            <p className="text-body-sm text-fg-muted mt-2">{metric.note}</p>
          </li>
        ))}
      </Reveal>

      {sample && (
        <Reveal className="border-border bg-bg mt-6 rounded-md border p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <MonoLabel tone="subtle">sample · task 02</MonoLabel>
            <MonoLabel tone="subtle">~{sample.estimatedHours}h</MonoLabel>
          </div>

          <h3 className="text-h3 mt-4 max-w-2xl">{sample.title}</h3>
          <p className="text-body text-fg-muted mt-3 max-w-prose">{sample.brief}</p>

          <MonoLabel as="p" className="mt-6 mb-3">
            requirements
          </MonoLabel>
          <ul className="flex flex-col gap-2">
            {sample.requirements.map((req) => (
              <li key={req} className="text-body-sm text-fg-muted flex gap-3">
                <span aria-hidden className="text-fg-subtle font-mono select-none">
                  —
                </span>
                {req}
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  )
}
