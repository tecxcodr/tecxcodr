# Tecxcodr — Product Decision Summary

**Status:** Locked for MVP · **Date:** 2026-08-24 · **Owner:** Founder

This is the single source of truth. Every other document in `docs/` derives from this file.
If a decision here changes, the dependent documents listed in the **Affects** column must be updated in the same change.

---

## 0. How to read this

| Marker | Meaning |
|---|---|
| ✅ | Decided and locked for MVP |
| ⚠️ | Decided by default; founder has not explicitly confirmed. Safe to build on, cheap to reverse. |
| 🔴 | **Open blocker** — build continues, but a milestone is gated on this |

---

## 1. Brand & positioning

| # | Decision | Detail | Affects |
|---|---|---|---|
| B1 | ✅ Brand name | **Tecxcodr** — one spelling everywhere. Never "Tecscodr". Lowercase `tecxcodr` permitted in code/monospace contexts only. | 03 |
| B2 | 🔴 Domain | Not yet confirmed as owned. Preference order: `tecxcodr.com` → `tecxcodr.in`. **Gates:** email sending (DNS/SPF/DKIM), payment gateway onboarding. | 05 |
| B3 | ⚠️ Primary user | 2nd/3rd-year Indian engineering students (CSE / IT / adjacent) who need a résumé line and a real, defensible project. | 01 |
| B4 | ✅ Positioning | Developer-native virtual internship platform. Differentiator is **verifiable substance** (public certificate verification + human-reviewed GitHub submissions), not visual polish. | 01, 03 |
| B5 | ✅ Positioning guardrail | Copy must never promise: employment, stipend, placement, or job guarantee. It is a **structured training and experience program**. | 01, 03 |

## 2. Business model

| # | Decision | Detail | Affects |
|---|---|---|---|
| P1 | ✅ Monetization | **Free to apply → pay to enroll after acceptance.** Payment is never a precondition of applying. | 01, 04, 05 |
| Pay3 | ⚠️ Price | **₹799** flat across all launch programs. Stored per-program (`programs.price_amount_minor = 79900`) so per-program pricing needs no migration. | 01, 04 |
| Pay4 | ⚠️ Refund policy | Full refund within **7 days of payment, if zero task submissions exist**. No refund after the first submission or after day 7. Published at `/refund-policy`. | 01, 06 |
| Pay1 | 🔴 Legal entity | Registered entity + PAN + business bank account required for gateway onboarding. **Gates Milestone 5 (payments).** Start in parallel with development. | 05 |
| Pay5 | 🔴 GST | Applicability and whether ₹799 is inclusive. Affects price display copy and receipt template. Default assumption: **price is inclusive, no GST line item** until advised otherwise. | 01, 03 |

## 3. Internship model

| # | Decision | Detail | Affects |
|---|---|---|---|
| P3 | ✅ Cadence | **Self-paced.** A 4-week clock starts at enrollment (`enrollments.started_at` → `ends_at`). No cohorts, no batches, no capacity fill pressure. | 01, 04 |
| M3 | ✅ Structure | **4 weeks · 3 tasks · complete any 2 required tasks → certificate.** | 01, 04 |
| M1 | ⚠️ Launch programs (6) | `web-development`, `python-programming`, `java-programming`, `data-science`, `android-development`, `cpp-dsa`. UI/UX deferred to v1 (not coding-native). | 01, 04 |
| M2 | 🔴 Task content | Whether real task briefs exist per program is **unknown**. This is the most likely true critical path. A program cannot be `PUBLISHED` without 3 complete task briefs. | 01 |
| P4 | ✅ Submissions | **GitHub repo URL + optional live demo URL + notes textarea.** No file uploads in MVP. Eliminates the entire upload/AV/storage-abuse surface. | 01, 04, 06 |
| P5 | ⚠️ Review | Founder reviews manually. **3 business-day SLA**, stated in-product. Admin review UI is built as a keyboard-driven queue, not a browsable table. | 01, 03 |
| P6 | ✅ Certificate eligibility | All **required** tasks approved (2 of 3 at launch). Issued manually by admin with a one-click action; not auto-issued. | 01, 04 |
| P7 | ✅ Offer letter | Issued automatically on enrollment. Same generation pipeline as the certificate, different template + `certificates.type = OFFER_LETTER`. | 01, 04, 05 |
| P8 | ✅ Deadlines | Soft. Submissions accepted until `enrollments.ends_at`. After that the enrollment goes `EXPIRED` and submission is blocked. No auto-refund on expiry. | 01, 04 |

