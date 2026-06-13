# Worklog — Turnfile

References:
- `/Users/snap/Git/turnfile/docs/PROTOCOL_CORE.md`

Now Working (Codex): Session 14 active. PRD-023/026/027 counters applied and Codex-owned review threads closed; PRD-022 reviewed with amendment; Codex unread 0.
Now Working (Claude): Session 14 active (Fable 5). PRD-022 closure owner; Claude unread 0.
Maintainer Focus: PRD-023/026 are agent-accepted and await Maintainer acceptance. PRD-024 still needs Maintainer acceptance before first live Tokenese clone use; PRD-027 is agent-accepted with PRD-024 + Maintainer gates pending.
Next Review Checkpoint: Claude closure/post-review acceptance on PRD-022 (MSG-20260613-028), Maintainer acceptance decisions for PRD-023/024/026/027, and optional sequencing for tokenese handoff tasks after PRD-024+027 acceptance.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Codex applied Claude PRD-023 amendment; PRD-023 agent gates complete, Maintainer acceptance pending. | Codex + Claude | 2026-06-13 | MSG-20260612-026 closure |
| Codex applied Claude PRD-026 counters; OQ-064 resolved standalone; PRD-026 agent gates complete, Maintainer acceptance pending. | Codex + Claude | 2026-06-13 | MSG-20260612-027 closure |
| Codex applied Claude PRD-027 counters; PRD-027 agent gates complete, Maintainer + PRD-024 gates pending before tokenese clone use. | Codex + Claude | 2026-06-13 | MSG-20260613-029 closure |
| Codex reviewed PRD-022 APPLY with amendment; OQ-065 resolved; Claude post-review acceptance pending. | Codex | 2026-06-13 | MSG-20260613-028 |
| Maintainer accepted PRD-021 as-is; Codex promoted PRD-021 to `docs/prds/`. | Maintainer + Codex | 2026-06-13 | PRD-021 promotion — rev 61 |
| Codex corrected PRD-027 to Tokenese cloned-communication A/B after Maintainer clarified that Tokenese replicates existing communication for measurement and replaces nothing. | Maintainer + Codex | 2026-06-13 | PRD-027 clarification — rev 63 |
| Codex adopted Maintainer collision directive: full Module 5 revision-lease locks for shared-file writes while both agents are active; new PRD only if collisions continue despite existing structures. | Codex | 2026-06-12 | MSG-20260612-025 |
| Codex accepted PRD-024 document with amendment: dense scratchpads require session-charter opt-in; labeled dense blocks without immediate paraphrase are validation errors; OQ-062/063 resolved. | Codex | 2026-06-12 | MSG-20260612-024 |
| Codex accepted PRD-023 drafting lane and withdrew the PRD-025 new-PRD position in favor of a PRD-014 amendment for closeout compaction/projection sync. | Codex | 2026-06-12 | MSG-20260612-024 |
| Codex drafted PRD-023 out-of-band activity reconciliation and routed MSG-20260612-026 to Claude for full cross-review. | Codex | 2026-06-12 | MSG-20260612-026 |
| Codex drafted PRD-026 review-cycle closure/task-state consistency proposal and routed MSG-20260612-027 to Claude for apply-or-counter review. | Codex | 2026-06-13 | MSG-20260612-027 |
| Codex communicated MSG-20260612-023 actioned state to Claude via SIG-041; awaiting Claude closure/sequencing. | Codex | 2026-06-12 | SIG-041 |
| Codex accepted PRD-022/023/024 candidate sequencing with amendments and proposed PRD-025 candidate for closeout compaction/projection sync. | Codex | 2026-06-12 | MSG-20260612-023 |
| Codex skill bundle cloned/upgraded to role-keyed `skills/codex/` v2; `skills/codex_5.3/` deprecated in place. | Codex | 2026-06-12 | Codex skill migration — rev 38 |
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
| PRD-021 Codex cross-review APPLY with amendment; R2 marker staleness clarified and promoted PRD-018/019 paths corrected. | Codex | 2026-06-12 | MSG-20260612-018 |
| PRD-017 folded R7 re-verified by Codex; PRD_STATUS blocker cleared and PRD-017 eligible for docs/prds promotion. | Codex | 2026-06-12 | MSG-20260612-020 |
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

### Codex: PRD-021 cross-review + PRD-017 fold re-verify — rev 34

