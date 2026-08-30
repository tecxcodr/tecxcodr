# Tecxcodr — Technical Requirements Document

**Version:** 1.0 (MVP) · **Date:** 2026-08-24
**Derives from:** [`00-PRODUCT-DECISIONS.md`](00-PRODUCT-DECISIONS.md) · **Implements:** [`01-PRD.md`](01-PRD.md)

---

## 1. Stack

| Layer | Choice | Version target |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| UI runtime | React | 19.x |
| Language | TypeScript, `strict: true` | 5.6+ |
| Styling | Tailwind CSS v4 + CSS custom properties | 4.x |
| Primitives | Radix UI (headless) — locally owned wrappers | latest |
| Database | Neon PostgreSQL (serverless) | PG 16 |
| ORM | Drizzle ORM + `drizzle-kit` | latest |
| DB driver | `@neondatabase/serverless` (HTTP) + `pg` pooled for scripts | latest |
| Auth | Better Auth + Drizzle adapter | latest |
| Validation | Zod | 3.x |
| Payments | Razorpay (Orders + Webhooks) | v1 API |
| Email | Resend + React Email | latest |
| Public media | Cloudinary | — |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) | — |
| Monitoring | Sentry + Vercel Analytics | — |
| Animation | GSAP 3 + ScrollTrigger + Lenis | 3.12+ |
| Fonts | `next/font` self-hosted: Space Grotesk, Inter, JetBrains Mono | — |
| Testing | Vitest (unit) · Playwright (E2E) | latest |
| Tooling | ESLint 9 flat config · Prettier · `tsc --noEmit` in CI | — |

## 2. Architecture decision: full-stack Next.js

**Decision: Option B — a single Next.js application. No separate Express service. Render is dropped.**

### Why not Option A (Next.js + Express on Render)

| Cost | Detail |
|---|---|
| Duplicated auth | Session validation must exist in two runtimes, or the frontend becomes a token-forwarding proxy — two ways to get auth wrong instead of one |
| CORS + cookie complexity | Cross-origin cookies need `SameSite=None; Secure` and a shared parent domain; a persistent source of bugs for zero functional gain |
| Cold starts where they hurt most | Render's free tier sleeps. A payment webhook arriving at a sleeping instance risks retry storms and delayed enrolments — the single most correctness-critical path in the product |
| Two deploys, two env sets | Doubles the surface for config drift on a solo build |
| Extra network hop | SSR data fetching becomes Vercel → Render → Neon instead of Vercel → Neon |
| No compensating benefit | Every MVP operation is short request/response CRUD. Nothing needs a long-lived process, a queue, or a socket |

### Why Option B wins here

One deploy, one env, one auth session, no CORS. Server Components read the database directly with zero client JS. Server Actions handle mutations with automatic CSRF protection and progressive enhancement. Route Handlers cover webhooks and non-form endpoints. Vercel's edge network serves the static marketing site.

### The seam that keeps Option C available

The thing that makes a monolith painful later is business logic embedded in framework code. So:

```
src/server/
  db/           # schema, migrations, client
  services/     # ALL business logic. Pure TS. No next/* imports. No React.
  repositories/ # data access. Returns domain types, never raw rows to routes.
  email/
  payments/
```

`services/` never imports from `next/*`, never touches `cookies()` or `headers()`, and receives an explicit actor context object. Consequences:

- Services are unit-testable without a server.
- The day sandboxed code execution needs a long-running worker, `services/` is lifted into a separate package unchanged and the worker imports it. That is Option C, reached without a rewrite.

**Revisit trigger:** any workload exceeding 10s, requiring a durable queue, sandboxed execution, or persistent connections. None exist in MVP.

## 3. Frontend architecture

### 3.1 Route groups