## 4. Scope

| # | Decision | Detail | Affects |
|---|---|---|---|
| P2 | ✅ "Interview experience" | **Cut entirely from MVP.** Ambiguous and product-sized. No placeholder page, no schema. Revisit post-revenue. | 01 |
| S1 | ✅ Code execution / auto-grading | **Cut.** Sandboxing, queues and egress control are a separate service and a separate product. Not designed for; the service seam in §6 makes it extractable later. | 01, 02, 05 |
| S2 | ✅ FAQs | Content lives in the repo (typed constants / MDX), **not** in the database. Removes one table and one admin screen. | 01, 04 |
| S3 | ✅ Testimonials | Cut from MVP. No real students exist yet; fabricated social proof is a credibility risk, which is the exact thing this product is selling against. | 01 |
| S4 | ✅ Notifications | MVP notifications are **transactional email only**. No in-app notification centre, no `notifications` table. | 01, 04 |
| S5 | ✅ Analytics | Admin overview = a handful of aggregate counts. No charting library, no analytics tables. | 01, 06 |
| C1 | ⚠️ Team & timeline | Assumed **solo build, ~7 weeks** to launch. Milestones in §8. If this is wrong, tell me and scope is recut. | 01 |
| C2 | ✅ Priority tiebreak | If polish and delivery machinery compete for time, **delivery machinery wins**. The homepage can be upgraded in week 9; refunds cannot. | 01, 03 |

## 5. Accounts, roles & access

| # | Decision | Detail | Affects |
|---|---|---|---|
| A1 | ✅ Account required | Yes — but signup is folded into **step 1 of the apply flow**. No separate "register first" wall. No guest applications (avoids account-merge bugs). | 01, 02, 06 |
| A2 | ✅ Login methods | **Google OAuth + GitHub OAuth + email/password.** GitHub is on-brand and pre-fills profile fields. | 02, 06 |
| A3 | ✅ Email verification | Required **before payment/enrollment**, not before applying. | 02, 06 |
| Ad1 | ✅ Roles | Two live roles: `STUDENT`, `ADMIN`. `REVIEWER` and `MENTOR` exist in the enum and permission matrix but are unassigned in MVP — they slot in without a migration. | 02, 04, 06 |
| Ad2 | ✅ Support channel | Email + a contact form landing in the admin panel (`contact_requests`). No Discord/WhatsApp in MVP. | 01, 04 |

## 6. Technology

All of these are argued in `02-TRD.md`. Listed here as locked outcomes.

