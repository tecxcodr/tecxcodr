'use client'

import { Accordion, AccordionItem } from '@/components/ui/accordion'
import type { Faq } from '@/content/faq'

/**
 * Thin client wrapper so the FAQ data stays server-rendered and only the
 * disclosure behaviour ships as JS.
 */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="border-border border-t">
      {items.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} question={faq.question}>
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  )
}
