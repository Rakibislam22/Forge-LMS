# 06 — UI Design Specification

Source of truth: `reference/design-mockups/*.dc.html` (canvas "Forge LMS",
11 artboards). Replicate tokens and layout; do not copy the runtime or the
sample data.

## 1. Screen inventory

| Artboard (file) | Route | Size |
|---|---|---|
| Student · Course listing (`Main.dc.html`) | `/` | 1280 |
| Student · Course details (`CourseDetail.dc.html`) | `/courses/:courseId` | 1280 |
| Student · Watch lecture (`Lecture.dc.html`) | `/courses/:courseId/lectures/:lectureId` | 1280 |
| Loading · Empty · Error (`States.dc.html`) | all data screens | 1280 |
| Mobile · Courses / Course details / Lecture (`Mobile-*.dc.html`) | same routes | 390 |
| Admin · Login (`Admin-Login.dc.html`) | `/admin/login` | 1280 |
| Admin · Courses (`Admin-Courses.dc.html`) | `/admin/courses` | 1280 |
| Admin · Create / edit course (`Admin-CourseForm.dc.html`) | `/admin/courses/new`, `/:id/edit` | 1280 |
| Admin · Lectures of a course (`Admin-Lectures.dc.html`) | `/admin/courses/:id/lectures` | 1280 |

## 2. Design tokens

Define as Tailwind theme extensions.

| Token | Value | Use |
|---|---|---|
| `paper` | `#F6F4EF` | page background |
| `surface` | `#FFFFFF` | cards, header, table |
| `ink` | `#15171C` | text, admin sidebar, primary dark |
| `muted` | `#5B606B` | secondary text |
| `line` | `#E2DED5` | borders, dividers |
| `field` | `#9A9588` | input border |
| `accent` | `#C2410C` | primary buttons, links, focus ring, active nav |
| `accent-tint` | `#FBE9DF` | row hover |
| `danger` | `#B42318` | errors, delete |
| `sidebar-hover` | `#242932` | admin sidebar hover |
| `sidebar-muted` | `#C9CDD6` / `#E4E6EB` | sidebar text |

Thumbnail fallback palette (when the image fails to load): `#1F3A5F`,
`#C2410C`, `#2F6F5E`, `#E8B04A`, `#15171C`, `#DAD3C3` with a lighter circle
shape and the course's first word as a tag, as in the cards.

Type: **Space Grotesk** 500/700 for headings, logo and prices; **Inter**
400/500/600 for body and UI. Load from Google Fonts with `display=swap`.

| Element | Size / weight |
|---|---|
| Listing h1 | 48 / 700, letter-spacing -0.02em |
| Detail h1 | 44 / 700 |
| Admin h1 | 36 / 700 |
| Card title | 21 / 700 |
| Body | 15–17, line-height 1.5–1.6 |
| Table head | 13 uppercase, letter-spacing 0.04em |

Radii: cards 14, inputs and buttons 10, nav buttons 8, hero thumbnail 16.
Layout: max width 1200 with 40 px side padding (16–20 px on mobile).
Card grid: `repeat(auto-fit, minmax(300px, 1fr))`, gap 24. Card hover:
translateY(-3px) with a soft shadow.

## 3. Behaviour per screen

**Listing.** Header (logo, Courses, Admin login). Title "All courses" and
one-line intro. Grid of cards: thumbnail 176 px high, title, 3-line clamped
description, price, "View course →". Data from `GET /api/courses`.

**Course details.** Breadcrumb "All courses / {title}". Two-column hero
(thumbnail, then title, description, price, "Start first lecture" going to
lecture 1, hidden when there are none). "Lectures" panel with count and
numbered rows (title, short description, "Watch"). Data from the course and
lectures endpoints.

**Lecture.** Breadcrumb with three levels. Player (16:9 iframe) with title,
"Lecture n of N", description, Previous / Next buttons (disabled at ends).
Right column "Course lectures" with the current row highlighted; stacks
under the player on small screens.

**States.** Loading: skeleton cards and "Loading courses…" with
`role="status"`. Empty: icon, "No courses yet", explanation, "Refresh
list". Error: warning icon, "Couldn't load courses", message, "Try again"
(`role="alert"`). Use the same pattern for course and lecture screens with
fitting copy.

**Admin login.** Split layout: dark brand panel (title "Admin dashboard"),
form panel with Email, Password, Sign in, "← Back to courses". Inline alert
"Incorrect email or password. Try again." on failure. Never prefill
credentials in production.

**Admin shell.** Left sidebar 240 px (ink): Forge Admin logo, Courses,
View student site, Log out (bottom). Active item filled `accent`. Below
~720 px the sidebar becomes a top bar.

**Admin courses.** Title, helper text, "New course" button. Table: thumb
72×48 + title, Price, Lectures, Actions (Lectures, Edit, Delete). Delete
opens an `alertdialog`: "Delete this course?", names the course, warns its
lectures are removed, Cancel / Delete course (danger).

**Course form.** Back link, "New course"/"Edit course". Card with Title,
Description, Price (USD), Thumbnail URL, Cancel / Save course. Right
column shows a live "Thumbnail preview". Inline error under a field, with
a 2 px danger border, `aria-invalid` and `role="alert"`.

**Admin lectures.** Back link, h1 "Lectures", subtitle "{course} · n
lectures". Left: ordered list (number badge, title, video URL, Edit,
Delete). Right: "Add lecture" form (Title, Description, Video URL with the
hint "Use an embeddable video link."). Editing switches the form to "Edit
lecture" with Save and Cancel.

## 4. Components

Button (primary, outline, danger, text), TextField, TextArea, Card,
CourseCard, Thumb (image with fallback shape), LectureRow, Table,
ConfirmDialog, Skeleton, Spinner, EmptyState, ErrorState, VideoPlayer,
Toast (save/delete feedback, `role="status"`), Breadcrumb, Header,
AdminSidebar.

## 5. Accessibility and responsiveness

-   Visible focus: 3 px `accent` outline, 2 px offset.
-   Touch targets at least 44 px; text contrast at least 4.5:1.
-   Real form controls with `<label for>`; icons are `aria-hidden` unless
    they carry meaning.
-   Test at 360, 390, 768, 1280. Tables scroll inside their card; no page
    horizontal scroll.
-   Images lazy-load with explicit aspect ratio to avoid layout shift.

## 6. Known mockup gaps (`// design-gap`)

-   Currency is shown as USD (`$49`). If the owner prefers BDT, change in
    one formatter (D8).
-   Success toasts, the in-form "Edit lecture" mode and the lecture
    prev/next disabled style are not drawn; reuse existing styles.
-   The mockups show a static player placeholder; build the real iframe.
