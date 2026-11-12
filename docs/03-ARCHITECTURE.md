# 03 — Architecture

## 1. Overview

```text
Browser (React SPA)  --HTTPS/JSON-->  Express API  --Mongoose-->  MongoDB
   student pages (public)               /api/courses, /api/lectures
   admin pages (JWT)                    /api/auth/login, /api/auth/me
```

Two deployables in one repository: `client/` (static SPA) and `server/`
(Node API). The client talks to the API only through `client/src/api`.

## 2. Repository layout

```text
forge-lms/
  AGENTS.md  CLAUDE.md  GEMINI.md  CHANGELOG.md  README.md
  .agents/  docs/
  client/        React + Vite + TS + Tailwind
  server/        Express + TS + Mongoose
  package.json   root scripts (setup, dev, seed, lint, test, build)
  .env.example   documented in 09-ENVIRONMENT.md
```

## 3. Backend (MVC)

```text
server/src/
  config/env.ts        zod-parsed env; fails fast on bad config
  config/db.ts         mongoose.connect with clear logging
  models/              Admin.ts  Course.ts  Lecture.ts
  controllers/         auth.controller.ts  course.controller.ts  lecture.controller.ts
  routes/              auth.routes.ts  course.routes.ts  lecture.routes.ts  index.ts
  middleware/          requireAdmin.ts  validate.ts  errorHandler.ts  notFound.ts  rateLimit.ts
  validators/          auth.schema.ts  course.schema.ts  lecture.schema.ts
  utils/               ApiError.ts  asyncHandler.ts  videoUrl.ts  respond.ts
  seed/seed.ts
  app.ts  server.ts
```

Request flow: `route -> (rateLimit) -> (requireAdmin) -> validate(schema) ->
controller -> model -> respond | ApiError -> errorHandler`.

| Layer | Owns | Must not |
|---|---|---|
| Route | Path, method, middleware order | Contain logic or queries |
| Controller | Read validated input, call models, shape the response | Parse raw input, format errors |
| Model | Schema, indexes, small statics/virtuals | Know about HTTP |
| Middleware | Cross-cutting: auth, validation, errors | Contain resource logic |

## 4. Frontend

```text
client/src/
  main.tsx  App.tsx
  api/          http.ts (fetch wrapper)  courses.ts  lectures.ts  auth.ts
  components/   see 06-UI-DESIGN-SPEC.md §4
  layouts/      StudentLayout.tsx  AdminLayout.tsx
  pages/student/  CourseListPage  CourseDetailPage  LecturePage
  pages/admin/    LoginPage  CoursesPage  CourseFormPage  LecturesPage
  hooks/        useAuth  useAsync
  routes/       index.tsx  ProtectedRoute.tsx
  types/        api.ts
```

Routes:

| Path | Page | Access |
|---|---|---|
| `/` | Course listing | public |
| `/courses/:courseId` | Course details + lectures | public |
| `/courses/:courseId/lectures/:lectureId` | Lecture player | public |
| `/admin/login` | Admin login | public |
| `/admin` -> `/admin/courses` | Courses table | admin |
| `/admin/courses/new`, `/admin/courses/:courseId/edit` | Course form | admin |
| `/admin/courses/:courseId/lectures` | Lecture management | admin |
| `*` | Not found | public |

State: server state is fetched per page with `useAsync` (loading, data,
error, reload). Auth state (`token`, `admin`) lives in a small context.
No global store is needed.

## 5. Cross-cutting decisions

| Topic | Decision |
|---|---|
| Ids | Mongo ObjectId strings in URLs |
| Auth transport | `Authorization: Bearer <jwt>` (D6) |
| Errors | One JSON envelope, stable error codes (`05-API.md` §1) |
| Cascade | Deleting a course deletes its lectures |
| Ordering | Lectures sorted by `order` then `createdAt` |
| Config | Env only; `.env.example` committed |
| Logging | `morgan` in dev; never log bodies on auth routes |
