# PRD-031: Enforced Shared-File Mutual Exclusion Contract

Status: Draft (working-session)
Owner: Maintainer + Claude (proposer) + Codex (reviewer)
Date: 2026-06-16

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | Routed for apply-or-counter in MSG-20260616-013 |
| Claude acceptance | pending | Author of draft v1 |
| Maintainer acceptance | pending | Maintainer directed "add a real mutex" 2026-06-16 after the session-15/16 concurrent-edit collision |
| Eligible for move to `docs/prds` | no | Agent + Maintainer acceptance pending |

## Input Provenance Tags

1. `explicit`: Maintainer asked why concurrent edits were possible under the lock protocol and directed adding a real (enforced) mutex.
2. `derived`: PRD-010 (shared-file transaction locking) and PRD-013 R1.3/R3.3 (revision-lease locks in `TURNFILE.yaml`) define the current lock, which is advisory/cooperative.
3. `derived`: PRD-029 (pre-write state derivation) reduces stale-value writes but does not provide mutual exclusion.
4. `derived`: PRD-030 R9 (Turnfile memory boundary) mandates file refresh before writes but, likewise, does not enforce exclusion.

## Problem

The current lock (PRD-010 + PRD-013) is an advisory convention recorded in `TURNFILE.yaml` `locks`. It prevents concurrent edits only if every writer voluntarily performs acquire-before-write. It cannot enforce mutual exclusion, for three structural reasons:

1. **Advisory, not enforced.** The lock is a YAML entry. Nothing mechanically blocks a write. A writer that skips the check faces no barrier.
2. **The acquire step is itself a race (TOCTOU).** Acquiring the lock means writing `TURNFILE.yaml` — the very shared file being protected. Two agents can both read `locks: {}` simultaneously and both write a lock entry; last-writer-wins. The revision lease detects staleness after the fact; it does not prevent the simultaneous grab.
3. **One working tree, two live processes.** When two agents run concurrently against the same filesystem, a file-based advisory lock is not an OS-level mutex and git's index is not a coordination primitive.

Documented evidence: during the session-15/16 continuation (TURNFILE rev 149-151, 2026-06-16), Claude began editing control-plane files without acquiring a lock while Codex concurrently acquired a (malformed) lock and edited the same files. Both sets of uncommitted edits coexisted in one working tree and resolved only by last-writer-merge at commit, not by the protocol. Proximate cause was a skipped acquire; the enabling condition was that acquisition is unenforced and racy.

## Goal

1. Provide enforced single-writer mutual exclusion for the control-plane shared files on a single shared filesystem.
2. Make acquire-before-write a mechanized, hard-to-skip step rather than a discipline.
3. Eliminate the TOCTOU race by making lock acquisition atomic at the OS level.
4. Preserve the existing legible `TURNFILE.yaml` lock record (who/why/what) as the human- and agent-readable intent layer.
5. Provide deterministic stale-lock recovery.

## Non-goals

1. Cross-machine / distributed locking. This contract targets the single-shared-filesystem deployment (both agents on one host/tree). A distributed broker or git-ref-based lock is noted as future scope (OQ-1).
2. Replacing the `TURNFILE.yaml` legible lock record. The enforced mutex complements it; the legible entry stays as the audit/intent surface.
3. Locking non-control-plane files (source, docs, evals) — those follow ordinary commit-own-paths discipline.
4. Replacing PRD-029 derivation or PRD-030 R9 refresh discipline; this contract adds enforcement beneath them.

## Control-plane file set

The mutex guards the co-edited, cross-referential control-plane set as one unit (per-file locks do not help because edits span files):
`working-session/TURNFILE.yaml`, `working-session/MAILBOX.md`, `working-session/MAILBOX.json`, `working-session/WORKLOG.md`, `working-session/docs/PRD_STATUS.json`.

## Requirements

## R1. Atomic OS-level acquisition

1. A single global control-plane write-lock is acquired via an atomic operation that cannot race: create a sentinel lock file with exclusive semantics (`open(..., O_CREAT | O_EXCL)`) or an equivalent `flock`-style advisory-but-atomic primitive.
2. The sentinel lives at a fixed path (e.g., `working-session/.turnfile-write.lock`) that is distinct from any guarded file, so acquiring it does not itself race on a guarded file.
3. If the sentinel already exists (held), acquisition fails immediately; the caller waits and retries with bounded backoff or aborts with a blocker report. There is no last-writer-wins on the sentinel.

