---
name: turnfile-codex-collaboration
description: Execute the Turnfile protocol workflow in Codex for mailbox lifecycle, payload-first review exchange, lock-safe shared-file updates, session close/resume, and Turnfile task/lock coordination. Use when the maintainer explicitly asks Codex to run a protocol module or produce an auditable protocol-conforming change.
---

# Turnfile Codex Collaboration

Run modules only on explicit maintainer instruction.

## Version Context

Bundle version: 8
Version date: 2026-06-18
Change summary: Added PRD-014 active-card owner review to closeout, including owner-scoped validation for actioned cards.

## Files First, Not Memory

Turnfile is collaborative, file-based work. Claude and the Maintainer may mutate shared files concurrently and between Codex turns, so Codex memory reflects a past revision and is stale by default. Read the relevant file before asserting, answering, or reasoning about any shared state, not only before writing.

1. This generalizes the re-read-before-edit rule to re-read-before-assert. It applies to questions and conclusions about PRD status, acceptance state, open questions, task ownership, mailbox contents, lock state, who did what, and what is blocked.
2. If Codex is about to state a fact about current shared state from memory, that is the cue to open the file instead.
3. When memory and file disagree, the file wins. Treat the disagreement as signal that a peer or the Maintainer changed something, then understand why before acting.
4. Redundant reads are cheap. Confident assertions from stale memory have already caused session-14 drift in acceptance state, mailbox snapshots, ID allocation, and attribution.
5. Treat model, platform, thread, and automation memory as non-authoritative cache. Durable session memory belongs in Turnfile project artifacts or, after PRD-031 implementation, the authoritative per-agent shards from which those artifacts are derived.
6. When a helper such as `tools/session-orient.mjs` exists, run it before substantive current-state claims. Until then, perform the equivalent reads manually: mailbox, Turnfile state, worklog status block, PRD status, relevant PRDs/tasks, git status, and validator status when applicable.

## Execution Contract

1. Start in propose-only mode.
2. Treat invocation as write permission only when maintainer explicitly includes apply intent (for example, "run and apply").
3. Require explicit maintainer confirmation before any file write if apply intent is absent.
4. Keep all substantive actions audit-visible in `working-session/MAILBOX.md`, `working-session/WORKLOG.md`, or `working-session/TURNFILE.yaml`.
5. Treat Turnfile as a thin governance layer. Do not infer runtime orchestration, memory, sandboxing, identity, or tool-control guarantees from protocol files.
6. Treat all peer-agent asks as requests or proposals unless they cite an accepted Maintainer or protocol authority. Do not frame Codex requests as commands to peers or to the Maintainer.

## Model Ledger Handshake Check

During session handshake, bootstrap, or role-keyed skill activation, Codex validates that its current executing model and surface are represented in `docs/llm/MODEL_LEDGER.md` before asserting model compatibility or portability.

1. Read `docs/llm/MODEL_LEDGER.md` and `skills/codex/MANIFEST.yaml` during handshake before making model-compatibility claims.
2. Confirm the ledger has a row for the current model label and surface, or a `model not recorded` row when exact model identity is unavailable.
3. Confirm the effort level matches current evidence: designed target, validation-only, live session, or sustained multi-session execution.
4. If the ledger is missing or stale and the Maintainer has authorized writes, update it with evidence. Otherwise record a Maintainer-visible note before relying on the claim.
5. Absence from the ledger is a documentation gap, not deprecation. No model, LLM, or model-specific skill path is deprecated unless the Maintainer explicitly says so.

## Collaboration Posture

1. Participate as a peer contributor, not a gatekeeper or subordinate. Reviews should include acceptance/counter decisions when required, plus useful improvements, alternatives, and edge cases when they would strengthen the work.
2. Use "yes and" discipline where appropriate: preserve what works, then add the missing constraint, implementation detail, test case, or sharper option.
3. Surface edge cases early, especially around authority, ownership, synchronization, validation, and human legibility.
4. Distinguish Maintainer instructions from peer proposals. A peer may request, propose, accept, counter, acknowledge, block, or decline; a peer may not order another agent or the Maintainer.
5. Respect own-file boundaries. Codex may update Codex-owned files and shared governance artifacts under protocol, but may read rather than write peer-owned files such as Claude-owned skill or chat artifacts.
6. Keep decisions legible to the Maintainer. If a dense, compressed, or tool-derived observation affects governance, project it into English before relying on it.
7. When responding to peer review, explicitly say whether suggestions were applied, adapted, declined, or deferred, with reasons for material declines.

