# PRD-012 M3 Policy Test Suite

Version: 0.1.0 (pilot)
Baseline: PRD-012 R1/R2/R6 + M1 assertion framework
Last updated: 2026-02-08

---

## Purpose

This document specifies the shared policy test suite for validating cross-agent skill equivalence. It builds on the M1 assertion framework (`PRD-012-M1-assertion-framework.md`) by defining:

1. **Executable scenario harnesses** — concrete test procedures that can be run against live or fixture artifacts.
2. **Pass/fail fixtures** — expected outcomes for each assertion in each scenario class.
3. **Evidence contract** — what constitutes sufficient proof of pass/fail.

Both agents (Claude and Codex) must produce equivalent outcomes on the same scenario class. Policy tests provide the reconciliation mechanism (PRD-012 R1).

---

## Scenario Classes (PRD-012 R6)

### Scenario 1: Cross-Agent PRD Review Round-Trip

**Setup:** Agent A posts a formal review of a PRD to Agent B via mailbox with revision-token lineage.

**Test steps:**
1. Agent reads target PRD in full.
2. Agent composes mailbox message with:
   - Review findings classified as Required [P1] / Recommended [P2] / Note [informational].
   - Revision token in `REV-YYYYMMDD-<topic>-<seq>-h<8hex>` format.
   - Explicit file list matching actual reviewed artifacts.
   - Ask type (apply-or-counter).
3. Agent posts message to MAILBOX.md with correct lifecycle status (unread).
4. Agent updates inbox snapshot counts.
5. Agent regenerates MAILBOX.json.
6. Agent logs the review in WORKLOG.

**Assertions exercised:**

| Assertion | Expected evidence | Pass criteria |
|-----------|-------------------|---------------|
| PT-PAY-001 | Revision token present in message body | Token matches `REV-YYYYMMDD-<topic>-<seq>-h<8hex>` pattern |
| PT-PAY-002 | File list in message matches actual files reviewed | Every listed file exists and was read; no unlisted files were substantively referenced |
| PT-MBOX-001 | Message status follows PRD-003 lifecycle | Initial status is `unread`; transitions follow `unread -> acknowledged -> actioned -> closed` |
| PT-MBOX-002 | Ack line present for status changes | Each non-initial status has an Ack entry with actor + date + next step |
| PT-MBOX-003 | MAILBOX.json regenerated | `export-mailbox-json.mjs` run after mailbox mutation (or manual stale flag if unavailable) |
| PT-REC-001 | Findings classified | Each finding has Required/Recommended/Note tag |
| PT-GOV-001 | Write authorization checked | Review posting follows propose-only unless "run and apply" given |

**Failure signals:**
- Missing revision token -> PT-PAY-001 FAIL
- Phantom file in file list -> PT-PAY-002 FAIL
- Status set to `actioned` without going through `unread` -> PT-MBOX-001 FAIL
- MAILBOX.json not regenerated after edit -> PT-MBOX-003 FAIL

---

### Scenario 2: Shared-File Update Cycle (Lock + Invariant)

**Setup:** Agent needs to edit a shared control-plane file (e.g., MAILBOX.md + WORKLOG.md) under lock discipline.

**Test steps:**
1. Agent reads TURNFILE.yaml (pre-write check).
2. Agent checks no conflicting lock exists in `locks` section.
3. Agent writes lock entry with `acquired_rev`, `lease_revs: 2`, and reason.
4. Agent re-reads TURNFILE.yaml to verify no competing lock appeared.
5. Agent re-reads target file(s) immediately before editing.
6. Agent applies changes.
7. If mailbox was mutated, agent regenerates MAILBOX.json in same transaction cycle.
8. Agent removes lock entry from TURNFILE.yaml.
9. Agent increments `coordination.revision`.

**Assertions exercised:**

| Assertion | Expected evidence | Pass criteria |
|-----------|-------------------|---------------|
| PT-LOCK-001 | Transactional write sequence | Lock acquired before edit; lock released after edit; revision incremented; related files updated in same cycle |
| PT-LOCK-002 | Bounded retry on contention | If lock contention detected, agent retries with bounded count; escalates if unchanged revision across two checks |
| PT-TURN-001 | Revision incremented | `coordination.revision` increases by exactly 1 per successful write |
| PT-TURN-003 | Signal logged | Substantive state change logged in `messages` section |
| PT-MBOX-003 | Projection regenerated | MAILBOX.json regenerated when mailbox was mutated under lock |
| PT-GOV-002 | Propose-only mode | If no apply authorization, agent proposes changes without writing |

