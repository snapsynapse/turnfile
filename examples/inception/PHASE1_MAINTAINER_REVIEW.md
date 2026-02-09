# Phase 1 Maintainer Review — PRD-003, PRD-004, PRD-008, PRD-009

**Date:** 2026-02-08
**Prepared by:** Claude
**Review scope:** Canonical readiness assessment for Phase 1 batch
**Action required:** Approve, revise, or defer each PRD for canonical promotion

---

## Executive Summary

Phase 1 contains four PRDs that define the core coordination contracts for the SNAP protocol. Together they answer: *How do messages move through the system, how does the maintainer make decisions, how do agents exchange content across sandboxes, and how do agents reconcile shared documents?*

All four PRDs have been:
- Drafted by their assigned owner
- Cross-reviewed by the peer agent
- All open questions resolved by maintainer decision
- Revision-history attributed where semantic changes were applied

**Current status:** All four are finalized at inception level. No active open questions remain for these PRDs. Two deferred questions exist (OQ-003, OQ-026) but neither blocks Phase 1.

---

## How to Use This Document

For each PRD, this review provides:

1. **What it does** — one-paragraph summary
2. **Key decisions you already made** — your OQ resolutions applied to the PRD
3. **Cross-PRD dependency audit** — confirms interfaces are aligned
4. **Acceptance criteria checklist** — which criteria have been met during pilot, and which need further exercise
5. **Specific test scenarios** — concrete things you can verify in the current repo state
6. **Judgment call** — any remaining trade-offs where your input would change the outcome
7. **Recommendation** — approve / revise / defer with rationale

---

## PRD-003: Message Lifecycle + SLA Contract

**Owner:** Claude (draft + finalization) + Codex (review) + Maintainer
**File:** `inception/docs/PRD-003-message-lifecycle-sla-contract.md`

### What It Does

Defines the complete state machine for message lifecycle (5 statuses: `unread`, `acknowledged`, `blocked`, `actioned`, `closed`), SLA tiers with session-boundary semantics, stale message detection and escalation, terminal state dispositions, and auto-compaction of closed messages.

### Your Decisions Applied

| OQ | Decision | Applied to |
|----|----------|------------|
| OQ-004 | `blocked` status added to state machine | R1 |
| OQ-005 | SLA violations tracked as trust signals for PRD-007 | Interaction table |
| OQ-006 | Auto-move closed messages to Closed Summary | R6 |

### Cross-PRD Dependency Audit

| Interface | Partner PRD | Status |
|-----------|------------|--------|
| Lifecycle status set (5 statuses) | PRD-008 R8 | Aligned. PRD-008 explicitly lists all 5 statuses. |
| SLA tiers (P0/P1/P2) | PRD-004 R3 | Aligned. PRD-004 references PRD-003 for SLA semantics. |
| `blocked` status semantics | PRD-008 R8 | Aligned. PRD-008 acknowledges `blocked` in status set. |
| Stale detection exemption for `blocked` | PRD-009 R2 | No conflict. PRD-009 R2 `deferred` response is distinct from `blocked`. |
| Terminal dispositions | PRD-004 R4 | Aligned. PRD-004 reply template uses same disposition vocabulary. |
| `sla_missed` events | PRD-007 (future) | PRD-003 interaction table declares this interface. Not yet exercised. |
| Auto-compaction (R6) | PRD-008 R7 | Aligned. Both describe compaction; PRD-003 owns the lifecycle trigger, PRD-008 owns operational format. |

### Acceptance Criteria Checklist

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | State machine is unambiguous — given any (status, actor, action) tuple, exactly one outcome | **MET** | R1 table covers all 10 valid transitions. No ambiguous cases. Review: try `(blocked, sender, close)` = valid; `(closed, receiver, reopen)` = not allowed. |
| 2 | SLA windows are testable at session start | **MET** | R2 table + R4 stale detection protocol. Agent checks inbox snapshot, compares status vs. SLA window. |
| 3 | Stale message protocol produces WORKLOG entry, not silent expiry | **MET in spec** | R4 step 2 mandates WORKLOG escalation entry. Not yet exercised on a real stale message (see Test 2 below). |
| 4 | At least one real stale-message scenario exercised before canonical | **NOT YET MET** | No message has gone stale during pilot. Needs deliberate exercise. |
| 5 | Lifecycle rules fit on a single reference card | **MET** | R1 state diagram + transition table fits in ~30 lines. |

