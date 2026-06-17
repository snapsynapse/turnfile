# PRD-031: Concurrent Multi-Agent Coordination Contract

Status: Draft v3 (working-session)
Owner: Maintainer + Claude (proposer) + Codex (reviewer)
Date: 2026-06-16

Supersedes draft v1 ("Enforced Shared-File Mutual Exclusion"). v1 proposed a global control-plane mutex; the Maintainer redirected (2026-06-16): Turnfile must let multiple LLMs work the same branch of the same repo at the same time, delivering independently and simultaneously, and reconcile adversarially — not serialize into one-turn-at-a-time with idle gaps. A global mutex would entrench the very serialization we are leaving behind. This draft re-centers on safe concurrency. v3 applies Maintainer decisions on the four design questions (see Resolved questions).

## Definitions

- DAG (Directed Acyclic Graph): a set of nodes joined by one-way links with no cycles — you can never follow the arrows back to where you started, so nothing is its own ancestor. Git's commit history is a DAG: every commit points to its parent(s), so the graph itself records what-came-after-what and shows parallel work as a branch that later merges. PRD-031 uses this existing structure as the ordering/causality source instead of a single shared revision counter.
- Shard: a per-agent directory under `working-session/agents/<agent>/` that only that agent writes.
- Aggregate (or derived view): a human-legible file (MAILBOX, WORKLOG, TURNFILE snapshot) regenerated from all shards by a tool; read-mostly, not hand-edited.
- Append-only log: a file that is only ever added to, never edited in place, so writes from different agents never touch the same bytes.

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260616-018: Codex APPLY on v3 substance and Phase 1 lane; PRD_STATUS registry reconciled 2026-06-17 |
| Claude acceptance | pending | Author of draft v2 |
| Maintainer acceptance | accepted | Maintainer directive 2026-06-16: enable concurrent multi-LLM work; tighten cycles as Tokenese lands; agent count about to grow beyond two |
| Eligible for move to `docs/prds` | no | Claude acceptance evidence pending |

## Input Provenance Tags

1. `explicit`: Maintainer: Turnfile should allow multiple LLMs to work on the same branch of the same repo at the same time; take turns AND check each other's work, but allow concurrent action.
2. `explicit`: Maintainer: the exclusive one-turn-then-the-other-with-idle model was right at inception, not for where we are going.
3. `explicit`: Maintainer: it is a collaborative negotiation of adversarial actions that produces a strong finished product; allow concurrent work independently delivered simultaneously by multiple LLMs.
4. `explicit`: Maintainer: agent count is about to increase beyond two; Tokenese will make work faster and cycles tighter.
5. `derived`: the session-15/16 collisions (TURNFILE rev 149-157, 2026-06-16) show the current shared-file-edit model forces a choice between collisions and serialization, because agents co-edit the same bytes of `TURNFILE.yaml`, `MAILBOX.md`, and `WORKLOG.md`.
6. `derived`: PRD-013's single `coordination.revision` integer is a global contention point (two agents derive the same next value and both write it).
7. `derived`: PRD-010/PRD-013 advisory locks are cooperative and cannot enforce exclusion, nor should they — exclusion is the wrong primitive for the concurrency goal.

## Problem

Turnfile's coordination state lives in a few coarse shared files that every agent hand-edits: `TURNFILE.yaml` (agents, a single global revision counter, tasks, locks, signal log), `MAILBOX.md` (snapshot + queues + messages), and `WORKLOG.md`. With one agent at a time this is fine. With two or more agents acting at once on a single working tree it forces a hard choice:

1. Serialize (advisory locks, take strict turns) — safe but slow, and it is exactly the inception-era model the Maintainer is retiring.
2. Let agents write concurrently — collisions, because they edit the same bytes and allocate from the same global ID/revision space.

The root cause is a shared mutable write target, not a missing lock. As agent count grows and Tokenese tightens cycle time, contention on these files rises superlinearly. We need a coordination model where concurrent, independent delivery by N agents is the normal case and is collision-free by construction, while preserving Turnfile's defining properties: human-legible governance (PRD-024), auditable adversarial negotiation, and Maintainer arbitration.

## Goal

