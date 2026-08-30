import Link from 'next/link'
import { Section, SectionHeader } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { FaqList } from '@/components/marketing/faq-list'
import { FEATURED_FAQS } from '@/content/faq'

/** Section [06] — answer the money and legitimacy questions. docs/03 §8. */
export function FaqPreview() {
  return (
    <Section className="bg-bg-subtle">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <SectionHeader
            index="06"
            eyebrow="questions"
            title="The ones people actually ask."
            lede="Including the ones with answers you might not like."
          />
          <Button asChild variant="secondary" className="mt-8">
            <Link href="/faq">All questions</Link>
          </Button>
        </div>

        <FaqList items={FEATURED_FAQS} />
      </div>
    </Section>
  )
}
