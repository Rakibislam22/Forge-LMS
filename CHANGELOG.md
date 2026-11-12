# Changelog

All notable changes to **Forge LMS** and its project documentation are
recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the application
follows [Semantic Versioning](https://semver.org/). Dates are `YYYY-MM-DD`
in `Asia/Dhaka`.

## How to write an entry

-   Add entries under `[Unreleased]` in the **same commit or pull request**
    as the change. One line per change, written for a reader who did not
    see the code: what changed and why it matters.
-   Categories: **Added**, **Changed**, **Deprecated**, **Removed**,
    **Fixed**, **Security**, **Breaking**, **Decisions** (an OWNER DECISION
    was answered), **Docs**.
-   Link the requirement or phase when useful, e.g. `(FR-A3, Phase 6)`.
-   Never put secrets, passwords or tokens in an entry.
-   At release, rename `[Unreleased]` to the version and date and start a
    new empty `[Unreleased]`.

---

## [Unreleased]

### Added
-   Agent setup for Forge LMS: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`,
    `.agents/` rules, skills and workflows, and the full specification in
    `docs/` (01–13, decisions log).
-   `docs/reference/`: DataPollex assessment PDF and the "Forge LMS" design
    mockups (11 screens: student, mobile, states, admin).

### Decisions
-   D1–D10 opened in `docs/decisions.md`; defaults documented, none
    answered yet.
