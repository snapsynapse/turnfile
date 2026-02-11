# Boot File — <AGENT_NAME> (v1)

<!--
This is the first file an agent reads on session start.
Copy this template and rename to boot-<agent>.md (e.g., boot-claude.md, boot-gemini.md).
Update all <PLACEHOLDER> values before first use.
-->

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is this project?

<PROJECT_DESCRIPTION>

## Directory layout

- `docs/` — Canonical tracked protocol documents
- `docs/prds/` — Promoted finalized PRDs
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates
- `examples/` — Historical reference and study material
- `tools/` — Project tooling (linter, validators, exporters)
- `skills/` — Per-agent protocol skill files
- `schemas/` — JSON schemas for protocol artifacts
- `working-session/` — **Active workspace.** All session state lives here:
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact
  - `working-session/WORKLOG.md` — Session log with status block
  - `working-session/MAILBOX.md` — Agent-to-agent message queue
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `working-session/boot-<agent>.md` — Per-agent boot files
  - `working-session/chat-<agent>.md` — Per-agent scratchpads
  - `working-session/docs/` — In-progress PRDs

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure your unread=0 before turn is done.
- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens. No path-only references.
- **Turnfile (PRD-013):** YAML coordination artifact. Revision-based leases (no wall-clock).
- **Locking (PRD-010 + PRD-013):** Locks in TURNFILE.yaml. Lease expiry: `(revision - acquired_rev) > lease_revs`.

## Resumption read order (PRD-011 R3)

1. **This file** (`working-session/boot-<agent>.md`)
2. `working-session/TURNFILE.yaml` — coordination state
3. `working-session/WORKLOG.md` lines 1-11 (status block)
4. `working-session/MAILBOX.md` inbox snapshot — check for unread
5. `working-session/OPEN_QUESTIONS.md` Active + Deferred sections
6. `working-session/chat-<agent>.md` session close snapshot (bottom of file)
7. Then read whatever files are relevant to the current task

## Current state

<!--
Update this section at every session close. Example:

### Phase 1 — IN PROGRESS
- Task A: Done.
- Task B: In progress. Claude owns.
- Task C: Not started. Depends on B.

### Mailbox
- All queues empty. 0 unread for all agents.

### Coordination
- TURNFILE.yaml revision: 5. Active step: Task B.
-->

## Session close protocol

Before ending a session:
1. **Check mailbox** — ensure your unread=0
2. Update WORKLOG status block with current state
3. Close any open mailbox messages you own
4. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
5. Write session state snapshot to bottom of `chat-<agent>.md`
6. Archive current boot file to `docs/archive/boot-<agent>/boot-<agent>_v<N>.md`
7. Write new boot file with updated state
8. **Final mailbox check** — confirm your unread=0