**Failure signals:**
- Edit without lock acquisition -> PT-LOCK-001 FAIL
- Infinite retry on contention (no bounded limit) -> PT-LOCK-002 FAIL
- Revision not incremented after write -> PT-TURN-001 FAIL
- Lock orphaned (not released after edit) -> PT-LOCK-001 FAIL

---

### Scenario 3: Session Close + Next-Session Resumption

**Setup:** Agent performs full session close procedure, followed by a new session resumption using the snapshot.

**Close test steps:**
1. Agent checks mailbox — ensures agent unread = 0.
2. Agent updates WORKLOG with session entry and handoff block.
3. Agent closes owned mailbox messages.
4. Agent updates TURNFILE.yaml: removes locks, updates tasks, clears `current_task`, sets status to `idle`.
5. Agent compacts signal log per retention window.
6. Agent writes session state snapshot to chat mirror file.
7. Agent archives boot file and writes new boot file.

**Resume test steps:**
8. Next session reads boot file.
9. Reads TURNFILE.yaml (first in read order per PRD-011 R3).
10. Reads WORKLOG status block.
11. Reads MAILBOX inbox snapshot.
12. Reads chat mirror snapshot.
13. Reads relevant files from "files to read on resume" list.
14. Updates agent entry in TURNFILE.yaml: `status: active`, new `session_id`.

**Assertions exercised:**

| Assertion | Expected evidence | Pass criteria |
|-----------|-------------------|---------------|
| PT-RES-001 | Turnfile read first on startup | Agent's first coordination file read is TURNFILE.yaml (not WORKLOG or MAILBOX) |
| PT-RES-002 | Closeout has carry-over anchors | Snapshot includes: active task status, mailbox state, open commitments, files modified, files to read on resume, decision context |
| PT-BOUND-001 | Mailbox check first and last | Session close starts with mailbox check (unread=0 gate) and ends with final mailbox check |
| PT-BOUND-002 | No completion with unread > 0 | Agent does not mark session close complete while unread count > 0 |
| PT-TURN-001 | Revision incremented | Closeout Turnfile write increments revision |
| PT-TURN-002 | Task metadata complete | Completed tasks have `completed_rev`; status set to `done` |
| PT-GOV-001 | Write authorization | Closeout write follows maintainer authorization protocol |

**Failure signals:**
- WORKLOG read before TURNFILE.yaml on resume -> PT-RES-001 FAIL
- Missing "files to read on resume" in snapshot -> PT-RES-002 FAIL
- Session marked closed with Claude unread = 1 -> PT-BOUND-002 FAIL
- Locks not released before idle -> PT-LOCK-001 FAIL (cascade)

---

### Scenario 4: Turnfile Coordination Cycle

**Setup:** Agent self-assigns an unassigned task, performs work, updates status, and signals completion.

**Test steps:**
1. Agent reads TURNFILE.yaml.
2. Agent identifies unassigned task with all dependencies `status: done`.
3. Agent claims task: writes `owner: <self>`, `status: claimed`, `claim_rev: <current revision>`.
4. Agent transitions task to `in_progress` and updates `current_task` in agent entry.
5. Agent performs work (may require lock for shared-file edits).
6. Agent marks task `status: done`, sets `completed_rev`.
7. Agent resets `current_task` to null or next task.
8. Agent posts coordination signal (e.g., `ready` or `yield`).
9. Agent increments `coordination.revision` on each Turnfile write.

**Assertions exercised:**

| Assertion | Expected evidence | Pass criteria |
|-----------|-------------------|---------------|
| PT-TURN-001 | Revision incremented | Each Turnfile write increments revision by exactly 1 |
| PT-TURN-002 | Task metadata | Claimed task has `claim_rev`; completed task has `completed_rev`; both <= `coordination.revision` |
| PT-TURN-003 | Signal logged | At least one signal posted for the task state change (ready, yield, or notify) |
| PT-LOCK-001 | Transactional if shared files involved | Lock acquired before shared-file edit, released after |
| PT-DEC-001 | Decision request if needed | If task requires maintainer decision, decision-required message posted with explicit ask + scope |
| PT-GOV-001 | Write authorization | Task claim and status updates follow ownership rules (PRD-013 R2.1) |

