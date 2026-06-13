# PRD-029: Pre-Write State Derivation Contract

Status: Actioned (promoted to docs/prds, session 14, 2026-06-13; implementation done, Claude review APPROVE)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (Codex peer amendments applied)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted-with-amendment | MSG-20260613-036 reviewed by Codex; draft v2 adds freshness receipts, in-lock derivation sequencing, thread-mode support, PRD-027 prerequisite linkage, and OQ-068 resolution |
| Claude acceptance | accepted | author; reviewed Codex draft v2 (freshness receipts, in-lock sequencing R1.4/R1.5, thread-mode R5, OQ-068 derivation-only) and accepted 2026-06-13 — amendments strengthen the contract; risk 4 / R5 anticipated the live MSG-036 thread-mode miss
| Maintainer acceptance | accepted | concept approved in session 14 chat ("all that makes a lot of sense"); Maintainer direct confirmation to Codex on 2026-06-13: acceptance has been expressed for PRD-028 and PRD-029 |
| Eligible for move to `docs/prds` | no | blocked until implementation is done and PRD_STATUS.json has zero blockers |

## Input Provenance Tags

1. `observed`: Session 14 collision/discipline ledger items 3 and 5 — duplicate SIG-050 and duplicate MSG-033 — both caused by an agent allocating an ID from remembered state instead of re-reading inside the lock window.
2. `observed`: Two inbox-snapshot count mismatches in session 14 (Codex unread count, Claude unread count), same root cause: counts computed from memory at write time, caught post-write by the invariants validator.
3. `explicit`: Maintainer 2026-06-13 reviewed the five session-14 improvement proposals and directed drafting ("All that makes a lot of sense to me… Please draft as appropriate").
4. `derived`: PRD-010 R4.4-5 already requires deterministic mailbox ID allocation from a pre-write read; this PRD generalizes that rule to all derived coordination state and makes it tool-assisted instead of discipline-dependent.
5. `explicit`: Maintainer 2026-06-13 directed Codex to make enhancements or suggestions that belong in PRD-029 as the final PRD before PRD-027.
6. `derived`: PRD-003 A1 thread-mode, PRD-004 A1 Maintainer Decision Queue, and PRD-008 A1 structured review replies add new surfaces whose derived state must be mechanically consistent before Tokenese cloning begins.

## Alignment reference

1. `docs/prds/PRD-010-shared-file-transaction-locking.md` (deterministic ID allocation — generalized here)
2. `docs/prds/PRD-013-turnfile-coordination-format.md` (signal IDs, revision counters)
3. `docs/prds/PRD-003-message-lifecycle-sla-contract.md` (inbox snapshot consistency)
4. `docs/prds/PRD-006-session-promotion-pipeline.md` A1 (eval-first implementation)
5. `docs/prds/PRD-004-maintainer-decision-contract.md` A1 (Maintainer Decision Queue discovery surface)
6. `docs/prds/PRD-008-cross-sandbox-handoff-contract.md` A1 (structured blocking and peer-input review channels)
7. `working-session/docs/PRD-027-tokenese-cloned-communication-ab-contract.md` (must remain blocked until this PRD is accepted and implemented)

## Problem

Four times in session 14, an agent wrote shared state derived from memory rather than from the files as they existed inside the lock window: two ID collisions and two snapshot-count mismatches. Every instance was caught by a validator *after* the write and repaired — the safety net held, but each catch cost a repair cycle, and post-write detection means a bad state briefly existed in the record. The failure class is systematic (it survived two explicit WORKLOG "lessons learned"), which makes it a tooling problem, not a discipline problem.

PRD-027 raises the cost of this failure class: once English and Tokenese artifacts are cloned, stale derived state can create mismatched pairs, duplicate references, or unread-count drift across two synchronized layers. PRD-029 is therefore a prerequisite to PRD-027 initiation, alongside PRD-028.

## Goal

1. All derived coordination state — next message ID, next signal ID, inbox snapshot counts, oldest-unread pointers, revision numbers — is computed from file state read inside the active lock window, never from agent memory.
2. Provide one helper that emits all derived values in a single read, so doing it right is cheaper than doing it wrong.
3. Convert the session-14 ledger lessons into permanent regression checks.
4. Add a freshness receipt so helper output cannot be carried across a later write after the source files have changed.
5. Make thread-mode unread resets and Maintainer Decision Queue discovery compatible with mechanical derivation.

## Non-goals

1. Changing any ID format, snapshot format, or revision semantics.
2. Making the helper mandatory for human editors — hand edits remain valid protocol artifacts (INTENT invariant 4); validators still verify the result.
3. Replacing post-write validation. Pre-write derivation and post-write validation are complementary layers.
4. Creating an opaque "agent posts message" wrapper as the first implementation. Explicit file edits remain visible; wrappers may be proposed later if evidence shows the helper alone is insufficient.

## Requirements

## R1. Derivation rule

1. Any write to shared coordination state that includes a derived value (IDs, counts, pointers, revisions) must compute that value from the current file content read after lock acquisition (or, for lock-free single appends permitted elsewhere, immediately before the write).
2. Remembered values from earlier in the turn are invalid inputs for derived state, even if the agent believes nothing has changed.
3. On post-write validation failure of a derived value, the repair must re-derive from files, and the incident is ledgered with its read-point named.
4. Lock acquisition may use an initial read to decide whether a lease is available, but that initial read is not sufficient for derived values written after the lock is acquired.
5. If any shared source file used by the helper changes after derivation and before write, the writer re-runs derivation before writing.

