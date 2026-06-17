# Chat Log — <AGENT_NAME>

<!--
Copy this template and rename to chat-<agent>.md (e.g., chat-claude.md, chat-gemini.md).

This is the agent's scratchpad for session commentary, reasoning, and context
that doesn't fit cleanly into mailbox messages or WORKLOG handoffs.
Readable by maintainer and other agents.

Session state snapshots go at the bottom of this file (PRD-011 R1).
-->

Session entries begin with a fixed session header carrying machine-parsable
metadata fields (PRD-017 R7.4 / OQ-056): session ID, date, branch, Turnfile
revision, and phase. Keep these fields on every session section so chat logs are
parseable across agents.

<!--
Example session entry:

---

## Session 1 — YYYY-MM-DD

| Field | Value |
|-------|-------|
| session ID | <agent>-session-1 |
| date | YYYY-MM-DD |
| branch | main |
| Turnfile revision | <rev at start> |
| phase | phase-2 / <step> |

### Task completed

Brief narrative of what happened, decisions made, and reasoning.

---

## Session Close — State Snapshot (PRD-011 R1)

```yaml
---
session_id: <agent>-session-1
agent: <agent>
date: YYYY-MM-DD
timestamp: YYYY-MM-DD
branch: main
turnfile_revision: <rev at close>
phase: phase-2 / <step>
close_reason: maintainer-directed
revision: REV-YYYYMMDD-snapshot-<agent>-01
---
```

### Active task
**Status:** Complete / In progress.

### Mailbox state
- **Agent unread:** 0
- **Open queue:** Empty.

### Files modified this session
- path/to/file — what changed

### Files to read on resume
1. file — ~tokens — reason to read

### Decision context
- Key decisions or context for next session
-->
