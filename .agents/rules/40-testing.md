# Testing rules (always on)

Spec: `docs/10-TESTING.md`.

- Write or update tests in the same change as the code.
- Backend: Supertest against the Express app with an in-memory or
  throwaway test database. Cover each endpoint's success, validation
  failure, not-found, and (for admin routes) missing-token cases.
- Required backend cases: login ok/fail; 401 without token on every
  protected route; course CRUD; lecture CRUD under a course; cascade
  delete; invalid ObjectId; negative price rejected; bad video host
  rejected; public GETs work without a token.
- Frontend: component tests for forms (validation messages), the confirm
  dialog, and the loading/empty/error states; one smoke test per page.
- Run lint, typecheck and tests before declaring done; paste real output.
- Do not delete, skip or loosen a test to make it pass. If a test is
  wrong, fix it and explain why in the commit.
- Manual check before submission: `docs/13-SUBMISSION-CHECKLIST.md`.
