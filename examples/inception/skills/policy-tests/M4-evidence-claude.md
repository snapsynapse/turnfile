# PRD-012 M4 Validation Evidence — Claude

Agent: Claude
Session: claude-session-11
Date: 2026-02-08
Turnfile revision range: 31–37 (P2-D execution window)

---

## Scenario 4: Turnfile Coordination Cycle — PASS

**Live evidence from session 11 P2-D execution.**

Claude self-assigned 4 tasks, executed each, marked done with metadata, and posted coordination signals — all without maintainer task assignment.

### Task lifecycle evidence

| Task | claim_rev | completed_rev | Signal | Status |
|------|-----------|---------------|--------|--------|
| p2d-claude-skill-draft | 31 | 34 | SIG-018 | done |
| p2d-prd013-schema | 34 | 35 | SIG-019 | done |
| p2d-prd013-linter | 35 | 35 | SIG-019 | done |
| p2d-policy-tests | 35 | 36 | SIG-020 | done |

### Assertion results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-TURN-001 | PASS | Revision incremented on every Turnfile write: 31→34→35→36. Each write incremented by exactly 1 (when Claude was sole writer). |
| PT-TURN-002 | PASS | All 4 tasks have `claim_rev` and `completed_rev` set. All `claim_rev <= completed_rev <= coordination.revision`. |
| PT-TURN-003 | PASS | SIG-018, SIG-019, SIG-020 posted for task state changes. Each signal includes revision reference. |
| PT-LOCK-001 | N/A | No shared-file locks were needed — all edits were to Claude-owned files or uncontested sections. (Lock exercise covered in Scenario 2.) |
| PT-GOV-001 | PASS | All task claims/updates were to Claude-owned entries or unassigned tasks. No writes to non-owned Turnfile sections. Maintainer explicitly authorized P2-D independent work: "I'm going to let you two work independently for a while." |

### Concurrent claim evidence (Codex side)

Codex independently claimed `p2d-codex-skill-draft` at rev 32 (SIG-016) — no contention because tasks were distinct. Both agents self-assigned from the unassigned pool per PRD-013 R6.1. Dependency check satisfied (both depend on `p2c-cleanup` which was done at rev 30).

### Verification

```
$ node tools/turnfile-lint.mjs
Linting: inception/TURNFILE.yaml
Schema:  inception/schemas/turnfile/turnfile-v0.schema.json
Summary: revision=37, agents=2, tasks=27, locks=0, signals=21
Schema: PASS
LINT PASSED
```

---

## Scenario 1: Cross-Agent PRD Review Round-Trip — PASS

**Live evidence: MSG-20260208-041 (Codex→Claude P2-D skill review).**

### Lifecycle trace

| Step | Actor | Action | Evidence |
|------|-------|--------|----------|
| 1 | Codex | Posted review with revision token | MSG-041: `REV-20260208-p2d-codex-skill-draft-01-h6a4b903d` |
| 2 | Codex | Included explicit file list | 3 files listed; all exist on disk and were reviewed |
| 3 | Codex | Set ask type | `apply-or-counter` |
| 4 | Codex | Set initial status | `unread` (PRD-003 lifecycle) |
| 5 | Claude | Read and reviewed all 3 files | Full cross-review documented in MSG-041 reply |
| 6 | Claude | Posted findings | 1 Recommended [P2], 2 Notes [informational] |
| 7 | Claude | Set status transition | `unread → actioned` with Ack line |
| 8 | Claude | Regenerated MAILBOX.json | `node tools/export-mailbox-json.mjs` run after edit |

### Assertion results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-PAY-001 | PASS | Revision token `REV-20260208-p2d-codex-skill-draft-01-h6a4b903d` matches required format `REV-YYYYMMDD-<topic>-<seq>-h<8hex>`. |
| PT-PAY-002 | PASS | File list (3 files) matches actual reviewed artifact set. All files exist at listed paths. No unlisted files substantively referenced. |
| PT-MBOX-001 | PASS | Status transition: `unread → actioned`. Valid per PRD-003 lifecycle (receiver action). |
| PT-MBOX-002 | PASS | Ack line present: "Claude — 2026-02-08 — Apply. Full review complete. 1 recommended, 2 informational notes." |
| PT-MBOX-003 | PASS | MAILBOX.json regenerated via `export-mailbox-json.mjs` after mailbox mutation. |
| PT-REC-001 | PASS | Findings classified: 1 Recommended [P2], 2 Notes [informational]. |
| PT-GOV-001 | PASS | Review was a response to explicit Codex request; Claude applied no writes beyond mailbox status update (propose-only equivalent for review responses). |

### Additional Scenario 1 note

Codex is executing a fresh Scenario 1 exercise (PRD-001 review) at rev 37 to provide independent Codex-side evidence. This MSG-041 evidence demonstrates Claude-side compliance on the receiver path of a review round-trip.

---

## Scenario 3: Session Close + Resumption — PASS

**Evidence from session 10→11 boundary (Claude close session 10, resume session 11).**

### Close evidence (session 10 → session 11 transition)

The session 10→11 boundary is documented in:
- `inception/chat-claude.md` (session close snapshot)
- `inception/boot-claude.md` (updated to session 11 state)
- `inception/WORKLOG.md` session 10 handoff blocks

Key compliance points from session 11 startup:
1. Boot file read first (per PRD-014 contract).
2. TURNFILE.yaml read as first coordination artifact (PRD-011 R3 + PRD-013 R5.1).
3. WORKLOG status block read (lines 1-11).
4. MAILBOX inbox snapshot checked.
5. Agent entry updated: `status: active`, `session_id: claude-session-11`.
6. Stale lock check performed (none found).
7. Coordination revision checked and incremented on first write.

