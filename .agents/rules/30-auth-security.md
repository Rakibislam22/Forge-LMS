# Auth and security rules (apply to `server/**`, admin screens)

Spec: `docs/07-AUTH-SECURITY.md`. This is a human-review area.

- One role: `admin`. No public registration endpoint exists.
- Passwords: bcrypt (cost 10–12), compared with `bcrypt.compare`. Never
  store, log or return a password or hash.
- JWT: signed with `JWT_SECRET` (min 32 chars, checked at startup), short
  expiry (default 8 h), payload `{ sub, role }` only. Verify with the
  algorithm pinned. `requireAdmin` returns 401 for missing/invalid/expired
  tokens and 403 if the role is not `admin`.
- Login errors are generic ("Incorrect email or password") and identical
  for unknown email and wrong password. Rate-limit login.
- Every non-GET route under `/api/courses` and `/api/lectures` uses
  `requireAdmin`. Add a test that each such route returns 401 without a
  token.
- CORS: explicit origins from `CLIENT_ORIGIN`; no `*` with credentials.
- Do not render user-supplied text as HTML. React escapes by default; never
  use `dangerouslySetInnerHTML`.
- Never log request bodies on auth routes.
- Secrets only from env. The server refuses to start in production with a
  missing or default `JWT_SECRET`.
