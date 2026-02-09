# PRD-010: Shared File Transaction + Turnfile Lease Locking Contract

Status: Draft (inception, Turnfile-aligned)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08

## Problem

The protocol reduced content-level ambiguity (PRD-008/009), but shared control-plane edits still collide when multiple agents update `MAILBOX.md`, `WORKLOG.md`, or `OPEN_QUESTIONS.md` near the same time.

Observed failure modes:

1. Inbox unread counters drift from active-message state.
2. Open Queue rows temporarily disagree with message-card status.
3. One agent overwrites another agent's just-written control-plane edits.
4. `MAILBOX.json` projection regeneration lags markdown state after concurrent mailbox updates.

PRD-013 introduced `TURNFILE.yaml` as the coordination artifact and lock ledger. PRD-010 must align to that model.

## Goal

Define a lightweight transaction + lock contract for shared operational files that:

1. Prevents concurrent-write stomp on shared markdown files.
2. Keeps mailbox counters, queue rows, and status cards coherent.
3. Guarantees projection freshness after mailbox mutations.
4. Uses Turnfile revision leases (not wall-clock time) for lock lifecycle and stale detection.
5. Preserves parallel drafting for PRD documents by locking only the shared control plane.

## Non-goals

1. Introducing a database, daemon lock service, or centralized scheduler.
2. Blocking parallel PRD-content editing.
3. Replacing mailbox/worklog markdown as canonical narrative/governance artifacts.
4. Solving cross-sandbox visibility issues (covered by PRD-008).
5. Defining a stateless locking model (explicitly out of scope; shared persisted state is required).

## Users

1. Agents editing shared control-plane files.
2. Maintainer monitoring control-plane coherence and trust posture.
3. Tooling consumers reading `MAILBOX.json`.

## Requirements

## R1. Shared mutable file registry

This contract applies to:

1. `inception/MAILBOX.md`
2. `inception/WORKLOG.md`
3. `inception/OPEN_QUESTIONS.md`
4. `inception/docs/README.md`

Derived artifact rule:

5. `inception/MAILBOX.json` is projection output and must be regenerated whenever `MAILBOX.md` changes (R5).

Lock state is stored in `inception/TURNFILE.yaml` (`locks` section), not in a dedicated `LOCKS.md` file.

## R2. Turnfile lock ledger + revision lease semantics

Before editing any file in R1, an agent must acquire a lock entry in `inception/TURNFILE.yaml` under `locks`.

Required lock fields:

1. `lock_id` (for example, `LOCK-<agent>-<seq>`).
2. `files` (explicit list of locked paths).
3. `holder` (agent id).
4. `acquired_rev` (Turnfile revision after lock write).
5. `lease_revs` (default `2`).
6. `reason` (brief operation summary).

Lock freshness is revision-based:

7. A lock is stale only when `(coordination.revision - acquired_rev) > lease_revs`.
8. Wall-clock timestamps are optional metadata and non-authoritative for lock validity.
9. Lock acquisition and lock release each require a Turnfile write that increments `coordination.revision`.
10. If a waiting agent sees unchanged `coordination.revision` across two consecutive lock checks and remains blocked, it must escalate via R6 rather than continue unbounded retries.
11. Indefinite spin-wait on contested locks is prohibited; blocked lock state must transition to explicit adjudication (`decision-required` or maintainer override).

Locks remain advisory-but-normative: non-holders must avoid editing overlapping files except through the R7 override path.

### R2.1. Deterministic lock acquisition verification

After writing a lock entry, the holder must re-read `TURNFILE.yaml` and verify no overlapping lock has precedence.

Precedence rules:

1. Lower `acquired_rev` wins.
2. If `acquired_rev` ties, lexicographically smaller `lock_id` wins.
3. A losing contender removes its own lock entry, yields, and retries later.

## R3. Transaction update sequence

For each locked shared-file update:

1. Read latest Turnfile state and target files.
2. Acquire lock entry per R2 and verify precedence per R2.1.
3. Apply intended edits in one local transaction.
4. Validate control-plane invariants (R4).
5. Re-check lock validity (still held, no higher-precedence overlap).
6. Write target files.
7. Regenerate projections when required (R5).
8. Release lock by removing the entry from Turnfile (which increments `coordination.revision`).
9. Record completion note (`lock_id`, changed files, resulting revision) in normal control-plane flow.

If any step fails, abort write and execute R6 recovery.

## R4. Control-plane invariants

When `MAILBOX.md` is edited, the transaction must preserve:

1. Inbox unread counts equal unread active-message counts per receiver.
2. Open Queue status mirrors active-message status for each message ID.
3. New message IDs remain monotonic and unique.
4. New message IDs use deterministic allocation: `next_id = (max existing sequence for current date) + 1`, computed from the latest pre-write mailbox read.
5. If ID collision is detected at pre-commit re-check, abort write, re-read mailbox, recompute ID, and retry.
6. Terminal-closed items are either moved to closed summary/archive flow or explicitly retained with rationale.

When `WORKLOG.md` is edited:

7. Top status block remains consistent with the latest substantive entries.

When `OPEN_QUESTIONS.md` is edited:

