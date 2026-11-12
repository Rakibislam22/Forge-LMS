# 10 — Testing and Troubleshooting

## 1. Strategy

| Level | Tool | Scope |
|---|---|---|
| API integration | Vitest or Jest + Supertest, `mongodb-memory-server` or a throwaway DB | every endpoint in `05-API.md` |
| Unit | same runner | `videoUrl` normaliser, zod schemas, `ApiError` mapping |
| Component | Vitest + React Testing Library | forms, ConfirmDialog, states, ProtectedRoute |
| Manual | browser + curl | `13-SUBMISSION-CHECKLIST.md` |

## 2. Required backend cases

-   **Auth:** login ok -> token; wrong password and unknown email both
    return 401 with the same message; missing fields -> 400; rate limit ->
    429; `/auth/me` with and without token.
-   **Protected routes:** table-driven test that POST/PUT/DELETE on
    courses and lectures return 401 without a token and 401 with a
    garbage or expired token.
-   **Courses:** create ok; each invalid field rejected (short title,
    negative price, 3 decimals, bad thumbnail URL, unknown field); list
    newest first with `lectureCount`; get by id; invalid id -> 400;
    unknown id -> 404; update; delete cascades lectures.
-   **Lectures:** create under a course; unknown course -> 404; bad video
    host rejected; YouTube watch URL normalised to embed; order defaults to
    last + 1; list ordered; get with `prev`/`next`; update; delete.
-   **Public access:** all GET endpoints work without a token.
-   **Errors:** unknown route -> 404 envelope; malformed JSON -> 400;
    oversized body -> 413; no stack trace in production responses.

## 3. Required frontend cases

-   Course form shows inline errors and blocks submit on invalid input.
-   ConfirmDialog: Cancel does nothing, Confirm calls delete, Esc cancels.
-   Course list shows loading, empty, error (with retry) and data.
-   ProtectedRoute redirects to `/admin/login` without a token.
-   Lecture page disables Previous on the first and Next on the last.

## 4. Commands

```text
npm run lint · npm run typecheck · npm test · npm run build
```

Run all four before every phase report.

## 5. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| CORS error in browser | `CLIENT_ORIGIN` mismatch (scheme, port, trailing slash) | set the exact origin |
| 401 on every admin call | token missing, expired, or `JWT_SECRET` changed | log in again; check env |
| `ECONNREFUSED` to Mongo | DB not running or wrong URI / Atlas IP allow-list | start DB, fix URI |
| Blank page after deploy on refresh | missing SPA rewrite | add rewrite to `index.html` |
| Video does not render | host not allowed or site blocks embedding | use an embeddable URL; see `04-DATABASE.md` §4 |
| Images broken | non-direct image link | use a direct image URL; Thumb shows the fallback |
| Seed refuses to run | remote URI guard | set `ALLOW_SEED_REMOTE=true` once, deliberately |
| Cold start delay on free host | provider sleeps idle apps | note in README; retry |
