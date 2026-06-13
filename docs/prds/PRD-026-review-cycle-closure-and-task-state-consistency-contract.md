# PRD-026: Review Cycle Closure and Task-State Consistency Contract

Status: Actioned (promoted to docs/prds, session 14, 2026-06-13)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (Claude counters applied by Codex)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | author; Claude counters applied 2026-06-13 |
| Claude acceptance | accepted | MSG-20260612-027 reply: APPLY with 2 counters (cross-ownership repair prohibition; standalone PRD-026 with PRD-014 boundary) |
| Maintainer acceptance | accepted | Maintainer requested Codex proposal 2026-06-13 |
| Eligible for move to `docs/prds` | yes | all acceptances recorded; promoted session 14 |

## Input Provenance Tags

1. `explicit`: Maintainer asked Codex to propose any additional PRD that would make the session more efficient or effective.
2. `observed`: Session 14 repeatedly required cleanup of task status, `completed_rev`, agent `current_task`, mailbox lifecycle state, and PRD registry projections after the substantive review work was already settled.
3. `derived`: Existing PRD-003, PRD-006, PRD-013, and PRD-019 define individual lifecycle surfaces, but no single closure check ties them together for a PRD review cycle.

## Alignment reference

This PRD aligns with:

1. `docs/prds/PRD-003-message-lifecycle-sla-contract.md`
2. `docs/prds/PRD-006-session-promotion-pipeline.md`
3. `docs/prds/PRD-013-turnfile-coordination-format.md`
4. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`
5. `docs/prds/PRD-023-out-of-band-activity-reconciliation-contract.md` draft, if accepted

## Problem

The protocol can reach the right substantive outcome while leaving its projections inconsistent.

Session 14 examples:

1. A task was marked `done` without a `completed_rev`.
2. An agent `current_task` pointed at a task already marked `done`.
3. A task carried `completed_rev` while still reading `in_progress`.
4. Review messages remained `actioned` in the open queue while closure-owner follow-up was pending.
5. PRD acceptance evidence was split across `MAILBOX.md`, `WORKLOG.md`, `TURNFILE.yaml`, and `PRD_STATUS.json`.
6. Non-owner repair of another agent's owned task row converted visible drift into a false projection (for example, marking another agent's task `done` when no draft existed on disk).

These issues are not semantic disagreement. They are closure drift: the review cycle is substantively complete, but one or more state projections lag behind.

## Goal

1. Define a small closure checklist for PRD review cycles.
2. Make ownership of closure synchronization explicit.
3. Add validator/helper coverage for common closure drift.
4. Reduce cleanup turns without expanding governance authority.

## Non-goals

1. Changing PRD promotion gates.
2. Changing who may accept or reject a PRD.
3. Creating a new collision-control mechanism.
4. Replacing mailbox lifecycle rules in PRD-003.
5. Requiring automated mutation of shared files.
6. Governing session-level closeout compaction or projection synchronization. That belongs to the PRD-014 amendment path converged in MSG-20260612-024; this PRD governs review-cycle closure tied to mailbox review messages.

## Requirements

## R1. Review cycle closure unit

A review cycle is the lifecycle of a mailbox request that asks another participant to review, apply, counter, accept, reject, or amend a PRD or PRD-scoped artifact.

A review cycle begins when the request is posted and ends when the closure owner either:

1. closes the message, or
2. explicitly records why it remains open and what the next owner must do.

## R2. Closure-owner synchronization checklist

Before closing a PRD review-cycle message, the closure owner checks and updates the relevant projections:

1. `MAILBOX.md`: message status, ack/reply summary, open queue, closed summary or explicit active reason.
2. `MAILBOX.json`: regenerated after mailbox mutation.
3. `PRD_STATUS.json`: reviewer acceptance status, evidence, blocking items, and eligibility.
4. `TURNFILE.yaml`: related task status, `claim_rev`, `completed_rev`, agent `current_task`, and release of any locks.
5. `WORKLOG.md`: decision index or session entry when the outcome changes PRD state, task state, or future ownership.

If a projection is intentionally left unsynchronized, the closure owner records the reason in the message reply or WORKLOG.

## R3. Reviewer responsibility before yielding

The reviewer who actioned a PRD review request checks only the projections they own before yielding:

1. their mailbox ack/reply is present;
2. any task they own has coherent `status`, `claim_rev`, and `completed_rev`;
3. their agent `current_task` matches the task state;
4. any registry evidence they directly changed is internally consistent.

This does not transfer closure-owner duties to the reviewer. It prevents the reviewer from leaving known self-owned drift behind.

## R4. Closure drift validator

Add a validator or helper command that reports closure drift in one place.

Minimum checks:

1. task `done` with null `completed_rev`;
2. task with non-null `completed_rev` and non-`done` status;
3. agent `current_task` pointing to a missing or `done` task;
4. active non-terminal mailbox messages older than their response expectation without an ack or explicit active reason;
5. PRD registry entries whose acceptance evidence references a missing mailbox message;
6. PRD registry entries whose blocking items contradict all reviewer statuses being accepted.

The validator may start as warnings. It must not block promotion until Maintainer explicitly raises it to a gate.

## R5. No new authority

This PRD is process/tooling only.

1. It does not change Maintainer approval authority.
2. It does not let agents close another participant's owned message without permission.
3. It does not create an auto-merge or auto-promote path.
4. It does not supersede collision discipline; PRD-010 and PRD-013 remain the collision-control source.
5. It does not let an agent repair another participant's owned task fields. Drift observed in another agent's owned rows is flagged via signal or mailbox; it is never repaired in place by a non-owner.

## Acceptance criteria

1. Closure-owner checklist covers mailbox, registry, Turnfile task state, agent task pointer, and WORKLOG projection.
2. Reviewer-owned pre-yield checks are distinct from closure-owner duties.
3. Validator/helper minimum checks cover all closure drift examples observed in session 14.
4. The PRD explicitly states no governance authority expansion.
5. Claude and Codex both review whether this should be a new PRD or an amendment to an existing PRD before Maintainer acceptance.

## Risks

1. The checklist could add overhead to small review cycles.
   Mitigation: it applies only to PRD review-cycle messages and allows explicit defer reasons.
2. Validator warnings could become noisy.
   Mitigation: start as warnings and tune before making any gate mandatory.
3. Closure owner may be ambiguous.
   Mitigation: mailbox cards already include `Closure owner`; this PRD makes that field operational for projection sync.

## Dependencies

1. PRD-003 message lifecycle.
2. PRD-006 promotion gate.
3. PRD-013 Turnfile coordination format.
4. PRD-019 mailbox-first approval.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `MAILBOX.md` | Closure-owner field becomes the projection-sync owner for PRD review cycles |
| `TURNFILE.yaml` | Task state consistency becomes part of PRD review-cycle closeout |
| `PRD_STATUS.json` | Acceptance evidence and blocking items checked during closure |
| `WORKLOG.md` | Decision or ownership changes recorded during closure |
| Validator tooling | Adds closure drift helper/warnings |

## Milestones

1. M0: Draft PRD and route to Claude for apply-or-counter.
2. M1: Apply review counters or converge on amendment target if this belongs inside an existing PRD.
3. M2: Implement closure drift validator/helper after Maintainer acceptance.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-064 | Should review-cycle closure consistency be a standalone PRD-026 or an amendment to PRD-003, PRD-006, PRD-013, or PRD-019? | resolved: standalone PRD-026, with explicit scope boundary against the PRD-014 closeout amendment path | AC5, non-goals, R5 | **approved by maintainer** |
