# Session 21 PRD-031 Infrastructure Audit

Scope: repo-local, working-session planning artifact for Codex's infrastructure lane. This is not a normative PRD amendment and does not change the accepted PRD-031 contract. It identifies unblocked Codex work for PRD-031 Phase 2/3 and the eval surface needed before implementation.

Date: 2026-06-18
Author: Codex
Basis:
- `docs/prds/PRD-031-concurrent-multi-agent-coordination-contract.md`
- `evals/prd-031-phase1.evals.mjs`
- `tools/aggregate-coordination.mjs`
- live session-21 coordination state through revision 262

## Current Phase 1 State

Phase 1 is implemented and eval-covered:
- Per-agent shard inputs exist in the contract for `signals.jsonl`, `outbox.jsonl`, and `read-state.jsonl`.
- `tools/aggregate-coordination.mjs` derives JSON, `mailbox-md`, and `mailbox-json` views without writing shard files.
- Namespaced signal and message ids are enforced.
- Duplicate ids and namespace violations are reported as conflicts.
- Signals and messages are deterministically ordered by dependency edges, timestamp, then id.
- Read-state events clear unread mailbox counts.

The Phase 1 tool is deliberately narrower than the full PRD-031 contract:
- It does not read `status.yaml`.
- It does not read `task-events.jsonl`.
- It does not derive Turnfile agent/task tables.
- It does not produce `claim-conflict` findings.
- It does not emit a merged Worklog view.
- It still exposes `Codex`, `Claude`, and `Maintainer` as fixed mailbox recipients; Gemini is now a live agent and should be included in derived snapshots.
- Live `TURNFILE.yaml` still uses `coordination.revision` as a hand-written scalar. Phase 3 must retire that as an authoritative write target.

## Unblocked Codex Work

### C1. Bring Gemini Into Derived Snapshots

Problem: `aggregate-coordination.mjs` currently hard-codes `SNAPSHOT_RECIPIENTS = ["Codex", "Claude", "Maintainer"]`. Session 20 onboarded Gemini as a live provisional-active agent, so derived mailbox views should include Gemini.

Proposed eval:
- Build shards for `claude`, `codex`, and `gemini`.
- Send a message to `gemini` and a broadcast from `codex`.
- Assert `snapshot.Gemini` exists and derives unread counts correctly.
- Assert existing Codex/Claude/Maintainer behavior remains stable.

Implementation likely small:
- Derive recipients from shard agents plus `Maintainer`, capitalized for display.
- Preserve deterministic order. Recommended order: sorted agents by shard name, then `Maintainer`, unless a registry ordering source is introduced.

### C2. Phase 2 Status Shards

Problem: PRD-031 R1 requires `status.yaml`; Phase 2 requires deriving `TURNFILE.yaml` agents tables from per-agent status shards.

Minimal `status.yaml` shape:
```yaml
agent: codex
role: agent
status: active
current_task: s21-handshake-heartbeat
last_seen: codex-session-21-open
session_id: codex-session-21
model:
  label: OpenAI Codex (GPT-5)
  surface: desktop
```

Proposed evals:
- A valid status shard appears in aggregate JSON under `agent_status`.
- A malformed or cross-agent status shard yields a `status-conflict`.
- A status event for Gemini appears without requiring a hand-authored aggregate `agents.gemini` edit.
- Derived Turnfile agent rows are deterministic and preserve null `current_task`.

Implementation notes:
- Use a YAML parser already available in the repo's Node dependency set if present; otherwise keep Phase 2 status as JSONL first and defer YAML until dependency policy is explicit.
- Treat status shards as authoritative for agent self-report only. Maintainer or peer judgments still live in governance artifacts.

### C3. Phase 2 Task Events

Problem: PRD-031 R5 requires event-sourced tasks and concurrent-claim handling. The current tool has no `task-events.jsonl` support.

Minimal event families:
- `task-created`
- `task-claimed`
- `task-updated`
- `task-completed`
- `task-blocked`
- `task-released`

Suggested event shape:
```json
{"id":"TASKEV-codex-0001","task_id":"s21-prd031-phase2","event":"task-claimed","actor":"codex","ts":"2026-06-18T00:00:00Z","deps":[]}
```

Proposed evals:
- A task create + claim + complete chain derives a final task row.
- Two concurrent `task-claimed` events on one task derive both claimants and emit `claim-conflict`.
- `claim-conflict` default behavior is allow-parallel-then-review, not earliest-wins.
- A superseding correction event can amend a task note without mutating older events.
- Events with ids outside the actor namespace are reported as namespace violations.

Implementation notes:
- Add `task_events` and `tasks` sections to aggregate JSON.
- Do not mutate existing `TURNFILE.yaml` tasks during Phase 2 implementation until a migration rule is accepted.
- Keep legacy aggregate tasks readable during transition so the Maintainer view does not go blank.

### C4. Derived Worklog View

Problem: PRD-031 R3 includes a merged `WORKLOG.md` view. Phase 1 does not cover it.

Proposed evals:
- Per-agent `worklog.md` fragments merge into a deterministic combined view.
- Decision entries are preserved with source agent and timestamp.
- Dense/Tokenese fragments in shards require legible projection in the aggregate.

Implementation notes:
- Start with a conservative append-only `worklog.jsonl` or markdown fragment contract rather than parsing arbitrary existing `WORKLOG.md`.
- Keep the current top status block as a transitional aggregate until per-agent status shards are live.

### C5. Phase 3 Revision Retirement

Problem: live session 21 still showed `TURNFILE.yaml` header/body revision drift during concurrent edits. PRD-031 Phase 3 exists to remove `coordination.revision` as a hand-written authority.

Proposed evals:
- Aggregate output reports a derived display scalar from event counts or causal height.
- No eval requires an agent to write `coordination.revision` as authority.
- Optional lease staleness is computed from event/commit evidence, not `revision - acquired_rev`.
- Existing validators treat a stale aggregate revision as cache drift, not source-of-truth corruption, after the migration flag is enabled.

Implementation notes:
- Do not remove the scalar in one step. Add a feature flag or mode first, then migrate validators and boot language.
- Keep human display stable while changing the authority source.

## Recommended Codex Sequence

1. Add focused RED evals for C1 and implement Gemini-aware derived snapshots. This is the smallest live-agent correctness fix and stays inside Codex's infrastructure lane.
2. Add RED evals for C3 task events and `claim-conflict`, then implement event folding without changing live `TURNFILE.yaml` tasks.
3. Add C2 status shard evals once task events are green, because status derivation changes the visible agent table and has higher coordination risk.
4. Defer C4 Worklog derivation until status/task derivation is stable.
5. Defer C5 revision retirement until validators and boot files have an explicit migration flag.

## Review Questions For Peers

1. Should C1 Gemini-derived snapshot be treated as Phase 1 hardening or Phase 2 start?
2. Should `status.yaml` be YAML from the start, or should Phase 2 use JSONL for dependency-free implementation?
3. Should concurrent same-task claims produce only a conflict record first, or also an auto-routed mailbox review request?
4. What aggregate view should remain committed during transition, if aggregates are supposed to become build artifacts rather than merge targets?

## Stop Conditions

Stop before implementation if:
- Claude counters the three-lane scope split in `MSG-20260617-051`.
- Gemini counters the Tokenese/PRD-035 lane in a way that changes the infrastructure boundary.
- Validators require global aggregate edits that would collide with active peer-owned work.
- A PRD amendment is needed before Phase 2 semantics can be eval-authored safely.
