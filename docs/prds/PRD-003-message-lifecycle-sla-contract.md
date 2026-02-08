# PRD-003: Message Lifecycle + SLA Contract

Status: Finalized (inception) — agent-reconciled, maintainer open questions resolved
Owner: Claude (draft + finalization) + Codex (review) + Maintainer
Date: 2026-02-08
Last revised: 2026-02-08 (maintainer OQ resolution: blocked status, SLA tracking, auto-compaction)

## Problem

The notification protocol (v0.2) defines message types, priority tiers, and a compact mailbox format, but does not formalize:

1. **Status transitions** — which transitions are valid and who is authorized to make them.
2. **SLA semantics** — what "Response needed by" actually means (soft target vs. hard deadline vs. escalation trigger).
3. **Stale message handling** — what happens when a message sits unread past its due date.
4. **Lifecycle terminal states** — when a message is truly "done" vs. still requiring follow-up.

Without these rules, agents must infer lifecycle behavior from convention, which breaks down as the number of agents and messages grows. PRD-001 (maintainer interaction model) depends on deterministic lifecycle semantics to define escalation and reply patterns.

## Goal

Define a complete, deterministic message lifecycle contract that:

1. Specifies every valid status transition and who can trigger it.
2. Gives SLA tiers concrete meaning with escalation triggers.
3. Handles stale and abandoned messages without manual intervention.
4. Remains compatible with the existing compact mailbox format.
5. Is simple enough that a new agent can learn it from a single table.

## Non-goals

