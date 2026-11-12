# 12 — Developer Rules

These rules apply to **every contributor, human or agent**. If a rule
conflicts with `AGENTS.md`, the stricter one wins.

## 1. Language and tooling

| Topic | Rule |
|---|---|
| Language | TypeScript, `strict: true`, on client and server (D2) |
| Runtime | Node.js LTS, pinned in `.nvmrc` and `engines`; verify the current LTS when you set it |
| Package manager | npm workspaces (D10); commit the lockfile; never mix managers |
| Formatting | Prettier, one root config |
| Linting | ESLint with TypeScript rules; zero warnings on `main` |
| Versions | Pin dependencies; never `latest` |

## 2. Git workflow

-   `main` is always runnable. Work on branches: `feat/…`, `fix/…`,
    `docs/…`, `chore/…`, `phase-<n>/…`.
-   **Conventional Commits**, imperative, subject at most 72 chars, body
    explains why.
-   Small commits, one concern each. Commit early and often; the history
    is part of what the reviewers see.
-   Never commit: `.env`, keys, tokens, real personal data, build output,
    `node_modules`.

## 3. Pull request / hand-off checklist

```text
[ ] Linked requirement / phase
[ ] Tests added or updated; all pass
[ ] Lint, format and type checks pass
[ ] No secrets added
[ ] Hard rules in AGENTS.md respected
[ ] docs/05-API.md and 09-ENVIRONMENT.md updated if API or env changed
[ ] CHANGELOG.md updated under [Unreleased]
[ ] UI checked at 360 px and 1280 px against the mockup (if UI changed)
```

## 4. Code rules

-   Small functions, clear names, early returns, no dead code, no
    commented-out blocks, no `any` unless justified in a comment.
-   Comments explain **why**, not what.
-   One responsibility per file; follow the layout in
    `03-ARCHITECTURE.md`.
-   No business logic in routes; no HTTP concerns in models.
-   No magic strings for error codes: use a shared constant list.
-   Handle every promise; no unhandled rejections.
-   Do not log secrets, tokens or request bodies on auth routes.

## 5. API rules

-   Follow `05-API.md` exactly: envelope, status codes, error codes.
-   Validate with zod before the controller; `.strict()` bodies.
-   Update the API doc in the same change.

## 6. Frontend rules

-   Follow `06-UI-DESIGN-SPEC.md` tokens; no one-off colours or sizes.
-   One API wrapper; components never call `fetch` directly.
-   Every async screen handles loading, empty, error.
-   Keyboard and screen-reader basics are not optional.

## 7. Database rules

-   Mongoose validators mirror the zod schemas; both must agree with
    `04-DATABASE.md`.
-   Use `runValidators: true` on updates; add indexes listed in the doc.
-   Seed is idempotent and refuses remote DBs by default.

## 8. Areas that need human review

Auth and password handling, JWT secret and expiry handling, the
`requireAdmin` middleware, the video-URL validator, cascade delete logic,
CORS and rate-limit settings, `AGENTS.md`, `.agents/**`, CI config, major
dependency changes. An agent flags these in its plan and in the changelog
line, and never treats its own approval as sufficient.

## 9. Definition of done

A change is done when: code is written and formatted; tests are added and
green; lint and typecheck pass; docs and changelog are updated; the
behaviour was exercised against the real database or UI with real output
seen; and nothing in the hard rules is violated.

## 10. Honesty

-   Report failures. Never hide a failing test or an unfinished feature.
-   Unfinished work goes in the README "Known gaps".
-   Do not claim deployment, tests or screens work unless you ran them.
