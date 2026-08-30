# Tecxcodr — Product Requirements Document

**Version:** 1.0 (MVP) · **Date:** 2026-08-24
**Derives from:** [`00-PRODUCT-DECISIONS.md`](00-PRODUCT-DECISIONS.md)

---

## 1. Product overview

Tecxcodr is a developer-native virtual internship platform. A student discovers a coding program, applies through a real application flow, is accepted, pays to enrol, works through a small number of substantial build tasks submitted as GitHub repositories, receives human review, and earns a certificate that a recruiter can independently verify at a public URL.

The product is deliberately two systems in one codebase:

- **The funnel** — a fast, high-contrast, terminal-flavoured marketing site whose only job is to convert a student from "saw a post" to "enrolled".
- **The delivery machine** — the student dashboard and admin operations surface that actually runs the internship. Unglamorous, and the part that determines whether the business survives.

## 2. Problem statement

**For students.** Indian engineering students are required — by curriculum, by placement cells, and by the résumé market — to show internship experience. Real internships are scarce, geographically concentrated, and overwhelmingly favour students from a small set of colleges. The fallback options are a Google Form, a WhatsApp group, and a JPEG certificate with no verifiable provenance. The student gets a line on a résumé that recruiters have learned to discount, and no artifact that proves anything.

**For recruiters.** Certificates from virtual internship providers carry near-zero signal. There is usually no way to verify one, no way to see what was built, and no evidence a human evaluated it.

**The gap.** Between "unpaid Google Form certificate mill" and "competitive FAANG internship" there is no product that is structured, affordable, honest about what it is, and produces a **verifiable artifact**.

## 3. Target users & personas

### Persona 1 — Aarav, the résumé-gap student *(primary, ~70%)*
3rd year CSE, tier-2 college, ~7.5 CGPA. Placement season is next year. Has done tutorials, has no shipped project. Wants a credible line on a résumé and something to talk about in an interview.
- **Pain:** applies to 40 internships, hears nothing. Free "internships" online feel like scams.
- **Job to be done:** "Give me something real to put on my résumé and something real to talk about."
- **Buys when:** the tasks look genuinely substantial, the certificate is verifiable, and the price is low enough to not need a parent's approval.
- **Churns when:** submits task 1 and hears nothing for a week.

### Persona 2 — Diya, the skill-builder *(secondary, ~25%)*
2nd year, self-taught alongside coursework, active on GitHub. Doesn't need the certificate as much as the structure and the review.
- **Pain:** no structure, no feedback, no external deadline.
- **Job to be done:** "Give me a spec and someone to critique my code."
- **Buys when:** the task briefs read like real requirements, not exercises.
- **Churns when:** the feedback is a rubber stamp.

### Persona 3 — Mohit, the operator *(admin, n=1)*
Founder. Reviews every submission, answers every email, publishes every program.
- **Pain:** review volume scales linearly with revenue and there is exactly one of him.
- **Job to be done:** "Let me clear the review queue in 30 minutes a day without opening a database client."
- **Product implication:** the admin surface is a **queue**, not a CRUD browser. This is a first-class requirement, not an internal tool afterthought.

### Persona 4 — the recruiter *(non-user, but the audience for the artifact)*
Never logs in. Encounters exactly one Tecxcodr surface: `tecxcodr.com/verify/TCX-2609-7QK4M2XR`. That page must load instantly, look institutional, and answer one question: *is this real, and what did they build?*

## 4. Product goals

| Goal | Rationale | Measured by |
|---|---|---|
| G1 | A student can go from landing page to enrolled in under 10 minutes | Funnel friction is the whole business | Time-to-enrol p50 |
| G2 | Every certificate is publicly verifiable | This is the differentiator | 100% of certificates resolve at `/verify/[code]` |
| G3 | Every submission gets human feedback within 3 business days | Trust and churn | Review SLA adherence |
| G4 | One admin can operate the platform without SQL | Ops must not scale with headcount | Zero manual DB writes in normal operation |
| G5 | The marketing site feels built by developers, for developers | Category tiebreaker | Qualitative + Web Vitals |

## 5. Business goals

