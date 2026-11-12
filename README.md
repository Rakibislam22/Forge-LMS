# Forge LMS — Agent-ready repository skeleton

Drop this folder's contents at the **root of the project repository** and
open it in Claude Code, Antigravity or any agent that reads `AGENTS.md`.

Forge LMS is the DataPollex Ltd. recruitment task: a **simplified Learning
Management System** with an Admin dashboard (courses and lectures, behind a
login) and a public Student panel (browse courses, open a course, watch an
embedded lecture video). Time box: **2 days (48 hours)**.

```text
AGENTS.md                 main instructions (source of truth)
CHANGELOG.md              change log (Keep a Changelog format)
GEMINI.md                 Antigravity entry point, points to AGENTS.md
CLAUDE.md                 Claude Code entry point, imports AGENTS.md
.agents/
  rules/                  standing rules (each file well under 12,000 chars)
    00-guardrails.md  10-backend.md  20-frontend-ui.md
    30-auth-security.md  40-testing.md  50-changelog.md
  skills/                 task playbooks (SKILL.md per folder)
    phase-report/  requirements-check/  seed-data-check/
    changelog-entry/  submission-check/
  workflows/              step-by-step procedures
    start-phase.md  finish-phase.md  add-endpoint.md  update-changelog.md
docs/                     full specification (INDEX.md, 01–13, decisions.md)
  reference/              assessment PDF + design mockups (11 .dc.html screens)
```

## How to start

Tell the agent:

> Read AGENTS.md, then docs/INDEX.md and docs/11-AGENT-EXECUTION-PLAN.md.
> Start Phase 0 (discovery). Ask me the owner decisions D1–D10 before
> writing code, then build one phase at a time.

## Notes

- The design is a canvas titled **"Forge LMS"** (11 artboards: student
  listing, course details, lecture player, loading/empty/error states,
  3 mobile screens, admin login, courses, course form, lectures). Its
  `.dc.html` sources are in `docs/reference/design-mockups/`. They are
  references, not production code: copy tokens, spacing and layout into
  the project's own React components.
- The assessment PDF is in `docs/reference/`. Where any doc disagrees with
  the PDF, the PDF wins; stop and ask the owner.
- Default stack (changeable in Phase 0, see D1–D3): MERN with TypeScript,
  React + Vite + Tailwind CSS, Express, MongoDB + Mongoose, JWT admin auth.
- Rule activation (Antigravity customization panel): `00-guardrails.md`,
  `40-testing.md`, `50-changelog.md` always on; `10-backend.md` and
  `30-auth-security.md` for `server/**`; `20-frontend-ui.md` for `client/**`.
- Keep `AGENTS.md` current when commands or decisions change.
