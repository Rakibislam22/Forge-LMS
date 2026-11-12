---
name: requirements-check
description: Use before declaring any phase or the whole project done, to trace every requirement in the assessment PDF to working code, a test and a screen.
---

# Requirements check

## Goal
Prove each requirement in `docs/02-REQUIREMENTS.md` (which mirrors the PDF)
is met, not merely implemented.

## Steps
1. Open `docs/02-REQUIREMENTS.md` and the traceability table in §6.
2. For each FR id, fill a row: endpoint or page, test name, and evidence
   (curl output or screenshot). Run the app against the real database.
3. Check the mandatory technical list (PDF §6): API integration, DB
   persistence, CRUD, validation and error handling, admin auth with
   protected routes, MVC backend, no hardcoded student data.
4. Grep `client/src` for hardcoded course/lecture arrays; each hit is a
   defect.
5. Try the unhappy paths: no token, bad token, bad id, negative price,
   bad video host, empty course list, API offline.
6. Mark each row Met / Partial / Not met. Anything not Met goes into the
   README "Known gaps".
7. Save as `docs/reports/requirements-check.md`.

## Constraints
- "Implemented" is not "met". Met needs evidence from this session.
