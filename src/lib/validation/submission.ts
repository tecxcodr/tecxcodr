import { z } from 'zod'

/**
 * Task submission — docs/06 §4.3, docs/01 FR-5.2.
 *
 * The repo URL is host-allowlisted rather than merely URL-shaped. Accepting
 * any URL here would mean reviewers opening arbitrary links from user input,
 * and it would let a submission point somewhere that is not reviewable code.
 */
export const submissionSchema = z.object({
  repoUrl: z
    .string()
    .trim()
    .min(1, 'Add the GitHub repository link for this task.')
    .refine(
      (v) => /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/i.test(v),
      'Use a GitHub repository URL, e.g. https://github.com/you/project-name',
    ),
  demoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === '' || /^https?:\/\/.+\..+/.test(v), 'Enter a full URL starting with https://'),
  notes: z
    .string()
    .trim()
    .max(2000, 'Keep notes under 2000 characters.')
    .optional()
    .default(''),
})

export type SubmissionInput = z.infer<typeof submissionSchema>
export type SubmissionErrors = Partial<Record<keyof SubmissionInput, string>>
