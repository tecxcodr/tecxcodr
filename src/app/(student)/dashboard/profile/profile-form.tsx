'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'
import { Select } from '@/components/ui/select'
import {
  DEGREE_OPTIONS,
  GRADUATION_YEAR_OPTIONS,
  YEAR_OPTIONS,
} from '@/lib/validation/application'
import { MOCK_STUDENT } from '@/content/mock-student'

/**
 * ⚠️ NO BACKEND. Edits are local state only.
 *
 * TODO(backend): updateProfile(ctx, input) — docs/06 §4.1. The server scopes
 * the write to ctx.userId; there is no profile id in the payload by design.
 *
 * Note this edits `student_profiles`, which is the *prefill source*. It never
 * rewrites `applications.answers`, which is snapshotted at submit time
 * (docs/04 §5.6) — an admin's decision record must not change retroactively.
 */
export function ProfileForm() {
  const [values, setValues] = useState({
    fullName: MOCK_STUDENT.name,
    phone: MOCK_STUDENT.phone,
    city: MOCK_STUDENT.city,
    state: MOCK_STUDENT.state,
    college: MOCK_STUDENT.college,
    degree: MOCK_STUDENT.degree,
    branch: MOCK_STUDENT.branch,
    currentYear: String(MOCK_STUDENT.currentYear),
    graduationYear: String(MOCK_STUDENT.graduationYear),
    githubUrl: MOCK_STUDENT.githubUrl,
    linkedinUrl: MOCK_STUDENT.linkedinUrl,
    portfolioUrl: MOCK_STUDENT.portfolioUrl,
  })
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState(false)

  const set = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPending(false)
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ personal ]
        </MonoLabel>

        <Field id="p-fullName" label="Full name">
          {(p) => (
            <Input {...p} value={values.fullName} onChange={(e) => set('fullName', e.target.value)} />
          )}
        </Field>

        <Field id="p-email" label="Email" help="Changing your email requires re-verification.">
          {(p) => <Input {...p} value={MOCK_STUDENT.email} readOnly disabled />}
        </Field>

        <div className="grid gap-5 md:grid-cols-3">
          <Field id="p-phone" label="Phone">
            {(p) => (
              <Input {...p} inputMode="numeric" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
            )}
          </Field>
          <Field id="p-city" label="City">
            {(p) => <Input {...p} value={values.city} onChange={(e) => set('city', e.target.value)} />}
          </Field>
          <Field id="p-state" label="State">
            {(p) => <Input {...p} value={values.state} onChange={(e) => set('state', e.target.value)} />}
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ academics ]
        </MonoLabel>

        <Field id="p-college" label="College or university">
          {(p) => (
            <Input {...p} value={values.college} onChange={(e) => set('college', e.target.value)} />
          )}
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="p-degree" label="Degree">
            {(p) => (
              <Select
                {...p}
                options={DEGREE_OPTIONS}
                value={values.degree}
                onValueChange={(v) => set('degree', v)}
              />
            )}
          </Field>
          <Field id="p-branch" label="Branch">
            {(p) => (
              <Input {...p} value={values.branch} onChange={(e) => set('branch', e.target.value)} />
            )}
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="p-currentYear" label="Current year">
            {(p) => (
              <Select
                {...p}
                options={YEAR_OPTIONS}
                value={values.currentYear}
                onValueChange={(v) => set('currentYear', v)}
              />
            )}
          </Field>
          <Field id="p-graduationYear" label="Graduation year">
            {(p) => (
              <Select
                {...p}
                options={GRADUATION_YEAR_OPTIONS}
                value={values.graduationYear}
                onValueChange={(v) => set('graduationYear', v)}
              />
            )}
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ links ]
        </MonoLabel>

        <Field id="p-github" label="GitHub">
          {(p) => (
            <Input {...p} type="url" value={values.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} />
          )}
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="p-linkedin" label="LinkedIn">
            {(p) => (
              <Input {...p} type="url" value={values.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} />
            )}
          </Field>
          <Field id="p-portfolio" label="Portfolio">
            {(p) => (
              <Input {...p} type="url" value={values.portfolioUrl} onChange={(e) => set('portfolioUrl', e.target.value)} />
            )}
          </Field>
        </div>
      </section>

      <div className="border-border flex flex-wrap items-center gap-4 border-t pt-6">
        <Button type="submit" loading={pending} className="max-sm:w-full">
          Save changes
        </Button>
        {saved && (
          <p role="status" className="text-body-sm text-success">
            Saved locally — not persisted yet.
          </p>
        )}
      </div>
    </form>
  )
}
