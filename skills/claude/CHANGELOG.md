# Changelog

## v4 — 2026-06-12
- Bundle relocated from `skills/claude-opus_4.6/` to role-keyed `skills/claude/`
  (Maintainer direction, session 14). Model identity now lives in MANIFEST.yaml
  `compatibility` block, not the directory path. Old directory retained as
  historical reference until Maintainer-gated removal.
- SKILL.md: v0.3.0 → v0.4.0. Protocol baseline extended to PRD-016..019 (promoted
  in sessions 13-14). Added PRD-017 R7 chat-file completeness rules (own-file
  creation, peer-file warning, fixed session-header metadata), PRD-019 event-based
  cadence statement (no time-based polling) and chat-decision mirror duty with the
  session-14 delivery-gap workaround, Module 0 preflight path update, pending
  PRD-021 note.
- MANIFEST.yaml: bundle_version 4. tested_on extended with Fable 5 (session 14:
  full live protocol execution — boot, triage, cross-review closure, promotion,
  concurrent-edit recovery — on an unmodified v3 bundle, then this upgrade).
- Validated live: session 14 ran the complete protocol on Fable 5 before this
  upgrade, demonstrating model-generation portability of the v3 bundle.

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