| # | Decision | Detail |
|---|---|---|
| T1 | ✅ Architecture | **Full-stack Next.js (Option B).** No separate Express service. Business logic lives in a framework-agnostic `src/server/services/` layer so a worker service can be extracted later without a rewrite. Render is dropped. |
| T2 | ✅ Framework | Next.js 15 (App Router) · React 19 · TypeScript `strict` |
| T3 | ✅ Styling | Tailwind CSS v4, semantic CSS-variable tokens. No hardcoded colours in components. |
| T4 | ✅ Database | **Neon PostgreSQL** (pooled connection string + serverless driver) |
| T5 | ✅ ORM | **Drizzle ORM** — no query-engine binary, smaller cold starts on Vercel, SQL-shaped API that makes N+1 and index problems visible |
| T6 | ✅ Auth | **Better Auth** — first-class Drizzle adapter, built-in email/password + verification + OAuth + rate limiting, DB sessions. Not hand-rolled. |
| T7 | ✅ Validation | **Zod**, single schema per operation shared by client form and server handler |
| T8 | ✅ Payments | **Razorpay.** Webhook is the sole source of truth; client callbacks are UI hints only. |
| T9 | ✅ Email | **Resend + React Email** |
| T10 | ✅ Media | Cloudinary for **public** marketing/program imagery only. Private artifacts (certificates, offer letters) use authenticated delivery / signed URLs. |
| T11 | ✅ Monitoring | Sentry (errors) + Vercel Analytics (Web Vitals) |
| T12 | ✅ Animation | **GSAP + ScrollTrigger + Lenis** on marketing routes only, dynamically imported into client islands. Dashboards use CSS/Tailwind transitions and ship ~0 animation JS. Motion/Framer Motion is **not** used — shipping two animation runtimes for one job is unjustified. |
| T13 | ✅ Typography | Display/headings **Space Grotesk** · body/UI **Inter** · code/labels/metrics **JetBrains Mono**. Self-hosted via `next/font`. |
| T14 | ✅ Hosting | Vercel (app) · Neon (db) · Cloudinary (public media) · Resend (email) · Sentry |
| T15 | ✅ Rate limiting | Upstash Redis sliding window on auth, contact, application-submit and payment-order routes |

## 7. Non-negotiable engineering rules

1. **The Razorpay webhook is the only thing that may create an enrollment.** No client callback, no polling, no admin shortcut in the happy path.
2. **Every state change to an application is written to `application_status_history`.** No silent mutations.
3. **Money is stored as integer minor units** (paise) with an explicit currency column. Never floats.
4. **Every list endpoint is paginated.** No unbounded `SELECT *`.
5. **All external input is validated with Zod at the server boundary**, including webhook payloads after signature verification.
6. **No `any`.** `unknown` + narrowing at boundaries.
7. **Every animation respects `prefers-reduced-motion`** and is skipped, not merely shortened.
8. **Legal pages (Terms, Privacy, Refund) ship before the payment integration is activated** — the gateway requires them live.

## 8. Milestones (solo, ~7 weeks)

| # | Milestone | Contents | Gate |
|---|---|---|---|
| M0 | Foundation | Repo, TS strict, Tailwind tokens, Drizzle + Neon, env validation, CI lint/typecheck | — |
| M1 | Design system | Tokens, typography, theme toggle, primitives (button/input/card/badge/table/dialog/toast), empty + error + loading states | — |
| M2 | Marketing shell | Header, footer, Home, Programs, Program detail, How It Works, About, FAQ, Contact, **Legal pages** | — |
| M3 | Auth + profile | Better Auth, OAuth, verification, protected route middleware, profile page | — |
| M4 | Application flow | 3-step apply, autosave draft, submit, status history, student "My Applications", admin applications queue | — |
| M5 | Payments | Razorpay order, checkout, webhook + idempotency, receipts, enrollment creation, offer letter | 🔴 Pay1, Pay5 |
| M6 | Delivery | Task list, submissions, admin review queue, progress, certificate issue + `/verify/[code]` | 🔴 M2 (content) |
| M7 | Hardening | Rate limits, Sentry, a11y pass, Lighthouse budget, E2E on the four critical flows, seed + runbook | — |

Animation polish is layered onto M2 **after** M6 is functionally complete (per decision C2).

## 9. Explicit non-goals for MVP

Mock/AI interviews · in-browser code execution · auto-grading · plagiarism detection · mentor role · cohorts · live sessions · leaderboards · referrals · coupons · blog · in-app chat · mobile app · i18n · multi-currency · SSO for colleges · a public API.

## 10. Standing assumptions (flag if wrong)

1. Volume at launch is in the low hundreds of applications/month, not tens of thousands. Architecture is sized accordingly and deliberately not over-built.
2. All users are in India; single currency (INR), single timezone for display (IST), timestamps stored UTC.
3. The founder is both the sole admin and the sole reviewer at launch.
4. No existing brand assets, logo, or copy exist yet.
5. Task content (M2) will be authored in parallel with the build.
