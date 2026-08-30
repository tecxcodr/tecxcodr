# Tecxcodr — API & Backend Design

**Version:** 1.0 (MVP) · **Date:** 2026-08-24
**Derives from:** [`02-TRD.md`](02-TRD.md) · [`04-DATABASE-SCHEMA.md`](04-DATABASE-SCHEMA.md) · [`05-SYSTEM-ARCHITECTURE.md`](05-SYSTEM-ARCHITECTURE.md)

---

## 1. Transport model

Tecxcodr has no public REST API in MVP, and none is designed speculatively. The only consumer of the backend is the Tecxcodr frontend, plus two external callers (Razorpay, Vercel Cron). So the surface is split by *who calls it*:

| Transport | Used when | Count |
|---|---|---|
| **Server Component read** | Any data needed for initial render | ~20 |
| **Server Action** | Any mutation originating in our own UI | ~28 |
| **Route Handler** (`/api/*`) | External callers, non-page responses, third-party-consumed endpoints | 9 |

Building REST endpoints for operations only our own forms invoke would mean hand-writing serialisation, client fetch wrappers, loading state and CSRF handling that Server Actions provide for free — while producing a public attack surface with no consumer.

**A Server Action is a public HTTP endpoint.** Every one independently re-checks authentication, re-validates input with Zod, and authorises the specific row. Being reachable only from our UI is not a security property (`02-TRD` §4.3).

---

## 2. Conventions

### 2.1 Naming
Server Actions are verb-first and domain-scoped: `submitApplication`, `decideApplication`, `createPaymentOrder`, `reviewSubmission`, `issueCertificate`. Route Handlers use resource paths: `/api/webhooks/razorpay`, `/api/admin/export/applications`.

### 2.2 Result envelope
Every Server Action returns a discriminated union. Never a bare value, never a thrown error for an expected failure.

```ts
type ActionResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: ErrorCode; message: string; fields?: Record<string, string[]> } }
```

Route Handlers return the JSON equivalent with an appropriate status:
```jsonc
// 200
{ "ok": true, "data": { } }
// 4xx / 5xx
{ "ok": false, "error": { "code": "APPLICATION_NOT_ACCEPTED", "message": "…", "requestId": "req_01J…" } }
```

`message` is always safe to display to an end user. Internal detail is logged against `requestId` and never serialised.

### 2.3 Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHENTICATED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Authenticated, not permitted |
| `NOT_FOUND` | 404 | Missing, or not visible to this actor |
| `VALIDATION_FAILED` | 422 | Zod failure; `fields` populated |
| `RATE_LIMITED` | 429 | Bucket exhausted; `Retry-After` set |
| `CONFLICT` | 409 | Unique/state conflict (generic) |
| `EMAIL_NOT_VERIFIED` | 403 | Verification required before this action |
| `APPLICATION_EXISTS` | 409 | A live application already exists for this program |
| `INVALID_STATE_TRANSITION` | 409 | Not permitted by the state machine |
| `APPLICATION_NOT_ACCEPTED` | 409 | Payment attempted on a non-accepted application |
| `ALREADY_PAID` | 409 | A `PAID` payment already exists |
| `ALREADY_ENROLLED` | 409 | A live enrolment already exists for this program |
| `ENROLLMENT_NOT_ACTIVE` | 409 | Submission on an expired/cancelled enrolment |
| `TASK_ALREADY_APPROVED` | 409 | Resubmission to an approved task |
| `PROGRAM_NOT_PUBLISHABLE` | 409 | Fewer complete task briefs than `total_task_count` |
| `CERTIFICATE_NOT_ELIGIBLE` | 409 | Completion criteria not met |
| `PAYMENT_GATEWAY_ERROR` | 502 | Razorpay unreachable or rejected the order |
| `INTERNAL_ERROR` | 500 | Unexpected; logged with `requestId` |

**`NOT_FOUND` is returned for rows the actor may not see.** A student probing another student's application ID gets `NOT_FOUND`, not `FORBIDDEN` — `FORBIDDEN` would confirm the row exists.

### 2.4 Authentication & authorisation
Every action and handler declares its requirement, checked in this order:

`session → role → email verification (where required) → rate limit → Zod → row ownership → state machine`

Row ownership is a **predicate inside the query**, never a filter applied to fetched rows (`02-TRD` §6.2).

### 2.5 Validation
One Zod schema per operation in `src/lib/validation/`, imported by both the client form and the server handler. Applied to every input including `searchParams`, and to webhook bodies after signature verification.

Shared validators: `emailSchema` (trim + lowercase) · `phoneInSchema` (10 digits, leading 6–9) · `githubRepoUrl` (host must be `github.com`, path must match `/owner/repo`) · `httpsUrl` · `uuidSchema` · `paginationSchema` (`page` ≥ 1, `perPage` ≤ 50).

