---
name: seed-data-check
description: Use when creating or changing the seed script, or before submission, to verify the database setup and test credentials work from a clean database.
---

# Seed data check

## Goal
The PDF requires seed data or setup instructions and test credentials.
Prove a fresh clone can get a working app in minutes.

## Steps
1. Point the server at an empty database (new name) via `.env`.
2. Run `npm run seed`. Expect: one admin (from `ADMIN_EMAIL` /
   `ADMIN_PASSWORD`), 6 courses and their lectures matching
   `docs/04-DATABASE.md` §6.
3. Run the seed a second time: it must be idempotent (no duplicate admin,
   no duplicate courses; document whether it resets or upserts).
4. Log in as the admin through the real UI and through curl; call a
   protected route with the token.
5. Open the student listing: all seeded courses appear with title,
   thumbnail, description and price; each course shows its lectures; each
   lecture's video embeds.
6. Confirm the seed refuses a non-local `MONGODB_URI` unless
   `ALLOW_SEED_REMOTE=true`.
7. Confirm the README lists the exact credentials and commands.

## Constraints
- Seed data is synthetic. Thumbnail and video URLs must be public,
  stable, embeddable links; verify each loads.
- Never print the password hash.
