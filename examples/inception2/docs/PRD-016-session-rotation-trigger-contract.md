# PRD-016: Session Rotation + New Thread Trigger Contract

Status: Draft (inception; not yet actioned)
Owner: Maintainer + Codex + Claude
Date: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | `MSG-20260208-036` reply confirms recommendations applied |
| Claude acceptance | accepted | `MSG-20260208-036` review outcome: accept with recommendations |
| Maintainer acceptance | pending | no explicit maintainer acceptance logged yet |
| Eligible for move to `docs/prds` | no | blocked until maintainer acceptance + zero blockers in `inception/docs/PRD_STATUS.json` |

## Problem

The protocol does not currently define when an agent should request a new thread/session. In practice, rotation decisions rely on maintainer intuition and local agent judgment without a formal request contract.

Observed failure modes:

1. Sessions sometimes run past efficient context windows.
2. Rotation requests are inconsistent across agents.
3. One agent may detect fatigue/risk in another agent but lack a formal way to call a rotation.
4. Handoffs can be delayed because the trigger threshold is unclear.

## Goal

Define a session-rotation trigger contract that:

1. Lets any agent request rotation for self or peer.
2. Uses explicit trigger classes with evidence.
3. Preserves maintainer authority for final decisions.
4. Improves token-efficiency and risk control.

## Non-goals

1. Fully automatic thread creation without human oversight.
2. Forced rotation on fixed time intervals.
3. Replacing PRD-011 session closeout mechanics.
4. Replacing maintainer sequencing decisions in Turnfile.

## Users

1. Maintainer: receives and adjudicates rotation requests.
2. Requesting agent: proposes rotation with evidence.
3. Target agent (optional): receives rotation recommendation/request.

## Requirements

## R1. Who may request rotation

Any active participant may request a session rotation:

1. An agent for itself.
2. An agent for another agent.
3. Maintainer directly, without agent request.

## R2. Trigger classes

Rotation request must name one or more trigger classes:

1. `context_saturation` (remaining token budget below a stated percentage threshold; see OQ-049).
2. `handoff_boundary` (natural milestone reached; next step cleaner in new session).
3. `queue_pressure` (unread/pending queue load indicates split needed).
4. `contention_risk` (shared-file conflicts or coordination contention increasing).
5. `quality_risk` (error-prone behavior suggests reset/re-focus needed).
6. `maintainer_preference` (explicit maintainer intent).

## R3. Evidence requirement

Each trigger in R2 must include concrete evidence:

1. Relevant message IDs, file paths, or revision tokens.
2. Current task state and unblock condition.
3. Expected benefit from rotation.

No evidence means request is advisory only.

## R4. Request format contract

Rotation requests are posted as mailbox messages:

1. Type: `decision-required` when maintainer action is needed.
2. Subject format: `Session rotation request: <self|agent-id>`.
3. Required fields:
   - Trigger classes
   - Evidence summary
   - Requested timing (`now`, `after-current-task`, or `next-session`)
   - Proposed successor owner

## R5. Maintainer decision outcomes

Maintainer response must be one of:

1. `approved-now`
2. `approved-deferred` (with condition)
3. `declined` (with rationale)
4. `conditional` (approval if stated criteria are met)

Decision is logged via normal mailbox/worklog contract.

## R6. Rotation execution handoff

If approved, execution must:

1. Run closeout process per PRD-014.
2. Update Turnfile agent/task state per PRD-013.
3. Ensure mailbox carry-over is explicit.
4. Publish next-session boot handoff artifact.

## R7. Peer-trigger etiquette

When requesting rotation for another agent:

1. Requesting agent must provide objective evidence (not subjective preference only).
2. Target agent may counter with rationale before maintainer decision.
3. Maintainer remains final authority.

## R8. Metrics and tuning

Protocol should track lightweight rotation metrics:

1. Number of rotation requests.
2. Approval/decline ratio.
3. Average unresolved-message count at rotation time.
4. Post-rotation startup efficiency signal (qualitative or quantitative), logged in WORKLOG and a machine-readable artifact (OQ-050).

Metrics are for threshold tuning, not agent ranking.

## Proposed workflow

1. Agent detects trigger(s) from R2.
2. Agent posts request with R3 evidence and R4 format.
3. Maintainer responds with R5 outcome.
4. If approved, agent executes R6 handoff sequence.
5. Rotation metrics are recorded for later tuning.

## Acceptance criteria

1. At least one self-requested rotation is processed end-to-end.
2. At least one peer-requested rotation is processed with explicit maintainer decision.
3. Every approved rotation includes closeout and boot handoff artifacts.
4. Rotation requests include concrete evidence, not generic assertions.

## Risks

1. Too many rotation requests may create administrative overhead.
2. Too few requests may preserve current inefficiency.
3. Peer-initiated requests could be misinterpreted socially without objective evidence.

## Dependencies

1. PRD-003 message lifecycle and decision message flow.
2. PRD-004 maintainer decision contract.
3. PRD-010 shared-file lock/transaction semantics for clean mid-rotation handoff.
4. PRD-011 session resumption contract.
5. PRD-013 Turnfile task/agent coordination state.
6. PRD-014 session closeout and boot handoff contract.

## Milestones

1. M0: Draft PRD-016.
2. M1: Pilot one self-request rotation.
3. M2: Pilot one peer-request rotation.
4. M3: Evaluate trigger usefulness and refine classes.
5. M4: Decide canonical adoption path.

## Open questions

1. ~~**OQ-049:** Should `context_saturation` have a numeric threshold guideline (for example token-budget percentage) or remain qualitative during pilot?~~ **Resolved:** Numeric: remaining token budget percentage based.
2. ~~**OQ-050:** Should rotation metrics be logged in WORKLOG only or also projected into a machine-readable artifact?~~ **Resolved:** Both: WORKLOG and machine-readable artifact.

Tracked in: `inception/OPEN_QUESTIONS.md`.

## Exit criteria for moving beyond inception draft

1. Rotation requests become predictable and evidence-based.
2. Maintainer confirms rotation timing decisions are easier to adjudicate.
3. Startup efficiency improves in sessions that used formal rotation requests.
