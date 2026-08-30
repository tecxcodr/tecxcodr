import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/marketing/page-hero'
import { Section, SectionHeader } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'
import { SITE } from '@/lib/constants/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Tecxcodr exists, what it is, and what it is not. A small, deliberately honest virtual internship platform for student developers in India.',
  alternates: { canonical: '/about' },
}

const PRINCIPLES = [
  {
    id: '01',
    title: 'Show the work before the price',
    body: 'Every task brief is public. If the work does not look worth ₹799 to you, do not pay ₹799. We would rather lose the sale than argue about it afterwards.',
  },
  {
    id: '02',
    title: 'A human reads the code',
    body: 'Automated approval would make the certificate worthless. Someone reads your repository and writes feedback naming what is actually wrong. That is slower and it does not scale easily, and it is the point.',
  },
  {
    id: '03',
    title: 'Make the certificate checkable',
    body: 'A certificate nobody can verify is decoration. Every one we issue has a public page showing who earned it and which tasks they completed — and it says so plainly if one has been revoked.',
  },
  {
    id: '04',
    title: 'Never promise a job',
    body: 'The category is full of platforms implying employment outcomes they cannot influence. We do not, anywhere, in any copy. It is the single easiest way to tell whether someone is being straight with you.',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="about"
        title="A small platform, deliberately honest about what it is."
        lede="Tecxcodr exists because the gap between “unpaid Google Form certificate mill” and “competitive company internship” has nothing structured, affordable and verifiable in it."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MonoLabel as="p" tone="subtle">
              [ the problem ]
            </MonoLabel>
          </div>

          <div className="text-body text-fg-muted flex max-w-prose flex-col gap-5">
            <p>
              Most engineering students in India are told to get internship experience and then
              handed a market where real internships are scarce, concentrated in a handful of
              cities, and overwhelmingly awarded to students from a small set of colleges.
            </p>
            <p>
              The fallback is a Google Form, a WhatsApp group, and a JPEG certificate with no
              provenance. The student gets a résumé line that recruiters have already learned to
              discount, and no artifact that proves anything happened.
            </p>
            <p>
              On the other side, a recruiter looking at one of those certificates has no way to
              check it, no way to see what was built, and no evidence anyone evaluated it. So they
              treat it as noise — which is a rational response.
            </p>
            <p className="text-fg">
              Tecxcodr is an attempt at the narrow, unglamorous fix: real briefs, real review, and
              a certificate that can be checked in four seconds.
            </p>
          </div>
        </div>
      </Section>

      <Section className="bg-bg-subtle">
        <SectionHeader eyebrow="principles" title="Four rules we hold ourselves to." />

        <Reveal as="ol" stagger className="mt-10 grid gap-4 md:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <li
              key={principle.id}
              className="border-border bg-bg rounded-md border p-6 md:p-8"
            >
              <MonoLabel tone="subtle">[{principle.id}]</MonoLabel>
              <h3 className="text-h3 mt-4">{principle.title}</h3>
              <p className="text-body text-fg-muted mt-3">{principle.body}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHeader eyebrow="who runs this" title="One person, so far." />
        <div className="text-body text-fg-muted mt-6 flex max-w-prose flex-col gap-5">
          <p>
            Tecxcodr is currently run by a single person who writes the task briefs, reads every
            submission, and answers every email. That is a real constraint and it is worth knowing
            about before you enrol: reviews come back within three working days because that is
            what one person can sustain, not because a queue is being automated.
          </p>
          <p>
            If you want to know something specific before applying — about the review standard, the
            refund policy, or anything else — ask.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="max-sm:w-full">
            <Link href="/programs">Browse programs</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="max-sm:w-full">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </Button>
        </div>
      </Section>
    </>
  )
}