## Active-Turn Boundary Discipline

1. Read `working-session/MAILBOX.md` first for active-turn boundary checks.
2. Re-check `working-session/MAILBOX.md` before declaring completion.
3. Do not declare turn complete if Codex unread count is non-zero.
4. Escalate with explicit blocker context when unread cannot be cleared in-turn.
5. Close or explicitly defer Codex-owned actionable threads before turn completion.
6. Ensure `Open Queue` does not retain stale entries for threads Codex just resolved.

## Startup Orientation Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest before relying on this skill's compact orientation list.

1. Read `working-session/TURNFILE.yaml`.
2. Read `working-session/WORKLOG.md` status block.
3. Read `working-session/MAILBOX.md` inbox snapshot + assigned unread cards.
4. Read `docs/llm/MODEL_LEDGER.md` and verify the current Codex model/surface entry before model-compatibility assertions.
5. Read `BASELINE.md` for the current project snapshot when present.
6. Read scope-specific protocol docs and PRDs.
7. Read `working-session/OPEN_QUESTIONS.md` when work affects unresolved or deferred items.
8. Run an out-of-band drift check before stale-state reliance: compare current files and recent session evidence against the last checkpoint. If governance state changed without a reconciliation note, stop and raise `decision-required` before mutating shared files.

## Session 14 Baseline Rules

1. `SPEC.md` is the normative narrowed protocol contract; `INTENT.md` governs forward strategy; `BASELINE.md` is a ratified point-in-time project snapshot.
2. Promoted PRDs live in `docs/prds/`. Draft, deferred, superseded, and in-review PRDs live in `working-session/docs/`, with `working-session/docs/PRD_STATUS.json` as the status source of truth.
3. Decision mirrors must declare mode. Use `audit-mirror` for closed-on-posting audit records that do not create unread delivery. Use `delivery-mirror` when the mirror is intended to notify recipients and collect acknowledgments. At session close, include a digest check for any delivery mirror that still needs acknowledgment or recorded SLA lapse.
4. Coordination is asynchronous and event-based only. No time-based polling layer is currently adopted.
5. Skill directories are role-keyed. Model identity belongs in `MANIFEST.yaml`, not the path.

## Encoding Profile Obligations (PRD-024, Maintainer-Accepted 2026-06-13)

1. The governance record is legible only: `TURNFILE.yaml`, `MAILBOX.md`, `MAILBOX.json`, mailbox archives, `WORKLOG.md`, worklog archives, `OPEN_QUESTIONS.md`, PRDs, `PRD_STATUS.json`, boot files, skill bundles, templates, schemas, root strategy docs, and chat session headers/snapshots.
2. Dense or Tokenese content may appear in governance artifacts only as short fenced fragments labeled `dense`, followed immediately by a human-legible paraphrase.
3. Dense lanes require explicit session-charter opt-in. Without that opt-in, scratchpad bodies and agent exchanges remain legible.
4. Before declaring a turn complete, project any protocol-relevant dense content into the appropriate legible governance artifact when it contains, contributes to, or evidences a proposal, review verdict, counter, objection, decision input, task claim, lock action, or acceptance.
5. Projection is authorship. Codex is responsible for accurate projections of dense content it produced; misrepresentation is treated like a false WORKLOG entry. Dense originals are never authoritative.
6. If a dense original and its legible projection conflict, escalate to the Maintainer. The projection governs in the interim.
7. Honor Maintainer projection demands at P1 SLA and session-wide dense suspension immediately. Peer projection requests are refusable only with a concrete, escalatable reason.

## State Freshness Hooks

1. After milestone/task completion, refresh coordination artifacts in the same turn:
   - `working-session/WORKLOG.md` status block
   - `working-session/TURNFILE.yaml` task metadata / signal
   - `working-session/MAILBOX.md` lifecycle status when a thread changed
