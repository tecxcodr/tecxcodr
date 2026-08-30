import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'

export const metadata: Metadata = {
  title: 'Verify a certificate',
  description:
    'Check any Tecxcodr certificate. Enter the code to see the holder, program, issue date, status and completed tasks. No account required.',
  alternates: { canonical: '/verify' },
}

/**
 * A plain <form> with a server action — no client JS at all. The whole page
 * is static and the lookup is a navigation, which keeps this route the
 * lightest in the app (docs/02-TRD.md §10.1: ≤60 kB).
 */
async function goToCertificate(formData: FormData) {
  'use server'
  const code = String(formData.get('code') ?? '')
    .trim()
    .toUpperCase()
  if (!code) redirect('/verify')
  redirect(`/verify/${encodeURIComponent(code)}`)
}

export default function VerifyIndexPage() {
  return (
    <div className="container-page flex flex-col items-center py-20 md:py-28">
      <div className="w-full max-w-xl">
        <MonoLabel tone="subtle">[ verify ]</MonoLabel>
        <h1 className="text-h1 mt-4">Check a Tecxcodr certificate</h1>
        <p className="text-body text-fg-muted mt-4">
          Enter the code printed on the certificate. You will see who earned it, which program,
          when it was issued, and exactly which tasks they completed.
        </p>

        <form action={goToCertificate} className="mt-8 flex flex-col gap-4">
          <Field
            id="certificate-code"
            label="Certificate code"
            help="Format: TCX-2609-7QK4M2XR"
          >
            {(p) => (
              <Input
                {...p}
                name="code"
                placeholder="TCX-0000-XXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                className="font-mono uppercase"
              />
            )}
          </Field>

          <Button type="submit" size="lg" className="sm:self-start">
            <Search aria-hidden className="size-4" />
            Verify
          </Button>
        </form>

        <div className="border-border mt-12 border-t pt-6">
          <MonoLabel as="p" tone="subtle">
            for recruiters
          </MonoLabel>
          <p className="text-body-sm text-fg-muted mt-2">
            A Tecxcodr certificate records completed project work reviewed by a person. It is not
            a degree, a qualification, or a statement about employability. The verification page
            shows the specific tasks that were approved so you can judge the scope yourself.
          </p>
        </div>
      </div>
    </div>
  )
}
