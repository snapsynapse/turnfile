# PRD-015: Agent Onboarding + Vetting Contract

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

The protocol currently assumes participating agents can interpret and execute contracts correctly, but there is no explicit onboarding and vetting gate for new LLMs. This creates avoidable reliability risk and onboarding ambiguity.

Observed failure modes:

1. New agents may not understand mailbox lifecycle and status semantics.
2. Turnfile, lock, and revision-token expectations may be applied inconsistently.
3. "Capability" decisions rely on ad-hoc intuition rather than documented criteria.
4. Onboarding can feel exclusive because requirements are not explicit and testable.

## Goal

Define an inclusive, behavior-based onboarding pipeline that:

1. Allows any LLM to participate if it can execute the protocol correctly.
2. Uses protocol-conformance tests instead of model-brand assumptions.
3. Provides a transparent path from candidate to fully active agent.
4. Produces auditable onboarding evidence.

## Non-goals

1. Ranking agents by general intelligence benchmarks.
2. Enforcing vendor-specific requirements.
3. Requiring perfect feature parity across environments.
4. Fully automating onboarding decisions without maintainer approval.

## Users

1. Maintainer: approves onboarding and sets governance boundaries.
2. Candidate agent: follows onboarding tasks and demonstrates conformance.
3. Existing agents: run peer vetting checks and cross-review candidate outputs.

## Requirements

## R1. Onboarding proposal packet

Onboarding starts with a maintainer-approved packet that includes:

1. Candidate identifier (agent name/id).
2. Declared environment constraints.
3. Supported file/tool capabilities.
4. Proposed role scope (`observer`, `agent`, or constrained role).
5. Designated onboarding evaluator(s).

## R2. Minimum conformance capabilities

Candidate must demonstrate ability to execute core protocol behaviors:

1. Parse and update markdown control-plane artifacts without breaking structure.
2. Follow mailbox lifecycle semantics from PRD-003/004.
3. Use revision-token and payload envelope discipline from PRD-008/009.
4. Follow shared-file mutation safety rules from PRD-010.
5. Read/write Turnfile coordination state per PRD-013 ownership boundaries.
6. Follow explicit-invocation governance boundaries from PRD-012.

## R3. Vetting test suite (behavior-based)

Qualification uses scenario tests, not intelligence scoring:

1. **Mailbox scenario:** correctly process one inbound request through `acknowledged` or `actioned` state with valid Ack.
2. **Shared-file scenario:** perform a controlled update with lock/transaction semantics and no invariant drift.
3. **Turnfile scenario:** claim/update/release a task/lock cycle correctly.
4. **Handoff scenario:** produce one payload-first review response with revision token lineage.

Each scenario must have pass/fail criteria and artifact evidence.

## R4. Skills artifact policy

Presence of a skills file is required but not sufficient:

1. Candidate must provide skills/instructions for its runtime environment.
2. Skills content must pass behavioral evidence checks from R3.
3. Divergence from repository-canonical semantics requires explicit review.

## R5. Onboarding states

Candidate progresses through explicit onboarding states:

1. `proposed`
2. `in_vetting`
3. `provisional` (may contribute with constrained scope)
4. `active`
5. `paused` or `removed` (if later governance requires)

State transitions require maintainer decision and Turnfile update.

Turnfile mapping guidance for onboarding states:
- `paused` maps to Turnfile `blocked` when temporary.
- `paused` maps to Turnfile `offline` when indefinite.

## R6. Provisional participation constraints

While `provisional`, candidate must:

1. Work on bounded tasks only.
2. Require peer review on substantive protocol edits.
3. Avoid maintainer-critical control-plane mutations without explicit approval.

## R7. Failure and remediation path

If a candidate fails a scenario:

1. Record failure reason and evidence.
2. Provide remediation guidance.
3. Allow re-test after remediation.
4. Escalate to maintainer for decision if repeated failures persist.

The default posture is inclusive retry, not one-strike exclusion.

## R8. Onboarding audit trail

Onboarding events must be audit-visible:

1. Decision records in WORKLOG.
2. Coordination status in Turnfile agent registry.
3. Supporting evidence references in mailbox or linked artifacts.

## Proposed workflow

1. Maintainer approves onboarding packet (R1).
2. Candidate completes conformance scenarios (R2/R3).
3. Evaluators review evidence and issue pass/fail outcomes.
4. Maintainer sets candidate state (`provisional` or `active`) in Turnfile (R5).
5. Candidate enters normal protocol workflow under applicable constraints.

## Acceptance criteria

1. At least one candidate onboarding run is executed with explicit scenario evidence.
2. Pass/fail decisions can be explained with protocol-behavior criteria.
3. No onboarding decision relies on model-brand or benchmark-only rationale.
4. Turnfile agent state transitions are consistent with maintainer decisions.

## Risks

1. Overly strict tests may unintentionally reduce inclusivity.
2. Overly loose tests may admit agents that create protocol drift.
3. Manual vetting overhead could slow onboarding throughput.

## Dependencies

1. PRD-003 message lifecycle.
2. PRD-007 trust and provenance layer (onboarding evidence as governance input).
3. PRD-008 cross-sandbox handoff envelope.
4. PRD-009 reconciliation workflow.
5. PRD-010 shared-file lock/transaction semantics.
6. PRD-012 skill invocation and safety policy.
7. PRD-013 Turnfile agent/task/lock model.

## Milestones

1. M0: Draft PRD-015.
2. M1: Define first onboarding scenario fixtures.
3. M2: Run one pilot candidate through `proposed -> provisional`.
4. M3: Evaluate overhead and adjust scenario scope.
5. M4: Decide canonical adoption path.

## Open questions

1. ~~**OQ-047:** Should provisional onboarding require both peer evaluators or is one sufficient during pilot?~~ **Resolved:** One peer evaluator is sufficient during pilot.
2. ~~**OQ-048:** Should onboarding test fixtures live under `inception/` only during pilot or move immediately to canonical `docs/` test assets?~~ **Resolved:** Move immediately to canonical `docs/` test assets.

Tracked in: `inception/OPEN_QUESTIONS.md`.

## Exit criteria for moving beyond inception draft

1. At least one onboarding cycle completes with clear evidence and maintainer decision.
2. Existing agents agree the vetting criteria are inclusive and operationally useful.
3. Maintainer confirms confidence in admitting new agents increased.
