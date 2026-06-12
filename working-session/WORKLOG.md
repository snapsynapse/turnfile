# Worklog — Turnfile

References:
- `/Users/snap/Git/turnfile/docs/PROTOCOL_CORE.md`

Now Working (Codex): On line for session 14. Pending claim: s14-prd-021-cross-review (MSG-20260612-018).
Now Working (Claude): Session 14 active (Fable 5). Task: s14-state-reconciliation, then s14-backlog-triage.
Maintainer Focus: Session 14 backlog triage decisions — complete or supersede PRD-002/015/017-020 drafts, Gemini onboarding package, OQ-051/054-057. Ratify new baseline statement.
Next Review Checkpoint: In-session — backlog triage decision pass with Maintainer.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| MSG-017 counter amendments verified by Codex as resolved (no further Codex counters); closeout signal posted. | Codex | 2026-02-11 | MSG-20260211-017 verification |
| PRD-001 promoted to docs/prds and MSG-017 Gemini onboarding review actioned with two counters (skill semantic parity requirements). | Codex | 2026-02-11 | PRD-001 promotion + MSG-20260211-017 follow-through |
| PRD-017/018/019/020 Codex acceptance synchronized after MSG-010 amendment verification; maintainer gates remain pending. | Codex | 2026-02-11 | MSG-20260211-010 follow-through |
| PRD-001 Codex/Claude acceptance evidence logged; maintainer conditions from MSG-012 satisfied. | Codex | 2026-02-11 | MSG-20260211-011/012 follow-through |
| PRD-015 maintainer acceptance withdrawn as premature; generalized onboarding validation evidence required before re-acceptance. | Maintainer | 2026-02-11 | MSG-20260211-015 |
| PRD-001 conditionally accepted (`approve-with-conditions`), pending Codex/Claude review evidence. | Maintainer | 2026-02-11 | MSG-20260211-012 |
| PRD-015/016 approval snapshot recorded (later superseded for PRD-015 by MSG-20260211-015). | Maintainer | 2026-02-11 | MSG-20260211-007 |
| `current_task` must reference registered Turnfile tasks only; ad-hoc work tracked in WORKLOG | Claude (proposed) | 2026-02-11 | MSG-20260211-002 reply |
| **All changes Maintainer-gated by default.** Selective unlocks to follow. (OQ-052) | Maintainer | 2026-02-11 | PRD-018 R3, MSG-20260211-006 |

## Archived Sessions

| Session | Date | Summary |
|---------|------|---------|
| 11 | 2026-02-08 | Session close with cleanup guardrails and boot rollover artifacts. |
| 12 | 2026-02-10/11 | Full session compacted to WORKLOG_ARCHIVE.md. Bootstrap, skill validation, boot rewrites, PRD-001 promotion, PRD-017-020 refinement, Gemini onboarding staging. 18 entries, revisions 1-29. |

## Session 13 — 2026-02-11 (Claude only)

### Claude: PRD-001 review + mail processing + Gemini onboarding artifacts + thread closure

2026-02-11 — Session 13 covered four major work streams:

**1. PRD-001 full review (MSG-011):** Cross-referenced PRD-001 against PRD-003/004/018/019/020. Applied 3 amendments: R1.4 field name alignment, routing-critical minimum clarification, PRD-019 R4.1 cross-reference. APPLY with amendments posted.

**2. Mailbox processing:** Reviewed MSG-014 (PRD-002 scaffold v2 — APPLY with 3 counters: unread count, parse fields, refresh independence). Reviewed MSG-016 (onboarding test suite — APPLY with 1 counter: add OT-008). Acknowledged MSG-013 priority counter from Codex. Processed PRD-015 rollback alignment.

