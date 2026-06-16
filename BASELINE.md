# Turnfile Baseline
Status: ratified baseline snapshot (Maintainer, session 14)
Date: 2026-06-12
Authority: this document is a point-in-time baseline of what Turnfile is and how the project works. `SPEC.md` remains normative for protocol requirements, `INTENT.md` for forward strategy, and `working-session/WORKLOG.md` for the running session record. If this document drifts from those, they win and this file needs a refresh.
## What Turnfile is
Turnfile is a file-based governance protocol for agent-assisted work where peer disagreement, maintainer authority, and auditability matter. It records who participated, what was claimed and locked, what positions and objections were raised, what the maintainer decided, and what evidence supports closeout. All of it lives in plain text files that survive vendor, runtime, and model changes.
Turnfile is not an agent runtime, orchestrator, workflow engine, or task queue. Execution belongs to platforms such as Claude Code, Codex, agent SDKs, and MCP/A2A hosts. Turnfile occupies the layer above: governance over orchestration, peer disagreement over supervisor assignment, maintainer resolution over autonomous consensus claims.
## Why this baseline exists
Session 14 (2026-06-12) reset the project to a clean state after a four-month gap:
1. The May 31 scope reset (`INTENT.md` v0.1.0, `SPEC.md` v0.1.0-reset) narrowed Turnfile from "multi-agent collaboration protocol" to "thin governance layer for auditable peer disagreement and maintainer-governed resolution."
2. The February-June coordination drift was reconciled honestly in the WORKLOG rather than retconned.
3. The full PRD backlog was triaged: every PRD now carries an explicit status, and the open-question registry reached zero active questions for the first time.
4. The Claude-side agent moved from Opus 4.6 to Fable 5 with zero protocol migration, demonstrating the core portability claim: the protocol outlived a model generation swap.
## How the project works
1. The Maintainer (Sam Rogers, PAICE.work PBC) holds decision authority. All changes are Maintainer-gated by default (OQ-052); selective unlocks follow the PRD-018 authority matrix and the PRD-021 gradient once accepted.
2. Two peer agents (Claude/Anthropic and Codex/OpenAI) collaborate through shared files: `working-session/TURNFILE.yaml` for coordination state, `MAILBOX.md` for messages and reviews, `WORKLOG.md` for the narrative record and decisions.
3. Reviews use apply-or-counter: a recipient accepts, accepts with amendments, counters, or blocks with a reason. Counter-recommendations are first-class artifacts, never silently collapsed.
4. Conflicts follow the `docs/CONFLICT_RESOLUTION.md` ladder; PRD-021 (in review) makes rebuttal depth configurable and bounds escalation.
5. Protocol contracts are PRDs. Drafts live in `working-session/docs/`; Maintainer-accepted contracts are promoted to `docs/prds/` after the PRD-006 A1 eight-step gate (propose → accept → proposer writes evals → counterpart implements → eval-green → review → file done). Terminal PRDs archive to `docs/archive/prds/`.
6. Validation gates run at session start and close: `turnfile-lint`, mailbox invariants, PRD promotion registry, skills preflight, tokenese pair sync (`validate-tokenese-pairs.mjs`).
7. Pre-write state derivation: `tools/next-state.mjs` emits the next message ID, signal ID, TURNFILE revision, per-agent snapshot, and content hashes — read-only, used inside lock windows to eliminate ID collision and stale-count drift.
## Canonical document set
| Document | Role |
|---|---|
| `SPEC.md` | Normative protocol contract (narrowed v0.1.0-reset) |
| `DEFINITIONS.md` | Controlled vocabulary |
| `INTENT.md` | Forward strategy; supersedes `VISION.md` for direction |
| `BASELINE.md` | This file: ratified project snapshot |
| `ROADMAP.md` | Non-normative planning notes |
| `SECURITY.md` | Trust boundaries and reporting |
| `docs/PROTOCOL_CORE.md` and `docs/*.md` | Invariant rules and protocol references |
| `docs/prds/` | Promoted, Maintainer-accepted contracts |
| `working-session/docs/` + `PRD_STATUS.json` | Draft shelf and the authoritative status registry |
| `VISION.md` | Historical and explanatory only |
## PRD shelf (as of session 14 close, 2026-06-13)
| PRD | Title | Status |
|---|---|---|
| 001 | Maintainer interaction model | Promoted |
| 002 | Rust notification viewer MVP | Deferred; archived to `docs/archive/prds/` |
| 003-014 | Core protocol contracts (lifecycle, decisions, schema, promotion, provenance, handoff, reconciliation, locking, resumption, skills, coordination format, closeout) | Promoted; PRD-006 carries A1 eight-step implementation loop |
| 015 | Agent onboarding + vetting | Deferred; archived to `docs/archive/prds/` |
| 016 | Session rotation trigger | Promoted |
| 017 | Boot sequence contract (includes folded PRD-020 as R7) | Promoted |
| 018 | Maintainer approval authority matrix | Promoted |
| 019 | Mailbox-first approval, event-based cadence | Promoted (no time-based polling) |
| 020 | Boot artifact completeness + chat logs | Superseded; archived to `docs/archive/prds/` |
| 021 | Conflict loop bound + selective-unlock gradient | Promoted |
| 022 | Decision-mirror delivery contract | Promoted |
| 023 | Out-of-band activity reconciliation | Promoted |
| 024 | Human-legibility invariant + encoding profiles | Promoted |
| 025 | — | Resolved by convergence; folded into PRD-014 A1 amendment path |
| 026 | Review-cycle closure + task-state consistency | Promoted |
| 027 | Tokenese cloned-communication A/B | Accepted; initiation approved |
| 028 | Tokenese dual-artifact sync + Maintainer legibility | Promoted; implementation done via eight-step loop |
| 029 | Pre-write state derivation contract | Promoted; implementation done via eight-step loop |
`working-session/docs/PRD_STATUS.json` is the source of truth for this table. PRDs 002/015/020 are terminal and the validator enforces the archived-only invariant for `docs/archive/prds/`.
## Standing decisions
1. All changes Maintainer-gated by default; selective unlock requires explicit recorded ratification (OQ-052, PRD-018).
2. Coordination is asynchronous and event-based. No time-based polling layer (OQ-054/055).
3. Boot is a documented command contract with optional helper scripts, not a mandatory script (OQ-051).
4. Chat logs carry fixed metadata fields (branch, revision, phase, session ID, date); session structure stays manual (OQ-056/057).
5. Peer review keeps the counter-recommendation model; no enumerate-only review lane (OQ-061).
6. Drift elimination is standing guidance: when a tool or document cannot record reality faithfully, fix the tool rather than misstate the record (Maintainer, session 14).
7. Eight-step loop (PRD-006 A1): propose → accept → proposer writes evals → counterpart implements → eval-green → review → file done. Acceptance ≠ done. Proposer never self-implements the PRD whose evals they authored.
8. Files-First operating norm (skill v0.5.0): read shared files before asserting or reasoning about state, not only before writing.
9. Concurrent-Write Discipline (skill v0.6.0): derive all written values (IDs, counts, pointers) from an in-lock fresh read; never from memory.
10. Model-Ledger Handshake: verify executing model is in `docs/llm/MODEL_LEDGER.md` at boot before relying on model-compatibility claims.
11. Tokenese sequencing gate: PRD-028 (done) -> PRD-029 (done) -> PRD-027 initiation approved -> teach phase -> A/B pilot.
12. Maintainer-decision relays (PRD-004 blockquote) default to `delivery-mirror` mode unless explicitly downgraded with rationale (OQ-065).
## Forward task register (as of session 14 close)
1. **Model-agnostic skill layout** — done: `skills/claude/` v0.6.0 (bundle 9), `skills/codex/` v7, both role-keyed; old paths deprecated in place. Remaining: `skills/gemini-3/` migrates when PRD-015 resumes.
2. **PRD-014 A1 review (Codex, MSG-044)** — Codex review pending for the closeout-amendment draft.
3. **PRD-003/004/008 A1 acceptances** — three amendments in draft; formal acceptance not yet submitted.
4. **Codex implementation lanes** — PRD-021/022/024 evals are red (16 tests); Codex implements. PRD-023/026: Codex writes evals, Claude implements.
5. **PRD-024 R5.1 dense-fragment validator** — Codex lane (Claude cannot take it; Claude authored those evals).
6. **Deferred compaction** — WORKLOG.md > 500 lines; compact sessions 13+14 narrative to WORKLOG_ARCHIVE.md at session 15 boot (single-agent, first action).
7. **Maintainer pre-PRD-027 checkpoint + push/PR discussion** — completed/superseded for initiation by Maintainer approval on 2026-06-15; push/PR timing remains a separate Maintainer queue item.
8. **PRD-027 (tokenese A/B)** — accepted and initiated. Gating stack now: session-charter opt-in -> Claude teach phase -> Codex production-competence check -> measured A/B pilot. Tokenese workspace: `~/Git/tokenese/HANDOFF.md`.
9. **Root `AGENTS.md` and `CLAUDE.md` bootstrap files** — so any cold-start agent lands on the boot sequence without manual orientation (`GEMINI.md` already exists).
10. **Minimal starter workflow** (ROADMAP item 2): copy one folder, read one guide. Two starters: two-agents-plus-maintainer, single-agent-plus-independent-review.
11. **Platform integration notes** (ROADMAP item 4), starting with Claude Code and Codex as execution substrates.
## Changelog
- 2026-06-12 v1.0 - Initial baseline ratified in session 14 after backlog triage and scope-reset reconciliation.
- 2026-06-13 v1.1 - Session 14 close: PRD-022/023/024/026/028/029 promoted; PRD-021 promoted; PRD-002/015/020 archived; eight-step loop installed (PRD-006 A1); PRD-028/029 first full loop runs completed; Claude skill upgraded to v0.6.0 (Files-First, Concurrent-Write Discipline, Model-Ledger Handshake); open-question registry at zero; standing decisions 7-12 added.
