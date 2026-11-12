# Changelog

All notable changes to **Forge LMS** and its project documentation are
recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the application
follows [Semantic Versioning](https://semver.org/). Dates are `YYYY-MM-DD`
in `Asia/Dhaka`.

## How to write an entry

-   Add entries under `[Unreleased]` in the **same commit or pull request**
    as the change. One line per change, written for a reader who did not
    see the code: what changed and why it matters.
-   Categories: **Added**, **Changed**, **Deprecated**, **Removed**,
    **Fixed**, **Security**, **Breaking**, **Decisions** (an OWNER DECISION
    was answered), **Docs**.
-   Link the requirement or phase when useful, e.g. `(FR-A3, Phase 6)`.
-   Never put secrets, passwords or tokens in an entry.
-   At release, rename `[Unreleased]` to the version and date and start a
    new empty `[Unreleased]`.

---

## [Unreleased]

### Added
-   Dedicated Student Dashboard page (`/dashboard`) in `forge-lms-frontend`: Quick "Continue Watching" resume card powered by browser `localStorage`, learning metrics overview, recent watch history, and course catalog search.
-   Enhanced educational Landing Page (`/`) in `forge-lms-frontend`: Hero banner with action CTAs, category filter tabs (Full-Stack, Backend, Frontend, Databases), live search, platform stats, and "Why Forge LMS" value section.
-   Direct Frontend-to-Backend API integration: Configured `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `forge-lms-frontend/.env.local`, with dynamic CORS handling in `forge-lms-backend/src/app.ts`.
-   Verified live MongoDB database seed in `forge-lms-backend` with 6 courses, 12 lectures, and admin account.
-   Complete student panel in `forge-lms-frontend`: Course details page (`/courses/[id]`), Lecture player page with safe embed and playlist (`/courses/[id]/lectures/[lectureId]`), and responsive navigation Header with mobile drawer.
-   Complete admin dashboard in `forge-lms-frontend`: Admin login (`/admin/login`), AdminSidebar, Courses table with delete confirmation modal (`/admin/courses`), Course create & edit forms with live preview (`/admin/courses/new`, `/edit`), and Course lecture manager (`/admin/courses/[id]/lectures`).
-   Complete Express + TypeScript MVC backend in `forge-lms-backend`: Mongoose models (`Admin`, `Course`, `Lecture`), auth controller with bcrypt + JWT, course and lecture controllers with cascade delete, rate-limiting, Zod request validators, and database seed script (`src/seed/seed.ts`).
-   Student course listing page in `forge-lms-frontend` (FR-S1): Header, CourseCard with geometric fallback palettes, responsive grid, API route (`/api/courses`), and loading/empty/error states matching `States.dc.html`.
-   Agent setup for Forge LMS: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
    `.agents/` rules, skills and workflows, and the full specification in
    `docs/` (01–13, decisions log).
-   `docs/reference/`: DataPollex assessment PDF and the "Forge LMS" design
    mockups (11 screens: student, mobile, states, admin).

### Fixed
-   Cached `useSyncExternalStore` snapshot results (`cachedHistoryValue`, `cachedLastWatchedValue`) in `src/app/dashboard/page.tsx` against raw local storage string equality, preventing React 19 infinite re-render loop error (`The result of getSnapshot should be cached to avoid an infinite loop`).
-   Configured `@tailwindcss/postcss` and PostCSS in `forge-lms-frontend` and switched build/dev scripts to `--webpack` mode, resolving Turbopack Windows process panic and unstyled CSS rendering.
-   Restored `@tailwindcss/turbopack` CSS loader rule in `next.config.ts`, ensuring Turbopack compiles Tailwind utility classes and styles the course listing correctly.
-   Added inline attribute-interceptor script in `src/app/layout.tsx` to prevent browser extensions from injecting `bis_skin_checked` into Next.js internal `<MetadataWrapper>` hidden DOM nodes.
-   Replaced non-standard `@theme` at-rule in `src/app/globals.css` with standard CSS custom properties and utility classes, completely eliminating PostCSS/Turbopack `Unknown at rule: @theme` parsing warnings.
-   Resolved browser extension hydration mismatch (`bis_skin_checked="1"`) by implementing React 19 `useSyncExternalStore` client mount boundary in `src/app/page.tsx` with `suppressHydrationWarning`.

### Decisions
-   D1–D10 opened in `docs/decisions.md`; defaults documented, none
    answered yet.
