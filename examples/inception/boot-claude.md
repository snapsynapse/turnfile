# Boot File — Claude (v4)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Two agents (Claude/Anthropic and Codex/OpenAI GPT-5) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (Phase 1: 003/004/008/009; Phase 2 shelf: 005/006/007/010/011/014/015/016)
- `templates/` — Canonical templates
- `examples/` — Historical reference (ai-feature-tracker project). **Next: inception pilot archival for study/onboarding.**
- `tools/` — Gitignored local tooling (`export-mailbox-json.mjs`, `new-payload-envelope.mjs`, `turnfile-lint.mjs`, `validate-mailbox-invariants.mjs`, `validate-prd-promotion.mjs`)
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
  - `inception/docs/` — In-progress PRDs (001, 002, 012, 013, 014, 015, 016)
  - `inception/skills/` — Agent skill files: `skill-claude.md` (v0.2.0), `turnfile-codex-collaboration/SKILL.md`, `STRUCTURE.md`, `policy-tests/`
  - `inception/schemas/` — `turnfile/turnfile-v0.schema.json` (PRD-013 M1)
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
- **Skill file (PRD-012):** Claude's protocol execution guide at `inception/skills/skill-claude.md` (v0.2.0). Explicit maintainer invocation only. Mandatory confirmation for all writes. 8 modules.

## Resumption read order (PRD-011 R3)

1. **This file** (`inception/boot-claude.md`)
2. `inception/TURNFILE.yaml` — coordination state (phase, tasks, locks, agent status, signals) — ~200 tokens
3. `inception/WORKLOG.md` lines 1–11 (status block) — ~200 tokens
4. `inception/MAILBOX.md` inbox snapshot — ~500 tokens — check for unread messages
5. `inception/OPEN_QUESTIONS.md` Active + Deferred sections — ~200 tokens
6. `inception/chat-claude.md` session close snapshot (bottom of file) — ~2K tokens
7. Then read whatever files are relevant to the current task

## Current state (as of session 11 close, 2026-02-08)

### Phase 1 — COMPLETE, approved by maintainer
- PRD-003/004/008/009: Finalized. Promoted to `docs/prds/`.

### Phase 2 — P2-D COMPLETE. P2-E pending.

**Completed gates:**
- P2-A through P2-D: All done. See WORKLOG session 10-11 entries for details.
- PRD-012 M1-M4 complete (skill files, policy tests, validation scenarios).
- PRD-013 M1-M2 complete (schema, linter). Exit criterion #1 met.
- Both deferred items exercised: PRD-003 AC#4 (stale message drill), PRD-008 AC#6 (helper script).
- PRD-014/015/016 drafted, cross-reviewed, recommendations applied.
- Promotion gate guardrails in place (PRD_STATUS.json + validate-prd-promotion.mjs).

**Next work:**

| Priority | Work | Owner |
|----------|------|-------|
| **1** | **Inception → examples migration** | **Claude** |
| 2 | P2-E: PRD-001 consolidation + PRD-002 planning | Both |

### Inception → examples migration (NEXT TASK)

Maintainer directed Claude to archive completed inception pilot artifacts to `examples/` for study and onboarding of additional models. **This is NOT a whole-directory move.** Only completed work goes.

**Guardrails (MSG-047, acked by Claude with 3 additions):**
1. **Scope freeze** before moves — categorize each file explicitly
2. **Promotion-gate separation** — PRDs stay in existing promotion workflow, not mixed with examples archival
3. **Manifest requirement** — examples bundle gets a README with reading order for onboarding
4. **Transaction safety** — run all 3 validators after moves
5. **Rollback safety** — maintain rollback list until maintainer finalization

**Scope (per maintainer direction):**
- TURNFILE.yaml, MAILBOX.md, WORKLOG.md → examples (confirmed)
- Skills and schemas → permanent project homes (not just examples)
- PRDs → stay in existing promotion workflow (docs/prds/)
- Purpose: "archiving that makes it available for study, as opposed to just filing away"
- "This information will be used in the onboarding of additional models"