1. Let N LLMs work the same branch concurrently, each delivering independently and simultaneously, without clobbering each other.
2. Make collision-free writes the default by construction, not by locking.
3. Treat genuine overlap (two agents acting on the same task/artifact) as a first-class negotiation event that the adversarial review loop resolves — not as an error or a race.
4. Preserve human-legible aggregate views and Maintainer arbitration (PRD-024, PRD-004).
5. Scale from 2 to N agents with no architectural change — onboarding an agent adds a shard, nothing more.

## Non-goals

1. A global control-plane mutex or any mechanism whose effect is to serialize agents. (Explicit reversal of draft v1.)
2. Removing human legibility. Aggregate views stay legible; they become derived, not hand-edited.
3. Requiring real-time infrastructure, a daemon, or a network broker. The substrate stays files + git.
4. Replacing PRD-029 (derive state) or PRD-030 R9 (refresh from files); both still hold, now applied to shard-and-aggregate.
5. Forbidding turn-taking. Sequential review is still available and correct for some exchanges; this contract makes it a choice, not the only safe mode.

## Principles

1. Concurrency by default; serialization only where a step is genuinely single-writer (rare).
2. Ownership partitioning: an agent writes only files it owns. No two agents write the same file in normal operation.
3. Append-only event logs over in-place mutation of shared tables.
4. Derived aggregates: the legible shared views are regenerated from owned sources by a tool; never hand-edited.
5. Optimistic concurrency with git as the merge substrate: disjoint writes merge cleanly; overlap is detected and negotiated.
6. Conflict is a negotiation, not a crash: overlapping actions surface for adversarial reconciliation, the protocol's core value.
7. No global scalar bottleneck: replace the single revision counter with per-agent logical clocks; any displayed global number is derived.

## Requirements

## R1. Ownership partitioning of the control plane