**3. Gemini onboarding artifacts staged (MSG-017):**
- `GEMINI.md` (project root) — bootstrap instruction file with `@import` syntax
- `working-session/boot-gemini.md` (v1) — adapted from boot-claude.md v6
- `skills/gemini-3/SKILL.md` (v0.1.0) — 9 modules adapted from Claude v0.3.0
- `skills/gemini-3/MANIFEST.yaml` + `CHANGELOG.md`
- `working-session/docs/gemini-onboarding/vetting-plan.md` — OT-001 through OT-008 mapping
- `skills/STRUCTURE.md` updated with Gemini entry
- Codex cross-reviewed with 2 counters (Module 5 lock rules + Module 2 stale messages), both applied and verified.

**4. Thread closure:** MSG-010 closed (PRD-017-020 all counters resolved). MSG-013 closed (superseded by MSG-017). MSG-017 closed (all counters resolved, Codex verified).

**5. Session close:** `.gitignore` updated to track `working-session/`. WORKLOG compacted (Session 12 moved to archive). Boot file archived and updated.

```text
Handoff: All Claude threads closed. Gemini onboarding package ready for Maintainer governance review. working-session/ now tracked in git.
Owner: Maintainer
Status: Complete
Changed files:
  - GEMINI.md (new — project root Gemini instruction file)
  - .gitignore (working-session/ removed from ignore)
  - skills/gemini-3/SKILL.md (new — Gemini protocol skill v0.1.0)
  - skills/gemini-3/MANIFEST.yaml (new)
  - skills/gemini-3/CHANGELOG.md (new)
  - skills/STRUCTURE.md (Gemini entry added)
  - working-session/boot-gemini.md (new — Gemini boot file v1)
  - working-session/docs/gemini-onboarding/README.md (updated — all artifacts done)
  - working-session/docs/gemini-onboarding/vetting-plan.md (new)
  - working-session/docs/PRD-001-maintainer-interaction-model.md (3 amendments)
  - working-session/MAILBOX.md (MSG-010/013/017 closed, MSG-017 posted + counters resolved)
  - working-session/MAILBOX.json (regenerated)
  - working-session/TURNFILE.yaml (rev 29→30, Claude idle)
  - working-session/WORKLOG.md (session 12 compacted, session 13 entry)
  - working-session/WORKLOG_ARCHIVE.md (session 12 archived)
  - working-session/boot-claude.md (v6→v7, updated state)
  - working-session/chat-claude.md (session 13 snapshot)
  - docs/archive/boot-claude/boot-claude_v7.md (archived)
Tests run:
  - node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
  - node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
  - node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json
Blocking items:
  - Maintainer acceptance pending for PRD-002, PRD-017/018/019/020.
  - Maintainer governance review pending for Gemini onboarding package.
  - PRD-015 gate requires onboarding validation evidence.
Next owner: Maintainer.
```

## Session 14 — 2026-06-12 (Claude on Fable 5 + Codex + Maintainer)

### Claude: session open + state-drift reconciliation (s14-state-reconciliation)

2026-06-12 — Session 14 opened at revision 31 on branch `prd-021-conflict-loop-gradient`. Claude-side agent now runs on Fable 5 (claude-fable-5), a model generation swap from Opus 4.6 with zero protocol migration — recorded as portability evidence for the core Turnfile claim.

**Drift reconciliation (honest record, not retcon).** Between session 13 close (2026-02-11, rev 30) and session 14 open (2026-06-12, rev 31), the following work happened outside the coordination protocol, by the Maintainer directly:

1. 2026-04-03/06 — Ownership transferred to PAICE.work PBC; sponsorship added; `feature/skills` merged to `main` (sessions 12-13 work landed).
2. 2026-04-09 — Landing page (docs/index.html), CNAME, mobile nav fix.
3. 2026-04-21 — gitignore + robots updates.
4. 2026-05-03 — Validation evals + tightened protocol checks.
5. 2026-05-28 — Distribution Engine README schema.
6. 2026-05-31 — **Scope reset**: INTENT.md v0.1.0 (narrowed positioning: thin governance layer for auditable peer disagreement), SPEC.md v0.1.0-reset, DEFINITIONS.md, ROADMAP.md, SECURITY.md. INTENT supersedes VISION for forward direction.
7. 2026-06-01 — PRD-021 drafted (labeled "session 14 draft" but no session 14 was opened in coordination state at that time). OQ-058..061 resolved by Maintainer and recorded in OPEN_QUESTIONS.md.
8. 2026-06-03 — Scope updates commit (b128cf6).

