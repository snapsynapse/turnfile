# Boot File — Codex (v3)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Two agents (Claude/Anthropic and Codex/OpenAI GPT-5) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (`PROTOCOL_CORE`, `COMMUNICATIONS_PROTOCOL`, `HUMAN_GOVERNANCE`, etc.)
- `docs/prds/` — Promoted finalized PRDs (`PRD-003` through `PRD-014`)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (`export-mailbox-json.mjs`, `new-payload-envelope.mjs`, `turnfile-lint.mjs`, `validate-mailbox-invariants.mjs`, `validate-prd-promotion.mjs`, `validate-skills-preflight.mjs`)
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/codex/SKILL.md` — Codex protocol execution guide
  - `skills/claude-opus_4.6/SKILL.md` — Claude protocol execution guide
  - `skills/skill-versioning/` — Shared metaskill for skill bundle version tracking (v3)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`)
- `working-session/` — **Gitignored active workspace.** All session state lives here:
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact. Read first after boot file.
  - `working-session/WORKLOG.md` — Session log with status block (read lines 1–11 after Turnfile)
  - `working-session/WORKLOG_ARCHIVE.md` — Archived sessions
  - `working-session/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `working-session/MAILBOX.json` — Machine-readable mailbox projection
  - `working-session/MAILBOX_ARCHIVE.md` — Full message history
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `working-session/boot-codex.md` — This file
  - `working-session/boot-claude.md` — Claude boot file
  - `working-session/chat-codex.md` — Codex scratchpad and session snapshots
  - `working-session/docs/` — In-progress PRDs and `PRD_STATUS.json`

## Fresh session bootstrap (cold start)

If `working-session/TURNFILE.yaml` does not exist (fresh branch, new checkout, or first session):

1. Copy all files from `templates/working-session/` into `working-session/`.
2. Rename `boot-agent.md` -> `boot-codex.md` and `chat-agent.md` -> `chat-codex.md`.
3. Fill `<PLACEHOLDER>` values in `TURNFILE.yaml`, `WORKLOG.md`, and `MAILBOX.md`:
   - `<PROJECT_NAME>` -> `Turnfile`
   - `<project-name>` -> `turnfile`
   - `<maintainer-id>` -> `snap`
   - `<AGENT_NAME>` -> `Codex`
   - `<YYYY-MM-DD>` -> current date
4. Set `agents.codex.status: "active"` and `agents.codex.session_id: "codex-session-<N>"` in `TURNFILE.yaml`.
5. Post first signal in `TURNFILE.yaml` `messages` section.
6. Run startup validation gates before first shared-file mutation:
   - `npm run -s validate:skills`
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
7. If any gate fails, escalate in mailbox/worklog before continuing with substantive edits.
8. Then proceed to normal resumption read order below.

If `working-session/TURNFILE.yaml` exists, skip to resumption read order.

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Codex unread=0 before turn completion.
- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Mailbox format:** Newest-first compact view. Inbox Snapshot -> Open Queue -> Active Messages -> Closed Summary -> Archive pointer.
- **Payload-first rule (PRD-008):** Review requests include inline payload + revision token (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision token with `Related` linkage.
- **Open questions:** Registry in `working-session/OPEN_QUESTIONS.md`. Check at session start and update when resolving.
- **Decision contract (PRD-004):** Maintainer decisions require WORKLOG linkage. Relay decisions with `> Maintainer: "<exact text>"` quoting.
- **Decision authority (OQ-052 resolution):** All changes are Maintainer-gated by default; selective unlocks happen only by explicit Maintainer direction.
- **Turnfile (PRD-013):** YAML coordination artifact for tasks, locks, and signals. Revision-based leases, no wall-clock expiry. Section ownership model applies.
- **Locking (PRD-010 + PRD-013):** Locks live under `TURNFILE.yaml` `locks`; expiry check is `(coordination.revision - acquired_rev) > lease_revs`. Default `lease_revs: 2`.
- **Session closeout (PRD-014):** Use explicit checklist (mailbox clearance, worklog sync, turnfile sync, validation, boot rollover).
- **Skill file (PRD-012):** Codex execution contract is `skills/codex/SKILL.md` (module map `M-00` through `M-08`).
- **Skill versioning:** Shared metaskill at `skills/skill-versioning/SKILL.md` governs manifest/changelog/hash discipline for skill bundles.

## Resumption read order (PRD-011 R3)

1. **This file** (`working-session/boot-codex.md`)
2. `working-session/TURNFILE.yaml` — coordination state (phase, tasks, locks, agent status, signals) — ~200 tokens
3. `working-session/WORKLOG.md` lines 1–11 (status block) — ~200 tokens
4. `working-session/MAILBOX.md` inbox snapshot — ~500 tokens — check for Codex unread
5. `working-session/OPEN_QUESTIONS.md` Active + Deferred sections — ~200 tokens
6. `working-session/chat-codex.md` session close snapshot (bottom of file) — ~2K tokens
7. Then read scope-specific files for current task

## Current state (as of session 12, 2026-02-11)

### Branch: `feature/skills` (forked from `main` after session 11)

Session numbering is global-monotonic across branches. This branch forked from main after session 11 (inception pilot close).

### Phase 2 — P2-E in progress

**Completed prior:**
- Phase 1: PRD-003/004/008/009 finalized and promoted.
- P2-A through P2-D: complete.
- Inception pilot archived to `examples/inception/`.

**Session 12 work (feature/skills):**
- Shared metaskill alignment complete (`skills/skill-versioning/` v3).
- Codex P-5/P-6 complete (`tools/validate-skills-preflight.mjs`, `validate:skills` scripts).
- Codex P-1 complete (`working-session/boot-codex.md` rewrite).
- Cross-review loop active with Claude via mailbox.

**Turnfile tasks:**

| Task | Owner | Status |
|------|-------|--------|
| `p2e-prd-001-consolidation` | unassigned | pending |
| `p2e-prd-002-planning` | unassigned (depends on 001) | pending |
| `prd-015-maintainer-acceptance` | maintainer | pending |
| `prd-016-maintainer-acceptance` | maintainer | pending |

### PRD landscape

| PRD | Status | Location |
|-----|--------|----------|
| `PRD-001`, `PRD-002` | Draft | `working-session/docs/` |
| `PRD-003` through `PRD-014` | Promoted | `docs/prds/` |
| `PRD-015`, `PRD-016` | Pending Maintainer acceptance | `working-session/docs/` |
| `PRD-017` through `PRD-020` | Draft | `working-session/docs/` |

### Open questions

- Active: `OQ-051`, `OQ-054`, `OQ-055`, `OQ-056`, `OQ-057`
- Resolved: `OQ-052`, `OQ-053` (Maintainer decision: all changes Maintainer-gated by default)

### Mailbox

- Check live snapshot in `working-session/MAILBOX.md` and `working-session/MAILBOX.json`.
- Do not rely on stale counts embedded in this file.

### Coordination

- `TURNFILE.yaml` revision: 10+ (live value in file header)
- Both agents active; no active locks or turn queue entries expected unless task-specific work is underway

## Session close protocol

Before ending a session:

1. **Check mailbox** — ensure Codex unread=0.
2. Update WORKLOG status block with current state.
3. Close any open mailbox messages you own.
4. Update `TURNFILE.yaml` (agent status, tasks, signals, lock cleanup).
5. Regenerate `MAILBOX.json` if mailbox changed:
   - `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`
6. Run validation gates:
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
7. Append/update session snapshot in `working-session/chat-codex.md`.
8. Archive current boot file to `docs/archive/boot-codex/boot-codex_v<N>.md` (globally monotonic).
9. Write refreshed `working-session/boot-codex.md` for next handoff.
10. WORKLOG compaction check: if WORKLOG exceeds 500 lines, compact to `WORKLOG_ARCHIVE.md`.
11. Promote artifacts only when Maintainer explicitly directs and promotion gate passes.
12. Commit/push only when Maintainer directs.
13. **Final mailbox check** — confirm Codex unread=0.

## Key lessons learned

- `working-session/` is gitignored runtime state; tracked docs require explicit promotion.
- Agents are stateless between sessions; treat mailbox/worklog/turnfile as continuity substrate.
- TURNFILE is the most compact coordination read after the boot file.
- Mailbox-first discipline prevents hidden approvals.
- **Transaction discipline for shared files:** read -> edit -> validate -> signal.
- Re-read shared files immediately before write if concurrent edits are possible.
- Locking is revision-based, not time-based.
- After mailbox edits, run invariants and regenerate `MAILBOX.json`.
- Promotion is gated by Maintainer acceptance + PRD_STATUS + validation tooling.
- Keep this boot file aligned with `working-session/boot-claude.md` on protocol semantics while preserving Codex-specific execution details.
