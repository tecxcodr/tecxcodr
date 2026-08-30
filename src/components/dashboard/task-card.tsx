import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MonoLabel } from '@/components/ui/mono-label'
import { StatusBadge } from '@/components/ui/status-badge'
import { SubmissionForm } from '@/components/dashboard/submission-form'
import { canSubmit, type Enrollment, type EnrollmentTask } from '@/types/enrollment'
import { formatDate, pad2 } from '@/lib/utils/format'

/**
 * One task, with its brief, requirements, latest review and the submit form.
 *
 * A server component wrapping a small client form — the brief and feedback are
 * static content and should not cost JS to render.
 */
export function TaskCard({
  enrollment,
  task,
}: {
  enrollment: Enrollment
  task: EnrollmentTask
}) {
  const latest = task.latestSubmission
  const submittable = canSubmit(enrollment, task)
  const approved = latest?.status === 'APPROVED'

  return (
    <article className="border-border bg-surface rounded-md border">
      <header className="border-border flex flex-wrap items-center gap-3 border-b px-5 py-4 md:px-6">
        <MonoLabel tone="subtle">task {pad2(task.position)}</MonoLabel>
        <MonoLabel tone="subtle">~{task.estimatedHours}h</MonoLabel>
        {task.isRequired ? <Badge tone="info">Required</Badge> : <Badge>Optional</Badge>}
        <div className="ml-auto">
          {latest ? <StatusBadge status={latest.status} /> : <Badge>Not started</Badge>}
        </div>
      </header>

      <div className="px-5 py-6 md:px-6">
        <h3 className="text-h3">{task.title}</h3>
        <p className="text-body text-fg-muted mt-3 max-w-prose">{task.brief}</p>

        <MonoLabel as="p" className="mt-6 mb-3">
          requirements
        </MonoLabel>
        <ul className="flex flex-col gap-2">
          {task.requirements.map((req) => (
            <li key={req} className="text-body-sm text-fg-muted flex gap-3">
              <span aria-hidden className="text-fg-subtle shrink-0 font-mono select-none">
                —
              </span>
              {req}
            </li>
          ))}
        </ul>

        {latest && (
          <div className="border-border mt-6 border-t pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <MonoLabel tone="subtle">
                attempt {pad2(latest.attempt)} · submitted {formatDate(latest.submittedAt)}
              </MonoLabel>
              <a
                href={latest.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-fg-muted hover:text-fg inline-flex items-center gap-1.5 underline underline-offset-4"
              >
                {latest.repoUrl.replace('https://github.com/', '')}
                <ExternalLink aria-hidden className="size-3" />
              </a>
            </div>

            {latest.feedback && (
              <div className="border-border bg-bg-subtle mt-4 rounded-md border p-4">
                <MonoLabel as="p" tone="subtle" className="mb-2">
                  reviewer feedback
                  {latest.reviewedAt && ` · ${formatDate(latest.reviewedAt)}`}
                </MonoLabel>
                <p className="text-body-sm text-fg-muted">{latest.feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="border-border mt-6 border-t pt-6">
          {approved ? (
            <p className="text-body-sm text-fg-muted">
              This task is approved and counts toward your certificate. Nothing more to do here.
            </p>
          ) : submittable ? (
            <SubmissionForm taskId={task.id} previous={latest} />
          ) : latest ? (
            <p className="text-body-sm text-fg-muted">
              Waiting on review. You will get an email within three working days — you cannot
              resubmit until then.
            </p>
          ) : (
            <p className="text-body-sm text-fg-muted">
              This enrolment is no longer active, so submissions are closed.
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