2026-06-12 — Codex session 14 booted, claimed `s14-prd-021-cross-review`, and processed both unread Codex mailbox requests.

1. **MSG-20260612-020 (PRD-017 R7 fold): APPLY.** R7.1-R7.5 faithfully carry PRD-020 R1-R5 semantics, including the deadlock-free peer-file rule: own chat file/control-plane artifacts block; missing peer chat file warns only. Acceptance criteria 6-8 cover the folded scope. PRD_STATUS now records Codex acceptance of the folded R7 and clears the re-verify blocker.
2. **MSG-20260612-018 (PRD-021): APPLY with amendment.** PRD-021 aligns with PRD-018, PRD-019, the intended conflict-resolution ladder amendment, and SPEC.md v0.1.0-reset. Codex amended PRD-021 to update PRD-018/019 paths to `docs/prds` and clarify that `NO-NEW-OBJECTION` markers are conflict-specific/current-round scoped, with latest entries controlling convergence after any rebuttal.

Validation completed in this turn: mailbox projection regenerated; mailbox invariants PASS; Turnfile lint PASS; PRD promotion validation PASS with one expected warning that PRD-017 is eligible and still in `working-session/docs` pending promotion.

### Claude: baseline statement + review closures (s14-baseline-statement) — rev 34

2026-06-12 — Maintainer direction (mirrored in MSG-20260612-021): new top-level baseline document plus README rewrite.

1. **BASELINE.md created** (repo root): ratified snapshot — what Turnfile is post-reset, how the project works, canonical doc set, full PRD shelf statuses, standing decisions, forward task register (model-agnostic skill layout, root AGENTS.md/CLAUDE.md, minimal starter workflow, platform integration notes, PRD findability).
2. **README.md rewritten:** full 21-PRD status index spanning both shelves with the two-shelf layout explained (fixes the findability failure the Maintainer hit during triage), BASELINE links in quick start and document map, session 14 status, forward register headlines, skill-directory naming note.
3. **MSG-20260612-020 closed:** Codex APPLY on PRD-017 R7 fold. **PRD-017 promoted to docs/prds.** PRD-020 tombstone retained.
4. **MSG-20260612-018 closed:** Codex APPLY with amendment on PRD-021. Claude reviewed the amendment (conflict-specific, current-round-scoped NO-NEW-OBJECTION markers; stale markers cleared by substantive rebuttals) and accepted — it fixes the convergence race flagged in the review ask. Claude acceptance recorded. **Remaining PRD-021 gate: Maintainer PRD-document acceptance only.**

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| BASELINE.md created as ratified top-level project baseline; README rewritten with full PRD status index. | Maintainer | 2026-06-12 | MSG-20260612-021 |
| PRD-017 promoted to docs/prds (Codex fold re-verify APPLY; executes MSG-019 item 3 acceptance). | Codex verify + Maintainer prior acceptance | 2026-06-12 | MSG-20260612-020 closure |
| PRD-021 Codex amendment accepted by Claude; agent gates complete. | Claude | 2026-06-12 | MSG-20260612-018 closure |

### Codex: role-keyed skill clone + upgrade — rev 38

2026-06-12 — Per Maintainer direction, Codex cloned the repo/global-matching v1 bundle from `skills/codex_5.3/` into the role-keyed path `skills/codex/` and upgraded the clone to v2.

1. `skills/codex/` is now the Codex-owned canonical bundle. `MANIFEST.yaml` records GPT-5 compatibility and Session 14 validation context; `SKILL.md` keeps minimal Codex-compatible frontmatter.
2. `skills/codex_5.3/` is deprecated in place with `DEPRECATED.md`; no files removed.
3. Repo references updated: `skills/STRUCTURE.md`, `README.md`, `BASELINE.md`, `working-session/boot-codex.md`, and `tools/validate-skills-preflight.mjs`.
4. `MSG-20260612-022` acknowledged and closed. Codex unread 0.

### Claude: skill bundle clone + upgrade (Maintainer-directed) — rev 37

2026-06-12 — Maintainer direction: clone and upgrade the Claude skill bundle. Executes the Claude side of BASELINE forward register item 1.

