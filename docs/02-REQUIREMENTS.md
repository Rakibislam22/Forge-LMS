# 02 — Requirements and Acceptance Criteria

Ids: **FR-A** admin, **FR-S** student, **FR-T** technical (PDF §6),
**FR-U** UI/UX (PDF §5), **FR-D** delivery (PDF §7). "Must" items are
required by the PDF.

## 1. Admin: course management (PDF §3A)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-A1 | Create a course with title, description, price, thumbnail URL (Must) | Form saves to the DB; new course appears in the admin list and the student listing. Invalid input shows field errors; nothing is saved. |
| FR-A2 | Display all courses in a card or table layout (Must) | Admin table shows thumbnail, title, price, lecture count, actions (Lectures, Edit, Delete) as in the Admin · Courses mockup. |
| FR-A3 | Edit an existing course (Must) | Edit form is pre-filled; saving updates the DB and the lists. |
| FR-A4 | Delete a course (Must) | Confirm dialog names the course; on confirm the course and its lectures are removed; list updates. Cancel changes nothing. |

## 2. Admin: lecture management (PDF §3B)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-A5 | Add a lecture to a selected course with title, description, video URL (Must) | "Add lecture" form on the Admin · Lectures page saves under that course; list updates. |
| FR-A6 | Display lectures with their course (Must) | Page header shows the course title and lecture count; lectures listed in order with number, title, URL. |
| FR-A7 | Edit and delete lectures (Must) | Edit pre-fills the form; delete asks for confirmation; both persist. |

## 3. Admin: access control (PDF §3C)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-A8 | Simple, working admin login (Must) | Valid credentials give a JWT and open the dashboard; invalid show "Incorrect email or password". |
| FR-A9 | Restrict management to authenticated admins (Must) | Without a valid token, every create/update/delete API call returns 401, and `/admin/*` screens redirect to login. Logout clears the session. |

## 4. Student panel (PDF §4)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-S1 | List all courses created by the admin (Must) | Grid shows every course from the DB with title, thumbnail, description, price. |
| FR-S2 | Open a course details page (Must) | Card links to `/courses/:id` showing thumbnail, title, description, price. |
| FR-S3 | List the course's lectures (Must) | Numbered list with title and short description; each row links to the lecture. |
| FR-S4 | Open a lecture and watch the embedded video (Must) | `/courses/:id/lectures/:lectureId` shows an iframe with the stored video, title, description, previous/next buttons and the course lecture list. |
| FR-S5 | No sign-up or payment | No such UI or endpoints exist. |

## 5. UI/UX (PDF §5)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-U1 | Responsive for desktop and mobile (Must) | No horizontal page scroll at 360, 390, 768, 1280 px; layouts match the mobile mockups. |
| FR-U2 | Clear navigation (Must) | Student nav: Forge logo, Courses, Admin login. Admin nav: Courses, View student site, Log out. Breadcrumbs on detail and lecture pages. |
| FR-U3 | Loading, empty and error states (Must) | Every data screen shows a skeleton/spinner, an empty state and an error state with retry (see the States mockup). |
| FR-U4 | Consistent layout, readable interface (Must) | Tokens from `06-UI-DESIGN-SPEC.md`; contrast at least 4.5:1; 44 px touch targets. |

## 6. Mandatory technical (PDF §6) and traceability

| Id | Requirement | Where | Evidence needed |
|---|---|---|---|
| FR-T1 | Working frontend-to-backend API integration | client `api/` -> server `/api` | Screens load real data; network tab shows calls |
| FR-T2 | Database persistence for courses and lectures | Mongoose models | Data survives restart |
| FR-T3 | Proper CRUD | `05-API.md` | Supertest suites |
| FR-T4 | Basic input validation and error handling | zod + errorHandler | Validation tests |
| FR-T5 | Admin authentication and protected routes | `requireAdmin` | 401 tests on every protected route |
| FR-T6 | Modular MVC backend | `03-ARCHITECTURE.md` §3 | Folder structure, no logic in routes |
| FR-T7 | Student data from the DB, not hardcoded | grep `client/src` | Requirements-check skill |

## 7. Delivery (PDF §7, §8)

| Id | Requirement | Acceptance criteria |
|---|---|---|
| FR-D1 | Source code in a GitHub or GitLab repo | Pushed; `.env` not tracked |
| FR-D2 | Live demo if feasible | Deployed URLs in README, or a documented reason |
| FR-D3 | Test credentials | Admin email/password in README, working on the demo |
| FR-D4 | Database setup | `npm run seed` plus instructions |
| FR-D5 | Local fallback with clear setup | README steps work from a clean clone |
| FR-D6 | Incomplete features documented | "Known gaps" section in README |

## 8. Non-functional

-   First contentful render under 3 s on a mid-range phone on 4G for the
    listing (images lazy-loaded).
-   API p95 under 300 ms locally for list endpoints with 100 courses.
-   No console errors on any happy path.
-   Code formatted (Prettier) and linted with zero warnings.