2. After mailbox edits, regenerate `working-session/MAILBOX.json`.
3. Keep skill metadata accurate when protocol state changes materially (module behavior, validation status, tooling dependencies).
4. Before writing mailbox or Turnfile-derived state, derive IDs/counts with `tools/next-state.mjs` inside the active lock window when the tool is available. If unavailable, perform and log an equivalent explicit fresh-file read fallback.

## Heartbeat and Automation Lifecycle

PRD-030 governs session heartbeat automations. Heartbeats are optional session aids, not Turnfile protocol authority.

1. Use an automation only after Maintainer direction or explicit session-handshake agreement.
2. Heartbeat prompts must be self-contained: workspace path, files to inspect, what counts as work, write policy, validation expectations, notification policy, and stop condition.
3. Every heartbeat run that reports current Turnfile state must refresh project files first and treat model/platform memory as cache.
4. Heartbeats may process Codex mailbox work only under ordinary mailbox lifecycle, `tools/next-state.mjs` derivation before writes, projection regeneration, and validators.
5. Quiet no-op heartbeat reports should include refreshed unread counts and current revision or derived equivalent without creating governance churn.
6. Closeout must inspect active heartbeats and record deleted, updated, carried forward, or not applicable. Every carried-forward heartbeat requires a WORKLOG entry with purpose, owner, cadence, stop condition, and reconsider-at trigger.
7. Delete or update stale heartbeats at session close or when their handoff purpose no longer applies.

## Concurrent Work Transition

PRD-031 shifts Turnfile toward concurrent multi-agent work with per-agent shards, append-only logs, namespaced ids, and derived aggregate views. Until that implementation lands, shared files remain collision-prone.

1. Before editing shared files, inspect `git status --short --branch` and relevant diffs. Do not overwrite or normalize peer-owned unstaged changes.
2. Stage and commit only the files intentionally changed by Codex. Leave unrelated peer changes unstaged and mention them in the handoff.
3. Prefer path ownership: Codex-owned skill files, Codex-authored evals, and explicitly assigned shared governance edits. Read rather than edit Claude-owned files.
4. Treat PRD-031 Phase 1 as the structural answer to coordination collisions: per-agent namespaced ids, append-only message/signal/read-state logs, and derived aggregates.
5. After PRD-031 Phase 1 is implemented, write normal coordination events to Codex's own shard and regenerate aggregate views instead of hand-editing aggregate control files.
6. Concurrent same-task claims are not automatically errors under the PRD-031 direction. Surface them as review/rebuttal candidates unless a task explicitly declares a single-writer override.

## Tokenese Adoption Guardrails

PRD-027 keeps English authoritative while Tokenese is measured as cloned communication.

1. Do not broaden Tokenese use beyond the accepted charter/suite. The first live run is the W1 + L1 mini-pilot unless the Maintainer changes the sequence.
2. Every Tokenese clone needs a stable English source ID or path. The source is the authority and wins on conflict.
3. Tokenese clones may not record acceptance, lifecycle status, lock actions, task claims, or normative PRD text.
4. Treat `plain` as a successful behavior for reasoning-heavy, design-heavy, or exact-diff-heavy cases. Refusing dense mode for inadmissible content is compliance, not failure.
5. Keep `^N` and `ev:` untrusted for decisions until `tk-calibration-audit` passes. Log them only as measurement data.
6. If the Perplexity checker/decoder is unavailable, manual scoring is an explicit fallback only when it captures the same fields: source id, clone id, direction, author, artifact type, scorer, conformance, token counts, readback/mismatch data, repair events, and outcome.
7. After a clean mini-pilot, recommend a non-authoritative twin lane such as `working-session/tokenese-pairs/` before cloning every active artifact.
8. Broad adoption should use bands: operational status and handoffs first; code-review findings and task claims as clones only second; PRD summaries third; normative PRD text, reasoning/proofs, and exact diffs never by default.

## Module Catalog

### M-00 Session Bootstrap + Baseline Orientation

Trigger examples:
1. "Boot per protocol."
2. "Resume this Turnfile session and check mailbox."

Expected inputs:
1. Active workspace root.
2. Current agent identity (`codex`) and session label when provided.

