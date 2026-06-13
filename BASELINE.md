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
5. Protocol contracts are PRDs. Drafts live in `working-session/docs/`; Maintainer-accepted contracts are promoted to `docs/prds/` after the PRD-006 gate (Codex + Claude + Maintainer acceptance, zero blockers, registry validation).
6. Validation gates run at session start and close: `turnfile-lint`, mailbox invariants, PRD promotion registry, skills preflight.
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
## PRD shelf (as of session 14, rev 33)
| PRD | Title | Status |
|---|---|---|
| 001 | Maintainer interaction model | Promoted |
| 002 | Rust notification viewer MVP | Deferred (revisit after starter workflow) |
| 003-014 | Core protocol contracts (lifecycle, decisions, schema, promotion, provenance, handoff, reconciliation, locking, resumption, skills, coordination format, closeout) | Promoted |
| 015 | Agent onboarding + vetting | Deferred (with Gemini onboarding package; resumes after model-agnostic skill layout) |
| 016 | Session rotation trigger | Promoted |
| 017 | Boot sequence contract (now includes folded PRD-020 as R7) | Promoted (session 14, after Codex fold re-verify) |
| 018 | Maintainer approval authority matrix | Promoted (session 14) |
| 019 | Mailbox-first approval, event-based cadence | Promoted (session 14; no time-based polling) |
| 020 | Boot artifact completeness + chat logs | Superseded (folded into PRD-017 R7) |
| 021 | Conflict loop bound + selective-unlock gradient | Agent-accepted (Codex amendment applied); Maintainer PRD-document acceptance pending |
`working-session/docs/PRD_STATUS.json` is the source of truth for this table.
## Standing decisions
1. All changes Maintainer-gated by default; selective unlock requires explicit recorded ratification (OQ-052, PRD-018).
2. Coordination is asynchronous and event-based. No time-based polling layer (OQ-054/055).
3. Boot is a documented command contract with optional helper scripts, not a mandatory script (OQ-051).
4. Chat logs carry fixed metadata fields (branch, revision, phase, session ID, date); session structure stays manual (OQ-056/057).
5. Peer review keeps the counter-recommendation model; no enumerate-only review lane (OQ-061).
6. Drift elimination is standing guidance: when a tool or document cannot record reality faithfully, fix the tool rather than misstate the record (Maintainer, session 14).
## Forward task register (decided session 14, not yet executed)
1. Model-agnostic skill layout: role-keyed directories with the model recorded in the bundle MANIFEST, not the path. Claude side done in session 14 (`skills/claude/` v0.4.0, old location deprecated in place). Codex side done in session 14 (`skills/codex/` v2, old location deprecated in place; `validate-skills-preflight.mjs` default path updated). Remaining: `skills/gemini-3/` (migrates when PRD-015 resumes). Unblocks PRD-015 resumption.
2. Root `AGENTS.md` and `CLAUDE.md` bootstrap files so any cold-start agent (Codex CLI, Claude Code, others) lands on the boot sequence without manual orientation. `GEMINI.md` already exists.
3. Minimal starter workflow (ROADMAP item 2): adopt Turnfile by copying one folder and reading one guide. Two starters: two-agents-plus-maintainer, and single-agent-plus-independent-review.
4. Platform integration notes (ROADMAP item 4), starting with Claude Code and Codex as execution substrates.
5. PRD shelf findability: README now carries the full status index; evaluate a single-shelf layout if the two-shelf split keeps confusing readers.
## Changelog
- 2026-06-12 v1.0 - Initial baseline ratified in session 14 after backlog triage and scope-reset reconciliation.
