import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Section } from '@/components/ui/section'
import { MonoLabel } from '@/components/ui/mono-label'
import { SITE } from '@/lib/constants/site'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions about programs, review standards, refunds or certificates. A person reads every message.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="05"
        eyebrow="contact"
        title="Ask before you apply."
        lede="If something about the programs, the review standard or the refund policy is unclear, ask. It is a better use of your time than guessing."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MonoLabel as="p" tone="subtle">
              direct
            </MonoLabel>
            <a
              href={`mailto:${SITE.email}`}
              className="text-body text-fg hover:text-fg-muted mt-2 block underline underline-offset-4"
            >
              {SITE.email}
            </a>

            <MonoLabel as="p" tone="subtle" className="mt-8">
              before you write
            </MonoLabel>
            <p className="text-body-sm text-fg-muted mt-2">
              Most questions about cost, refunds, timelines and certificates are already answered
              on the{' '}
              <Link href="/faq" className="text-fg underline underline-offset-4">
                FAQ
              </Link>
              .
            </p>

            <MonoLabel as="p" tone="subtle" className="mt-8">
              what we cannot help with
            </MonoLabel>
            <p className="text-body-sm text-fg-muted mt-2">
              Job referrals, placement assistance, or letters vouching for employability. We do not
              offer any of these.
            </p>
          </div>

          <ContactForm />
        </div>
      </Section>
    </>
  )
}
