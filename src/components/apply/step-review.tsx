'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Field } from '@/components/ui/field'
import { Textarea } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { MonoLabel } from '@/components/ui/mono-label'
import {
  EXPERIENCE_OPTIONS,
  REFERRAL_OPTIONS,
  type ApplicationDraft,
  type FieldErrors,
} from '@/lib/validation/application'
import type { Program } from '@/types/program'
import { formatPrice } from '@/lib/utils/format'

/**
 * Step 3 — motivation, source, and a full review of everything captured.
 *
 * The review block exists because this is the last moment before an admin
 * reads the answers; a typo in a college name is cheap to fix here and
 * annoying to fix afterwards.
 */
export function StepReview({
  program,
  draft,
  errors,
  onChange,
  onEditStep,
}: {
  program: Program
  draft: ApplicationDraft
  errors: FieldErrors
  onChange: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
  onEditStep: (step: number) => void
}) {
  const experience = EXPERIENCE_OPTIONS.find((o) => o.value === draft.experienceLevel)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ why this program ]
        </MonoLabel>

        <Field
          id="motivation"
          label={`Why do you want to do the ${program.title} program?`}
          required
          help="A few honest sentences. We read these — generic answers are obvious and do not help you."
          error={errors.motivation}
        >
          {(p) => (
            <Textarea
              {...p}
              rows={6}
              value={draft.motivation ?? ''}
              onChange={(e) => onChange('motivation', e.target.value)}
            />
          )}
        </Field>

        <div className="flex items-center justify-between gap-4">
          <MonoLabel tone="subtle">
            <span data-numeric>{(draft.motivation ?? '').trim().length}</span> / 1500
          </MonoLabel>
        </div>

        <Field id="referralSource" label="How did you hear about Tecxcodr?" error={errors.referralSource}>
          {(p) => (
            <Select
              {...p}
              options={REFERRAL_OPTIONS}
              placeholder="Select one"
              value={draft.referralSource || undefined}
              onValueChange={(v) => onChange('referralSource', v)}
            />
          )}
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <MonoLabel as="p" tone="subtle">
            [ review ]
          </MonoLabel>
        </div>

        <div className="border-border bg-surface divide-border divide-y rounded-md border">
          <ReviewGroup title="Account and contact" onEdit={() => onEditStep(1)}>
            <ReviewRow label="Name" value={draft.fullName} />
            <ReviewRow label="Email" value={draft.email} />
            <ReviewRow label="Phone" value={draft.phone} />
            <ReviewRow
              label="Location"
              value={[draft.city, draft.state].filter(Boolean).join(', ')}
            />
          </ReviewGroup>

          <ReviewGroup title="Academics" onEdit={() => onEditStep(1)}>
            <ReviewRow label="College" value={draft.college} />
            <ReviewRow
              label="Course"
              value={[draft.degree, draft.branch].filter(Boolean).join(' · ')}
            />
            <ReviewRow
              label="Year"
              value={
                draft.currentYear
                  ? `Year ${draft.currentYear} · graduating ${draft.graduationYear ?? '—'}`
                  : undefined
              }
            />
          </ReviewGroup>

          <ReviewGroup title="Technical profile" onEdit={() => onEditStep(2)}>
            <ReviewRow label="Experience" value={experience?.label} />
            <ReviewRow label="Skills" value={(draft.primarySkills ?? []).join(', ')} />
            <ReviewRow label="GitHub" value={draft.githubUrl} />
            <ReviewRow label="LinkedIn" value={draft.linkedinUrl} />
            <ReviewRow label="Portfolio" value={draft.portfolioUrl} />
          </ReviewGroup>
        </div>
      </section>

      <section className="border-border bg-bg-subtle rounded-md border p-5">
        <MonoLabel as="p" tone="subtle" className="mb-3">
          what happens next
        </MonoLabel>
        <ul className="text-body-sm text-fg-muted flex flex-col gap-2">
          <li>Submitting is free. You are not being charged anything now.</li>
          <li>You get a decision within three working days.</li>
          <li>
            If accepted, enrolment costs{' '}
            {formatPrice(program.priceAmountMinor, program.currency)} and you have 14 days to pay.
          </li>
        </ul>

        <div className="border-border mt-5 border-t pt-4">
          <Checkbox
            id="consent"
            checked={draft.consent === true}
            onCheckedChange={(v) => onChange('consent', v === true ? true : undefined)}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
            label={
              <>
                I confirm the information above is accurate, and I understand this is a training
                program — not employment, with no stipend and no placement guarantee.
              </>
            }
          />
          {errors.consent && (
            <p id="consent-error" className="text-caption text-destructive mt-1 ml-[30px]">
              {errors.consent}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function ReviewGroup({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <MonoLabel tone="default">{title}</MonoLabel>
        <button
          type="button"
          onClick={onEdit}
          className="text-caption text-fg-muted hover:text-fg underline underline-offset-4"
        >
          Edit
        </button>
      </div>
      <dl className="grid gap-2">{children}</dl>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <dt className="text-caption text-fg-subtle">{label}</dt>
      <dd className="text-body-sm text-fg-muted break-words">
        {value ? value : <span className="text-fg-subtle">Not provided</span>}
      </dd>
    </div>
  )
}
