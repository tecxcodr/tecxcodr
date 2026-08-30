'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { submissionSchema, type SubmissionErrors } from '@/lib/validation/submission'
import type { TaskSubmission } from '@/types/enrollment'

/**
 * ⚠️ NO BACKEND. Validates for real, then reports success without persisting.
 *
 * TODO(backend): submitTask(enrollmentId, programTaskId, input) — docs/06 §4.3.
 * The server must re-check enrolment ownership, ACTIVE status, the ends_at
 * window and that no APPROVED submission already exists for this task.
 */
export function SubmissionForm({
  taskId,
  previous,
}: {
  taskId: string
  previous?: TaskSubmission
}) {
  const [values, setValues] = useState({
    // Prefill from the rejected attempt — retyping a URL you already gave us
    // is pure friction (docs/01 US-5).
    repoUrl: previous?.repoUrl ?? '',
    demoUrl: previous?.demoUrl ?? '',
    notes: '',
  })
  const [errors, setErrors] = useState<SubmissionErrors>({})
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = submissionSchema.safeParse(values)

    if (!result.success) {
      const next: SubmissionErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string' && !(key in next)) {
          next[key as keyof SubmissionErrors] = issue.message
        }
      }
      setErrors(next)
      return
    }

    setPending(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPending(false)
    setDone(true)
  }

  if (done) {
    return (
      <div
        role="status"
        className="border-success/30 bg-success-subtle text-body-sm text-success rounded-md border px-4 py-3"
      >
        Submitted. A reviewer will look at it within three working days and you will get an email
        with the feedback.
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        id={`${taskId}-repoUrl`}
        label="GitHub repository"
        required
        help="Must be public so a reviewer can read it without a login."
        error={errors.repoUrl}
      >
        {(p) => (
          <Input
            {...p}
            type="url"
            placeholder="https://github.com/you/project-name"
            value={values.repoUrl}
            onChange={(e) => set('repoUrl', e.target.value)}
          />
        )}
      </Field>

      <Field
        id={`${taskId}-demoUrl`}
        label="Live demo"
        help="Optional, but it helps."
        error={errors.demoUrl}
      >
        {(p) => (
          <Input
            {...p}
            type="url"
            placeholder="https://your-project.vercel.app"
            value={values.demoUrl}
            onChange={(e) => set('demoUrl', e.target.value)}
          />
        )}
      </Field>

      <Field
        id={`${taskId}-notes`}
        label="Notes for the reviewer"
        help="Anything you want them to know — trade-offs you made, what you would do with more time."
        error={errors.notes}
      >
        {(p) => (
          <Textarea
            {...p}
            rows={4}
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        )}
      </Field>

      <Button type="submit" loading={pending} className="max-sm:w-full sm:self-start">
        {previous ? 'Resubmit task' : 'Submit task'}
      </Button>
    </form>
  )
}
