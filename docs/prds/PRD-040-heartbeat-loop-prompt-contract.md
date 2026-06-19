# PRD-040: Heartbeat Loop Prompt Contract

Status: Accepted and promoted (session 23, 2026-06-18) — heartbeat loop prompt check requirements approved.
Owner: Maintainer + Gemini (drafter) + Codex (reviewer) + Claude (reviewer)
Date: 2026-06-18
Last revised: 2026-06-18

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MAILBOX MSG-20260618-013: Codex reviewed the revised PRD-040 after Claude counters were incorporated and replied APPLY |
| Claude acceptance | accepted | MAILBOX MSG-20260618-014: Claude reviewed PRD-040 APPLY-with-counters (C1-C4). Gemini applied all four; Claude re-reviewed and approved |
| Gemini acceptance | accepted | Proposer self-acceptance: draft authors loop prompt check requirements and preserves PRD-038 read-only boundaries |
| Maintainer acceptance | accepted | Approved on 2026-06-18 (session 23) after Gemini draft, Codex APPLY (MSG-013), and Claude APPLY-with-counters applied (MSG-014) |
| Eligible for move to `docs/prds` | yes | Promotion gate satisfied in `working-session/docs/PRD_STATUS.json` |

---

## Input Provenance Tags

1. `explicit`: Maintainer proposed adding a loop prompt to the heartbeat steward: *"Do you have any unblocked work in your lane that you can complete now?"*
2. `derived`: PRD-038 defines read-only heartbeat stewards to inspect state and notify on material changes.
3. `derived`: PRD-012 R2.2 and R7 define Active-Turn Boundary Discipline, including the obligation to scan own sent-message threads for peer replies that did not raise unread counts (thread-mode blindness).
4. `derived`: PRD-013 R6 defines task coordination, where task status dependencies are resolved on file writes.

---

## Problem

Heartbeat stewards (PRD-038) refresh files and check inbox counts to notify on new unread messages. However, coordination latency remains in two areas:

1. **Thread-Mode Blindness**: When a peer replies to an agent's sent card, the card status transitions, but the sender's unread count does not increase. The agent remains unaware of peer replies or closure obligations until a manual turn start or full scan occurs.
2. **Task Dependency Gaps**: When a peer completes a task that blocks another agent's task, the dependent agent is unblocked. Currently, the dependent agent is only notified if a peer explicitly pings them, rather than detecting the state change programmatically.

Adding a structured prompt to the heartbeat steward addresses these gaps by forcing the agent to verify if it is unblocked or has pending replies on threads it owns.

---

## Goal

1. Standardize the heartbeat loop prompt: *"Do you have any unblocked work in your lane that you can complete now?"*
2. Define the evaluation criteria for determining if an agent has unblocked work.
3. Establish quiet no-op behavior to prevent unnecessary write operations or notification noise.
4. Define proactive claiming and signaling when unblocked work is identified.

---

## Non-goals

1. Allowing the read-only heartbeat steward to perform write operations by default.
2. Replacing normal task assignment/execution turns.
3. Triggering notifications to the Maintainer when no actionable change has occurred.

---

## Requirements

### R1. Loop Prompt Standard

1. Every heartbeat steward run prompt must include or execute the logical check: *"Do you have any unblocked work in your lane that you can complete now?"*
2. The steward must evaluate this check by analyzing the fresh workspace state read from disk.

### R2. Unblocked Work Evaluation Criteria

An agent is defined as having **unblocked work** if any of the following are true:

1. **Sent Message Thread Activity (Idempotent)**: There is an active mailbox thread where:
   - The agent is the `Closure owner`.
   - A peer has added an `Ack` or `Reply` (indicating the thread is ready for the owner to close or advance).
   - The thread is not in a terminal `closed` state.
   - *Note*: Because read-only checks are stateless, the steward notifies on any such open thread. The agent silences subsequent notifications by closing the thread during its active turn.
2. **Task Dependency Resolution**: There is an active task in `TURNFILE.yaml` where:
   - The task is assigned to the agent (`owner` match).
   - The task status is `pending` or `claimed`.
   - All tasks listed in `depends_on` are now marked `status: done`.
   - *Note*: Unassigned tasks are surfaced separately as "available" rather than triggering active notification loops for multiple agents simultaneously.
3. **Pending Handshake Work**: The current agent's signature block or handshake confirmation row in `NEXT_SESSION_HANDSHAKE.md` is missing, incomplete, or out of date with the current revision.

### R3. Quiet No-Op Discipline

1. If the steward runs the loop prompt and finds no unblocked work, it must execute a quiet no-op.
2. A quiet no-op must not:
   - Create notifications for the user or Maintainer.
   - Write to any shared file.
   - Append to logs outside of the standard heartbeat cron execution log.

### R4. Proactive Signaling and Escalation

If unblocked work is identified during a heartbeat run:

1. **No Write Signaling**: The steward must not attempt to write coordination signals or update TURNFILE.yaml/shards during a read-only heartbeat run.
2. **Notify**: The agent must trigger a user-facing notification with `NOTIFY` priority, specifying the unblocked task ID or mailbox thread ID.
3. **Claiming/Signaling in Main Turn**: Any task claiming or coordination signaling (e.g. posting `ready` or `request_turn` in shards or `TURNFILE.yaml`) must occur only during the main active runtime turn that is started in response to the notification.
4. **No Auto-Execution**: The steward must not begin implementing the unblocked task during the heartbeat run; it must yield the turn to allow the active runtime thread to claim and execute the work under user visibility.

---

## Acceptance Criteria

1. The loop prompt *"Do you have any unblocked work in your lane that you can complete now?"* is codified in the heartbeat steward instruction template.
2. The heartbeat steward validation suite includes a test verifying that:
   - A peer reply on a self-owned thread triggers a `NOTIFY` result.
   - A resolved task dependency in `TURNFILE.yaml` triggers a `NOTIFY` result.
   - An unchanged idle state triggers a `DONT_NOTIFY` quiet no-op result.
3. The PRD-038 read-only constraint remains fully satisfied.
