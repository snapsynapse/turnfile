# Boot File — Claude (v14)

Read this first on session start. It tells you what this project is, where things are, what state we're in, and what to do next.

## What is Turnfile?

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents. Three agents (Claude/Anthropic, Codex/OpenAI GPT-5, and Gemini/Google — Gemini onboarding in progress, runtime now Google Antigravity) collaborate through shared markdown files with a human maintainer (Sam Rogers / Snap Synapse LLC) as arbiter. Repo: `github.com/snapsynapse/turnfile`.

## Directory layout

- `docs/` — Canonical tracked protocol documents (PROTOCOL_CORE, COMMUNICATIONS_PROTOCOL, HUMAN_GOVERNANCE, etc.)
- `docs/prds/` — Promoted finalized PRDs (001, 003-014, 016-036 promoted as of session 19; see PRD_STATUS for the authoritative list)
- `docs/archive/` — Versioned archives (boot files, vision)
- `templates/` — Canonical templates (including `templates/working-session/` for cold-start bootstrap)
- `examples/` — Historical reference: `ai-feature-tracker/` (first project) and `inception/` (11-session pilot archive)
- `tools/` — Project tooling (export-mailbox-json, new-payload-envelope, turnfile-lint, validate-mailbox-invariants, validate-prd-promotion, validate-skills-preflight, next-state, session-orient, validate-closeout, validate-ownership-guard, validate-boot-sequence, validate-out-of-band-reconciliation, validate-review-cycle-closure, aggregate-coordination)
- `skills/` — Per-agent protocol skill files and shared metaskills:
  - `skills/claude/SKILL.md` — Claude's protocol execution guide (v0.9.1 / bundle v13)
  - `skills/codex/SKILL.md` — Codex's protocol execution guide (v9)
  - `skills/gemini-3/SKILL.md` — Gemini's guide (v0.1.0, STALE + Gemini-CLI-era; must be ported to `.agents/skills/` for Antigravity — see session-19 findings)
  - `skills/skill-versioning/` — Shared metaskill (skill-provenance, v18)
  - `skills/STRUCTURE.md` — Skill layout and ownership rules
- `schemas/` — JSON schemas for protocol artifacts (`turnfile/turnfile-v0.schema.json`)
- `OWNERSHIP.yaml` — Maintainer-owned skill ownership map driving the PRD-033 guard
- `GEMINI.md` — Project root instruction file (Gemini-CLI-era; auto-loads on Antigravity as a rule but its `@import` is INERT there)
- `working-session/` — **Tracked active workspace** (removed from .gitignore in session 13). All session state lives here:
  - `working-session/TURNFILE.yaml` — Runtime coordination artifact. Read first after boot file.
  - `working-session/WORKLOG.md` — Session log with status block (read lines 1-13 after Turnfile)
  - `working-session/WORKLOG_ARCHIVE.md` — Archived sessions
  - `working-session/MAILBOX.md` + `MAILBOX.json` + `MAILBOX_ARCHIVE.md`
  - `working-session/OPEN_QUESTIONS.md` — Cross-PRD question registry (no active OQs at session-19 close)
  - `working-session/NEXT_SESSION_HANDSHAKE.md` — Boot handshake contract (run after read order)
  - `working-session/boot-claude.md` — This file
  - `working-session/boot-codex.md` / `boot-gemini.md` — peer boot files
  - `working-session/chat-claude.md` — Claude's scratchpad + session close snapshots (read bottom)
  - `working-session/docs/` — In-progress PRDs and PRD_STATUS.json
  - `working-session/docs/gemini-onboarding/` + `working-session/docs/onboarding/` — Gemini onboarding artifacts + evidence

## Protocol essentials