8. Question state (`active`, `deferred`, `resolved`) remains internally consistent with stated resolution text.

## R5. Projection freshness rule

Any transaction that changes `MAILBOX.md` must regenerate `MAILBOX.json` in the same edit cycle.

Command:

```bash
node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json
```

Projection regeneration is part of transaction completion, not a deferred follow-up.

## R6. Conflict detection and recovery

If an agent detects target-file drift or lock-precedence loss before write completion:

1. Stop the write immediately.
2. Remove own lock if it lost precedence or can no longer be validated.
3. Re-read Turnfile + target files.
4. Reapply intended changes on top of latest state.
5. Revalidate invariants (R4) and lock checks (R2.1).
6. If contention remains ambiguous, post a `decision-required` message for maintainer adjudication.
7. If blocked lock contention persists with unchanged `coordination.revision` across two checks, include `lock_id`, `holder`, `acquired_rev`, and last-seen `coordination.revision` in escalation payload.

Recovery must preserve deterministic precedence rules; no clock-based tie-breaking is allowed.

## R7. Override path

Emergency override is allowed for P0 safety/governance issues:

1. Override action must state reason and impacted lock ID.
2. Override actor (or maintainer) removes/replaces lock entry in Turnfile explicitly.
3. Override actor reconciles all affected invariants and projection freshness rules post-write.
4. Override is logged in `WORKLOG.md` with lock/revision references.

## R8. Integration boundaries

1. PRD-003 defines message lifecycle semantics used by mailbox status fields.
2. PRD-004 defines maintainer decision contract for escalation/override adjudication.
3. PRD-005 governs projection/schema conventions consumed by `MAILBOX.json`.
4. PRD-008 governs payload transport + revision-token integrity for substantive handoffs.
5. PRD-009 governs structured reconciliation flow when conflicts are non-trivial.
6. PRD-013 is canonical for lock ledger location (`TURNFILE.yaml`) and revision-clock semantics (`coordination.revision`, `acquired_rev`, `lease_revs`).

## Proposed workflow

1. Read latest Turnfile + target control-plane file(s).
2. Acquire and verify Turnfile lock lease (R2/R2.1).
3. Execute transaction and invariant checks (R3/R4).
4. Write files and regenerate projection if needed (R5).
5. Release lock in Turnfile and log completion.
6. If contention occurs, execute deterministic recovery (R6).

## Acceptance criteria

1. Two consecutive sessions complete shared-file updates with zero mailbox unread-count drift.
2. No duplicate message IDs are introduced during pilot execution.
3. Every mailbox mutation regenerates `MAILBOX.json` in the same transaction cycle.
4. At least one simulated same-resource contention is resolved via revision precedence + tie-break without data loss.
5. No stale lock remains uncleared beyond `lease_revs` without explicit override rationale.
6. At least one low-activity lock-contention scenario resolves via escalation/override without indefinite waiting.

## Risks

1. Lock ceremony adds latency to small edits.
2. Dual-write overhead (Turnfile + markdown artifacts) may increase operational friction.
3. Turnfile write contention can grow with agent count.
4. Manual invariant checks may still be missed without helper tooling.
5. Revision-clock stale detection can stall under low write activity. Mitigation: bounded retries + explicit escalation in R2/R6.

## Dependencies

1. PRD-003 message lifecycle contract.
2. PRD-004 maintainer decision contract.
3. PRD-005 projection/schema compatibility conventions.
4. PRD-008 payload-first handoff contract.
5. PRD-009 reconciliation contract.
6. PRD-013 Turnfile coordination format and lease semantics.
7. `tools/export-mailbox-json.mjs`.

## Milestones

1. M0: Re-scope PRD-010 to Turnfile lock semantics and gather feedback.
2. M1: Pilot Turnfile-backed lock declarations across one full shared-file phase.
3. M2: Validate invariant checks + at least one deterministic conflict recovery.
4. M3: Add/validate helper tooling for invariant checks and stale-lock detection.
5. M4: Decide canonical adoption path.

## Open questions

All original PRD-010 questions are resolved; two are superseded by PRD-013 integration.

1. ~~Should lock declarations live in mailbox cards or a dedicated `LOCKS.md` file?~~ **Resolved then superseded.** Earlier decision selected dedicated `LOCKS.md`; after PRD-013 integration, lock declarations now live in `TURNFILE.yaml` `locks` section.
2. ~~Should lock expiry be fixed (2 min) or file-type specific?~~ **Resolved then translated.** Earlier decision selected fixed expiry; under no-clock constraints this is represented as revision lease default `lease_revs: 2`.
3. ~~Should `docs/README.md` remain in shared-lock scope or move to PRD-owner-only scope?~~ **Resolved: stays in shared-lock scope.** Applied to R1.
4. ~~Should invariant checks be automated in a helper script?~~ **Resolved: yes.** Captured in M3.

## Exit criteria for moving beyond inception draft

1. Turnfile-backed lock + transaction flow is used for one full cross-review phase with no control-plane drift.
2. Both agents report lower collision overhead during shared-file edits.
3. Maintainer confirms control-plane readability remains high while contention decreases.
4. Team confirms scope is minimal and ready for canonical protocol inclusion.
