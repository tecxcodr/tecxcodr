import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'

const SAMPLE_CODE = 'TCX-2609-7QK4M2XR'

/**
 * Section [04] — the differentiator. docs/03 §8.
 *
 * Shows the verification page rather than a picture of a certificate, because
 * the verifiable link is the actual product claim.
 */
export function Certificate() {
  return (
    <Section className="bg-bg-subtle">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            index="04"
            eyebrow="the certificate"
            title="A link a recruiter can check in four seconds."
            lede="Every certificate has a public verification page showing who earned it, which program, when, and exactly which tasks they completed. No login, no PDF to trust."
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" className="max-sm:w-full">
              <Link href={`/verify/${SAMPLE_CODE}`}>See a live example</Link>
            </Button>
          </div>

          <p className="text-caption text-fg-subtle mt-6 max-w-prose">
            Certificates record completed work. They are not a qualification, a degree, or a
            statement of employability.
          </p>
        </div>

        <Reveal className="border-border bg-bg rounded-md border p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <MonoLabel tone="subtle">tecxcodr.com/verify</MonoLabel>
            <Badge tone="success">
              <ShieldCheck aria-hidden className="mr-1.5 size-3" />
              Valid
            </Badge>
          </div>

          <p className="text-mono-sm text-fg-muted mt-6 font-mono">{SAMPLE_CODE}</p>
          <p className="text-h3 mt-1">Aarav Sharma</p>
          <p className="text-body text-fg-muted mt-1">
            Web Development · completion certificate
          </p>

          <dl className="border-border mt-6 grid grid-cols-2 gap-4 border-t pt-6">
            <div>
              <MonoLabel as="dt" tone="subtle">
                issued
              </MonoLabel>
              <dd className="text-body-sm mt-1">14 Sep 2026</dd>
            </div>
            <div>
              <MonoLabel as="dt" tone="subtle">
                tasks approved
              </MonoLabel>
              <dd className="text-body-sm mt-1" data-numeric>
                02 / 03
              </dd>
            </div>
          </dl>

          <MonoLabel as="p" tone="subtle" className="mt-6">
            verified by tecxcodr
          </MonoLabel>
        </Reveal>
      </div>
    </Section>
  )
}
