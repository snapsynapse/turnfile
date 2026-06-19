# PRD-041: Unified Terminal Transport and Deterministic Projection Contract

Status: Accepted (working-session/docs) — all four reviewers accepted session 23; promotion to docs/prds pending (carry-forward)
Owner: Claude (drafter/proposer) + Maintainer (originator)
Date: 2026-06-18
Last revised: 2026-06-18 (session 23 — peer input folded, Maintainer-approved)

---

## Input Provenance Tags

1. `explicit`: Maintainer wants to stop being the manual text-transport layer between agents and route all Turnfile conversation through a single terminal hosting Claude Code CLI, Codex CLI, and Gemini CLI.
2. `explicit`: Maintainer wants Tokenese conversation available in the terminal, replicated to markdown files in the repo, where the markdown is generated deterministically — NOT LLM-generated in parallel.
3. `explicit`: Maintainer is unsure whether Perplexity has a terminal-CLI equivalent.
4. `derived`: PRD-031 already made MAILBOX/TURNFILE/WORKLOG deterministic aggregates of per-agent append-only logs ("derived views, not merge targets"); this PRD completes that direction for live conversation.
5. `derived`: PRD-024/027/028 fix English as source-of-truth, governance English-only, Tokenese as a derived/clone artifact with `^N`/`ev:` untrusted.
6. `derived`: PRD-013 defines `turn_queue` + revision locks; PRD-038/040 define read-only heartbeat stewards (poll-based delivery).
7. `derived`: PRD-039 keeps Perplexity at OBSERVER/PROVISIONAL CHECKER rung, relayed/evidence-only.
8. `peer-input`: Gemini (MSG-20260618-019, 2026-06-18) resolved OQ#1 → bridge Antigravity via the event log (option b).
9. `peer-input`: Codex (MSG-20260618-020, 2026-06-18) infra read "feasible with scoping": capability-graded adapters (R3), per-agent shards confirmed (R1), and `turn_queue` must be extended to an event-sourced arbitration primitive (R4).

---

## Problem

Today the Maintainer is the transport layer: every inter-agent message is hand-relayed between separate runtimes (Claude Code, Codex, Antigravity/Gemini, Perplexity). Two costs:

1. **Human-as-transport bottleneck.** Coordination latency and Maintainer effort scale with message volume. The Maintainer cannot step away without halting the conversation.
2. **Concurrent-write hazard on shared markdown.** Agents edit `MAILBOX.md` / `WORKLOG.md` / `TURNFILE.yaml` directly and concurrently; collisions are frequent and only caught by the read-before-edit guard after the fact. (Observed repeatedly in session 23.)

There is no single operator surface showing the whole conversation, and no transport that removes the human from routine delivery while preserving Maintainer authority over governance.

---

## The reframe (architecture)

Three layers, one source. This resolves the "which language is source-of-truth" tension up front.

1. **Source — append-only structured event log.** The canonical record of conversation is a structured event stream (NOT prose, NOT Tokenese, NOT markdown). One event per turn: `{id, rev, from, to, type, payload, legible_source (English), tokenese_encoding?, lock_ref, turn_ref, ts}`. Reuses PRD-031 per-agent append-only shards.
2. **Transport — router.** A router process delivers events between agent CLI sessions, replacing the human relay, serialized by the existing turn/lock machinery.
3. **Projections — deterministic renders OF the log.** Both the terminal view (operator transcript; optionally Tokenese-dense for agents) AND the repo markdown (`MAILBOX.md`, `WORKLOG.md`, `chat-*.md`) are deterministic, reproducible projections of the event log. No LLM in the projection path.

Consequence: Tokenese is a *display/wire encoding*, never the source. English `legible_source` stays authoritative; governance stays English-only (PRD-024/027/028 hold). Markdown stops being a merge target, which eliminates the concurrent-write hazard by construction.

---

## Goal

1. A single terminal hosts the CLI-based agents (Claude Code, Codex) and presents one unified, Maintainer-visible transcript spanning ALL participants — including bridged (non-CLI) ones (Gemini/Antigravity, Perplexity) via the event log.
2. A router delivers inter-agent messages automatically, removing the Maintainer from routine transport while preserving Maintainer gating on governance.
3. A structured event log is the source of truth; repo markdown is a deterministic projection.
4. Tokenese is available as a deterministic terminal/wire encoding over the English source (later phase), without inverting governance.

---

## Non-goals

1. Making Tokenese (or any non-English encoding) the source of truth.
2. Replacing Maintainer governance authority — the router automates delivery, not decisions.
3. LLM-generated markdown — the projection is deterministic and reproducible.
4. Terminal integration of Perplexity — it has no terminal-CLI surface; it stays relayed/evidence-only at its PRD-039 rung (the event log is the seam for non-CLI participants).
5. A bespoke multi-pane TUI in Phase 1 — a single unified transcript + input line is sufficient; rich TUI is Phase 3.

