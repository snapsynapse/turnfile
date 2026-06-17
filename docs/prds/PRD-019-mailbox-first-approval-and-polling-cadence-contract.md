# PRD-019: Mailbox-First Approval and Polling Cadence Contract

Status: Accepted (Maintainer, 2026-06-12, session 14)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-06-12 (session 14: OQ-054/055 resolved — no time-based polling)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260211-010 mirror-field counter resolved and accepted by Codex |
| Claude acceptance | accepted | MSG-20260211-010 amendment pass submitted by Claude |
| Maintainer acceptance | accepted | Maintainer decision 2026-06-12 (session 14 triage): accept; coordination stays asynchronous and event-based, no time-based polling layer |
| Eligible for move to `docs/prds` | yes | all acceptances recorded; OQ-054/055 resolved |

## Input Provenance Tags

1. `explicit`: Mailbox should become default channel for collaboration and approvals.
2. `explicit`: Event-based mailbox checks are required.
3. `needs clarification`: Time-based cadence is likely useful but design and implications are undecided.

## Alignment reference

This PRD aligns with:

1. `docs/prds/PRD-003-message-lifecycle-sla-contract.md`
2. `docs/prds/PRD-008-cross-sandbox-handoff-contract.md`
3. `docs/prds/PRD-011-session-resumption-contract.md`
4. `working-session/docs/PRD-017-boot-sequence-commands-and-documentation-contract.md`

## Problem

Coordination is split between mailbox artifacts and transient chat, which reduces auditability and can create approval ambiguity.

## Goal

Make mailbox-first communication the default coordination lane with deterministic event triggers and an optional time-based polling layer.

## Non-goals

1. Eliminating chat usage entirely.
2. Requiring external scheduling infrastructure for polling.
3. Replacing message lifecycle semantics from PRD-003.

## Requirements

## R1. Mailbox-first default

Substantive requests, approvals, counters, and execution confirmations must be recorded in `working-session/MAILBOX.md`.

## R2. Event-based polling (required)

Agents must check mailbox at defined events. These map to the Maintainer's canonical 4-step workflow:

### R2.1 Canonical mailbox check events

| Step | Event | Actor | Purpose |
|------|-------|-------|---------|
| 0 | Session start | All agents + Maintainer | Read mailbox before substantive edits. Ensures awareness of pending requests, approvals, and blockers. |
| 1 | Before executing a proposed change | Executing agent | Confirm no counter or override has arrived since proposal was posted. |
| 2 | After posting a proposal | Proposing agent | Verify message was correctly recorded and inbox counts updated. |
| 3 | Before declaring turn complete | All agents | Ensure own unread count is 0. Final clearance check. |

### R2.2 Maintainer workflow mapping

The Maintainer's interaction pattern maps to these events as:

1. **Step 0:** Read mailbox at session start — triage unread messages.
2. **Step 1:** Review/approve/counter agent proposals — respond in message cards.
3. **Step 2:** Propose new action via mailbox message and wait for agent response.
4. **Step 3:** Periodically check mailbox for agent follow-through and new proposals.

## R3. Time-based polling (resolved: not adopted)

**Resolved (OQ-054/055, Maintainer, 2026-06-12):** Turnfile coordination is asynchronous and event-based only. No time-based polling cadence is defined. Rationale: agents are stateless and session-bounded; SLAs are already measured in session boundaries (PRD-003), so a wall-clock polling layer adds overhead without improving responsiveness. The R2 event triggers are the complete polling contract.

This satisfies acceptance criterion 2 via the explicit-defer path. If a future deployment introduces long-lived or scheduled agents, time-based cadence may be re-proposed as a new PRD.

## R4. Chat-to-mailbox mirroring

When decisions occur in chat, a mailbox summary record must be posted before execution proceeds.

### R4.1 Minimum viable mirror record

Chat-originated decisions are mirrored as a `notify` message with:

- **Subject:** `Chat decision mirror — <brief description>`
- **Type:** `notify`
- **Mode:** `audit-mirror` or `delivery-mirror`
- **Required content:**
  1. Decision type (approval, rejection, direction, scope change).
  2. Scope reference (affected PRDs, files, tasks, or OQs).
  3. Approver identity (which participant made the decision).
- **Required card fields** (minimum for mailbox parsing/invariants): `From`, `Date`, `Type`, `Priority`, `Status`, `Subject`.
- **Not required:** Full MSG envelope fields like review scope, closure owner, response-needed-by. The mirror is a lightweight audit record, not a review request.

### R4.2 Evidence

MSG-20260211-007 (PRD-015/016 approval mirror) serves as the reference implementation for this pattern.

### R4.3 Mirror delivery modes

PRD-022 splits chat-decision mirrors into two modes:

1. `audit-mirror`: a closed-on-posting record for decisions that bind no peer's future work and require no delivery lifecycle.
2. `delivery-mirror`: a lifecycle-delivered record for decisions that bind a peer's future work. It is posted unread to affected participants, acknowledged by receivers, and closed after all acknowledgments or a recorded SLA lapse.

A mirror without a declared mode is treated as `delivery-mirror` for safety. Guarantees are session-turn based, not wall-clock based.

## R5. Audit evidence minimums

For each approval/counter event, include:

1. Decision type.
2. Scope reference (files/PRDs/tasks).
3. Approver identity and timestamp.

## Acceptance criteria

1. Event-based triggers are codified and reflected in boot/skill docs.
2. At least one approved path exists for time-based cadence (or explicit defer decision).
3. A sample run demonstrates complete decision trace in mailbox without missing approvals.
4. Chat-originated decisions are mirrored in mailbox with no ambiguity.

## Risks

1. Excessive polling can create noise.
   Mitigation: event triggers are mandatory; time-based remains optional until tuned.
2. Strict mailbox gating may slow low-risk iteration.
   Mitigation: authority matrix (PRD-018) can define fast lanes.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-054 | What default time-based interval (if any) balances responsiveness and overhead? | **resolved** | R3 — None. No time-based polling; event-based triggers only. (Maintainer, 2026-06-12.) |
| OQ-055 | Should time-based polling be manual checklist only, or supported by automation/tooling hooks? | **resolved** | R3 — Moot: time-based polling not adopted. (Maintainer, 2026-06-12.) |