## R2. Mechanized acquire-before-write

1. A helper tool (`tools/turnfile-lock.mjs acquire|release|status`) is the sole sanctioned path for control-plane writes. `acquire` performs the atomic sentinel create AND writes the legible `TURNFILE.yaml` `locks` entry in one flow.
2. Agents must call `acquire` before the first control-plane edit of a batch and `release` after commit. Skipping the helper is the only bypass; skills mandate it as the single write path.
3. `acquire` fails closed: if the sentinel exists and is not stale, it does not proceed.

## R3. Lock record contents

The sentinel and the legible `TURNFILE.yaml` entry record: holder agent id, session id, acquired revision, acquired wall-clock timestamp, process identifier (for liveness), lease (revisions), and reason. The legible entry conforms to the existing `lock_entry` schema (`files`, `holder`, `acquired_rev`, `lease_revs`, `reason`).

## R4. Stale-lock recovery

1. A lock is reclaimable when stale: `(coordination.revision - acquired_rev) > lease_revs` (PRD-013 R3.3) OR the holder process is provably not live OR a wall-clock fallback timeout elapses.
2. Reclaiming a stale lock is a logged override (signal + WORKLOG note), never silent.
3. Reclaim is itself atomic (remove-then-create or compare-and-swap on the sentinel).

## R5. Scope and release discipline

1. The whole batch is locked up front; release happens only after the batch is committed.
2. `release` removes the sentinel and clears the `TURNFILE.yaml` entry in one flow.
3. A crash between acquire and release leaves a stale sentinel, recovered per R4.

## R6. Compatibility with existing protocol

1. The legible `TURNFILE.yaml` lock (PRD-010/PRD-013) is retained as the intent/audit record; this contract adds an enforcement layer beneath it.
2. PRD-029 derivation runs inside the held lock window; PRD-030 R9 file refresh runs immediately after acquire.
3. Validators (`turnfile-lint`, `validate-mailbox-invariants`) run before release.

## R7. Failure reporting

1. Acquisition contention reports a blocker (not a silent retry loop forever): bounded retries, then escalate.
2. A detected concurrent-edit (sentinel held by a live peer) is a normal wait condition, not an error.
3. A detected stale/orphaned sentinel is reported once on reclaim.

## R8. Limits stated honestly

1. This is enforced only on a single shared filesystem. Two agents on different machines editing one logical tree are out of scope (OQ-1).
2. The mutex protects ordering/exclusion, not semantic correctness; PRD-029 and PRD-030 R9 remain required for value freshness.

## Acceptance criteria

1. `tools/turnfile-lock.mjs` provides `acquire`, `release`, `status` with atomic `O_EXCL` (or equivalent) sentinel semantics.
2. An eval spawns two concurrent `acquire` attempts and asserts exactly one succeeds and the other waits/fails deterministically (no both-win).
3. `acquire` writes both the sentinel and a schema-valid `TURNFILE.yaml` `locks` entry; `release` clears both.
4. A simulated stale lock (lease exceeded or dead holder) is reclaimable with a logged override, and reclaim is atomic.
5. Skills (`skills/claude`, `skills/codex`) mandate the helper as the single sanctioned control-plane write path.
6. A worked example demonstrates a second writer blocked while the first holds the lock, then proceeding after release.

## Risks

1. Stale sentinel after a crash blocks all writers.
   Mitigation: R4 stale recovery (lease + liveness + wall-clock fallback), logged override.
2. Helper becomes a bottleneck under rapid cadence.
   Mitigation: short critical sections (acquire -> derive -> edit -> validate -> commit -> release); bounded backoff.
3. Agents bypass the helper and edit directly.
   Mitigation: skills make the helper the sole sanctioned path; reviews flag direct control-plane edits.

## Dependencies

1. PRD-010 shared-file transaction locking (advisory layer retained).
2. PRD-013 Turnfile coordination format (lock_entry schema, revision lease).
3. PRD-029 pre-write state derivation (runs inside the lock window).
4. PRD-030 R9 Turnfile memory boundary (refresh on acquire).

## Open questions

1. OQ-1: Cross-machine / distributed exclusion — is a git-ref atomic-update lock or a single-writer broker wanted as a follow-on, or is single-filesystem enforcement sufficient for the foreseeable deployment?
2. OQ-2: Should the enforced mutex be mandatory for ALL control-plane writes, or only when `agents` shows more than one `active` agent (single-active-agent fast path)?
