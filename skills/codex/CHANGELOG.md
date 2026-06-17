# Changelog — turnfile-codex-collaboration

## v9 - 2026-06-17

- SKILL.md: Added PRD-014 Amendment A1 unified closeout compaction/projection language to M-06, including execute-or-defer semantics for worklog compaction, signal-log compaction, mailbox archival movement, worklog/boot archive, heartbeat lifecycle inspection, projection synchronization, and `tools/next-state.mjs` final derivation.
- MANIFEST.yaml: Updated bundle metadata to v9 and expanded bundle notes to include the PRD-014 A1 unified closeout set.

## v8 - 2026-06-16

- SKILL.md: Added PRD-030 heartbeat and automation lifecycle instructions, including memory-boundary behavior, quiet no-op reports, and closeout handling for carried-forward/deleted heartbeats.
- SKILL.md: Added PRD-031 concurrent-work transition guidance so Codex inspects git state before edits, avoids touching peer-owned unstaged changes, stages only intentional files, and treats per-agent shards/derived aggregates as the structural path forward.
- SKILL.md: Added Tokenese adoption guardrails and a new M-09 Tokenese Parallel Adoption module covering W1+L1 sequencing, English source authority, `plain` as compliant fallback, scorer fallback fields, and active-artifact twin-lane gating.
- SKILL.md: Expanded output requirements to call out relevant uncommitted peer-owned changes intentionally left untouched.
- MANIFEST.yaml: Updated bundle metadata to v8 and expanded module count/notes to include PRD-030, PRD-031, and Tokenese adoption behavior.
- CHANGELOG.md: Added this v8 entry.

## v7 - 2026-06-13

- SKILL.md: Added PRD-029 R3 obligation to derive mailbox IDs, Turnfile signal IDs, revision, unread counts, and oldest unread pointers with `tools/next-state.mjs` inside shared-file transaction windows, with an explicit fresh-file read fallback when unavailable.
- MANIFEST.yaml: Updated bundle metadata to v7 and expanded bundle notes to include PRD-029 pre-write state derivation.
- CHANGELOG.md: Added this v7 entry.

## v6 - 2026-06-13

- SKILL.md: Added a Model Ledger Handshake Check requiring Codex to verify the current executing model and surface in `docs/llm/MODEL_LEDGER.md` during session bootstrap before making model-compatibility claims.
- MANIFEST.yaml: Updated bundle metadata to v6 and expanded bundle notes to include model ledger handshake validation.
- CHANGELOG.md: Added this v6 entry.

## v5 — 2026-06-13

- SKILL.md: Added Files First, Not Memory discipline from the Maintainer's file-based collaboration directive and Claude's v0.5.0 peer-offer: read relevant shared files before asserting, answering, reasoning, or writing current protocol state.
- MANIFEST.yaml: Updated bundle metadata to v5 and expanded bundle notes to include Files First discipline.
- CHANGELOG.md: Added this v5 entry.

## v4 — 2026-06-13

- SKILL.md: Added Collaboration Posture section from the Maintainer's aggregated-intelligence directive: peer contribution rather than gatekeeping, yes-and review discipline, edge-case surfacing, proposal-only peer authority, own-file boundary reinforcement, and Maintainer-legible decision projection.
- MANIFEST.yaml: Updated bundle metadata to v4 and expanded the bundle description/file notes to include collaboration posture.
- CHANGELOG.md: Added this v4 entry.

## v3 — 2026-06-13

- SKILL.md: Propagated PRD-024 R5.2 encoding-profile obligations into the Codex skill bundle: legible-only governance record, session-charter opt-in for dense lanes, turn-boundary projection duty, projection authorship, dense conflict escalation, and Maintainer projection/suspension rights.
- MANIFEST.yaml: Updated bundle metadata to v3.
- CHANGELOG.md: Added this v3 entry.

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
