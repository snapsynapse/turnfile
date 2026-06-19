# Boot File — Claude (v17)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. THREE agents (Claude/Anthropic, Codex/OpenAI GPT-5, Gemini/Google Antigravity 3.5 Flash) collaborate as **equal peers** through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Gemini transitioned from provisional-active to FULL-ACTIVE in session 21 (2026-06-18). Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (PRD-001, 003-017, 021-038 promoted as of session 21; see PRD_STATUS for the authoritative list — 35 promoted of 37 tracked)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (export-mailbox-json, new-payload-envelope, turnfile-lint, validate-mailbox-invariants, validate-prd-promotion, validate-skills-preflight, next-state, session-orient, validate-closeout (now agent-scoped per PRD-014 active-card-owner-review), validate-ownership-guard, validate-boot-sequence, validate-out-of-band-reconciliation, validate-review-cycle-closure, aggregate-coordination, validate-public-surface-snapshot, run-prd-evals, **handshake-sign** [NEW session 21])
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/claude/SKILL.md` — Claude's protocol execution guide (v0.9.1 / bundle v13 at session 21 close; needs PRD-014 closeout-owner-review mirror at next update)
  - `skills/codex/SKILL.md` — Codex's protocol execution guide (v11 after session 21 PRD-014 active-card-owner-review patch)
  - `.agents/skills/turnfile-protocol-gemini/SKILL.md` — Gemini's Antigravity skill bundle (v0.2.0/0.2.1 — minor version drift to fix in session 22)
  - `skills/skill-versioning/` — Shared metaskill (skill-provenance)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`); agent-agnostic
- `OWNERSHIP.yaml` — Maintainer-owned skill ownership map driving the PRD-033 guard; includes gemini-home `.agents/skills/turnfile-protocol-gemini/**`
- `GEMINI.md` — Project root instruction file (Antigravity auto-loads as a rule; `@import` is INERT — discovery via `.agents/skills/`)
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
- **Boot fast path (PRD-017 A1 = PRD-037 R2 + R4, NEW session 21):** A clean `session-orient --emit json` IS the boot read when no findings require targeted reads. On findings (unread work, stale projection, validator failure, missing artifacts, dirty peer-owned paths), fall back to targeted file reads. Files-First preserved (orient is itself a fresh read). The signed handshake sign-off row IS the boot-baseline ack; substantive scope changes still require mailbox cards.
- **Canonical boot write (PRD-037 R1, NEW session 21):** `tools/handshake-sign.mjs` atomically writes TURNFILE agent block + rev + SIG entry, sign-off row, WORKLOG status line; hash collision guard + PARTIAL WRITE detection; emits Tokenese-leading dense block + English source-wins row. One tool call replaces the manual ~12 edits. Use is opt-in; manual boot remains valid. **Known limitation (PRD-037 OQ-D):** tool currently assumes the `s<N>-handshake-heartbeat` task already exists in coordination.tasks; first booting agent of a session must create it manually until handshake-sign v2 auto-creates.
- **Default heartbeat (PRD-037 R3 + PRD-038, NEW session 21):** 5-minute self-owned read-only steward per agent, NOTIFY-on-material-only, stop=delete at clean close. Each runtime owns its own; cadence does not bind peers. **READ-ONLY STRICTLY ENFORCED per PRD-038 R2 deny-list:** no file edits, no MAILBOX.json regen, no status changes, no signal creation, no revision bumps. Write-capable mode requires explicit elevation per PRD-038 R3.
- **Tokenese (PRD-027 + charter incl. Tier-B Amendment A1):** every clone paired to a legible source; source wins; `^N`/`ev:` untrusted (calibration result); governance English-only; R7 cross-repo boundary (never edit Tokenese semantics from Turnfile). All three agents passed PRD-027 production-competence (Codex 7/8 session 15; Claude as teacher; Gemini 7/8 session 21).
- **Active-card owner review at close (PRD-014 active-card-owner-review, NEW session 21):** session closeout MUST review every active mailbox card where Closure owner equals the closing agent. Owned `actioned` cards are NOT terminal by themselves — must close, defer (with reason + next owner), or escalate. `validate-closeout --agent <self>` enforces this.

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

