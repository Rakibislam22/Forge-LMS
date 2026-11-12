# AGENTS.md — Forge LMS (Simplified Learning Management System)

You are the coding agent for **Forge LMS**, the DataPollex Ltd. industrial
training recruitment task ("Simplified LMS", 48 hours, MERN or PERN). The
design canvas is titled "Forge LMS" and its sources are in
`docs/reference/design-mockups/`.

The product has two panels:

- **Admin dashboard** (login required): create, list, edit, delete courses;
  add, list, edit, delete lectures of a course.
- **Student panel** (public): list courses, open a course, list its
  lectures, open a lecture and watch its embedded video.

It is an **assessment project**. It is judged on working core features,
clean MVC structure, real API-to-database integration, validation, error
handling, auth, responsive UI and honest documentation. It is not a
production LMS.

## Read first (every new session)

1. `docs/INDEX.md`, then the numbered docs `docs/01` … `docs/13`.
2. `docs/12-DEVELOPER-RULES.md` — coding, git, PR and review rules.
3. `docs/11-AGENT-EXECUTION-PLAN.md` — phases, exit criteria, owner
   decisions D1–D10, reporting format.
4. `docs/reference/` — the assessment PDF (authoritative) and the design
   mockups (references, not production code; the `.dc.html` files are the
   source of truth for tokens and layout).
5. `CHANGELOG.md` and `docs/decisions.md` (current state and answered
   decisions).

If a document and this file disagree, the stricter rule wins. If two
documents disagree with each other, or with the PDF, stop and ask the owner.

## Hard rules (never break)

1. **Scope.** Build only what the PDF requires. Student registration,
   payment, enrollment, PDF uploads and advanced progress tracking are
   explicitly not required: do not build them.
2. **Real data only.** All student-facing course and lecture data comes
   from the database through the API. No hardcoded course data in the
   frontend (the sample cards in the mockups are placeholders). Loading,
   empty and error states are required.
3. **MVC backend.** Separate routes, controllers and models. Routes wire,
   controllers handle HTTP, models own the data. No business logic in
   routes; no database calls in route files.
4. **Server-side auth.** Every create/update/delete endpoint for courses
   and lectures requires a valid admin JWT, verified on the server.
   Hiding buttons in the UI is not access control.
5. **Passwords and secrets.** Admin password is bcrypt-hashed. It is seeded
   from env vars; the plaintext never appears in source, logs or the
   changelog. `.env` is never committed; `.env.example` has placeholders
   only. The one documented test credential (see D4) is for evaluators and
   lives only in the README and the seed output.
6. **Validate everything.** Validate every request body and id on the
   server (schema validation, ObjectId check, URL protocol check). The
   client validates for UX; the server is the authority.
7. **Safe video embeds.** Lecture `videoUrl` accepts only hosts allowed in
   `docs/04-DATABASE.md` §4 (default YouTube and Vimeo), normalised to an
   embed URL. Never render a stored URL into an `<iframe>` unvalidated.
8. **Owner decisions.** Anything marked OWNER DECISION: use the documented
   default, record it as provisional, then ask. Do not guess silently.
9. **Honest status.** Do not call a phase complete unless every exit
   criterion is met. Anything unfinished is listed under "Known gaps" in
   the root README (the PDF asks for this).
10. **Changelog and review.** Every change adds a line under
    `[Unreleased]` in `CHANGELOG.md` in the same change. Areas listed in
    `docs/12-DEVELOPER-RULES.md` §8 (auth, password handling, JWT secret
    handling, video-URL validator, cascade delete, `AGENTS.md`/`.agents/**`)
    need human review; never treat your own approval as sufficient.

## Naming

Display name "Forge" (nav) / "Forge LMS" (docs, README, `<title>` suffix).
Repo and package slug `forge-lms`; workspaces `client` and `server`;
database name `forge_lms`. Do not use any other product name in code or UI.

## Stack (default; confirm in Phase 0, D1–D3)

React 18 + Vite + TypeScript · React Router · Tailwind CSS · Node.js LTS +
Express + TypeScript · MongoDB + Mongoose · zod validation · JWT
(`jsonwebtoken`) + bcrypt · Vitest/Jest + Supertest · ESLint + Prettier.
Pin versions; never use `latest`. A PERN variant (PostgreSQL) is allowed by
the PDF; if chosen, `docs/04-DATABASE.md` §7 gives the mapping.

## Working style

- Work in **small phases** (see plan). One phase at a time; test it; report.
- Before coding a module, re-read its doc section. Keep changes minimal and
  focused; do not refactor unrelated code.
- Prefer plain, boring, tested solutions over cleverness. The candidate
  must be able to explain every line (PDF §8).
- Prices are `Number >= 0` with at most 2 decimals, displayed as USD
  (`$49`) to match the design. Dates UTC in DB.
- Match the mockups: tokens, spacing, type, components. Mark missing
  designs `// design-gap` and reuse existing components.
- API responses use one envelope (`docs/05-API.md` §1) and correct HTTP
  status codes.

## Commands (create these in Phase 1; keep this list current)

```text
setup (install both workspaces) · dev (client + server) · seed · lint ·
typecheck · test · build · start
```

Run lint + typecheck + tests before declaring work done.

## When to stop and ask

- Any OWNER DECISION (D1–D10) without a recorded answer in
  `docs/decisions.md` that blocks work.
- A requested change would break a hard rule above or contradict the PDF.
- A test fails and you cannot explain why. Do not weaken or delete tests to
  make them pass.

## Reporting format (end of every phase)

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

## More agent config

Developer rules: `docs/12-DEVELOPER-RULES.md`. Change log: `CHANGELOG.md`.
Detailed, scoped guidance lives in `.agents/rules/` (standing rules),
`.agents/skills/` (task playbooks) and `.agents/workflows/` (step-by-step
procedures). `GEMINI.md` and `CLAUDE.md` point back here.
