import type { Metadata } from 'next'
import { PageHero } from '@/components/marketing/page-hero'
import { ProgramGrid } from '@/components/marketing/program-grid'
import { Section } from '@/components/ui/section'
import { MonoLabel } from '@/components/ui/mono-label'
import { getPublishedPrograms } from '@/content/programs'

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Six coding programs with full task briefs published before you pay. Four weeks, three projects, human code review, and a verifiable certificate.',
  alternates: { canonical: '/programs' },
}

export default function ProgramsPage() {
  const programs = getPublishedPrograms()

  return (
    <>
      <PageHero
        index="01"
        eyebrow="programs"
        title="Every brief, in full, before you pay."
        lede="Six programs. Same structure, same price, same standard of review. Open any one and read the actual tasks — there is nothing behind a paywall."
      />

      <Section>
        <ProgramGrid programs={programs} />

        <div className="border-border mt-16 border-t pt-8">
          <MonoLabel as="p" tone="subtle">
            all programs · 04 weeks · 03 tasks · complete any 02 to earn a certificate ·
            applying is free
          </MonoLabel>
        </div>
      </Section>
    </>
  )
}
