'use client'

import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { MonoLabel } from '@/components/ui/mono-label'
import {
  COMMON_SKILLS,
  EXPERIENCE_OPTIONS,
  type ApplicationDraft,
  type FieldErrors,
} from '@/lib/validation/application'
import { cn } from '@/lib/utils/cn'

/**
 * Step 2 — technical profile.
 *
 * Skills are chips rather than a free-text tag input: the values end up in a
 * `text[]` column that admin will eventually filter on (docs/04 §5.3), and
 * free text produces "React", "react", "ReactJS" and "React.js" as four
 * distinct skills.
 */
export function StepTechnical({
  draft,
  errors,
  suggestedSkills,
  onChange,
}: {
  draft: ApplicationDraft
  errors: FieldErrors
  /** The program's own stack, surfaced first. */
  suggestedSkills: string[]
  onChange: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void
}) {
  const selected = draft.primarySkills ?? []

  // Program stack first, then the general list, de-duplicated.
  const skills = Array.from(new Set([...suggestedSkills, ...COMMON_SKILLS]))

  const toggleSkill = (skill: string) => {
    const next = selected.includes(skill)
      ? selected.filter((s) => s !== skill)
      : [...selected, skill]
    onChange('primarySkills', next)
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <MonoLabel as="p" tone="subtle">
          [ experience ]
        </MonoLabel>

        <fieldset
          aria-describedby={errors.experienceLevel ? 'experienceLevel-error' : undefined}
          aria-invalid={errors.experienceLevel ? true : undefined}
        >
          <legend className="text-body-sm text-fg mb-3 font-medium">
            How would you describe yourself?
            <span className="text-fg-subtle ml-1" aria-hidden>
              *
            </span>
          </legend>

          <div className="grid gap-3">
            {EXPERIENCE_OPTIONS.map((option) => {
              const active = draft.experienceLevel === option.value
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer gap-3 rounded-md border p-4',
                    'transition-colors duration-[--duration-instant]',
                    active
                      ? 'border-fg bg-surface'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={option.value}
                    checked={active}
                    onChange={() => onChange('experienceLevel', option.value)}
                    className="mt-1 size-[18px] shrink-0 accent-[var(--accent)]"
                  />
                  <span>
                    <span className="text-body-sm text-fg block font-medium">{option.label}</span>
                    <span className="text-caption text-fg-muted mt-0.5 block">{option.hint}</span>
                  </span>
                </label>
              )
            })}
          </div>

          {errors.experienceLevel && (
            <p id="experienceLevel-error" className="text-caption text-destructive mt-2">
              {errors.experienceLevel}
            </p>
          )}
        </fieldset>
      </section>

      <section className="flex flex-col gap-4">
        <MonoLabel as="p" tone="subtle">
          [ skills ]
        </MonoLabel>

        <div
          role="group"
          aria-labelledby="skills-legend"
          aria-describedby={errors.primarySkills ? 'skills-error' : 'skills-help'}
        >
          <p id="skills-legend" className="text-body-sm text-fg font-medium">
            What can you already work with?
            <span className="text-fg-subtle ml-1" aria-hidden>
              *
            </span>
          </p>
          <p id="skills-help" className="text-caption text-fg-muted mt-1">
            Pick only what you would be comfortable being tested on. Up to 12.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => {
              const active = selected.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex h-8 items-center rounded-md border px-3',
                    'font-mono text-mono-label',
                    'transition-colors duration-[--duration-instant]',
                    active
                      ? 'bg-accent text-accent-fg border-transparent'
                      : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                  )}
                >
                  {skill}
                </button>
              )
            })}
          </div>

          <MonoLabel as="p" tone="subtle" className="mt-3 block" aria-live="polite">
            {selected.length} selected
          </MonoLabel>

          {errors.primarySkills && (
            <p id="skills-error" className="text-caption text-destructive mt-2">
              {errors.primarySkills}
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <MonoLabel as="p" tone="subtle">
          [ links ]
        </MonoLabel>

        <Field
          id="githubUrl"
          label="GitHub profile"
          help="Optional, but it is the single most useful thing you can give a reviewer."
          error={errors.githubUrl}
        >
          {(p) => (
            <Input
              {...p}
              type="url"
              placeholder="https://github.com/yourname"
              value={draft.githubUrl ?? ''}
              onChange={(e) => onChange('githubUrl', e.target.value)}
            />
          )}
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field id="linkedinUrl" label="LinkedIn" error={errors.linkedinUrl}>
            {(p) => (
              <Input
                {...p}
                type="url"
                placeholder="https://linkedin.com/in/you"
                value={draft.linkedinUrl ?? ''}
                onChange={(e) => onChange('linkedinUrl', e.target.value)}
              />
            )}
          </Field>

          <Field id="portfolioUrl" label="Portfolio or site" error={errors.portfolioUrl}>
            {(p) => (
              <Input
                {...p}
                type="url"
                placeholder="https://yoursite.com"
                value={draft.portfolioUrl ?? ''}
                onChange={(e) => onChange('portfolioUrl', e.target.value)}
              />
            )}
          </Field>
        </div>
      </section>
    </div>
  )
}
