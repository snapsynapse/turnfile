# PRD-030: Session Heartbeat Management Contract

Status: Draft (working-session)
Owner: Maintainer + Codex + Claude
Date: 2026-06-16

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored draft in response to Maintainer request on 2026-06-16; applied Claude C1-C5 counters |
| Claude acceptance | accepted | MSG-20260616-006: APPLY with 5 counters; flips clean when C1-C5 land |
| Maintainer acceptance | pending | Awaiting Maintainer acceptance after agent review |
| Eligible for move to `docs/prds` | no | Draft review and Maintainer acceptance pending |

## Input Provenance Tags

1. `explicit`: Maintainer requested a new PRD for session heartbeat management after Codex deleted the `turnfile-mailbox-heartbeat` automation during session close.
2. `explicit`: Maintainer specified that heartbeat management can be negotiated at the initial handshake between Turnfile participants and should be part of closeout.
3. `derived`: PRD-014 already governs session closeout and projection synchronization, but does not define app-level recurring heartbeat lifecycle.
4. `derived`: PRD-019 covers mailbox-first approval and polling cadence in protocol terms, but does not govern Codex app heartbeat automations.
5. `derived`: PRD-024 keeps governance legible; heartbeat outcomes that change protocol state must be projected into legible artifacts.
6. `derived`: PRD-029 requires fresh state derivation before shared-file writes, which applies when a heartbeat processes mailbox or Turnfile work.

## Problem

Turnfile participants sometimes need a short-lived recurring check while an active session is moving quickly across mailbox turns. In session 15, a two-minute heartbeat helped Codex and Claude stop missing each other while PRD-027 teach-phase messages were moving.

However, unmanaged heartbeats create their own failure modes:

1. A heartbeat can continue after the session is clean, creating unnecessary wakeups.
2. A heartbeat can be created ad hoc without a shared understanding of cadence, owner, notification policy, or deletion condition.
3. A heartbeat can blur the line between convenience automation and Turnfile protocol semantics.
4. A heartbeat can process shared files without explicitly following mailbox, Turnfile, projection, and validator discipline.
5. Closeout can leave stale automations running unless the close checklist includes automation lifecycle.

Turnfile needs a narrow lifecycle contract for session heartbeats: how participants negotiate them at handshake, how they run during the session, and how they are deleted or deliberately carried forward at closeout.

## Goal

1. Define when a session heartbeat is appropriate.
2. Require explicit handshake negotiation or Maintainer direction before creating recurring heartbeat checks.
3. Standardize heartbeat prompt content, cadence, notification policy, and lifecycle ownership.
4. Bind heartbeat processing to existing Turnfile mailbox, state-derivation, projection, and validation rules.
5. Add heartbeat review and deletion/update to session closeout.

## Non-goals

1. Making time-based polling part of the core Turnfile protocol.
2. Replacing mailbox-first workflow, Turnfile signals, or active-turn boundary discipline.
3. Requiring every session to use a heartbeat.
4. Defining product-specific automation APIs beyond the behavior Turnfile needs from the active agent surface.
5. Allowing heartbeats to create hidden state, hidden authority, or out-of-band governance.

## Requirements

## R1. Heartbeats are optional session aids, not protocol authority

1. A heartbeat is a convenience automation attached to an active session or thread.
2. A heartbeat may wake an agent to inspect current files, process mailbox work, or report state.
3. A heartbeat does not replace mailbox delivery, Turnfile signals, PRD status, worklog entries, or Maintainer decisions.
4. A heartbeat cannot grant authority to make changes that the agent could not make during a normal turn.
5. Any heartbeat action that affects governance must be projected into the normal legible artifacts.
6. A heartbeat is harness-local interaction gearing, not protocol cadence. It creates no SLA, wall-clock obligation, or liveness duty for any peer.

## R2. Handshake negotiation

At session handshake, participants may negotiate whether to create a heartbeat. The negotiation records:

1. Purpose: what recurring condition the heartbeat watches.
2. Cadence: the interval or schedule, chosen conservatively.
3. Scope: which files or state surfaces it checks.
4. Actor: which session/thread owns the automation.
5. Write policy: whether the heartbeat may process mailbox work and edit shared files under existing protocol.
6. Notification policy: when to notify the Maintainer versus stay quiet.
7. Stop condition: when the heartbeat must be deleted, paused, or updated.
8. Session-charter record: the heartbeat decision is recorded in the session charter or equivalent handshake artifact.

If no heartbeat is negotiated, the default is no recurring heartbeat.

Heartbeat state is not stored in `TURNFILE.yaml` by default. Turnfile remains durable protocol state; app automations are ephemeral harness state. A future amendment may add a minimal Turnfile field only if cross-agent multi-heartbeat coordination requires it.

## R3. Creation and update rules

1. Heartbeats require explicit Maintainer direction or explicit handshake agreement among active Turnfile participants.
2. The creating agent must use the active surface's automation tool rather than writing raw automation directives by hand.
3. The prompt must be self-contained and identify:
   - workspace path,
   - files to inspect,
   - what counts as new work,
   - required protocol steps before writes,
   - validation expectations,
   - expected quiet/no-op reporting behavior.