### 2.6 Pagination, filtering, sorting

**Student-facing lists** use cursor pagination — stable under insertion, no deep-offset cost:
```ts
{ cursor?: string, limit?: number /* ≤ 50, default 20 */ }
→ { items: T[], nextCursor: string | null }
```

**Admin tables** use offset pagination, because page numbers and total counts are genuinely useful there and the sets are small:
```ts
{ page: number, perPage: number /* ≤ 50 */, sort?: string, order?: 'asc'|'desc', ...filters }
→ { items: T[], page, perPage, total, totalPages }
```

`sort` is validated against a per-endpoint allowlist of column names. A sort key never reaches SQL unvalidated. Filters are typed per endpoint — never a generic query-object passthrough.

**No list endpoint is unbounded** (`00` §7 rule 4).

### 2.7 Rate limits (Upstash sliding window)

| Operation | Limit | Key |
|---|---|---|
| Sign in | 5 / min | IP |
| Sign up | 3 / hour | IP |
| Password reset request | 3 / hour | email |
| Contact form | 3 / hour | IP |
| Save application draft | 30 / hour | user |
| Submit application | 5 / hour | user |
| Create payment order | 10 / hour | user |
| Submit task | 20 / hour | user |
| Certificate verify | 60 / min | IP |
| Admin mutations | 300 / hour | user |

Auth and payment endpoints **fail closed** when Upstash is unreachable; everything else fails open (`05` §11).

### 2.8 Idempotency
- Webhooks: `UNIQUE (gateway, event_id)` on `payment_events`.
- Payment orders: an existing `CREATED`/`PENDING` payment for the same application younger than 15 minutes is returned rather than duplicated.
- Cron jobs: guarded by the state predicates they act on, so a double run is a no-op.

---

## 3. Route Handlers (`/api/*`)

The complete list. Nine endpoints — everything else is a Server Action or a Server Component read.

| Method | Path | Auth | Rate limit | Purpose |
|---|---|---|---|---|
| `ALL` | `/api/auth/[...all]` | — | per-route (§2.7) | Better Auth: sign-in/up/out, OAuth callbacks, verification, reset |
| `POST` | `/api/payments/order` | session + verified email | 10/hr/user | Create a Razorpay order. Returns `{orderId, amountMinor, currency, keyId}`. **Consumed by the Razorpay checkout script, which is why it is a Route Handler and not an Action.** |
| `POST` | `/api/payments/ack` | session | 20/hr/user | Client-side checkout callback. May only move `CREATED → PENDING`. **Structurally incapable of setting `PAID`.** |
| `POST` | `/api/webhooks/razorpay` | HMAC signature | none (gateway) | The only writer of enrolments (`05` §5). `runtime = 'nodejs'`, raw body |
| `GET` | `/api/certificates/[id]/download` | session, owner or admin | 30/hr/user | Mints a 5-minute signed Cloudinary URL after an ownership check. 302 redirect |
| `GET` | `/api/admin/export/applications` | ADMIN | 10/hr | Streaming CSV. Excludes payment identifiers and raw webhook payloads |
| `GET` | `/api/admin/export/payments` | ADMIN | 10/hr | Streaming CSV ledger |
| `POST` | `/api/cron/[job]` | `CRON_SECRET` bearer | — | Six jobs (`05` §9). Idempotent, `LIMIT`-bounded |
| `GET` | `/api/health` | — | 60/min | DB connectivity + migration version. No secrets, no counts |

### 3.1 `POST /api/payments/order`
```jsonc
// request
{ "applicationId": "uuid" }
// 200
{ "ok": true, "data": { "orderId": "order_…", "amountMinor": 79900,
                        "currency": "INR", "keyId": "rzp_live_…" } }
```
No amount is accepted from the client under any circumstance. Preconditions, in order: session · email verified · application belongs to caller · `status = ACCEPTED` · `payment_due_at > now()` · no `PAID` payment · no live enrolment. Failures map to `EMAIL_NOT_VERIFIED`, `NOT_FOUND`, `APPLICATION_NOT_ACCEPTED`, `ALREADY_PAID`, `ALREADY_ENROLLED`.

### 3.2 `POST /api/webhooks/razorpay`
```
1. read raw body
2. HMAC-SHA256(body, RAZORPAY_WEBHOOK_SECRET) vs X-Razorpay-Signature, timingSafeEqual
   → mismatch: 400, log, stop
3. reject if event timestamp older than 5 minutes
4. INSERT payment_events (gateway, event_id, …)
   → unique violation: 200 OK, no-op        ← idempotency
5. Zod parse payload
6. dispatch by event_type in a transaction (payment.captured | payment.failed | refund.processed)
7. mark processed_at, 200 OK
```
Always returns `200` for anything successfully persisted, even if step 6 throws — retries amplify failures. `process_error` is recorded and the reconciliation cron retries (`05` §5).

