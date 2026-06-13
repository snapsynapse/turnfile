# PRD-029: Pre-Write State Derivation Contract

Status: Draft v1 (working-session; Claude-authored, awaiting Codex cross-review)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (session 14 draft by Claude)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | review to be routed after Codex completes claimed implementation lanes |
| Claude acceptance | pending | author; acceptance after cross-review cycle |
| Maintainer acceptance | pending | concept approved in session 14 chat ("all that makes a lot of sense"); document acceptance pending |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers + implementation done (PRD-006 A1) |

## Input Provenance Tags

1. `observed`: Session 14 collision/discipline ledger items 3 and 5 — duplicate SIG-050 and duplicate MSG-033 — both caused by an agent allocating an ID from remembered state instead of re-reading inside the lock window.
2. `observed`: Two inbox-snapshot count mismatches in session 14 (Codex unread count, Claude unread count), same root cause: counts computed from memory at write time, caught post-write by the invariants validator.
3. `explicit`: Maintainer 2026-06-13 reviewed the five session-14 improvement proposals and directed drafting ("All that makes a lot of sense to me… Please draft as appropriate").
4. `derived`: PRD-010 R4.4-5 already requires deterministic mailbox ID allocation from a pre-write read; this PRD generalizes that rule to all derived coordination state and makes it tool-assisted instead of discipline-dependent.

## Alignment reference

1. `docs/prds/PRD-010-shared-file-transaction-locking.md` (deterministic ID allocation — generalized here)
2. `docs/prds/PRD-013-turnfile-coordination-format.md` (signal IDs, revision counters)
3. `docs/prds/PRD-003-message-lifecycle-sla-contract.md` (inbox snapshot consistency)
4. `docs/prds/PRD-006-session-promotion-pipeline.md` A1 (eval-first implementation)

## Problem

Four times in session 14, an agent wrote shared state derived from memory rather than from the files as they existed inside the lock window: two ID collisions and two snapshot-count mismatches. Every instance was caught by a validator *after* the write and repaired — the safety net held, but each catch cost a repair cycle, and post-write detection means a bad state briefly existed in the record. The failure class is systematic (it survived two explicit WORKLOG "lessons learned"), which makes it a tooling problem, not a discipline problem.

## Goal

1. All derived coordination state — next message ID, next signal ID, inbox snapshot counts, oldest-unread pointers, revision numbers — is computed from file state read inside the active lock window, never from agent memory.
2. Provide one helper that emits all derived values in a single read, so doing it right is cheaper than doing it wrong.
3. Convert the session-14 ledger lessons into permanent regression checks.

## Non-goals

1. Changing any ID format, snapshot format, or revision semantics.
2. Making the helper mandatory for human editors — hand edits remain valid protocol artifacts (INTENT invariant 4); validators still verify the result.
3. Replacing post-write validation. Pre-write derivation and post-write validation are complementary layers.

## Requirements

## R1. Derivation rule

1. Any write to shared coordination state that includes a derived value (IDs, counts, pointers, revisions) must compute that value from the current file content read after lock acquisition (or, for lock-free single appends permitted elsewhere, immediately before the write).
2. Remembered values from earlier in the turn are invalid inputs for derived state, even if the agent believes nothing has changed.
3. On post-write validation failure of a derived value, the repair must re-derive from files, and the incident is ledgered with its read-point named.

## R2. Helper tool

1. `tools/next-state.mjs` reads `working-session/MAILBOX.md` and `working-session/TURNFILE.yaml` and emits JSON: `next_msg_id` (per PRD-010 R4.4 date-scoped sequence), `next_sig_id`, `next_revision`, and per-agent `{unread, oldest_unread}` snapshot values.
2. The helper is read-only, dependency-light, and usable standalone (`node tools/next-state.mjs`) or piped.
3. Helper output is advisory derivation, not authority: the files remain the source of truth, and validators remain the enforcement layer.

## R3. Skill propagation

Both agent skill bundles require, in their shared-file transaction modules: inside the lock window, derive IDs/counts via `tools/next-state.mjs` (or an equivalent explicit fresh read when the tool is unavailable, logged as fallback per existing fallback rules).

## R4. Evals (regression encoding per PRD-006 A1.R3.3)

The eval suite must include, at minimum:

1. Helper emits correct `next_msg_id` / `next_sig_id` against fixtures containing the session-14 collision patterns (gap-free and gapped sequences, same-date multiples).
2. Helper emits snapshot counts matching the invariants validator's expectation on fixtures reproducing both session-14 mismatch cases.
3. Skill bundles contain the R3 obligation text.
4. (Ledger 3/5 regression) A simulated stale-derivation write is detectable: fixture where remembered next-ID differs from file-derived next-ID, asserting the helper returns the file-derived value.

## Acceptance criteria

1. R1 derivation rule documented here and referenced from PRD-010 R4 and PRD-013 R3 contexts (one-line pointers; no semantic change to either).
2. `tools/next-state.mjs` exists, is read-only, and is covered by the R4 evals.
3. Both skill bundles carry the R3 obligation.
4. All four session-14 incidents (ledger 3, ledger 5, two snapshot mismatches) are representable as eval fixtures that fail without the helper-derived values and pass with them.

## Risks

1. Helper drift from validator logic could give false confidence.
   Mitigation: R4.2 pins helper output to validator expectations in the same eval run; any divergence is a red eval.
2. Tool dependence could erode hand-editability.
   Mitigation: non-goal 2 and R2.3 — files stay authoritative, hand edits stay valid, validators still arbitrate.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-068 | Should next-state derivation eventually be wrapped into a single "post message" helper (derive + write + validate in one command), or stay derivation-only to preserve explicit agent writes? | open | R2 |
