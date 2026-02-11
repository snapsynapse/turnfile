# PRD-001: Maintainer Interaction Model

Status: Actioned (promoted to docs/prds, session 12)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08  
Last revised: 2026-02-11 (promotion gate passed; moved to docs/prds)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | consolidation follow-through complete after Claude amendments in MSG-20260211-011 |
| Claude acceptance | accepted | MSG-20260211-011 review: APPLY with amendments (applied) |
| Maintainer acceptance | accepted (conditions satisfied) | MSG-20260211-012 `approve-with-conditions`; Codex/Claude review evidence now logged |
| Eligible for move to `docs/prds` | yes | all three acceptances logged; zero blockers in `working-session/docs/PRD_STATUS.json` |

## Alignment Reference

This PRD aligns with:

1. `docs/prds/PRD-003-message-lifecycle-sla-contract.md`
2. `docs/prds/PRD-004-maintainer-decision-contract.md`
3. `working-session/docs/PRD-018-maintainer-approval-authority-matrix-contract.md`
4. `working-session/docs/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`

## Problem

Maintainer-directed asks and approvals are currently possible in mailbox artifacts, but the interaction model is still underspecified. The result is uneven message quality, inconsistent decision traces, and avoidable ambiguity about whether work may proceed.

Observed failure modes:

1. Requests to Maintainer are posted without a crisp decision ask.
2. Similar approval situations are represented with different message structure.
3. Chat-originated Maintainer decisions are not always mirrored before execution.
4. Escalations are sometimes implicit rather than explicitly recorded.

## Goal

Define a maintainer interaction model that:

1. Keeps decision traffic in mailbox/worklog as the canonical lane.
2. Makes Maintainer-required items obvious in operational views.
3. Standardizes direct Maintainer responses in message cards.
4. Preserves auditable decision lineage from request through closure.

## Non-goals

1. Replacing chat interfaces or editor workflows.
2. Adding real-time push transport infrastructure.
3. Defining model-specific behaviors outside protocol contracts.

## Users

1. Maintainer (human): needs fast triage and low-friction reply mechanics.
2. Agents (Codex/Claude/future): need deterministic handling of Maintainer decisions.

## Requirements

## R1. Maintainer Routing Contract

Messages requesting Maintainer action must include:

1. `To: Maintainer`
2. `Type: decision-required` (use `approval-required` only as a constrained decision-required subtype during pilot)
3. `Priority: P0|P1|P2`
4. `Response needed by: <timestamp or session cycle>` (aligns with PRD-003 R3 and PRD-004 R2 canonical field name)
5. `Related: <message/task/prd/worklog id>`
6. Explicit decision ask (`apply`, `counter`, `approve`, `defer`, or equivalent)

These are the **routing-critical minimum** fields for Maintainer-directed messages. The full required shape for `decision-required` messages (including `Date`, `From`, `Status`, `Subject`, `Context`, `Decision needed`, `Options`, `Recommended`, `If delayed`) is defined in PRD-004 R2 and applies in addition to these routing fields.

## R2. Maintainer Visibility Contract

Mailbox operational view must expose:

1. Maintainer unread count in inbox snapshot.
2. Open queue entries for messages addressed to Maintainer.
3. Clear marker semantics for Maintainer-required items (current compact-card fields; JSON projection hooks may be added later).

## R3. Direct Maintainer Reply Pattern

For any Maintainer-directed message:

1. Set `Status` to `acknowledged`, `actioned`, or `closed`.
2. Add one `Ack` line with actor, date, and decision summary.
3. Optionally add structured `Reply` bullets:
   - `Decision:`
   - `Scope:`
   - `Conditions:`
   - `Next owner:`
4. If decision is final/substantive, record or update WORKLOG decision index entry.

## R4. Escalation Semantics

1. Expired P0 `decision-required` items escalate to WORKLOG and mailbox follow-up.
2. Conflicting agent interpretations escalate to Maintainer via decision-required message.
3. Escalation owner defaults to sender; Maintainer remains final authority per PRD-004.
4. Authority boundary defaults follow PRD-018 launch rule: all changes Maintainer-gated unless explicitly unlocked.

## R5. Chat-to-Mailbox Mirroring

If a Maintainer decision is made in chat:

1. Post a mailbox mirror record before execution.
2. Include decision type, scope reference, and approver identity.
3. Keep the mirror lightweight but parseable by mailbox tooling.
4. Minimum viable mirror record spec is defined in PRD-019 R4.1 (`notify` type, required card fields, `Chat decision mirror` subject convention).

## R6. Context Retention Discipline

1. Operational mailbox remains compact/newest-first.
2. Long-form history remains in archive artifacts.
3. Message IDs stay stable across compact and archive forms.

## Canonical Workflow

1. Agent posts Maintainer-directed message card with explicit decision ask.
2. Maintainer reviews open queue and responds in-card.
3. Agent applies decision and posts follow-through status.
4. Final decisions are indexed in WORKLOG.
5. Thread is closed after follow-through is complete.

## Acceptance Criteria

1. Maintainer can respond directly in mailbox without ambiguity for at least 3 real messages.
2. No Maintainer-directed decision thread remains unowned due to missing required fields.
3. Final Maintainer decisions are reconstructable from mailbox + WORKLOG.
4. Chat-originated Maintainer decisions are mirrored before execution.

## Risks

1. Over-structuring could slow lightweight decisions.
   Mitigation: keep required fields minimal and parseable.
2. Inconsistent status transitions could drift queue accuracy.
   Mitigation: enforce mailbox invariants in validation steps.
3. Mirror records could diverge from source decisions.
   Mitigation: require scope + approver identity in every mirror.

## Open Questions

1. ~~Should `approval-required` be a permanent message type in canonical docs, or a subtype of `decision-required`?~~ **Resolved:** keep as constrained `decision-required` form during pilot; formalization deferred pending evidence.
2. ~~Do we enforce absolute timestamps (`ISO-8601`) for all due fields in pilot?~~ **Resolved:** no; session-relative due values are valid in pilot.
3. ~~Should maintainer replies require a minimum template snippet (for consistency)?~~ **Resolved:** yes, use the PRD-004 structured template pattern for guardrailed decisions.

## Implementation Plan (Working Session)

1. Align mailbox message examples with R1-R5 contracts.
2. Run one review cycle using this structure (`apply-or-counter` + decision mirror).
3. Capture evidence links in `working-session/docs/PRD_STATUS.json`.
4. Promote to `docs/prds` after Codex/Claude/Maintainer acceptance and zero blockers.
