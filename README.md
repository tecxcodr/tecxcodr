# Tecxcodr

Developer-native virtual internship platform. Students apply free, get accepted, enrol, build three real projects to a written spec, get their code reviewed by a human, and earn a certificate anyone can verify at a public URL.

> **Status: frontend complete, backend not started.** Every screen is built and works, but nothing persists. See [Current status](#current-status) before assuming a button does what it says.

---

## Table of contents

- [Current status](#current-status)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Design system](#design-system)
- [Performance budgets](#performance-budgets)
- [Documentation](#documentation)
- [Conventions](#conventions)
- [What's next](#whats-next)

---

## Current status

The entire user-facing frontend is built against **typed mock data** whose shapes mirror the database schema in [`docs/04-DATABASE-SCHEMA.md`](docs/04-DATABASE-SCHEMA.md) exactly. Wiring the real backend is a data-source swap, not a component rewrite.

### Works today

- All marketing pages, fully responsive, light + dark themes
- Certificate verification with all three states (valid / revoked / not found)
- Three-step application flow with real per-step validation and localStorage autosave
- Student dashboard: applications with status timelines, enrolment with task cards, payments, certificates, profile
- Auth screens: sign in, sign up, forgot password, reset password, verify email

### Not wired up

Everything below validates correctly and returns the real success/error shape, but **does not persist**. Each has a `TODO(backend)` comment naming the exact server action from [`docs/06-API-DESIGN.md`](docs/06-API-DESIGN.md).

| Area | State |
|---|---|
| Authentication | No sessions, no guards. `/dashboard` is publicly reachable. |
| Application submit | Validates, clears the draft, shows confirmation. Creates nothing. |
| Task submission | Validates the GitHub URL, reports success. Stores nothing. |
| Profile save | Local state only. |
| Payments | Buttons are visibly `disabled`. No Razorpay integration. |
| Contact form | Validates and says "sent". Sends nothing. |
| OAuth | Buttons visibly `disabled`. |
| Emails, certificates, receipts | Not implemented. |

Controls that cannot work yet are rendered **disabled with a visible label** rather than faked. A button that looks live and silently does nothing is worse than one that admits it isn't ready.

### Also worth knowing

- **Legal pages are drafts.** `/terms`, `/privacy` and `/refund-policy` describe how the product actually works but have not been reviewed by a lawyer. Each renders a visible warning banner.
- **Task content is placeholder-quality.** The six programs in `src/content/programs.ts` have real, complete task briefs, but they have not been validated by anyone who will actually review submissions.
- **Nothing has been visually reviewed at scale.** Layout and spacing have been verified structurally, not by eye across every breakpoint.

---

## Getting started

**Prerequisites:** Node.js 22+ and pnpm 10+.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

No environment variables are needed yet — there is no database, no auth provider and no payment gateway. `.env` handling arrives with the backend (the full list is in [`docs/02-TRD.md`](docs/02-TRD.md) §12.2).

> **Note:** don't run `pnpm build` while `pnpm dev` is running. Both write to `.next/` and the build will corrupt the dev server's state, producing 500s on every route. Stop the dev server first.

---

## Scripts

| Script | Does |
|---|---|
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier over `src/` |

All three of `lint`, `typecheck` and `build` must pass before a commit.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19 | Server Components mean most pages ship almost no JS |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` | No `any`, enforced by lint |
| Styling | Tailwind CSS v4 + CSS custom properties | Semantic tokens; no hardcoded colours in components |
| Animation | GSAP + ScrollTrigger + Lenis | One library, not three. Lazily imported, marketing routes only |
| Validation | Zod | One schema per operation, shared by client form and server handler |
| Theming | next-themes | Blocking inline script, no flash of wrong theme |
| Icons | lucide-react | Tree-shaken per icon |
| Primitives | Radix (accordion, slot) + owned wrappers | Only where a control genuinely needs managed state |

**Planned but not installed:** Drizzle ORM, Neon Postgres, Better Auth, Razorpay, Resend, Cloudinary, Sentry, Upstash. Argued in [`docs/02-TRD.md`](docs/02-TRD.md).

Dependencies are added when a component needs them, not in advance. Radix Select and Radix Checkbox were both installed, then replaced with styled native controls once measurement showed they cost bundle for capability those controls never used.

---

## Project structure

```
docs/                       Product + technical documentation (read 00 first)
src/
  app/
    (marketing)/            Public site. Static/ISR. Header + footer, GSAP enabled.
    (auth)/                 Sign in / up / reset / verify. Minimal chrome.
    (student)/              Dashboard. Authed (eventually). Zero animation JS.
    apply/[slug]/           Focused application flow. Own chrome.
    verify/[code]/          Public certificate verification. Own minimal layout.
  components/
    ui/                     Primitives: button, input, field, badge, select…
    marketing/              Hero, program cards, sections
    dashboard/              Nav, task cards, status timeline, submission form
    apply/                  The three application steps
    auth/                   Auth shell, OAuth buttons
    motion/                 Client islands: Reveal, Magnetic, CountUp, TypingLines
    providers/              Theme provider
  content/                  Typed content + mock data (programs, FAQ, certificates)
  lib/
    validation/             Zod schemas
    motion/                 GSAP lazy loader + motion config
    constants/              Site config, navigation
    utils/                  cn(), formatters
  styles/tokens.css         The entire colour + type + motion token layer
  types/                    Domain types mirroring docs/04
```

**Rules:** `components/ui/*` never imports from `server/*` and never fetches. Animation lives only in `components/motion/*`. No file over ~300 lines.

---

## Routes

25 pages, 36 routes including generated ones.

**Marketing** — `/` · `/programs` · `/programs/[slug]` · `/how-it-works` · `/about` · `/faq` · `/contact` · `/terms` · `/privacy` · `/refund-policy`

**Public verification** — `/verify` · `/verify/[code]`

**Application flow** — `/apply/[slug]`

**Auth** — `/sign-in` · `/sign-up` · `/forgot-password` · `/reset-password` · `/verify-email`

**Dashboard** — `/dashboard` · `/dashboard/applications` · `/dashboard/internships` · `/dashboard/internships/[id]` · `/dashboard/payments` · `/dashboard/certificates` · `/dashboard/profile`

### Try these states

The mock data deliberately covers the awkward cases, not just the happy path:

```
/verify/TCX-2609-7QK4M2XR     valid certificate
/verify/TCX-2608-3JH9WD5N     revoked certificate
/verify/ANYTHING-ELSE         not found
/dashboard/applications       accepted-unpaid, rejected-with-reason, and draft states
/dashboard/internships/enr_demo_1   approved task, changes-requested task, untouched task
/dashboard/payments           one paid, one failed
/reset-password               dead-link state (no token)
/reset-password?token=abc     the actual form
```

---

## Design system

Full spec in [`docs/03-DESIGN-SYSTEM.md`](docs/03-DESIGN-SYSTEM.md). The essentials:

**Colour.** Every colour is consumed through a semantic token defined once in `src/styles/tokens.css`. A hex code in a component file is a review failure. Chromatic colour is reserved for status — never decorative. Dark is the primary theme; light is designed independently, not inverted.

**Typography — the two-layer rule.** Space Grotesk for display, Inter for body, and JetBrains Mono for a "machine layer": section indices (`[03]`), eyebrows, metadata, counts, IDs, timestamps. The mono layer is what makes the product feel developer-native. It is never used for sentences.

**Motion.** Animation communicates or it is deleted. Only `transform` and `opacity`. Reduced motion means *removed*, not shortened — verified in JS as well as CSS, because the CSS override does not stop GSAP registering ScrollTriggers. Dashboards ship zero animation JS.

**Every interactive component defines all seven states**: default, hover, active, focus-visible, disabled, loading, error. Every data surface ships designed loading, empty and error states.

**Accessibility target: WCAG 2.2 AA.** Semantic HTML first, visible focus rings never removed, colour never the sole carrier of meaning, 44px touch targets, errors announced and tied to their field.

---

## Performance budgets

Enforced, not aspirational. React + the App Router runtime is a ~103 kB floor on every route, so budgets are expressed as **route delta over that baseline**.

| Route class | Total budget | Current worst |
|---|---|---|
| Marketing | ≤ 160 kB | 125 kB (`/`) |
| `/verify/[code]` | ≤ 115 kB | 106 kB |
| Auth | ≤ 135 kB | 134 kB (`/sign-up`) |
| Dashboard | ≤ 150 kB | 137 kB (`/dashboard/profile`) |

Three regressions this rule has already caught, all recorded with reasoning in [`docs/02-TRD.md`](docs/02-TRD.md) §10.1:

- GSAP imported statically put `/` at 168 kB → made lazy via `src/lib/motion/gsap.ts`
- Radix Select put `/apply/[slug]` at 167 kB → styled native `<select>`
- Radix Checkbox put `/sign-up` at 139 kB → styled native checkbox

---

## Documentation

Written before implementation. `00` is the source of truth; everything else derives from it, and a change there must propagate.

| Doc | Contents |
|---|---|
| [`00-PRODUCT-DECISIONS.md`](docs/00-PRODUCT-DECISIONS.md) | Every locked decision, open blockers, milestones. **Read this first.** |
| [`01-PRD.md`](docs/01-PRD.md) | Personas, MVP scope, features, user stories, edge cases, metrics |
| [`02-TRD.md`](docs/02-TRD.md) | Stack, architecture argument, security, budgets, deployment, decision log |
| [`03-DESIGN-SYSTEM.md`](docs/03-DESIGN-SYSTEM.md) | Tokens, typography, component specs, motion, accessibility |
| [`04-DATABASE-SCHEMA.md`](docs/04-DATABASE-SCHEMA.md) | 17 tables, indexes, state machines, queries with complexity |
| [`05-SYSTEM-ARCHITECTURE.md`](docs/05-SYSTEM-ARCHITECTURE.md) | Request lifecycle, payment/auth/delivery flows, failure modes |
| [`06-API-DESIGN.md`](docs/06-API-DESIGN.md) | Route handlers, server actions, error taxonomy |
| [`07-ARCHITECTURE-REVIEW.md`](docs/07-ARCHITECTURE-REVIEW.md) | Cross-document audit: contradictions, risks, recommendations |

---

## Conventions

Non-negotiables from [`docs/00-PRODUCT-DECISIONS.md`](docs/00-PRODUCT-DECISIONS.md) §7, listed here because they are easy to break by accident:

1. **The payment webhook is the only thing that may create an enrolment.** Not a client callback, not an admin shortcut.
2. **Every application state change writes to `application_status_history`.** No silent mutations — that table is also the student-facing timeline.
3. **Money is integer minor units** (paise) with an explicit currency column. Never floats.
4. **Every list is paginated.** No unbounded `SELECT *`.
5. **All external input is validated with Zod at the server boundary**, including webhook bodies after signature verification.
6. **No `any`.** Use `unknown` and narrow at the boundary.
7. **Every animation respects `prefers-reduced-motion`** and is skipped, not merely shortened.
8. **Legal pages ship before payments are activated** — the gateway requires them live.

Plus: row ownership is a predicate **inside** the query, never a filter applied after fetching.

---

## What's next

Ordered by what actually blocks launch. Milestones and gates are in [`docs/00-PRODUCT-DECISIONS.md`](docs/00-PRODUCT-DECISIONS.md) §8.

**Blocked on things outside this repo:**

1. **Registered business entity + PAN + bank account** — Razorpay onboarding takes days to weeks and gates all payment work. Zero engineering dependency; start it in parallel.
2. **Real task content** — three complete briefs per program, validated by whoever will review submissions. A polished funnel in front of thin content is the most likely way this fails.

**Engineering, in order:**

3. Database — Drizzle schema, Neon, migrations, seed
4. Auth — Better Auth, sessions, route guards, RBAC
5. Application flow backend — draft persistence, submit, admin decisioning
6. Payments — Razorpay orders, webhook-as-truth, enrolment creation
7. Delivery — submissions, admin review queue, certificates + issuance
8. Hardening — rate limits, Sentry, E2E on the four critical flows, accessibility audit

Admin dashboard screens are specced in [`docs/01-PRD.md`](docs/01-PRD.md) §7.6 and not yet built.

---

## Licence

Private and unlicensed. All rights reserved.
