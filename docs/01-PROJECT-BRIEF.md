# 01 — Project Brief

## 1. Context

DataPollex Ltd. (Mirpur 10, Dhaka) runs an industrial training recruitment
process. The recruitment task is to build a **Simplified Learning
Management System (LMS)** in two days. Project type: full-stack web
application, MERN or PERN. Reviewers will read the code, run the app,
and ask the candidate to explain technical decisions.

## 2. Product summary

**Forge** is a small LMS with two panels.

| Panel | Who | What they do |
|---|---|---|
| Admin dashboard | Administrator (logged in) | Create, view, edit, delete courses. Add, view, edit, delete lectures of a course. |
| Student panel | Anyone (no account) | Browse all courses, open a course, see its lectures, open a lecture and watch its embedded video. |

## 3. Users and access

-   **Student (public visitor).** No registration or login. Read-only
    access to courses and lectures.
-   **Admin.** One seeded account. Logs in with email and password and
    receives a JWT. Only admins may create, edit or delete.

## 4. In scope (from the PDF)

-   Course CRUD: title, description, price, thumbnail URL.
-   Lecture CRUD under a course: title, description, video URL.
-   Admin login and protected management routes.
-   Student course listing, course details with lectures, lecture page with
    embedded video.
-   Responsive UI, navigation, loading/empty/error states.
-   Validation, error handling, MVC backend, database persistence.
-   Seed data, test credentials, setup instructions, live demo if feasible.

## 5. Out of scope (explicitly not required)

Student registration and login, payment, enrollment, PDF or file uploads,
advanced progress tracking. Also out of scope unless the owner asks:
search, categories, ratings, comments, multi-admin management, password
reset, internationalisation, dark mode.

## 6. Success criteria

1.  An evaluator can log in as admin and complete every CRUD flow.
2.  An anonymous visitor can reach a lecture video from the listing in
    three clicks.
3.  Data survives a server restart (database persistence).
4.  Unauthenticated calls to management endpoints are rejected by the
    server.
5.  The UI works at 360 px and 1280 px wide.
6.  The README lets a stranger run it locally in under 10 minutes and
    lists known gaps honestly.

## 7. Constraints

-   48 hours from receiving the task; submit via the form in the PDF.
-   Documentation and online references are allowed.
-   Prefer working core features over complexity.
-   The candidate must be able to explain the code and decisions.

## 8. Naming

Display name "Forge" in the UI nav, "Forge LMS" in documents and page
titles. Repo `forge-lms`; DB `forge_lms`.
