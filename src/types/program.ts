/**
 * Shapes mirror docs/04-DATABASE-SCHEMA.md §5.4 and §5.5 exactly.
 *
 * The marketing site currently reads these from typed constants in
 * src/content. When the database lands, only the data source changes — the
 * repository returns these same types and no component is touched.
 */

export type ProgramDomain =
  | 'WEB_DEVELOPMENT'
  | 'PYTHON'
  | 'JAVA'
  | 'DATA_SCIENCE'
  | 'ANDROID'
  | 'CPP_DSA'

export type ProgramLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export type ProgramStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface ProgramTask {
  id: string
  position: number
  title: string
  /** Short brief shown publicly on the program page, before payment. */
  brief: string
  /** Bullet requirements — the acceptance criteria a reviewer checks against. */
  requirements: string[]
  estimatedHours: number
  isRequired: boolean
}

export interface Program {
  id: string
  slug: string
  title: string
  tagline: string
  summary: string
  domain: ProgramDomain
  level: ProgramLevel
  durationWeeks: number
  totalTaskCount: number
  requiredTaskCount: number
  /** Minor units (paise). Never a float. docs/04 §1. */
  priceAmountMinor: number
  currency: 'INR'
  status: ProgramStatus
  sortOrder: number
  /** Technologies a student will touch — display only, not a filter. */
  stack: string[]
  tasks: ProgramTask[]
}

export const DOMAIN_LABEL: Record<ProgramDomain, string> = {
  WEB_DEVELOPMENT: 'Web Development',
  PYTHON: 'Python',
  JAVA: 'Java',
  DATA_SCIENCE: 'Data Science',
  ANDROID: 'Android',
  CPP_DSA: 'C++ & DSA',
}

export const LEVEL_LABEL: Record<ProgramLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}
