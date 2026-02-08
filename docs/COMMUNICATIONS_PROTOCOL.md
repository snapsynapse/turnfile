# Communications Protocol

How agents communicate in a system where they cannot talk to each other directly.

---

## 1) The fundamental constraint

Agents in this protocol are **stateless and isolated**. They cannot:

- See each other's in-progress work
- Send messages to each other in real time
- Share memory, context, or runtime state

All communication happens through **markdown files on disk**, mediated by a human maintainer who triggers each agent's work. This is not a limitation to work around — it is the design constraint the entire protocol is built for.

---

## 2) Communication channels

### WORKLOG (primary channel)

The WORKLOG (`WORKLOG.md`) is the shared append-only log that serves as the message bus. All significant events are recorded here.

Structure (see [Protocol Core, section 6](./PROTOCOL_CORE.md#6-worklog-requirements)):

1. **Pinned status block** (top of file, updated in-place) — current state of each agent
2. **Decision index** (after status block, append-only) — scannable table of key decisions
3. **Chronological entries** (body of file, append-only) — handoffs, decisions, analysis

Agents read the WORKLOG at the start of every session to understand what has happened since their last turn. Agents write to the WORKLOG after every completed task.

### Session charter (configuration)

The [Session Charter](./SESSION_CHARTER.md) defines the session's governance settings, lane assignments, and acceptance criteria. It is written once at session start and amended only by maintainer decision.

### Shared contracts (integration point)

Schema files, interface definitions, and validation tests that multiple agents build against. These are the technical integration point — the WORKLOG is the human-readable one.

---

## 3) Event types

Every WORKLOG entry maps to one of these logical event types:

| Event | When it fires | Who writes it |
|-------|---------------|---------------|
| `task.claimed` | Agent begins work on a task | The claiming agent |
| `task.completed` | Agent finishes work (includes handoff) | The completing agent |
| `handoff.posted` | Ownership transfers between agents | The handing-off agent |
| `proposal.created` | Agent proposes an approach or design decision | Any agent |
| `proposal.amended` | A proposal is revised after feedback | The proposing agent |
| `objection.raised` | Agent disagrees with a recommendation | The objecting agent |
| `decision.recorded` | A decision is finalized (by consensus or maintainer) | The deciding party |
| `escalation.requested` | Conflict cannot be resolved between agents | Any agent or maintainer |

These are logical categories, not literal tags. A WORKLOG entry is implicitly typed by its content and format (handoff block, counter-recommendation block, etc.).

---

## 4) Event envelope

Each WORKLOG entry implicitly carries this information:

| Field | How it appears in markdown |
|-------|---------------------------|
| Timestamp | Section heading or inline timestamp |
| Actor | Agent name in heading or handoff block |
| Event type | Implied by format (handoff, counter-rec, decision, etc.) |
| Subject | Section heading text |
| Payload | Entry body (changed files, test results, reasoning) |
| Links | References to other entries, files, or decisions |

For systems that need machine-readable event logs, the logical envelope can be expressed as:

```json
{
  "event_id": "<unique identifier>",
  "event_type": "<event type from section 3>",
  "session_id": "<session charter ID>",
  "actor": "<agent name>",
  "timestamp": "<ISO-8601>",
  "subject": "<short title>",
  "payload": {},
  "links": []
}
```

The markdown WORKLOG is the canonical format. JSON is an optional projection for tooling.

---

## 5) Delivery semantics

- **Append-only:** entries are never edited or deleted (except the pinned status block, which is updated in-place)
- **Idempotent readers:** agents must tolerate re-reading entries they have already seen
- **Eventual consistency:** the WORKLOG reflects what has happened, not what is happening right now. There is always a lag between an agent completing work and another agent seeing it.
- **Human-visible audit trail:** every entry must be readable by a human without tooling. No binary formats, no encoded payloads.

---

## 6) Mailbox (optional extension)

For sessions where agents need to leave targeted messages for specific agents — as opposed to broadcasting to the WORKLOG — a `MAILBOX.md` file can be used.

### When to use a mailbox

- An agent has a question or request for a specific other agent
- The message is not a handoff, decision, or status update (those belong in the WORKLOG)
- The maintainer wants to reduce copy-paste overhead when relaying between agents

### Mailbox format

```text
---
To: <agent name>
From: <agent name>
Date: <ISO-8601>
Subject: <short title>
Status: <unread|read|replied>

<message body>
---
```

### Rules

- The human maintainer triggers "check the mailbox" — agents do not poll
- The maintainer can read all messages (no private channels)
- Messages are append-only; status is updated in-place
- The mailbox supplements the WORKLOG, never replaces it. Decisions and handoffs still go in the WORKLOG.

---

## 7) Anti-patterns

- **Using the WORKLOG as a chat room.** Entries should be structured (handoffs, decisions, counter-recs), not freeform conversation.
- **Assuming the other agent has read your entry.** They haven't until the maintainer triggers their next session. Design for async.
- **Editing another agent's entries.** Each agent writes their own entries. If you disagree, post a counter-recommendation.
- **Putting decisions only in the mailbox.** All decisions must appear in the WORKLOG decision index for auditability.