- Validate willingness to pay ₹799 for a structured, reviewed program.
- Reach a completion rate above the category norm — completion, not enrolment, produces the testimonials and verified certificates that drive the next cohort.
- Keep payment disputes below gateway thresholds through honest pre-purchase copy and a published refund policy.
- Establish `/verify/*` as a real, indexable trust surface.

## 6. Non-goals (MVP)

Explicitly not building, not designing schema for, and not writing copy about:

Mock or AI interviews · in-browser code execution · auto-grading · plagiarism detection · mentors or live sessions · cohorts/batches · leaderboards · referrals · coupons · a blog · in-app chat · a mobile app · i18n or multi-currency · college SSO · a public API · testimonials · an in-app notification centre · file uploads of any kind.

The most important non-goal: **Tecxcodr does not promise employment, stipend, placement, or job assistance.** No page, email, ad or certificate may imply otherwise.

## 7. MVP scope

### 7.1 Marketing site
| Page | Route | Rendering | Notes |
|---|---|---|---|
| Home | `/` | Static | Hero, proof of substance, program preview, process, FAQ teaser, CTA |
| Programs | `/programs` | Static, ISR | Grid + domain filter (client-side, no fetch) |
| Program detail | `/programs/[slug]` | Static, ISR | **Full task syllabus visible pre-payment.** Price, duration, certificate criteria, apply CTA |
| How It Works | `/how-it-works` | Static | The 5-step flow, honestly described |
| About | `/about` | Static | Who is behind this — a named human beats an anonymous "team" for trust |
| FAQ | `/faq` | Static | Content from repo (S2). Must directly answer "is this a scam / is it worth ₹799 / will I get a job" |
| Contact | `/contact` | Static + action | Rate-limited form → `contact_requests` |
| Terms · Privacy · Refund | `/terms` `/privacy` `/refund-policy` | Static | **Ship before payments are activated** |
| Certificate verification | `/verify/[code]` | Dynamic, cached | Public, no auth, indexable |

### 7.2 Auth
Sign in / sign up / forgot password / reset / verify email. Google + GitHub OAuth + email-password. Signup is embedded as step 1 of the apply flow.

### 7.3 Application flow
Three steps, autosaved as `DRAFT` after each:
1. **Identity & academics** — name, phone, city/state, college, degree, branch, current year, graduation year
2. **Technical profile** — experience level, primary skills, languages, GitHub / LinkedIn / portfolio URLs
3. **Program fit & review** — motivation (short), how they heard about us, full review screen, consent checkbox, submit

Rules: one non-terminal application per `(user, program)`; profile data prefills from `student_profiles` on subsequent applications; the submitted answers are **snapshotted** onto the application so later profile edits don't rewrite history.

### 7.4 Payment & enrolment
Only reachable when `application.status = ACCEPTED`. Razorpay order → checkout → webhook-verified capture → enrolment created → offer letter issued → confirmation email. See `05-SYSTEM-ARCHITECTURE.md` §5.

### 7.5 Student dashboard
| Screen | Route | Contents |
|---|---|---|
| Overview | `/dashboard` | Active enrolment, next task, days remaining, pending actions |
| Applications | `/dashboard/applications` | Status + timeline per application, pay CTA when `ACCEPTED` |
| My internship | `/dashboard/internships/[id]` | Task list, per-task state, submit form, feedback thread, progress |
| Payments | `/dashboard/payments` | Payment history + receipt download |
| Certificates | `/dashboard/certificates` | Offer letter + completion certificate, download + public verify link |
| Profile | `/dashboard/profile` | Editable profile, account settings |

### 7.6 Admin
| Screen | Route | Contents |
|---|---|---|
| Overview | `/admin` | Counts: applications pending, submissions pending, active enrolments, revenue this month. Four queries, no charts. |
| Applications | `/admin/applications` | Filterable queue, detail drawer, accept/reject with reason, bulk accept |
| Review queue | `/admin/reviews` | **Keyboard-driven.** Submission → repo link → approve / request changes + feedback → next. `J`/`K`/`A`/`R` |
| Programs | `/admin/programs` | CRUD, tasks CRUD, publish/unpublish. Cannot publish without 3 task briefs. |
| Students | `/admin/students` | Search, detail view, enrolments, payments |
| Payments | `/admin/payments` | Read-only ledger, webhook event log, mark-refunded |
| Certificates | `/admin/certificates` | Issue, revoke, list |
| Contact | `/admin/contact` | Inbox for `contact_requests` |

