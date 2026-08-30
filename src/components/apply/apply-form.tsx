'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MonoLabel } from '@/components/ui/mono-label'
import { Stepper } from '@/components/ui/stepper'
import { StepProfile } from '@/components/apply/step-profile'
import { StepTechnical } from '@/components/apply/step-technical'
import { StepReview } from '@/components/apply/step-review'
import {
  collectErrors,
  step1Schema,
  step2Schema,
  step3Schema,
  type ApplicationDraft,
  type FieldErrors,
} from '@/lib/validation/application'
import type { Program } from '@/types/program'
import { formatPrice } from '@/lib/utils/format'

const STEPS = ['Profile', 'Technical', 'Review'] as const
const SCHEMAS = [step1Schema, step2Schema, step3Schema] as const

/**
 * Three-step application — docs/01 §7.3.
 *
 * ⚠️ NO BACKEND. The draft persists to localStorage instead of the
 * `applications` table, and submitting does not create a record. The step
 * schemas and the draft shape are the real ones, so `saveApplicationStep` /
 * `submitApplication` (docs/06 §4.2) drop straight in.
 *
 * TODO(backend):
 *   1. startApplication(programSlug) on mount -> applicationId
 *   2. saveApplicationStep(applicationId, step, data) on each Next
 *   3. submitApplication(applicationId) here, then redirect to /dashboard
 */
export function ApplyForm({ program }: { program: Program }) {
  const storageKey = `tecxcodr:draft:${program.slug}`

  const [step, setStep] = useState(1)
  const [draft, setDraft] = useState<ApplicationDraft>({})
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [restored, setRestored] = useState(false)
  const hydrated = useRef(false)
  const headingRef = useRef<HTMLDivElement>(null)

  // Hydrate after mount — localStorage does not exist during SSR, and reading
  // it during render would desync the first client paint from the server HTML.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setDraft(parsed as ApplicationDraft)
          setRestored(true)
        }
      }
    } catch {
      // A corrupt draft is not worth failing the page over — start clean.
    }
    hydrated.current = true
  }, [storageKey])

  // Autosave. Skipped until hydration so an empty initial state cannot
  // overwrite a real saved draft.
  useEffect(() => {
    if (!hydrated.current || submitted) return
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(draft))
      } catch {
        // Quota or private mode — autosave is a convenience, not a guarantee.
      }
    }, 400)
    return () => window.clearTimeout(id)
  }, [draft, storageKey, submitted])

  const onChange = useCallback(
    <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }))
      // Clear this field's error as soon as it is touched; re-validation
      // happens on Next, so errors never nag while someone is still typing.
      setErrors((prev) => {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    [],
  )

  const validateStep = (target: number): boolean => {
    const schema = SCHEMAS[target - 1]
    if (!schema) return true
    const result = schema.safeParse(draft)
    if (result.success) {
      setErrors({})
      return true
    }
    setErrors(collectErrors(result.error.issues))
    return false
  }

  const focusTop = () => {
    headingRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => {
    if (!validateStep(step)) {
      // Move focus to the first invalid control so keyboard and screen-reader
      // users are not left at the bottom of the form wondering what failed.
      const firstError = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      firstError?.focus()
      firstError?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setStep((s) => Math.min(STEPS.length, s + 1))
    focusTop()
  }

  const back = () => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
    focusTop()
  }

  const submit = async () => {
    if (!validateStep(3)) return
    setSubmitting(true)
    // Stands in for the submitApplication server action.
    await new Promise((resolve) => setTimeout(resolve, 700))
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setSubmitting(false)
    setSubmitted(true)
    focusTop()
  }

  if (submitted) {
    return <SubmittedPanel program={program} />
  }

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <div ref={headingRef} tabIndex={-1} className="outline-none">
          <MonoLabel tone="subtle">applying to</MonoLabel>
          <h1 className="text-h1 mt-2">{program.title}</h1>
          <p className="text-body text-fg-muted mt-2">
            Free to apply. Enrolment is {formatPrice(program.priceAmountMinor, program.currency)},
            payable only if you are accepted.
          </p>
        </div>

        <Stepper steps={STEPS} current={step} className="mt-8" />

        {restored && step === 1 && (
          <p
            role="status"
            className="border-border bg-bg-subtle text-body-sm text-fg-muted mt-6 rounded-md border px-4 py-3"
          >
            We restored your saved draft. Nothing has been submitted yet.
          </p>
        )}

        <div className="mt-10">
          {step === 1 && <StepProfile draft={draft} errors={errors} onChange={onChange} />}
          {step === 2 && (
            <StepTechnical
              draft={draft}
              errors={errors}
              suggestedSkills={program.stack}
              onChange={onChange}
            />
          )}
          {step === 3 && (
            <StepReview
              program={program}
              draft={draft}
              errors={errors}
              onChange={onChange}
              onEditStep={(s) => {
                setErrors({})
                setStep(s)
                focusTop()
              }}
            />
          )}
        </div>

        {Object.keys(errors).length > 0 && (
          <p role="alert" className="text-body-sm text-destructive mt-6">
            Some fields need attention before you can continue.
          </p>
        )}

        <div className="border-border mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={back} className="max-sm:w-full">
              <ArrowLeft aria-hidden className="size-4" />
              Back
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step < STEPS.length ? (
            <Button size="lg" onClick={next} className="max-sm:w-full">
              Continue
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={submit} loading={submitting} className="max-sm:w-full">
              Submit application
            </Button>
          )}
        </div>

        <MonoLabel as="p" tone="subtle" className="mt-6 block text-center">
          progress saves automatically · you can close this and come back
        </MonoLabel>
      </div>
    </div>
  )
}

function SubmittedPanel({ program }: { program: Program }) {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="border-border bg-surface mx-auto max-w-xl rounded-md border p-8 text-center md:p-10">
        <CheckCircle2 aria-hidden className="text-success mx-auto size-7" />
        <h1 className="text-h2 mt-5">Application submitted</h1>
        <p className="text-body text-fg-muted mt-3">
          Your application to <strong className="text-fg font-medium">{program.title}</strong> is
          in. You will get a decision by email within three working days, and you can track it in
          your dashboard the whole time.
        </p>

        <div className="border-border mt-8 border-t pt-6">
          <MonoLabel as="p" tone="subtle">
            what happens next
          </MonoLabel>
          <ol className="text-body-sm text-fg-muted mt-3 flex flex-col gap-2 text-left">
            <li>1 — Someone reads your application.</li>
            <li>2 — You get an accept or a reject, with a reason if rejected.</li>
            <li>3 — If accepted, you have 14 days to complete enrolment.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="max-sm:w-full">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="max-sm:w-full">
            <Link href="/programs">Browse programs</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
