# GEMINI.md — Forge LMS

This workspace is **Forge LMS**, the DataPollex Ltd. simplified Learning
Management System assessment. Your full instructions are in `AGENTS.md` at
the repository root. Read it completely before doing anything, then follow
`docs/11-AGENT-EXECUTION-PLAN.md`.

## Antigravity-specific notes

- Scoped rules: `.agents/rules/`. Task playbooks: `.agents/skills/`.
  Procedures: `.agents/workflows/`.
- Plan before acting. For each phase, write a short plan, wait for the
  owner's go-ahead when an OWNER DECISION is involved, then implement.
- Produce reviewable artifacts: the phase report (format in `AGENTS.md`),
  test output, and screenshots of UI work checked against
  `docs/reference/design-mockups/` at 1280 px and 390 px widths.
- Do not use the browser to sign in to third-party services, create
  accounts or enter payment details. Ask the owner to do that.
- Do not run terminal commands that deploy, delete data or touch anything
  outside this workspace without asking.

## Developer rules and changelog

Follow `docs/12-DEVELOPER-RULES.md`. Every change needs a line under
`[Unreleased]` in `CHANGELOG.md`; risky areas (auth, password handling,
video-URL validation, destructive deletes, agent config) need human review.

## The five rules to remember

1. Only what the PDF asks for: courses, lectures, admin login, student
   browse and watch. No registration, payment, enrollment, uploads or
   progress tracking.
2. All student-facing data comes from the API and database, never from
   hardcoded frontend data.
3. Management routes are protected on the **server**, not just hidden in
   the UI.
4. No secrets in the repo; the admin password is seeded from env, hashed.
5. Do not call the work done unless every exit criterion is met; document
   anything incomplete.
