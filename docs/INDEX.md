# Forge LMS — Simplified Learning Management System

**Project documentation for an autonomous coding agent.**

This specification describes a small full-stack web application built for
the DataPollex Ltd. recruitment task: an Admin dashboard to manage courses
and lectures behind a login, and a public Student panel to browse courses
and watch lecture videos. The time box is 48 hours. The goal is a
**working, well-structured, honestly documented** core, not a large
feature set.

## Read in this order

1.  [Project brief](01-PROJECT-BRIEF.md)
2.  [Requirements and acceptance criteria](02-REQUIREMENTS.md)
3.  [Architecture](03-ARCHITECTURE.md)
4.  [Database design](04-DATABASE.md)
5.  [API specification](05-API.md)
6.  [UI design specification](06-UI-DESIGN-SPEC.md)
7.  [Authentication and security](07-AUTH-SECURITY.md)
8.  [Deployment](08-DEPLOYMENT.md)
9.  [Environment variable reference](09-ENVIRONMENT.md)
10. [Testing and troubleshooting](10-TESTING.md)
11. [Agent execution plan](11-AGENT-EXECUTION-PLAN.md)
12. [Developer rules](12-DEVELOPER-RULES.md)
13. [Submission checklist](13-SUBMISSION-CHECKLIST.md)

Also: [Decisions log](decisions.md) and the root `CHANGELOG.md`.

Source material is in `reference/`: the assessment PDF
(`1343f514-FORGE_-_Assesment_Task.pdf`) and `design-mockups/` (the
"Forge LMS" canvas exported as 11 `.dc.html` screens and an `index.html`
review page). The PDF is authoritative for scope; the `.dc.html` files are
the source of truth for look and layout.

## Important implementation rules

-   **Scope is fixed by the PDF.** No student registration, payment,
    enrollment, uploads or progress tracking.
-   **No hardcoded student data.** Everything students see comes from the
    API and database.
-   **MVC backend** with separate routes, controllers and models.
-   **Admin routes are protected on the server** with JWT.
-   **Validate and handle errors** on every endpoint; show loading, empty
    and error states on every data screen.
-   **Mockups are references, not production code.** Replicate colours,
    type, spacing and layout in the project's own React components.
-   Where the PDF, mockups and these documents disagree, or where a
    decision is marked **OWNER DECISION**, stop and ask the owner.

## Project goals

-   Show practical full-stack skill: React UI, Express API, database
    persistence, auth, validation, project structure.
-   Be easy to run and evaluate: seed data, test credentials, clear README,
    a deployed demo if feasible.
-   Be explainable: small, boring, consistent code the candidate can walk
    through in an interview.

## Default stack

React + Vite + TypeScript · Tailwind CSS · Node.js + Express +
TypeScript · MongoDB + Mongoose · zod · JWT + bcrypt. (PERN is allowed by
the PDF; see `04-DATABASE.md` §7.)
