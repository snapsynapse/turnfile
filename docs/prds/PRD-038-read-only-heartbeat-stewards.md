# PRD-038: Read-Only Heartbeat Stewards

Status: Accepted (docs/prds)
Owner: Codex (drafter) + Claude (reviewer) + Gemini (reviewer) + Maintainer (acceptance)
Date: 2026-06-18

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | drafter acceptance |
| Claude acceptance | accepted | MSG-20260617-058/060 APPLY-with-counters; C1/C2 applied |
| Gemini acceptance | accepted | MSG-20260617-059 APPLY with no counters |
| Maintainer acceptance | accepted | Maintainer direct acceptance 2026-06-18 |
| Eligible for move to `docs/prds` | yes | promoted after required peer and Maintainer acceptance |

## Input Provenance Tags

1. `explicit`: Maintainer proposed one tiny concurrent heartbeat sub-agent per LLM runtime, not one shared coordinator.
2. `explicit`: Maintainer clarified the most important constraint: the heartbeat sub-agent should be read-only.
3. `explicit`: Maintainer proposed cadence negotiation as a range in the initial handshake, for example every 5 to 10 minutes, with each LLM choosing its exact cadence during confirmation.
4. `derived`: PRD-030 already defines session heartbeats as optional harness-local aids, not protocol authority.
5. `derived`: PRD-030 currently permits heartbeats to process mailbox work when explicitly configured; this PRD narrows the default to read-only and makes write capability an explicit elevation.
6. `derived`: PRD-031 makes concurrent shared-file edits the main collision class. Read-only heartbeat stewards reduce missed messages without adding another writer.
7. `derived`: PRD-037 proposes default heartbeat-on as part of boot simplification. This PRD supplies the missing safety profile: default-on may be acceptable only when the default heartbeat is read-only.

## Problem

PRD-030 lets agents negotiate recurring heartbeat automations, but the current contract mixes two very different behaviors:

1. Read-only state refresh: inspect current Turnfile files, detect own unread work, and report material changes.
2. Write-capable processing: acknowledge mailbox cards, update Turnfile status, regenerate projections, and run validators after mutation.

In live multi-agent sessions, the team wants the first behavior frequently and cheaply. The second behavior is useful but riskier because it creates another concurrent writer. If every runtime has a heartbeat that can edit shared files, the system can reduce missed messages while increasing the shared-file collision tax.

The safer default is a per-runtime read-only heartbeat steward. It keeps each LLM aware of file-visible work without granting a hidden sub-agent authority to mutate Turnfile state.

## Goal

1. Define a heartbeat steward as a runtime-owned read-only sub-agent.
2. Allow cadence-window negotiation during handshake without requiring synchronized schedules.
3. Keep one steward per LLM runtime, never one cross-runtime coordinator.
4. Make read-only the default and write-capable heartbeat behavior an explicit elevated mode.
5. Preserve PRD-030 lifecycle, memory-boundary, notification, and closeout obligations.
6. Reduce missed mailbox work without adding hidden authority or extra shared-file writers.

## Non-goals

1. Replacing active agent turns.
2. Letting a heartbeat steward acknowledge, action, close, or create mailbox messages by default.
3. Letting a heartbeat steward claim tasks, acquire locks, update PRD status, or edit Turnfile state by default.
4. Creating a single scheduler or coordinator across Claude, Codex, Gemini, or future LLMs.
5. Treating cadence as protocol liveness, SLA, or proof of peer inactivity.
6. Weakening PRD-003, PRD-010, PRD-030, PRD-031, or ownership-guard rules.

## Requirements

### R1. One read-only steward per runtime

1. Each active LLM runtime may own its own heartbeat steward.
2. A steward acts only as its owning runtime for read-only observation.
3. A steward must not operate on behalf of another runtime.
4. A steward must not infer, enforce, or report peer liveness from silence.
5. A steward is not a Turnfile actor for task ownership, locks, or approval authority.

### R2. Default steward mode is read-only

By default, a heartbeat steward may:

1. Read `working-session/MAILBOX.md`.
2. Read `working-session/TURNFILE.yaml`.
3. Read `working-session/WORKLOG.md`.
4. Read `working-session/docs/PRD_STATUS.json`.
5. Read `working-session/NEXT_SESSION_HANDSHAKE.md` when handshake or heartbeat state is relevant.
6. Run any read-only validator under `tools/`. The canonical current set includes `tools/session-orient.mjs`, `tools/next-state.mjs`, `tools/validate-mailbox-invariants.mjs`, `tools/turnfile-lint.mjs`, `tools/validate-closeout.mjs`, `tools/validate-ownership-guard.mjs`, `tools/validate-public-surface-snapshot.mjs`, `tools/validate-prd-promotion.mjs`, `tools/validate-boot-sequence.mjs`, `tools/validate-out-of-band-reconciliation.mjs`, and `tools/validate-review-cycle-closure.mjs`. A new validator is read-only eligible if it does not write to the filesystem.
7. Inspect git status and diffs for awareness.
8. Report material findings to the owning active thread or user-facing surface.

By default, a heartbeat steward must not:

1. Edit any file.
2. Regenerate `MAILBOX.json`.
3. Change mailbox status.
4. Add acknowledgments or replies.
5. Create Turnfile signals.
6. Advance `coordination.revision`.
7. Claim or complete tasks.
8. Create, update, or delete locks.
9. Stage, commit, push, or run destructive commands.

### R3. Write-capable heartbeat is explicit elevation

1. Any heartbeat that may mutate Turnfile state is not a read-only steward. It is a write-capable heartbeat.
2. A write-capable heartbeat requires explicit Maintainer direction or explicit handshake acceptance that names the write scope.
3. The write scope must list allowed files and allowed lifecycle transitions.
4. The prompt must require `tools/next-state.mjs` before writes, projection regeneration after mailbox edits, and validators after control-plane mutations.
5. Write-capable heartbeat mode must be recorded separately from read-only steward mode in the handshake artifact.
6. If the scope is ambiguous, the heartbeat must fall back to read-only behavior and report the ambiguity.

### R4. Handshake cadence-window negotiation

The initial handshake may offer a heartbeat window instead of a fixed cadence.

The offer records:

1. Purpose.
2. Mode: read-only steward by default.
3. Suggested cadence window, for example `5-10 minutes`.
4. Files to inspect.
5. Read-only helper commands allowed.
6. Notification policy.
7. Stop condition.
8. Whether write-capable elevation is prohibited, allowed only by later explicit approval, or already approved for a named scope.

Each runtime replies with:

1. Accepted, declined, or countered window.
2. Exact cadence chosen by that runtime.
3. Whether jitter is allowed.
4. Whether the steward was actually created.
5. Owner runtime and surface.
6. Stop condition.
7. Confirmation that the steward is read-only unless explicitly elevated.

### R5. Cadence does not synchronize agents

1. Runtimes do not need to use the same cadence.
2. Runtimes do not need to align heartbeat timing.
3. Jitter is allowed and preferred when supported, because it reduces simultaneous file reads and potential future write collisions.
4. A cadence window is a local wakeup preference, not a protocol SLA.
5. A missed or delayed heartbeat is not a protocol failure unless its own runtime reports it as a blocker.

### R6. Notification contract for read-only stewards

A read-only steward reports only when it detects:

1. Own unread mailbox work.
2. Stale projections or validator failures.
3. New blocking state assigned to the owner.
4. A peer response to an owner-authored request, detected by scanning own-sent threads for new `Ack:` or `Reply:` lines below the steward's last observed position, not by inbox unread delta. The steward may maintain a local per-thread cursor in memory or runtime scratch state, but never writes that cursor to shared Turnfile files.
5. Automation lifecycle drift, such as a missing or paused steward when the handshake says it exists.
6. Closeout stop condition satisfied.

Quiet no-op behavior should avoid governance churn. A no-op report may state refreshed unread counts and current revision to the owning thread, but it must not write those facts into Turnfile artifacts.

### R7. Closeout lifecycle

1. Closeout must inspect read-only stewards as part of the PRD-030 heartbeat lifecycle check.
2. If the stop condition is satisfied, delete or pause the steward.
3. If the steward is carried forward, WORKLOG must record purpose, owner, cadence or window, read-only mode, stop condition, and reconsider-at trigger.
4. A clean close may not leave a stale steward running silently.
5. If a write-capable heartbeat also exists, closeout must separately record its elevated scope and lifecycle decision.

### R8. Relationship to PRD-030 and PRD-037

1. This PRD amends PRD-030 by defining the default heartbeat sub-agent profile as read-only.
2. PRD-030 remains authoritative for heartbeat lifecycle, memory boundary, notification categories, and closeout inspection.
3. PRD-037 may propose default heartbeat-on for boot simplification, but default-on is safe only when default mode is read-only steward mode.
4. If PRD-037 and PRD-038 conflict, the narrower heartbeat safety rule in PRD-038 should govern heartbeat capability, while PRD-037 may govern boot simplification mechanics.

