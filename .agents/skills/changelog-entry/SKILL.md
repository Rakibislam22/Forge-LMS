---
name: changelog-entry
description: Use whenever a change is made, to write a correct CHANGELOG.md entry under [Unreleased].
---

# Changelog entry

1. Open `CHANGELOG.md`; find `## [Unreleased]`.
2. Choose the category: Added, Changed, Deprecated, Removed, Fixed,
   Security, Breaking, Decisions, Docs.
3. Write one plain-language line: what changed and why it matters. Add the
   requirement or phase id, e.g. `(FR-A7, Phase 6)`.
4. For an answered OWNER DECISION, also add the row to
   `docs/decisions.md`.
5. Never include secrets, passwords or tokens.
6. If the change touches a human-review area, add "(needs human review)".
