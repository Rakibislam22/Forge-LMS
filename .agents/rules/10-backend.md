# Backend rules (apply to `server/**`)

Spec: `docs/03-ARCHITECTURE.md`, `docs/04-DATABASE.md`, `docs/05-API.md`.

## Structure (MVC, mandatory)

```text
server/src/
  config/        env parsing (zod), db connection
  models/        Mongoose schemas: Admin, Course, Lecture
  controllers/   one file per resource: auth, course, lecture
  routes/        one file per resource; only wiring + middleware
  middleware/    auth (requireAdmin), validate, errorHandler, notFound
  validators/    zod schemas for bodies and params
  utils/         asyncHandler, ApiError, videoUrl, response helpers
  seed/          seed script (admin + sample courses + lectures)
  app.ts         Express app (no listen); server.ts starts it
```

## Rules

- Routes contain no logic. Controllers contain no query building beyond
  calling model methods. Models hold schema, indexes and small statics.
- Wrap async controllers in `asyncHandler`; throw `ApiError(status, code,
  message, details?)`; one `errorHandler` formats every error into the
  envelope. Never leak stack traces or Mongo error text in production.
- Validate body, params and query with zod via the `validate` middleware
  before the controller runs. Reject unknown fields (`.strict()`).
- Check `mongoose.isValidObjectId` for every `:id`; invalid -> 400
  `INVALID_ID`; valid but missing -> 404 `NOT_FOUND`.
- Deleting a course deletes its lectures in the same request (cascade).
  Prefer a transaction when the deployment supports it, otherwise delete
  lectures first, then the course, and test both paths.
- Use `helmet`, a restrictive `cors` origin list from env, JSON body limit
  (e.g. 100 kb) and a rate limit on `/api/auth/login`.
- Never trust the client for `courseId` on lecture update: lectures cannot
  be moved between courses unless the doc says so.
- Each endpoint returns the documented envelope and status code. Add or
  update `docs/05-API.md` in the same change.