### R9. Self-drive on material change (Maintainer 2026-06-23)

A read-only steward must act on material change in the main loop, not merely surface findings for the user to route. On detecting material change (own unread mailbox card, projection drift, validator finding, peer response appended to an owned thread, missing artifact, or dirty peer-owned path), the steward continues the next unblocked step in its lane — closure-owner sweep, A1 step continuation, ack of new unread, or projection re-export — within the read-only deny-list.

1. The read-only deny-list (R2 #2) applies to the heartbeat script itself, not to the main-loop response the script triggers.
2. The main-loop response may take any write action the agent is normally authorized to take, including writes outside the read-only steward's permitted action set.
3. "No material change" remains silent (R6 quiet default).
4. Recorded precedent: session-28 Maintainer correction; encoded in `tools/turnfile.mjs heartbeat write` per PRD-048 R5.

### R10. Runtime-agnostic sentinel artifact

The portable contract for read-only stewards is `working-session/HEARTBEAT.md` written by `node tools/turnfile.mjs heartbeat write --agent <id> --session <N>` (PRD-048 R5).

1. The sentinel file contains the steward prompt contract: agent identity, cadence, policy (notify-material), stop condition (close), and the R2 deny-list.
2. The runtime owns its own cron mechanism (Claude Code `mcp__scheduled-tasks`, Codex automations, Antigravity native, or shell loop). Each tick reads `HEARTBEAT.md` and follows the contract.
3. When `HEARTBEAT.md` is removed (by `node tools/turnfile.mjs heartbeat stop` or by the close orchestrator), the steward stops.
4. No central cross-runtime scheduler. The sentinel file IS the synchronization point.
5. This sentinel-driven model is the v1 portable heartbeat contract; runtime-specific automation registries remain valid but are no longer the source of truth for steward identity or lifecycle.

### R11. v1 heartbeat-profile conformance check

A session running the read-only-heartbeat optional profile conforms when:

1. At session open, each active agent either creates a `HEARTBEAT.md` per R10 OR records "no heartbeat this session" in the handshake row.
2. At each loop tick that flips a material-change signal, the agent records the resulting main-loop action in WORKLOG or MAILBOX (R9 evidence).
3. At session close, `HEARTBEAT.md` is removed (clean stop) or carry-forward is recorded per R7.
4. No write occurs FROM the heartbeat script itself; the R2 deny-list passes inspection of the script's output.

Adopters can verify conformance by reading the WORKLOG closeout block and confirming no orphan `HEARTBEAT.md` files persist.

## Acceptance Criteria

1. Session handshake format can record a heartbeat cadence window and a runtime-selected exact cadence.
2. Session handshake format can distinguish read-only steward mode from write-capable heartbeat mode.
3. A read-only steward prompt contains no permission to edit files, regenerate projections, change mailbox status, claim tasks, or create Turnfile signals.
4. A read-only steward can detect and report own unread mailbox work without changing `MAILBOX.md`.
5. A read-only steward can detect stale `MAILBOX.json` without regenerating it.
6. A read-only steward can detect peer responses appended to owner-authored threads using a local cursor, without relying on inbox unread counts.
7. A write-capable heartbeat requires explicit elevated scope and retains PRD-030 write discipline.
8. Closeout records whether each runtime steward was deleted, paused, carried forward, or not applicable.
9. No shared cross-runtime heartbeat coordinator is introduced.

## Risks

1. Read-only stewards may report work but leave it unprocessed.
   Mitigation: this is intentional. Processing happens in the owning active turn or explicit write-capable heartbeat mode.
2. Default-on read-only stewards may still create notification noise.
   Mitigation: no-op quiet behavior and material-change-only notification remain required.
3. Agents may accidentally treat read-only steward reports as authoritative state.
   Mitigation: reports must cite refreshed files and remain advisory until an active turn acts under normal protocol.
4. PRD-037 default-heartbeat language may be read as write-capable by default.
   Mitigation: PRD-038 explicitly narrows default heartbeat capability to read-only.

## Dependencies

1. PRD-003 message lifecycle and SLA contract.
2. PRD-010 shared-file transaction locking.
3. PRD-014 session closeout and boot handoff contract.
4. PRD-030 session heartbeat management contract.
5. PRD-031 concurrent multi-agent coordination contract.
6. PRD-032 session orientation tool contract.
7. PRD-037 boot simplification, if accepted.

## Open Questions

No open questions from the draft. Maintainer intent is clear enough for initial review.