Run `NEXT_SESSION_HANDSHAKE.md` (session-22 addendum) and converge/sign with peers before substantive writes. **Out-of-band drift check (PRD-023):** reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG before trusting remembered state; unrecorded changes that altered **governance state** are **decision-required** (record/escalate before acting), while non-governance drift is a warning. **Chat-file semantics (PRD-017 R7):** create only your OWN `chat-claude.md` if absent; a missing peer chat file (`chat-codex.md` / `chat-gemini.md`) is a **warning only** — boot never creates a peer chat file.

## Current state (as of session-23 close, 2026-06-18)

THREE EQUAL agents: Claude (Opus 4.8), Codex (GPT-5), Gemini (Antigravity / Gemini 3.5 Flash High). All three idle/closed at session-23 end. TURNFILE at rev 313 at close; read it fresh. Session 23 = heavy governance/design session: PRD-039 Perplexity onboarding advanced to live OBSERVER→PROVISIONAL CHECKER execution; PRD-040 (Gemini's first PRD) accepted; **PRD-041 (Unified Terminal Transport + Deterministic Projection) drafted + Maintainer-accepted**; new tool `tools/validate-onboarding-evidence.mjs` (Codex) + new eval `evals/onboarding-execution.evals.mjs` (Claude) landed; mailbox compacted 574→64 lines. Perplexity is at PROVISIONAL CHECKER (no shared-write, not a required reviewer).

### FIRST ACTIONS ON RESUME (session 24)

1. **Use the fast path.** `node tools/session-orient.mjs --agent claude --emit human`. If clean, boot is done.
2. **Use `tools/handshake-sign.mjs`** for the boot write (auto-creates `s<N>-handshake-heartbeat`; PRD-037 OQ-D closed). Run `NEXT_SESSION_HANDSHAKE.md` and converge with peers.
3. Carry-forward (mine / Claude lane):
   - **PRD-041**: author `evals/prd-041.evals.mjs` RED (I'm eval_author) AFTER Codex spikes the R4 event-sourced arbitration-primitive schema (sequence: Codex schema → Claude evals → Codex implements router/projector → review). Also: PRD-041 promotion to `docs/prds` is eligible (all four accepted) — a move-not-copy when Maintainer directs.
   - **PRD-040 step-7**: Gemini is eval_author for `evals/prd-040.evals.mjs`; when it routes the RED suite + Codex implements, I review.
4. Carry-forward (route to Codex): R4 arbitration-primitive schema spike (PRD-041); PRD-041 router/projector/event-schema implementation (extends `tools/aggregate-coordination.mjs`); PRD-037 `claude.acceptance.evidence` cleanup (MSG-20260617-067 lineage, if still open).
5. Carry-forward (route to Gemini): `evals/prd-040.evals.mjs` authoring (its first eval-first A1 loop as eval_author).
6. Carry-forward (housekeeping): formal move of the ~124 trimmed Closed Summary rows from the session-23 compaction into `MAILBOX_ARCHIVE.md` (tooling-assisted; currently preserved in git history only).

### Recent milestones (session 23)

- **PRD-041 Unified Terminal Transport + Deterministic Projection DRAFTED + Maintainer-accepted.** Reframe: structured event log = source; terminal view + repo markdown are both deterministic projections (resolves English-vs-Tokenese source tension; completes PRD-031). Role-targeted peer input folded: Gemini OQ#1 → bridge Antigravity (not gemini-CLI); Codex "feasible with scoping" → capability-graded adapters (R3), per-agent shards (R1), event-sourced arbitration primitive replacing turn_queue (R4). All four reviewers accepted.
- **PRD-040 (Gemini's first PRD) accepted.** Claude reviewed APPLY w/ C1-C4 (two read-only-integrity contradictions); Gemini applied all; Maintainer accepted. Heartbeat-loop-prompt contract — addresses thread-mode blindness.
- **Coached Gemini's first PRD routing** (MSG-015): caught the move-not-copy promotion error + stale header; Gemini self-corrected and folded the rule into skill v0.2.4. Oversight loop worked end-to-end.
- **Onboarding execution-layer evals**: Claude authored `evals/onboarding-execution.evals.mjs` (evidence-artifact structure + R5 rung gates, candidate-agnostic); Codex built `tools/validate-onboarding-evidence.mjs`; 14/14, Claude step-7 APPROVE.
- **PRD-039 Perplexity** advanced to live OBSERVER evidence + Codex OBSERVER→PROVISIONAL CHECKER recommendation; Claude cross-review APPLY w/ counters (OT-010/011 conditional, work-authorization gate before citation-bearing checker work).
- **Heartbeat proven**: Claude ran a live 5-min read-only steward cron all session; it surfaced two real inbound work items (MSG-011, MSG-014) within a tick each. Deleted at close.

### PRD landscape (authoritative: `working-session/docs/PRD_STATUS.json`)

- 40 PRDs tracked (PRD-039 session 22; PRD-040 + PRD-041 session 23). PRD-040 + PRD-041 accepted session 23 (PRD-041 eligible for promotion, still in working-session/docs). PRD-015/039 onboarding substrate live.
- Required reviewers `{codex, claude, maintainer, gemini}`. Perplexity NOT a required reviewer (PRD-039 R6 #3); at PROVISIONAL CHECKER rung, no shared-write.
- Open eval-first lanes:
  - PRD-041 (Claude eval_author): blocked on Codex R4 arbitration-primitive schema spike first.
  - PRD-040 (Gemini eval_author → Codex impl → Claude review).
  - PRD-035 Tokenese sync (Gemini lead).

### Operating norms (skill v0.9.1 + PRD-037 + PRD-038)

- **Files First**, not memory; verify every fact against the repo.
- **Concurrent Write Discipline:** derive via `tools/next-state.mjs` in-lock; expect 2-3 live peers; the Read tool's edit guard catches stale edits — re-ground, take the next rev.
- **Use `handshake-sign` for boot writes** — atomic where possible, defensive otherwise.
- **Default-route to peers:** PRD_STATUS edits, PRD body amendments, model ledger, tool code → Codex. Governance text, review verdicts, eval authoring as proposer, synthesis, judgment → Claude. Tokenese lane + large-context research → Gemini.
- **Active-card owner review at close** is now mandatory (PRD-014 amendment); use `validate-closeout --agent <self>`.
- Eight-step A1 loop (PRD-006); Model-Ledger Handshake at boot.

### Mailbox & coordination

- At Claude close session 21: Claude idle, unread 0/0/0 (excluding Codex's 1 informational + Gemini's 1 informational, no locks. MSG-20260617-066 explicitly deferred per PRD-014.
- Mailbox at ~50+ active cards — compaction deferred (large; consider as a session 22 lane).

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
- **Antigravity (Gemini runtime) loads skills from `.agents/skills/`, not via `GEMINI.md` @import.** New skills need a workspace reload to be indexed.
- Promotion is conditional on Maintainer direction + promotion gate (PRD_STATUS + validate-prd-promotion). Never auto-promote.
- The project name is "Turnfile" — reference as "Turnfile protocol (a SNAP protocol)".
- Session numbers are global-monotonic across branches.
- Request a new session proactively near context limits (PRD-016).
- **Don't over-function.** The 16-min boot was symptomatic. Default-route to the peer whose lane matches; reserve yourself for review/judgment/synthesis. Hoarding work is the same defect as over-reading.
