import { Check, X } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'
import { FIT } from '@/lib/constants/site'

/**
 * Section [05] — self-qualification. docs/03 §8.
 *
 * The right-hand column is the point. Telling people not to buy is the
 * cheapest credibility available to a product in a category with a trust
 * problem, and it costs nothing but honesty.
 */
export function Fit() {
  return (
    <Section>
      <SectionHeader
        index="05"
        eyebrow="honest fit"
        title="This is not for everyone."
        lede="We would rather you skip this than pay for something that was never going to help you."
      />

      <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="border-border bg-surface rounded-md border p-6 md:p-8">
          <MonoLabel as="p" tone="default" className="mb-6">
            this is for you if
          </MonoLabel>
          <ul className="flex flex-col gap-4">
            {FIT.yes.map((item) => (
              <li key={item} className="text-body text-fg-muted flex gap-3">
                <Check aria-hidden className="text-success mt-1 size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-border bg-surface rounded-md border p-6 md:p-8">
          <MonoLabel as="p" tone="default" className="mb-6">
            this is not for you if
          </MonoLabel>
          <ul className="flex flex-col gap-4">
            {FIT.no.map((item) => (
              <li key={item} className="text-body text-fg-muted flex gap-3">
                <X aria-hidden className="text-destructive mt-1 size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
