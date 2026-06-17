# Boot File — Claude (v10)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Three agents (Claude/Anthropic, Codex/OpenAI GPT-5, and Gemini/Google — Gemini onboarding in progress) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (001, 003-014, 016 promoted; 002/015/017-020 in progress)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (`export-mailbox-json.mjs`, `new-payload-envelope.mjs`, `turnfile-lint.mjs`, `validate-mailbox-invariants.mjs`, `validate-prd-promotion.mjs`, `validate-skills-preflight.mjs`)
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/claude-opus_4.6/SKILL.md` — Claude's protocol execution guide (v0.3.0)
  - `skills/codex_5.3/SKILL.md` — Codex's protocol execution guide
  - `skills/gemini-3/SKILL.md` — Gemini's protocol execution guide (v0.1.0, onboarding candidate)
  - `skills/skill-versioning/` — Shared metaskill for skill bundle version tracking (v3)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`)
- `GEMINI.md` — Project root instruction file for Gemini CLI (onboarding artifact)
- `working-session/` — **Tracked active workspace** (removed from .gitignore in session 13). All session state lives here:
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact. Read first after boot file.
  - `working-session/WORKLOG.md` — Session log with status block (read lines 1-11 after Turnfile)
  - `working-session/WORKLOG_ARCHIVE.md` — Archived sessions (session 12 compacted here)
  - `working-session/MAILBOX.md` — Agent-to-agent message queue (newest-first compact format)
  - `working-session/MAILBOX.json` — Machine-readable mailbox projection
  - `working-session/MAILBOX_ARCHIVE.md` — Full message history
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `working-session/boot-claude.md` — This file
  - `working-session/boot-codex.md` — Codex boot file
  - `working-session/boot-gemini.md` — Gemini boot file (onboarding artifact)
  - `working-session/chat-claude.md` — Claude's scratchpad and session state snapshots
  - `working-session/docs/` — In-progress PRDs and PRD_STATUS.json
  - `working-session/docs/gemini-onboarding/` — Gemini-specific onboarding artifacts
  - `working-session/docs/onboarding/` — Candidate-agnostic onboarding test suite and evidence

## Fresh session bootstrap (cold start)

If `working-session/TURNFILE.yaml` does not exist (fresh branch, new checkout, or first session):

1. Copy all files from `templates/working-session/` into `working-session/`.
2. Rename `boot-agent.md` to `boot-claude.md` and `chat-agent.md` to `chat-claude.md`.
3. Fill `<PLACEHOLDER>` values in TURNFILE.yaml, WORKLOG.md, MAILBOX.md.
4. Set `agents.claude.status: "active"` and `session_id: "claude-session-<N>"` in TURNFILE.yaml.
5. Post first signal in TURNFILE.yaml `messages` section.
6. Run startup validation gates before first shared-file mutation:
   - `npm run -s validate:skills` (skills preflight — verify SKILL.md readable, frontmatter parses, manifest hashes match)
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
7. If any gate fails, escalate in mailbox/worklog before continuing with substantive edits.
8. Then proceed to normal resumption read order below.

