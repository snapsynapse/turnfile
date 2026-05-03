# Notification Protocol (Draft v0.6)

Date: 2026-02-08  
Status: Active

## Purpose

Enable Codex and Claude to notify each other directly through shared files so the human maintainer does not need to relay routine messages.

## Canonical format choice

- Canonical format is **Markdown** for human readability and low tooling friction.
- XML/JSON may be generated as optional projections for automation, but are not the source of truth.

### JSON projection command

Use the local exporter to generate a machine-readable snapshot:

```bash
node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json
```

## Principles

1. Human-readable, public, and auditable by default.
2. Asynchronous-safe: no assumptions of real-time delivery.
3. Targeted messages with explicit ownership and response expectations.
4. Decisions still recorded in the WORKLOG decision index.
5. Operational mailbox should be compact; full context must remain recoverable.

## Channels

1. `working-session/MAILBOX.md`:
- Operational message queue (newest-first).
- Includes inbox snapshot, open queue, active messages, and closed summary.

2. `working-session/MAILBOX_ARCHIVE.md`:
- Full long-form history.
- Append-only archival record.

3. `working-session/WORKLOG.md`:
- Canonical record for handoffs, decisions, and milestone updates.
- Escalation destination for unresolved mailbox messages.

## Message types

1. `notify`: FYI update, no response required.
2. `request`: asks target to perform an action.
3. `decision-required`: asks target to weigh in before a decision.
4. `objection`: raises disagreement tied to a proposal.
5. `handoff-ready`: indicates work is complete and ready for next owner.

## Message card format (Markdown)

Each active message in `MAILBOX.md` uses this card structure:

```text
### MSG-YYYYMMDD-###

| Field | Value |
|-------|-------|
| Date | <ISO-8601> |
| From | <agent> |
| To | <agent|all> |
| Type | <notify|request|decision-required|objection|handoff-ready> |
| Priority | <P0|P1|P2> |
| Related | <worklog section|proposal id|none> |
| Context | <optional one-line context> |
| Closure owner | <sender|maintainer|none> |
| Review scope | <full|critical-only|interface-only|none> |
| Response needed by | <ISO-8601|none> |
| Status | <unread|acknowledged|actioned|closed> |
| Subject | <short title> |

Summary:
- <compact bullets>

Ack:
- <actor + date + next step>
```

Field requirements:

1. `Closure owner` is required for `request`, `decision-required`, and `objection` messages.
2. `Closure owner` should be `none` for `notify` unless a follow-up closure action is explicitly requested.
3. `Review scope` is required when payload-first review content is included; otherwise set to `none`.

## Layout and ordering rules

1. `MAILBOX.md` keeps **newest messages at top** in both Open Queue and Active Messages.
2. Open items are listed first; closed items are summarized in Closed Summary.
3. Long-form content is moved/preserved in `MAILBOX_ARCHIVE.md`.
4. Archive references must retain message IDs so context is recoverable.

Closed Summary rows use this compact schema:

```text
| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
| MSG-YYYYMMDD-### | YYYY-MM-DD | <sender> -> <receiver> | <closed|actioned|superseded|withdrawn|abandoned> | <short outcome summary> |
```

## Delivery semantics

1. Sender appends new message in newest-first position.
2. Sender increments receiver unread count in Inbox Snapshot.
3. Receiver checks mailbox at session start.
4. Receiver updates message `Status` and `Ack`, then decrements own unread count.
5. Sender (or maintainer fallback) escalates unresolved `P0` or expired `decision-required` messages to `WORKLOG.md`.
6. Optional: regenerate `working-session/MAILBOX.json` after message updates for automation consumers.

## Cross-sandbox handoff rule (payload-first)

When a message asks another agent to review, approve, or reconcile changed content, file-path references alone are not sufficient.

Required in the message body:

1. `Revision` token with checksum (for example: `REV-20260208-prd004-r4-h1a2b3c4`).
2. `Payload format`: `full-text` or `unified-diff`.
3. `Files`: explicit list of affected files.
4. `Review scope`: `full`, `critical-only`, or `interface-only`.
5. `Ask`: explicit request (`apply-or-counter`, `review-only`, or `fyi`).
6. Inline payload block with the actual content being reviewed.
7. Receiver `Ack` must include the same `Revision` token before review comments.

### Payload template snippet

````text
Payload:
- Revision: REV-YYYYMMDD-<short-id>
- Format: <full-text|unified-diff>
- Review scope: <full|critical-only|interface-only>
- Ask: <apply-or-counter|review-only|fyi>
- Files:
  - <path-1>
  - <path-2>

```diff
<inline content or diff>
```
````

### Payload cap and chunking

1. Single payload block cap: **16 KiB or 300 lines** (whichever comes first).
2. Payloads above cap must be chunked with ordered revision suffixes (`-p1ofN`, `-p2ofN`, ...).
3. Receiver must request resend if any chunk is missing.

### Malformed resend escalation

1. First malformed payload response: `acknowledged` with `needs-resend`.
2. One resend attempt is allowed for same revision root.
3. If resend is malformed again, receiver auto-escalates to WORKLOG + Maintainer with risk note.

### Envelope helper command

Use helper generator to produce checksum-bearing envelope text from stdin payload:

```bash
node tools/new-payload-envelope.mjs \
  --topic prd008-update \
  --format unified-diff \
  --scope full \
  --files working-session/docs/PRD-008-cross-sandbox-handoff-contract.md,working-session/OPEN_QUESTIONS.md \
  --seq 01 < payload.diff
```

## Parallel drafting preflight (recommended)

Before starting a parallel PRD or protocol drafting split, post a kickoff message that includes:

1. Owner mapping (`who owns which PRD/file`).
2. Boundary mapping (`in scope` / `out of scope` per owner).
3. Requested action from receiver (`accept`, `counter`, or `propose changes`).
4. Response due marker (`next session` or explicit due field).
5. Revision-token root for follow-up payloads (for example: `REV-20260208-prd005-...`).
6. Interface delta block, even when no conflicts are found.

This prevents scope overlap and reduces reconciliation churn.

### Interface delta block template

Use this block in parallel handoff messages:

```text
Interface delta:
- Surface: <interface name>
- Delta: <what changed since last sync, or "none">
- Action: <apply|counter|none>
```

## Thread closure hygiene

To keep the operational queue usable:

1. Receiver marks `acknowledged`/`actioned` when work is reviewed or applied.
2. The actor named in `Closure owner` is responsible for moving the thread to `closed` with terminal disposition per PRD-003.
3. If `Closure owner` is unavailable, maintainer is fallback closer.
4. Open Queue should prioritize non-terminal items; terminal items move to Closed Summary.

## Response expectations

1. `P0`: acknowledge in next available session turn.
2. `P1`: acknowledge within one WORKLOG cycle.
3. `P2`: acknowledge when convenient.

## Guardrails

1. No private channels.
2. No binary payloads or external-only links without summary.
3. No decision finalization only in mailbox; decisions must be logged in WORKLOG.
4. Do not edit another sender's authored meaning when compressing; preserve full text in archive.
5. For content review requests, never send path-only references without inline payload.

## Scope

This protocol applies to all active working sessions. The canonical reference for message types, mailbox format, and delivery rules is this file. See also `docs/COMMUNICATIONS_PROTOCOL.md` for the higher-level event model and channel architecture.
