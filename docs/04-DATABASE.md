# 04 — Database Design

Default: MongoDB with Mongoose. Database name `forge_lms`.

## 1. Collections

### admins
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | |
| `email` | String | required, unique, lower-cased, valid email |
| `passwordHash` | String | required, bcrypt; `select: false` |
| `role` | String | `'admin'` (only value) |
| `createdAt`, `updatedAt` | Date | timestamps |

### courses
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | required, trimmed, 3–120 chars |
| `description` | String | required, trimmed, 10–2000 chars |
| `price` | Number | required, `>= 0`, max 2 decimals, max 100000 |
| `thumbnailUrl` | String | required, `http(s)` URL, max 500 chars |
| `createdAt`, `updatedAt` | Date | timestamps |

Index: `createdAt: -1` for the listing.

### lectures
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | |
| `course` | ObjectId -> courses | required, indexed |
| `title` | String | required, trimmed, 3–120 chars |
| `description` | String | required, trimmed, 5–1000 chars |
| `videoUrl` | String | required, valid per §4 |
| `order` | Number | integer >= 1; default = last order + 1 |
| `createdAt`, `updatedAt` | Date | timestamps |

Index: `{ course: 1, order: 1 }`.

## 2. Relationships

One course has many lectures (`lectures.course`). A lecture belongs to
exactly one course and cannot be moved. Deleting a course deletes its
lectures (controller-level cascade, `10-backend.md`).

## 3. Derived values

`lectureCount` on course list/detail responses is computed with an
aggregation (`$lookup` + `$size`) or `countDocuments` per course. It is not
stored.

## 4. Video URL rules (human-review area)

-   Must parse as a URL with protocol `https:`.
-   Allowed hosts (default, D7): `www.youtube.com`, `youtube.com`,
    `m.youtube.com`, `youtu.be`, `www.youtube-nocookie.com`,
    `player.vimeo.com`, `vimeo.com`.
-   `utils/videoUrl.ts` **normalises** to an embed URL and stores that:
    -   `https://www.youtube.com/watch?v=ID` or `https://youtu.be/ID` ->
        `https://www.youtube.com/embed/ID`
    -   `https://vimeo.com/ID` -> `https://player.vimeo.com/video/ID`
    -   Embed URLs are accepted as-is after host and path checks.
-   Video ids must match `^[A-Za-z0-9_-]{6,20}$` (YouTube) or `^\d+$`
    (Vimeo).
-   Anything else is a 400 `VALIDATION_ERROR` on `videoUrl`.

## 5. Constraints and integrity

-   Unique index on `admins.email`.
-   Validators run on create and on update (`runValidators: true`).
-   Use `findByIdAndUpdate(..., { new: true, runValidators: true })`.

## 6. Seed data

`npm run seed` creates (idempotently):

-   1 admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (upsert by email).
-   6 courses with the same titles, descriptions and prices as the
    mockups (MERN $49, TypeScript $29, REST API $34, PostgreSQL $39,
    React $44, Git $19), each with a stable public thumbnail URL.
-   Each course gets 4–8 lectures with real, embeddable video URLs
    (verify each loads before committing).
-   Re-running resets seeded courses by title (upsert) and never creates
    duplicates. It refuses a non-local `MONGODB_URI` unless
    `ALLOW_SEED_REMOTE=true`.

## 7. PERN variant (only if D1 chooses PostgreSQL)

Same entities as tables `admins`, `courses`, `lectures` with
`id uuid` or `bigserial`, `price numeric(10,2) check (price >= 0)`,
`lectures.course_id references courses(id) on delete cascade`,
`unique (course_id, "order")` deferred. Use a query builder or ORM chosen
in Phase 0 (Prisma, Drizzle or `pg`), forward-only migrations, and the
same API contract. Cascade then comes from the FK.
