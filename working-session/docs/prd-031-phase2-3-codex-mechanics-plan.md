# PRD-031 Phase 2/3 Codex Mechanics Plan

Status: Codex planning artifact
Date: 2026-06-23
Scope: PRD-031 Phase 2/3 only. This is non-normative implementation prep for future RED evals and peer review.

## Current Baseline

1. Phase 1 is implemented in `tools/aggregate-coordination.mjs`.
2. The implemented shard files are `signals.jsonl`, `outbox.jsonl`, and `read-state.jsonl`.
3. The aggregate tool emits `json`, `mailbox-md`, `mailbox-json`, and PRD-041 `arbitration-json`.
4. The current `TURNFILE.yaml`, `MAILBOX.md`, and `WORKLOG.md` remain authoritative until a later accepted phase migrates them to derived outputs.

## Phase 2 Target

Phase 2 should event-source task and agent state without changing the Maintainer reading surface.

New shard files:
1. `working-session/agents/<agent>/status.yaml`
2. `working-session/agents/<agent>/task-events.jsonl`
3. `working-session/agents/<agent>/worklog.md` or `worklog.jsonl`, after task/status derivation is stable

Derived outputs:
1. `TURNFILE.yaml` `agents` table
2. `TURNFILE.yaml` `coordination.tasks` table
3. `claim-conflict` records for concurrent claims
4. Later merged worklog view, if Phase 2 includes worklog derivation

## Task Event Contract

Minimum event types:
1. `task.created`
2. `task.claimed`
3. `task.updated`
4. `task.completed`
5. `task.deferred`
6. `task.cancelled`
7. `task.conflict-noted`

Required fields:
1. `id`: namespaced event id, e.g. `TASK-codex-20260623-0001`
2. `task_id`: stable task id
3. `actor`: shard owner
4. `ts`: ISO timestamp
5. `deps`: optional happens-before event ids
6. `payload`: typed event payload

Reducer rules:
1. Events are ordered by happens-before edges, then timestamp, then event id.
2. Create initializes the task if no earlier create exists.
3. Multiple creates for the same task id produce a conflict unless later superseded.
4. Claims are append-only; the reducer never deletes competing claims.
5. A completed event closes only the actor's delivery unless the task policy says single-delivery.
6. Concurrent claims produce `claim-conflict` and route to allow-parallel-then-review by default.

## Status Shard Contract

`status.yaml` should be the one mutable own-shard file allowed in Phase 2. It represents only the writer's self-reported runtime state.

Minimum fields:
1. `agent`
2. `status`
3. `current_task`
4. `session_id`
5. `last_seen`
6. `model`
7. `surface`
8. `heartbeat`

Reducer rules:
1. The shard owner must match `agent`.
2. Unknown agents are surfaced as registry candidates, not silently added as full participants.
3. Status does not grant authority. Authority still comes from PRD-015 onboarding state, model ledger, ownership policy, and Maintainer decisions.

## Phase 3 Target

Phase 3 retires `coordination.revision` as a write target.

Replacement pieces:
1. Per-agent event ids for allocation.
2. Git commit DAG plus event `deps` for cross-agent ordering.
3. A derived display scalar such as total event count or aggregate generation sequence.
4. Lease age based on commit distance plus wall-clock fallback.

Migration rule:
1. Keep the current revision integer visible as a derived compatibility field until all validators and skills stop requiring manual revision increments.
2. For shared-file writes during migration, keep PRD-029 `next-state` discipline.

## RED Eval Seeds

1. `status.yaml` owner mismatch is rejected.
2. Two agents claim the same task concurrently and the reducer emits `claim-conflict`.
3. Parallel task deliveries are both retained and routed to review.
4. Task completion does not erase competing claims.
5. The derived task table is deterministic from identical shard inputs.
6. No Phase 2 reducer writes aggregate files.
7. Phase 3 fixtures show no dependency on a hand-authored global revision counter.

## Boundaries

1. Do not mix PRD-042/Qwen execution into this mechanics plan.
2. Do not migrate live `TURNFILE.yaml` authority until RED evals and peer review exist.
3. Do not grant local models task ownership via shard presence alone.
