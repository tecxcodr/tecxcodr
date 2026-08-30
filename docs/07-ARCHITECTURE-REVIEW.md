# Tecxcodr — Architecture Review Summary

**Version:** 1.0 · **Date:** 2026-08-24 · **Scope:** cross-document review of `00`–`06`

A deliberate adversarial pass over the documentation set: looking for contradictions between documents, entities defined but never used, flows with no owner, security gaps, performance traps, and MVP scope creep.

---

## 1. Consistency audit — issues found and fixed

| # | Issue | Documents | Resolution |
|---|---|---|---|
| C1 | Cron job list disagreed — `02` had 5 jobs, `05` had 6 (`reconcile-counters` missing from the TRD) | `02` §12.4 · `05` §9 | Added to `02`. Both now list six |
| C2 | `01` FR-4.8 promised "a sequential receipt number" but no generation mechanism existed in the schema | `01` · `04` §5.8 | Added `receipt_number_seq` with format `TCX-INV-YYYY-NNNNNN`, consumed only on transition to `PAID` |
| C3 | `submissions_reviewed_ck` was written as a confusing triple-disjunction that did not actually constrain anything useful | `04` §5.11 | Rewritten as `status NOT IN ('APPROVED','CHANGES_REQUESTED') OR reviewed_at IS NOT NULL` |
| C4 | The application state machine referenced a 30-day draft cleanup that no cron job implemented | `04` §6.1 · `02` §12.4 | Claim removed. Drafts persist and are resumed by `startApplication`; deleting them would discard funnel data for no benefit |
| C5 | CSP allowed Razorpay's script but not its iframe — checkout would have been blocked in production while working in dev | `02` §11 | `frame-src`, `connect-src`, `img-src` directives added explicitly |
| C6 | The webhook sequence implied certificate **artifact rendering** happened inside the payment transaction | `05` §5 | Clarified: the `certificates` row is inserted in the transaction; the artifact is rendered after commit. `asset_url` is nullable precisely to allow this |

**Traceability spot-checks that passed:** every PRD feature has a schema entity and an API operation · every enum value has at least one transition that produces it · every table has at least one documented query · every index maps to a named query · every error code is reachable from a documented guard · every email template has a trigger · no orphan entities (nothing defined and never referenced).

---

## 2. Strengths

**The correctness-critical path is genuinely defended.** Payment and enrolment integrity rests on database constraints — `payments_paid_uq`, `enrollments_application_uq`, `payment_events (gateway, event_id)`, `submissions_approved_uq` — rather than on service-layer checks. Service checks are races; unique indexes are guarantees. Concurrent duplicate webhook deliveries cannot produce a double enrolment even if the application logic is wrong.

**The architecture decision is right-sized and reversible.** Dropping the split backend removes CORS, dual auth, dual deploys, and cold starts on the webhook path — with no capability lost, because no MVP workload needs a long-lived process. The `services/` seam (no `next/*` imports, explicit actor context) means the eventual code-execution worker is an extraction, not a rewrite. The exit is named and cheap.

**Scope discipline held.** Nine entities from the original brief — notifications, FAQs, testimonials, categories, system config, assessments, file storage — were cut with reasons rather than built "since we're here". The MVP has 17 tables, and every one has a query that reads it.

**Trust is designed into the data model, not bolted on.** Certificates snapshot `holder_name` and `program_title`; enrolments snapshot `required_task_count`; applications snapshot `answers`. Each prevents a class of retroactive-rewrite bug that would silently change what a verification page means. For a product whose entire differentiator is verifiability, this is the right place to spend complexity.

**The animation/performance conflict was resolved by budget, not intention.** One animation library instead of three, route-group isolation so dashboards ship zero animation JS, hard first-load budgets enforced in CI, and reduced-motion treated as removal rather than shortening.

**The admin surface is designed as an operations tool.** Modelling the review flow as a keyboard-driven queue rather than a CRUD table is the difference between a business that scales past 50 students and one that doesn't.

---

## 3. Risks

### 3.1 Open blockers — external, with lead times

| # | Blocker | Blocks | Action |
|---|---|---|---|
| R1 | **No registered entity / PAN / business bank account** (`00` Pay1) | Milestone 5 entirely. Razorpay onboarding is days-to-weeks | Start today, in parallel with M0–M4 |
| R2 | **Domain not confirmed** (`00` B2) | Email deliverability (SPF/DKIM/DMARC), gateway onboarding, OAuth redirect URIs | Confirm this week |
| R3 | **Task content may not exist** (`00` M2) | Milestone 6, and the credibility of the whole product | Author 3 briefs for one program before M6; `publishProgram` enforces this at the code level |
| R4 | **GST treatment unknown** (`00` Pay5) | Price display copy, receipt template | Documented assumption: price inclusive, no line item. Cheap to change |

R1 and R3 are the two that can actually delay launch. Neither is an engineering problem, which is exactly why they're easy to under-prioritise.

### 3.2 Technical risks that survive the design

