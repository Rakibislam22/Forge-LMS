# 07 — Authentication and Security

Human-review area. Keep it simple and correct.

## 1. Admin authentication

1.  `POST /api/auth/login` with `{ email, password }`.
2.  Server finds the admin by lower-cased email (with `passwordHash`
    selected), runs `bcrypt.compare`. On any failure return 401
    `UNAUTHENTICATED` with the same message either way.
3.  On success sign `{ sub: adminId, role: 'admin' }` with `JWT_SECRET`,
    algorithm `HS256`, expiry `JWT_EXPIRES_IN` (default `8h`).
4.  Client stores the token (D6 default: `localStorage`, with the trade-off
    noted in the README) and sends `Authorization: Bearer <token>`.
5.  `requireAdmin` verifies signature and expiry (algorithm pinned), loads
    nothing heavy, sets `req.admin`, and returns 401/403 as needed.
6.  On any 401 the client clears the token and redirects to
    `/admin/login`. `/admin/*` routes use `ProtectedRoute`; it checks for a
    token and calls `GET /api/auth/me` on load.

If the owner picks httpOnly cookies (D6 alternative), use `SameSite`,
`Secure` in production, CORS with credentials from one explicit origin, and
add CSRF protection for state-changing routes.

## 2. Seeded credentials

The seed creates the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The
evaluator credentials (D4) are published in the README only for the demo
deployment, and the password differs from any personal password. Rotate or
delete the demo admin after evaluation.

## 3. Threats and controls

| Threat | Control |
|---|---|
| Unauthorised CRUD | `requireAdmin` on every non-GET course/lecture route; 401 tests |
| Credential stuffing / brute force | rate limit on login (e.g. 10 per 15 min per IP) |
| Password leak | bcrypt hashes, `select: false`, never logged or returned |
| Weak JWT secret | min 32 chars enforced at startup; fail in production if default |
| NoSQL injection | zod schemas with typed fields, reject objects where strings are expected, `.strict()` |
| XSS | React escaping, no `dangerouslySetInnerHTML`, CSP-friendly iframes only from allowed hosts |
| Malicious embed / open redirect | video host allowlist + normalisation; `https` only; thumbnails `http(s)` only and rendered in `<img>` |
| CSRF | not applicable with Bearer headers; required if cookies are used |
| Info leakage | generic 500 messages in production, no stack traces, no Mongo errors to clients |
| CORS abuse | explicit `CLIENT_ORIGIN` list |
| Oversized bodies | `express.json({ limit: '100kb' })` |
| Header hardening | `helmet` |

## 4. Rules for agents

-   Never print or commit the real admin password or `JWT_SECRET`.
-   Do not add registration or "forgot password".
-   Do not weaken the login error message or rate limit.
-   Any change here is flagged for human review in the PR and changelog.
