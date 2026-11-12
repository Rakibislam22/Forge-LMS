# Title: start-phase
# Description: Begin a Forge LMS implementation phase safely, with plan, decisions and baseline checks.

Step 1: Read `AGENTS.md`, `.agents/rules/00-guardrails.md` and the phase
section in `docs/11-AGENT-EXECUTION-PLAN.md`. State which phase you are
starting and its exit criteria.

Step 2: Check `docs/decisions.md` for OWNER DECISIONS (D1–D10) this phase
needs. If any is unanswered and blocks work, ask the owner now; otherwise
note the default you will use.

Step 3: Read `docs/12-DEVELOPER-RULES.md`, the latest `CHANGELOG.md`
entries, the doc sections for the modules you will touch, and the matching
rule files in `.agents/rules/`.

Step 4: Run the baseline: install, `lint`, `typecheck`, `test`. Record
failures that existed before you started.

Step 5: Write a short plan (files to create or change, tests to add,
risks) in `docs/reports/phase-<n>-plan.md`. If the phase touches auth,
password handling or the video-URL validator, wait for the owner's go-ahead.

Step 6: Implement in small commits, tests alongside code.