1. Each agent owns a private shard directory, e.g. `working-session/agents/<agent>/`, and writes only within it during normal operation.
2. Per-agent shard contents: `status.yaml` (the agent's own status, current task, session, model/surface), `signals.jsonl` (append-only), `outbox.md` / `outbox.jsonl` (messages it sends, append-only), `read-state.jsonl` (which messages it has read/acked), `worklog.md` (its own narrative + decision entries), `task-events.jsonl` (task claims/updates it makes).
3. No agent edits another agent's shard. No agent hand-edits an aggregate view.
4. Genuinely shared artifacts (e.g. PRD documents, source code, evals) keep ordinary commit-own-paths discipline and are partitioned by task ownership, not by this shard scheme.

## R2. Append-only event logs

1. Signals, sent messages, read/ack state, task events, and decision entries are append-only per agent. Appends from different agents never touch the same bytes, so they merge.
2. No event is mutated in place; corrections are new superseding events that reference the prior event id (consistent with PRD-009 revision-token linkage).
3. Append-only growth is bounded by compaction at closeout (PRD-011 R5, PRD-014 A1), applied per shard.

## R3. Derived aggregate views (build artifacts, not merge targets)

Resolves OQ-3: aggregates are build artifacts regenerated on read, NOT committed merge targets. This removes the last shared-file merge surface — there is nothing left for two agents to collide on.

1. A derivation tool (e.g. `tools/aggregate-coordination.mjs`) reads all shards and regenerates the legible aggregates: the `TURNFILE.yaml` agents/tasks/signal snapshot, `MAILBOX.md` + `MAILBOX.json`, and a merged `WORKLOG.md` view, ordered by the git DAG (R6).
2. Aggregates are generated on read (boot, pre-report, validation), not hand-edited and not a git merge target. Shards are the only committed authoritative state (extends PRD-030 R9: shards authoritative, aggregate is cache).
3. Because aggregates are deterministic functions of the shards, the legible view for ANY commit can be regenerated from that commit's shards — git-history legibility is preserved without committing the aggregate as a mergeable file.
4. Maintainer legibility (PRD-024): regeneration is cheap and runs automatically before any Maintainer-facing read; a CI/boot step may also publish a read-only rendered snapshot (force-overwritten, never 3-way merged) for GitHub browsing. A stale or missing aggregate is a derivation-not-run signal, never a source of truth.

## R4. Namespaced identifiers (no allocation race)

1. Message, signal, and task-event ids are namespaced per agent: e.g. `SIG-claude-0007`, `MSG-claude-20260616-0003`. An agent allocates only within its own namespace, so two agents never contend for the same next id.
2. The aggregate may present a unified, causal-ordered view; uniqueness is guaranteed by the namespace, not by a global counter.

## R5. Event-sourced tasks and concurrent-claim handling

1. Task state (create/claim/update/complete) is expressed as append-only task events in each agent's shard and folded into the task table by derivation.
2. If two agents claim the same unassigned task concurrently, derivation detects two claims on one task and emits a `claim-conflict`. Resolves OQ-2: the default is allow-parallel-then-review — both claimants may proceed and deliver independently, and the competing deliveries are routed to the review/rebuttal loop (R9) to converge on the stronger result. This matches the adversarial-collaboration vision: parallel attempts are a feature, not a fault. (Earliest-causal-wins and Maintainer-arbitration remain available overrides per task when parallel delivery is wasteful.)
3. Two agents may deliberately deliver competing implementations of the same task (adversarial parallel attempts); the protocol records both and routes them to the review/rebuttal loop to converge on the stronger result (PRD-021 conflict-loop bound applies).

## R6. Causal ordering via the git DAG

Resolves OQ-1: ordering uses the git commit DAG plus happens-before edges, not a new clock system. The git history is already a DAG (see Definitions); we use the structure we already maintain rather than building Lamport or vector clocks.

1. The single `coordination.revision` integer is retired as a write target. Cross-agent ordering comes from (a) the git commit DAG — parent links record what-came-after-what, and concurrent work appears as branches that merge — and (b) explicit happens-before edges inside events (an event that reads/acks another carries that event's id).
2. Lease/staleness semantics (formerly `revision - acquired_rev > lease_revs`) are redefined against commit-DAG distance plus a wall-clock fallback and liveness check; they apply only to the rare optional fine-grained lease (R7), not to the control plane as a whole.
3. A derived, monotonic display value (e.g. total event count or commit height) may be shown in aggregates for human readability; it is computed, never a write target.
4. Lamport or vector clocks are explicitly NOT adopted (rejected for added machinery the git DAG already provides); they may be revisited only if a future need shows the DAG plus happens-before edges is insufficient.

## R7. Optional fine-grained leases (not a global lock)

1. Locks are not required for normal concurrent operation under R1-R5.
2. A short, fine-grained advisory lease may be taken only for a genuinely single-writer shared artifact that cannot be partitioned (rare). It names the specific artifact, holder, clock, lease, and reason, and is acquired atomically (R8).
3. There is never a single lock over the whole control plane.

## R8. Git as the merge substrate

1. Each agent commits only its own shard paths (and the task-partitioned artifacts it owns). Concurrent commits to disjoint paths merge without conflict.
2. Derivation of aggregates runs post-merge so the legible views reflect all merged shards.
3. Any optional fine-grained lease (R7) or shared-counter-free atomic op uses an atomic primitive (e.g. `O_EXCL` sentinel or an atomic git ref update) so even the rare shared step has no TOCTOU window.
4. Push/pull cadence may be tightened (frequent small commits) without raising collision risk, because shards are disjoint.

## R9. Conflict detection and adversarial reconciliation

1. Derivation surfaces all genuine overlaps: duplicate task claims, competing deliveries of one artifact, contradictory decision entries, and divergent edits to a shared artifact.
2. Overlaps route into the existing negotiation machinery: apply-or-counter review (PRD-006 A1), conflict-loop bound (PRD-021), Maintainer arbitration (PRD-004). Concurrency feeds the adversarial loop instead of bypassing it.
3. Reconciliation outcomes are recorded as new events; nothing is silently dropped.

## R10. N-agent scaling and onboarding

1. The architecture is independent of agent count. Onboarding (PRD-015) adds one shard directory and one entry in the agent registry; no other change.
2. Derivation, namespacing, and conflict detection operate over an arbitrary set of shards.

## R11. Legibility, compaction, and Maintainer view

1. Aggregates remain the Maintainer's single reading surface and satisfy PRD-024 (legible governance) and PRD-030 R9 (files authoritative).
2. Per-shard append-only logs are compacted at closeout (PRD-011 R5, PRD-014 A1); compaction is itself a per-shard, collision-free operation.
3. Dense/Tokenese encodings (PRD-024 profiles, PRD-027/028) may be used inside shard logs provided the derived aggregate carries the legible projection.

## Acceptance criteria

1. Two or more agents write their own shards concurrently and the result merges with zero manual conflict resolution (eval: simulate concurrent shard appends from N=3 simulated agents, merge, derive — clean).
2. Ids never collide under concurrency (eval: concurrent id allocation across agents yields no duplicate).
3. Derivation reproduces a legible `TURNFILE`/`MAILBOX`/`WORKLOG` aggregate from shards that matches a known-good fixture.
4. A concurrent same-task claim produces a `claim-conflict` event and a deterministic default resolution, not a lost claim.
5. A competing parallel delivery of one artifact is recorded as two candidates and routed to the review loop (PRD-021/PRD-006 A1), not overwritten.
6. No global control-plane lock exists; any optional fine-grained lease is atomic and scoped to a single named artifact.
7. Onboarding a third agent requires only adding a shard + registry entry (worked example with a stub agent).

## Migration / phasing

1. Phase 1 — APPROVED as the immediate scope (resolves OQ-4): per-agent namespaced ids + per-agent append-only signal/message/read-state logs + a derivation tool that regenerates `MAILBOX.md`/`.json` and the `TURNFILE` signal snapshot. Tasks/agents tables stay as today but become derived outputs. This alone removes today's two-agent collisions and is built first, before the larger redesign.
2. Phase 2: event-source tasks and per-agent status shards; derive the `TURNFILE` agents/tasks tables; retire hand-editing of `TURNFILE.yaml`.
3. Phase 3: replace `coordination.revision` with per-agent logical clocks; redefine lease semantics; remove the advisory global lock entirely.
4. Each phase ships under PRD-006 A1 (evals first) and keeps the aggregate views byte-stable for the Maintainer at every step.

## Risks

1. Derivation becomes a hidden single point of failure or a new source of drift.
   Mitigation: derivation is pure/deterministic, eval-fixtured (AC3), and re-runnable; shards are authoritative so a bad derivation is recoverable.
2. Append-only logs grow unbounded.
   Mitigation: per-shard compaction at closeout (R11.2), collision-free.
3. Eventual-consistency confusion: an agent acts on a stale aggregate.
   Mitigation: PRD-030 R9 refresh + derive-before-write; conflicts surface and reconcile (R9) rather than corrupt.
4. Causal ordering is more complex than a single integer.
   Mitigation: phase it (Phase 3); keep a derived display scalar for humans; lean on the git DAG for ordering.
5. Over-engineering for two agents.
   Mitigation: Phase 1 alone removes today's collisions; later phases gated on real N-agent need.

## Dependencies

1. PRD-010 shared-file transaction locking — largely superseded for the control plane; fine-grained optional lease only.
2. PRD-013 Turnfile coordination format — extended/partly superseded (shards + derivation + causal clock); v2 of the coordination format.
3. PRD-006 A1 eight-step loop — each phase ships eval-first.
4. PRD-009 cross-document reconciliation — superseding-event linkage for corrections.
5. PRD-021 conflict-loop bound — resolves competing parallel deliveries.
6. PRD-024 human-legibility — aggregates must stay legible.
7. PRD-029 pre-write derivation and PRD-030 R9 memory boundary — shards authoritative, aggregate is cache.
8. PRD-015 onboarding — adds a shard per new agent.

## Open questions

No open questions in this draft.

## Resolved questions

Resolved by Maintainer 2026-06-16:

1. OQ-1 (causal ordering): use the git commit DAG plus happens-before edges. Lamport/vector clocks rejected as unnecessary machinery. (R6.)
2. OQ-2 (concurrent same-task claim): default to allow-parallel-then-review — both deliver, the review/rebuttal loop converges. Earliest-causal-wins and Maintainer-arbitration remain per-task overrides. (R5.2.)
3. OQ-3 (aggregate storage): aggregates are build artifacts regenerated on read, not committed merge targets; any commit's view is regenerable from its shards; a force-overwritten read-only snapshot may be published for GitHub browsing. (R3.)
4. OQ-4 (Phase 1 scope): yes — namespaced ids + append-only mailbox/signal logs + derivation is the approved immediate scope, built first. (Migration Phase 1.)
