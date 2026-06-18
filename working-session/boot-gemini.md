# Boot File — Gemini (v4)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Three agents (Claude/Anthropic, Codex/OpenAI GPT-5, and Gemini/Google) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (003-014, 016 promoted; 001/002/015/017-020 in progress)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (`export-mailbox-json.mjs`, `new-payload-envelope.mjs`, `turnfile-lint.mjs`, `validate-mailbox-invariants.mjs`, `validate-prd-promotion.mjs`, `validate-skills-preflight.mjs`)
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/claude/` — Claude's protocol execution guide
  - `skills/codex/` — Codex's protocol execution guide
  - `skills/gemini-3/` — Gemini's legacy protocol execution guide (v0.1.0)
  - `skills/skill-versioning/` — Shared metaskill for skill bundle version tracking (v3)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `.agents/skills/` — Project-scoped skills for Google Antigravity discovery:
  - `.agents/skills/turnfile-protocol-gemini/` — Gemini's active protocol execution guide (v0.2.2)
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`)
- `working-session/` — **Tracked active workspace.** All session state lives here (tracked in git since session 13, not gitignored):
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact. Read first after boot file.
  - `working-session/WORKLOG.md` — Session log with status block (read lines 1-11 after Turnfile)
  - `working-session/WORKLOG_ARCHIVE.md` — Archived sessions
  - `working-session/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `working-session/MAILBOX.json` — Machine-readable mailbox projection
  - `working-session/MAILBOX_ARCHIVE.md` — Full message history
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `working-session/boot-gemini.md` — This file
  - `working-session/boot-claude.md` — Claude's boot file
  - `working-session/boot-codex.md` — Codex's boot file
  - `working-session/chat-gemini.md` — Gemini's scratchpad and session state snapshots
  - `working-session/docs/` — In-progress PRDs and PRD_STATUS.json

## Onboarding status: FULL-ACTIVE (PRD-015)

You are a **FULL-ACTIVE** agent (no longer provisional). This means:

1. Your onboarding evidence chain (OT-001/007/008/002/004) and PRD-027 production-competence gate (7/8 PASS) are officially accepted and ratified.
2. `policy.required_reviewers` has been extended to `{codex, claude, maintainer, gemini}`. You are now a required reviewer for all new PRDs.
3. You have full write authority on Gemini-owned files and collaborative files under protocol.

## Resumption read order (PRD-017 / PRD-037 R2)

1. **This file** (`working-session/boot-gemini.md`)
2. Run `tools/session-orient.mjs --agent gemini --emit json` to inspect workspace state:
   - Check if TURNFILE revision, inbox, recommended commands, and projections are fresh.
   - If findings exist, target the underlying files (TURNFILE.yaml, WORKLOG.md, MAILBOX.md, etc.) on demand.
3. If no findings, proceed directly to the task at hand.

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Gemini unread=0 before turn is done.
- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision tokens with `Related` linkage.
- **Open questions:** Registry in `working-session/OPEN_QUESTIONS.md`. Check at session start. Update when resolving.
- **Decision authority (OQ-052 resolution):** All changes are Maintainer-gated by default; selective unlocks happen only by explicit Maintainer direction.
- **Turnfile (PRD-013):** YAML coordination artifact. Agents read/write for task tracking, lock management, signals. Revision-based leases (no wall-clock). Section ownership model (R2.1).
- **Locking (PRD-010 + PRD-013):** Locks live in TURNFILE.yaml `locks` section. Default lease: 2 revisions.
- **Session closeout (PRD-014):** Mandatory checklist: mailbox clearance, boot rollover + archive, worklog maintenance + compaction check, OQ sync, reflection entry.
- **Skill versioning:** Shared metaskill at `skills/skill-versioning/SKILL.md`. Tracks bundle versions, manifests, changelogs across sessions and platforms.

## Current state

Session 21 closed at rev 280. Gemini has completed all onboarding, teach-gate, and version observation deliverables, and is now FULL-ACTIVE. We have processed all unread messages.

### Carry Forward / Session 22 Plan:

1. **Drive PRD-035 (Tokenese sync) loop**: Gemini proposer authors RED evals in `evals/prd-035.evals.mjs` (step 4) -> Codex implements -> Claude reviews.
2. **Review Codex's MSG-20260617-066**: Perform peer cross-review on PRD-014 active-card owner review gate.
3. **Commit posture**: Perform commits using `TURNFILE_AGENT=gemini` to verify ownership boundaries.

## Session close protocol

Before ending a session:
1. **Check mailbox** — ensure Gemini unread=0
2. Update WORKLOG status block with current state
3. Close any open mailbox messages you own
4. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
5. **Regenerate `MAILBOX.json`** if mailbox changed: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`
6. **Run validation gates:**
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
   - `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent gemini`
7. Write session state snapshot to bottom of `working-session/chat-gemini.md`
8. Archive current boot file to `docs/archive/boot-gemini/boot-gemini_v<N>.md` (globally monotonic)
9. Write new boot file with updated state
10. **WORKLOG compaction check** — if WORKLOG exceeds 500 lines, compact to WORKLOG_ARCHIVE.md (PRD-011 R5)
11. Promote completed artifacts only when explicitly directed by maintainer
12. Commit and push tracked changes under `TURNFILE_AGENT=gemini`
13. **Final mailbox check** — confirm Gemini unread=0
