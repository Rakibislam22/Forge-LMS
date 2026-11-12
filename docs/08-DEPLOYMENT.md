# 08 — Deployment

The PDF asks for a live demo "if feasible"; a working local project with
clear instructions is acceptable if deployment blocks you. Do not let
deployment consume the whole budget: time-box it (Phase 8).

## 1. Local run (must always work)

```text
git clone <repo> && cd forge-lms
cp .env.example .env            # fill MONGODB_URI, JWT_SECRET, ADMIN_*
npm run setup                   # installs client and server
npm run seed                    # admin + sample courses
npm run dev                     # client :5173, API :5000
```

MongoDB options: local `mongod`, Docker (`docker run -p 27017:27017 mongo:7`
with a pinned tag chosen in Phase 1), or a free hosted cluster.

## 2. Suggested hosting (D5, verify current free tiers yourself)

| Part | Option | Notes |
|---|---|---|
| Database | MongoDB Atlas free cluster | allow the API host's IPs or `0.0.0.0/0` for the demo only; use a dedicated DB user |
| API | Render, Railway or Fly.io | build `npm run build -w server`, start `node dist/server.js`; set env vars in the dashboard; health check `/api/health` |
| Client | Vercel or Netlify | build `npm run build -w client`; set `VITE_API_URL`; add SPA fallback (rewrite all paths to `index.html`) |

Check each provider's current docs and limits before relying on them and
note what you verified in the README. Free API tiers may cold-start; say so
in the README.

## 3. Production checklist

-   `NODE_ENV=production`; strong `JWT_SECRET` (32+ random chars).
-   `CLIENT_ORIGIN` set to the exact deployed client URL.
-   Seed run once against the hosted DB with `ALLOW_SEED_REMOTE=true`, then
    that flag unset.
-   HTTPS everywhere; no secrets in the client bundle (only
    `VITE_API_URL`).
-   Test in a private window: login, create, edit, delete, student watch.
-   README lists live URLs, admin credentials and the cold-start note.

## 4. Rollback and cleanup

Keep the previous deployment available until the new one passes the
checklist. After evaluation rotate the demo admin password or delete the
admin.