| # | Risk | Assessment |
|---|---|---|
| R5 | **Certificate artifact generation is under-specified.** `05` §7 rules out headless Chromium and says "template-based generator", but no library is chosen | Real gap. Not blocking (the verify page renders from the database and doesn't need the artifact), but it will consume a day in M6. Decide during M5 |
| R6 | **`approved_required_count` is a denormalised counter.** Safe in-transaction, guarded by `submissions_approved_uq`, checked weekly by Q11 | Accepted. The reconciliation query is the reason this is acceptable rather than reckless |
| R7 | **Contrast ratios in `03` §2.5 are computed estimates.** They have not been verified with a tool | Must be validated during M1 with an actual contrast checker before the tokens are locked. The `--border` on `--bg` pair is the one most likely to fail — the mitigation (inputs use `--border-strong`) is already documented |
| R8 | **GSAP SplitText licensing.** `03` §6.3 uses it for line-level heading reveals | Verify the plugin's current licence terms before M2. If it's not usable, line reveals degrade to a CSS-only opacity/translate stagger with no visual loss worth defending |
| R9 | **`prefers-reduced-motion` is easy to get 80% right.** The CSS override does not stop GSAP from registering ScrollTriggers or Lenis from hijacking scroll | Documented in `03` §6.4 with the `matchMedia` requirement. Needs manual per-component verification, which is stated but easy to skip under deadline |
| R10 | **Single admin is a single point of failure.** If the founder is unavailable for a week, the review SLA breaks and refund requests follow | Product risk, not technical. `review-sla-alert` surfaces it; `REVIEWER` role is pre-designed. No mitigation in MVP beyond visibility |
| R11 | **Neon free tier suspends idle databases**, adding cold-start latency, and PITR requires a paid tier | `02` §12.5 already gates live payments on the paid tier. Do not take real money on a database without point-in-time recovery |

### 3.3 Scope-creep watch list

Things most likely to quietly expand during the build:

1. **Admin analytics.** `01` §7.6 specifies four counts. The moment a chart library appears, the admin bundle budget is gone. Four `COUNT(*)` queries, no charts.
2. **The homepage.** Eight sections with stated jobs (`03` §8). A ninth section needs a job before it needs a design.
3. **Program marketing fields.** `programs` has `tagline`, `summary`, `description`. That is enough. Resist adding `highlights[]`, `outcomes[]`, `syllabus_pdf`.
4. **Email templates.** Thirteen are specified. A fourteenth needs a trigger and a `related_type`.
5. **Animation.** The budget is a CI gate specifically so this argument is settled by a number rather than by taste.

---

## 4. Recommended changes

### Before writing code
1. **Start the entity/gateway paperwork today** (R1). It has the longest lead time and zero engineering dependency.
2. **Confirm the domain** (R2), then configure SPF/DKIM/DMARC early — deliverability problems surface late and debug slowly.
3. **Write one program's three task briefs before M2.** They will change how the program detail page and the task view are designed, and they de-risk R3. Design against real content, not lorem ipsum.

### During the build
4. **Verify contrast with a tool during M1** (R7) and correct the token values in `03` §2.3–2.4 rather than shipping estimates.
5. **Build M6 (delivery + review queue) before layering animation onto M2.** This is decision C2 made concrete — the sequencing is what makes the priority real rather than aspirational.
6. **Write the payment E2E test — including the duplicate-webhook case — as part of M5, not M7.** It is the one test whose absence could cost real money.
7. **Choose the certificate generation approach during M5** (R5) so M6 isn't blocked by an unmade decision.
8. **Seed data first.** `04` §9 is written to make every UI state reachable, including `REJECTED`, `EXPIRED`, `CHANGES_REQUESTED` and `REVOKED`. Building screens without it means those states get designed last and badly.

### Deliberately not recommended
- **Don't add a staging environment.** Preview deployments on Neon branches already provide isolation, at zero marginal cost.
- **Don't build refunds in-app.** `05` §5 keeps them in the Razorpay dashboard with a reconciliation action. At this volume, automating them costs more than it saves and adds a money-moving code path.
- **Don't introduce a job queue.** Nothing in MVP exceeds a request cycle. Cron + reconciliation covers every asynchronous need identified.
- **Don't design the interview-experience module** (`00` P2), even at schema level. Speculative schema is the most expensive kind of documentation to keep honest.

---

## 5. Verdict

The design is internally consistent after the six fixes in §1, appropriately scoped for a solo seven-week build, and defended where it matters — money, enrolment integrity, and the verification surface that the product's credibility rests on.

**The critical path to launch is not the code.** It is the legal entity (R1) and the task content (R3), both of which sit entirely outside this repository. Every engineering milestone through M4 can proceed in parallel with them; M5 and M6 cannot.

The two most likely ways this fails: shipping a beautiful funnel in front of a program with thin task content, or the review queue silently stalling once volume arrives. The architecture makes the second one visible — `review-sla-alert`, the SLA metric, and the counter-metric in `01` §12 exist precisely because a rising enrolment count with a falling completion rate is the failure mode that looks like success right up until it doesn't.
