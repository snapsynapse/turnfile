# PRD-045: Stale Agent Reconciliation Policy

Status: Accepted; implementation done; promoted to docs/prds
Owner: Codex (author/eval author) + Claude (reviewer/implementer) + Maintainer (approval)
Date: 2026-06-23

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored this draft and `evals/prd-045.evals.mjs` as RED implementation tests |
| Claude acceptance | accepted | Claude APPLY'd R1-R8 and OQ-045-2/3 with counters C1-C2; Codex applied both |
| Maintainer acceptance | accepted | Maintainer requested a stale-agent policy PRD on 2026-06-23 |
| Eligible for move to `docs/prds` | yes | promoted to `docs/prds`; implementation done per PRD_STATUS |

## Problem

Turnfile sessions assume agents can close their own work, but real LLM participants may disappear before closeout. Browser tabs close, hosted sessions expire, local runtimes crash, API contexts are lost, and a model may simply stop responding before it can clear `current_task`, close mailbox cards, stop its heartbeat, or write its chat/boot handoff.

Session 28 exposed the gap: Gemini produced useful work, then went stale before closeout. Another agent could see the orphaned control-plane state, but could not safely edit Gemini-owned files or infer Gemini's final intent. The protocol needs a predictable stale-agent reconciliation path that preserves evidence, avoids cross-LLM file edits, and keeps the active queue usable.

## Goal

Define a policy and toolable reconciliation flow for stale agents.

PRD-045 is part of the `multi-agent-resilience` optional profile. It is required for full multi-agent Turnfile participation but not required for a single-agent v1-minimal starter session.

The policy must make these cases boring:

1. Detecting likely stale participant state.
2. Recording that stale state without pretending the stale agent closed itself.
3. Clearing or transferring shared control-plane blockers only with the right authority.
4. Preserving peer-owned files for the stale agent to self-reconcile on its next boot.
5. Keeping active sessions moving when an LLM disappears mid-task.

## Non-goals

1. Time-based polling as a protocol requirement.
2. Runtime supervision, process management, or hosted orchestration.
3. Editing another LLM's boot file, chat file, skill bundle, or per-agent shard without explicit authorization.
4. Treating stale reconciliation as evidence that the stale agent approved, rejected, or completed work.
5. Automatically deleting external heartbeat automations owned by a different runtime.

## Requirements

### R1. Stale-state vocabulary

Protocol docs must define these terms:

1. `suspected-stale`: an agent appears unavailable, but no authority has changed its state.
2. `maintainer-stale`: the Maintainer has confirmed the agent should be reconciled as stale.
3. `stale-reconciled`: shared control-plane state has been updated with explicit stale-reconciliation evidence.
4. `self-reconciled`: the returning agent has reviewed stale-reconciliation evidence and cleaned its own owned artifacts.

These terms must not be confused with ordinary `closed`, `done`, `approved`, or `accepted` outcomes.

### R2. Event-based detection

Stale detection must be event-based. Any active agent may surface `suspected-stale` when at least one of these conditions is visible from files or runtime evidence:

1. The Maintainer states that an agent is gone or should be treated as gone.
2. An agent's session is still marked active after another session has opened and the agent is not participating.
3. A heartbeat reports repeated lifecycle failure or disappears when it was expected to carry forward.
4. A mailbox card or task requires the agent, but the agent cannot be reached through the agreed session channel.
5. A boot or closeout validator reports orphaned state for that agent.

Detection alone may create a note, mailbox card, or signal. It must not mutate the stale agent's owned files or close the stale agent's work.

### R3. Authority boundary

Stale reconciliation has two authority levels:

1. Soft record: any active agent may record a suspected-stale observation with evidence.
2. Shared-state reconciliation: changing `agents.<id>.status`, clearing `current_task`, nulling `session_id`, transferring a task, or closing an active mailbox card owned by the stale agent requires a recorded Maintainer authorization unless a future accepted PRD delegates that exact class.

The policy must preserve the OQ-069 rule: an agent may edit its own files under selective unlock with an inform-and-confirm line to the Maintainer, but may not edit another LLM's files unless explicitly authorized.

### R4. Shared control-plane reconciliation

When Maintainer authorization exists, an active agent may reconcile shared control-plane state for the stale agent by:

1. Setting the stale agent status to `offline` or the nearest schema-valid non-active value.
2. Clearing `current_task` when the current task cannot continue without the stale agent.
3. Clearing `session_id` when the session is no longer live.
4. Updating `last_seen` to a stale-reconciliation marker that names the authorizing evidence.
5. Adding a signal or WORKLOG line that states the reconciliation was performed by another agent, not by the stale agent.

The reconciliation must not imply task completion, message approval, or agent consent.

The canonical `last_seen` marker format is:

`<stale-agent>-<session-id-or-snapshot>-stale-reconciled-by-<reconciler-or-maintainer>-rev<N>`

Example: `gemini-session-28-stale-reconciled-by-maintainer-rev408`.

### R5. Mailbox and task handling

The policy must define how to handle active work owned by a stale agent:

1. If a card is informational and the outcome is already fully evidenced, a Maintainer-authorized reconciler may close it with a stale-reconciliation outcome.
2. If a card requires the stale agent's judgment, it stays open or is reassigned only by Maintainer authorization.
3. If a task can be safely continued by another agent, transfer must cite Maintainer authorization and preserve the prior owner's incomplete state in notes.
4. If a task cannot continue, mark it `blocked` or equivalent with stale-reconciliation evidence.
5. Closure owner changes must be explicit. A stale agent cannot be silently treated as having closed its own card.

### R6. Owned artifact preservation

Peer-owned artifacts remain untouched unless explicitly authorized. This includes, at minimum:

1. `working-session/boot-<agent>.md`
2. `working-session/chat-<agent>.md`
3. `working-session/agents/<agent>/`
4. agent-specific skill bundles
5. runtime-specific heartbeat or automation state not owned by the reconciler

The stale agent's next boot should self-reconcile those artifacts by reading the stale-reconciliation evidence and writing its own correction or closeout note.

### R7. Tooling

Add a read-first stale-agent tool, tentatively `tools/reconcile-stale-agent.mjs`.

The tool must:

1. Accept `--agent <id>`.
2. Accept `--mode detect`, `--mode plan`, and `--mode apply`.
3. Default to `detect`.
4. Emit JSON with `--format json`.
5. In `detect`, report suspected stale indicators without writing.
6. In `plan`, emit a proposed shared-state patch and required authority evidence without writing.
7. In `apply`, require `--maintainer-authorization <evidence>` and apply only shared control-plane changes.
8. Refuse to edit peer-owned boot, chat, skill, or shard files.
9. Run or invoke the existing validators needed to prove mailbox and Turnfile consistency after apply.

### R8. Validation

Validation must catch unsafe stale-agent behavior:

1. A stale reconciliation cannot claim the stale agent approved or closed work unless that evidence already exists.
2. An `apply` run without Maintainer authorization must fail.
3. An `apply` run must fail if it would edit another LLM's owned artifacts.
4. The resulting Turnfile state must be schema-valid.
5. The resulting mailbox projection must stay consistent when mailbox state is changed.

## Acceptance Criteria

1. `node --test evals/prd-045.evals.mjs` passes.
2. The PRD defines `suspected-stale`, `maintainer-stale`, `stale-reconciled`, and `self-reconciled`.
3. The tool has a no-write detect mode that identifies a fixture with an active stale agent and orphaned current task.
4. The tool has a no-write plan mode that emits required Maintainer authority and the proposed shared-state changes.
5. Apply mode refuses to run without `--maintainer-authorization`.
6. Apply mode updates only shared control-plane files and refuses peer-owned boot/chat/shard writes.
7. The applied fixture marks the stale agent offline, clears current task/session id, records stale-reconciliation evidence, and does not mark the stale agent's task done.
8. Existing mailbox and Turnfile validators remain green after a valid apply fixture.
9. Stale-reconciled `last_seen` values follow the canonical marker format.
10. PRD-045 is classified as the `multi-agent-resilience` optional profile and is not required for v1-minimal starter adoption.

## RED Eval Package

`evals/prd-045.evals.mjs` is intentionally RED until implementation.

Expected implementer tasks:

1. Add stale-agent vocabulary to the appropriate v1 or optional-profile docs.
2. Implement `tools/reconcile-stale-agent.mjs` or an equivalent documented command.
3. Add fixtures that exercise detect, plan, missing-authorization apply, valid apply, and peer-owned artifact refusal.
4. Preserve the OQ-069 own-file boundary.
5. Record implementation evidence in `PRD_STATUS.json`.

## Open Questions

1. OQ-045-1: Should v1 core include stale-agent reconciliation, or should it be an optional operations profile? **Resolved by Claude counter C1 applied by Codex:** classify PRD-045 as an optional `multi-agent-resilience` profile. It is required for full multi-agent participation but not for v1-minimal starter adoption.
2. OQ-045-2: Should Maintainer authorization be required for all shared-state stale reconciliation, or may a narrow delegated band allow an active agent to set another agent from `active` to `offline` when no task/message transfer occurs? **Resolved:** Maintainer authorization is required for v1. Delegation may be proposed later.
3. OQ-045-3: Should the canonical state add a distinct `stale` status enum, or continue using schema-valid `offline` plus explicit reconciliation evidence? **Resolved:** use schema-valid `offline` plus explicit reconciliation evidence in `last_seen`, WORKLOG, and signals.

## Implementation Notes

This PRD should be implemented after PRD-043's current review loop closes or in parallel only if Claude explicitly has capacity. It directly follows the PRD-043 deferred Gemini orphan-close item and should replace ad hoc stale/orphan cleanup with a repeatable path.

## Counter Application Log

- 2026-06-23: Claude `MSG-20260623-018` APPLY'd R1-R8 and OQ-045-2/3. Codex applied C1 by classifying PRD-045 as the `multi-agent-resilience` optional profile rather than v1-minimal core. Codex applied C2 by adding the canonical stale-reconciled `last_seen` marker format.