## 8. Feature requirements

### FR-1 · Program discovery
- FR-1.1 Published programs are listed with title, domain, duration, task count, price.
- FR-1.2 Program detail shows the **complete task syllabus** (title + brief) before any payment.
- FR-1.3 Program detail states the exact certificate criterion ("complete any 2 of 3 required tasks").
- FR-1.4 Unpublished/archived programs 404 for non-admins.
- FR-1.5 Program pages are statically generated and revalidated on publish.

### FR-2 · Application
- FR-2.1 Applying requires an authenticated account; signup is inline at step 1.
- FR-2.2 Progress autosaves as `DRAFT` on step transition; a returning user resumes where they left off.
- FR-2.3 Server-side validation mirrors client validation via a shared Zod schema.
- FR-2.4 A user cannot hold two non-terminal applications for the same program (DB-enforced).
- FR-2.5 On submit: status → `SUBMITTED`, history row written, confirmation email sent.
- FR-2.6 A student may withdraw a `SUBMITTED`/`UNDER_REVIEW` application.
- FR-2.7 Answers are snapshotted; `student_profiles` is also upserted for prefill.

### FR-3 · Admin decisioning
- FR-3.1 Admin can move `SUBMITTED` → `UNDER_REVIEW` → `ACCEPTED` | `REJECTED`.
- FR-3.2 Rejection requires a reason (stored, not necessarily shown verbatim).
- FR-3.3 Every transition writes `application_status_history` with actor and timestamp.
- FR-3.4 Acceptance triggers the "you're in — complete payment" email containing a deep link.
- FR-3.5 Acceptance sets a payment window; `ACCEPTED` applications unpaid after 14 days go `EXPIRED` (scheduled job).

### FR-4 · Payment
- FR-4.1 Order creation is server-side only; the client never sends an amount.
- FR-4.2 Amount is read from `programs.price_amount_minor` at order time and frozen onto the payment row.
- FR-4.3 Webhook signature is verified before any parsing.
- FR-4.4 Webhook processing is idempotent via a unique constraint on the gateway event ID.
- FR-4.5 Enrolment is created **only** by webhook processing.
- FR-4.6 A user with an active enrolment for a program cannot create a second order for it.
- FR-4.7 Payment failure leaves the application `ACCEPTED` and retryable.
- FR-4.8 Every successful payment produces a sequential receipt number and a receipt email.

### FR-5 · Delivery
- FR-5.1 Enrolment exposes the program's tasks in order, all unlocked immediately (self-paced).
- FR-5.2 A submission requires a valid GitHub repo URL (host-validated); demo URL and notes optional.
- FR-5.3 Submissions are attempt-versioned; `CHANGES_REQUESTED` allows a new attempt.
- FR-5.4 Submission is blocked once `enrollments.status != ACTIVE`.
- FR-5.5 Progress = approved required tasks ÷ `required_task_count`.
- FR-5.6 Review actions email the student with the feedback body.

### FR-6 · Certificates
- FR-6.1 Offer letter auto-issues on enrolment.
- FR-6.2 Completion certificate is admin-issued, and the action is disabled until criteria are met.
- FR-6.3 Each certificate has a globally unique, non-sequential, non-guessable code.
- FR-6.4 `/verify/[code]` is public and shows: holder name, program, type, issue date, status, and completed task titles. It never shows email, phone, or payment data.
- FR-6.5 Revoked certificates resolve to a clear "revoked" state, never a 404.

### FR-7 · Cross-cutting
- FR-7.1 Light/dark theme, persisted, no flash-of-wrong-theme.
- FR-7.2 All animation gated on `prefers-reduced-motion`.
- FR-7.3 Every list is paginated.
- FR-7.4 Every mutating route is rate-limited.
- FR-7.5 Every screen has designed loading, empty, and error states.

## 9. User stories & acceptance criteria

