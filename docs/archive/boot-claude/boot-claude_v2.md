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
  - `inception/TURNFILE.yaml` — **Runtime coordination artifact.** Read this first after boot file.
  - `inception/WORKLOG.md` — Session log with status block (read lines 1–11 after Turnfile)
  - `inception/WORKLOG_ARCHIVE.md` — Archived sessions 0–4
  - `inception/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `inception/MAILBOX_ARCHIVE.md` — Full message history
  - `inception/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `inception/VISION.md` — Maintainer-authored intent anchor (v2). Alignment document above PRD layer.
  - `inception/NOTIFICATION_PROTOCOL.md` — v0.6, the active communication protocol
  - `inception/chat-claude.md` — Claude's scratchpad and session state snapshots
  - `inception/chat-codex.md` — Codex's scratchpad
  - `inception/docs/` — All PRDs (001–013), including in-progress ones
  - `inception/archive/` — Versioned archives (vision/, boot-claude/, boot-codex/)
  - `inception/PHASE1_MAINTAINER_REVIEW.md` — Maintainer review document for Phase 1 batch
  - `inception/SESSION_CHARTER.md`, `HANDSHAKE.md`, `PLANNING.md` — Session bootstrap artifacts

## Protocol essentials

- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Mailbox format:** Newest-first compact view. Inbox Snapshot -> Open Queue -> Active Messages -> Closed Summary -> Archive pointer.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision tokens with `Related` linkage.
- **Open questions:** Registry in `inception/OPEN_QUESTIONS.md`. Check at session start. Update when resolving.
- **Decision contract (PRD-004):** Maintainer decisions require WORKLOG linkage. Relay messages need `> Maintainer: "<exact text>"` blockquote.
- **Turnfile (PRD-013):** YAML coordination artifact. Agents read/write for task tracking, lock management, signals. Revision-based leases (no wall-clock). Section ownership model (R2.1).
- **Locking (PRD-010 + PRD-013):** Locks live in TURNFILE.yaml `locks` section. Revision-based lease expiry: `(coordination.revision - acquired_rev) > lease_revs`. Default `lease_revs: 2`. LOCKS.md subsumed by Turnfile.
- **Session close procedure:** Update WORKLOG status block, close open mailbox messages, write session state snapshot to `chat-claude.md`, update TURNFILE.yaml (agent status, tasks, signals), promote completed artifacts, commit+push.

## Resumption read order (PRD-011 R3)

1. **This file** (`inception/boot-claude.md`)
2. `inception/TURNFILE.yaml` — coordination state (phase, tasks, locks, agent status, signals) — ~200 tokens
3. `inception/WORKLOG.md` lines 1–11 (status block) — ~200 tokens
4. `inception/MAILBOX.md` inbox snapshot — ~500 tokens — check for unread messages
5. `inception/OPEN_QUESTIONS.md` Active + Deferred sections — ~200 tokens
6. `inception/chat-claude.md` session close snapshot (bottom of file) — ~2K tokens
7. Then read whatever files are relevant to the current task

## Current state (as of P2-A completion, 2026-02-08)

### Phase 1 — COMPLETE, approved by maintainer
- PRD-003 (message lifecycle + SLA): Finalized. Promoted to `docs/prds/`.
- PRD-004 (maintainer decision contract): Finalized. Promoted to `docs/prds/`.
- PRD-008 (cross-sandbox handoff): Finalized. Promoted to `docs/prds/`.
- PRD-009 (cross-document reconciliation): Finalized. Promoted to `docs/prds/`.

### Phase 2 — IN PROGRESS (P2-B parallel tracks)

**Completed gates:**
- P2-A (OQ sync): DONE. All 5 OQ resolutions applied to registry and PRDs.
- Steps 2.1-2.3: Vision.md v2, PRD-013 draft + cross-review, PRD-012 R2 re-scope + cross-review. All done.

**Active work — P2-B parallel tracks (binding consensus):**

