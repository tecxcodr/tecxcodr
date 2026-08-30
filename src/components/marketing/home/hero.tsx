import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { OutputLine, TerminalWindow } from '@/components/ui/terminal'
import { Magnetic } from '@/components/motion/magnetic'
import { TypingLines } from '@/components/motion/typing-lines'
import { TRUST_LINE } from '@/lib/constants/site'

/**
 * Section [00] — say what this is in five seconds. docs/03 §8.
 *
 * The headline is plain server-rendered text, not an animated split. Only the
 * terminal types, and it types content that is already in the DOM.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="grid-overlay mask-fade-edges pointer-events-none absolute inset-0"
      />

      <div className="container-page relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <MonoLabel tone="subtle" className="mb-6 block">
              [00] · virtual internships
            </MonoLabel>

            <h1 className="text-display-1">
              Build things.
              <br />
              Get them reviewed.
            </h1>

            <p className="text-body-lg text-fg-muted mt-6 max-w-xl">
              Three real projects over four weeks. A human reads your code and tells you what is
              wrong with it. You finish with a certificate a recruiter can independently verify.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="max-sm:w-full">
                <Button asChild size="lg" className="max-sm:w-full">
                  <Link href="/programs">Browse programs</Link>
                </Button>
              </Magnetic>
              <Button asChild variant="secondary" size="lg" className="max-sm:w-full">
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
              {TRUST_LINE.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-fg-subtle">
                      ·
                    </span>
                  )}
                  <MonoLabel tone="subtle">{item}</MonoLabel>
                </li>
              ))}
            </ul>
          </div>

          <TerminalWindow path="~/tecxcodr — bash" className="w-full">
            <TypingLines
              lines={[
                'tecxcodr apply --program web-development',
                'tecxcodr submit --task 1 --repo github.com/you/portfolio',
              ]}
            />
            <div className="mt-4 space-y-1">
              <OutputLine>→ application received · no fee</OutputLine>
              <OutputLine>→ review in progress · 3 working days</OutputLine>
              <OutputLine tone="success">✓ certificate TCX-2609-7QK4M2XR issued</OutputLine>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  )
}
