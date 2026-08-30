import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { FaqList } from '@/components/marketing/faq-list'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { FAQS } from '@/content/faq'
import { SITE } from '@/lib/constants/site'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Cost, refunds, review turnaround, submissions, and whether this gets you a job. Answered directly, including the answers you might not want.',
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="questions"
        title="Answered directly."
        lede="Including the ones with answers that cost us sales."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MonoLabel as="p" tone="subtle">
              still stuck?
            </MonoLabel>
            <p className="text-body text-fg-muted mt-3">
              If your question is not here, email us. A person reads it.
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <Link href="/contact">Contact us</Link>
            </Button>
            <p className="text-caption text-fg-subtle mt-4">
              or write to{' '}
              <a href={`mailto:${SITE.email}`} className="hover:text-fg underline">
                {SITE.email}
              </a>
            </p>
          </div>

          <FaqList items={FAQS} />
        </div>
      </Section>
    </>
  )
}