| Gate | Work | Owner |
|------|------|-------|
| **P2-B Track L** | PRD-005 cross-review + PRD-013 cleanup + PRD-011 update + PRD-007 cross-review + OQ-026 frame | **Claude** |
| P2-B Track C | PRD-010 re-scope + PRD-006 cross-review + interface deltas | Codex |
| P2-C | Joint integration gate: PRD-005/006/007/010/011/013 interfaces | Both |
| P2-D | PRD-012 M1-M3 + PRD-013 pilot | Both |
| P2-E | PRD-001 consolidation + PRD-002 planning | Both |

**Claude's Track L items (priority order):**
1. Cross-review PRD-005 (Protocol Data Schema) — policy clarity + maintainability
2. PRD-013 owner cleanup — canonical-ready structure
3. PRD-011 update — Turnfile in read order (OQ-042 already applied to R3; check for other needed updates)
4. Cross-review PRD-007 (Trust + Provenance) — governance framing
5. OQ-026 worked-example frame — trust anomalies blocking promotion

### PRD landscape

| PRD | Status | Phase 2 role |
|-----|--------|-------------|
| PRD-001 | Draft | P2-E consolidation audit |
| PRD-002 | Draft | P2-E implementation planning (blocked on PRD-005) |
| PRD-003 | Finalized, promoted | Phase 1 complete |
| PRD-004 | Finalized, promoted | Phase 1 complete |
| PRD-005 | Draft | **Claude cross-reviews (Track L)** |
| PRD-006 | Draft | Codex cross-reviews (Track C) |
| PRD-007 | Draft | **Claude cross-reviews (Track L)** |
| PRD-008 | Finalized, promoted | Phase 1 complete |
| PRD-009 | Finalized, promoted | Phase 1 complete |
| PRD-010 | Draft, OQs resolved | Codex re-scopes (Track C) — reconcile with PRD-013 Turnfile locks |
| PRD-011 | Draft, OQs resolved | **Claude updates (Track L)** — Turnfile read order applied |
| PRD-012 | Draft R2, cross-reviewed | P2-D pilot execution |
| PRD-013 | Draft, cross-reviewed | **Claude cleanup (Track L)** + P2-D pilot |

### Open questions
- 0 active
- 1 deferred: OQ-026 (trust anomalies blocking promotion — Claude's OQ-026 frame in Track L)
- 45 resolved

### Mailbox
- All queues empty. 0 unread for all agents. 31 messages total.

### WORKLOG
- ~1095 lines. Sessions 0–4 archived. **Above 500-line compaction trigger** — propose compaction when appropriate.

## Session close protocol

Before ending a session:
1. Update WORKLOG status block with current state
2. Close any open mailbox messages you own
3. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
4. Write session state snapshot to bottom of `chat-claude.md`
5. Promote completed artifacts from `inception/` to tracked `docs/` (copy, not move)
6. Commit and push tracked changes
7. Update this boot file if anything structural changed

## Key lessons learned

- `inception/` is gitignored. All active work lives there. Completed work gets copied to `docs/` for tracking.
- Agents are stateless. SLA is measured in session boundaries, not wall-clock time.
- TURNFILE.yaml is the first coordination read after the boot file — most compact and actionable state.
- The WORKLOG gets long fast. Compact per PRD-011 R5 when it exceeds 500 lines.
- Codex can't see your filesystem. Use payload-first messages with inline content for cross-agent reviews.
- When editing shared files (MAILBOX, WORKLOG, OPEN_QUESTIONS, TURNFILE.yaml), re-read immediately before editing — they may have been modified between reads.
- Locking is now revision-based (PRD-013 R1.3), not time-based. Use `lease_revs` in TURNFILE.yaml, not wall-clock expiry.
- Phase 2 uses a strength-based parallel split: Track C (Codex: precision/invariants/schema) and Track L (Claude: governance/narrative/process). Binding consensus in MSG-031.
