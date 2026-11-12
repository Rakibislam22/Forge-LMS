---
name: submission-check
description: Use in the final phase to verify everything the assessment asks the candidate to submit is ready and works.
---

# Submission check

## Goal
Confirm the four submission items in the PDF §7 and the instructions in §8.

## Steps
1. Follow `docs/13-SUBMISSION-CHECKLIST.md` line by line.
2. Source code: repository is pushed, `.env` is not tracked
   (`git ls-files | grep -i '^\.env$'` is empty), lockfiles committed.
3. Live demo: open the deployed student URL and the admin URL in a private
   window; verify login, create a course, add a lecture, watch it as a
   student, delete both. Note the URLs in the README.
4. Test credentials: README has admin email and password; they work on the
   deployed app.
5. Database setup: README documents the seed command and the env vars.
6. Local fallback: a clean clone runs with the README steps only.
7. README has "Known gaps" (honest list) and "Technical decisions" (the
   candidate must be able to explain them).
8. Save the result in `docs/reports/submission-check.md`.

## Constraints
- Do not submit the form yourself; hand the owner the link and the
  checklist result.
