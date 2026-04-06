# PRD-001: Maintainer Interaction Model

Status: Draft (inception)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | not yet logged |
| Claude acceptance | pending | not yet logged |
| Maintainer acceptance | pending | not yet logged |
| Eligible for move to `docs/prds` | no | blocked until all three acceptances + zero blockers in `inception/docs/PRD_STATUS.json` |

## Problem

The protocol now supports agent-to-agent messaging in `MAILBOX.md`, but maintainer-directed questions are not yet explicit enough for low-friction direct response by the human maintainer. This creates uncertainty about how to respond and when a request is truly blocking.

## Goal

Define a clear, lightweight maintainer-interaction model that:

1. Keeps maintainer questions in the same mailbox/worklog system used by LLM agents.
2. Makes maintainer-required items obvious at a glance.
3. Provides a simple, repeatable in-file response pattern for direct maintainer replies.
4. Preserves full auditability in markdown.

## Non-goals

1. Replace all chat/UI interfaces immediately.
2. Add real-time push transport.
3. Introduce private channels.

## Users

1. Maintainer (human): needs fast triage and clear reply mechanics.
2. Agent (Codex/Claude/others): needs deterministic handling of maintainer decisions.

## Requirements

## R1. First-class maintainer routing

Mailbox messages addressed to maintainer must use:

- `To: Maintainer`
- `Type: decision-required` or `Type: approval-required`
- `Priority: P0|P1|P2`
- `Response needed by: <time or cycle>`
- `Related: <proposal/worklog/message id>`

## R2. Maintainer-required visibility

Mailbox operational view must expose:

1. Maintainer unread count in inbox snapshot.
2. Open queue filterability by `To=Maintainer`.
3. Visual marker for maintainer-required items (e.g. `Needs Maintainer` tag in summary text and JSON projection field in later phase).

## R3. Direct maintainer reply pattern

For any message directed to maintainer, direct response uses:

1. Update `Status` to `acknowledged`, `actioned`, or `closed`.
2. Add an `Ack` line with actor/date/decision.
3. Optional `Reply` bullets for decision details.
4. If decision is final, add/update corresponding WORKLOG decision record and include reference in `Related` or `Reply`.

## R4. Escalation semantics

1. Expired `decision-required` or `approval-required` P0 message escalates to WORKLOG.
2. Escalation owner defaults to sender; maintainer is fallback.

## R5. Token-efficient context retention

1. Operational mailbox remains compact (newest-first queue + message cards).
2. Long-form details remain in archive.
3. Message IDs remain stable across compact view and archive.

## Proposed workflow

1. Agent posts maintainer-targeted message card.
2. Maintainer reviews `Open Queue` (newest-first).
3. Maintainer responds directly in message card (`Status` + `Ack` + optional `Reply`).
4. Agent marks follow-up completion (`actioned`/`closed`) after applying decision.
5. Decision appears in WORKLOG index for milestone-grade items.

## Acceptance criteria

1. Maintainer can respond directly in mailbox without ambiguity on at least 3 real messages.
2. No maintainer-targeted message remains unowned because of unclear protocol fields.
3. All maintainer final decisions have WORKLOG references.
4. Reviewers can reconstruct decision flow from mailbox + worklog without chat logs.

## Risks

1. Over-structuring may increase message-writing overhead.
2. If status transitions are not consistently applied, queue accuracy degrades.
3. Relayed messages may blur authorship unless explicitly marked.

## Open questions

Open-question disposition:

1. ~~Should `approval-required` be a permanent message type in canonical docs, or a subtype of `decision-required`?~~ **Resolved:** keep as constrained `decision-required` form during pilot; formalization deferred pending evidence.
2. ~~Do we enforce absolute timestamps (`ISO-8601`) for all due fields in pilot?~~ **Resolved:** no; session-relative due values are valid in pilot.
3. ~~Should maintainer replies require a minimum template snippet (for consistency)?~~ **MAINTAINER = Yes to proposed template in PRD-004 R4:** 
   1. **Example A (simple approval, low risk):** Ack-only reply.
      `Maintainer | 2026-02-08 | scope accepted | approved`
      Use when request is clear, bounded, and no extra guardrails are needed.
   2. **Example B (approval with guardrails):** Ack + structured `Reply` bullets.
      `Decision: approve option 2`
      `Scope: update PRD-004 R2 only`
      `Conditions: keep PRD-003 lifecycle unchanged`
      `Next owner: Codex`
      Use when approver intent must be explicit to avoid interpretation drift.
   3. **Example C (deferred):** Ack + required unblock condition.
      `Maintainer | 2026-02-08 | waiting on examples | deferred`
      `Unblock condition: provide 2 worked examples with before/after message cards`
      Use when decision quality depends on additional evidence.

## Implementation plan (inception)

1. Update notification protocol draft with maintainer-specific rules.
2. Update mailbox compact format to include explicit maintainer marker convention.
3. Run one full cycle with direct maintainer replies.
4. Promote to canonical `docs/` if stable across at least two sessions.
