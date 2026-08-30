'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * FAQ accordion. docs/03-DESIGN-SYSTEM.md §5.9.
 *
 * Height animates via `grid-template-rows: 0fr -> 1fr` rather than by
 * measuring pixel heights in JS — no layout thrash, no reflow per frame.
 * Radix supplies the keyboard and ARIA behaviour.
 */
export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  value,
  question,
  children,
}: {
  value: string
  question: string
  children: React.ReactNode
}) {
  return (
    <AccordionPrimitive.Item value={value} className="border-border border-b">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            'group flex w-full items-start justify-between gap-6 py-5 text-left',
            'hover:text-fg-muted transition-colors duration-[--duration-instant]',
          )}
        >
          <span className="text-h4 font-sans">{question}</span>
          <Plus
            aria-hidden
            className={cn(
              'text-fg-subtle mt-1 size-4 shrink-0',
              'transition-transform duration-[--duration-base] ease-[--ease-out-expo]',
              'group-data-[state=open]:rotate-45',
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content
        className={cn(
          'grid grid-rows-[0fr] transition-[grid-template-rows]',
          'duration-[--duration-base] ease-[--ease-out-expo]',
          'data-[state=open]:grid-rows-[1fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="text-body text-fg-muted max-w-prose pr-10 pb-5">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}