---

## Requirements

### R1. Event log is the source of truth
1. Conversation is recorded as append-only structured events (PRD-031 per-agent shards). Each event carries a structured `payload` plus an English `legible_source`.
2. The event log is the ONLY write target for conversation state. All markdown artifacts are derived from it.
3. Events are content-addressed / id-stable so projection and dedup are deterministic.

### R2. Deterministic projection
1. A deterministic projector (extends `tools/aggregate-coordination.mjs`) renders `MAILBOX.md`, `WORKLOG.md`, `chat-*.md`, and the terminal transcript from the event log.
2. Same event-log input → byte-identical output (reproducible; idempotent; no wall-clock or model nondeterminism in the path).
3. Markdown files are build artifacts; a direct hand/agent edit to a projected file is reconciled against the log (PRD-023), with the log winning.

### R3. Router / transport (Phase 1: file-watch auto-relay)
1. A router watches the event log; on a new outbound event it delivers the message to the target participant as that participant's next prompt — replacing the human relay.
2. Agent runtimes are unmodified in Phase 1.
3. Delivery is at-least-once with id-based dedup; per-turn ordering preserved.
4. **Capability-graded adapters (Codex review, 2026-06-18).** Adapters are NOT assumed equivalent; each participant declares an adapter tier: (i) **interactive session** (durable attached pane, stdin injection), (ii) **one-shot headless** (fresh turn per delivery), (iii) **bridged** (no terminal surface; integrated only via the event log). The router owns transcript continuity, delivery receipts, and idempotent replay — especially for one-shot adapters where the runtime keeps no durable session.
5. **Observed adapter mapping (Phase 1):** Claude Code → interactive/headless (`--print`/stdin); Codex → one-shot headless (`codex exec` behaves as a fresh turn, so the router, not the runtime, owns continuity); Gemini (Antigravity) → bridged (OQ#1 resolved (b)); Perplexity → bridged.

### R4. Turn arbitration and write safety
1. **Two distinct concerns (Codex review, 2026-06-18):** per-agent shards (R1) solve *physical* write collisions; a separate arbitration queue serializes *semantic* turns and gated state transitions. Do not conflate them.
2. The router serializes semantic turns via an **event-sourced arbitration primitive** — NOT the current `TURNFILE.yaml` `turn_queue`/`locks`, which are a human-readable coordination artifact, not a router primitive. The arbitration queue requires: stable entry ids, leases/expiry, delivery state, lock target, and explicit Maintainer interrupt/preempt events.
3. At most one participant holds the write turn for a given resource/shard; out-of-turn emissions are queued, not applied.
4. Together with R1 (shards), this is the structural elimination of the concurrent-write hazard.

### R5. Single-terminal operator surface
1. One terminal presents the unified cross-agent transcript plus a Maintainer input line.
2. The Maintainer can observe every turn and pause / step / inject / override at any point.

### R6. Maintainer gating preserved (OQ-052)
1. Governance-state transitions (PRD acceptance, promotion, lock override, onboarding rung changes) require explicit Maintainer approval, surfaced as gated events in the terminal.
2. The router NEVER auto-applies a governance transition. Routine operational delivery is automatic; governance is gated.

### R7. Tokenese as display/wire encoding (Phase 2 — named, deferred, gated)
1. Tokenese MAY encode the terminal view and inter-agent wire payload, but ONLY as a deterministic projection of the event's English `legible_source`.
2. Source-wins holds (PRD-024/027/028): English `legible_source` is authoritative; Tokenese is derived; governance events are English-only.
3. Gated behind the existing Tier-B calibration/charter; `^N`/`ev:` self-report channels remain untrusted.

### R8. Participant taxonomy (CLI-hosted vs bridged)
1. The event log is the integration seam; participants attach at one of two tiers:
   - **CLI-hosted** (in the terminal multiplex): Claude Code, Codex.
   - **Bridged** (in the conversation, not in the terminal pane; integrated via the event log): Gemini (Antigravity) per OQ#1 resolution (b), and Perplexity per its PRD-039 rung.
2. Gemini stays on Antigravity rather than switching to `gemini` CLI: switching would strip its IDE integration, MCP tools, and codebase-write capability, reducing it to a raw model wrapper (Gemini review, 2026-06-18). Antigravity exposes no out-of-box headless/pipe hook for option (c).
3. The router MUST NOT assume all participants are CLI-hosted; the bridged tier is a first-class path, not a fallback.

### R9. Liveness / heartbeat relationship
1. Event-driven delivery supersedes polling for delivery. PRD-038/040 read-only heartbeat stewards become a liveness/failsafe layer (detect router-down, missed delivery, stuck turn), not the primary delivery mechanism.
2. Read-only steward semantics (PRD-038 R2) are preserved for the failsafe role.

### R10. Failure and recovery
1. If the router or a CLI dies, the event log is the recovery source; markdown is regenerated deterministically; no conversation is lost.
2. Recovery is a pure replay/re-projection — no manual reconstruction.

---

## Phasing

- **Phase 1 (binding in this PRD):** R1–R6, R8, R9, R10 for English-only operation. CLI-hosted = Claude Code + Codex (terminal pane); bridged = Gemini/Antigravity + Perplexity (event-log seam). File-watch auto-relay with capability-graded adapters, deterministic projection, event-sourced turn arbitration, single operator transcript, Maintainer gating, recovery.
- **Phase 2 (named, deferred):** R7 Tokenese display/wire encoding over the same event log.
- **Phase 3 (named, deferred):** headless-SDK orchestration (Claude Code headless + `codex exec` + Gemini non-interactive) replacing file-watch; richer multi-pane TUI.

---

## Acceptance criteria

1. Structured event schema defined and validated (`schemas/`), with `legible_source` mandatory.
2. Deterministic projector renders MAILBOX/WORKLOG/chat-* byte-identically on re-run from a fixed event log.
3. Router delivers an A→B message with no human relay, in a controlled two-agent demo.
4. Turn-queue serialization demonstrably prevents a concurrent two-agent write to the same shard.
5. A governance event (e.g., PRD acceptance) is gated — surfaced for Maintainer approval, not auto-applied.
6. Markdown is fully regenerable from the event log after a simulated router/CLI crash.
7. Perplexity boundary documented; router does not assume all participants are CLI-hosted.
8. Eval suite authored (`evals/prd-041.evals.mjs`), RED until implementation.

---

## Open questions

1. **RESOLVED (Gemini review, 2026-06-18) → option (b).** Gemini stays on Antigravity and bridges via the event log as a non-CLI participant for Phase 1 (Antigravity exposes no headless hook (c); `gemini` CLI (a) would strip its agent capabilities). Folded into R8. Phase-1 terminal pane = Claude Code + Codex; Gemini + Perplexity are bridged.
1b. **NEW — arbitration-primitive design (owned by Codex, infra).** R4's event-sourced arbitration queue (stable ids, leases/expiry, delivery state, lock target, Maintainer interrupt/preempt) is a net-new mechanism, distinct from the current `TURNFILE.yaml` `turn_queue`. Its schema + lifecycle are a Codex design sub-lane before Phase-1 implementation.
2. **Per-agent CLI injection mechanism.** Claude Code (`--print`/headless/stdin), Codex (`codex exec`), Gemini-CLI (non-interactive) each have different prompt-injection ergonomics; Phase 1 must spec one adapter per agent. Agents build their own interface, then ask a fellow agent to help them test.
3. **Event log: unified vs per-agent shards.** Lean per-agent shards + deterministic merge (reuse PRD-031) to avoid a new single-writer bottleneck.
4. **Maintainer mid-stream interrupt model.** How a Maintainer directive preempts an in-flight turn without corrupting the turn_queue.
5. **Relationship to PRD-038/040.** Confirm heartbeats demote cleanly to failsafe rather than being retired.

---

## Cross-references

- PRD-031 (per-agent append-only logs + deterministic aggregation): this PRD completes it for live conversation; the projector extends `tools/aggregate-coordination.mjs`.
- PRD-013 (turn_queue + revision locks): the router's serialization substrate.
- PRD-024 / PRD-027 / PRD-028 (human-legibility + Tokenese dual-artifact + source-wins): R7 inherits these boundaries verbatim; governance stays English-only.
- PRD-038 / PRD-040 (read-only heartbeat stewards): demoted to liveness failsafe under R9.
- PRD-039 (Perplexity onboarding): Perplexity stays relayed/evidence-only; R8 keeps the event log as its seam.
- PRD-023 (out-of-band reconciliation): governs direct edits to projected markdown (log wins).

---

## Eval suite (PRD-006 A1)

- `evals/prd-041.evals.mjs` — authored by Claude (proposer), RED until implementation.
- Implementer: Codex (router + projector + schema are infrastructure).
- Reviewers: Gemini + Claude (+ Maintainer acceptance).
- Suite pins: event-schema presence + mandatory `legible_source`; projector determinism (byte-identical re-run); turn-queue serialization prevents concurrent shard write; governance events gated not auto-applied; markdown regenerable from log; Perplexity/non-CLI participant boundary; Tokenese-as-derived (R7) not source.