**US-1 — Understand before paying**
> As a student, I want to see exactly what I'll build before I pay, so I can judge whether ₹799 is worth it.
- ✔ Program detail lists all 3 tasks with title, brief summary, and estimated hours
- ✔ Price, duration and certificate criteria are visible above the fold on mobile
- ✔ No "contact us for details" gate anywhere in the funnel

**US-2 — Apply without friction**
> As a student, I want to apply in one sitting without creating an account first.
- ✔ Clicking Apply on a program goes straight to step 1, which contains signup
- ✔ Closing the tab mid-application and returning restores the draft
- ✔ Every field error appears inline with an accessible description, not a toast

**US-3 — Know where I stand**
> As a student, I want to see my application status without emailing anyone.
- ✔ `/dashboard/applications` shows a timeline of every transition with dates
- ✔ `ACCEPTED` renders a primary "Complete payment" CTA
- ✔ `REJECTED` renders a clear, non-humiliating message and suggests other programs

**US-4 — Pay safely**
> As a student, I want confidence my payment registered even if my connection dropped.
- ✔ Reloading after a dropped checkout shows the correct final state within one webhook cycle
- ✔ A duplicate webhook delivery does not create a second enrolment
- ✔ A receipt email arrives with a receipt number

**US-5 — Get real feedback**
> As a student, I want a human to tell me what was wrong with my code.
- ✔ Feedback text is shown in the task view and emailed
- ✔ `CHANGES_REQUESTED` re-enables the submit form with prior values prefilled
- ✔ Attempt history is visible

**US-6 — Prove it happened**
> As a student, I want a link I can put on LinkedIn that a recruiter can check.
- ✔ Certificate page exposes a copyable public verify URL
- ✔ The verify page renders without auth in under 1s
- ✔ The verify page lists the tasks that were actually completed

**US-7 — Clear the queue**
> As the admin, I want to review a day's submissions in under 30 minutes.
- ✔ `/admin/reviews` opens on the oldest pending submission
- ✔ `A` approves, `R` opens the feedback box, `J`/`K` navigate, all without the mouse
- ✔ Acting advances to the next item automatically

**US-8 — Operate without SQL**
> As the admin, I want to run the business from the admin panel.
- ✔ Publishing a program, accepting an application, issuing a certificate, marking a refund, and exporting applications are all UI actions
- ✔ Every admin mutation is written to the audit log

## 10. User journeys

**J1 · Discovery → enrolment (the money path)**
`/` → `/programs` → `/programs/web-development` → Apply → signup (step 1) → academics → technical → review → submit → *email: received* → **[admin accepts]** → *email: accepted + pay link* → `/dashboard/applications` → Pay → Razorpay → return → pending → *webhook* → enrolled → *email: offer letter* → `/dashboard/internships/[id]`

**J2 · Task cycle**
Task view → read brief → build → submit repo → *email to admin* → admin review → approve *or* request changes → *email to student* → repeat → 2 of 3 approved → admin issues certificate → *email* → download + share verify link

**J3 · Recruiter verification**
LinkedIn link → `/verify/TCX-2609-7QK4M2XR` → holder, program, date, status, completed tasks → "Verified by Tecxcodr"

**J4 · Admin day**
`/admin` → 6 pending applications, 11 pending submissions → applications queue → accept/reject → `/admin/reviews` → keyboard through the queue → done

## 11. Edge cases