1. **New bundle:** `skills/claude/` (role-keyed). SKILL.md v0.4.0, MANIFEST bundle_version 4, CHANGELOG v4 entry.
2. **Upgrades over v3:** protocol baseline extended to PRD-016..019; PRD-017 R7 chat-file rules encoded (own-file creation, peer-file warning, fixed session-header metadata); PRD-019 event-based cadence statement + chat-decision mirror duty including the session-14 delivery-gap workaround; Module 0 preflight path updated; pending PRD-021 note (R5 propagation encoded only after promotion).
3. **Model identity moved to manifest:** designed_for is model-agnostic; tested_on records Opus 4.6 (v3, 12 sessions) and Fable 5 (session 14 live run on unmodified v3 — portability evidence) per skill-versioning conventions.
4. **Old location deprecated in place:** `skills/claude-opus_4.6/DEPRECATED.md` added; directory retained pending Band C removal approval. STRUCTURE.md and README updated; BASELINE register item 1 updated (Claude done; Codex bundle + preflight default path remain, Codex-owned).
5. PRD-012 R7.3 classification: environment/layout change, no protocol-semantics change beyond encoding already-promoted contracts; Claude-owned with Maintainer direction; documented here.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Claude skill bundle cloned to role-keyed skills/claude/ and upgraded to v0.4.0; old path deprecated in place pending Band C removal. | Maintainer (direction) + Claude (execution) | 2026-06-12 | Skill bundle upgrade, rev 37 |

### Claude: PRD candidate proposals + Maintainer session directive logged — rev 39

2026-06-12 — Maintainer standing direction logged (relayed verbatim in MSG-20260612-023): session 14 establishes the baseline and updated floor; agents work in adversarial collaboration; everything stays logged, visible, request-based, human-legible; tokenese (new agent language) arrives next session. Codex 5.5 confirmed on the Codex lane (second model-generation swap this session, same protocol). MSG-20260612-023 posted to Codex: PRD-022 candidate (decision-mirror delivery guarantee), PRD-023 candidate (out-of-band activity reconciliation), PRD-024 candidate (human-legibility invariant + encoding profiles, preparing tokenese), plus 5-item cleanup register. Adversarial apply-or-counter requested.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Session directive: adversarial collaboration mode; all work logged/visible/request-based/human-legible; tokenese deferred to next session. | Maintainer | 2026-06-12 | MSG-20260612-023 relay |

### Codex: PRD candidate apply/counter review — rev 40

2026-06-12 — Codex actioned MSG-20260612-023 with adversarial apply/counter notes.

1. **PRD-022 candidate (decision-mirror delivery guarantee): APPLY with amendment.** Codex agrees the delivery gap is real. Preferred framing: define `audit-mirror` vs `delivery-mirror`; delivery mirrors require unread notify + receiver ack + sender close after all acks or SLA lapse. Per-session mirror digest is defense-in-depth, not the primary guarantee.
2. **PRD-023 candidate (out-of-band activity reconciliation): APPLY with amendment.** Keep it portable: git comparison when available, runtime-neutral Maintainer changelog/checkpoint note as minimum conformance. Boot drift checks flag unrecorded activity; they block only if unrecorded activity changes governance state.
3. **PRD-024 candidate (human-legibility invariant + encoding profiles): APPLY.** Sequence before tokenese. Governance records remain human-legible; dense/tokenese lanes require human-legible projection or linked translation, and Maintainer may demand projection.
4. **Cleanup register:** accepted with notes. PRD-021 "both agents" wording should become "all participating agents" during R5 propagation; signal compaction belongs at closeout; old skill directory removal remains Band C; root `AGENTS.md` should be minimal/bootstrap-oriented; canonical OQ sync should merge OQ-051..061 without dropping historical deferred OQ-003/OQ-026.
5. **Additional Codex candidate:** PRD-025 or PRD-014 amendment for closeout compaction and projection sync if signal compaction, mailbox archive movement, JSON projection regeneration, and boot handoff updates continue recurring as ad hoc closeout work.

### Claude: mailbox polling loop enabled (Maintainer direction) — harness tooling hook

2026-06-12 — Maintainer directed a 2-minute mailbox check loop in Claude's harness (/loop). Recorded as a harness-level transport/tooling hook, not a protocol cadence obligation: OQ-054/055 resolution (no time-based polling; event-based only) governs protocol obligations and SLAs, which remain session-based. Note for PRD-022 review: the OQ-054/055 rationale ("agents are stateless and session-bounded") predates harness loop capabilities (Feb 2026); delivery mechanics should be revisited there with this capability in scope.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| 2-minute mailbox check loop approved as Claude harness tooling hook; protocol cadence remains event-based; rationale shift flagged to PRD-022. | Maintainer | 2026-06-12 | Mailbox polling loop |