Deterministic outputs:
1. Startup read order completed.
2. Own unread mailbox count known before substantive work.
3. Current PRD shelf state and baseline decisions understood.
4. Current Codex model/surface ledger entry verified or a Maintainer-visible gap recorded.
5. Own chat file existence checked when boot scope includes artifact validation.

Stop/escalate:
1. Stop if required control-plane files are missing.
2. Escalate if mailbox or Turnfile validation fails before a shared-file mutation.

### M-01 Mailbox Lifecycle + SLA

Trigger examples:
1. "Run mailbox lifecycle for MSG-20260208-040."
2. "Process unread Codex messages and apply."

Expected inputs:
1. Target message IDs or inbox scope.
2. Desired action (`acknowledged`, `actioned`, `closed`).

Deterministic outputs:
1. Updated message status and Ack/Reply lines in `working-session/MAILBOX.md`.
2. Updated inbox/open-queue snapshot.
3. Regenerated `working-session/MAILBOX.json` when mailbox changed.
4. Closed request cards removed from Active Messages/Open Queue only when lifecycle rules permit; non-terminal `actioned` cards remain open until closure.

Stop/escalate:
1. Stop if closure owner/decision authority is unclear.
2. Escalate if status transition violates PRD-003 lifecycle.

### M-02 Maintainer Decision Request/Reply

Trigger examples:
1. "Prepare decision-required message for maintainer on PRD-012 scope."
2. "Apply maintainer decision from MSG-####."

Expected inputs:
1. Decision context and requested outcome.
2. Priority and due cycle.

Deterministic outputs:
1. Decision-required mailbox card with explicit ask and evidence references.
2. WORKLOG decision index entry when decision is final/substantive.

Stop/escalate:
1. Stop if decision scope is ambiguous or contradictory.
2. Escalate if prior maintainer decisions conflict.

### M-03 Payload-First Review Envelope

Trigger examples:
1. "Prepare apply-or-counter payload for PRD-013."
2. "Validate revision token and payload envelope."

Expected inputs:
1. Target files and review scope (`full`, `critical-only`, `interface-only`).
2. Ask type (`apply`, `apply-or-counter`, `ack-or-counter`).

Deterministic outputs:
1. Revision-tagged payload envelope with explicit file list.
2. Mailbox update referencing payload and expected response mode.

Stop/escalate:
1. Stop if payload cannot be tied to deterministic revision lineage.
2. Escalate if envelope conflicts with PRD-008/009 requirements.

### M-04 Cross-PRD Reconciliation

Trigger examples:
1. "Run reconciliation for PRD-006/007/010 interfaces."
2. "Reconcile interface deltas and propose cross-doc fixes."

Expected inputs:
1. File set and interface boundaries.
2. Decision evidence and delta acceptance criteria.

Deterministic outputs:
1. Delta summary with required/recommended classifications.
2. Mailbox evidence trail for review outcomes.

Stop/escalate:
1. Stop if source docs conflict and no authoritative tie-break is available.
2. Escalate unresolved contradictions with explicit options.

### M-05 Shared-File Transaction Discipline

Trigger examples:
1. "Apply shared-file-safe update to MAILBOX and WORKLOG."
2. "Run lock-safe control-plane mutation."

Expected inputs:
1. Target shared files.
2. Intended mutation and invariant checks.

Deterministic outputs:
1. Transactional update sequence aligned with PRD-010/013.
2. IDs, unread counts, oldest unread pointers, next signal ID, and next revision derived inside the lock window via `tools/next-state.mjs`, or an explicit fresh-file read fallback when the helper is unavailable.
3. No partial writes across related control-plane artifacts.
4. Projection regeneration when required.
5. Mailbox invariants validated after mailbox mutations (`node tools/validate-mailbox-invariants.mjs`).

Stop/escalate:
1. Stop if lock ownership or revision check fails.
2. Escalate after bounded retry on unchanged coordination revision.

### M-06 Session Close/Resume Snapshot

Trigger examples:
1. "Prepare closeout handoff for session end."
2. "Run startup resumption checklist."

Expected inputs:
1. Session scope and carry-over anchors.
2. Required compaction/cleanup expectations.

