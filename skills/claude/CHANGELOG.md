# Changelog

## v9 — 2026-06-13
- SKILL.md v0.5.1 -> v0.6.0: encoded three session-14 ledger lessons.
  (1) Concurrent Write Discipline ("Derive, Don't Assume") — write-side complement
  to Files First: derive written values (IDs, counts, pointers) from the in-lock
  read; a validator's "expected" is file-truth; lock the whole batch up front;
  commit only own paths when a peer has uncommitted work; allocate IDs in-window.
  (2) Active-turn closure-owner check on own sent messages (thread-mode replies do
  not raise unread). (3) Builder/reviewer separation as an operating rule.

## v8 — 2026-06-13
- SKILL.md v0.5.0 -> v0.5.1: Model Ledger Handshake Check added (mirror of Codex
  skill v6, Maintainer-originated norm). Verify executing model+surface is in
  docs/llm/MODEL_LEDGER.md at boot before relying on model-compatibility claims;
  absence from a session or role-keyed path is not deprecation. Reciprocal of the
  MSG-039 Files-First mirror offer — peer norms adopted in both bundles.

## v7 — 2026-06-13
- SKILL.md v0.4.2 -> v0.5.0: "Files First, Not Memory" operating principle added
  (Maintainer directive). Re-read shared files before asserting or reasoning about
  state, not only before writing — Turnfile is concurrent collaborative file work,
  so memory is stale by default. Generalizes re-read-before-edit (write safety) to
  re-read-before-assert (answer safety). Root-cause fix for a recurring class of
  stale-memory errors (OQ status, file-move attribution, snapshot/ID drift).

## v6 — 2026-06-13
- SKILL.md v0.4.1 → v0.4.2: Collaboration Posture section added (Maintainer
  directive 2026-06-13): generative peer contribution mandatory in substantive
  replies; tenets 1-3 (request/propose only, own-file boundaries, Maintainer
  legibility) encoded as standing skill rules.

## v5 — 2026-06-13
- SKILL.md v0.4.0 → v0.4.1: PRD-024 propagation (R5.2). New "Encoding profile
  obligations" section: legible-only governance record, session-charter opt-in
  for dense lanes, turn-boundary projection obligation (R3.1) alongside the
  unread=0 rule, projection authorship liability, Maintainer demand/suspension
  compliance. Pending-contracts note updated (PRD-021 promoted; PRD-022 in review).

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