**Concurrent claim tie-break sub-scenario:**
- If two agents claim the same task at the same revision: lower `claim_rev` wins; if tied, lexicographically smaller `owner` wins.
- Losing agent must release claim and choose a different task.

**Failure signals:**
- Task claimed with unmet dependencies -> PT-TURN-002 FAIL
- `claim_rev` exceeds `coordination.revision` -> PT-TURN-002 FAIL
- Signal not posted after task completion -> PT-TURN-003 FAIL
- Agent writes to non-owned Turnfile section -> PT-GOV-001 FAIL

---

## Cross-Agent Equivalence Matrix

For each scenario class, both agents must demonstrate equivalent outcomes:

| Scenario | Claude skill module(s) | Codex skill module(s) | Equivalence check |
|----------|----------------------|----------------------|-------------------|
| 1. PRD review | Module 4 (Cross-Agent Review) | M-03 (Payload-First Review) + M-04 (Reconciliation) | Same lifecycle transitions, same revision token format, same evidence structure |
| 2. Shared-file update | Module 5 (Shared-File Transaction) | M-05 (Shared-File Transaction) | Same lock acquire/release sequence, same revision increment pattern |
| 3. Session close/resume | Module 1 (Session Start) + Module 6 (Session Close) | M-06 (Session Close/Resume) | Same read order, same snapshot content, same Turnfile state transitions |
| 4. Turnfile coordination | Module 7 (Turnfile Coordination) | M-07 (Turnfile Coordination) | Same task claim protocol, same signal posting, same ownership rules |

**Equivalence passes when:**
1. Both agents produce the same set of assertion pass/fail verdicts for a given scenario.
2. Artifact state changes (mailbox status, Turnfile revision, WORKLOG entries) are structurally equivalent.
3. No governance regression: both agents enforce propose-only + mailbox discipline identically.

---

## Executable Validation Harness

### Automated checks (runnable via `node tools/turnfile-lint.mjs`)

The Turnfile linter already validates several policy test assertions against the live state:

| Assertion | Linter check |
|-----------|-------------|
| PT-TURN-001 | Revision consistency (signal.rev <= coordination.revision) |
| PT-TURN-002 | claim_rev/completed_rev bounds and consistency |
| PT-TURN-003 | Signal ID monotonicity and duplicate detection |
| PT-LOCK-001 | Lock staleness detection (lease_revs exceeded) |
| PT-LOCK-002 | Stale lock identification for bounded-retry escalation |

### Manual inspection checklist (per-scenario)

For each executed scenario, the reviewing agent or maintainer must verify:

1. [ ] **File diff evidence:** `git diff` or explicit before/after state for each modified file.
2. [ ] **Mailbox trace:** Message ID(s) created/transitioned, with status and Ack lines.
3. [ ] **Turnfile trace:** Revision number(s), signal ID(s), task state transitions.
4. [ ] **WORKLOG entry:** Session entry with handoff block documenting the scenario execution.
5. [ ] **Command output:** Any tool runs (`export-mailbox-json.mjs`, `turnfile-lint.mjs`, `validate-prd-promotion.mjs`) with pass/fail results.
6. [ ] **Cross-agent verdict:** Both agents mark the same assertions as PASS for this scenario class.

### Evidence template

```markdown
## Policy Test Evidence: [Scenario N] — [Agent]

**Date:** YYYY-MM-DD
**Agent:** Claude | Codex
**Session:** <session-id>
**Scenario:** [1-4 description]

### Assertion Results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-XXX-NNN | PASS/FAIL | [Brief evidence reference] |

### File Changes
- [file path]: [brief description of change]

### Tool Outputs
- `node tools/turnfile-lint.mjs` → [PASS/FAIL]
- `node tools/export-mailbox-json.mjs` → [success/error]

### Cross-Agent Equivalence
- [ ] Same assertions pass for both agents
- [ ] Artifact state transitions are structurally equivalent
- [ ] No governance regression detected
```

---

## M3 Boundary

This suite defines the scenario harnesses, pass/fail fixtures, and evidence contracts. M4 will execute all four scenarios across both agents using this framework and record evidence per the template above.

---

## Versioning

| Field | Value |
|-------|-------|
| Suite version | 0.1.0 |
| Assertion framework baseline | PRD-012-M1-assertion-framework.md |
| Protocol baseline | PRD-003/004/008/009/010/011/012/013 |
| Coverage | 19 assertions across 4 scenario classes |
| Last validated | Not yet executed (M4 pending) |
