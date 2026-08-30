import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Magnetic } from '@/components/motion/magnetic'

/**
 * Section [07] — convert. docs/03 §8.
 *
 * Inverted band: uses `--accent` / `--accent-fg`, which flip with the theme,
 * so this reads as a deliberate contrast block in both light and dark rather
 * than as a black box bolted onto a white page.
 */
export function Cta() {
  return (
    <section className="bg-accent text-accent-fg">
      <div className="container-page py-20 text-center md:py-28">
        <MonoLabel as="p" className="text-accent-fg/60 mb-6">
          [07] · start
        </MonoLabel>

        <h2 className="text-display-2 mx-auto max-w-3xl text-balance">
          Applying is free. Read the briefs and decide for yourself.
        </h2>

        <p className="text-body-lg text-accent-fg/70 mx-auto mt-6 max-w-xl">
          No fee to apply, no card required, and every task published in full before you pay
          anything.
        </p>

        <div className="mt-10 flex justify-center">
          <Magnetic>
            <Button
              asChild
              size="lg"
              className="bg-accent-fg text-accent border-transparent hover:brightness-125"
            >
              <Link href="/programs">Browse programs</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