```
src/app/
  (marketing)/          # public. Static/ISR. Header+Footer, GSAP-enabled.
    page.tsx  programs/  how-it-works/  about/  faq/  contact/
    terms/  privacy/  refund-policy/
  (auth)/               # sign-in, sign-up, forgot, reset, verify. Minimal chrome.
  (student)/dashboard/  # authed STUDENT. Dynamic, no cache. No GSAP.
  (admin)/admin/        # authed ADMIN. Dynamic, noindex. No GSAP.
  verify/[code]/        # public, cached, indexable. Own minimal layout.
  api/
    auth/[...all]/      # Better Auth
    webhooks/razorpay/  # nodejs runtime, no body parsing before verification
    payments/order/     # POST, authed, rate-limited
    admin/export/       # CSV streams
```

Each group owns its own `layout.tsx`, `loading.tsx`, `error.tsx` and `not-found.tsx`. This is how the marketing bundle stays isolated from the dashboard bundle.

### 3.2 Server vs Client Components

Default is Server. A component becomes a Client Component only for: browser event handlers, `useState`/`useEffect`, GSAP/Lenis, Radix interactive primitives, the theme toggle, or the Razorpay checkout script.

**Rules:**
1. Push `"use client"` to the **leaf**. A page is never a Client Component.
2. Data fetching happens in Server Components; results pass down as serialisable props.
3. No client-side fetching for initial render anywhere in the app.
4. Animation wrappers are client islands that receive already-rendered `children` from the server — the animated content itself stays server-rendered, so it exists in the HTML for SEO and for no-JS/reduced-motion users.

### 3.3 Rendering strategy per route

| Route | Strategy | Revalidation |
|---|---|---|
| `/`, `/how-it-works`, `/about`, `/faq`, legal | Static | build-time |
| `/programs`, `/programs/[slug]` | Static + ISR | 3600s + on-demand `revalidatePath` on publish/edit |
| `/verify/[code]` | Dynamic + `revalidate: 300` per code | 300s, purged on revoke |
| `/dashboard/**`, `/admin/**` | Dynamic, `no-store` | never cached |
| `/contact` | Static shell + Server Action | — |

### 3.4 Directory layout

```
src/
  app/
  components/
    ui/          # primitives: button, input, card, badge, dialog, table…
    marketing/   # hero, program-card, process-timeline, faq-accordion…
    dashboard/   # status-timeline, task-card, submission-form…
    admin/       # review-queue, application-drawer, data-table…
    motion/      # client islands: <Reveal>, <SplitText>, <Magnetic>, <SmoothScroll>
  server/
    db/  services/  repositories/  email/  payments/  auth/
  lib/
    validation/  # Zod schemas, shared client+server
    utils/  constants/  errors.ts  result.ts
  content/       # FAQ, legal copy, program marketing content (typed constants/MDX)
  styles/
  types/
```

Hard rules: no file over ~300 lines; `components/ui/*` never imports from `server/*`; `server/services/*` never imports from `app/*` or `next/*`; feature logic lives in services, not in page files.

### 3.5 State management

No global state library. Server state lives on the server. URL state (filters, pagination, tabs) lives in `searchParams` via `nuqs` or plain `useSearchParams`. Form state uses `useActionState` with Server Actions. Theme uses `next-themes`. Ephemeral UI state uses `useState`.

## 4. Backend architecture

### 4.1 Layers

```
Route Handler / Server Action     ← auth check, Zod parse, actor context, error → response
        ↓
Service (src/server/services)     ← business rules, invariants, transactions, events
        ↓
Repository (src/server/repositories) ← Drizzle queries, returns domain types
        ↓
Drizzle → Neon Postgres
```

The route layer contains no `if` statement about business rules. The service layer contains no HTTP concepts.

### 4.2 Service contract

Every service function takes `(ctx: ActorContext, input: ValidatedInput)` and returns a `Result<T, AppError>` — errors are values, not exceptions, except for genuinely exceptional failures (DB down).

```ts
type ActorContext = {
  userId: string | null
  role: 'STUDENT' | 'ADMIN' | 'SYSTEM'
  requestId: string
}
```

