# CLAUDE.md — Forge LMS

@AGENTS.md

## Claude Code notes

- `AGENTS.md` above is the source of truth; keep this file short.
- Read `docs/11-AGENT-EXECUTION-PLAN.md` before the first edit of a session.
- Use plan mode for each new phase and for any change touching auth, the
  JWT middleware, password handling, or the video-URL validator.
- Follow `docs/12-DEVELOPER-RULES.md`; add a `CHANGELOG.md` entry under
  `[Unreleased]` for every change.
- Run the relevant tests after every meaningful change; show the real
  output, not a summary.
- Scoped rules are in `.agents/rules/*.md`; read the matching one before
  working in that area (backend, frontend, auth/security, testing).
- Task playbooks are in `.agents/skills/*/SKILL.md`; procedures are in
  `.agents/workflows/*.md`.
- Commit messages: imperative, small, one concern per commit. Never
  commit `.env`, secrets or real personal data.
