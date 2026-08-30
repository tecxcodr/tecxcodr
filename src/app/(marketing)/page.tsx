import type { Metadata } from 'next'
import { Hero } from '@/components/marketing/home/hero'
import { Proof } from '@/components/marketing/home/proof'
import { ProgramsPreview } from '@/components/marketing/home/programs-preview'
import { Process } from '@/components/marketing/home/process'
import { Certificate } from '@/components/marketing/home/certificate'
import { Fit } from '@/components/marketing/home/fit'
import { FaqPreview } from '@/components/marketing/home/faq-preview'
import { Cta } from '@/components/marketing/home/cta'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/**
 * Eight sections, each with a stated job — docs/03-DESIGN-SYSTEM.md §8.
 * A ninth section needs a job before it needs a design.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Proof />
      <ProgramsPreview />
      <Process />
      <Certificate />
      <Fit />
      <FaqPreview />
      <Cta />
    </>
  )
}
