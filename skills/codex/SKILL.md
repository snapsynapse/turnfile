---
name: turnfile-codex-collaboration
description: Execute the Turnfile protocol workflow in Codex for mailbox lifecycle, payload-first review exchange, lock-safe shared-file updates, session close/resume, and Turnfile task/lock coordination. Use when the maintainer explicitly asks Codex to run a protocol module or produce an auditable protocol-conforming change.
---

# Turnfile Codex Collaboration

Run modules only on explicit maintainer instruction.

## Version Context

Bundle version: 3
Version date: 2026-06-13
Change summary: Propagated PRD-024 encoding-profile obligations: legible governance records, session-charter opt-in for dense lanes, turn-boundary projection duty, projection authorship, and Maintainer projection/suspension rights.

## Execution Contract

1. Start in propose-only mode.
2. Treat invocation as write permission only when maintainer explicitly includes apply intent (for example, "run and apply").
3. Require explicit maintainer confirmation before any file write if apply intent is absent.
4. Keep all substantive actions audit-visible in `working-session/MAILBOX.md`, `working-session/WORKLOG.md`, or `working-session/TURNFILE.yaml`.
5. Treat Turnfile as a thin governance layer. Do not infer runtime orchestration, memory, sandboxing, identity, or tool-control guarantees from protocol files.

## Active-Turn Boundary Discipline

1. Read `working-session/MAILBOX.md` first for active-turn boundary checks.
2. Re-check `working-session/MAILBOX.md` before declaring completion.
3. Do not declare turn complete if Codex unread count is non-zero.
4. Escalate with explicit blocker context when unread cannot be cleared in-turn.
5. Close or explicitly defer Codex-owned actionable threads before turn completion.
6. Ensure `Open Queue` does not retain stale entries for threads Codex just resolved.

## Startup Orientation Read Order

1. Read `working-session/TURNFILE.yaml`.
2. Read `working-session/WORKLOG.md` status block.
3. Read `working-session/MAILBOX.md` inbox snapshot + assigned unread cards.
4. Read `BASELINE.md` for the current project snapshot when present.
5. Read scope-specific protocol docs and PRDs.
6. Read `working-session/OPEN_QUESTIONS.md` when work affects unresolved or deferred items.

## Session 14 Baseline Rules

1. `SPEC.md` is the normative narrowed protocol contract; `INTENT.md` governs forward strategy; `BASELINE.md` is a ratified point-in-time project snapshot.
2. Promoted PRDs live in `docs/prds/`. Draft, deferred, superseded, and in-review PRDs live in `working-session/docs/`, with `working-session/docs/PRD_STATUS.json` as the status source of truth.
3. Decision mirrors may be closed on posting when they are audit records rather than requests. Do not assume closed mirrors produce unread delivery; if a later sync digest calls one out, acknowledge the digest.
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
4. Own chat file existence checked when boot scope includes artifact validation.

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
2. No partial writes across related control-plane artifacts.
3. Projection regeneration when required.
4. Mailbox invariants validated after mailbox mutations (`node tools/validate-mailbox-invariants.mjs`).

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
