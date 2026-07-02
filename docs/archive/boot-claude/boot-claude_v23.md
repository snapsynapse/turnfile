# Boot File — Claude (v23)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. THREE agents (Claude/Anthropic, Codex/OpenAI GPT-5, Gemini/Google Antigravity 3.5 Flash) collaborate as **equal peers** through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Gemini transitioned from provisional-active to FULL-ACTIVE in session 21 (2026-06-18). Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (PRD-001, 003-017, 021-038 promoted as of session 21; see PRD_STATUS for the authoritative list — 41 PRDs tracked)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (export-mailbox-json, new-payload-envelope, turnfile-lint, validate-mailbox-invariants, validate-prd-promotion, validate-skills-preflight, next-state, session-orient, validate-closeout (now agent-scoped per PRD-014 active-card-owner-review), validate-ownership-guard, validate-boot-sequence, validate-out-of-band-reconciliation, validate-review-cycle-closure, aggregate-coordination, validate-public-surface-snapshot, run-prd-evals, handshake-sign, validate-onboarding-evidence)
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/claude/SKILL.md` — Claude's protocol execution guide (v0.9.1 / bundle v13 at session 21 close)
  - `skills/codex/SKILL.md` — Codex's protocol execution guide (v11 after session 21 PRD-014 active-card-owner-review patch)
  - `.agents/skills/turnfile-protocol-gemini/SKILL.md` — Gemini's Antigravity skill bundle
  - `skills/skill-versioning/` — Shared metaskill (skill-provenance)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`); agent-agnostic
- `OWNERSHIP.yaml` — Maintainer-owned skill ownership map driving the PRD-033 guard; includes gemini-home `.agents/skills/turnfile-protocol-gemini/**`
- `GEMINI.md` — Project root instruction file (Antigravity auto-loads as a rule; `@import` is INERT — discovery via `.agents/skills/`)
- `evals/` — PRD eval suites (`prd-031-phase1.evals.mjs` 14/14, `prd-031-phase2.evals.mjs` 11/11, `prd-038.evals.mjs` 8/8, `prd-041.evals.mjs` 9/9, `prd-042.evals.mjs` 16/16, `onboarding-execution.evals.mjs` 16/16; 74/74 total)
- `working-session/` — **Tracked active workspace** (removed from .gitignore in session 13). All session state lives here:
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact. Read first after boot file.
  - `working-session/WORKLOG.md` — Session log with status block (read lines 1-13 after Turnfile)
  - `working-session/WORKLOG_ARCHIVE.md` — Archived sessions
  - `working-session/MAILBOX.md` + `MAILBOX.json` + `MAILBOX_ARCHIVE.md`
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry
  - `working-session/NEXT_SESSION_HANDSHAKE.md` — Boot handshake contract (run after read order)
  - `working-session/boot-claude.md` — This file
  - `working-session/boot-codex.md` / `boot-gemini.md` — peer boot files
  - `working-session/chat-claude.md` — Claude's scratchpad + session close snapshots (read bottom)
  - `working-session/docs/` — In-progress PRDs and PRD_STATUS.json

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Claude unread=0 before turn is done.
- **Whenever you have an unread mailbox item, continue until it is read and acknowledged.** (Maintainer standing directive.)
- **Files-First, not memory:** Read the project's live files before trusting memory/context. This boot file drifts too — verify every fact against the repo before acting.
- **Message lifecycle (PRD-003):** `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries.
- **Payload-first (PRD-008):** Review requests include inline content + revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Decision authority (OQ-052):** All changes Maintainer-gated by default; selective unlocks only by explicit Maintainer direction.
- **Conflict loop bound (PRD-021):** `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); unbounded terminates on `NO-NEW-OBJECTION` or a Maintainer circuit-breaker; on bound exhaustion escalate directly to Level 4 Maintainer adjudication (skip Level 3). Selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- **Turnfile (PRD-013):** YAML coordination artifact. Revision-based leases (no wall-clock). Section ownership (R2.1).
- **Locking (PRD-010 + PRD-013):** `locks` section; lease expiry `(coordination.revision - acquired_rev) > lease_revs` (default 2).
- **Ownership guard (PRD-033, LIVE):** `core.hooksPath=tools/hooks`; identity from `.turnfile-agent` (currently `codex` in this clone) or `TURNFILE_AGENT`. Edit only your own files. Claude commits export `TURNFILE_AGENT=claude`; whole-tree/cross-ownership commits use `TURNFILE_AGENT=maintainer` under Maintainer direction. `OWNERSHIP.yaml`: claude/codex/gemini owned sets + maintainer_owned; unmatched paths COLLABORATIVE.
- **Orientation tool (PRD-032, LIVE):** `node tools/session-orient.mjs --agent claude --emit human` (add `--validate`).
- **Boot fast path (PRD-017 A1 = PRD-037 R2 + R4):** A clean `session-orient --emit json` IS the boot read when no findings require targeted reads. On findings (unread work, stale projection, validator failure, missing artifacts, dirty peer-owned paths), fall back to targeted file reads.
- **Canonical boot write (PRD-037 R1):** `tools/handshake-sign.mjs` atomically writes TURNFILE agent block + rev + SIG entry, sign-off row, WORKLOG status line.
- **Default heartbeat (PRD-037 R3 + PRD-038):** 5-minute self-owned read-only steward per agent, NOTIFY-on-material-only, stop=delete at clean close. **READ-ONLY STRICTLY ENFORCED per PRD-038 R2 deny-list:** no file edits, no MAILBOX.json regen, no status changes, no signal creation, no revision bumps.
- **Tokenese (PRD-027 + charter incl. Tier-B Amendment A1):** every clone paired to a legible source; source wins; `^N`/`ev:` untrusted (calibration result); governance English-only; R7 cross-repo boundary (never edit Tokenese semantics from Turnfile). All three agents passed PRD-027 production-competence.
- **Active-card owner review at close (PRD-014):** session closeout MUST review every active mailbox card where Closure owner equals the closing agent. `validate-closeout --agent <self>` enforces this.
- **Chat-file semantics (PRD-017 R7):** create only your own `chat-claude.md`; a missing peer chat file is warning only. Boot never authors a peer chat file from the Claude lane.
- **Out-of-band drift check (PRD-023 R6):** at boot, before relying on any prior-session state, run reconciliation against TURNFILE.yaml + MAILBOX.md + PRD_STATUS.json + WORKLOG.md to detect out-of-band activity (peer edits between sessions, manual Maintainer changes). Note any drift in chat-claude.md with date/actor/changed-artifacts/governance-state/follow-up-owner. If governance state changed or a decision-required item surfaced, escalate to Maintainer before substantive writes.