4. Heartbeats that process mailbox work must instruct the agent to read shared state first, derive IDs/counts with `tools/next-state.mjs` before writes, regenerate projections after mailbox edits, and run relevant validators.
5. Updates to cadence, scope, prompt, or stop condition must be treated as lifecycle changes and recorded in the governance record when protocol-relevant.

## R4. Runtime processing discipline

Each heartbeat run that touches Turnfile state must follow ordinary protocol discipline:

1. Read `working-session/MAILBOX.md`, `working-session/TURNFILE.yaml`, and `working-session/WORKLOG.md` from disk before asserting state.
2. If there is new work assigned to the agent, process it through mailbox lifecycle rules.
3. If shared files will be edited, derive mailbox IDs, signal IDs, next revision, and inbox counts with `tools/next-state.mjs` first.
4. After mailbox edits, regenerate `working-session/MAILBOX.json`.
5. Run mailbox invariants and Turnfile lint after control-plane changes.
6. Notify only when there is material state change, new work processed, a blocker, or a Maintainer-relevant decision.
7. Quiet no-op reports should include current unread counts and next owner, but should not create governance churn.

## R5. Closeout lifecycle

Session closeout must inspect active heartbeat automations.

1. If the heartbeat's stop condition is satisfied, delete it during closeout.
2. If the heartbeat should continue, record why, who owns it, what it watches, and when it should be reconsidered.
3. If the session goal changed, update the heartbeat rather than leaving stale instructions in place.
4. A clean close may not leave a stale heartbeat running silently.
5. Heartbeat deletion/update must be mentioned in the closeout note or WORKLOG when it affects session continuity.
6. Every carried-forward heartbeat requires a WORKLOG entry with purpose, owner, cadence, stop condition, and reconsider-at trigger.

## R6. Closeout checklist amendment

PRD-014 closeout gains a heartbeat-management check. This check is intended to land as one coherent closeout checklist together with PRD-014 Amendment A1's compaction and projection synchronization items, not as a duplicate gate.

1. List active session heartbeats relevant to the thread/workspace.
2. For each heartbeat, choose one outcome: deleted, updated, intentionally carried forward, or not applicable.
3. Record the outcome in the closeout handoff.
4. Run the normal projection/validation gate after any shared-file closeout edits.
5. If PRD-014 Amendment A1 is accepted, add heartbeat lifecycle as a row in A1's unified closeout compaction/projection checklist.

## R7. Notification contract

Heartbeat reports should use three categories:

1. `NOTIFY`: material change, new work processed, blocked state, validation failure, or automation lifecycle change.
2. `DONT_NOTIFY`: no new work and no user action needed.
3. Escalation to Maintainer: stale automation cannot be deleted, unread work cannot be cleared, validation fails, or ownership is ambiguous.
4. Escalation to Maintainer: after a session-defined number of consecutive no-op cycles, the heartbeat may report possible peer inactivity. It must not infer peer liveness as fact and must not nudge the peer.

Deletion of an obsolete heartbeat is a material lifecycle change and should be reported once.

## R8. Safety and contention

1. Heartbeats must not run destructive commands unless separately authorized by the Maintainer.
2. Heartbeats must not perform network or cross-repo work unless the prompt and session scope explicitly require it.
3. Heartbeats must respect shared-file lock and revision discipline when another participant is active.
4. If a heartbeat detects a concurrent edit or stale derived state, it must re-read files and retry boundedly or stop with a blocker report.
5. A heartbeat should not be used to force liveness or responsiveness from another participant; it only checks file-visible state.
6. A heartbeat must never infer peer liveness from silence. It can report file-visible inactivity or unchanged state only.

## Acceptance criteria

1. Session handshake includes an explicit heartbeat decision: none, create, update, or carry forward.
2. A created heartbeat has purpose, cadence, scope, owner, notification policy, and stop condition.
3. Heartbeat runs that mutate mailbox state regenerate `MAILBOX.json` and pass mailbox invariants.
4. Heartbeat runs that mutate Turnfile state advance revision and pass Turnfile lint.
5. Session closeout includes heartbeat inspection and deletes or updates obsolete automations.
6. At least one closeout demonstrates deletion of an obsolete heartbeat after unread counts reach zero.

## Risks

1. Heartbeats can become noisy.
   Mitigation: default to no heartbeat; require quiet no-op behavior and stop conditions.
2. Heartbeats can mask unclear ownership.
   Mitigation: heartbeat prompts must report next owner and cannot create authority.
3. Heartbeats can leave stale automations after close.
   Mitigation: closeout checklist requires deletion, update, or explicit carry-forward.
4. Heartbeats can race active agents.
   Mitigation: files-first reads, derived-state checks, and existing lock/revision discipline apply.

## Dependencies

1. PRD-003 message lifecycle and SLA contract.
2. PRD-010 shared-file transaction locking.
3. PRD-014 session closeout and boot handoff contract.
4. PRD-019 mailbox-first approval and polling cadence contract.
5. PRD-024 human-legibility invariant and encoding profiles.
6. PRD-029 pre-write state derivation contract.

## Open questions

No open questions in this draft.

Resolved during Claude review (MSG-20260616-006):

1. Carried-forward heartbeats always require a WORKLOG entry.
2. Heartbeat state stays out of `TURNFILE.yaml` for now; record handshake decisions in the session charter and carry-forward decisions in WORKLOG.