### Test Scenarios for Maintainer

**Test 1 — State machine completeness:**
Open `PRD-003` R1 transition table. For each `From` status, verify that every possible actor (receiver, sender, maintainer) has either an explicit transition row or is implicitly excluded by the invariants. Specifically check:
- Can a sender move a message from `acknowledged` to `actioned`? (Answer: No. Only receiver can.)
- Can a receiver close a message directly? (Answer: No. Only sender or maintainer can close.)
- Can a `blocked` message skip `actioned` and go straight to `closed`? (Answer: Yes. Sender/maintainer can close a blocked message.)

**Test 2 — Stale message simulation:**
To exercise AC #4 before canonical promotion:
1. Post a low-stakes P1 test message from one agent to the other.
2. Have the receiver deliberately not acknowledge it for one session boundary.
3. At next session start, sender detects it as stale per R4.
4. Sender posts escalation entry in WORKLOG per R4 step 2.
5. Maintainer resolves per R4 step 4.
This can be done with a `notify` message to keep it lightweight — but note R7 exempts `notify` from SLA. Use `request` type instead.

**Test 3 — Blocked status round-trip:**
1. Find or create a message where receiver acknowledges, then discovers a blocking dependency.
2. Receiver transitions to `blocked` with dependency noted in Ack line.
3. Verify the message is exempt from stale detection while blocked (R4 step 1).
4. Resolve the dependency, transition back to `acknowledged` or `actioned`.

### Judgment Call

PRD-003 AC #4 (stale-message exercise) is not yet met. You have two options:
- **Option A:** Approve PRD-003 conditionally — mark AC #4 as a post-promotion validation requirement. The spec is correct; only the exercise is missing. *MAINTAINER = N*
- **Option B:** Defer approval until one stale-message scenario is exercised end-to-end during Phase 2. *MAINTAINER = Y*

### Recommendation

