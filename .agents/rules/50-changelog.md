# Changelog and developer rules (always on)

Full rules: `docs/12-DEVELOPER-RULES.md`. Log: `CHANGELOG.md`.

## Before you start any change

- Read `docs/12-DEVELOPER-RULES.md` §4 (code), §8 (areas needing human
  review) and §9 (definition of done).
- If the change touches an area in §8, say so in your plan and do not
  treat your own approval as sufficient review.

## For every change you make

1. Add a line under `[Unreleased]` in `CHANGELOG.md` in the same change.
   One plain-language line: what changed and why it matters.
2. Pick the category: Added, Changed, Deprecated, Removed, Fixed,
   Security, Breaking, Decisions, Docs.
3. Use **Decisions** when an OWNER DECISION is answered: also add the row
   to `docs/decisions.md`.
4. Link the requirement or phase, e.g. `(FR-S4, Phase 5)`.

## Never

- Put secrets or passwords in a changelog entry or commit message.
- Rewrite or delete past released entries; add a new entry instead.
- Change `AGENTS.md`, `.agents/**`, CI config or major dependency
  versions without logging it and flagging it for human review.

## Commits

- Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`,
  `chore:`); small, one concern each; imperative subject, 72 chars max.
- Branch names: `feat/…`, `fix/…`, `docs/…`, `chore/…`, `phase-<n>/…`.
