# Title: finish-phase
# Description: Close a Forge LMS phase with evidence, changelog and a phase report.

Step 1: Run lint, typecheck and the full test suite. Paste the real output.

Step 2: Exercise the phase's features against the real database (curl or
the UI). Capture screenshots for UI work at 1280 px and 390 px next to the
matching mockup.

Step 3: Confirm every change has a `CHANGELOG.md` line under `[Unreleased]`
and every endpoint change is reflected in `docs/05-API.md`.

Step 4: Run the `phase-report` skill. Be honest: an unmet exit criterion
means STATUS is not Complete.

Step 5: Commit with Conventional Commits. Stop and wait for the owner
before starting the next phase.