---

## 4. Server Actions

Grouped by domain. Each row lists auth requirement, input shape, and the state guard the service enforces.

### 4.1 Profile
| Action | Auth | Input | Guard |
|---|---|---|---|
| `updateProfile` | session | full profile schema | own row only (`user_id = ctx.userId`) |
| `updateAccount` | session | `{ name, image? }` | own row |
| `requestEmailChange` | session | `{ email }` | uniqueness; sends verification to the new address; the change applies only on confirm |
| `deleteAccount` | session | `{ confirm: 'DELETE' }` | soft delete; blocked while an `ACTIVE` enrolment exists; certificates survive (`01-PRD` E16) |

### 4.2 Applications (student)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `startApplication` | session | `{ programSlug }` | program `PUBLISHED`; returns the existing `DRAFT` if one exists, else creates. `APPLICATION_EXISTS` on a live non-draft |
| `saveApplicationStep` | session | `{ applicationId, step: 1\|2\|3, data }` | own row · `status = DRAFT` · step-specific Zod schema |
| `submitApplication` | session | `{ applicationId }` | own row · `DRAFT` · all three steps valid · **transaction:** status → `SUBMITTED` + history + profile upsert |
| `withdrawApplication` | session | `{ applicationId, reason? }` | own row · `SUBMITTED`\|`UNDER_REVIEW` · blocked if a `PAID` payment exists (`01-PRD` E5) |

### 4.3 Submissions (student)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `submitTask` | session | `{ enrollmentId, programTaskId, repoUrl, demoUrl?, notes? }` | own enrolment · `ACTIVE` · `now() < ends_at` · task belongs to the enrolled program · no `APPROVED` submission for this task · `attempt = max+1` |

### 4.4 Applications (admin)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `claimApplication` | ADMIN | `{ applicationId }` | `SUBMITTED → UNDER_REVIEW` |
| `decideApplication` | ADMIN | `{ applicationId, decision: 'ACCEPTED'\|'REJECTED', reason? }` | from `SUBMITTED`\|`UNDER_REVIEW` · reason required on reject · **blocked if a `PAID` payment exists** · sets `payment_due_at` on accept · transaction includes history + audit |
| `bulkAcceptApplications` | ADMIN | `{ applicationIds: uuid[] /* ≤ 50 */ }` | per-row guards; partial success reported per ID |

### 4.5 Programs (admin)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `createProgram` / `updateProgram` | ADMIN | program schema | unique slug · `required_task_count ≤ total_task_count` |
| `publishProgram` | ADMIN | `{ programId }` | **≥ `total_task_count` non-deleted tasks with non-empty briefs**, else `PROGRAM_NOT_PUBLISHABLE` (`01-PRD` FR-1.2, risk M2). Sets `published_at`, `revalidateTag('programs')` |
| `unpublishProgram` / `archiveProgram` | ADMIN | `{ programId }` | archive hides from the catalogue; existing enrolments continue (`01-PRD` E10) |
| `createTask` / `updateTask` / `deleteTask` | ADMIN | task schema | unique `(program_id, position)` · delete is soft · blocked if approved submissions reference it |
| `reorderTasks` | ADMIN | `{ programId, orderedTaskIds }` | single transaction to avoid transient unique-index violations |
| `signUploadUrl` | ADMIN | `{ folder, publicId? }` | returns a Cloudinary upload signature; bytes never traverse a function (`05` §7) |

### 4.6 Reviews (admin)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `claimSubmission` | ADMIN | `{ submissionId }` | `SUBMITTED → UNDER_REVIEW` |
| `reviewSubmission` | ADMIN | `{ submissionId, decision: 'APPROVED'\|'CHANGES_REQUESTED', feedback }` | feedback required on `CHANGES_REQUESTED` · **transaction:** submission status + `approved_required_count` increment + enrolment → `COMPLETED` when the threshold is met + audit. `submissions_approved_uq` prevents a double approval |

### 4.7 Certificates (admin)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `issueCertificate` | ADMIN | `{ enrollmentId, type }` | `COMPLETION` requires `enrollment.status = COMPLETED`, else `CERTIFICATE_NOT_ELIGIBLE`. No live certificate of this type. Generates the code, snapshots `holder_name`/`program_title`/task titles |
| `revokeCertificate` | ADMIN | `{ certificateId, reason }` | `ISSUED → REVOKED`, reason required, `revalidatePath('/verify/[code]')` |

