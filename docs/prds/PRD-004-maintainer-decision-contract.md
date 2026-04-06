# PRD-004: Maintainer Decision Contract

Status: Finalized (inception) — agent-reconciled, maintainer open questions resolved
Owner: Codex (draft) + Claude (review + finalization) + Maintainer
Date: 2026-02-08
Last revised: 2026-02-08 (maintainer OQ resolution: malformed handling, relay quotes, timestamp flexibility)

## Problem

Maintainer-directed messages exist in the mailbox, but the decision payload and reply shape are still too loose. This creates avoidable ambiguity about what decision is required, what options were considered, what was approved, and whether the final decision was properly recorded in the WORKLOG decision index.

## Goal

Define a strict, lightweight contract for maintainer decisions that:

1. Standardizes when and how agents ask for maintainer decisions.
2. Makes maintainer replies deterministic and easy to apply without reinterpretation.
3. Ensures every finalized maintainer decision is traceable from mailbox to WORKLOG.
4. Preserves human-readable auditability in markdown-first workflows.

## Non-goals

1. Redefine global message lifecycle semantics (`unread|acknowledged|actioned|closed`) owned by PRD-003.
2. Replace WORKLOG as the canonical record for final decisions.
3. Introduce private or out-of-band maintainer channels.
4. Build a UI editor for decisions (this is separate from PRD-002 viewer scope).

## Users

1. Maintainer (human): needs fast, low-ambiguity decision mechanics.
2. Sender agent: needs clear contract for decision requests and escalation.
3. Implementing agent: needs unambiguous, actionable decision output.
4. Auditor/reviewer: needs complete provenance from request to final logged decision.

## Requirements

## R1. Decision-eligible message contract

Maintainer-directed requests are required when at least one condition is true:

1. Action is in governance Band C (approval required).
2. Agent tie-break is needed after conflict-resolution steps.
3. Lane reassignment or shared-contract override is proposed.
4. Risk is irreversible or security-sensitive and cannot proceed safely under current charter.

Messages that are informational or routine implementation details must not be promoted to maintainer decision requests.

## R2. Required maintainer-request shape

Any message with `To: Maintainer` and type `decision-required` or `approval-required` must include:

1. Core fields: `Date`, `From`, `To`, `Type`, `Priority`, `Related`, `Context`, `Response needed by`, `Status`, `Subject`.
2. `Decision needed:` one-sentence binary or bounded choice question.
3. `Options:` 2-4 explicit options, each with one-line impact.
4. `Recommended:` sender recommendation with one-line rationale.
5. `If delayed:` explicit impact of no decision before due time.

If lifecycle typing has not yet formalized `approval-required`, sender must use `decision-required` and include the same decision payload requirements above.

<!-- REV-20260208-prd004-maintainer-oq: malformed handling clarified per maintainer decision OQ-008 -->

If these fields are missing, the message is considered malformed for decision routing. Malformed requests are **accepted with a required-fix warning** — the receiver acknowledges the message, notes the missing fields in the `Ack` line, and the sender must correct the message before the maintainer triages the decision. Malformed requests are not auto-rejected.

## R3. Due and priority semantics alignment

<!-- REV-20260208-prd004-maintainer-oq: absolute timestamp not required per maintainer decision OQ-007 -->

Maintainer decision requests must align to lifecycle/SLA rules defined in PRD-003:

1. `Priority` determines urgency class (`P0|P1|P2`).
2. `Response needed by` must be explicit and non-ambiguous for the current session context. Absolute ISO-8601 timestamps are accepted but **not required** — session-relative values (`next session`, `this session`) are valid.
3. Expired decisions trigger escalation behavior defined in R6.
4. PRD-003 remains the owner of generic status transition rules; PRD-004 only constrains maintainer decision usage.

## R4. Maintainer reply template

Maintainer replies in mailbox must use a deterministic reply pattern:

1. Update `Status` to `acknowledged`, `actioned`, or `closed`.
2. Add `Ack` line:
3. `<Maintainer actor> | <date> | <reason> | <approved|rejected|deferred|needs-revision>`.
4. For non-trivial decisions, include `Reply` bullets:
   - `Decision:` final choice.
   - `Scope:` what is explicitly in/out.
   - `Conditions:` preconditions or guardrails before execution.
   - `Next owner:` who executes the decision next.

If disposition is `deferred` or `needs-revision`, reply must include the unblock condition.

## R5. Mandatory WORKLOG linkage

A maintainer decision is not complete until linked into WORKLOG:

1. Final decisions must have a corresponding WORKLOG decision entry in the same or next WORKLOG cycle.
2. Mailbox reply must reference the WORKLOG decision row/section.
3. WORKLOG decision entry must reference the originating mailbox message ID.
4. If a decision was relayed by another agent, authorship and relay attribution must be explicit.

## R6. Escalation for overdue or blocked decisions

Escalation rules for maintainer decisions:

1. Sender owns escalation for overdue `P0` or expired decision-required items.
2. Maintainer is fallback escalator if sender is unavailable.
3. Escalation is posted to WORKLOG with: message ID, age/urgency, blocked work, risk if unresolved, and safe default action.
4. While escalated and unresolved, agents must not execute irreversible work dependent on that decision.

## R7. Authorship and provenance safeguards

<!-- REV-20260208-prd004-maintainer-oq: relay quote block required per maintainer decision OQ-009 -->

Maintainer decision artifacts must preserve provenance:

1. Message IDs remain stable across compact mailbox and archive.
2. Relay wording must be explicit (`Maintainer (relayed by <agent>)` where applicable).
3. **Relay messages must include an explicit maintainer quote block** — when an agent relays a maintainer decision, the agent must include the maintainer's exact words in a blockquote, clearly separated from the agent's own summary or interpretation. Format: `> Maintainer: "<exact text>"`. This is required for legal/audit traceability.
4. Compression/migration may reformat content but must not alter authored meaning.
5. Any correction after final decision must be additive (new decision note), not silent mutation.

## Proposed workflow

1. Sender identifies a decision-eligible condition (R1).
2. Sender posts maintainer request card using required payload (R2).
3. Maintainer triages by priority and due semantics (R3).
4. Maintainer responds with deterministic template (R4).
5. Next owner executes decision or responds with revision request.
6. Final decision is linked into WORKLOG decision index (R5).
7. If overdue/unresolved, sender escalates per R6.

## Coordination plan with PRD-003 (Claude)

Because PRD-003 is being drafted in parallel, integration will use this split:

1. PRD-003 ownership: lifecycle states, due/SLA semantics, stale-message policy.
2. PRD-004 ownership: decision payload shape, maintainer reply template, mailbox-to-WORKLOG linkage.
3. Merge rule: if terms overlap, PRD-003 defines generic lifecycle behavior; PRD-004 adds maintainer-specific constraints.
4. Cross-review checkpoint: once PRD-003 draft exists, run a joint diff checklist for field names, status transitions, and escalation triggers.
5. Finalization order: settle PRD-003 lifecycle terms first, then lock PRD-004 template wording to avoid drift.

## Acceptance criteria

1. Three real maintainer decision requests can be completed without ad hoc clarifications.
2. Each final decision has bidirectional references between mailbox message ID and WORKLOG decision entry.
3. No overdue `P0` maintainer decision remains un-escalated.
4. Reviewers can reconstruct full decision flow from mailbox + WORKLOG only.

## Risks

1. Over-specification may increase sender overhead for low-stakes decisions.
2. Divergence risk if PRD-003 lifecycle terms change after PRD-004 template adoption.
3. Inconsistent relay attribution can still weaken provenance if not enforced.
4. Decision fatigue for maintainer if Band C boundary is too broad.

## Dependencies

1. PRD-001 maintainer interaction model baseline semantics.
2. PRD-003 message lifecycle + SLA contract (parallel draft by Claude).
3. `working-session/NOTIFICATION_PROTOCOL.md` mailbox card structure and escalation rules.
4. `docs/HUMAN_GOVERNANCE.md` approval-band policy.

## Milestones

1. M0 (same day): align PRD-003/004 boundary and shared terminology.
2. M1 (1 day): update notification protocol with maintainer decision payload + reply template.
3. M2 (1 day): run pilot on at least 3 maintainer decisions and log WORKLOG linkage.
4. M3 (post-pilot): decide canonical promotion path from `working-session/` to `docs/`.

## Open questions

All open questions have been resolved by maintainer decision:

1. ~~Should `approval-required` be formalized as a first-class type or remain a constrained form of `decision-required`?~~ **Resolved: Remain constrained.** `approval-required` stays as a constrained form of `decision-required`. Use `decision-required` with the same R2 payload requirements. Formalization deferred until pilot evidence. (Also OQ-001.)
2. ~~Do we require absolute timestamp format for `Response needed by`?~~ **Resolved: No.** Session-relative values (`next session`, `this session`) are valid. ISO-8601 timestamps are accepted but not mandated. Applied to R3. (Also OQ-002/OQ-007.)
3. ~~Should malformed decision requests be auto-rejected or accepted with a required-fix warning?~~ **Resolved: Accept with warning.** Malformed requests are acknowledged with a required-fix note; sender must correct before maintainer triage. Applied to R2. (Also OQ-008.)
4. ~~Should relay messages require an explicit maintainer quote block?~~ **Resolved: Yes.** Relay messages must include a blockquote with the maintainer's exact words. Applied to R7. (Also OQ-009.)

## Exit criteria for moving beyond inception draft

1. Contract is used successfully in two sessions with no critical ambiguity.
2. PRD-003 and PRD-004 terms are reconciled with no conflicting lifecycle rules.
3. Maintainer confirms decision overhead is acceptable for real workflow cadence.
4. Team agrees wording is stable enough for canonical protocol integration.