| # | Case | Required behaviour |
|---|---|---|
| E1 | Payment succeeds, webhook delayed | UI shows "Payment processing" pending state and polls/revalidates; never claims failure |
| E2 | Webhook delivered twice | Unique `event_id` → second delivery is a no-op |
| E3 | Payment captured for an already-enrolled user | Flag for manual refund in admin; never create a second enrolment |
| E4 | User pays, then application is rejected | Impossible — payment is gated on `ACCEPTED`; admin cannot reject a paid application |
| E5 | User withdraws after paying | Blocked; directs to refund policy + contact |
| E6 | Enrolment expires with 1 of 2 required tasks approved | No certificate. Status `EXPIRED`. Clear messaging; extension is a manual admin action |
| E7 | Repo URL is private or 404 | Reviewer requests changes with a canned reason; not a system error |
| E8 | Same repo URL submitted by two students | Admin sees a duplicate-URL warning badge. No auto-block in MVP |
| E9 | Program price changes after acceptance | Frozen price on the payment row wins |
| E10 | Program archived while enrolments are active | Archive hides it from the catalogue; existing enrolments continue |
| E11 | OAuth email collides with an existing password account | Better Auth account-linking on verified email; never create a duplicate user |
| E12 | Certificate revoked | `/verify` renders `REVOKED` with the date. Never 404 |
| E13 | Student edits profile after applying | Application snapshot unchanged; future applications use the new profile |
| E14 | Bot floods the contact form | Rate limit by IP + honeypot; excess → 429 |
| E15 | Admin accidentally rejects | Reversible via status change; both transitions in history |
| E16 | User deletes account with an active enrolment | Soft-delete only, `deleted_at` set; certificates remain verifiable (documented in Privacy) |

## 12. Success metrics

| Metric | Definition | Launch target |
|---|---|---|
| Application start rate | apply-step-1 starts ÷ program-detail views | ≥ 12% |
| Application completion | submitted ÷ started | ≥ 65% |
| Accept→pay conversion | paid ÷ accepted | ≥ 40% |
| First-task submission | enrolments with ≥1 submission | ≥ 70% |
| Completion rate | certificates ÷ enrolments | ≥ 35% |
| Review SLA | reviews within 3 business days | ≥ 95% |
| Refund rate | refunded ÷ paid | ≤ 5% |
| Dispute rate | chargebacks ÷ paid | ≤ 0.5% |
| LCP (mobile, marketing) | field p75 | ≤ 2.5s |
| INP (mobile) | field p75 | ≤ 200ms |

**Counter-metric:** completion rate must not be sacrificed for enrolment volume. A rising enrolment count with a falling completion rate means the funnel is out-promising the delivery.

## 13. Risks & assumptions

### Product risks
| Risk | Sev | Mitigation |
|---|---|---|
| "Pay-to-intern" credibility backlash | **Critical** | Free to apply · full syllabus pre-purchase · verifiable certificates · human review · no employment claims anywhere |
| Review capacity collapse at volume | **High** | Keyboard review queue · published SLA · soft enrolment cap per program via `seats_total` |
| Programs published without real task content (M2) | **High** | Hard product rule: cannot publish without 3 complete task briefs |
| Students enrol and never start | Medium | Day-3 nudge email · task 1 scoped to ≤ 6 hours |
| Seasonal demand concentration | Medium | Not an engineering problem; affects launch timing |
| Refund disputes | Medium | Published policy · instant receipt · honest pre-purchase copy |

### Technical risks
| Risk | Sev | Mitigation |
|---|---|---|
| Payment/enrolment correctness | **Critical** | Webhook-as-truth · signature verification · event-ID idempotency · reconciliation job |
| Animation ambition vs Web Vitals | **High** | Hard JS budget (`02-TRD.md` §10) · GSAP only · dynamic import · dashboards animation-free |
| Serverless connection exhaustion | High | Neon pooled endpoint + HTTP driver |
| Certificate PDF generation on serverless | Medium | Generate once at issue time, store the artifact; no headless Chromium per request |
| Private artifact leakage | Medium | Signed, expiring URLs; never public Cloudinary paths for certificates |
| Admin scope creep | Medium | Admin frozen at the eight screens in §7.6 |

### Assumptions
Low-hundreds of applications/month at launch · all users in India, INR only · founder is sole admin and reviewer · task content authored in parallel · no existing brand assets.

## 14. Version roadmap

**MVP (this document)** — everything in §7.

**V1 (post-launch, demand-driven)**
In-app notification centre · coupons and scholarship codes · `REVIEWER` role activated · analytics dashboard · testimonials from real completions · resume/PDF uploads with AV scanning · saved programs · Discord community · UI/UX program.

**Future (post product-market fit)**
Sandboxed code execution and auto-graded assessments · the interview-experience product (scoped separately) · cohorts and live sessions · mentor marketplace · college/institution partnerships · a public verification API for recruiters.