## Resumption read order (PRD-011 R3 + PRD-017 A1)

Cross-agent contract: `docs/BOOT_SEQUENCE.md` (PRD-017). This file is Claude-specific orientation.

**Fast path (PRD-017 A1):** `node tools/session-orient.mjs --agent claude --emit human` (or `--emit json` for tool consumption). If clean = boot read done; only read targeted files when orient surfaces a finding.

**Full read order if orient surfaces findings, or for cold start:**
1. **This file** (`working-session/boot-claude.md`)
2. `working-session/TURNFILE.yaml` — coordination state (read fresh; Files-First)
3. `working-session/WORKLOG.md` lines 1-13 (status block)
4. `working-session/MAILBOX.md` inbox snapshot — check unread
5. `working-session/docs/PRD_STATUS.json` — authoritative PRD state
6. `working-session/OPEN_QUESTIONS.md` Active + Deferred
7. `working-session/chat-claude.md` close snapshot (bottom)

Run `NEXT_SESSION_HANDSHAKE.md` and converge/sign with peers before substantive writes.

## Current state — ALWAYS query at boot, NEVER read from this file

Boot files are point-in-time and drift between sessions. Specific PRD acceptance / impl-state / blocker claims do not belong in this file. Use these lookups instead — they read live state from `working-session/`:

```
node tools/session-orient.mjs --agent claude --emit human   # coordination, mailbox, projection freshness, recommended commands
node tools/prd-status-summary.mjs                            # PRD landscape: by-shelf, by-impl-state, maintainer acceptance, blockers
node tools/prd-status-summary.mjs --filter open              # PRDs with blockers
node tools/prd-status-summary.mjs --filter draft             # working-session/docs shelf entries
node tools/prd-status-summary.mjs --filter unratified        # acceptance.maintainer != accepted
node tools/prd-status-summary.mjs --id PRD-NNN               # full record for one PRD
node tools/prd-status-summary.mjs --gates v1                 # v1.0.0 R9 release-gate readiness snapshot
node tools/validate-v1-release.mjs --format json             # release gate aggregate
```

Carry-forward from prior session — read the TAIL of `working-session/WORKLOG.md` (the most recent "SESSION N CLOSED" or "SESSION N PRD-X" entries name carry-forward, blocked-on, and next-actions). Do NOT trust this file's text for those facts.

Agent live state — read fresh:
- `TURNFILE.yaml` `agents.<id>.{status, current_task, last_seen, session_id}` is the source of truth for whether an agent is active, idle, offline, or blocked.
- Peer chat files (`chat-codex.md`, `chat-gemini.md`) are agent-owned and may lag.

Peer-owned paths — never edited from Claude lane without explicit Maintainer authorization (OQ-069):
- `boot-codex.md`, `chat-codex.md`, `skills/codex/**`, `skills/codex_5.3/**`, `working-session/agents/codex/**`
- `boot-gemini.md`, `chat-gemini.md`, `.agents/skills/turnfile-protocol-gemini/**`, `working-session/agents/gemini/**`, `skills/gemini-3/**`, `GEMINI.md`

