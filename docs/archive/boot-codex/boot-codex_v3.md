# Boot Notes — Codex (Next Thread)

Purpose: fast startup context for the next Codex session entering the P2-C integration gate.

## Read Order (first 5 minutes, Turnfile-first)

1. `inception/TURNFILE.yaml`
2. `inception/WORKLOG.md` (status block first, then latest P2-C entries)
3. `inception/MAILBOX.md` (Inbox Snapshot + unread active messages for Codex)
4. `inception/OPEN_QUESTIONS.md` (quick scan; confirm no active/deferred)
5. `inception/docs/PRD-005-protocol-data-schema-compatibility.md`, `inception/docs/PRD-006-session-promotion-pipeline.md`, `inception/docs/PRD-007-trust-provenance-layer.md`, `inception/docs/PRD-010-shared-file-transaction-locking.md`, `inception/docs/PRD-011-session-resumption-contract.md`, `inception/docs/PRD-013-turnfile-coordination-format.md`, `inception/docs/PRD-012-protocol-skills-codex-claude.md`

## Current Carry-Over Anchors

1. Phase 2 status: P2-B complete; P2-C joint integration gate is ready.
2. OQ state: `0 active`, `0 deferred`, `50 resolved`.
3. `MSG-036` is closed; all PRD-014/015/016 recommendations were applied.
4. PRD-012 now includes mailbox turn-boundary discipline (R2.2): mailbox check is first and last step each turn; completion requires `unread=0`.
5. Known coordination cleanup item: Turnfile Codex agent session marker is stale (`last_seen: codex-session-9`, `session_id: null`) and should be refreshed at session start per PRD-013 R5.1.

## Session Startup Checks

1. Check mailbox first and clear any Codex unread items before substantive work.
2. Refresh Codex Turnfile agent entry (`status`, `session_id`, `last_seen`) at session start.
3. If `inception/MAILBOX.md` changes, regenerate projection:
   - `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json`
4. Keep control-plane updates consistent across `MAILBOX.md`, `WORKLOG.md`, and `OPEN_QUESTIONS.md`.
5. Mirror maintainer-facing closeout notes to `inception/chat-codex.md`.

## Immediate Next Action Recommendation

1. Run P2-C interface reconciliation across PRD-005/006/007/010/011/013.
2. Record any required interface deltas with explicit apply-or-counter payloads.

## Desync Exploration Guardrails (if maintainer initiates)

1. Run as an explicit, scoped experiment only (no implicit live-mode desync).
2. Inject one desync condition at a time and predefine expected recovery behavior.
3. Prefer reversible scenarios (stale-read or lock-contention drills), not destructive mutation.
4. Log evidence and recovery outcome in WORKLOG and MAILBOX before session close.
