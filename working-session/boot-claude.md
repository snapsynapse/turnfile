# Boot File — Claude (v22)

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

## Current state (as of session-28 close, 2026-06-23)

THREE EQUAL agents: Claude (Opus 4.6), Codex (Codex 5.5 — handshake self-reports "GPT-5"; Maintainer-canonical label is **Codex 5.5**), Gemini (Antigravity / Gemini 3.5 Flash High). Session 28 close: Claude idle rev 397 / Codex idle rev 394 / Gemini **incomplete close** (booted+delivered + went quiet without close protocol — see observer note in WORKLOG; TURNFILE.yaml still shows gemini.status=active and boot-gemini.md is stale at v11). Read TURNFILE fresh — peers run LIVE concurrently.

**PRD-031 Phase 3 DONE.** Complete A1 loop session 28: Claude proposed OQ#1/#2/#3/#4 resolutions (MSG-010) → Codex APPLY + counter C1 on OQ#3 (maintainer participant-events fixture-only/non-authoritative until OWNERSHIP shard-path declared by future PRD) → Claude authored 12 RED evals → Codex implemented 2 schemas (`schemas/prd-031/task-event-v0.schema.json` + `task-aggregate-v0.schema.json`), `tools/validate-task-aggregate.mjs`, `tools/compare-turnfile-tasks.mjs`, reducer extensions (4 conflict kinds: completion-authority-violation, reserved-field-overwrite, duplicate-signal-id, participant_events with authoritative=false), and 10 fixtures → Claude step-7 APPROVE. 105/105 carry-forward eval suite green across 10 PRDs. Phase 3 read-only boundary preserved.

**PRD-042 PROMOTED** to `docs/prds/`. PRD-018/019/039 done-flipped this session (upstream lanes already delivered the contracts). Model ledger updated: canonical Codex label = Codex 5.5.

**PRD-027 execution READY but UNSTARTED.** All R2 sequencing gates clear (PRD-024/028/029 done). Needs: Maintainer charter opt-in + teach phase (R2.8) to execute. Tokenese repo Phase A may be in progress by Codex.

### FIRST ACTIONS ON RESUME (session 29)

1. **Use the fast path.** `node tools/session-orient.mjs --agent claude --emit human`. If clean, boot is done.
2. **Use `tools/handshake-sign.mjs`** for the boot write. Run `NEXT_SESSION_HANDSHAKE.md` and converge with peers.
3. **Check Gemini state.** Gemini did NOT run close protocol session 28. TURNFILE shows gemini.status=active but Gemini runtime is gone. Expect Gemini to self-reconcile via close-then-fresh-boot, OR be cold; do not write into Gemini-owned paths (boot-gemini.md, chat-gemini.md, .agents/skills/turnfile-protocol-gemini/**, working-session/agents/gemini/**, skills/gemini-3/**, GEMINI.md).
4. **No open Claude-owned cards** carried forward from session 28.
5. **Priority lanes (with Maintainer scope direction):**
   - **PRD-027 execution** — all gates clear; propose session charter opt-in + teach phase to start the A/B pilot
   - **PRD-035 Tokenese sync** — Gemini lane (RED eval authoring still owed; awaits next Gemini session)
   - **PRD-031 OWNERSHIP shard-path** — future PRD if/when registry shards become live-authoritative (per session-28 C1)

### Recent milestones (session 28)

- **PRD-031 Phase 3 complete end-to-end** via Claude/Codex A1 loop. 12/12 Phase 3 + 105/105 full carry-forward green.
- **Maintainer-directed lowest-PRD-up batch:** PRD-018/019/039 done-flips + PRD-042 promotion to docs/prds.
- **PRD-017 R7 + PRD-023 R6 boot-claude.md drift** fixed (Codex-surfaced + Gemini-flagged respectively); both suites 5/5 green.
- **Model ledger:** Codex canonical label = "Codex 5.5" (extended sessions 14-28).
- **Gemini partial-session delivery:** Gemini refreshed public-surface counts (README/docs/index.html/llms.txt/assistant-guide + manifests to 39 promoted / 41 registry-tracked PRDs) before going quiet without close protocol. Public-surface work bundled into Maintainer-directed rollup commit.

### PRD landscape (authoritative: `working-session/docs/PRD_STATUS.json`)

- 41 PRDs tracked, 36 promoted (PRD-042 newest). PRD-031 implementation state `done` (Phase 3).
- Required reviewers `{codex, claude, maintainer, gemini}`.
- 105/105 eval tests green across 10 PRD suites at Claude session-28 close.
- Genuinely-open: PRD-027 execution (awaits Maintainer charter opt-in); PRD-035 (Gemini lane unstarted); future PRD for PRD-031 OWNERSHIP shard-path if live-authority migration ever needed.

### Operating norms (skill v0.9.1 + PRD-037 + PRD-038)

- **Files First**, not memory; verify every fact against the repo.
- **Concurrent Write Discipline:** derive via `tools/next-state.mjs` in-lock; expect 2-3 live peers; the Read tool's edit guard catches stale edits — re-ground, take the next rev.
- **Use `handshake-sign` for boot writes** — atomic where possible, defensive otherwise.
- **Default-route to peers:** PRD_STATUS edits, PRD body amendments, model ledger, tool code → Codex. Governance text, review verdicts, eval authoring as proposer, synthesis, judgment → Claude. Tokenese lane + large-context research → Gemini.
- **Active-card owner review at close** is now mandatory (PRD-014 amendment); use `validate-closeout --agent <self>`.
- Eight-step A1 loop (PRD-006); Model-Ledger Handshake at boot.

### Mailbox & coordination

- At Claude close session 27 (rev 384): all inboxes 0; no locks; turn_queue empty; ZERO Claude-owned active cards. `validate-closeout --agent claude` clean.
- Mailbox compact (session-23 compaction holds; Closed Summary at 46 rows).

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