`SYSTEM` is the actor for webhook and cron-initiated work, and is recorded as such in history and audit rows.

### 4.3 Server Actions vs Route Handlers

| Use a **Server Action** when | Use a **Route Handler** when |
|---|---|
| It's a form submission from our own UI | An external system calls it (webhooks) |
| It benefits from progressive enhancement | The response isn't a page update (CSV, JSON) |
| It's followed by `revalidatePath` | It's consumed by a third-party script (Razorpay order) |

Every Server Action independently re-checks auth and re-validates input. A Server Action is a public HTTP endpoint; being reachable only from our UI is not a security property.

### 4.4 Transactions

Operations that must be atomic run in a single transaction:
- webhook capture → `payments` update + `enrollments` insert + `applications` status + history + offer letter
- application submit → `applications` update + history + `student_profiles` upsert
- review action → `task_submissions` update + enrolment progress recompute
- certificate issue → `certificates` insert + audit row

Email is **never** inside a transaction — it is dispatched after commit.

## 5. Database architecture

Full schema in [`04-DATABASE-SCHEMA.md`](04-DATABASE-SCHEMA.md). Technical constraints:

- **Drizzle over Prisma.** No query-engine binary → materially smaller serverless cold starts; SQL-shaped API makes N+1 and missing-index problems visible at the call site rather than hidden behind a fluent builder; `drizzle-kit` generates plain SQL migrations that can be read and reviewed.
- **Connections.** Neon **pooled** connection string via `@neondatabase/serverless` HTTP driver for request-path queries. Direct connection only for migrations and seeds. Never open a raw TCP pool from a serverless function.
- **Migrations.** `drizzle-kit generate` → SQL committed to the repo → applied in CI before deploy. No `push` against production, ever.
- **Money.** `integer` minor units + `currency char(3)`. Never `float`, never `numeric` for currency.
- **Time.** `timestamptz`, always UTC, formatted to IST at render.
- **IDs.** UUID v7 (time-sortable, index-friendly) as primary keys. Public-facing codes are separate, opaque, non-sequential columns.
- **Soft delete.** `deleted_at` on `users`, `programs`, `program_tasks` only. Everything else is immutable history.
- **Enums.** Postgres native enums for closed sets. Adding a value is a migration — accepted, because it forces the code path to be considered.

## 6. Authentication & authorisation

### 6.1 Authentication — Better Auth

Chosen over hand-rolled because money is involved and session rotation, CSRF, password hashing parameters and account linking are all easy to get subtly wrong. Chosen over Auth.js v5 for its first-class Drizzle adapter, built-in email/password with verification, and built-in rate limiting.

- **Sessions:** database-backed, HTTP-only `Secure` `SameSite=Lax` cookie, 30-day expiry, rolling refresh.
- **Password hashing:** scrypt (library default). Never MD5/SHA/bcrypt-with-low-cost.
- **Providers:** Google, GitHub, email+password.
- **Account linking:** only on a *verified* matching email. This closes the pre-registration account-takeover hole.
- **Email verification:** required before payment (`FR-4`), not before applying.
- **Password reset:** single-use, 1-hour token, invalidates all sessions on use.

### 6.2 Authorisation — RBAC

Roles: `STUDENT`, `ADMIN` (live) · `REVIEWER`, `MENTOR` (defined, unassigned).

Three enforcement points, all required:
1. **`middleware.ts`** — coarse gate. `/dashboard/*` needs a session; `/admin/*` needs `role = ADMIN`. Cheap redirect only; never the sole check.
2. **Layout/page** — `requireUser()` / `requireAdmin()` at the top of every protected server file.
3. **Service layer** — every service asserts the actor's right to *this specific row*. `getApplication(ctx, id)` verifies `application.user_id === ctx.userId` unless the actor is admin.

Point 3 is the real security boundary. Points 1 and 2 are UX.