Maintainer out-of-band work is legitimate under HUMAN_GOVERNANCE (Maintainer holds authority), but the coordination record did not capture it until now. Lesson candidate for retrospective: long maintainer-only gaps need a lightweight "maintainer changelog into WORKLOG" habit, or drift accumulates against the protocol's own auditability claim.

**Session 14 goals (Maintainer-set):**
1. New baseline of what Turnfile is and how it works as a project (post-scope-reset).
2. Clear previous backlog: each open item completed or superseded, with explicit recorded status.
3. PRD-021 cross-review by Codex (current branch deliverable).

Tasks registered at rev 31: s14-state-reconciliation (claude, in_progress), s14-backlog-triage (claude, pending), s14-prd-021-cross-review (codex, pending), s14-baseline-statement (claude, pending).

## Decision Index — Session 14

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Session 14 scope: decisions + records only; implementation (starter workflow, skill-layout migration) registered as follow-on tasks. | Maintainer | 2026-06-12 | Session 14 open |

### Claude: backlog triage executed (s14-backlog-triage) — rev 32

2026-06-12 — Maintainer triage decisions applied (mirrored in MSG-20260612-019):

1. **PRD-018 accepted + promoted** to `docs/prds/`. All gates pass. Unblocks PRD-021.
2. **PRD-019 accepted + promoted** to `docs/prds/`. R3 amended: no time-based polling; coordination is asynchronous/event-based only (OQ-054/055 resolved).
3. **PRD-020 folded into PRD-017 as R7**; PRD-020 superseded (tombstone retained). OQ-056 (yes fixed metadata fields) and OQ-057 (manual structure) resolved in R7.4.
4. **PRD-017 Maintainer-accepted** with fold; OQ-051 resolved (documented command contract + optional helpers). Promotion held on Codex re-verify of folded R7 (MSG-20260612-020) since Codex's Feb acceptance predates the fold.
5. **PRD-002 deferred** (built-tool PRD predates thin-governance scope; revisit after starter workflow).
6. **PRD-015 + Gemini onboarding parked** (deferred; resurrect after model-agnostic skill layout; OT-001..008 preserved).
7. **Tooling:** `validate-prd-promotion.mjs` extended with `deferred`/`superseded` terminal statuses (Band B, Maintainer present/approving) — registry could not previously record triage outcomes without misstating them (drift elimination per Maintainer standing guidance).

OPEN_QUESTIONS.md: zero active questions remain (OQ-051 through OQ-061 all resolved). Promotion validator passes across all 21 registry entries.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-018 accepted and promoted to docs/prds. | Maintainer | 2026-06-12 | MSG-20260612-019 item 1 |
| PRD-019 accepted and promoted; no time-based polling, event-based only (OQ-054/055). | Maintainer | 2026-06-12 | MSG-20260612-019 item 2 |
| PRD-020 folded into PRD-017 R7 and superseded; OQ-051/056/057 resolved; PRD-017 accepted pending Codex fold re-verify. | Maintainer | 2026-06-12 | MSG-20260612-019 item 3 |
| PRD-002 kept as deferred draft. | Maintainer | 2026-06-12 | MSG-20260612-019 item 4 |
| PRD-015 + Gemini onboarding parked as deferred. | Maintainer | 2026-06-12 | MSG-20260612-019 item 5 |
| Standing guidance: examine and eliminate drift opportunities; promotion validator extended with terminal statuses. | Maintainer | 2026-06-12 | MSG-20260612-019 item 6 |
