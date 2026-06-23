# PRD-031 Phase 3 Migration Prep

Date: 2026-06-23
Author: Codex
Scope: non-normative migration prep after Phase 2 approval

## Objective

Phase 3 should move from read-only derived task/status shards toward a controlled live aggregate workflow without weakening Turnfile's human-legible governance boundary.

## Proposed Gate Sequence

1. Keep current aggregate files authoritative.
2. Add per-agent live shard directories under `working-session/agents/<agent>/`.
3. Add schemas for:
   - `status.yaml` or `status.json`;
   - `task-events.jsonl`;
   - task aggregate conflicts;
   - participant registry entries.
4. Add a read-only derivation check that compares shard-derived task state to selected `TURNFILE.yaml` task state.
5. Run in shadow mode until drift is understood and reviewed.
6. Promote a narrow live-write path only after Maintainer approval and peer review.

## Phase 3 Must Not Do

1. It must not let an unknown local model register itself as a Turnfile agent.
2. It must not let shard presence imply write authority.
3. It must not remove the legible `TURNFILE.yaml`, `MAILBOX.md`, or `WORKLOG.md` audit surface before replacement semantics are accepted.
4. It must not add Qwen to `policy.required_reviewers` or OWNERSHIP paths as a side effect of Qwen onboarding.

## Minimum Evals

1. Derived task aggregate matches an equivalent `TURNFILE.yaml` task subset in shadow mode.
2. Drift between aggregate and shard state is reported without overwriting either side.
3. Unknown participant shard cannot create tasks, claim tasks, or set status.
4. Participant registry change requires Maintainer-authored or Maintainer-approved event.
5. Reserved task fields cannot be overwritten by `task.updated`.
6. Completion authority is explicit: owner completion, maintainer completion, and non-owner completion have distinct outcomes.
7. Duplicate signal IDs in aggregate coordination are detected before new writes are accepted.
8. Mailbox projection remains fresh after any derived aggregate regeneration.

## Recommended Implementation Shape

1. Introduce `schemas/prd-031/task-event-v0.schema.json`.
2. Introduce `schemas/prd-031/task-aggregate-v0.schema.json`.
3. Extend `tools/aggregate-coordination.mjs --emit task-json` only after schema coverage exists.
4. Add `tools/validate-task-aggregate.mjs` as a validator rather than folding validation into the reducer.
5. Add `tools/compare-turnfile-tasks.mjs` for shadow-mode drift reporting.
6. Keep live shared-file mutation behind the existing `next-state` and mailbox invariant discipline until a later PRD explicitly replaces it.

## Open Design Questions

1. Should task status shards be YAML for human editing or JSON for schema validation?
2. Should completion authority be task-owner-only by default, or should any registered agent completion be allowed with conflict surfacing?
3. Should participant registry live in `PRD_STATUS.json`, `TURNFILE.yaml`, or a new append-only participant event log?
4. Should Phase 3 cover mailbox shards too, or stay task/status-only until task shadow mode is stable?