- **Mailbox check first and last:** Check mailbox at start and end of every turn. Ensure Claude unread=0 before turn is done.
- **Whenever you have an unread mailbox item, continue until it is read and acknowledged.** (Maintainer standing directive.)
- **Message lifecycle (PRD-003):** `unread -> acknowledged -> blocked -> actioned -> closed`. Only receiver can ack/block/action. Only sender/maintainer can close.
- **SLA tiers:** P0 (next session turn), P1 (next session), P2 (best effort). Measured in session boundaries.
- **Payload-first (PRD-008):** Review requests include inline content + revision tokens (`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`). No path-only references.
- **Decision authority (OQ-052):** All changes Maintainer-gated by default; selective unlocks only by explicit Maintainer direction.
- **Conflict loop bound (PRD-021):** `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); unbounded terminates on `NO-NEW-OBJECTION` or a Maintainer circuit-breaker; on bound exhaustion escalate directly to Level 4 Maintainer adjudication (skip Level 3). Selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- **Turnfile (PRD-013):** YAML coordination artifact. Revision-based leases (no wall-clock). Section ownership (R2.1).
- **Locking (PRD-010 + PRD-013):** `locks` section; lease expiry `(coordination.revision - acquired_rev) > lease_revs` (default 2).
- **Ownership guard (PRD-033, LIVE):** `core.hooksPath=tools/hooks`; identity from `.turnfile-agent` (currently `codex` in this clone) or `TURNFILE_AGENT`. Edit only your own files. Claude commits export `TURNFILE_AGENT=claude`; whole-tree/cross-ownership commits use `TURNFILE_AGENT=maintainer` under Maintainer direction. `OWNERSHIP.yaml`: claude/codex/gemini owned sets + maintainer_owned; unmatched paths COLLABORATIVE.
- **Orientation tool (PRD-032, LIVE):** `node tools/session-orient.mjs --agent claude --emit human` (add `--validate`).
- **Tokenese (PRD-027 + charter incl. Tier-B Amendment A1):** every clone paired to a legible source; source wins; `^N`/`ev:` untrusted (calibration result); governance English-only; R7 cross-repo boundary (never edit Tokenese semantics from Turnfile).

## Resumption read order (PRD-011 R3)

Cross-agent contract: `docs/BOOT_SEQUENCE.md` (PRD-017). This file is Claude-specific orientation.

1. **This file** (`working-session/boot-claude.md`)
2. `working-session/TURNFILE.yaml` — coordination state (read fresh; Files-First)
3. `working-session/WORKLOG.md` lines 1-13 (status block)
4. `working-session/MAILBOX.md` inbox snapshot — check unread
5. `working-session/docs/PRD_STATUS.json` — authoritative PRD state
6. `working-session/OPEN_QUESTIONS.md` Active + Deferred
7. `working-session/chat-claude.md` close snapshot (bottom)
8. Then task-relevant files

Run `NEXT_SESSION_HANDSHAKE.md` (session-20 addendum) and converge/sign with Codex before substantive writes. **Out-of-band drift check (PRD-023):** reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG before trusting remembered state; unrecorded changes that altered **governance state** are **decision-required** (record/escalate before acting), while non-governance drift is a warning. **Chat-file semantics (PRD-017 R7):** create only your OWN `chat-claude.md` if absent; a missing peer chat file (`chat-codex.md` / `chat-gemini.md`) is a **warning only** — boot never creates a peer chat file.

## Current state (as of session-20 close, 2026-06-17)

THREE agents now: Claude (Opus 4.8), Codex (5.5), Gemini (Google Antigravity / Gemini 3.5 Flash (High)) — Gemini ONBOARDED provisional-active this session (PRD-015). All three idle/closed at session-20 end. TURNFILE at rev ~256 at close; read it fresh. **Files-First is a STANDING correction from Sam: read the project's live files before trusting memory/context** (see memory `read-project-before-memory`; this boot file drifts too — verify against the repo). **Codex AND Gemini run LIVE concurrently in the same tree** — session 20 ran rev 219→256 with constant 2-3-agent concurrent edits; the Read-before-edit guard caught every collision. Re-ground every turn, don't fight the rev number, and expect peers to open/close simultaneously (that's normal, not a problem). Session 20 committed whole-tree as `TURNFILE_AGENT=maintainer` (`8bbf081`) and PUSHED to origin/main.

### FIRST ACTIONS ON RESUME (session 21)

1. Boot via `docs/BOOT_SEQUENCE.md` (now registers 3 agents incl gemini); run `NEXT_SESSION_HANDSHAKE.md` (session-21 addendum) and converge with peers before any write. Gemini has a sign-off row now.
2. Report guard/commit posture FIRST: guard LIVE (`core.hooksPath=tools/hooks`, identity from `.turnfile-agent`). `node tools/validate-ownership-guard.mjs`; `node tools/session-orient.mjs --agent claude --emit human`. CI was GREEN at session-20 close: `npm run -s validate` + `npm run -s evals:prd` exit 0 (prd-035 logged expected-pending; bundle gate `--repo-skill-bundle`).
3. Carry-forward lanes (confirm with Maintainer):
   - **Peer-convergence PRD (highest-value next).** Draft a short PRD expanding PRD-018 selective-unlock: implement/review PAIRS converge routine technical decisions between themselves (apply-or-counter, eval sign-off, lifecycle) WITHOUT routing through Claude or Maintainer; escalate to Claude for judgment, Maintainer for ownership/governance only. Codex + Gemini ACCEPTED the role-specialization proposal (MSG-20260617-047/048). Adopted split: Claude = reviewer/verifier/synthesizer/orchestrator (off routine implementation + bookkeeping); Codex + Gemini = fast implementers who own routine coordination mechanics + peer-review each other.
   - **PRD-035 (Tokenese sync)** — accepted+promoted, NOT implemented (only expected-pending eval suite). Gateway for the Maintainer's machine-speed-Tokenese roadmap (targets 2026-06-18/19).
   - **Gemini Tokenese on-ramp:** Gemini must pass a PRD-027 teach phase + production-competence gate BEFORE any Tier-B twin (as Codex did E1-E8). Non-negotiable.
   - **Bounded Tier-B Tokenese twins** (AUTHORIZED, charter A1): English source-wins, governance English-only.
   - **PRD-031 Phase 2/3** (per-agent shard logs + regenerated aggregates) — directly targets the re-grounding tax that slows Claude with 2-3 live agents.
4. Deferred (execute-or-defer, PRD-014 R4): **mailbox compaction** (large — 50+ actioned cards archivable to Closed Summary). Minor: gemini bundle SKILL header says 0.2.0 vs CHANGELOG v0.2.1 (gemini-owned cosmetic). Pre-existing 5 cosmetic Closed-Summary `Mode`-field warnings.

### Recent milestones (session 20)

- **Gemini/Antigravity ONBOARDED provisional-active (PRD-015):** bundle ported to `.agents/skills/turnfile-protocol-gemini/` (Antigravity Path B); OT-001/007/008/002/004 all PASSED; F1-F5 resolved; Claude verified + Codex cross-review APPROVE; OWNERSHIP gemini-home added (maintainer). Gemini drove its own OT-007 port + behavioral OTs; Claude guided + verified.
- **PRD-034 IMPLEMENTED + APPROVE:** `tools/validate-public-surface-snapshot.mjs` + surfaces reconciled to registry truth (32 promoted / 35 tracked / 3-agent roster / freshness markers): README, docs/index.html, docs/llms.txt, assistant-guide(+.well-known byte-identical).
- **PRD-036 IMPLEMENTED + APPROVE:** `tools/run-prd-evals.mjs` portable aggregate runner; `evals:prd` repointed off the Node-v26-broken `node --test evals/`; PRD_STATUS-driven expected-pending gate-scope (unbuilt-PRD suites log loudly but don't fail the gate).
- **Handshake extended to 3 agents:** `validate-boot-sequence` N-agent peer logic + generic `--repo-skill-bundle` validation gate (both eval-first, Codex implemented against Claude RED evals); BOOT_SEQUENCE registered-agents note; Gemini sign-off row.
- **Role-specialization proposal** (MSG-047/048) ACCEPTED by Codex + Gemini — peer-convergence to reduce Claude + Maintainer bottlenecks. Committed `8bbf081` + pushed; all three agents closed.

### PRD landscape (authoritative: `working-session/docs/PRD_STATUS.json`)

- Implemented + done this session: **PRD-034, PRD-036** (both Codex-APPROVE, filed done).
- Accepted+promoted but NOT implemented: **PRD-035** (Tokenese sync; only expected-pending eval suite — runs, logged, excluded from the CI gate).
- Handshake-extension tooling (validate-boot-sequence N-agent, `--repo-skill-bundle`) landed via eval-first A1.
- Future eval-first lanes: peer-convergence PRD; PRD-035 implementation; PRD-031 Phase 2/3.

### Operating norms (skill v0.9.1)

- Files First, Not Memory; Concurrent Write Discipline (derive via `tools/next-state.mjs` in-lock; Codex live → re-ground almost every turn; only the Read tool satisfies the edit guard). Eight-step A1 loop (PRD-006); Model-Ledger Handshake at boot.
- Prefer `tools/session-orient.mjs`. Ownership guard executable; commit identity matters.

### Mailbox & coordination

- At Claude close: Claude idle, unread 0/0/0, no locks. Codex closed at rev 228 (boot v9). MSG-036 closed (Gemini cross-review); MSG-037 actioned (PRD promotion ACK, Codex closure owner).
- Mailbox at ~50 active cards — compaction deferred (next session, optional).

## Session close protocol

1. **Check mailbox** — Claude unread=0.
2. Update WORKLOG status block.
3. Close any open mailbox messages you own (or defer compaction explicitly).
4. Update TURNFILE.yaml (agent idle, tasks done/carry-forward, clean locks/turn_queue).
5. **Regenerate `MAILBOX.json`:** `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`
6. **Run gates:** `validate-mailbox-invariants`, `turnfile-lint`, `validate-closeout`.
7. Write session snapshot to bottom of `working-session/chat-claude.md`.
8. Archive boot file to `docs/archive/boot-claude/boot-claude_v<N>.md` (globally monotonic).
9. Write new boot file with updated state.
10. WORKLOG compaction check — compact if >500 lines (PRD-011 R5).
11. Promote artifacts only when Maintainer-directed + promotion gate passes.
12. Commit/push only when Maintainer directs.
13. **Final mailbox check** — Claude unread=0.

## Key lessons learned

- `working-session/` is tracked in git (since session 13). Completed work copied to `docs/`.
- TURNFILE.yaml is the first coordination read after the boot file. Read it fresh — Codex edits concurrently.
- **Concurrent-edit discipline:** read → edit → validate → signal. Re-read immediately before editing; the guard blocks stale edits. Session 19 had several mid-write collisions on MAILBOX/TURNFILE while Codex was live — each re-grounded cleanly. Don't fight the revision number; re-ground and take the next one.
- Locking is revision-based (PRD-013 R1.3), not time-based.
- Codex can't see your filesystem for cross-agent review — use payload-first inline content.
- **Antigravity (Gemini runtime) loads skills from `.agents/skills/`, not via `GEMINI.md` @import.** New skills need a workspace reload to be indexed.
- Promotion is conditional on Maintainer direction + promotion gate (PRD_STATUS + validate-prd-promotion). Never auto-promote.
- The project name is "Turnfile" — reference as "Turnfile protocol (a SNAP protocol)".
- Session numbers are global-monotonic across branches.
- Request a new session proactively near context limits (PRD-016).
