# PRD-014: Session Closeout + Boot Handoff Contract

Status: Draft (inception; not yet actioned)
Owner: Maintainer + Codex + Claude
Date: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | `MSG-20260208-036` reply confirms recommendations applied |
| Claude acceptance | accepted | `MSG-20260208-036` review outcome: accept with recommendations |
| Maintainer acceptance | accepted | no explicit maintainer acceptance logged yet |
| Eligible for move to `docs/prds` | yes | blocked until maintainer acceptance + zero blockers in `inception/docs/PRD_STATUS.json` |

## Problem

Session resumption quality depends heavily on how the prior session closes. Right now closeout tasks (boot rollover, mailbox drain, worklog compaction checks, and OQ synchronization) are handled inconsistently and sometimes implicitly.

Observed failure modes:

1. Boot files are not always refreshed/archived in a uniform way.
2. Sessions can close with unresolved active messages that increase startup ambiguity.
3. Worklog compaction checks happen opportunistically instead of deterministically.
4. Open-question registry state can lag maintainer answers applied in PRDs.
5. Human-facing reflection is inconsistent, reducing lessons-learned continuity.

## Goal

Define a deterministic session-close contract that:

1. Produces a token-efficient boot handoff for the next session.
2. Ensures mailbox state is clean or explicitly carried with rationale.
3. Verifies worklog and OQ registry hygiene before close.
4. Archives prior boot artifacts for traceability.
5. Preserves a lightweight human reflection channel.

## Non-goals

1. Forcing identical boot structure across all LLMs.
2. Replacing PRD-011 resumption snapshot requirements.
3. Requiring every message in the full archive to be closed before session end.
4. Introducing sentiment-heavy narrative requirements.

## Users

1. Closing agent: executes the closeout checklist.
2. Resuming agent: consumes boot file + snapshot for fast startup.
3. Maintainer: verifies control-plane hygiene and closeout completeness.

## Requirements

## R1. Session closeout checklist is mandatory

Before declaring session close, the closing agent must execute a closeout checklist covering:

1. Mailbox action state (R2).
2. Boot rollover (R3).
3. Worklog maintenance and compaction check (R4).
4. Open-question sync check (R5).
5. Reflection entry (R7).

The checklist outcome must be visible in the session's chat mirror close note.

## R2. Mailbox clearance rule

Mailbox closeout must satisfy one of the following for each active message assigned to the closing agent:

1. Message moved to `acknowledged`, `actioned`, or `closed` with Ack line.
2. Message intentionally left `unread` with explicit carry-over reason and next owner.

Additional rules:

3. Inbox Snapshot counts must match active-message state.
4. Open Queue entries must match message status.
5. `MAILBOX.json` must be regenerated in the same cycle if `MAILBOX.md` changed.

## R3. Boot rollover + archive contract

At session close:

1. Current boot file is archived under `inception/archive/<boot-file-stem>/` with monotonic version naming, following PRD-006 archival path conventions.
2. New boot file is written for next-thread startup and reflects current coordination state.
3. Archive README is updated if archive structure changed.
4. Boot handoff must include at minimum:
   - read order,
   - current carry-over anchors,
   - immediate next action recommendation,
   - unresolved deferred items.

Boot format may vary by agent, but content coverage is required.

## R4. Worklog maintenance + compaction gate

Closeout must perform a worklog hygiene check:

1. Update top status block to reflect actual current state.
2. Append closeout handoff entry or confirm equivalent closeout entry already exists.
3. Evaluate compaction trigger from PRD-011 (`>500` lines body threshold).
4. If compaction trigger is met, either:
   - execute approved compaction, or
   - log explicit deferral with reason and next owner.

## R5. OQ synchronization rule

Before close, the agent must verify whether any PRD edits this session resolved or deferred questions:

1. Newly answered questions are reflected in `OPEN_QUESTIONS.md`.
2. Question status transitions are consistent (`active`, `deferred`, `resolved`).
3. Any unresolved drift is logged as an explicit carry-over item.

## R6. Handshake/decoupling policy

Default behavior: no "un-handshake" step is required at normal session close.

Decoupling is only required when:

1. Agent leaves the project permanently.
2. Maintainer removes/changes role authority.
3. Security or trust incident requires temporary suspension.

In those cases, decoupling is a maintainer-governed decision and should be logged in WORKLOG and reflected in Turnfile agent status.

## R7. Reflection + gratitude minimum

Each closeout must include a short reflection block in the chat mirror close note:

1. One "lesson learned" sentence (required).
2. One optional gratitude/appreciation sentence (optional but encouraged).

This reflection is human-facing context and does not replace technical handoff artifacts.

## R8. Shared-file mutation discipline

Closeout edits that touch shared control-plane files (`MAILBOX.md`, `WORKLOG.md`, `OPEN_QUESTIONS.md`, `docs/README.md`) must follow PRD-010/PRD-013 lock + transaction semantics when active.

## Proposed workflow

1. Start closeout checklist (R1).
2. Reconcile mailbox state and regenerate projection if needed (R2).
3. Archive prior boot + write next boot (R3).
4. Update worklog + evaluate compaction trigger (R4).
5. Run OQ sync pass (R5).
6. Write reflection block (R7).
7. Publish closeout summary in chat mirror and session status artifact.

## Acceptance criteria

1. Two consecutive session closes complete all R1 checklist sections.
2. Next-session startup can proceed using only boot + snapshot + mailbox unread scan.
3. No closeout leaves silent OQ drift when PRDs were updated.
4. At least one closeout records a lesson-learned reflection line.

## Risks

1. Closeout overhead could grow if checklist becomes too long.
2. Reflection requirement could become low-signal boilerplate if not kept short.
3. Parallel closeout edits may increase shared-file contention.

## Dependencies

1. PRD-003 message lifecycle semantics.
2. PRD-008 cross-sandbox handoff envelope and payload discipline.
3. PRD-009 reconciliation and OQ workflow.
4. PRD-010 shared-file transaction + locking.
5. PRD-011 session resumption/snapshot contract.
6. PRD-013 Turnfile coordination state.

## Milestones

1. M0: Draft PRD-014.
2. M1: Pilot checklist in next two session closes.
3. M2: Validate startup token-efficiency improvement from boot rollover quality.
4. M3: Decide canonical adoption path.

## Open questions

1. ~~**OQ-045:** Should reflection blocks have a strict template (`lesson`, `gratitude`, `next improvement`) or remain freeform?~~ **Resolved:** Freeform, under 100 characters. No strict template.
2. ~~**OQ-046:** Should boot archive version naming be globally monotonic or per-agent monotonic?~~ **Resolved:** Globally monotonic.

Tracked in: `inception/OPEN_QUESTIONS.md`.

## Exit criteria for moving beyond inception draft

1. Closeout checklist is used reliably without maintainer prompting.
2. Boot rollover/archival process is stable across at least two agents.
3. Maintainer confirms startup quality and control-plane hygiene improved.
