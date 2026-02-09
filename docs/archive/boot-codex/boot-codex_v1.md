# Boot Notes — Codex

Purpose: fast startup context for a new Codex session in this workspace.

## Read Order (first 5 minutes)

1. `inception/WORKLOG.md` (top status block only first, then latest entries if needed)
2. `inception/OPEN_QUESTIONS.md` (Active + Deferred sections)
3. `inception/MAILBOX.md` (Inbox Snapshot + unread active messages for Codex)
4. `inception/chat-codex.md` (latest session-close note)
5. `inception/docs/README.md` (PRD index and current set)

## Current Carry-Over Anchors

1. Phase 1 batch is maintainer-ready: PRD-003/004/008/009.
2. Deferred questions requiring worked examples:
   - `OQ-003` (maintainer-reply minimum template scope)
   - `OQ-026` (trust anomalies that should block promotion)
3. New draft in queue:
   - `inception/docs/PRD-012-protocol-skills-codex-claude.md`
   - OQs: `OQ-037..OQ-040`

## Session Startup Checks

1. Confirm Codex unread count in `MAILBOX.md` and action any unread message cards.
2. Confirm `MAILBOX.json` freshness if `MAILBOX.md` is edited:
   - `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json`
3. Keep control-plane edits consistent (`MAILBOX.md`, `WORKLOG.md`, `OPEN_QUESTIONS.md`).
4. Mirror maintainer-facing closeouts into `inception/chat-codex.md`.

## Operator Note

If maintainer starts with "continue where we left off," default first action is:
1. Ack unread mailbox items.
2. Reconfirm deferred OQ plan (`OQ-003`, `OQ-026`).
3. Execute maintainer-selected phase gate (Phase 1 decision or Phase 2 review split).