**Ownership rule:** no query may take an ID from user input without a corresponding ownership predicate in the `WHERE` clause. Not a filter after fetching — a predicate in the query.

### 6.3 Permission matrix

| Capability | Guest | Student | Reviewer* | Admin |
|---|:-:|:-:|:-:|:-:|
| View published programs | ✅ | ✅ | ✅ | ✅ |
| Verify a certificate | ✅ | ✅ | ✅ | ✅ |
| Submit contact form | ✅ | ✅ | ✅ | ✅ |
| Apply to a program | — | ✅ | ✅ | ✅ |
| View/edit own profile | — | ✅ | ✅ | ✅ |
| View own applications | — | ✅ | ✅ | ✅ |
| Create payment order (own, ACCEPTED) | — | ✅ | ✅ | ✅ |
| Submit a task (own ACTIVE enrolment) | — | ✅ | ✅ | ✅ |
| Download own certificate | — | ✅ | ✅ | ✅ |
| Review submissions | — | — | ✅ | ✅ |
| Accept/reject applications | — | — | — | ✅ |
| Program & task CRUD | — | — | — | ✅ |
| View payments ledger | — | — | — | ✅ |
| Issue/revoke certificates | — | — | — | ✅ |
| Export data | — | — | — | ✅ |

\* defined but unassigned in MVP

## 7. API strategy

Conventions, envelopes, error codes and the full endpoint surface are in [`06-API-DESIGN.md`](06-API-DESIGN.md). Principles:

- Server Actions are the default mutation transport; Route Handlers are the exception, used for external callers and non-page responses.
- All responses use a single envelope shape. All errors use a single machine-readable code taxonomy.
- Cursor pagination for anything that grows unbounded; offset pagination only in admin tables that need page numbers.
- No public REST API in MVP. Do not design one speculatively.

## 8. Caching strategy

| Layer | Mechanism | Applied to |
|---|---|---|
| CDN | Vercel edge, static + ISR | marketing routes, `/verify/[code]` |
| Data | `unstable_cache` with tags | program lists/details, tagged `programs`, `program:{slug}` |
| Request dedupe | React `cache()` | `getCurrentUser()` and other per-request lookups |
| Client router | Next router cache (default) | intra-app navigation |
| No cache | `no-store` | every `/dashboard/*` and `/admin/*` fetch |

**Invalidation:** program publish/edit → `revalidateTag('programs')` + `revalidatePath('/programs/[slug]')`. Certificate revoke → `revalidatePath('/verify/[code]')`. Nothing user-specific is ever cached at the CDN — enforced by never rendering user data on a cacheable route.

## 9. Error handling, validation, logging

### 9.1 Errors
A single `AppError` taxonomy with a stable `code`, an HTTP status, a **safe** user-facing message, and an optional internal detail that is logged but never serialised to the client. Uncaught errors return a generic message plus the `requestId`, and are reported to Sentry.

Every route/action is wrapped so that: expected failures → typed `Result` → mapped response; unexpected failures → logged with `requestId` → generic 500.

### 9.2 Validation
One Zod schema per operation in `lib/validation/`, imported by both the client form and the server handler. Zod runs at the server boundary on **every** input, including webhook bodies *after* signature verification and including anything read from `searchParams`. Environment variables are parsed by a Zod schema at module load; the app refuses to boot on a missing or malformed variable.

Specific validators: email normalised lowercase · phone as Indian 10-digit · graduation year bounded to `current_year ± 8` · GitHub URL host-allowlisted to `github.com` with an owner/repo path · all free text length-capped · all rich text escaped on render (no `dangerouslySetInnerHTML` on user input, ever).

### 9.3 Logging
Structured JSON to stdout. Every log line carries `requestId`, `userId` (or `anon`), `route`, `durationMs`.

**Never logged:** passwords, tokens, session cookies, full webhook payloads containing PII, phone numbers, Razorpay signatures. Emails are logged hashed or masked. A redaction helper is applied at the logger, not at each call site.

