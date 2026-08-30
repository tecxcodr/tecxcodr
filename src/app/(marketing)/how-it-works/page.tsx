import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Process } from '@/components/marketing/home/process'
import { Section, SectionHeader } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Apply free, get a decision, enrol, build three projects, get human code review, and earn a verifiable certificate. The whole process, stated plainly.',
  alternates: { canonical: '/how-it-works' },
}

const REVIEW_OUTCOMES = [
  {
    status: 'Approved',
    body: 'Your submission meets the written requirements. It counts toward your certificate and you move to the next task.',
  },
  {
    status: 'Changes requested',
    body: 'Something specific is missing or wrong. You get written feedback naming it, and you resubmit. There is no penalty and no limit on honest attempts.',
  },
] as const

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="how it works"
        title="No stage of this is a mystery."
        lede="You can see the entire path — including what happens if your work is not accepted first time — before you spend anything."
      />

      <Process />

      <Section className="bg-bg-subtle">
        <SectionHeader
          eyebrow="review"
          title="What happens when you submit."
          lede="Every submission gets one of two outcomes, both written by a person who read your code."
        />

        <Reveal stagger className="mt-10 grid gap-4 md:grid-cols-2">
          {REVIEW_OUTCOMES.map((outcome) => (
            <div
              key={outcome.status}
              className="border-border bg-bg rounded-md border p-6 md:p-8"
            >
              <MonoLabel as="p" tone="default">
                {outcome.status}
              </MonoLabel>
              <p className="text-body text-fg-muted mt-3">{outcome.body}</p>
            </div>
          ))}
        </Reveal>

        <p className="text-body-sm text-fg-muted mt-8 max-w-prose">
          Approval is not automatic. A submission that does not meet the stated requirements does
          not get approved because you paid — that would make the certificate meaningless, which
          would defeat the point of the entire product.
        </p>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="the deal, stated plainly"
          title="What we promise, and what we do not."
        />

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <MonoLabel as="p" tone="default" className="mb-4">
              we promise
            </MonoLabel>
            <ul className="text-body text-fg-muted flex flex-col gap-3">
              <li>Task briefs published in full before you pay.</li>
              <li>A human reads every submission and writes real feedback.</li>
              <li>A response within three working days.</li>
              <li>A certificate anyone can verify at a public URL.</li>
              <li>A refund within seven days if you have not submitted anything.</li>
            </ul>
          </div>
          <div>
            <MonoLabel as="p" tone="default" className="mb-4">
              we do not promise
            </MonoLabel>
            <ul className="text-body text-fg-muted flex flex-col gap-3">
              <li>A job, an interview, or an introduction to an employer.</li>
              <li>A stipend or any payment to you. This is not employment.</li>
              <li>That the certificate carries weight with any specific company.</li>
              <li>Approval regardless of the quality of your work.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/programs">Browse programs</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/faq">Read the FAQ</Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
