---
name: phase-report
description: Use when finishing or pausing a Forge LMS implementation phase, or when the owner asks for status. Produces the mandatory phase report and checks exit criteria honestly.
---

# Phase report

## Goal
Give the owner an honest, checkable report for the current phase from
`docs/11-AGENT-EXECUTION-PLAN.md`.

## Steps
1. Copy the phase's exit criteria into a checklist.
2. For each criterion, run or cite real evidence (command output, test
   name, curl response, screenshot). Mark Met / Not met / Not run.
3. List files created or changed (`git status`, `git diff --stat`).
4. List the exact commands you executed.
5. Summarise tests: Passed, Failed, Not run (name them).
6. List risks, blockers and any OWNER DECISION (D1–D10) still open.
7. Confirm `CHANGELOG.md` has entries for the phase and list areas that
   need human review (`docs/12-DEVELOPER-RULES.md` §8).
8. Set STATUS **Complete** only if every criterion is Met.
9. Save as `docs/reports/phase-<n>.md` and print it.

## Output format
```text
PHASE:
STATUS: Complete / Blocked / Needs owner input
DISCOVERIES:
FILES CREATED/UPDATED:
COMMANDS EXECUTED:
TESTS: Passed / Failed / Not run
RISKS / BLOCKERS:
OWNER ACTION REQUIRED:
NEXT PHASE:
```

## Constraints
- Never mark an unmet criterion as met. Never omit a failing test.
- No secrets or passwords in the report.
