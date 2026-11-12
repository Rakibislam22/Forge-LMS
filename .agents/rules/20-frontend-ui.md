# Frontend and UI rules (apply to `client/**`)

Spec: `docs/06-UI-DESIGN-SPEC.md`. Mockups: `docs/reference/design-mockups/`.

## Structure

```text
client/src/
  api/           one fetch wrapper (base URL from env, token injection,
                 error normalisation) + one module per resource
  components/    Button, TextField, TextArea, Card, CourseCard, Thumb,
                 LectureRow, Modal/ConfirmDialog, Spinner/Skeleton,
                 EmptyState, ErrorState, VideoPlayer, Table, Toast
  layouts/       StudentLayout (top nav), AdminLayout (sidebar)
  pages/         student/*, admin/*
  hooks/         useAuth, useAsync (loading/data/error)
  routes/        route table + ProtectedRoute
  types/         API types shared with docs/05-API.md
```

## Rules

- Replicate the mockups' colours, type, spacing, radii and layout with
  Tailwind theme tokens from `docs/06-UI-DESIGN-SPEC.md` §2. Do not copy
  the `.dc.html` runtime or its hardcoded sample data.
- Every data screen has loading, empty and error states (see the States
  artboard), and an error state has a working "Try again".
- Responsive from 360 px: nav wraps, admin sidebar collapses to a top bar,
  tables scroll inside a box, the lecture sidebar stacks under the player.
- Accessibility: real `<button>`, `<a>`, `<label for>`; visible focus
  (3 px accent outline); 44 px minimum touch targets; inline field errors
  with `aria-invalid` + `role="alert"`; the delete confirm is an
  `alertdialog` with focus trapped and Esc to cancel.
- Forms validate on submit and on blur, show the server's field errors,
  and disable the submit button while saving.
- Student pages never call a protected endpoint. Admin pages always send
  the token; on 401 clear it and redirect to `/admin/login`.
- Embedded video: render only the normalised embed URL returned by the API
  in an `<iframe>` with `title`, `allowFullScreen`, `loading="lazy"`.
- No emoji icons; use inline SVG matching the mockups.