**Always logged:** every payment state transition, every webhook receipt (event ID + type + verification result), every admin mutation, every auth failure.

### 9.4 Monitoring
Sentry for client and server exceptions with `requestId` and release tagging, PII scrubbing on. Vercel Analytics for field Web Vitals. Two manual daily checks at launch: unprocessed `payment_events` rows, and submissions pending longer than the SLA.

## 10. Performance requirements

### 10.1 Budgets (enforced, not aspirational)

**Framework floor: ~103 KB.** React 19 + the Next.js App Router runtime is shipped on every route and cannot be removed short of a static export. Budgets are therefore expressed as *route delta over the shared baseline*, which is the only number a code change can actually move.

| Route class | Route delta | Total first load | LCP p75 mobile | INP p75 | CLS |
|---|---|---|---|---|---|
| Marketing | ≤ 55 KB | ≤ 160 KB | ≤ 2.0 s | ≤ 200 ms | ≤ 0.05 |
| `/verify/[code]` | ≤ 12 KB | ≤ 115 KB | ≤ 1.2 s | ≤ 200 ms | ≤ 0.02 |
| Auth | ≤ 25 KB | ≤ 130 KB | ≤ 1.5 s | ≤ 200 ms | ≤ 0.05 |
| Dashboard | ≤ 45 KB | ≤ 150 KB | ≤ 2.0 s | ≤ 200 ms | ≤ 0.05 |
| Admin | ≤ 100 KB | ≤ 205 KB | — | ≤ 200 ms | — |

CI fails the build if a route's first-load JS regresses more than 10 KB against the baseline.

**Measured at MVP frontend completion:** shared 103 KB · `/` 125 KB · `/programs` 115 KB · `/programs/[slug]` 107 KB · `/contact` 117 KB · `/verify` 103 KB · `/verify/[code]` 106 KB. All inside budget. GSAP is lazily imported (`src/lib/motion/gsap.ts`) — importing it statically put the homepage at 168 KB, over budget, which is the specific regression this rule exists to catch.

### 10.2 Frontend tactics
Server Components by default · `next/font` self-hosted with `display: swap` and preload of the two above-the-fold faces only · `next/image` with explicit dimensions and AVIF/WebP · GSAP dynamically imported inside client islands, never in the root layout · Lenis instantiated only on marketing routes · Radix components imported per-component, never barrel-imported · no icon library barrel imports (`lucide-react` tree-shaken per icon) · route-group-scoped layouts so the dashboard never pays for marketing code.

### 10.3 Animation performance
Animate only `transform` and `opacity`. Never `width`, `height`, `top`, `left`, `box-shadow`, or `filter` in a scroll-linked tween. `will-change` applied on animation start and removed on complete. All scroll work goes through ScrollTrigger's batched RAF — no bare `scroll` listeners. All reveal animations reserve their final space so nothing shifts layout. `gsap.matchMedia()` disables or simplifies every scroll-linked effect below 768px and under `prefers-reduced-motion: reduce`.

### 10.4 Backend tactics & complexity
Documented per-query in [`04-DATABASE-SCHEMA.md`](04-DATABASE-SCHEMA.md) §7. Rules:
- Every foreign key used in a `WHERE` or `JOIN` is indexed.
- Composite indexes ordered by selectivity, matching the actual query's predicate order.
- N+1 is forbidden: joins or a single `IN` batch, never a loop of queries. Code review checks for `await` inside `.map()` over DB calls.
- Every list query has `LIMIT`. No exceptions.
- Aggregates on the admin overview are indexed `COUNT(*)` with a predicate, not full scans.
- Progress is computed by a single aggregate query, not by loading all submissions into memory.

Target: p95 server response ≤ 300 ms for dashboard routes, ≤ 150 ms for cached marketing routes.

## 11. Security requirements

