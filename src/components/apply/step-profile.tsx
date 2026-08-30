'use client'

import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { MonoLabel } from '@/components/ui/mono-label'
import {
  DEGREE_OPTIONS,
  GRADUATION_YEAR_OPTIONS,
  YEAR_OPTIONS,
  type ApplicationDraft,
  type FieldErrors,
} from '@/lib/validation/application'

/**
 * Step 1 — account + identity + academics.
 *
 * Signup is folded in here rather than gating the flow behind a separate
 * register page (docs/00 A1). The student is mid-intent; sending them to a
 * different screen to make an account is where applications get abandoned.
 */
export function StepProfile({
  draft,
  errors,
  onChange,
}: {
  draft: ApplicationDraft
  errors: FieldErrors
  onChange: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ account ]
        </MonoLabel>

        <Field id="fullName" label="Full name" required error={errors.fullName}>
          {(p) => (
            <Input
              {...p}
              autoComplete="name"
              value={draft.fullName ?? ''}
              onChange={(e) => onChange('fullName', e.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="email"
            label="Email"
            required
            help="Used to sign in and to send your decision."
            error={errors.email}
          >
            {(p) => (
              <Input
                {...p}
                type="email"
                autoComplete="email"
                value={draft.email ?? ''}
                onChange={(e) => onChange('email', e.target.value)}
              />
            )}
          </Field>

          <Field
            id="password"
            label="Create a password"
            required
            help="At least 8 characters."
            error={errors.password}
          >
            {(p) => (
              <Input
                {...p}
                type="password"
                autoComplete="new-password"
                value={draft.password ?? ''}
                onChange={(e) => onChange('password', e.target.value)}
              />
            )}
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ contact ]
        </MonoLabel>

        <div className="grid gap-5 md:grid-cols-3">
          <Field id="phone" label="Phone" required error={errors.phone}>
            {(p) => (
              <Input
                {...p}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9876543210"
                value={draft.phone ?? ''}
                onChange={(e) => onChange('phone', e.target.value)}
              />
            )}
          </Field>

          <Field id="city" label="City" required error={errors.city}>
            {(p) => (
              <Input
                {...p}
                autoComplete="address-level2"
                value={draft.city ?? ''}
                onChange={(e) => onChange('city', e.target.value)}
              />
            )}
          </Field>

          <Field id="state" label="State" required error={errors.state}>
            {(p) => (
              <Input
                {...p}
                autoComplete="address-level1"
                value={draft.state ?? ''}
                onChange={(e) => onChange('state', e.target.value)}
              />
            )}
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ academics ]
        </MonoLabel>

        <Field id="college" label="College or university" required error={errors.college}>
          {(p) => (
            <Input
              {...p}
              autoComplete="organization"
              value={draft.college ?? ''}
              onChange={(e) => onChange('college', e.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="degree" label="Degree" required error={errors.degree}>
            {(p) => (
              <Select
                {...p}
                options={DEGREE_OPTIONS}
                placeholder="Select degree"
                value={draft.degree ?? undefined}
                onValueChange={(v) => onChange('degree', v)}
              />
            )}
          </Field>

          <Field
            id="branch"
            label="Branch or major"
            required
            error={errors.branch}
          >
            {(p) => (
              <Input
                {...p}
                placeholder="Computer Science"
                value={draft.branch ?? ''}
                onChange={(e) => onChange('branch', e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="currentYear" label="Current year" required error={errors.currentYear}>
            {(p) => (
              <Select
                {...p}
                options={YEAR_OPTIONS}
                placeholder="Select year"
                value={draft.currentYear ? String(draft.currentYear) : undefined}
                onValueChange={(v) => onChange('currentYear', Number(v))}
              />
            )}
          </Field>

          <Field
            id="graduationYear"
            label="Graduation year"
            required
            error={errors.graduationYear}
          >
            {(p) => (
              <Select
                {...p}
                options={GRADUATION_YEAR_OPTIONS}
                placeholder="Select year"
                value={draft.graduationYear ? String(draft.graduationYear) : undefined}
                onValueChange={(v) => onChange('graduationYear', Number(v))}
              />
            )}
          </Field>
        </div>
      </section>
    </div>
  )
}
