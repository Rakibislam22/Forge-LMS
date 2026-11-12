# 05 — API Specification

Base path `/api`. JSON in, JSON out. Public means no token needed.

## 1. Envelope and errors

Success:

```json
{ "success": true, "data": { } }
```

Failure:

```json
{ "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "Invalid input",
             "details": [ { "field": "price", "message": "Price must be 0 or more." } ] } }
```

| HTTP | `code` | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | body/params/query fail schema (with `details`) |
| 400 | `INVALID_ID` | `:id` is not a valid ObjectId |
| 401 | `UNAUTHENTICATED` | missing, malformed, invalid or expired token; bad login |
| 403 | `FORBIDDEN` | token valid but role is not `admin` |
| 404 | `NOT_FOUND` | resource or route does not exist |
| 413 | `PAYLOAD_TOO_LARGE` | body over the limit |
| 429 | `RATE_LIMITED` | too many login attempts |
| 500 | `INTERNAL_ERROR` | unexpected; message is generic in production |

Status codes: `200` ok, `201` created, `204` not used (deletes return 200
with `{ "data": { "deleted": true } }` so the client handles one shape).

## 2. Resource shapes

```ts
Course  = { id, title, description, price, thumbnailUrl, lectureCount, createdAt, updatedAt }
Lecture = { id, courseId, title, description, videoUrl, order, createdAt, updatedAt }
Admin   = { id, email, role }
```

## 3. Auth

| Method & path | Access | Body | Success | Errors |
|---|---|---|---|---|
| `POST /api/auth/login` | public, rate-limited | `{ email, password }` | `200 { token, admin }` | 400, 401 (generic message), 429 |
| `GET /api/auth/me` | admin | — | `200 { admin }` | 401 |

There is no register, reset or refresh endpoint. Logout is client-side
(discard the token).

## 4. Courses

| Method & path | Access | Body | Success | Errors |
|---|---|---|---|---|
| `GET /api/courses` | public | — | `200 { courses: Course[] }` newest first | 500 |
| `GET /api/courses/:id` | public | — | `200 { course: Course }` | 400, 404 |
| `POST /api/courses` | admin | `{ title, description, price, thumbnailUrl }` | `201 { course }` | 400, 401 |
| `PUT /api/courses/:id` | admin | same as POST (full replace of editable fields) | `200 { course }` | 400, 401, 404 |
| `DELETE /api/courses/:id` | admin | — | `200 { deleted: true, lecturesDeleted: n }` | 400, 401, 404 |

Body rules follow `04-DATABASE.md` §1; unknown fields are rejected.

## 5. Lectures

| Method & path | Access | Body | Success | Errors |
|---|---|---|---|---|
| `GET /api/courses/:courseId/lectures` | public | — | `200 { lectures: Lecture[] }` ordered | 400, 404 (course) |
| `GET /api/lectures/:id` | public | — | `200 { lecture, course: {id,title}, prev: {id,title}\|null, next: {id,title}\|null }` | 400, 404 |
| `POST /api/courses/:courseId/lectures` | admin | `{ title, description, videoUrl, order? }` | `201 { lecture }` | 400, 401, 404 |
| `PUT /api/lectures/:id` | admin | `{ title, description, videoUrl, order? }` | `200 { lecture }` | 400, 401, 404 |
| `DELETE /api/lectures/:id` | admin | — | `200 { deleted: true }` | 400, 401, 404 |

`videoUrl` is validated and normalised to an embed URL (`04-DATABASE.md`
§4); the response returns the normalised value. `prev`/`next` let the
lecture page build its buttons with one call.

## 6. Health

`GET /api/health` -> `200 { status: "ok" }` (public; used by the host).

## 7. Conventions

-   Authorization header: `Authorization: Bearer <token>`.
-   List endpoints are not paginated (assessment scale). If the owner asks,
    add `?page=&limit=` later and record it in the changelog.
-   Every protected route is covered by a test asserting 401 without a
    token.
-   Keep this file in sync with the code in the same change.