### FIRST ACTIONS ON RESUME

1. **Use the fast path.** `node tools/session-orient.mjs --agent claude --emit human`. If clean, boot is done.
2. **Use `tools/handshake-sign.mjs`** for the boot write (direct flag mode per PRD-044). Or `node tools/turnfile.mjs open` (wrap). Run `NEXT_SESSION_HANDSHAKE.md` and converge with peers.
3. **Query carry-forward** — read the WORKLOG.md tail to learn what the prior session left open.
4. **Query PRD state** — run `node tools/prd-status-summary.mjs --filter open` to see what has blockers and `--gates v1` to see release-gate readiness.
5. **Check peer state** — `TURNFILE.yaml` `agents.*` block reveals whether peers are active/idle/offline.
6. **Set up heartbeat** — PRD-038 5m self-owned read-only steward. The runtime's own scheduler (Claude Code mcp__scheduled-tasks, Codex automations, Antigravity native) handles cadence; the script writes a HEARTBEAT.md sentinel via `node tools/turnfile.mjs heartbeat write --agent claude --session N` once that flag is needed.

### Operating norms

- **Files First**, not memory; verify every fact against the repo.
- **Concurrent Write Discipline:** derive via `tools/next-state.mjs` in-lock; expect 2-3 live peers; the Read tool's edit guard catches stale edits — re-ground, take the next rev.
- **Use `handshake-sign` for boot writes** — atomic where possible, defensive otherwise.
- **Default-route to peers:** PRD_STATUS edits, PRD body amendments, model ledger, tool code → Codex. Governance text, review verdicts, eval authoring as proposer, synthesis, judgment → Claude. Tokenese lane + large-context research → Gemini.
- **Active-card owner review at close** is now mandatory (PRD-014 amendment); use `validate-closeout --agent <self>`.
- Eight-step A1 loop (PRD-006); Model-Ledger Handshake at boot.

### Mailbox & coordination — query at boot

- `node tools/session-orient.mjs --agent claude --emit human` reports inbox unread + Open Queue + projection freshness.
- `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent claude --format json` reports clean / blocking.
- `node tools/prd-status-summary.mjs --gates v1` reports v1.0.0 release-gate readiness.
- Mailbox compaction is automatic per PRD-014/PRD-011 R5; the Closed Summary line count grows session-to-session and is not a meaningful state indicator.

## Session close protocol

1. **Check mailbox** — Claude unread=0.
2. Run **active-card owner review** (PRD-014 amendment): every Claude-owned active card must be closed, deferred (with reason + next owner), or escalated.
3. Update WORKLOG status block.
4. Update TURNFILE.yaml (agent idle, tasks done/carry-forward, clean locks/turn_queue, SIG yield).
5. **Regenerate `MAILBOX.json`:** `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`
6. **Run gates:** `validate-mailbox-invariants`, `turnfile-lint`, `validate-closeout --agent claude`, `validate-prd-promotion`.
7. Write session snapshot to bottom of `working-session/chat-claude.md`.
8. Archive boot file to `docs/archive/boot-claude/boot-claude_v<N>.md` (globally monotonic).
9. Write new boot file with updated state.
10. **Delete heartbeat scheduled task** (PRD-030 R5 stop-condition) if stop satisfied.
11. WORKLOG compaction check — compact if >500 lines (PRD-011 R5).
12. Promote artifacts only when Maintainer-directed + promotion gate passes.
13. Commit/push only when Maintainer directs.
14. **Final mailbox check** — Claude unread=0.

## Key lessons learned

- `working-session/` is tracked in git (since session 13). Completed work copied to `docs/`.
- TURNFILE.yaml is the first coordination read after orient. Read it fresh — peers edit concurrently.
- **Concurrent-edit discipline:** read → edit → validate → signal. Re-read immediately before editing; the guard blocks stale edits. Don't fight the revision number; re-ground and take the next one.
- Locking is revision-based (PRD-013 R1.3), not time-based.
- Codex can't see your filesystem for cross-agent review — use payload-first inline content.
- Promotion is conditional on Maintainer direction + promotion gate (PRD_STATUS + validate-prd-promotion). Never auto-promote.
- The project name is "Turnfile" — reference as "Turnfile protocol (a SNAP protocol)".
- Session numbers are global-monotonic across branches.
- Request a new session proactively near context limits (PRD-016).
- **Don't over-function.** Default-route to the peer whose lane matches; reserve yourself for review/judgment/synthesis.
- PRD-027 is already accepted — no additional Maintainer approval needed to execute. All R2 gates are clear; just need session charter opt-in + teach phase.
