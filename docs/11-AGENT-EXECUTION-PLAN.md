# 11 — Coding Agent Execution Plan

## Instructions to the coding agent

You are implementing Forge LMS as described in this documentation.

### Mandatory behavior

1.  Read every document in `docs/`, the root README, the assessment PDF
    and all mockups in `reference/` before coding.
2.  Build only the PDF's scope. Do not add registration, payment,
    enrollment, uploads or progress tracking.
3.  Backend follows MVC (routes, controllers, models) as in
    `03-ARCHITECTURE.md` §3.
4.  Student-facing data comes from the API and database only.
5.  Protect every management route on the server with JWT.
6.  Validate all input; handle all errors; show loading, empty and error
    states.
7.  Keep secrets out of source, logs and fixtures.
8.  Implement in small phases, test each phase, report exact files changed
    and commands executed.
9.  Do not claim a phase is complete if its exit criteria are not met.
10. Follow `12-DEVELOPER-RULES.md`; log every change in `CHANGELOG.md` and
    record answered decisions in `decisions.md`.
11. Where something is marked **OWNER DECISION**, use the documented
    default as provisional and ask.
12. Mockups are references: replicate tokens and layout; do not copy the
    generated runtime or sample data.

## Open owner decisions (ask early, in Phase 0)

| # | Decision | Default if the owner says "your call" |
|---|---|---|
| D1 | Stack: MERN (MongoDB) or PERN (PostgreSQL) | MERN |
| D2 | Language | TypeScript on client and server |
| D3 | Frontend: React + Vite or Next.js | React + Vite + React Router + Tailwind |
| D4 | Evaluator admin credentials and how they are shared | `ADMIN_EMAIL`/`ADMIN_PASSWORD` seeded; published in README for the demo only |
| D5 | Hosting for DB, API and client | Atlas free + Render/Railway + Vercel/Netlify; local-only if blocked |
| D6 | Token transport: Bearer in `localStorage` or httpOnly cookie | Bearer, `localStorage`, documented trade-off |
| D7 | Allowed video hosts | YouTube and Vimeo, normalised to embed URLs |
| D8 | Currency display | USD `$` as in the mockups |
| D9 | Lecture ordering UI (numeric `order` field, no drag-and-drop) | `order` auto-assigned; editable number optional |
| D10 | Package manager and monorepo style | npm workspaces (`client`, `server`), lockfile committed |

## Time budget (48 hours; plan for about 24–30 hours of work)

| Phase | Budget |
|---|---|
| 0 Discovery and decisions | 0.5 h |
| 1 Scaffold and tooling | 1.5 h |
| 2 Backend foundation: models, auth, seed | 3 h |
| 3 Backend CRUD, validation, tests | 4 h |
| 4 Frontend foundation | 3 h |
| 5 Student panel | 4 h |
| 6 Admin dashboard | 5 h |
| 7 Polish, responsive, accessibility, tests | 3 h |
| 8 Deploy, README, submission | 3 h |

## Phase 0 — Discovery and decisions

Read all docs and mockups; inspect the environment (Node version, Mongo
availability, git remote); ask D1–D10; record answers.
**Exit:** `docs/decisions.md` updated; plan for Phase 1 written.

## Phase 1 — Scaffold and tooling

Create `client/` and `server/`, root scripts, TypeScript, ESLint, Prettier,
Tailwind with the tokens, `.env.example`, `.gitignore` (includes `.env`),
Vitest setup, `/api/health`.
**Exit:** `npm run setup`, `dev`, `lint`, `typecheck`, `test`, `build` all
run; health endpoint answers; client renders a placeholder with the tokens.

## Phase 2 — Backend foundation

Env parsing, DB connection, models (Admin, Course, Lecture), `ApiError`,
`asyncHandler`, `errorHandler`, `notFound`, `validate`, login and `/auth/me`,
`requireAdmin`, rate limit, seed script.
**Exit:** seed works on an empty DB and is idempotent; login returns a JWT;
`/auth/me` works; 401 for bad tokens; tests green.

## Phase 3 — Backend CRUD and validation

Course and lecture endpoints, video URL normaliser, cascade delete,
`lectureCount`, `prev`/`next`, full Supertest suite.
**Exit:** every endpoint in `05-API.md` implemented and tested; every
protected route has a 401 test; invalid-id, 404 and validation cases pass.

## Phase 4 — Frontend foundation

API client, auth context, `useAsync`, routes, `StudentLayout`,
`AdminLayout`, base components (Button, fields, Card, Thumb, states,
ConfirmDialog, Toast), `ProtectedRoute`.
**Exit:** navigation between placeholder pages works; protected admin
routes redirect; state components render all three states in a demo route.

## Phase 5 — Student panel

Listing, course details with lectures, lecture player with prev/next and
sidebar, all with loading/empty/error states.
**Exit:** matches the student and mobile mockups at 1280 and 390 px; data
comes from the API; a seeded video plays; empty DB shows the empty state;
stopping the API shows the error state and retry works.

## Phase 6 — Admin dashboard

Login, courses table, create/edit form with thumbnail preview, delete
dialog, lectures page with add/edit/delete, logout, server field errors
mapped to inputs.
**Exit:** all FR-A1–A9 met with evidence; matches the admin mockups.

## Phase 7 — Polish and quality

Responsive pass (360/390/768/1280), accessibility pass (keyboard, focus,
contrast), toasts, copy review, code cleanup, frontend tests, README draft.
**Exit:** no horizontal scroll at 360 px; keyboard-only run through all
flows; lint, typecheck, tests green; requirements-check skill run.

## Phase 8 — Deploy and submit

Deploy (time-boxed), set env vars, run seed on the hosted DB, verify in a
private window, finish README (setup, credentials, live URLs, decisions,
known gaps), run the submission-check skill.
**Exit:** `13-SUBMISSION-CHECKLIST.md` fully ticked, or each unticked item
documented in "Known gaps". Hand the owner the repo link and demo details.

## Reporting format

```text
PHASE:
STATUS: Complete / Blocked / Needs owner input
DISCOVERIES:
FILES CREATED/UPDATED:
COMMANDS EXECUTED:
TESTS: Passed / Failed / Not run
RISKS / BLOCKERS:
OWNER ACTION REQUIRED:
NEXT PHASE:
```
