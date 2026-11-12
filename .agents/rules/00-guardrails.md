# Guardrails (always on)

Applies to every task in this repository. Full detail: `AGENTS.md` and
`docs/07-AUTH-SECURITY.md`.

## Scope boundaries

- Build exactly the PDF's feature list (`docs/02-REQUIREMENTS.md`). Do not
  add student accounts, payments, enrollment, file uploads, progress
  tracking, comments, ratings or search "because it would be nice".
- Small extras that are cheap and safe (a lecture `order` field, a
  `lectureCount`, breadcrumbs) are allowed only when listed in the docs.
- Incomplete features are documented under "Known gaps" in the root
  README, never silently dropped.

## Data boundaries

- The student panel renders only API data. Hardcoded arrays of courses or
  lectures in `client/` are a defect (test data lives in `server/src/seed`
  and in test fixtures).
- Never put passwords, tokens or secrets in logs, URLs, error messages,
  the changelog or committed files.

## Verification before claiming

- Do not state that a library option or API behaves a certain way unless
  you checked the installed version's docs or ran it.
- Never report an endpoint or screen as done until you called it or opened
  it and saw it work against the real database.

## Safety defaults

- Deny by default on authorisation: a route is public only if listed as
  public in `docs/05-API.md`.
- No weakening, skipping or deleting tests to get green.
- No destructive commands (drop database, force-push, `rm -rf` outside
  build dirs) without owner approval. The seed script must refuse to run
  against a non-local database unless `ALLOW_SEED_REMOTE=true`.
