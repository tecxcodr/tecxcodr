import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ApplyForm } from '@/components/apply/apply-form'
import { PROGRAMS, getProgramBySlug } from '@/content/programs'

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
    title: `Apply — ${program.title}`,
    description: `Apply to the ${program.title} program. Free to apply, decision in three working days.`,
    // The application flow has no business appearing in search results.
    robots: { index: false, follow: false },
  }
}

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  return <ApplyForm program={program} />
}
