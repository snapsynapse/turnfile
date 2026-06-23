# PRD-031 Phase 2 Codex Self-Audit

Date: 2026-06-23
Author: Codex
Scope: self-audit after Claude A1 step-7 APPROVE

## Audited Surface

- `tools/aggregate-coordination.mjs`
- `evals/prd-031-phase2.evals.mjs`
- `evals/fixtures/prd-031/phase2/**`

## Result

No blocking implementation defect found in the Phase 2 reducer. Claude independently approved the implementation at rev 380 with no counters.

## Positive Checks

1. `--input` is accepted as an alias for `--shards`.
2. `--emit task-json` is isolated from existing mailbox and arbitration emit modes.
3. `status.yaml` is parsed through a deliberately small flat-YAML parser, avoiding accidental broader YAML semantics.
4. Unknown agent shards are surfaced in `unknown_agents` and do not create authoritative tasks.
5. Known-agent task events are reduced deterministically through `causalOrderWithCycles`.
6. Duplicate creates, concurrent claims, dependency cycles, status owner mismatch, and task actor mismatch are surfaced as conflicts.
7. The read-only aggregate boundary is covered by an eval that snapshots `TURNFILE.yaml`, `MAILBOX.md`, and `WORKLOG.md`.

## Non-Blocking Gaps To Cover Before Phase 3

1. `REGISTERED_AGENTS` is hard-coded to `claude`, `codex`, and `gemini`. Phase 3 should derive this from an explicit registry or participant shard, not from source constants.
2. `readFlatYaml` intentionally supports only scalar top-level values. Phase 3 should either keep status shards flat by contract or introduce a real YAML parser with tests.
3. The reducer currently treats completion as status `done` even if another actor completed a contested task. Phase 2 preserves competing claims, but Phase 3 should make completion authority explicit.
4. `task.updated` applies payload fields directly onto the task object. Phase 3 should define allowed mutable fields and reject reserved-field overwrites.
5. Unknown-agent filtering is actor-based. Phase 3 should also consider shard-owner provenance and event signature/namespace rules before any live authority migration.
6. Conflict objects are useful but not yet normalized under a schema. Phase 3 should add a JSON schema for task aggregate conflicts before live consumers depend on them.

## Recommended Phase 2 Follow-Up Evals

These are not blockers for the current approved implementation, but are good Phase 3 seeds:

1. malformed `status.yaml` emits `parse-error` without throwing;
2. task event actor mismatch emits `task-owner-mismatch` and does not grant another actor authority;
3. unknown shard without `status.yaml` is surfaced as `unknown_agents`;
4. `task.updated` cannot overwrite `task_id`, `created_by`, or `claims`;
5. completion by non-owner creates a conflict rather than silently setting `done`.

