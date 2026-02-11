# Changelog

## v3 — 2026-02-11
- SKILL.md: Added Module 0 (Session Bootstrap) for cold-start initialization
  from templates. Includes skills preflight check (P-7). Bumped version to 0.3.0.
  Updated versioning table.
- MANIFEST.yaml: Created. Bootstrap of skill-versioning metaskill applied to this
  bundle. Tracks SKILL.md hash, compatibility block, and file inventory.
- CHANGELOG.md: Created. Bootstrap entry.
- Boot file dependency: `working-session/boot-claude.md` rewritten to v5 in same
  session (all `inception/` references replaced with `working-session/`, cold-start
  bootstrap section added).

## v2 — 2026-02-08
- SKILL.md: Aligned with Codex SKILL.md structure (v0.2.0 → v0.2.1). Added
  execution contract, active-turn boundary discipline, startup orientation read
  order, state freshness hooks, fallback rules, output format requirements,
  environment-specific notes. Policy test suite validated (M4, 4/4 scenarios PASS).
- No MANIFEST.yaml or CHANGELOG.md existed at this version.

## v1 — 2026-02-06
- SKILL.md: Initial skill file created during inception pilot (PRD-012 M1).
  8 modules covering mailbox lifecycle, maintainer decisions, cross-agent review,
  shared-file transactions, session close, Turnfile coordination, OQ management.
- No MANIFEST.yaml or CHANGELOG.md existed at this version.
