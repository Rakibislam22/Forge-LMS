# 09 — Environment Variable Reference

`.env.example` (committed, placeholders only). Never commit `.env`.

## Server

| Variable | Required | Example / default | Notes |
|---|---|---|---|
| `NODE_ENV` | no | `development` | `production` enables strict checks |
| `PORT` | no | `5000` | |
| `MONGODB_URI` | yes | `mongodb://127.0.0.1:27017/forge_lms` | seed refuses remote URIs without the flag below |
| `JWT_SECRET` | yes | `change-me-to-32+-random-characters` | min 32 chars; fail in production if default |
| `JWT_EXPIRES_IN` | no | `8h` | |
| `CLIENT_ORIGIN` | yes | `http://localhost:5173` | comma-separated list allowed |
| `ADMIN_EMAIL` | seed | `admin@example.com` | |
| `ADMIN_PASSWORD` | seed | `ChangeMe123!` | placeholder only |
| `BCRYPT_ROUNDS` | no | `10` | |
| `LOGIN_RATE_LIMIT_MAX` | no | `10` | per 15 min per IP |
| `ALLOW_SEED_REMOTE` | no | `false` | set `true` once for the hosted DB |

## Client (Vite)

| Variable | Required | Example | Notes |
|---|---|---|---|
| `VITE_API_URL` | yes | `http://localhost:5000/api` | the only value exposed to the browser |

## Rules

-   Parse and validate env with zod in `server/src/config/env.ts`; exit
    with a clear message on error.
-   Anything prefixed `VITE_` is public: never put a secret in it.
-   Document every new variable here and in `.env.example` in the same
    change.
