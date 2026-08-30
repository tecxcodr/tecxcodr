import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import { ProgramCard } from '@/components/marketing/program-card'
import { getPublishedPrograms } from '@/content/programs'

/** Section [02] — move the reader to the catalogue. docs/03 §8. */
export function ProgramsPreview() {
  const programs = getPublishedPrograms().slice(0, 3)

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          index="02"
          eyebrow="programs"
          title="Pick the stack you want to be judged on."
        />
        <Button asChild variant="secondary" className="max-md:w-full">
          <Link href="/programs">
            All programs
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </div>

      <Reveal stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </Reveal>
    </Section>
  )
}