| Area | Requirement |
|---|---|
| Transport | HTTPS everywhere, HSTS with preload |
| Headers | CSP with nonces — `script-src 'self' 'nonce-…' https://checkout.razorpay.com`, `frame-src https://api.razorpay.com https://checkout.razorpay.com` (the checkout renders in an iframe), `connect-src 'self' https://*.razorpay.com https://*.sentry.io`, `img-src 'self' data: https://res.cloudinary.com`. Plus `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/mic/geo |
| Sessions | HTTP-only, `Secure`, `SameSite=Lax`, DB-backed, rotated on privilege change, invalidated on password reset |
| CSRF | Server Actions carry framework CSRF protection; the webhook route is exempt by design and protected by HMAC signature instead |
| SQL injection | Drizzle parameterised queries only. Raw SQL requires a reviewed `sql` template with bound params |
| XSS | React escaping. `dangerouslySetInnerHTML` is banned on any user-supplied content; admin-authored markdown is sanitised through an allowlist |
| Authorisation | Row-level ownership predicate in every query (§6.2) |
| Rate limiting | sign-in 5/min/IP · sign-up 3/hour/IP · password reset 3/hour/email · contact 3/hour/IP · application submit 5/hour/user · payment order 10/hour/user |
| Webhooks | HMAC-SHA256 over the **raw** body, timing-safe comparison, event-ID replay protection, 5-minute timestamp tolerance |
| Payments | Amount always server-derived; client-supplied amounts rejected; `key_secret` server-only; enrolment created only by verified webhook |
| Secrets | Vercel encrypted env vars; nothing sensitive prefixed `NEXT_PUBLIC_`; no secrets in the repo; distinct keys per environment |
| Input | Zod on every boundary; length caps on all text; URL host allowlists |
| Enumeration | Auth responses are non-committal about whether an email exists; certificate codes are high-entropy and non-sequential |
| Admin | Every mutation writes an audit row with actor, entity, diff and hashed IP |
| Dependencies | `npm audit` + Dependabot in CI; no unaudited transitive additions for trivial utilities |
| Privacy | Soft delete preserves certificate verifiability; documented in the Privacy policy |

## 12. Deployment strategy

### 12.1 Environments
| Env | App | DB | Payments | Email |
|---|---|---|---|---|
| Local | `next dev` | Neon dev branch | Razorpay test | Resend test / console |
| Preview | Vercel preview per PR | Neon preview branch | Razorpay test | Resend test |
| Production | Vercel prod | Neon main | Razorpay live | Resend prod |

Neon database branching gives every PR an isolated database. Preview deployments are `noindex` and never receive live webhooks.

### 12.2 Environment variables

```
DATABASE_URL                  # Neon pooled
DATABASE_URL_UNPOOLED         # migrations/seeds only
BETTER_AUTH_SECRET
BETTER_AUTH_URL
GOOGLE_CLIENT_ID / _SECRET
GITHUB_CLIENT_ID / _SECRET
RAZORPAY_KEY_ID / _KEY_SECRET / _WEBHOOK_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID   # publishable, safe
RESEND_API_KEY
EMAIL_FROM / EMAIL_ADMIN
CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET
UPSTASH_REDIS_REST_URL / _TOKEN
SENTRY_DSN / SENTRY_AUTH_TOKEN
CRON_SECRET
NEXT_PUBLIC_APP_URL
```

All parsed through a Zod schema in `src/lib/env.ts` at boot. Missing or malformed → the process refuses to start. Client-safe and server-only variables are exported as two separate objects so a server secret cannot be imported into a client component.

### 12.3 Pipeline
PR → CI (`lint`, `tsc --noEmit`, `vitest`, `build`, bundle budget) → Vercel preview on a Neon branch → review → merge → migrations applied → production deploy. Rollback is a Vercel instant rollback plus, if a migration is involved, a forward-fix migration. **All migrations must be backward-compatible with the previously deployed code** (expand → migrate → contract), because Vercel deploys are not atomic with the database.

### 12.4 Scheduled jobs (Vercel Cron)
| Job | Schedule | Purpose |
|---|---|---|
| `expire-applications` | daily 02:00 IST | `ACCEPTED` + unpaid > 14 days → `EXPIRED` |
| `expire-enrollments` | daily 02:15 IST | `ends_at` passed → `EXPIRED` |
| `reconcile-payments` | hourly | `payments` stuck `PENDING` > 30 min → query Razorpay, settle |
| `nudge-inactive` | daily 10:00 IST | day-3 enrolments with zero submissions → nudge email |
| `review-sla-alert` | daily 09:00 IST | submissions pending > 3 business days → admin alert |
| `reconcile-counters` | weekly Sun 03:00 IST | verify `enrollments.approved_required_count` against actual approvals (`04` Q11); alert on divergence |

All cron routes authenticate a `CRON_SECRET` bearer token and are idempotent.

### 12.5 Backups & continuity
Neon PITR (7-day retention on the paid tier — **required before taking live payments**). Weekly `pg_dump` to off-provider storage. Razorpay dashboard is the independent record of truth for money; the `reconcile-payments` job is the mechanism for detecting divergence.

## 13. Testing

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | services (state machines, eligibility, progress), Zod schemas, utils |
| Integration | Vitest + Neon test branch | repositories, transactions, constraint enforcement |
| E2E | Playwright | the four critical flows below |
| Accessibility | `axe-core` in Playwright | every public page + all forms |
| Performance | Lighthouse CI | marketing + verify routes, budget-gated |

**E2E flows (must pass before any deploy):**
1. **Application** — browse → apply → validate → submit → confirmation → status visible
2. **Payment** — accepted → order → mocked webhook → enrolment exists → offer letter issued → **duplicate webhook is a no-op**
3. **Auth** — sign up → verify → sign in → protected route → sign out → expired session redirect
4. **Admin** — admin sign in → publish program → accept application → review submission → issue certificate → verify page resolves

Additionally required as unit tests: every invalid application state transition is rejected; a student cannot read another student's application, submission, payment or certificate.

## 14. Decision log

| # | Decision | Alternatives rejected | Reason |
|---|---|---|---|
| D1 | Full-stack Next.js | Express on Render; hybrid | No MVP workload justifies a second service; cold starts on the webhook path are a correctness risk; §2 seam preserves the exit |
| D2 | Drizzle | Prisma | No engine binary → faster cold starts; SQL-shaped API surfaces N+1 and index gaps; reviewable SQL migrations |
| D3 | Better Auth | Auth.js v5; hand-rolled | Drizzle-native, batteries-included verification and rate limiting; hand-rolling auth next to a payment system is unjustifiable risk |
| D4 | GSAP only | GSAP + Motion; Motion only | Two animation runtimes for one job is ~40–60 KB of duplicated capability; GSAP + ScrollTrigger covers scroll, timeline and text work in one library |
| D5 | Server Actions default | tRPC; REST-everything | No separate client needs the API; Actions give CSRF and progressive enhancement free |
| D6 | Webhook-as-truth | Client callback confirmation | The client is untrusted and unreliable; this is the one place a shortcut becomes fraud |
| D7 | No file uploads in MVP | Resume PDF upload | Removes AV scanning, storage abuse, and private-delivery complexity for a field that URLs already cover |
| D8 | Repo-based FAQ/legal content | CMS; DB tables | Zero infra, version-controlled, reviewable; one fewer admin screen |
| D9 | UUID v7 PKs | bigserial; UUID v4 | Non-enumerable like v4, index-locality like serial |
| D10 | Integer minor units | numeric/decimal | Eliminates float and rounding classes of bug entirely |
| D11 | Radix + owned wrappers | A full component library | Full control of the black-and-white system with no theme-fighting; accessibility solved by Radix |
| D12 | Drop Render | Keep as originally proposed | Nothing left to host there once D1 is taken |