If TURNFILE.yaml exists, skip to resumption read order.

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Claude unread=0 before turn is done.
- **Whenever you have an unread mailbox item, continue until that mailbox item is read and acknowledged.** (Maintainer standing directive from session 13.)
- **Message lifecycle (PRD-003):** 5 statuses: `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries, not wall-clock.
- **Mailbox format:** Newest-first compact view. Inbox Snapshot -> Open Queue -> Active Messages -> Closed Summary -> Archive pointer.
- **Payload-first rule (PRD-008):** Review requests must include inline content with revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Revision token integrity (PRD-009 R2):** Content-modifying responses require new superseding revision tokens with `Related` linkage.
- **Open questions:** Registry in `working-session/OPEN_QUESTIONS.md`. Check at session start. Update when resolving.
- **Decision contract (PRD-004):** Maintainer decisions require WORKLOG linkage. Relay messages need `> Maintainer: "<exact text>"` blockquote.
- **Decision authority (OQ-052 resolution):** All changes are Maintainer-gated by default; selective unlocks happen only by explicit Maintainer direction.
- **Turnfile (PRD-013):** YAML coordination artifact. Agents read/write for task tracking, lock management, signals. Revision-based leases (no wall-clock). Section ownership model (R2.1).
- **Locking (PRD-010 + PRD-013):** Locks live in TURNFILE.yaml `locks` section. Revision-based lease expiry: `(coordination.revision - acquired_rev) > lease_revs`. Default `lease_revs: 2`.
- **Conflict bound (PRD-021):** Level 2 rebuttal loops use `coordination.conflict.rebuttal_rounds`; finite exhaustion routes to Level 4 Maintainer adjudication, while unbounded loops converge only on fresh `NO-NEW-OBJECTION` markers from all participating agents.
- **Selective-unlock gradient (PRD-021/018):** Band A is `unlockable` by default, Bands B/C are `gated`; `unlockable` is only eligibility until explicit Maintainer unlock.
- **Session closeout (PRD-014):** Mandatory checklist: mailbox clearance, boot rollover + archive, worklog maintenance + compaction check, OQ sync, reflection entry.
- **Session rotation (PRD-016):** Request a new session when approaching context limits. Don't wait until context is exhausted.
- **Skill file (PRD-012):** Claude's protocol execution guide at `skills/claude-opus_4.6/SKILL.md` (v0.3.0). Explicit maintainer invocation only. Mandatory confirmation for all writes. 9 modules (Module 0-8).
- **Skill versioning:** Shared metaskill at `skills/skill-versioning/SKILL.md`. Tracks bundle versions, manifests, changelogs across sessions and platforms.

## Resumption read order (PRD-011 R3)

The cross-agent command contract for this is the canonical boot command manifest `docs/BOOT_SEQUENCE.md` (PRD-017): ordered read order, read-only verification commands, and stop/continue/escalate rules. This file holds Claude-specific orientation. Optional `tools/validate-boot-sequence.mjs` checks control-plane preconditions.

**Chat-file semantics (PRD-017 R7):** boot creates only Claude's own `chat-claude.md` if absent. A missing peer chat (`chat-codex.md`) is a warning only — boot never creates a peer chat file.

**Out-of-band drift check (PRD-023):** before trusting remembered state, reconcile any out-of-band activity (Maintainer edits or peer commits made outside the turn loop) against the WORKLOG. Unrecorded changes that altered governance state are decision-required (record/escalate before acting); non-governance drift is a warning. Optional `tools/validate-out-of-band-reconciliation.mjs`.

1. **This file** (`working-session/boot-claude.md`)
2. `working-session/TURNFILE.yaml` — coordination state (phase, tasks, locks, agent status, signals) — ~300 tokens
3. `working-session/WORKLOG.md` lines 1-10 (status block) — ~200 tokens
4. `working-session/MAILBOX.md` inbox snapshot — ~500 tokens — check for unread messages
5. `working-session/OPEN_QUESTIONS.md` Active + Deferred sections — ~200 tokens
6. `working-session/chat-claude.md` session close snapshot (bottom of file) — ~2K tokens
7. Then read whatever files are relevant to the current task

## Current state (as of close, 2026-06-17)

Claude lane on Opus 4.8, Codex lane on Codex 5.5 — model-generation continuity on one unmodified protocol holds (`docs/llm/MODEL_LEDGER.md`). Note: state has run well past the old "session 15" framing — read the files, not this label.

### FIRST ACTIONS ON RESUME (session 17)

1. Boot via `docs/BOOT_SEQUENCE.md`, then run `working-session/NEXT_SESSION_HANDSHAKE.md` — the handshake contract (Turnfile version, Tokenese version, skills self-validate, scope + completion criteria, outstanding list, + the 6 additions) and converge/sign it with Codex before any write.
2. Closure-owner sweep: scan own sent-message threads for peer replies that did not raise the unread count (thread-mode blindness).
3. Resolve guard/commit posture (PRD-033) before any commit; report enforcing `TURNFILE_AGENT` + `core.hooksPath`. Then pick the bounded session goal from the handshake §5 outstanding list (PRD-032/033 Maintainer acceptance, Tokenese W3/L2 scoring + W4/L3, etc.).
4. Deferred closeout from session 16 (execute-or-defer): signal-log compaction (~64 eligible, PRD-013 R5.3) + boot-archive rollover.

### Recent milestones (this arc)

- PRD-027 greenlit (charter ratified, PRD-030 accepted). First live Tokenese A/B mini-pilot COMPLETE: W1 win-conformant (Tokenese wins on tokens), L1 l1-plain-success (correct dense refusal). Scored by Perplexity's deterministic checker (`~/Git/tokenese/tools/translator`, 72/72 tests, all pre-eval items cleared).
- PRD-030 (session heartbeat management) + PRD-031 (concurrent multi-agent coordination) PROMOTED to `docs/prds` (Maintainer-directed). PRD-031 carries an implementation-pending object (A1 Phase-1 lane).

### PRD landscape (authoritative: `working-session/docs/PRD_STATUS.json`)

- PRD-027: accepted + promoted; A/B execution underway (mini-pilot done, full suite next).
- PRD-030, PRD-031: promoted to docs/prds; PRD-031 implementation (Phase 1) pending.
- Carry-forward (Codex lanes): PRD-014 A1 impl; PRD-021/022/024 impl (evals red); PRD-023/026/017 eval-authoring -> Claude implements; PRD-024 R5.1 validator.

### Operating norms (skill v0.6.0)
- Files First, Not Memory (this whole arc proved it — state moved far past memory between turns); Concurrent Write Discipline (derive via tools/next-state.mjs in-lock; concurrent-close ID collisions WILL happen — renumber per PRD-010 R4.5); eight-step A1 loop; Model Ledger Handshake.
- Tokenese pilot (PRD-027 + charter): every clone paired to a legible source; source wins; no dense for reasoning (R1); ^N/ev: untrusted until calibration; R7 cross-repo boundary (never edit tokenese semantics — the checker lives there).

### Mailbox & coordination
- At Claude close: Claude idle, unread 0, no locks. Open Claude-owned: MSG-20260617-005/006 (mini-pilot + close; Codex acks/closes), MSG-20260613-044 (PRD-014 A1; Codex APPLY'd, impl pending).
- Heartbeat: Codex's `turnfile-session-heartbeat` retirement requested at close (MSG-006) — verify on resume.
- TURNFILE revision ~166+ at close. Read it fresh (Files-First).
- Detailed resume snapshot: bottom of `working-session/chat-claude.md`.

## Session close protocol

Before ending a session:
1. **Check mailbox** — ensure Claude unread=0
2. Update WORKLOG status block with current state
3. Close any open mailbox messages you own
4. Update TURNFILE.yaml (agent status idle, tasks done, clean up locks/turn_queue)
5. **Regenerate `MAILBOX.json`** if mailbox changed: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`
6. **Run validation gates:**
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
7. Write session state snapshot to bottom of `working-session/chat-claude.md`
8. Archive current boot file to `docs/archive/boot-claude/boot-claude_v<N>.md` (globally monotonic)
9. Write new boot file with updated state
10. **WORKLOG compaction check** — if WORKLOG exceeds 500 lines, compact to WORKLOG_ARCHIVE.md (PRD-011 R5)
11. Promote completed artifacts only when explicitly directed by maintainer and only for PRDs that pass the promotion gate
12. Commit and push tracked changes only when maintainer directs
13. **Final mailbox check** — confirm Claude unread=0

