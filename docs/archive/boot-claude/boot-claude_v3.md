# Boot File — Claude (v3)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Two agents (Claude/Anthropic and Codex/OpenAI GPT-5) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (Phase 1: 003, 004, 008, 009)
- `templates/` — Canonical templates
- `examples/` — Historical reference (ai-feature-tracker project)
- `tools/` — Gitignored local tooling (`export-mailbox-json.mjs`, `new-payload-envelope.mjs`)
- `inception/` — **Gitignored active workspace.** All session state lives here:
  - `inception/TURNFILE.yaml` — **Runtime coordination artifact.** Read this first after boot file.
  - `inception/WORKLOG.md` — Session log with status block (read lines 1–11 after Turnfile)
  - `inception/WORKLOG_ARCHIVE.md` — Archived sessions 0–9
  - `inception/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `inception/MAILBOX_ARCHIVE.md` — Full message history
  - `inception/OPEN_QUESTIONS.md` — Cross-PRD question registry (0 active, 0 deferred, 50 resolved)
  - `inception/VISION.md` — Maintainer-authored intent anchor (v2). Alignment document above PRD layer.
  - `inception/NOTIFICATION_PROTOCOL.md` — v0.6, the active communication protocol
  - `inception/chat-claude.md` — Claude's scratchpad and session state snapshots
  - `inception/chat-codex.md` — Codex's scratchpad
  - `inception/docs/` — All PRDs (001–016), including in-progress ones
  - `inception/archive/` — Versioned archives (vision/, boot-claude/, boot-codex/)
  - `inception/PHASE1_MAINTAINER_REVIEW.md` — Maintainer review document for Phase 1 batch
  - `inception/SESSION_CHARTER.md`, `HANDSHAKE.md`, `PLANNING.md` — Session bootstrap artifacts

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Claude unread=0 before turn is done.
- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Mailbox format:** Newest-first compact view. Inbox Snapshot -> Open Queue -> Active Messages -> Closed Summary -> Archive pointer.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision tokens with `Related` linkage.
- **Open questions:** Registry in `inception/OPEN_QUESTIONS.md`. Check at session start. Update when resolving.
- **Decision contract (PRD-004):** Maintainer decisions require WORKLOG linkage. Relay messages need `> Maintainer: "<exact text>"` blockquote.
- **Turnfile (PRD-013):** YAML coordination artifact. Agents read/write for task tracking, lock management, signals. Revision-based leases (no wall-clock). Section ownership model (R2.1).
- **Locking (PRD-010 + PRD-013):** Locks live in TURNFILE.yaml `locks` section. Revision-based lease expiry: `(coordination.revision - acquired_rev) > lease_revs`. Default `lease_revs: 2`. LOCKS.md subsumed by Turnfile.
- **Session closeout (PRD-014):** Mandatory checklist: mailbox clearance, boot rollover + archive, worklog maintenance + compaction check, OQ sync, reflection entry. Boot archives use globally monotonic versioning under `inception/archive/<boot-file-stem>/`.
- **Session close procedure:** Update WORKLOG status block, close open mailbox messages, write session state snapshot to `chat-claude.md`, update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue), promote completed artifacts, commit+push.

## Resumption read order (PRD-011 R3)

1. **This file** (`inception/boot-claude.md`)
2. `inception/TURNFILE.yaml` — coordination state (phase, tasks, locks, agent status, signals) — ~200 tokens
3. `inception/WORKLOG.md` lines 1–11 (status block) — ~200 tokens
4. `inception/MAILBOX.md` inbox snapshot — ~500 tokens — check for unread messages
5. `inception/OPEN_QUESTIONS.md` Active + Deferred sections — ~200 tokens
6. `inception/chat-claude.md` session close snapshot (bottom of file) — ~2K tokens
7. Then read whatever files are relevant to the current task

## Current state (as of session 11, 2026-02-08)

### Phase 1 — COMPLETE, approved by maintainer
- PRD-003 (message lifecycle + SLA): Finalized. Promoted to `docs/prds/`.
- PRD-004 (maintainer decision contract): Finalized. Promoted to `docs/prds/`.
- PRD-008 (cross-sandbox handoff): Finalized. Promoted to `docs/prds/`.
- PRD-009 (cross-document reconciliation): Finalized. Promoted to `docs/prds/`.

### Phase 2 — IN PROGRESS (P2-C complete, preparing P2-D)

**Completed gates:**
- P2-A (OQ sync): DONE. All 5 OQ resolutions applied (041-044 + 003).
- Steps 2.1-2.3: Vision.md v2, PRD-013 draft + cross-review, PRD-012 R2 re-scope + cross-review. All done.
- P2-B Track L (Claude): DONE. PRD-005 cross-review, PRD-013 cleanup, PRD-011 update, PRD-007 cross-review, OQ-026 worked-example frame. All complete.
- P2-B Track C (Codex): DONE. PRD-010 Turnfile lock re-scope, PRD-006 cross-review + interface deltas (D-001–D-006). All complete.
- P2-B Cross-reviews: DONE. Track C reviewed by Claude (MSG-033), Track L reviewed by Codex (MSG-036 reply). All findings applied.
- PRD-014/015/016: Drafted by Codex, cross-reviewed by Claude, all recommendations applied. Non-blocking for P2-C.
- **P2-C (joint integration gate): PASSED.** Both agents independently confirmed 0 contradictions across PRD-005/006/007/010/011/013. D-001–D-008 registered. Hardening pass H-001..H-004 applied by Codex and accepted by Claude.

**Next gates:**

| Gate | Work | Owner |
|------|------|-------|
| **P2-D** | **PRD-012 M1-M3 (skills pilot) + PRD-013 remaining milestones** | **Both** |
| P2-E | PRD-001 consolidation + PRD-002 planning | Both |

### PRD landscape (16 PRDs)

| PRD | Status | Notes |
|-----|--------|-------|
| PRD-001 | Draft | P2-E consolidation audit |
| PRD-002 | Draft | P2-E implementation planning |
| PRD-003 | Finalized, promoted | Phase 1 complete |
| PRD-004 | Finalized, promoted | Phase 1 complete |
| PRD-005 | Draft, cross-reviewed | All findings applied. Turnfile scope note added. |
| PRD-006 | Draft, cross-reviewed | Interface deltas D-001–D-008. Promotion-blocker disposition (R2a.7). |
| PRD-007 | Draft, cross-reviewed | Turnfile integration (R1.5, R2.5, R7.4). OQ-026 resolved. |
| PRD-008 | Finalized, promoted | Phase 1 complete |
| PRD-009 | Finalized, promoted | Phase 1 complete |
| PRD-010 | Draft, hardened | Turnfile lease-lock + H-003 liveness + H-004 deterministic IDs. |
| PRD-011 | Draft, hardened | Turnfile in read order. H-001 token checksum + H-002 boundary note. |
| PRD-012 | Draft R2, cross-reviewed + H-002 | Skills contract. Explicit invocation only. P2-D pilot target. |
| PRD-013 | Draft, cross-reviewed + hardened | Turnfile coordination format. In active use sessions 10–11. Exit criterion #1 met. |
| PRD-014 | Draft | Session closeout + boot handoff contract (Codex-drafted, Claude cross-reviewed). |
| PRD-015 | Draft | Agent onboarding + vetting contract (Codex-drafted, Claude cross-reviewed). |
| PRD-016 | Draft | Session rotation trigger contract (Codex-drafted, Claude cross-reviewed). |

### Open questions
- 0 active, 0 deferred, 50 resolved. Clean slate.

### Mailbox
- All queues empty. 0 unread for all agents. 38 messages total.
- **Tip:** `inception/MAILBOX.json` is a machine-readable projection maintained by Codex via `node tools/export-mailbox-json.mjs`. Lighter to parse than full markdown mailbox.

### WORKLOG
- ~350 lines. Sessions 0–9 archived. Under 500-line compaction trigger.

### Coordination
- TURNFILE.yaml revision: 26. Active step: P2-C (gate passed; P2-D pending maintainer kickoff).
- Both agents status: active.
- No active locks or turn queue entries.

## Session close protocol

Before ending a session:
1. **Check mailbox** — ensure Claude unread=0
2. Update WORKLOG status block with current state
3. Close any open mailbox messages you own
4. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
5. Write session state snapshot to bottom of `chat-claude.md`
6. Archive current boot file to `inception/archive/boot-claude/boot-claude_v<N>.md`
7. Write new boot file with updated state
8. Promote completed artifacts from `inception/` to tracked `docs/` (copy, not move)
9. Commit and push tracked changes
10. **Final mailbox check** — confirm Claude unread=0

## Key lessons learned

- `inception/` is gitignored. All active work lives there. Completed work gets copied to `docs/` for tracking.
- Agents are stateless. SLA is measured in session boundaries, not wall-clock time.
- TURNFILE.yaml is the first coordination read after the boot file — most compact and actionable state.
- The WORKLOG gets long fast. Compact per PRD-011 R5 when it exceeds 500 lines. Use bash file reconstruction for large block removals (Edit tool struggles with hundreds of lines).
- Codex can't see your filesystem. Use payload-first messages with inline content for cross-agent reviews.
- When editing shared files (MAILBOX, WORKLOG, OPEN_QUESTIONS, TURNFILE.yaml), re-read immediately before editing — they may have been modified between reads.
- Locking is now revision-based (PRD-013 R1.3), not time-based. Use `lease_revs` in TURNFILE.yaml, not wall-clock expiry.
- Phase 2 used a strength-based parallel split: Track C (Codex: precision/invariants/schema) and Track L (Claude: governance/narrative/process). Binding consensus in MSG-031.
- Maintainer runs both agents at roughly parity and concurrent refresh rates. Desync operations may be explored in future sessions.
- Check mailbox first and last on every turn. Your messages should be unread=0 before you're done.
- `inception/MAILBOX.json` is a machine-readable projection of `MAILBOX.md`. Use it for quick state checks instead of parsing the full markdown mailbox.
