import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { PageHero } from '@/components/marketing/page-hero'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Reveal } from '@/components/motion/reveal'
import { PROGRAMS, getProgramBySlug, getPublishedPrograms } from '@/content/programs'
import { ProgramCard } from '@/components/marketing/program-card'
import { DOMAIN_LABEL, LEVEL_LABEL } from '@/types/program'
import { formatPrice, pad2 } from '@/lib/utils/format'

/** Static params from the published set — docs/02-TRD.md §3.3. */
export function generateStaticParams() {
  return PROGRAMS.filter((p) => p.status === 'PUBLISHED').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) return {}

  return {
    title: program.title,
    description: program.summary,
    alternates: { canonical: `/programs/${program.slug}` },
    openGraph: { title: `${program.title} — Tecxcodr`, description: program.summary },
  }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  const totalHours = program.tasks.reduce((sum, t) => sum + t.estimatedHours, 0)
  const related = getPublishedPrograms()
    .filter((p) => p.id !== program.id)
    .slice(0, 3)

  return (
    <>
      <PageHero eyebrow={DOMAIN_LABEL[program.domain]} title={program.title} lede={program.summary}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="max-sm:w-full">
            <Link href={`/apply/${program.slug}`}>
              Apply — free
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
          <MonoLabel tone="subtle">
            enrolment {formatPrice(program.priceAmountMinor, program.currency)} · only after you
            are accepted
          </MonoLabel>
        </div>
      </PageHero>

      {/* Facts strip — everything a purchase decision needs, above the fold on
          mobile. docs/01 US-1. */}
      <section className="border-border border-b">
        <dl className="container-page grid grid-cols-2 gap-px md:grid-cols-4">
          <Fact label="duration" value={`${pad2(program.durationWeeks)} weeks`} note="self-paced" />
          <Fact
            label="tasks"
            value={pad2(program.totalTaskCount)}
            note={`~${totalHours}h total`}
          />
          <Fact
            label="to certify"
            value={`${pad2(program.requiredTaskCount)} of ${pad2(program.totalTaskCount)}`}
            note="approved tasks"
          />
          <Fact
            label="enrolment"
            value={formatPrice(program.priceAmountMinor, program.currency)}
            note="one payment"
          />
        </dl>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <MonoLabel tone="subtle">[ syllabus ]</MonoLabel>
              <Badge>{LEVEL_LABEL[program.level]}</Badge>
            </div>

            <h2 className="text-h2 mt-4">What you will build</h2>
            <p className="text-body text-fg-muted mt-3 max-w-prose">
              Three tasks, in order. Each is reviewed by a human against the requirements listed
              below — those requirements are the actual checklist, not a summary of one.
            </p>

            <Reveal as="ol" stagger className="mt-10 flex flex-col gap-4">
              {program.tasks.map((task) => (
                <li
                  key={task.id}
                  className="border-border bg-surface rounded-md border p-6 md:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <MonoLabel tone="subtle">task {pad2(task.position)}</MonoLabel>
                    <MonoLabel tone="subtle">~{task.estimatedHours}h</MonoLabel>
                    {task.isRequired ? (
                      <Badge tone="info">Required</Badge>
                    ) : (
                      <Badge>Optional</Badge>
                    )}
                  </div>

                  <h3 className="text-h3 mt-4">{task.title}</h3>
                  <p className="text-body text-fg-muted mt-3 max-w-prose">{task.brief}</p>

                  <MonoLabel as="p" className="mt-6 mb-3">
                    requirements
                  </MonoLabel>
                  <ul className="flex flex-col gap-2">
                    {task.requirements.map((req) => (
                      <li key={req} className="text-body-sm text-fg-muted flex gap-3">
                        <Check aria-hidden className="text-fg-subtle mt-1 size-3.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </Reveal>
          </div>

          {/* Sticky summary — desktop only. On mobile the facts strip above
              already carries this, so it would be duplication. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-border bg-surface rounded-md border p-6">
              <MonoLabel as="p" tone="subtle">
                stack
              </MonoLabel>
              <ul className="mt-3 flex flex-wrap gap-2">
                {program.stack.map((tech) => (
                  <li key={tech}>
                    <Badge>{tech}</Badge>
                  </li>
                ))}
              </ul>

              <div className="border-border mt-6 border-t pt-6">
                <MonoLabel as="p" tone="subtle">
                  how submission works
                </MonoLabel>
                <p className="text-body-sm text-fg-muted mt-3">
                  Each task is submitted as a public GitHub repository link, with an optional live
                  demo URL. Your work stays in your account, under your name, permanently.
                </p>
              </div>

              <div className="border-border mt-6 border-t pt-6">
                <MonoLabel as="p" tone="subtle">
                  review turnaround
                </MonoLabel>
                <p className="text-body-sm text-fg-muted mt-3">
                  Three working days. If changes are needed you get written feedback and can
                  resubmit — resubmissions are not penalised.
                </p>
              </div>

              <Button asChild size="lg" className="mt-6 w-full">
                <Link href={`/apply/${program.slug}`}>Apply — free</Link>
              </Button>
              <p className="text-caption text-fg-subtle mt-3 text-center">
                No card required to apply.
              </p>
            </div>

            <p className="text-caption text-fg-subtle mt-4">
              This is a training program. It is not employment, carries no stipend, and includes
              no placement guarantee.
            </p>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-bg-subtle">
          <h2 className="text-h2">Other programs</h2>
          <Reveal stagger className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </Reveal>
        </Section>
      )}
    </>
  )
}

function Fact({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-border py-6 not-last:border-r max-md:even:pl-6 md:px-6 md:first:pl-0">
      <MonoLabel as="dt" tone="subtle">
        {label}
      </MonoLabel>
      <dd className="mt-2">
        <span className="text-h3 font-mono" data-numeric>
          {value}
        </span>
        <span className="text-caption text-fg-subtle mt-1 block">{note}</span>
      </dd>
    </div>
  )
}