**Open scope questions (ask maintainer at session start):**
- Which additional files? (WORKLOG_ARCHIVE.md? MAILBOX_ARCHIVE.md? OPEN_QUESTIONS.md? chat-claude/codex.md? VISION.md? NOTIFICATION_PROTOCOL.md?)
- Where do skills permanently live? (repo root `skills/`?)
- Where do schemas permanently live? (repo root `schemas/`?)

### PRD landscape (16 PRDs)

| PRD | Status | Location |
|-----|--------|----------|
| PRD-001 | Draft | inception/docs/ |
| PRD-002 | Draft | inception/docs/ |
| PRD-003 | Finalized, promoted | docs/prds/ |
| PRD-004 | Finalized, promoted | docs/prds/ |
| PRD-005 | Cross-reviewed, shelf | docs/prds/ |
| PRD-006 | Cross-reviewed, shelf | docs/prds/ |
| PRD-007 | Cross-reviewed, shelf | docs/prds/ |
| PRD-008 | Finalized, promoted | docs/prds/ |
| PRD-009 | Finalized, promoted | docs/prds/ |
| PRD-010 | Hardened, shelf | docs/prds/ |
| PRD-011 | Hardened, shelf | docs/prds/ |
| PRD-012 | Draft R2 | inception/docs/ |
| PRD-013 | Draft, hardened | inception/docs/ |
| PRD-014 | Draft | inception/docs/ |
| PRD-015 | Draft | inception/docs/ |
| PRD-016 | Draft | inception/docs/ |

### Open questions
- 0 active, 0 deferred, 50 resolved. Clean slate.

### Mailbox
- All queues empty. 0 unread for all agents. 47 messages total.
- **Tip:** `inception/MAILBOX.json` is a machine-readable projection. Lighter to parse than full markdown mailbox.

### WORKLOG
- ~1180 lines. Sessions 0–9 archived. Above 500-line compaction trigger (session 10 entries could be compacted).

### Coordination
- TURNFILE.yaml revision: 50. All P2-D tasks done. Claude idle.
- No active locks or turn queue entries.
- 32 signals in log.

## Session close protocol

Before ending a session:
1. **Check mailbox** — ensure Claude unread=0
2. Update WORKLOG status block with current state
3. Close any open mailbox messages you own
4. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
5. Write session state snapshot to bottom of `chat-claude.md`
6. Archive current boot file to `inception/archive/boot-claude/boot-claude_v<N>.md`
7. Write new boot file with updated state
8. Promote completed artifacts only when explicitly directed by maintainer and only for PRDs that pass the promotion gate
9. Commit and push tracked changes only when maintainer directs
10. **Final mailbox check** — confirm Claude unread=0

## Key lessons learned

- `inception/` is gitignored. All active work lives there. Completed work gets copied to `docs/` for tracking.
- Agents are stateless. SLA is measured in session boundaries, not wall-clock time.
- TURNFILE.yaml is the first coordination read after the boot file — most compact and actionable state.
- The WORKLOG gets long fast. Compact per PRD-011 R5 when it exceeds 500 lines.
- Codex can't see your filesystem. Use payload-first messages with inline content for cross-agent reviews.
- When editing shared files (MAILBOX, WORKLOG, OPEN_QUESTIONS, TURNFILE.yaml), re-read immediately before editing — they may have been modified between reads.
- Locking is now revision-based (PRD-013 R1.3), not time-based. Use `lease_revs` in TURNFILE.yaml, not wall-clock expiry.
- Check mailbox first and last on every turn. Your messages should be unread=0 before you're done.
- After any milestone/task completion, refresh WORKLOG status block + Turnfile metadata + mailbox lifecycle in the same turn (State Freshness Hooks).
- After mailbox edits, verify inbox snapshot counts match actual unread states. Run `tools/validate-mailbox-invariants.mjs` if available.
- `inception/MAILBOX.json` is a machine-readable projection of `MAILBOX.md`. Use it for quick state checks instead of parsing the full markdown mailbox.
- Promotion is conditional on maintainer direction + promotion gate pass (PRD_STATUS.json + validate-prd-promotion.mjs). Never auto-promote.
- The project name is "Turnfile" — reference as "Turnfile protocol (a SNAP protocol)" not "SNAP protocol."
