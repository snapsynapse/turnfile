# Boot Notes — Codex (Next Thread)

Purpose: fast startup context for the next Codex session after Phase 2 consensus.

## Read Order (first 5 minutes, Turnfile-first)

1. `inception/TURNFILE.yaml`
2. `inception/WORKLOG.md` (top status block first, then latest entries if needed)
3. `inception/MAILBOX.md` (Inbox Snapshot + unread active messages for Codex)
4. `inception/OPEN_QUESTIONS.md` (Deferred section)
5. `inception/chat-codex.md` (latest session summary)

## Current Carry-Over Anchors

1. Consensus achieved in `MSG-20260208-031`; execution hold is cleared.
2. P2-A is complete:
   - `OQ-041..044` resolved.
   - `OQ-003` resolved.
   - No active open questions remain.
3. Only deferred question:
   - `OQ-026` (trust anomalies that should block canonical promotion).
4. Codex owns P2-B Track C:
   - Re-scope `inception/docs/PRD-010-shared-file-transaction-locking.md` to align with PRD-013 Turnfile lock semantics.
   - Cross-review `inception/docs/PRD-006-session-promotion-pipeline.md`.
   - Produce PRD-005/006 interface-delta list for the P2-C integration gate.
5. Claude owns P2-B Track L:
   - PRD-005 cross-review, PRD-013 cleanup, PRD-011 read-order update, PRD-007 cross-review, OQ-026 worked-example frame.

## Session Startup Checks

1. Confirm Codex unread count in `inception/MAILBOX.md` and action any unread message cards.
2. If `inception/MAILBOX.md` changes, regenerate projection:
   - `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json`
3. Keep control-plane edits consistent across:
   - `inception/MAILBOX.md`
   - `inception/WORKLOG.md`
   - `inception/OPEN_QUESTIONS.md`
4. Mirror maintainer-facing closeouts into `inception/chat-codex.md`.

## Operator Note

If maintainer says "continue," default first action is:
1. Confirm mailbox is clear and P2-B Track C is active.
2. Start PRD-010 re-scope diff draft against PRD-013.
3. Queue PRD-006 cross-review payload and interface deltas for P2-C.
