# Boot File — Claude

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
  - `inception/WORKLOG.md` — Session log with status block (read lines 1–11 first)
  - `inception/WORKLOG_ARCHIVE.md` — Archived sessions 0–4
  - `inception/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `inception/MAILBOX_ARCHIVE.md` — Full message history
  - `inception/OPEN_QUESTIONS.md` — Cross-PRD question registry (also promoted to `docs/`)
  - `inception/NOTIFICATION_PROTOCOL.md` — v0.6, the active communication protocol
  - `inception/chat-claude.md` — Claude's scratchpad and session state snapshots
  - `inception/chat-codex.md` — Codex's scratchpad
  - `inception/docs/` — All PRDs (001–012), including in-progress ones
  - `inception/PHASE1_MAINTAINER_REVIEW.md` — Maintainer review document for Phase 1 batch
  - `inception/SESSION_CHARTER.md`, `HANDSHAKE.md`, `PLANNING.md` — Session bootstrap artifacts

## Protocol essentials

- **Message lifecycle (PRD-003):** 5 statuses: `unread → acknowledged → blocked → actioned → closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Mailbox format:** Newest-first compact view. Inbox Snapshot → Open Queue → Active Messages → Closed Summary → Archive pointer.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision tokens with `Related` linkage.
- **Open questions:** Registry in `inception/OPEN_QUESTIONS.md`. Check at session start. Update when resolving.
- **Decision contract (PRD-004):** Maintainer decisions require WORKLOG linkage. Relay messages need `> Maintainer: "<exact text>"` blockquote.
- **Shared files (PRD-010):** Advisory locks in `inception/LOCKS.md`. 2-minute fixed expiry.
- **Session close procedure:** Update WORKLOG status block, close open mailbox messages, write session state snapshot to `chat-claude.md`, promote completed artifacts from `inception/` to tracked `docs/`.

## Resumption read order (PRD-011 R1)

1. **This file** (`inception/boot-claude.md`)
2. `inception/WORKLOG.md` lines 1–11 (status block) — ~200 tokens
3. `inception/MAILBOX.md` inbox snapshot — ~500 tokens — check for unread messages
4. `inception/OPEN_QUESTIONS.md` Active + Deferred sections — ~400 tokens
5. `inception/chat-claude.md` session close snapshot (bottom of file) — ~2K tokens
6. Then read whatever files are relevant to the current task

## Current state (as of session close 2026-02-08)

### Phase 1 — COMPLETE, awaiting maintainer approval
- PRD-003 (message lifecycle + SLA): Finalized. Cross-reviewed. All OQs resolved.
- PRD-004 (maintainer decision contract): Finalized. Cross-reviewed. All OQs resolved.
- PRD-008 (cross-sandbox handoff): Finalized. Cross-reviewed (Claude reviewed, Codex applied 7 findings). All OQs resolved.
- PRD-009 (cross-document reconciliation): Finalized. Cross-reviewed (Codex reviewed, Claude applied 4 findings). All OQs resolved.
- All four promoted to `docs/prds/`.
- Maintainer review document at `inception/PHASE1_MAINTAINER_REVIEW.md` (also `docs/PHASE1_MAINTAINER_REVIEW.md`).
- **Maintainer must approve/revise/defer before Phase 2 starts.**

### Phase 2 — NEXT (after Phase 1 approval)
- Claude reviews PRD-005 (Protocol Data Schema — Codex's work)
- Codex reviews PRD-006 (Session Promotion Pipeline — Claude's work)
- Also: exercise PRD-003 AC#4 (stale message scenario), PRD-008 AC#6 (use helper script)

### Phase 3 — LATER
- Claude reviews PRD-007 (Trust + Provenance) + PRD-001 late-stage audit
- Phase 4: PRD-002 (Rust viewer implementation)

### PRDs not yet cross-reviewed
- PRD-001 (maintainer interaction — late audit, Phase 3)
- PRD-002 (Rust viewer — Phase 4 implementation)
- PRD-005 (data schema — Claude reviews in Phase 2)
- PRD-006 (promotion pipeline — Codex reviews in Phase 2)
- PRD-007 (trust/provenance — Phase 3)
- PRD-010 (shared-file locking — OQs resolved, not yet cross-reviewed)
- PRD-011 (session resumption — OQs resolved, not yet cross-reviewed)
- PRD-012 (protocol skills — Codex-drafted, OQ-037–040 open)

### Open questions
- 4 active: OQ-037–040 (PRD-012 protocol skills)
- 2 deferred: OQ-003 (maintainer reply template scope), OQ-026 (trust anomalies blocking promotion)
- 34 resolved

### Mailbox
- All queues empty. 0 unread for all agents.
- 24 messages total (MSG-001 through MSG-024), all closed.

### WORKLOG
- ~734 lines after compaction. Sessions 0–4 archived.
- Decision index has 14 entries.

## Session close protocol

Before ending a session:
1. Update WORKLOG status block with current state
2. Close any open mailbox messages you own
3. Write session state snapshot to bottom of `chat-claude.md`
4. Promote completed artifacts from `inception/` to tracked `docs/` (copy, not move)
5. Commit and push tracked changes
6. Update this boot file if anything structural changed

## Key lessons learned

- `inception/` is gitignored. All active work lives there. Completed work gets copied to `docs/` for tracking.
- Agents are stateless. SLA is measured in session boundaries, not wall-clock time.
- Always read the WORKLOG status block first — it's the 10-line summary of where everything stands.
- The WORKLOG gets long fast. Compact per PRD-011 R5 when it exceeds 500 lines.
- Codex can't see your filesystem. Use payload-first messages with inline content for cross-agent reviews.
- When editing shared files (MAILBOX, WORKLOG, OPEN_QUESTIONS), re-read immediately before editing — they may have been modified between reads.
