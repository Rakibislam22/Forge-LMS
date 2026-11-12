# 13 — Submission Checklist

Mirrors PDF §7 and §8. Tick each item with evidence; unticked items go into
the README "Known gaps".

## A. Source code (FR-D1)
- [ ] Repository on GitHub or GitLab, up to date, readable history
- [ ] `.env` not tracked; `.env.example` present
- [ ] Lockfile committed; `node_modules` and build output ignored
- [ ] Root README has: overview, stack, setup, scripts, structure, env
      table, API summary link, decisions, known gaps

## B. Live demo (FR-D2)
- [ ] DB, API and client deployed; URLs in README
- [ ] Private-window run-through passes (below)
- [ ] Cold-start behaviour of free hosting noted
- [ ] If not deployed: reason stated, local instructions verified

## C. Test credentials (FR-D3)
- [ ] Admin email and password listed in README
- [ ] They work on the deployed app and locally after seeding

## D. Database setup (FR-D4, FR-D5)
- [ ] `npm run seed` documented and idempotent
- [ ] Clean-clone run: setup -> seed -> dev works in under 10 minutes
- [ ] Seed has 6 courses with lectures and working video/thumbnail URLs

## E. Functional run-through (as an evaluator)
- [ ] Student: listing -> course -> lecture -> video plays, no login
- [ ] Student: prev/next lecture, breadcrumbs work
- [ ] Student: empty and error states appear (empty DB, API stopped)
- [ ] Admin: wrong password shows error; right password opens dashboard
- [ ] Admin: create, edit, delete course; invalid input shows errors
- [ ] Admin: add, edit, delete lecture; bad video host rejected
- [ ] Admin: deleting a course removes its lectures
- [ ] Admin: logout; `/admin/courses` redirects to login
- [ ] API: protected routes return 401 without a token (curl)
- [ ] Mobile (390 px) and desktop (1280 px) both usable

## F. Quality
- [ ] lint, typecheck, tests, build all pass (real output kept)
- [ ] No hardcoded student data in `client/src`
- [ ] MVC structure visible; no logic in routes
- [ ] Candidate can explain: folder structure, auth flow, validation,
      video URL handling, cascade delete, key trade-offs

## G. Hand-off
- [ ] Submission form (link in the PDF) filled by the candidate with repo
      link, live URLs and credentials