## R2. Helper tool

1. `tools/next-state.mjs` reads `working-session/MAILBOX.md` and `working-session/TURNFILE.yaml` and emits JSON: `next_msg_id` (per PRD-010 R4.4 date-scoped sequence), `next_sig_id`, `next_revision`, and per-agent `{unread, oldest_unread}` snapshot values.
2. The helper is read-only, dependency-light, and usable standalone (`node tools/next-state.mjs`) or piped.
3. Helper output is advisory derivation, not authority: the files remain the source of truth, and validators remain the enforcement layer.
4. Helper output includes a freshness receipt: source file paths, content hashes, current Turnfile revision, and the message/signal maxima used to derive the next IDs.
5. Helper output includes enough structured detail for validator reuse where practical, rather than re-implementing divergent parsing rules.
6. The helper must not write files, acquire locks, close messages, or change lifecycle state.

## R3. Skill propagation

Both agent skill bundles require, in their shared-file transaction modules: inside the lock window, derive IDs/counts via `tools/next-state.mjs` (or an equivalent explicit fresh read when the tool is unavailable, logged as fallback per existing fallback rules).

## R4. Freshness receipt and validation use

1. Shared writes that allocate MSG IDs, SIG IDs, Turnfile revisions, or mailbox snapshot counts must keep the helper freshness receipt visible in the agent's working context until post-write validation passes.
2. The receipt does not need to be pasted into every mailbox card, but review replies or WORKLOG entries for repaired derivation failures must name whether the helper or fallback fresh-read path was used.
3. Validators should compare helper semantics against existing mailbox and Turnfile validators so drift between "pre-write advice" and "post-write enforcement" becomes an eval failure.

## R5. Thread-mode and decision-queue support

1. PRD-003 A1 thread-mode entries that request a response reset the card to `unread` for the counterpart; helper-derived inbox counts must reflect that reset.
2. A thread-mode informational entry does not reset unread state unless it explicitly requests a response.
3. The helper or its eval fixtures must include at least one thread-mode card where the latest entry changes unread status without allocating a new MSG ID.
4. PRD-004 A1 Maintainer Decision Queue remains a WORKLOG discovery surface, not the decision record. PRD-029 implementation may later derive queue candidates from decision-required messages, but the first implementation only needs to avoid making queue state inconsistent with mailbox lifecycle.
5. PRD-008 A1 structured reply channels should be treated as content inside a card, not new lifecycle states. They affect derived state only when the reply asks the counterpart for a response.

## R6. Evals (regression encoding per PRD-006 A1.R3.3)

The eval suite must include, at minimum:

1. Helper emits correct `next_msg_id` / `next_sig_id` against fixtures containing the session-14 collision patterns (gap-free and gapped sequences, same-date multiples).
2. Helper emits snapshot counts matching the invariants validator's expectation on fixtures reproducing both session-14 mismatch cases.
3. Skill bundles contain the R3 obligation text.
4. (Ledger 3/5 regression) A simulated stale-derivation write is detectable: fixture where remembered next-ID differs from file-derived next-ID, asserting the helper returns the file-derived value.
5. Freshness receipt changes when either `MAILBOX.md` or `TURNFILE.yaml` changes after helper output is produced.
6. Thread-mode unread reset fixture from R5.3.
7. Helper read-only behavior: running the helper must not modify any file.

## Acceptance criteria

1. R1 derivation rule documented here and referenced from PRD-010 R4 and PRD-013 R3 contexts (one-line pointers; no semantic change to either).
2. `tools/next-state.mjs` exists, is read-only, emits a freshness receipt, and is covered by the R6 evals.
3. Both skill bundles carry the R3 obligation.
4. All four session-14 incidents (ledger 3, ledger 5, two snapshot mismatches) are representable as eval fixtures that fail without the helper-derived values and pass with them.
5. PRD-027 lists PRD-029 acceptance and implementation `done` as an initiation prerequisite.
6. OQ-068 is resolved for the first implementation as derivation-only, with a later wrapper requiring separate evidence and Maintainer approval.

## Risks

1. Helper drift from validator logic could give false confidence.
   Mitigation: R4.2 pins helper output to validator expectations in the same eval run; any divergence is a red eval.
2. Tool dependence could erode hand-editability.
   Mitigation: non-goal 2 and R2.3 — files stay authoritative, hand edits stay valid, validators still arbitrate.
3. Helper output could become stale between derivation and write.
   Mitigation: R2.4 and R4 require freshness receipts and re-derivation when source files change.
4. Thread-mode could hide unread work inside an already-known MSG ID.
   Mitigation: R5 and eval fixtures require unread resets without allocating a new MSG ID.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-068 | Should next-state derivation eventually be wrapped into a single "post message" helper (derive + write + validate in one command), or stay derivation-only to preserve explicit agent writes? | Resolved for first implementation: derivation-only. A full write wrapper may be proposed later only after PRD-029 evidence shows repeated helper-bypass or wrapper-worthy friction, and it must preserve explicit reviewable file diffs. | R2, R4 |
