---
name: turnfile-<agent>-collaboration
description: "Turnfile protocol execution guide for <AGENT_NAME>"
---

# Protocol Skill — <AGENT_NAME>

<!--
Copy this template to skills/<agent>/SKILL.md and fill in agent-specific details.
This file is the agent's complete, self-contained protocol execution guide (PRD-012 R1).

Key principles:
- Each agent maintains its own full skill file (no shared core with thin wrappers).
- The repository copy (skills/<agent>/SKILL.md) is canonical.
- Policy tests in skills/policy-tests/ validate cross-agent consistency.
- Skills are invoked only by explicit maintainer instruction (PRD-012 R3).
-->

## Overview

| Field | Value |
|-------|-------|
| Version | 0.1.0 |
| Status | Draft |
| Protocol baseline | PRD-003, 004, 008, 009, 010, 011, 013, 014 |
| Last updated | YYYY-MM-DD |

## How to use

Maintainer invokes modules by name. This skill file is **not** self-triggering.
The agent reads this file at session start for operational guidance.

## Execution contract

1. Read TURNFILE.yaml for current coordination state.
2. Execute the requested module steps.
3. Propose changes — do not write without explicit maintainer confirmation (PRD-012 R5.1).
4. Log all substantive actions in WORKLOG and/or MAILBOX.

## Active-turn boundary discipline (PRD-012 R2.2)

1. **First step:** Read mailbox inbox snapshot; check for unread messages.
2. Execute assigned work.
3. **Last step:** Re-check mailbox; confirm unread = 0 before declaring turn complete.
4. If unread cannot be cleared, escalate to maintainer with blocker context.

## Startup orientation read order (PRD-011 R3)

1. `working-session/boot-<agent>.md` — this agent's boot file
2. `working-session/TURNFILE.yaml` — coordination state
3. `working-session/WORKLOG.md` lines 1–11 (status block)
4. `working-session/MAILBOX.md` inbox snapshot
5. `working-session/OPEN_QUESTIONS.md` Active + Deferred sections
6. `working-session/chat-<agent>.md` session close snapshot (bottom of file)
7. Files relevant to current task

## Modules

<!--
Each module corresponds to a protocol workflow (PRD-012 R2).
Define: trigger phrases, expected inputs, deterministic outputs, stop/escalation conditions.

Example module:

### Module 1 — Session start (PRD-011, PRD-013)

**Trigger phrases:** "start session", "boot up", "initialize"
**Inputs:** boot file, TURNFILE.yaml
**Steps:**
1. Read boot file for orientation.
2. Read TURNFILE.yaml for coordination state.
3. Read WORKLOG status block.
4. Read MAILBOX inbox snapshot.
5. Read OPEN_QUESTIONS Active + Deferred.
6. Read chat-<agent>.md session close snapshot.
7. Report readiness to maintainer.
**Outputs:** Agent status set to `active` in TURNFILE.yaml (pending confirmation).
**Stop condition:** All orientation reads complete and reported.
**Escalation:** If boot file is missing or stale, notify maintainer.
-->

### Module 1 — Session start (PRD-011, PRD-013)

### Module 2 — Mailbox lifecycle (PRD-003, PRD-012)

### Module 3 — Maintainer decision request (PRD-004)

### Module 4 — Cross-agent review (PRD-008, PRD-009)

### Module 5 — Shared-file transaction (PRD-010, PRD-013)

### Module 6 — Session close (PRD-011, PRD-013, PRD-014)

### Module 7 — Turnfile coordination (PRD-013)

### Module 8 — OQ registry management (PRD-009)

## Fallback rules

<!--
Define graceful degradation when tools or artifacts are unavailable.
Example:
1. If TURNFILE.yaml is missing, notify maintainer and operate in propose-only mode.
2. If mailbox validator is unavailable, perform manual inbox count.
-->

## Output format requirements

<!--
Define how the agent reports results to the maintainer.
Example:
1. Summarize actions taken and files modified.
2. List any unresolved items or blockers.
3. Provide revision token for any modified artifacts.
-->

## Environment-specific notes

<!--
Agent-specific tooling, context window management, or behavioral notes.
These may differ between agents without affecting protocol outcomes.
-->

## Versioning

| Field | Value |
|-------|-------|
| Skill version | 0.1.0 |
| Validated against | — |
| Policy test status | not yet run |
| Aligned with PRDs | 003, 004, 008, 009, 010, 011, 013, 014 |