### Resume evidence (session 11 startup)

Session 11 startup read order (from context window transition):
1. `inception/boot-claude.md` — orientation
2. `inception/TURNFILE.yaml` — coordination state (Turnfile first per R5.1)
3. `inception/WORKLOG.md` lines 1-11 — status block
4. `inception/MAILBOX.md` — inbox snapshot + unread messages
5. `inception/OPEN_QUESTIONS.md` — OQ registry check
6. Relevant task files per "files to read on resume" list

### Assertion results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-RES-001 | PASS | Turnfile read as first coordination artifact on session 11 startup. Boot file read before Turnfile (per PRD-014), but Turnfile is first coordination read per PRD-011 R3. |
| PT-RES-002 | PASS | Session 10 closeout snapshot (chat-claude.md) includes: active task status, mailbox state, open commitments, files modified, files to read on resume, decision context. |
| PT-BOUND-001 | PASS | Session 11 active turns all perform mailbox check first (inbox snapshot read) and last (final unread=0 verification before turn completion). Demonstrated across 4 turn boundaries in this session. |
| PT-BOUND-002 | PASS | Claude never declared turn complete with unread > 0. When MSG-041 appeared mid-session, it was processed before next turn completion. |
| PT-TURN-001 | PASS | Session 11 Turnfile writes: revisions 26, 30, 31, 34, 35, 36. Each incremented from prior state. |
| PT-TURN-002 | PASS | Session close tasks marked done with completed_rev. Session 11 resume verified all task metadata. |
| PT-GOV-001 | PASS | Session close/resume follows maintainer-authorized protocol. No unauthorized writes. |

### Note on Scenario 3 completeness

A full Scenario 3 exercise (Claude closes session 11, resumes session 12) would occur naturally at session end. This evidence documents the most recent close/resume cycle that has already completed. Codex has parallel close/resume evidence from the session 9→10 boundary.

---

## Scenario 2: Shared-File Lock Cycle — (Pending live execution)

**Live lock exercise executed at revision 38→39.**

### Lock lifecycle trace

| Step | Rev | Action | Evidence |
|------|-----|--------|----------|
| 1 | 37 | Read Turnfile (pre-write check) | `locks: {}` — no conflicts |
| 2 | 37 | Verify no conflicting lock on WORKLOG.md | Confirmed empty locks section |
| 3 | 38 | Acquire lock: `m4-scenario2-worklog` | `acquired_rev: 38`, `lease_revs: 2`, `holder: claude` |
| 4 | 38 | Re-read Turnfile — verify no competing lock | Only Claude's lock present. Verification passed. |
| 5 | 38 | Re-read WORKLOG.md immediately before editing | Status block read (lines 1-11) |
| 6 | 38 | Apply controlled edit | Updated WORKLOG status block (4 lines: Now Working for both agents, Maintainer Focus, Next Review Checkpoint) |
| 7 | 39 | Release lock: remove lock entry | `locks: {}` restored. Comment: "released at rev 39 (acquired rev 38, held 1 revision)" |
| 8 | 39 | Increment revision | `coordination.revision: 39` |
| 9 | 39 | Run linter | PASS (schema + semantic invariants) |

### Assertion results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-LOCK-001 | PASS | Full transactional sequence: lock acquired (rev 38) → target file re-read → edit applied → lock released (rev 39). Related files updated in same cycle. No partial writes. |
| PT-LOCK-002 | N/A | No contention detected — single-agent exercise. Bounded retry path is encoded in skill file Module 5 step 5 ("If verification fails, agent removes its lock entry, yields, and retries"). |
| PT-TURN-001 | PASS | Revision incremented: 37→38 (lock acquire) → 39 (lock release). Two writes, two increments. |
| PT-TURN-003 | N/A | Signal not posted for lock exercise specifically — lock is a sub-operation, not a task state change. (Signal coverage demonstrated in Scenario 4.) |
| PT-GOV-001 | PASS | Lock acquired on Claude-owned operation. WORKLOG edit was a status block update (standard agent operation). No writes to non-owned Turnfile sections. |
| PT-GOV-002 | N/A | Apply authorization was granted by maintainer for independent M4 execution: "Let's begin the real m4 validation work." |

### Verification

```
$ node tools/turnfile-lint.mjs
Linting: inception/TURNFILE.yaml
Schema:  inception/schemas/turnfile/turnfile-v0.schema.json
Summary: revision=39, agents=2, tasks=27, locks=0, signals=21
Schema: PASS
LINT PASSED
```

### Lock audit trail

The lock comment in TURNFILE.yaml provides a human-readable audit trail:
```yaml
# Lock m4-scenario2-worklog released at rev 39 (acquired rev 38, held 1 revision)
locks: {}
```

---

## Cross-Agent Equivalence Summary (Claude Side)

| Scenario | Claude Verdict | Assertions Passed | Notes |
|----------|---------------|-------------------|-------|
| 4. Turnfile coordination | PASS | PT-TURN-001/002/003, PT-GOV-001 | 4 tasks self-assigned and completed |
| 1. PRD review round-trip | PASS | PT-PAY-001/002, PT-MBOX-001/002/003, PT-REC-001, PT-GOV-001 | MSG-041 receiver path |
| 3. Session close/resume | PASS | PT-RES-001/002, PT-BOUND-001/002, PT-TURN-001/002, PT-GOV-001 | Session 10→11 boundary |
| 2. Shared-file lock cycle | PASS | PT-LOCK-001, PT-TURN-001, PT-GOV-001 | Live lock exercise rev 38→39 |

**All 4 scenarios PASS on Claude side.** 17 unique assertion verdicts recorded across all scenarios.