**Approve (conditional on AC #4 exercise).** The state machine is well-defined, all OQs are resolved, cross-PRD interfaces are clean. The only gap is the stale-message exercise, which tests the escalation path, not the spec correctness.

---

## PRD-004: Maintainer Decision Contract

**Owner:** Codex (draft) + Claude (review + finalization) + Maintainer
**File:** `inception/docs/PRD-004-maintainer-decision-contract.md`

### What It Does

Standardizes how agents request maintainer decisions: required payload shape (decision question, options, recommendation, delay impact), reply template, WORKLOG linkage for audit trail, escalation for overdue decisions, and provenance safeguards including mandatory relay quote blocks.

### Your Decisions Applied

| OQ | Decision | Applied to |
|----|----------|------------|
| OQ-007 | Session-relative timestamps valid (not ISO-8601 only) | R3 |
| OQ-008 | Malformed requests accepted with required-fix warning | R2 |
| OQ-009 | Relay messages must include maintainer quote block | R7 |

### Cross-PRD Dependency Audit

| Interface | Partner PRD | Status |
|-----------|------------|--------|
| Lifecycle status transitions | PRD-003 R1 | Aligned. PRD-004 R4 reply template uses PRD-003 status vocabulary. |
| SLA/priority semantics | PRD-003 R2 | Aligned. PRD-004 R3 explicitly defers to PRD-003. |
| Decision-eligible conditions (Band C) | `HUMAN_GOVERNANCE.md` | Aligned. PRD-004 R1 references Band C approval requirement. |
| WORKLOG linkage | PRD-003 R5 (terminal states) | Aligned. PRD-004 R5 requires bidirectional mailbox-WORKLOG references. |
| Relay provenance | PRD-009 R4 (revision attribution) | Compatible. PRD-004 R7 relay quotes are a provenance mechanism; PRD-009 R4 handles inline revision attribution. Different scopes, no overlap. |

### Acceptance Criteria Checklist

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Three real maintainer decision requests completed without ad hoc clarification | **PARTIALLY MET** | Multiple maintainer decisions have been made (OQ resolutions, PRD sequencing, protocol decisions). Most used the decision-required message format. However, not all used the full R2 payload shape (options list, recommended, if-delayed). |
| 2 | Bidirectional mailbox-WORKLOG references for each decision | **PARTIALLY MET** | WORKLOG decision index exists with 12 entries. Mailbox messages reference WORKLOG sections. Some early decisions (Session 0-3) predate the formal contract. |
| 3 | No overdue P0 maintainer decision un-escalated | **MET** | No P0 decisions have gone un-escalated. The pilot has been responsive. |
| 4 | Reviewers can reconstruct decision flow from mailbox + WORKLOG only | **MET** | MAILBOX archive preserves full message history. WORKLOG decision index provides scannable summary. Cross-references exist. |

### Test Scenarios for Maintainer

**Test 1 — Decision payload validation:**
Review the most recent `decision-required` message in the mailbox archive (or create a new one). Check that it contains all R2 fields:
- `Decision needed:` — one-sentence question?
- `Options:` — 2-4 with impact lines?
- `Recommended:` — with rationale?
- `If delayed:` — impact statement?

If any recent decision-required messages are missing these fields, that's a data point on whether the contract is being followed.

**Test 2 — Relay quote block verification:**
Scan the mailbox archive for any message where an agent relayed a maintainer decision. Verify it includes the `> Maintainer: "<exact text>"` blockquote format (R7). If no relay messages exist yet, this can be exercised during Phase 2 cross-reviews.

**Test 3 — Malformed request handling:**
If you encounter a decision-required message missing required fields, verify the receiver's behavior matches R2: acknowledge with required-fix warning, not auto-reject. The Ack line should note missing fields.

**Test 4 — WORKLOG bidirectional link audit:**
Pick any 3 entries from the WORKLOG Decision Index. For each:
1. Find the originating mailbox message ID.
2. Confirm the mailbox message references the WORKLOG section.
3. Confirm the WORKLOG entry references the mailbox message ID.

### Judgment Call

The R2 payload shape (options, recommended, if-delayed) hasn't been rigidly enforced for every maintainer decision during pilot. Many decisions were made through inline OQ annotations rather than formal decision-required messages. You need to decide:

- **Strict interpretation:** Every future maintainer decision must use the full R2 shape, even for quick yes/no OQ resolutions. This adds process overhead but ensures consistency.
- **Pragmatic interpretation:** Full R2 shape is required for significant decisions (Band C, lane changes, scope changes). Quick OQ resolutions can use a lighter format. This matches how the pilot actually worked.

### Recommendation

**Approve (pragmatic interpretation).** The contract is well-specified and the interfaces are clean. The pilot demonstrated that the maintainer can make effective decisions without full R2 ceremony for simple questions. The R2 shape should be mandatory for significant decisions but optional for lightweight OQ resolutions.

---

## PRD-008: Cross-Sandbox Handoff Contract (Payload-First)

**Owner:** Maintainer + Codex + Claude
**File:** `inception/docs/PRD-008-cross-sandbox-handoff-contract.md`

### What It Does

Defines how agents exchange reviewable content across sandboxes: mandatory payload envelopes with revision tokens, checksum integrity (`-h<8hex>` SHA-256 segment), payload cap and chunking rules (16 KiB / 300 lines), malformed escalation after one resend failure, thread closure ownership, and helper tooling for envelope generation.

### Your Decisions Applied

| OQ | Decision | Applied to |
|----|----------|------------|
| OQ-013 | Enforce payload cap (16 KiB / 300 lines) | R3 |
| OQ-014 | Checksum-bearing revision tokens | R4 |
| OQ-015 | Auto-escalate after one resend failure | R5 |
| OQ-016 | Helper script for envelope generation | R9, M4 |

### Cross-Review Findings Applied

Claude reviewed PRD-008 and identified 7 findings. Codex applied all 7:

| Finding | Type | Change |
|---------|------|--------|
| R4.3 checksum scope | Required | Clarified: checksum over content between fence markers, excluding markers and language tag |
| R3.3/R5 cap violation = malformed | Required | Cap violations explicitly treated as malformed under R5 |
| R8 blocked status | Recommend | Added full 5-status set to R8 |
| R6 deferred-disposition closure | Recommend | Closure owner retains responsibility, re-evaluates on unblock |
| PRD-008/009 overlap surface | Recommend | Added PRD-009 cross-reference in R8 |
| Protocol version reference | Note | Updated |
| M4/M5 tracking | Note | Milestone tracking updated |

### Cross-PRD Dependency Audit

| Interface | Partner PRD | Status |
|-----------|------------|--------|
| Lifecycle statuses | PRD-003 R1 | Aligned. R8 explicitly lists all 5 statuses. |
| Closure owner semantics | PRD-003 R5 (terminal states) | Aligned. R6 references PRD-003 for terminal `closed` transition. |
| Revision token provenance | PRD-009 R2 | Aligned. PRD-009 R2 revision token integrity rule explicitly references PRD-008 R4. |
| Payload cap/chunking | PRD-009 R1 | Compatible. PRD-009 R1 uses PRD-008 envelope format for proposals. |
| Decision contract integration | PRD-004 R2 | Aligned. R8 defers decision payload shape to PRD-004. |
| Helper tooling | `tools/new-payload-envelope.mjs` | **Shipped.** Script exists. Adoption tracked in M5. |

### Acceptance Criteria Checklist

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | At least three cross-agent review exchanges without maintainer relay | **MET** | PRD-003/004 reconciliation, PRD-008 cross-review (Claude reviewed, Codex applied), PRD-009 cross-review (Codex reviewed, Claude applied). At least 3 exchanges used payload-first format. |
| 2 | Every reviewed message has valid checksum-bearing revision token echoed | **PARTIALLY MET** | Revision tokens used consistently. Checksum segment (`-h<8hex>`) mandated in spec but not all pilot messages predate the checksum requirement (checksum was added via OQ-014). Recent messages comply. |
| 3 | Payloads above cap chunked with ordered part suffixes | **NOT YET TESTED** | No payload during pilot exceeded the 16 KiB / 300 line cap. This is a good sign (payloads are appropriately sized) but the chunking path is untested. |
| 4 | No path-only review request proceeds to substantive review | **MET** | After the payload-first policy was adopted (v0.3), all review requests included inline content. The failure that prompted PRD-008 has not recurred. |
| 5 | Review conclusions reconstructable from mailbox/worklog | **MET** | MAILBOX archive + WORKLOG decision index provide full reconstruction path. |
| 6 | Helper script used in at least one real payload exchange | **NOT YET MET** | `tools/new-payload-envelope.mjs` is shipped but M5 (adoption) is listed as "next." |

### Test Scenarios for Maintainer

**Test 1 — Revision token integrity:**
Pick a recent mailbox message with a `Revision:` token (e.g., MSG-024's `REV-20260208-prd009-fixes-01`). Verify:
1. The token follows the format `REV-YYYYMMDD-<topic>-<seq>`.
2. If the response modified content, it used a new superseding token (per PRD-009 R2 integrity rule).
3. If the response accepted without changes, it echoed the sender's token.

**Test 2 — Helper script validation:**
Run the envelope helper script on a test payload:
```bash
echo "Test payload content" | node tools/new-payload-envelope.mjs \
  --topic test-review \
  --format full-text \
  --scope critical-only \
  --files inception/PHASE1_MAINTAINER_REVIEW.md \
  --seq 01
```
Verify the output includes a valid envelope with checksum-bearing revision token.

**Test 3 — Checksum verification:**
Take a payload from a recent message. Compute SHA-256 of the content between the fence markers (excluding markers). Compare the first 8 hex chars to the `-h<8hex>` segment. (This tests R4.3 checksum scope.)

**Test 4 — Cap compliance spot-check:**
Review the last 3-5 payload messages in the archive. Verify none exceed 300 lines. (Quick scan of message lengths.)

### Judgment Call

Two acceptance criteria are not yet met:
- AC #3 (chunking): No payload has exceeded the cap, so chunking has never been tested.
- AC #6 (helper script adoption): Script is shipped but not yet used in a live exchange.

Options:
- **Option A:** Approve with AC #3 and #6 as post-promotion validation tasks. The cap and helper are well-specified; only the exercise is missing. *MAINTAINER=N*
- **Option B:** Require that Phase 2 cross-reviews deliberately use the helper script (satisfies AC #6) and include one intentionally large payload to test chunking (satisfies AC #3). *MAINTAINER=Y*

### Recommendation

**Approve (conditional on AC #6 exercise in Phase 2).** AC #3 (chunking) is unlikely to arise naturally and is a minor edge case. AC #6 (helper script) should be exercised in Phase 2 cross-reviews — it's easy to do and validates the tooling investment.

---

## PRD-009: Cross-Document Reconciliation + Open Question Triage

**Owner:** Claude (draft) + Codex (review) + Maintainer
**File:** `inception/docs/PRD-009-cross-document-reconciliation.md`

### What It Does

Defines three process improvements: (1) structured change proposal format with per-change rationale and disposition requests, (2) a cross-PRD open question registry with deduplication and resolution tracking, and (3) lightweight revision attribution via HTML comments in inception documents. Also introduces mandatory interface delta blocks for parallel PRD handoffs.

### Your Decisions Applied

| OQ | Decision | Applied to |
|----|----------|------------|
| OQ-010 | OQ registry promoted to tracked file at canonical promotion | R3 |
| OQ-011 | Freeform HTML comment sufficient for attribution | R4 |
| OQ-012 | Archive resolved OQs (separate section) | R3 |

### Cross-Review Findings Applied

Codex reviewed PRD-009 and identified 4 findings. Claude applied all 4:

| Finding | Type | Change |
|---------|------|--------|
| R2 revision token integrity gap | Required | Added explicit rule: content-modifying responses require new superseding revision token with `Related` linkage to sender's revision. Aligned with PRD-008 R4. |
| R1 protocol version reference | Recommend | Updated from v0.5 to v0.6. |
| R3 registry location | Recommend | Changed from hardcoded path to pilot + canonical location reference. |
| AC #4 scope | Recommend | Widened from "PRDs 001-004" to "all active PRDs in pilot scope." |

### Cross-PRD Dependency Audit

| Interface | Partner PRD | Status |
|-----------|------------|--------|
| Revision token provenance | PRD-008 R4 | Aligned. R2 revision token integrity rule explicitly references PRD-008 R4 requirement. |
| Response contract vocabulary | PRD-003 R1 | Aligned. R2 response types (`accepted`, `accepted-with-modifications`, `counter-recommendation`, `deferred`) map to PRD-003 status transitions. |
| Maintainer OQ resolution | PRD-004 R5 | Aligned. R3 registry records maintainer decisions. PRD-004 R5 requires WORKLOG linkage. |
| Canonical schema location | PRD-005 (OQ-020) | Aligned. R3 references OQ-020 resolution (`docs/schemas/`). |
| Promotion pipeline | PRD-006 | Aligned. R3 references OQ-010 resolution (tracked file at promotion). |

### Acceptance Criteria Checklist

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Cross-agent document change uses R1 proposal format without extra round-trips | **MET** | PRD-008 and PRD-009 cross-reviews both used payload-first proposals with inline diffs and per-change rationale. |
| 2 | At least one message uses explicit `Closure owner` and `Review scope` | **MET** | Multiple messages (MSG-021, MSG-023, MSG-024) include both fields. |
| 3 | Parallel PRD handoff includes interface delta block (including "delta: none") | **MET** | MSG-023 and MSG-024 include interface delta blocks. At least one "delta: none" case documented. |
| 4 | OQ registry exists with all current open questions deduplicated | **MET** | `inception/OPEN_QUESTIONS.md` contains 36 questions from all PRDs in pilot scope. Active/Deferred/Resolved sections. Deduplication notes present. |
| 5 | At least one semantic change has R4 revision attribution comment | **MET** | PRD-003 and PRD-004 both contain `<!-- REV-... -->` attribution comments for maintainer OQ resolutions. |
| 6 | No OQ resolved in a PRD without updating registry | **MET** | All 34 resolved OQs are recorded in the registry with resolution text and source. |

### Test Scenarios for Maintainer

**Test 1 — OQ registry integrity:**
Open `inception/OPEN_QUESTIONS.md`. Verify:
1. Every PRD's "Open questions" section cross-references the registry (OQ-XXX IDs match).
2. No resolved OQ remains in "Active Questions" section.
3. Deduplication notes identify overlapping questions correctly.

Quick check: The registry should show 0 active, 2 deferred (OQ-003, OQ-026), 34 resolved.

**Test 2 — Revision attribution spot-check:**
Open PRD-003 and search for `<!-- REV-`. Verify:
1. At least one attribution comment exists.
2. The comment references the OQ or change that triggered it.
3. The comment is invisible in rendered markdown view.

**Test 3 — R2 response contract validation:**
Review MSG-024 (or any recent cross-review response). Verify the response used the correct R2 pattern:
- If changes were applied as proposed: sender's revision token echoed.
- If changes were applied with modifications: new superseding revision token + `Related` link.

**Test 4 — Interface delta block verification:**
Find a recent parallel handoff message (MSG-023 or MSG-024). Confirm it includes:
```
Interface delta:
- Surface: <name>
- Delta: <change or "none">
- Action: <apply|counter|none>
```

### Judgment Call

PRD-009 has all acceptance criteria met. The only remaining consideration is scope:

PRD-009 is both a process PRD (how to reconcile documents) and an infrastructure PRD (the OQ registry). At canonical promotion, you may want to:
- Promote the OQ registry process as part of the canonical communication protocol.
- Keep the revision attribution rule scoped to inception-only (since canonical docs use git history).

This is a PRD-006 (promotion pipeline) concern, not a Phase 1 blocker.

### Recommendation

**Approve.** All acceptance criteria met. Cross-PRD interfaces are clean. The OQ registry is the most impactful artifact to come out of Phase 1 — it resolved 34 questions and prevented significant drift.

---

## Cross-PRD Integration Summary

### Dependency Graph

```
PRD-003 (lifecycle)
  ├── PRD-004 (decisions) — uses lifecycle statuses, SLA tiers
  ├── PRD-008 (handoff) — uses lifecycle statuses, closure semantics
  └── PRD-009 (reconciliation) — maps response types to lifecycle transitions

PRD-008 (handoff)
  └── PRD-009 (reconciliation) — extends envelope with rationale + response contract
      └── PRD-009 R2 → PRD-008 R4 (revision token integrity)

PRD-004 (decisions)
  └── PRD-009 R3 (OQ registry) — records maintainer decisions
```

### Interface Alignment Matrix

| Interface surface | PRD-003 | PRD-004 | PRD-008 | PRD-009 | Aligned? |
|-------------------|---------|---------|---------|---------|----------|
| Status set (5 values) | Defines (R1) | Uses (R4) | Lists (R8) | Maps to (R2) | Yes |
| SLA tiers (P0/P1/P2) | Defines (R2) | Uses (R3) | — | — | Yes |
| Closure owner | — | — | Defines (R6) | Uses (R1.6) | Yes |
| Review scope | — | — | Defines (R2.4) | Uses (R1.3) | Yes |
| Revision tokens | — | — | Defines (R4) | Extends (R2) | Yes |
| Checksum format | — | — | Defines (R4) | References (R2) | Yes |
| Terminal dispositions | Defines (R5) | Uses (R4) | References (R6) | — | Yes |
| OQ registry | — | Updates (R5) | — | Defines (R3) | Yes |
| Relay provenance | — | Defines (R7) | — | Compatible (R4) | Yes |
| Interface delta block | — | — | — | Defines (R5) | Yes |

**Result: No cross-PRD conflicts found.** All interface surfaces are either defined in one place and referenced by others, or explicitly scoped to avoid overlap.

### Remaining Open Questions Affecting Phase 1

| OQ | Status | Impact on Phase 1 |
|----|--------|-------------------|
| OQ-003 (maintainer reply template snippet) | Deferred | **No impact.** PRD-004 R4 template exists. Whether it's mandatory is a future decision. |
| OQ-026 (trust anomalies blocking promotion) | Deferred | **No impact on Phase 1.** Affects PRD-006 promotion gating, which is Phase 2+. |

---

## Consolidated Test Plan

These tests can be run in a single maintainer review session:

### Quick Verification (10 min)

| # | Test | What to check | Pass condition |
|---|------|---------------|----------------|
| Q1 | OQ registry count | Open `inception/OPEN_QUESTIONS.md` | 0 active, 2 deferred, 34 resolved |
| Q2 | State machine transition table | Read PRD-003 R1 | 10 transitions, no ambiguities |
| Q3 | Helper script exists | `ls tools/new-payload-envelope.mjs` | File exists |
| Q4 | Revision attribution comments | Search PRD-003/004 for `<!-- REV-` | At least 1 per file |
| Q5 | MAILBOX closed summary | Open `inception/MAILBOX.md`, check Closed Summary | Messages show final status + outcome |

### Functional Validation (30 min)

| # | Test | Steps | Pass condition |
|---|------|-------|----------------|
| F1 | Helper script runs | `echo "test" \| node tools/new-payload-envelope.mjs --topic test --format full-text --scope full --files test.md --seq 01` | Outputs valid envelope with checksum |
| F2 | WORKLOG decision index audit | Pick 3 decision index entries, trace to mailbox messages | Bidirectional references exist |
| F3 | Interface delta block | Find MSG-023 or MSG-024 in mailbox | Contains interface delta block |
| F4 | R2 response contract | Find a cross-review response message | Correct revision token handling |

### Deferred Validation (exercise during Phase 2)

| # | Test | When | PRD |
|---|------|------|-----|
| D1 | Stale message scenario | Phase 2 start | PRD-003 AC #4 |
| D2 | Helper script in live exchange | Phase 2 cross-review | PRD-008 AC #6 |
| D3 | Payload chunking test | If a large payload arises, or deliberate test | PRD-008 AC #3 |

---

## Batch Approval Decision Framework

| PRD | Recommendation | Conditions |
|-----|---------------|------------|
| **PRD-003** | Approve (conditional) | Exercise stale-message scenario during Phase 2 |
| **PRD-004** | Approve (pragmatic) | Full R2 shape required for significant decisions; lightweight format acceptable for quick OQ resolutions |
| **PRD-008** | Approve (conditional) | Use helper script in at least one Phase 2 exchange |
| **PRD-009** | Approve (unconditional) | All acceptance criteria met |

### Suggested Maintainer Actions

1. **Review this document** and make approve/revise/defer decisions for each PRD.
2. **Run Quick Verification tests** (Q1-Q5) to confirm current repo state.
3. **Optionally run Functional Validation tests** (F1-F4) for deeper confidence.
4. **Note deferred validations** (D1-D3) as Phase 2 requirements.
5. **If all four approved:** update WORKLOG decision index with batch approval entry and signal Phase 2 start (Claude reviews PRD-005, Codex reviews PRD-006).

---

*Prepared by Claude. Revision: Phase 1 batch review, 2026-02-08.*
