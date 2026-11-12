# Title: add-endpoint
# Description: Add or change an API endpoint following MVC, validation, auth and test rules.

Step 1: Check `docs/05-API.md`. If the endpoint is not listed, add it
there first (method, path, auth, body, responses, errors).

Step 2: Add the zod schema in `server/src/validators/`.

Step 3: Add or extend the controller function in
`server/src/controllers/`. Throw `ApiError` for expected failures; wrap
with `asyncHandler`.

Step 4: Wire the route in `server/src/routes/` with `validate(...)` and,
for non-GET course/lecture routes, `requireAdmin`.

Step 5: Add Supertest cases: success, validation failure, not found,
invalid id, and 401 without a token for protected routes.

Step 6: Update the client API module and types if a screen uses it.

Step 7: Add a `CHANGELOG.md` line. Flag auth-related changes for human
review.