### Claude: MSG-023 adversarial review cycle closed — rev 41

2026-06-12 — Codex actioned MSG-023 (full apply/counter). Claude assessed and closed:

1. PRD-022 (mirror delivery): Codex amendment accepted — two explicit modes, `audit-mirror` (closed-on-posting, no guarantee) and `delivery-mirror` (unread notify + receiver ack + sender close). Design point for drafting: mode-selection default rule.
2. PRD-023 (out-of-band reconciliation): Codex amendment accepted — runtime-neutral Maintainer changelog as minimum conformance, git-history comparison as enhancement; drift checks flag, not block.
3. PRD-024 (human-legibility invariant): dual-agent APPLY; both agents flag it must land before tokenese.
4. Cleanups 4-8 agreed, including Codex's catch on cleanup 8: canonical deferred OQ-003/OQ-026 must be preserved during registry sync.
5. **Open disagreement (first of the session, preserved per protocol):** closeout compaction/projection sync — Codex proposes new PRD-025; Claude counters that PRD-014 amendment is correct (closeout is PRD-014 scope; INTENT directs reducing protocol mass). Routed to Maintainer for decision.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-022/023 amended scopes and PRD-024 scope agreed by both agents; awaiting Maintainer sequencing. | Codex + Claude (agent-level) | 2026-06-12 | MSG-023 closure |

### Maintainer clarification: loop is interaction gearing, not protocol cadence

2026-06-12 — Maintainer confirmed the event-based resolution of OQ-054/055 stands. The 2-minute harness loop is ratified as **interaction gearing**: a transport-level pacing mechanism that compensates for response-time differential between agents inside a live working session. It creates no protocol obligation, no SLA change, and no wall-clock duty for any agent. Distinction to carry into PRD-022 drafting: *protocol cadence* (event-based, session-measured, normative) vs *interaction gearing* (harness-local, optional, performance-only, per-session Maintainer choice).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| OQ-054/055 event-based resolution reaffirmed; harness loops ratified as optional per-session interaction gearing, not protocol cadence. | Maintainer | 2026-06-12 | Loop clarification |

### Claude: PRD drafting begun (Maintainer green-light) — rev 43

2026-06-12 — Maintainer directed agents to begin PRD work and hash out open points in dialogue. Claude actions:

1. **PRD-024 draft v1 staged** (`working-session/docs/`): human-legibility invariant + encoding profiles. Two profiles (legible/dense); governance record locked legible; chat scratchpad body the only dense-permitted class at launch; projection contract with turn-end deadline and author liability; Maintainer demand rights with P1 SLA and circuit-breaker; flag-not-block validation; promotion is a sequencing gate before tokenese (AC5). OQ-062/063 registered.
2. **MSG-20260612-024 posted to Codex:** PRD-024 full cross-review request (token REV-20260612-prd024-01-hcf5498cd); drafting work split proposal (Codex: PRD-023, Claude: PRD-022 incorporating Codex's mirror-mode design); PRD-025 rebuttal round 1 (Claude case for PRD-014 amendment, with steelman of Codex position).
3. **Tasks registered at rev 43:** s14-prd-024-draft (claude, P0, in_progress), s14-prd-022-draft (claude, pending), s14-prd-023-draft (codex, pending lane confirmation).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD drafting green-lit; agents to converge via dialogue, Maintainer arbitrates remaining disagreements. | Maintainer | 2026-06-12 | PRD drafting kickoff |

### Maintainer directive: collision discipline — existing structures first

2026-06-12 — Both agents now write concurrently. Maintainer direction: use existing Turnfile collision structures (PRD-010 transaction discipline, PRD-013 revision-lease locks, signal channel, deterministic ID allocation) before inventing anything new; propose a new PRD only if collisions persist despite them. Evidence so far: one live collision this session (duplicate SIG-041 attempt) was absorbed by the pre-write re-read + ID re-allocation guard with zero data loss. Claude switching from bare re-read-retry to full Module 5 lock ceremony for shared-file writes while both agents are active.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Collision handling: existing PRD-010/013 structures first; new PRD only on demonstrated insufficiency. | Maintainer | 2026-06-12 | Collision discipline directive |

### Codex: PRD-024 cross-review + collision parity adoption — rev 46/47

2026-06-12 — Codex processed MSG-20260612-024 and MSG-20260612-025 under the Maintainer-directed collision discipline. A revision-lease lock was acquired before control-plane synchronization; PRD draft edits that preceded processing MSG-025 were then synchronized in the locked transaction.

1. **MSG-20260612-024 actioned.** PRD-024 document review is APPLY with amendment. Codex amended R2 so dense scratchpad bodies require explicit session-charter opt-in and default to legible otherwise; amended R5.1 so labeled dense blocks without an immediate paraphrase are validation errors while unlabeled suspicious blobs remain heuristic flag-not-block; resolved OQ-062/OQ-063 in PRD-024 and the active OQ registry. Codex accepts the PRD-023/PRD-022 work split and claims `s14-prd-023-draft`. Codex posts `NO-NEW-OBJECTION` on the PRD-025 disagreement and accepts the PRD-014 amendment path for closeout compaction/projection sync.
2. **MSG-20260612-025 actioned.** Codex adopts parity with the Maintainer directive: use existing PRD-010/013 transaction structures first, including full Module 5 revision-lease locks for shared control-plane writes while both agents are active. The SIG-041 duplicate-ID collision remains the current evidence item; a new PRD is proposed only if collisions continue despite this discipline.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-024 Codex document cross-review accepted with amendment; Claude post-amendment acceptance and Maintainer acceptance remain. | Codex | 2026-06-12 | MSG-20260612-024 |
| PRD-025 new-PRD disagreement converged: PRD-014 amendment path accepted by Codex, pending Claude closure. | Codex + Claude pending closure | 2026-06-12 | MSG-20260612-024 |

### Codex: PRD-023 draft routed for Claude review — rev 50/51

2026-06-12 — Codex drafted `working-session/docs/PRD-023-out-of-band-activity-reconciliation-contract.md` and routed MSG-20260612-026 to Claude for apply-or-counter review.

Draft scope:

1. Runtime-neutral reconciliation note in WORKLOG as minimum conformance.
2. Git comparison as an optional enhancement, not a dependency.
3. Boot drift check that flags unrecorded activity and blocks only when governance state appears affected.
4. Maintainer out-of-band authority preserved; record hygiene added without prior restraint.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-023 draft v1 is staged and awaiting Claude cross-review. | Codex | 2026-06-12 | MSG-20260612-026 |

### Codex: PRD-026 proposal routed for Claude review — rev 56/57

2026-06-13 — Maintainer asked Codex whether it had another PRD proposal from session 14 observations. Codex drafted `working-session/docs/PRD-026-review-cycle-closure-and-task-state-consistency-contract.md` and routed MSG-20260612-027 to Claude for apply-or-counter review.

Draft scope:

1. Review-cycle closure checklist for PRD review messages.
2. Clear split between closure-owner synchronization and reviewer-owned pre-yield self-checks.
3. Warning-level closure drift validator/helper covering task, mailbox, registry, and agent task-pointer inconsistencies observed in session 14.
4. Explicit no-new-authority and no-new-collision-control constraints.

OQ-064 registered: decide whether this should remain standalone PRD-026 or become an amendment to PRD-003, PRD-006, PRD-013, or PRD-019.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-026 draft v1 is staged and awaiting Claude cross-review. | Codex | 2026-06-13 | MSG-20260612-027 |

### Claude: review batch + state corrections — rev 59

2026-06-13 — Under lock-claude-review-batch:

1. **PRD-023 reviewed (MSG-026): APPLY with 1 amendment** — R4 governance-block must route a decision-required message with evidence + draft reconciliation note (block always carries its exit path). Claude acceptance recorded accepted-with-amendment.
2. **PRD-026 reviewed (MSG-027): APPLY with 2 counters** — (P1) R5.2 must prohibit non-owner repair of another agent's owned task rows: flag, never fix in place; (P2) OQ-064 position: standalone PRD-026, with explicit scope boundary against the converged PRD-014 amendment (review-cycle closure vs session-level compaction; shared validator).
3. **PRD-024 agent gates complete:** Claude accepted Codex amendments. Only Maintainer acceptance remains on the tokenese sequencing gate.
4. **MSG-024/025 closed.** PRD-025 convergence (Codex NO-NEW-OBJECTION → PRD-014 amendment path) recorded; s14-prd-014-amendment task registered (unassigned, awaiting Maintainer sequencing).
5. **Claude-owned task rows owner-corrected:** s14-prd-024-draft done with completed_rev 59; s14-prd-022-draft reverted to in_progress (had been marked done by a non-owner with no draft on disk).

**Collision/discipline ledger:**
| # | Date | Event | Class | Resolution |
|---|------|-------|-------|------------|
| 1 | 2026-06-12 | Duplicate SIG-041 attempt (both agents) | Write collision | Pre-write re-read + ID re-allocation; zero loss |
| 2 | 2026-06-13 | Claude-owned task rows mutated to done by non-owner; one factually false (no PRD-022 draft) | Ownership discipline (PRD-013 R2.1) | Owner-corrected at rev 59; contractual fix proposed as PRD-026 counter 1 |
| 3 | 2026-06-13 | Duplicate SIG-050 (Claude computed ID from stale pre-lock read) | Write collision | Caught by turnfile-lint post-write; renumbered SIG-051. Lesson: ID allocation re-read must happen inside the lock window |

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-025 scope resolved by convergence: PRD-014 amendment path (first full rebuttal-loop convergence). | Codex + Claude | 2026-06-13 | MSG-024 closure |
| PRD-024 agent acceptance complete (both agents); Maintainer gate remains. | Codex + Claude | 2026-06-13 | PRD-024 gate |

### Codex: PRD-021 promotion + PRD-027 Tokenese adoption draft — rev 60/61

2026-06-13 — Maintainer accepted PRD-021 as-is after agent review. Codex recorded Maintainer acceptance in the PRD gate, promoted `PRD-021-conflict-loop-bound-and-selective-unlock-gradient-contract.md` to `docs/prds/`, updated the registry and visible PRD indexes, and drafted `working-session/docs/PRD-027-tokenese-cloned-communication-ab-contract.md`.

Tokenese source review:

1. `/Users/snap/Git/tokenese/HANDOFF.md`
2. `/Users/snap/Git/tokenese/spec.md`
3. `/Users/snap/Git/tokenese/DESIGN.md`
4. `/Users/snap/Git/tokenese/INTENT.md`
5. `/Users/snap/Git/tokenese/CONFORMANCE.md`

The requested path `~/git/tokenese/working-session` was not present locally; root `HANDOFF.md` was the available handoff artifact. PRD-027 follows the Tokenese handoff gate by making PRD-024 Maintainer acceptance a sequencing requirement before first live Tokenese use. The initial draft described a parallel adoption layer; Maintainer clarified this was too broad. Corrected framing: Tokenese replicates existing Turnfile communications as cloned A/B copies only. The existing human-legible communication remains the control, authority, and source of truth.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-021 accepted by Maintainer and promoted to `docs/prds/`. | Maintainer + Codex | 2026-06-13 | PRD-021 promotion |
| PRD-027 draft v1 staged and routed to Claude for full review. | Codex | 2026-06-13 | MSG-20260613-029 |

### Codex: PRD-027 clarification applied — rev 62/63

2026-06-13 — Maintainer clarified that PRD-027 should not adopt Tokenese as a replacement or alternate communication authority. It should clone existing Turnfile communications into Tokenese so the Tokenese layer is a clear A/B test. Codex revised PRD-027, the active mailbox review card, PRD_STATUS, README index, and Turnfile signal/task notes accordingly.

Corrected contract shape:

1. Every Tokenese item is a clone paired to a normal human-legible Turnfile source communication.
2. The source communication remains the control, authority, and source of truth.
3. Tokenese clones cannot change lifecycle status, create or close tasks, claim locks, record acceptance, or substitute for mailbox/worklog/Turnfile entries.
4. Divergence between clone and source is A/B data; the source wins.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-027 intent clarified: Tokenese replicates existing communications as cloned A/B copies and replaces nothing. | Maintainer | 2026-06-13 | Maintainer chat clarification |

### Claude: PRD-027 review vs tokenese handoff + PRD-022 routed — rev 65

2026-06-13 — Maintainer requested PRD-027 evaluation against /Users/snap/Git/tokenese/HANDOFF.md. Verdict: APPLY with 2 counters (MSG-029 reply): (P1) missing teach-phase gate — handoff task 1 requires Codex production competence (novel recombinations) before A/B, R2.3 read-requirement insufficient and confounds the experiment; (P2) self-reported channels (^N, ev:) untrusted-by-default until calibration-audit passes. Notes: Codex nominates expected-to-lose tasks; spec v0.1.0 frozen with DESIGN.md precedence. Handoff's five tokenese tasks to be registered gated on PRD-024+027 acceptance, on Maintainer direction. MSG-028 (PRD-022 draft v1 review request) posted to Codex. Ledger item 4 (near-miss): Claude wrote PRD_STATUS/OQ registry while Codex held lock-codex-prd021-prd027 (lock-check ordering error); no conflict resulted — Codex merged around the writes. Lesson: lock check precedes ALL shared-file writes in a batch, not just mailbox.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-027 Claude review: accepted-with-amendment (teach gate + channel trust rule). | Claude | 2026-06-13 | MSG-029 reply |

### Codex: PRD-023/026/027 closure + PRD-022 review — rev 66/67

2026-06-13 — Maintainer directed Codex to advance approved work. Under `lock-codex-prd-review-closure`, Codex applied approved counters and synchronized the review cycle state.

1. **PRD-023 (MSG-026):** Applied Claude R4 amendment. Governance-state drift blocks now route a `decision-required` Maintainer message with observed evidence, suspected governance impact, and draft reconciliation note. PRD-023 agent gates complete; Maintainer acceptance remains.
2. **PRD-026 (MSG-027):** Applied Claude counters. Added explicit cross-ownership repair prohibition; non-owners flag another agent's task-row drift rather than repairing it in place. Resolved OQ-064 as standalone PRD-026 with boundary against the PRD-014 closeout amendment path. PRD-026 agent gates complete; Maintainer acceptance remains.
3. **PRD-027 (MSG-029):** Applied Claude counters. Added Tokenese teach-phase production-competence gate, teaching-token-cost logging, untrusted-by-default rule for `^N` and `ev:` until calibration, Codex nomination of expected-to-lose tasks, and spec/design precedence note. PRD-027 agent gates complete; Maintainer + PRD-024 gates remain before first live Tokenese clone use.
4. **PRD-022 (MSG-028):** Codex reviewed APPLY with amendment. Resolved OQ-065: PRD-004 blockquote relays default to `delivery-mirror`; downgrade requires explicit no-peer-binding/no-awareness-needed statement. Added validator warning for delivery-mirror receiver sets that appear not to include all bound parties. Claude post-review acceptance remains.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-023, PRD-026, and PRD-027 approved counters applied; Codex-owned review threads closed. | Codex | 2026-06-13 | MSG-026/027/029 closure |
| PRD-022 reviewed APPLY with amendment; OQ-065 resolved. | Codex | 2026-06-13 | MSG-028 reply |

### Claude: PRD-024 promoted; PRD-022 agent gates complete; PRD-024 propagation — rev 69

2026-06-13 — Under lock-claude-prd024-promotion:

1. **PRD-024 Maintainer-accepted and promoted to docs/prds** (validator pass). Tokenese sequencing gate at the PRD-024 level is satisfied; remaining stack: PRD-027 Maintainer acceptance → charter opt-in → teach phase (R2.6) → A/B pilot.
2. **PRD-024 R5 propagation executed (Claude side):** skills/claude/ SKILL.md v0.4.1 + MANIFEST v5 (encoding-profile obligations: legible-only governance record, charter opt-in, turn-boundary projection obligation, authorship liability); session-charter template gains encoding-profile line (R5.3). R5.1 validator dense-fragment rule registered as follow-on tooling task per AC4. Codex owes the skills/codex/ mirror per R5.2.
3. **PRD-022 Codex amendment accepted** (R2.5 relay default resolving OQ-065; R5.4 bound-party check). Agent gates complete; Maintainer acceptance pending. MSG-028 closed.
4. **MSG-030 posted as the first live delivery-mirror** (PRD-022 draft semantics dogfooded): PRD-024 acceptance binds both agents, so it ships unread with ack requirement rather than closed-on-posting — the exact failure mode PRD-022 fixes, now demonstrably not repeated.
5. Codex's counter-applications verified: PRD-023 R4 decision-required route, PRD-026 cross-ownership repair prohibition + PRD-014 boundary, PRD-027 R2.6 teach gate + channel-trust rule + spec-freeze note. Agent gates complete on PRD-022/023/026/027 — all four await only Maintainer acceptance.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-024 accepted and promoted (tokenese legibility gate live). | Maintainer | 2026-06-13 | MSG-20260613-030 mirror |
| PRD-022/023/026/027 agent gates complete; queued for Maintainer acceptance. | Codex + Claude | 2026-06-13 | Review cycle closures |
