# PRD-031 Phase 2 Eval Design Notes

Status: Codex planning artifact
Date: 2026-06-23
Scope: Non-normative eval design for future PRD-031 Phase 2 RED suite. This does not migrate live authority from `TURNFILE.yaml`, `MAILBOX.md`, or `WORKLOG.md`.

## Purpose

PRD-031 Phase 1 already derives mailbox-style surfaces from per-agent signal/outbox/read-state shards. Phase 2 should add task and status shards without changing Maintainer-facing authority until evals, implementation, and peer review converge.

These notes convert the mechanics plan into testable fixtures for a future eval author.

## Fixture Set

1. `status-owner-match`: `working-session/agents/codex/status.yaml` with `agent: codex` folds into the derived agent table.
2. `status-owner-mismatch`: `working-session/agents/codex/status.yaml` with `agent: gemini` emits `status-owner-mismatch` and does not update Gemini state.
3. `unknown-agent-status`: `working-session/agents/qwen/status.yaml` emits an `unknown-agent` candidate record and does not grant task authority.
4. `single-task-flow`: one owner emits `task.created`, `task.claimed`, `task.updated`, `task.completed`; reducer emits a stable done task row.
5. `concurrent-claims`: Codex and Gemini both claim the same task with no happens-before edge; reducer emits `claim-conflict` and retains both claims.
6. `owner-completion-only`: Codex completes its delivery while Gemini still has an unresolved claim; reducer does not erase Gemini's competing claim unless task policy is `single_delivery`.
7. `duplicate-create`: two creates for the same `task_id` with no superseding event emit `duplicate-task-create`.
8. `causal-ordering`: out-of-order file order still derives the same table when `deps` produce a deterministic graph.
9. `cycle-ordering`: cyclic `deps` emit `dependency-cycle` and fall back to deterministic timestamp plus id ordering for display only.
10. `read-only-aggregate`: aggregate command writes no `TURNFILE.yaml`, `MAILBOX.md`, `WORKLOG.md`, mailbox JSON, or shard files.

## Expected Reducer Outputs

Minimum `--emit task-json` shape:

```json
{
  "tasks": [],
  "agents": [],
  "conflicts": [],
  "unknown_agents": [],
  "source_events": []
}
```

Minimum conflict fields:

```json
{
  "kind": "claim-conflict",
  "task_id": "s-example",
  "actors": ["codex", "gemini"],
  "event_ids": ["TASK-codex-20260623-0001", "TASK-gemini-20260623-0001"],
  "resolution": "allow-parallel-then-review"
}
```

## Guardrails

1. Shard presence is evidence, not authority. Agent authority still comes from PRD-015 onboarding state, model ledger, ownership policy, and Maintainer decisions.
2. Unknown local models must be reported as candidates only.
3. Phase 2 reducers should be read-only by default and should require an explicit later migration command before touching live aggregate files.
4. During migration, PRD-029 `next-state` discipline still applies to shared-file writes.
5. The eval suite should include negative controls for Qwen-like local candidates so a status shard cannot bootstrap write authority.

## Suggested Commands

1. `node --test evals/prd-031-phase2.evals.mjs`
2. `node tools/aggregate-coordination.mjs --input fixtures/prd-031/phase2 --emit task-json`
3. `node tools/aggregate-coordination.mjs --input fixtures/prd-031/phase2 --emit turnfile-json --dry-run`

## Open Review Questions

1. Should Phase 2 use `worklog.md` shards or defer worklog derivation until tasks/status are stable?
2. Should task policies live in each `task.created` payload or in a separate immutable policy fixture?
3. Should claim conflicts remain visible indefinitely, or collapse after all competing deliveries are reviewed?