1. Real-time SLA enforcement (no daemon or cron — agents are stateless).
2. Automated penalty or trust-score changes for SLA violations (that's PRD-007 territory).
3. Changing the canonical markdown format (format changes belong in PRD-005).

## Users

1. **Agents (Codex, Claude, future):** need unambiguous rules for when to ack, when to escalate, and when a message is done.
2. **Maintainer:** needs confidence that nothing silently expires, and clear rules for when escalation lands on their desk.
3. **Auditors/counsel:** need to reconstruct message disposition from the audit trail.

## Requirements

### R1. Status state machine

Define the complete set of valid statuses and transitions:

```
                 ┌──────────────────────────────────────────┐
                 │                                          ▼
  ┌──────────┐   │   ┌──────────────┐   ┌───────────┐   ┌────────┐
  │  unread  │───┼──▶│ acknowledged │──▶│ actioned  │──▶│ closed │
  │          │───┘   │              │   │           │   │        │
  └──────────┘       └──────┬───────┘   └───────────┘   └────────┘
       │                    │  ▲                            ▲  ▲
       │                    │  │                            │  │
       │                    ▼  │                            │  │
       │                 ┌─────────┐                        │  │
       │                 │ blocked │────────────────────────┘  │
       │                 │         │───────────────────────────┘
       │                 └─────────┘ (via actioned or closed)
       │                                                    ▲
       └────────────────────────────────────────────────────┘
```

| From | To | Who | When |
|------|----|-----|------|
| `unread` | `acknowledged` | Receiver | Receiver has read and understands the message |
| `unread` | `actioned` | Receiver | Receiver reads and completes the action in one step |
| `unread` | `closed` | Sender or Maintainer | Message is withdrawn or superseded before receiver sees it |
| `acknowledged` | `actioned` | Receiver | Receiver has completed the requested action |
| `acknowledged` | `blocked` | Receiver | Receiver cannot act until an external dependency is resolved |
| `acknowledged` | `closed` | Sender or Maintainer | Resolved, withdrawn, or superseded |
| `blocked` | `acknowledged` | Receiver | Blocking dependency resolved; receiver can resume |
| `blocked` | `actioned` | Receiver | Blocking dependency resolved and action completed in one step |
| `blocked` | `closed` | Sender or Maintainer | Withdrawn or superseded while blocked |
| `actioned` | `closed` | Sender or Maintainer | Sender confirms the action was sufficient |

<!-- REV-20260208-prd003-maintainer-oq: blocked status added per maintainer decision OQ-004 -->

**Invariants:**
- No backward transitions (a `closed` message cannot reopen; post a new message instead). Exception: `blocked` → `acknowledged` is a forward-resume, not a backward transition.
- Only the receiver can move a message to `acknowledged`, `blocked`, or `actioned`.
- Sender or maintainer can move a message to `closed`.
- Every transition must include an `Ack` line with actor, date, and reason.
- A `blocked` message must include the blocking dependency in its `Ack` line. When the block is resolved, the unblock must also be recorded.

### R2. SLA tiers with concrete semantics

Each priority tier defines a **response window** and an **escalation trigger**:

| Priority | Response window | Escalation trigger | Escalation target |
|----------|----------------|--------------------|-------------------|
| `P0` | Receiver's next available session turn | Not acknowledged by end of receiver's next session turn | WORKLOG + Maintainer |
| `P1` | Next session | Not acknowledged by end of next session | WORKLOG + Maintainer |
| `P2` | Best effort | No automatic escalation | None (sender may manually escalate) |

**Response window** means the message must reach at least `acknowledged` status within the window. Completing the action (`actioned`) may take longer — the SLA covers acknowledgment, not resolution.

**"Session"** means a single agent turn as triggered by the maintainer. Agents are stateless; they cannot count clock time. SLA windows are measured in session boundaries, not wall-clock time.

### R3. Due-date semantics

The `Response needed by` field has three valid forms:

| Value | Meaning |
|-------|---------|
| ISO-8601 timestamp | Hard deadline — escalates if not acknowledged by this time (maintainer enforces, since agents can't see clocks) |
| `next session` | Shorthand for P1 SLA — receiver should acknowledge in their next session |
| `none` | No response expected (used with `notify` type messages) |

If `Response needed by` conflicts with the priority tier's SLA, the **stricter** constraint applies.

`approval-required` messages follow the same lifecycle/SLA rules as `decision-required` unless later specialized by maintainer-approved amendment.

### R4. Stale message handling

A message is **stale** when its SLA window has expired and it has not reached `acknowledged`.

**Stale message protocol:**

1. **Detection:** The sender (or maintainer) checks inbox snapshot at session start. Any message past its SLA window that is still open and `unread` is stale. Messages in `blocked` status are exempt from stale detection while the blocking dependency persists — the block reason serves as the escalation record.
2. **Escalation:** The sender posts a one-line escalation entry in the WORKLOG body (status/escalation section): `Escalated: MSG-<id> — <subject> — receiver did not ack within <SLA tier> window`.
3. **Maintainer notification:** If the stale message is P0 or P1, the maintainer is notified (via a new P0 mailbox message if the maintainer is not the original sender).
4. **Resolution:** The maintainer decides disposition: reassign, re-send, close as superseded, or take action directly.

**Abandoned messages:** If a message remains stale for two full sessions after escalation, the maintainer may close it with disposition `abandoned — no response after escalation`. This is a governance action, not a protocol failure.

### R5. Terminal state semantics

A message reaches terminal state (`closed`) under one of these dispositions:

| Disposition | Terminal? | Meaning | Who can apply |
|-------------|-----------|---------|---------------|
| `resolved` | Yes | Action completed and confirmed | Sender or Maintainer |
| `superseded` | Yes | A newer message replaces this one | Sender or Maintainer |
| `withdrawn` | Yes | Sender retracts the request | Sender |
| `abandoned` | Yes | No response after escalation + 2 sessions | Maintainer only |
| `deferred` | No | Decision postponed; unblock condition specified in Ack | Maintainer only |

Terminal dispositions move the message to `closed`. Non-terminal dispositions (e.g., `deferred`) leave the message in its current status (typically `acknowledged`) with the disposition recorded in the Ack line. The message remains in the Open Queue until a terminal disposition is applied.

The disposition must be recorded in the `Ack` line when closing: `Closed (<disposition>) — <actor> — <date>`. For non-terminal dispositions: `<disposition> — <actor> — <date> — <unblock condition>`.

### R6. Closed-message compaction

<!-- REV-20260208-prd003-maintainer-oq: auto-move rule added per maintainer decision OQ-006 -->

Messages reaching terminal `closed` status should be automatically moved from Active Messages to Closed Summary during the same session in which they are closed. This is the responsibility of the closing actor. The compact one-line entry in Closed Summary must include: message ID, date, from/to, final status, and outcome summary. Full message bodies are preserved in the archive.

### R7. Notify-type exemption

Messages of type `notify` (FYI updates):
- Have no SLA obligation.
- Do not trigger escalation.
- May be closed by anyone.
- Should still be acknowledged as a courtesy, but failure to ack is not a protocol violation.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `inception/NOTIFICATION_PROTOCOL.md` | Extends §5 (delivery semantics) and §6 (response expectations) with formal lifecycle |
| `inception/MAILBOX.md` | No format change — lifecycle is enforced through existing `Status` and `Ack` fields |
| `inception/WORKLOG.md` | Adds escalation entries to WORKLOG body; maintainer final outcomes belong in decision index |
| PRD-001 (maintainer interaction) | Provides the deterministic lifecycle PRD-001 requires for maintainer reply patterns |
| PRD-004 (maintainer decision contract) | Consumes PRD-003 lifecycle/SLA semantics for maintainer-decision messages |
| PRD-007 (trust + provenance) | SLA violations (`sla_missed` events) are tracked as trust signals per maintainer decision (OQ-005) |
| `docs/COMMUNICATIONS_PROTOCOL.md` | Canonical adoption would extend §5 (delivery semantics) with lifecycle rules |

## Acceptance criteria

1. State machine table is unambiguous — given any (current_status, actor, action) tuple, there is exactly one valid outcome or an explicit "not allowed" result.
2. SLA windows are testable — an agent can determine at session start whether any of its sent messages are stale.
3. Stale message protocol produces a WORKLOG entry, not silent expiry.
4. At least one real stale-message scenario is exercised during inception pilot before canonical promotion.
5. Lifecycle rules fit on a single reference card (one table + one state diagram).

## Risks

1. **Over-specification for current scale.** Two agents and one maintainer may not need formal SLA machinery yet. Mitigation: keep the rules simple and defer automated enforcement.
2. **Session-boundary SLA is fuzzy.** If the maintainer runs agent sessions irregularly, "next session" is unpredictable. Mitigation: treat P0 as receiver's next available session turn; P1/P2 remain best-effort by design.
3. **Escalation noise.** If many messages go stale simultaneously, the WORKLOG gets cluttered with escalation entries. Mitigation: batch escalation into a single WORKLOG entry per session.

## Open questions

All open questions have been resolved by maintainer decision:

1. ~~Should the state machine support a `blocked` status?~~ **Resolved: Yes.** Added to R1 state machine. `blocked` is entered from `acknowledged` when receiver cannot act due to external dependency. Exempt from stale detection while blocked.
2. ~~Should SLA violations be tracked as a metric for PRD-007?~~ **Resolved: Yes.** Added to interaction table. PRD-007 R3 will consume `sla_missed` events as trust signals.
3. ~~Should `closed` messages be auto-moved to Closed Summary?~~ **Resolved: Yes (auto-move).** Added as R6 (closed-message compaction). Closing actor moves message to Closed Summary in the same session.

## Implementation plan (inception)

1. Add lifecycle state machine and SLA table to `inception/NOTIFICATION_PROTOCOL.md` (Claude lane, current session).
2. Codex reviews for consistency with PRD-001 and PRD-004 interactions.
3. Exercise one stale-message scenario on a real message during pilot.
4. If stable across two sessions, propose lifecycle rules for canonical `docs/COMMUNICATIONS_PROTOCOL.md`.

## Coordination with Codex (PRD-004)

PRD-003 (this document) and PRD-004 (Maintainer Decision Contract) have a dependency surface:
- PRD-003 defines the lifecycle that all messages follow, including `decision-required` messages.
- PRD-004 defines the specific contract shape, reply templates, and WORKLOG linkage for maintainer decisions.

**Interface contract:** PRD-004 should reference PRD-003's state machine and SLA tiers rather than redefining them. If PRD-004 needs decision-specific lifecycle extensions (e.g., a `deferred` status), those should be proposed back to PRD-003 as amendments.

Codex: please flag any conflicts when reviewing this draft. If PRD-004 needs lifecycle semantics not covered here, post a mailbox message and we'll reconcile before either doc goes to maintainer for approval.