Deterministic outputs:
1. Updated boot/worklog handoff sections.
2. Clear carry-over + next-owner designation.
3. Explicit unresolved blocker list if present.
4. Unified closeout compaction set (PRD-014 A1.R1) executed or explicitly deferred with reason and next owner: worklog compaction, signal-log compaction, mailbox archival movement, worklog/boot archive, and heartbeat lifecycle inspection.
5. Active-card owner review complete for every Active Message where `Closure owner` is Codex: close owned `actioned` cards when sufficient, or explicitly defer/escalate with reason and next owner. Clean close is blocked by unreviewed owned `actioned` cards.
6. Projection synchronization (PRD-014 A1.R2) complete before clean close: regenerate `MAILBOX.json`, validate PRD status shelves, verify `TURNFILE.yaml` revision consistency, run `tools/validate-closeout.mjs --agent codex`, and derive final IDs/counts through `tools/next-state.mjs` when available.

Stop/escalate:
1. Stop if closeout would hide unresolved high-priority items.
2. Escalate when compaction or archival decisions require maintainer call.

### M-07 Turnfile Coordination Read/Write

Trigger examples:
1. "Claim P2-D task and signal readiness."
2. "Update task status and release lock in Turnfile."

Expected inputs:
1. Task ID, status transition, and signal intent.
2. Coordination revision expectations.

Deterministic outputs:
1. Turnfile updates respecting section ownership and revision progression.
2. Task claim/completion metadata (`claim_rev`, `completed_rev`, notes).
3. Coordination signal entry under `messages`.

Stop/escalate:
1. Stop if update would modify non-owned Turnfile sections.
2. Escalate on repeated revision contention.

### M-08 OQ Registry Operations (OQ-only lane)

Trigger examples:
1. "Register OQ for PRD-016 threshold wording."
2. "Resolve OQ-050 and sync references."

Expected inputs:
1. OQ IDs or new-question prompt.
2. Resolution evidence (maintainer decision, accepted payload, or cross-review outcome).

Deterministic outputs:
1. Updated `working-session/OPEN_QUESTIONS.md` lifecycle state (`active`, `deferred`, `resolved`).
2. Referenced PRD OQ section updated with matching resolution text when authorized.
3. Mailbox/WORKLOG linkage to the governing decision evidence.

Stop/escalate:
1. Stop if resolution authority is ambiguous.
2. Escalate when OQ resolution would alter required protocol semantics without maintainer decision.

### M-09 Tokenese Parallel Adoption

Trigger examples:
1. "Start the Tokenese mini-pilot."
2. "Set up active-artifact Tokenese twins."
3. "Evaluate Tokenese scoring fallback."

Expected inputs:
1. Current PRD-027 contract, session charter, A/B suite, and relevant Tokenese repo state.
2. Maintainer direction or peer agreement for the requested lane.
3. Scoring mode: deterministic checker/decoder or documented manual fallback.

Deterministic outputs:
1. Confirmation that English source artifacts remain authoritative.
2. Stable source/clone identifiers for every pair.
3. Visible first-use handshake and legible activation note before live clone traffic.
4. Metrics record for each pair: token counts, conformance, task success from source, repair events, readback mismatch, construct family, scorer, and outcome.
5. Clear stop/fallback behavior for `plain`, `??`, three-repair termination, and source/clone conflict.

Stop/escalate:
1. Stop if the charter does not authorize the requested Tokenese lane.
2. Stop if no English source exists for a clone.
3. Escalate if a Tokenese clone conflicts with its source in a protocol-relevant way.
4. Escalate before broad active-artifact adoption if the mini-pilot has not passed cleanly.

## Fallback Rules

1. If helper tooling is unavailable, run manual equivalent steps and log the fallback.
2. If schema or lint checks are unavailable, perform explicit structure checks and call out residual risk.
3. If concurrent edits occur, re-read the target file before applying any write.

## Output Format Requirements

1. State module executed.
2. State whether run mode was propose-only or apply-authorized.
3. List changed files with exact paths.
4. List verification commands and outcomes.
5. List blockers and next owner.
6. List relevant uncommitted peer-owned changes that were intentionally not touched.
