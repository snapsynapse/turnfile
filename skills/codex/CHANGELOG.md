# Changelog — turnfile-codex-collaboration

## v2 — 2026-06-12

- SKILL.md: Added version context, Session 14 baseline rules, and M-00 bootstrap/baseline orientation. Updated startup read order to include `BASELINE.md`; clarified promoted/draft PRD shelves, closed-on-posting mirror behavior, event-only coordination, lifecycle handling for `actioned` messages, and role-keyed skill directory expectations.
- MANIFEST.yaml: Updated bundle metadata to v2, recorded GPT-5 desktop session validation, and changed the module inventory from M-01..M-08 to M-00..M-08.
- CHANGELOG.md: Added this v2 entry.
- Clone source: `skills/codex_5.3/` was cloned from the repo copy that matched `/Users/snap/.codex/skills/turnfile-codex-collaboration/SKILL.md` by SHA-256 before this upgrade.

## v1 — 2026-02-08

- Initial Codex skill bundle for the Turnfile protocol.
- Aligned with Claude SKILL.md structure (v0.2.0 to v0.2.1).
- 8 modules: mailbox lifecycle, maintainer decision, payload-first review,
  cross-PRD reconciliation, shared-file transaction, session close/resume,
  Turnfile coordination, OQ registry.
- Added execution contract, active-turn boundary discipline, startup
  orientation read order, state freshness hooks, fallback rules, and
  output format requirements.
- Policy test suite validated (M4, 4/4 scenarios PASS).
