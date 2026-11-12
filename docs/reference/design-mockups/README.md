# Forge LMS design mockups

Exported from the Claude Design canvas "Forge LMS"
(https://claude.ai/artifact/BKoLvjpJKHwX43mPGtY18v).

| File | Screen |
|---|---|
| `Main.dc.html` | Student · Course listing |
| `CourseDetail.dc.html` | Student · Course details |
| `Lecture.dc.html` | Student · Watch lecture |
| `States.dc.html` | Loading · Empty · Error states |
| `Mobile-Courses.dc.html`, `Mobile-Detail.dc.html`, `Mobile-Lecture.dc.html` | Mobile (390 px) |
| `Admin-Login.dc.html` | Admin · Login |
| `Admin-Courses.dc.html` | Admin · Courses table + delete dialog |
| `Admin-CourseForm.dc.html` | Admin · Create / edit course |
| `Admin-Lectures.dc.html` | Admin · Lectures of a course |
| `canvas.json` | Artboard sizes and positions |
| `index.html` | Review page exported with the canvas |

These are **references, not production code**. Each `.dc.html` is a Design
Component page that needs the canvas runtime (`support.js`) to render, so
open the canvas link above to view them live. For implementation, read the
inline styles to get exact colours, type, spacing and layout; tokens are
summarised in `docs/06-UI-DESIGN-SPEC.md` §2. The sample course data inside
them is placeholder only.
