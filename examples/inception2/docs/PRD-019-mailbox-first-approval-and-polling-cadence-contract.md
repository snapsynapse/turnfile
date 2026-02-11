# PRD-019: Mailbox-First Approval and Polling Cadence Contract

Status: Draft (working-session; not yet actioned)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-02-11

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | — |
| Claude acceptance | pending | — |
| Maintainer acceptance | pending | — |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

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

Agents must check mailbox at defined events:

1. Session start (before substantive edits).
2. Before executing a proposed change.
3. After posting a proposal.
4. Before declaring turn complete.

## R3. Time-based polling (optional/pilot)

Define an optional time-based cadence mode with explicit tradeoffs, including:

1. Suggested interval.
2. Conditions when polling may be skipped.
3. Escalation when polling misses SLA.

## R4. Chat-to-mailbox mirroring

When decisions occur in chat, a mailbox summary record must be posted before execution proceeds.

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
| OQ-054 | What default time-based interval (if any) balances responsiveness and overhead? | pending | R3 |
| OQ-055 | Should time-based polling be manual checklist only, or supported by automation/tooling hooks? | pending | R3 |