## Key lessons learned

- `working-session/` is now tracked in git (changed in session 13). All active work lives there. Completed work gets copied to `docs/` for tracking.
- Agents are stateless. SLA is measured in session boundaries, not wall-clock time.
- TURNFILE.yaml is the first coordination read after the boot file — most compact and actionable state.
- The WORKLOG gets long fast. Compact per PRD-011 R5 when it exceeds 500 lines.
- Codex can't see your filesystem. Use payload-first messages with inline content for cross-agent reviews.
- **Transaction discipline for shared-file edits:** read -> edit -> validate -> signal. Re-read immediately before editing — files may have been modified between reads. If concurrent edits are detected, re-read and merge deliberately before writing.
- Locking is revision-based (PRD-013 R1.3), not time-based. Use `lease_revs` in TURNFILE.yaml, not wall-clock expiry.
- Check mailbox first and last on every turn. Your messages should be unread=0 before you're done.
- After any milestone/task completion, refresh WORKLOG status block + Turnfile metadata + mailbox lifecycle in the same turn (State Freshness Hooks).
- After mailbox edits, verify inbox snapshot counts match actual unread states. Run `tools/validate-mailbox-invariants.mjs`.
- `working-session/MAILBOX.json` is a machine-readable projection. Use it for quick state checks instead of parsing full MAILBOX.md.
- Promotion is conditional on maintainer direction + promotion gate pass (PRD_STATUS.json + validate-prd-promotion.mjs). Never auto-promote.
- The project name is "Turnfile" — reference as "Turnfile protocol (a SNAP protocol)" not "SNAP protocol."
- Session numbers are global-monotonic across branches. When a branch forks, note the fork point in WORKLOG.
- Request a new session proactively when approaching context limits (PRD-016). Don't wait until context is exhausted.
