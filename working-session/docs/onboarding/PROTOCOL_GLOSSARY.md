# Turnfile Protocol Glossary

Status: Draft onboarding support material
Owner: Maintainer + onboarding evaluators
Date: 2026-06-18

## Purpose

This glossary gives onboarding candidates stable meanings for Turnfile coordination terms. It is descriptive onboarding support, not a replacement for the promoted PRDs or active protocol skills. If this file conflicts with a promoted PRD, the promoted PRD wins.

Gemini language-compatibility probe: `MSG-20260617-065`.

## Mailbox containers

| Term | Meaning | Notes |
|---|---|---|
| Inbox Snapshot | The count of currently unread messages per participant, plus oldest unread pointer and response target. | Derived from Active Messages. Must match validator expectations. |
| Open Queue | A compact index of active non-terminal messages that may still need attention, closure, or explicit deferral. | `actioned` messages can remain here until the closure owner closes or defers them. |
| Active Messages | The full current message cards that are not archived into the Closed Summary or mailbox archive. | Newest first. |
| Closed Summary | Compact record of resolved/archived threads. | Should contain terminal cards only. |
| Mailbox Archive | Full historical storage for older closed cards. | Used after compaction. |

## Message lifecycle status

| Term | Meaning | Who can set it |
|---|---|---|
| `unread` | Recipient has not yet processed the card. | Sender when creating a delivery card. |
| `acknowledged` | Recipient has read and understood the card, but has not completed the requested action. | Recipient. |
| `actioned` | Recipient completed its side of the requested work or review. | Recipient. |
| `blocked` | Recipient cannot proceed without a dependency, decision, or unavailable capability. | Recipient. |
| `closed` | Closure owner has resolved the thread and no further mailbox action is expected. | Closure owner, usually sender or Maintainer. |
| `deferred` | Work is intentionally postponed with a reason and next owner. | Closure owner or authorized coordinator, depending on thread. |

## Terminality

| Term | Meaning | Why it matters |
|---|---|---|
| Terminal | The thread is safe to remove from Active Messages and preserve only in summary/archive. | `closed` is terminal. `actioned` is not terminal by itself. |
| Non-terminal | The thread still belongs in Active Messages or Open Queue. | `unread`, `acknowledged`, `blocked`, and normally `actioned` are non-terminal. |
| Archivable | The message can be moved to Closed Summary or archive without hiding unresolved work. | Requires terminal status or an explicit archival rule. |
| Closure owner | The participant responsible for closing or deferring the thread after responses are complete. | Often the sender. Receiver-side completion does not automatically close sender-owned cards. |
| Closure-owner sweep | A shutdown or turn-boundary scan of own-sent cards for peer replies, `actioned` status, unresolved counters, or closure duties. | Prevents active cards from accumulating after receivers have finished. |

## Message mode

| Term | Meaning | Effect |
|---|---|---|
| `delivery-mirror` | A card intended to notify recipients and collect acknowledgment or response. | Creates unread delivery and remains active until resolved. |
| `audit-mirror` | A closed-on-posting record of a decision or fact that does not request recipient action. | Does not create unread delivery. |

## Request and review outcomes

| Term | Meaning |
|---|---|
| `ack` | Confirm receipt or agreement without performing a larger action. |
| `apply` | Accept the request or review item as written. |
| `apply-with-counters` | Accept the direction but require named changes before final acceptance. |
| `counter` | Do not accept as written; propose a different requirement, wording, or implementation path. |
| `decline` | Refuse the request with reason. |
| `defer` | Postpone with reason, next owner, and reconsider trigger. |

## Closeout and compaction

| Term | Meaning |
|---|---|
| Session close | The agent shutdown path that leaves durable handoff state for the next session. |
| Clean close | Closeout with no unread messages for the closing agent, no unresolved own closure duties, no stale locks, projection state fresh, and validators clean or explicitly deferred. |
| Unified closeout compaction set | PRD-014 A1 closeout work: worklog compaction, signal-log compaction, mailbox archival movement, worklog/boot archive, and heartbeat lifecycle inspection. |
| Projection sync | Regenerating derived artifacts and verifying they match sources, especially `MAILBOX.json` and Turnfile revision state. |
| Heartbeat lifecycle inspection | Closeout check for active heartbeat automations: deleted, updated, intentionally carried forward, or not applicable. |

## Turnfile coordination

| Term | Meaning |
|---|---|
| Task claim | An agent marks a task as owned or in progress under the Turnfile rules. |
| Signal | Lightweight coordination note in `TURNFILE.yaml`, such as `ready`, `yield`, `blocked`, or `handoff`. |
| Lock | Revision-scoped protection for shared-file mutation. |
| Revision | Monotonic coordination counter used to detect stale writes and order coordination changes. |
| Peer-owned file | A file assigned to another agent's ownership boundary. Read-only unless the Maintainer explicitly authorizes otherwise. |

## Candidate language-compatibility check

Onboarding candidates should be asked to report:
1. Which terms they can use exactly as written.
2. Which terms are ambiguous in their runtime or instruction surface.
3. Which terms need aliases or examples.
4. Which lifecycle options they can safely emit as exact protocol field values.
5. Which terms they should avoid in user-facing prose to prevent accidental authority or hidden state assumptions.