### 4.8 Payments (admin)
| Action | Auth | Input | Guard |
|---|---|---|---|
| `markPaymentRefunded` | ADMIN | `{ paymentId, amountMinor, note }` | manual reconciliation for refunds initiated in the Razorpay dashboard; `amountMinor ≤ payments.amount_minor`; moves the enrolment to `CANCELLED` |
| `retryWebhookProcessing` | ADMIN | `{ paymentEventId }` | reprocesses an event with `process_error` set; idempotent |

### 4.9 Contact
| Action | Auth | Input | Guard |
|---|---|---|---|
| `submitContactForm` | none | `{ name, email, subject, message, hp }` | honeypot must be empty · 3/hr/IP · message ≤ 4000 chars · stores `ip_hash`, never the raw IP |
| `updateContactStatus` | ADMIN | `{ id, status }` | sets `handled_by`, `handled_at` |

---

## 5. Server Component reads

Not endpoints — direct service calls during render. Listed because they are the majority of the data surface and each carries an authorisation obligation.

| Function | Auth | Cache | Query |
|---|---|---|---|
| `listPublishedPrograms()` | public | tag `programs`, ISR 3600s | `04` Q1 |
| `getProgramBySlug(slug)` | public | tag `program:{slug}` | `04` Q2 |
| `getCertificateByCode(code)` | public | 300s, purged on revoke | `04` Q7 |
| `listMyApplications(ctx, page)` | session | none | `04` Q3, scoped to `ctx.userId` |
| `getMyApplication(ctx, id)` | session | none | ownership predicate; `NOT_FOUND` otherwise |
| `getMyEnrollment(ctx, id)` | session | none | `04` Q5 — `LATERAL`, no N+1 |
| `listMyPayments(ctx)` | session | none | scoped |
| `listMyCertificates(ctx)` | session | none | scoped |
| `adminListApplications(ctx, filters)` | ADMIN | none | `04` Q4 |
| `adminNextSubmission(ctx, offset)` | ADMIN | none | `04` Q6, prefetches the next |
| `adminOverview(ctx)` | ADMIN | none | `04` Q8 |
| `adminListStudents(ctx, q, page)` | ADMIN | none | paginated, indexed search |

---

## 6. Resource boundaries — what was deliberately not created

| Rejected | Why |
|---|---|
| `GET /api/programs` | Server Components read directly. A JSON endpoint would exist solely to be consumed by our own server |
| `GET /api/applications/:id` | Same. Adds a public surface with no consumer |
| `PATCH /api/applications/:id/status` | Status is not a freely-writable field. `decideApplication` names the operation and enforces the state machine; a generic PATCH invites clients to invent transitions |
| `POST /api/payments/verify` | Client-side verification is theatre. The webhook is the only source of truth (`05` §5) |
| `/api/users/:id` | No feature requires reading another user by ID. Not built |
| `/api/upload` | No bytes pass through our functions (`05` §7) |
| A generic `/api/admin/:resource` CRUD layer | Convenient, and it would let a bug in one place compromise every table. Explicit actions with explicit guards instead |
| GraphQL / tRPC | Nothing consumes a typed remote schema — Server Components already give end-to-end types with zero transport |

**The principle:** an endpoint exists when something outside the application needs to call it. Everything else is a function call.

---

## 7. Security checklist per endpoint

Applied to every action and handler before merge:

- [ ] Session checked (or explicitly documented as public)
- [ ] Role checked where required
- [ ] Email verification checked where required
- [ ] Rate limit applied with the correct key (IP vs user)
- [ ] Zod schema applied to **all** input, including `searchParams`
- [ ] Row ownership expressed as a predicate **in the query**
- [ ] State transition validated against the machine (`04` §6)
- [ ] Multi-table writes wrapped in a transaction
- [ ] History / audit rows written inside that transaction
- [ ] Email dispatched **after** commit
- [ ] Errors mapped to the code taxonomy; no raw Postgres or gateway errors surfaced
- [ ] No PII in logs or in the returned `message`
- [ ] `revalidatePath` / `revalidateTag` called for affected cached routes
- [ ] Unit test for the unauthorised-actor case
- [ ] Unit test for each invalid state transition

---

## 8. Versioning

There is no `/v1` prefix, because there is no external consumer to break. The three endpoints with external callers are versioned by their own contracts: Better Auth's routes, Razorpay's webhook payload version, and the cron secret.

When a public verification API is genuinely requested by recruiters (`01-PRD` §14, Future), it will be introduced as a separate, versioned, read-only, key-authenticated surface over `certificates` — not by exposing any of the internals described above.
