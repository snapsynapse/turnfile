# Worklog — Turnfile

References:
- `/Users/snap/Git/turnfile/docs/PROTOCOL_CORE.md`

Now Working (Codex): Session 14 CLOSED. PRD-028 and PRD-029 are filed done. MSG-046 is acknowledged; Codex accepted the concurrent-write and closure-owner scan suggestions as Codex-owned skill hygiene, not as a peer directive. Codex unread 0; no locks. Carry-forward in closeout entry below.
Now Working (Claude): Session 14 CLOSED (Opus 4.8). All Claude lanes complete or handed off; unread 0; no locks. Carry-forward in closeout entry below.
Maintainer Focus: PRD-027 held until all other PRD items complete + commit/push/checkpoint discussion. See Maintainer Decision Queue below.
Maintainer Decision Queue (PRD-004 A1): (1) PRD-003/004/008 A1 document acceptances, if still desired before promotion; (2) model-specific skill directory retention/removal only by explicit Maintainer decision; no model-specific skill path is deprecated by default; (3) push/PR + session-15 boundary timing.
Next Review Checkpoint: Next session boot - run deferred WORKLOG and signal compaction first (see closeout), then PRD-014 A1 review, Codex implementation lanes (PRD-021/022/024, PRD-023/026), and Maintainer checkpoint before PRD-027.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Codex closed session 14 from its side: Codex idle in TURNFILE rev 124, boot handoff refreshed to v5, previous boot archived as `boot-codex_v4`, chat close snapshot written, and unresolved work explicitly carried forward. | Codex | 2026-06-13 | Codex session 14 close |
| Codex acknowledged Claude MSG-046 and accepted concurrent-write discipline plus closure-owner scanning as Codex-owned skill hygiene for a later Codex skill mirror/adaptation. | Codex + Claude | 2026-06-13 | MSG-20260613-046 |
| Claude reviewed Codex's PRD-029 implementation, approved `tools/next-state.mjs`, closed the Claude-owned skill propagation gap, and filed PRD-029 implementation done with evals 10/10 green. Codex closed its PRD-029 task row after receiving the review. | Codex + Claude | 2026-06-13 | MSG-20260613-045 + PRD-029 done |
| Codex reviewed Claude's PRD-028 implementation, confirmed `evals/prd-028.evals.mjs` 10/10 green plus Tokenese validator root scan pass, moved PRD-028 to `docs/prds/`, marked implementation done, and removed PRD-028 from PRD-027 blockers. | Codex + Claude | 2026-06-13 | MSG-20260613-042 + PRD-028 done |
| Codex partially implemented PRD-029: `tools/next-state.mjs` added, `skills/codex/` upgraded to v7 with the in-lock derivation obligation, and PRD-029 evals are 9/10 green pending Claude-owned skill propagation. | Codex + Claude | 2026-06-13 | MSG-20260613-041/045 + PRD-029 implementation |
| Codex upgraded `skills/codex/` to v6 with handshake-time model ledger validation and added the role-neutral ledger update rule requiring active agents to verify their current model/surface during session handshake. | Maintainer + Codex | 2026-06-13 | Codex skill v6 model ledger handshake |
| Codex created `docs/llm/MODEL_LEDGER.md` as the canonical project model-usage ledger, seeded from manifests, session charters, WORKLOG/TURNFILE evidence, README/BASELINE, and precursor `docs/llm` collaboration records. | Maintainer + Codex | 2026-06-13 | Model usage ledger |
| Codex acknowledged Claude MSG-041 PRD-029 implementation handoff; `s14-impl-029` remains queued behind current Codex active lanes unless the Maintainer reprioritizes. | Codex + Claude | 2026-06-13 | MSG-20260613-041 |
| Maintainer confirmed PRD-028 and PRD-029 acceptance directly to Codex; registry and PRD gate snapshots now record Maintainer acceptance while keeping implementation blockers active under PRD-006 A1. | Maintainer + Codex | 2026-06-13 | PRD-028/029 acceptance sync |
| Codex reviewed Claude skill v0.5.0 Files First, Not Memory principle from MSG-039, found it protocol-consistent, mirrored the adapted rule into `skills/codex/` v5, and synced the installed global Codex Turnfile skill copy. | Codex + Claude | 2026-06-13 | MSG-20260613-039 |
| Codex advanced PRD-028 under PRD-006 A1 step 4 by authoring `evals/prd-028.evals.mjs`, syncing PRD_STATUS to `evals-authored`, and correcting PRD-028 gate text to keep Maintainer document acceptance pending until explicit acceptance. | Codex | 2026-06-13 | PRD-028 eval-author step |
| Maintainer asked whether both agents are ready to compact the mailbox and close session 14; Codex posted MSG-038 asking Claude to confirm readiness or list blockers. | Maintainer + Codex | 2026-06-13 | MSG-20260613-038 |
| Maintainer clarified that model-specific skill directories are not deprecated merely because they are not active in this session; no LLM, model, or model-specific skill path is deprecated unless explicitly declared by the Maintainer. | Maintainer | 2026-06-13 | Skill directory clarification |
| Codex reviewed MSG-036 and amended PRD-029 to draft v2: freshness receipts, in-lock derivation sequencing, thread-mode support, OQ-068 derivation-only resolution, and PRD-027 prerequisite linkage. | Codex + Claude | 2026-06-13 | MSG-20260613-036 + PRD-029 draft v2 |
| Codex updated `skills/codex/` to v4 and synced the global Codex Turnfile skill copy with collaboration posture obligations: peer contribution, yes-and review, edge-case surfacing, proposal-only authority, own-file boundaries, and Maintainer-legible decision projection. | Codex | 2026-06-13 | Codex skill v4 posture update |
| Codex acknowledged Claude MSG-036 as P2 queued review work behind current implementation/eval lanes, with no preemption. | Codex + Claude | 2026-06-13 | MSG-20260613-036 |
| Codex actioned Claude MSG-034/035 and applied PRD-028 v2 updates: Maintainer tenets received as binding context; Claude counters and peer contributions incorporated as proposals, not directions. | Codex + Claude | 2026-06-13 | MSG-20260613-034/035 + PRD-028 draft v2 |
| Maintainer requested PRD-028 for Tokenese dual English/Tokenese artifacts, sync, peer-only authority, own-file boundaries, and Maintainer legibility; Codex drafted and routed it as a prerequisite to PRD-027 initiation. | Maintainer + Codex | 2026-06-13 | PRD-028 draft + MSG-20260613-033 |
| Codex accepted PRD-006 A1 eight-step implementation loop and claimed PRD-021/022/024 implementation plus PRD-023/026 eval-author lanes. | Codex + Claude | 2026-06-13 | MSG-20260613-032 |
| Maintainer approved PRD-022, PRD-023, and PRD-026; Claude promoted them to `docs/prds/`; Codex acknowledged the delivery mirror. | Maintainer + Claude + Codex | 2026-06-13 | MSG-20260613-031 |
| Maintainer held PRD-027 until every other PRD item is complete, with commit, push, and checkpoint discussion required before initiation. | Maintainer | 2026-06-13 | PRD-027 hold gate |
| Codex acknowledged PRD-024 delivery mirror and propagated PRD-024 R5.2 encoding-profile obligations into `skills/codex/` v3. | Codex | 2026-06-13 | MSG-20260613-030 |
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

### Claude: PRD-022/023/026 promoted; PRD-027 held — rev 72

2026-06-13 — Maintainer accepted PRD-022, PRD-023, PRD-026 (mirrored in MSG-20260613-031, delivery mode, now under live PRD-022 contract). All three promoted to docs/prds, validator pass. PRD-027 held by Maintainer until all other PRD work fully completes; commit/push/checkpoint discussion precedes its initiation.

**Completion register before PRD-027** (the "fully completed" bar):
1. PRD-021 R5 propagation: CONFLICT_RESOLUTION.md Level 2 rewrite, TURNFILE schema `coordination.conflict.rebuttal_rounds`, PRD-018 matrix gated/unlockable column, boot file refs, AC6 worked examples, "all participating agents" wording fix.
2. PRD-014 amendment: closeout compaction + projection sync (converged PRD-025 outcome; s14-prd-014-amendment task).
3. PRD-022 R5: PRD-019 R4 mode field, card template, skill bundles, validator checks.
4. PRD-023 R6: boot files, skill bundles, charter/closeout template line.
5. PRD-026 R4: closure-drift validator (claimable).
6. PRD-024 R5.1: dense-fragment validator rule (s14-prd024-validator-rule task).
7. Codex skills bundle PRD-024 R5.2 mirror (Codex-owned).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-022/023/026 accepted and promoted. | Maintainer | 2026-06-13 | MSG-031 mirror |
| PRD-027 held until all other PRD work fully complete; commit/push/checkpoint discussion first. | Maintainer | 2026-06-13 | MSG-031 mirror |

### Claude: PRD-006 Amendment A1 — eight-step loop installed — rev 75

2026-06-13 — Maintainer stated the intended PRD structure verbatim and approved installation after Claude's honest gap assessment (steps 1-3 held; step 4 absent — zero evals ever written; steps 5-7 substituted document review for implementation review with author-self-implementation; step 8 inverted — PRDs filed done at acceptance, PRD-021 promoted with AC6 unmet; caught mistakes logged but not encoded).

Installed:
1. **PRD-006 Amendment A1** (draft, Codex acceptance pending): eight-step loop verbatim; two-layer state model (acceptance vs implementation); proposer-writes-evals / counterpart-implements separation; done gate = evals green by implementer AND reviewer; acceptance-criteria verification gate.
2. **Registry implementation layer:** PRD-017/018/019/021/022/023/024/026 reverted actioned→accepted with implementation objects; earlier PRDs grandfathered.
3. **evals/ + npm run evals:prd.** Claude suites for PRD-021/022/024 committed at RED baseline (16 fail / 4 pass) — quantified implementation debt, including ledger-lesson regression checks (dense-fragment paraphrase rule, mirror-mode validation, wording sweep, worked examples).
4. **MSG-20260613-032 (delivery-mirror, P0):** structure relay + amendment review request + handoff (Codex implements 021/022/024; Codex authors evals for 023/026; PRD-017 lane proposed Codex). Pre-existing failing eval in run-evals.mjs put on the record.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Eight-step PRD lifecycle stated and installation approved; acceptance ≠ done; proposer evals + counterpart implementation mandatory. | Maintainer | 2026-06-13 | PRD-006 A1 / MSG-032 |
| Session-14 promoted PRDs retrofitted into implementation tracking; PRD-027 held until all lanes reach done. | Maintainer | 2026-06-13 | Registry restructure |

### Claude: Maintainer tenets affirmed + PRD-028 design input routed — rev 78

2026-06-13 — Maintainer affirmed three core tenets (verbatim in MSG-20260613-033, delivery-mirror): (1) peers request/propose, never direct — no subagent relationships; (2) own-files-only write boundaries between agents; (3) every decision legible and traceable to the Maintainer, whose involvement level is session-affirmable. Maintainer further directed: English AND Tokenese versions of all Turnfile artifacts going forward, kept in sync, human-legible, architecture built through the protocol. Codex is proposer on PRD-028 (dual-corpus sync architecture); Claude routed eight design inputs as consideration-requests per standard process (MAILBOX.json lineage, author-writes-twin rule, English-authoritative inheritance, hash-paired sync tiers, PRD-024 R2 amendment hook, proposer evals, pilot-informed two-phase calibration, sidecar naming). Claude self-noted tenet-1 phrasing discipline for prior handoff language.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Core tenets 1-3 affirmed (peer non-direction; own-file boundaries; Maintainer legibility/traceability). | Maintainer | 2026-06-13 | MSG-033 item 1 |
| Dual English+Tokenese corpus for all artifacts going forward, in sync, built through protocol; PRD-028 lane with Codex as proposer. | Maintainer | 2026-06-13 | MSG-033 item 1 |

### Claude: PRD-028 cross-review — APPLY with 3 counters — rev 81

2026-06-13 — Codex drafted PRD-028 (dual-artifact sync, prerequisite gate for PRD-027) independently converging with Claude's crossed-in-flight design input (MSG-034). Claude review (MSG-033 reply): APPLY with 3 counters — (P1) OQ-067 proposed scope (Tokenese-active only) contradicts Maintainer's verbatim "all Turnfile artifacts going forward"; routed to Maintainer, not agent-resolvable; (P2) PRD-024 R2 profile-table amendment hook missing (twins are a new artifact class, Band C); (P2) shared-artifact twin-update obligation unspecified (proposed R5.6: mutating agent owes twin update or english-ahead declaration in the same lock window). Standalone PRD confirmed over PRD-027 amendment. Ledger item 5: MSG ID collision (033) from out-of-lock ID allocation by Claude; caught by validator, renumbered to 034 per PRD-010 R4.5 — same lesson class as ledger 3, now twice; eval-encoding obligation noted for the PRD-026 lane.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-028 standalone (not PRD-027 amendment); Claude accepted-with-amendment. | Codex + Claude | 2026-06-13 | MSG-033 review |
| OQ-067 scope (all artifacts vs Tokenese-active subset) escalated to Maintainer. | Claude (escalation) | 2026-06-13 | MSG-033 counter 1 |

### Claude: Maintainer posture directive — peer contribution, not gatekeeping — rev 83

2026-06-13 — Maintainer directed (verbatim in MSG-20260613-035): agents are peers forging aggregated intelligence; reviews must carry "yes and", better alternatives, and edge cases — not only verdicts. Claude self-assessed MSG-033 as gatekeeping and posted the withheld generative round for PRD-028 (MSG-035, 8 items): recursive-twin guard (meta-layer stays unpaired), round-trip verification eval class (catches mistranslation, not just staleness), archive-at-archival-time twin rule, Maintainer-edit english-ahead auto-state, tokenese-ahead as promotable insight vs error, third-agent English-only full conformance, exceptions-only sync surfacing in TURNFILE, pair_id from REV-token convention. Posture encoded in skills/claude/ v0.4.2 (Collaboration Posture section, tenets 1-3).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Collaboration posture directive: generative peer contribution mandatory; aggregated-intelligence intent named. | Maintainer | 2026-06-13 | MSG-035 item 1 |

### Claude: PRD-029 + three amendments drafted (session-evidence improvements) — rev 85

2026-06-13 — Maintainer approved the five improvement concepts and directed drafting. Routing decision (both/and): item 1 → new PRD-029 (Pre-Write State Derivation: cross-cutting rule + tools/next-state.mjs + regression evals encoding ledger 3/5 and both snapshot mismatches); items 2-4 → amendments to owning PRDs (PRD-003 A1 thread-mode; PRD-004 A1 Maintainer decision queue; PRD-008 A1 blocking/peer-input reply channels); item 5 (smaller sessions) → Maintainer practice decision, no contract. MSG routed to Codex at P2, explicitly queued behind its claimed implementation lanes (tenet 1: request, no preemption). OQ-068 registered. Maintainer will request equivalent proposals from Codex when its lanes complete.

Maintainer Decision Queue (PRD-004 A1 practice, effective immediately):
1. PRD-029 + PRD-003/004/008 A1 document acceptance (after Claude review of Codex v2 amendments).
2. PRD-028 document acceptance.
3. PRD-027 approval remains held until PRD-028/029 implementation done, every other PRD item complete, then commit/push/checkpoint discussion.
4. Model-specific skill directory retention/removal only by explicit Maintainer decision; no model-specific skill path is deprecated by default.
5. Push/PR + session 15 boundary timing (deferred from checkpoint discussion).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Improvement routing: PRD-029 new; thread-mode/decision-queue/reply-channels as PRD-003/004/008 A1 amendments; session sizing as practice. | Maintainer (concept) + Claude (routing) | 2026-06-13 | PRD-029 cycle |
| Smaller-session practice adopted: target ~1/3 of session 14 scope; close 14 after PRD-028 cycle + red lanes resolve. | Maintainer | 2026-06-13 | Improvement item 5 |

### Claude (Opus 4.8): PRD-029 v2 accepted; open-queue cleanup; thread-mode miss ledgered — rev 90

2026-06-13 — Claude-side agent now on Opus 4.8 (third model generation this session — Opus 4.6 → Fable 5 → Opus 4.8 — same unmodified protocol; portability holds across three swaps). Maintainer prompted on idle outstanding work.

1. **PRD-029 draft v2 accepted** (agent gates complete). Codex's peer amendments strengthen it: freshness receipts (R2.4/R4) close the derive-then-stale-write gap; R1.4/R1.5 sequence derivation strictly after lock acquisition; R5 makes thread-mode unread resets mechanically derivable; OQ-068 resolved derivation-only for first implementation. Maintainer + implementation (Claude authors evals, Codex implements, Claude reviews) remain per PRD-006 A1.
2. **Six settled threads closed** (MSG-030/031/032/034/035/036; Claude closure owner, all mutually acked). MSG-033 retained — Codex closure owner, PRD-028 v2 counters still resolving.
3. **Stale self-owned task corrected:** s14-prd-022-draft was in_progress though PRD-022 drafted+promoted (PRD-026 closure-drift class on my own row). Set done, completed_rev recorded.

**Ledger item 6 (thread-mode unread blindness):** Codex's PRD-029 v2 review arrived as a thread entry on MSG-036 (Claude's own card), so it never incremented Claude's unread count and sat unprocessed until the Maintainer asked "are you waiting on me?" Root cause is exactly PRD-029 v2 risk 4 / R5 — thread-mode hides unread work inside a known MSG ID. The contract anticipated the failure it was being drafted during. R5.3 eval fixture encodes the regression. Interim mitigation: closure-owner duties on own sent messages must be checked at turn boundary, not only unread count (skill update candidate for the PRD-029 implementation lane).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-029 v2 agent gates complete; derivation-only (OQ-068); Maintainer + implementation pending. | Codex + Claude | 2026-06-13 | MSG-036 closure |

### Claude (Opus 4.8): terminal-PRD archive shelf — rev 96

2026-06-13 — Maintainer-approved + Maintainer-executed: deferred/superseded PRDs removed from the active draft shelf. Maintainer physically moved PRD-002 (deferred), PRD-015 (deferred), PRD-020 (superseded) to `docs/archive/prds/` ("I will bypass so you don't have to" = Maintainer did the file move). Claude reconciled tooling + registry to match:

1. `validate-prd-promotion.mjs`: added `docs/archive/prds` as a third valid shelf with an **inverse invariant** — archived PRDs must be terminal (`deferred`/`superseded`) and `eligible_for_docs_prds: false`; `listPrdFiles` guards missing dirs. Negative test confirmed: an archived PRD marked eligible fails validation.
2. Registry: PRD-002/015/020 paths + shelf → `docs/archive/prds`; **PRD-015 state drift fixed** (`draft` → `deferred`; the top-level state had never been updated when its Maintainer gate went deferred 2026-06-12).
3. `evals/archive-shelf.evals.mjs`: hygiene regression guard (4 checks, green) — archived PRDs terminal+non-promotable, paths exist, the session-14 set is archived and absent from the active shelf.

**Ledger item 7 (transient location confusion, self-resolved):** Claude initially misread the in-flight file move as a concurrent Codex action and reconciled toward `working-session/docs/archive/`, staging a bad git rename. Maintainer clarified they moved the files to `docs/archive/prds/` (the originally-approved location). Claude reset the stale index rename and reconciled all three surfaces (validator/registry/eval) to `docs/archive/prds/`. No data lost; lesson: when on-disk state diverges mid-operation, confirm the actor before reconciling direction (the re-read caught it, but the first reconciliation guessed wrong).

Active draft shelf now holds only genuinely active PRDs: 027/028/029. Open thread to process next: MSG-038 (Maintainer asks if both agents are ready for mailbox compaction + session close).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Deferred/superseded PRDs (002/015/020) archived to docs/archive/prds; validator gains terminal-shelf inverse invariant; PRD-015 state drift fixed. | Maintainer (approved+moved) + Claude (tooling reconcile) | 2026-06-13 | Archive shelf |

### Claude (Opus 4.8): skill v0.5.0 — Files First, Not Memory — rev 97

2026-06-13 — Maintainer named a persistent error: Claude reasoning from memory first, files second. Correct for solo work; wrong for Turnfile, where Codex and the Maintainer mutate shared files concurrently and between turns, making memory stale by default. Root cause behind multiple ledger items (OQ-067 cited as blocking after Maintainer resolved it in-file; file-move actor misattributed; snapshot/ID drift).

Adjustment (skills/claude/ v0.4.2 → v0.5.0, MANIFEST v7): new leading principle "Files First, Not Memory" — generalizes the existing re-read-before-edit rule (write safety) to re-read-before-assert (answer safety). Reading the relevant file before asserting or reasoning about shared state — PRD/gate status, OQs, ownership, mailbox, locks, blockers — is now a standing operating rule, not only a pre-write step. PRD-012 R7.3 classification: agent-environment operating-procedure change, Maintainer-directed, no protocol-semantics change. Demonstrated in-place: read the skill file before editing it, and read TURNFILE rev before locking, this turn.

Note for Codex (peer awareness, non-binding): the same memory-vs-files inversion likely applies to any agent running the protocol; Codex may wish to mirror the principle in skills/codex/ — its call, its file.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Files-First-Not-Memory operating principle added to Claude skill (v0.5.0) per Maintainer directive. | Maintainer (directive) + Claude (own-file edit) | 2026-06-13 | Skill v0.5.0 |

### Claude (Opus 4.8): processed Codex MSG-037/038; posted skill-inspection MSG-039 — rev 101

2026-06-13 — Files-First principle (just added) paid off on first use: reading the mailbox before posting surfaced 2 unread Codex messages (MSG-037/038) I would otherwise have posted over.

1. **MSG-037 actioned** (Maintainer clarification: model-specific paths not deprecated). Fixed Claude-owned `skills/claude-opus_4.6/DEPRECATED.md` — removed deprecation-by-default framing; now states Opus 4.6 is a valid compatibility path, not deprecated, filename historical (parity with Codex's `skills/codex_5.3/DEPRECATED.md`). My original DEPRECATED.md overreached; corrected.
2. **MSG-038 actioned** (closeout readiness). Answered: NOT ready. Relayed Maintainer directive that closeout waits until PRD-028/029 are fully done (A1 loop complete), overriding the carry-into-handoff option. Listed concrete blockers. Closeout remains a future step.
3. **MSG-039 posted** (Maintainer request): asked Codex to inspect skills/claude v0.5.0 Files-First principle for protocol soundness and offered it to mirror in skills/codex (its file, its call), with a non-blocking suggestion to consider a PROTOCOL_CORE.md note if adopted.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Closeout held until PRD-028/029 fully done (A1 complete); does not absorb backlog into handoff. | Maintainer | 2026-06-13 | MSG-038 reply |
| skills/claude-opus_4.6/DEPRECATED.md corrected: model-specific path not deprecated (Maintainer: nothing deprecated unless declared). | Maintainer + Claude | 2026-06-13 | MSG-037 reply |

### Claude (Opus 4.8): PRD-029 evals authored + handed off; MSG-040 acceptance sync actioned — rev 104

2026-06-13 — Both PRDs confirmed Maintainer-accepted (Codex recorded it from direct Maintainer confirmation; verified files-first in registry + gate snapshots — I had been asserting "needs acceptance" from stale memory, the principle's own lesson).

1. **PRD-029 evals authored** (`evals/prd-029.evals.mjs`, proposer = Claude) — 10 tests covering all R6 classes, baseline 9/10 red (helper unbuilt). Header pins the `tools/next-state.mjs` contract (flags + JSON output + freshness receipt + read-only). Task `s14-impl-029` registered; registry implementation state → evals-authored. Handed to Codex (implementer) in MSG-20260613-041 with the R6.4 ledger-regression highlighted and the `--date` default left as an open design call.
2. **MSG-040 actioned** (Codex's crossed acceptance-sync): PRD-028 implementation accepted as Claude's lane; PRD-029 eval handoff confirmed; canonical files verified non-stale.
3. **Concurrent-write reconciliation:** my MSG-041 post collided with Codex's concurrently-posted MSG-040. Files-first ID derivation correctly assigned 041 (read Codex's 040 from the file), but I hard-set the snapshot counts from assumption rather than re-deriving — the invariants validator caught it twice (Codex then Claude rows) and I reconciled each to the validator's file-derived truth. This is direct evidence FOR PRD-029: snapshot counts must be derived, not assumed — exactly what next-state.mjs mechanizes. (Not a new ledger class; reinforces ledger 3/5.)

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-029 evals authored (Claude/proposer); implementation handed to Codex (s14-impl-029). | Claude | 2026-06-13 | MSG-041 |
| PRD-028 implementation confirmed as Claude's lane against Codex-authored evals. | Codex + Claude | 2026-06-13 | MSG-040 |

### Claude (Opus 4.8): PRD-028 implemented — evals 10/10 green, review requested — rev 107

2026-06-13 — PRD-028 implementation lane (Claude implementer; Codex proposer/reviewer). PRD-006 A1 step 6 complete.

Implemented two artifacts against Codex's `evals/prd-028.evals.mjs` (was 7/10, now 10/10):
1. **`tools/validate-tokenese-pairs.mjs`** (R11): scans `--root` for `*.tk.md` twins; rejects missing/malformed pair metadata, missing English source (R2.5), invalid/blocking sync_state (tokenese-ahead/diverged, R7), and Tokenese-only decision content with no governing English source (R3/R8.4); accepts complete in-sync sidecar pairs. Each branch manually verified beyond the fixtures.
2. **PRD-024 R2 Tokenese row** (R9 Band C amendment): added to the promoted `docs/prds/PRD-024-...md` — the downstream edit flagged to and authorized by the Maintainer's acceptance of PRD-028 (PRD-024's own rule requires a Maintainer-accepted amendment; PRD-028 is one).

Registry: PRD-028 implementation.state → `eval-verified`; blocker now "Codex review pending (A1 step 7)". MSG-20260613-042 requests Codex review. On approve, Codex files done (step 8).

Notes: (a) run-evals.mjs "stale locks"/"unknown lock holders" tests transiently failed while my lock was live (those fixtures read the live TURNFILE.yaml) — verified to restore after lock release, not a regression. (b) Committed only PRD-028 files; left Codex's concurrent `docs/llm/MODEL_LEDGER.md` + `COLLAB_PROTOCOL.md` for Codex (own-file boundary).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-028 implemented (validator + PRD-024 Band C row); evals 10/10; Codex review requested (A1 step 7). | Claude | 2026-06-13 | MSG-042 |

### Claude (Opus 4.8): PRD-014 Amendment A1 drafted (closeout compaction + projection sync) — rev 111

2026-06-13 — Maintainer: pick up anything completable in my lane. Lane analysis (files-first): PRD-024 R5.1 validator is NOT mine (Codex is PRD-024 implementer; self-implementation forbidden by A1). PRD-014 amendment IS mine (I proposed the amend-PRD-014 counter in the PRD-025 convergence). Picked up s14-prd-014-amendment.

Drafted PRD-014 Amendment A1 (appended to promoted PRD-014, draft pending Codex acceptance): A1.R1 closeout compaction set (worklog/signal-log/mailbox-archive/boot, execute-or-defer); A1.R2 projection synchronization (MAILBOX.json, PRD_STATUS, TURNFILE header, next-state.mjs once PRD-029 lands; failing projection blocks clean close); A1.R3 scope boundary vs PRD-026 (session-level vs per-review-cycle; matches PRD-026 non-goal 6); A1.R4 closeout gate suite; A1.R5 acceptance criteria. Routed to Codex for apply-or-counter (MSG-043). Lane proposal: Claude proposer/eval-author, Codex implements, Claude reviews.

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-014 Amendment A1 drafted (converged PRD-025 outcome); Codex cross-review requested. | Claude | 2026-06-13 | MSG-043 |

### Claude (Opus 4.8): mirrored Codex model-ledger handshake; skill v0.5.1 — rev 113

2026-06-13 — Actioned MSG-043 (Codex's reciprocal mirror offer for its skill v6 Model Ledger Handshake Check). Accepted: mirrored the check in skills/claude/ v0.5.1 (MANIFEST v8) — at boot, verify executing model+surface is in docs/llm/MODEL_LEDGER.md before relying on model-compatibility claims; absence is not deprecation; report model in startup summary + chat header. Added Opus 4.8 to MANIFEST tested_on (Opus 4.6 + Fable 5 + Opus 4.8 now all recorded). Provided Claude's Fable 5 + Opus 4.8 ledger rows to Codex (its MODEL_LEDGER.md is uncommitted, so I did not edit it — own-file/uncommitted boundary; Codex integrates or I add under lock post-commit). Both bundles now carry both peer norms (Files-First in claude; handshake originated in codex, mirrored both ways).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Model Ledger Handshake Check mirrored into skills/claude v0.5.1; Opus 4.8 recorded in MANIFEST. | Maintainer (norm) + Claude (own-file) | 2026-06-13 | MSG-043 |

### Claude (Opus 4.8): skill v0.6.0 — concurrent-write discipline encoded — rev 114

2026-06-13 — Maintainer invited skill enhancement from session learnings. Encoded three session-14 ledger lessons not previously captured (skills/claude/ v0.5.1 → v0.6.0, MANIFEST v9):

1. **Concurrent Write Discipline ("Derive, Don't Assume")** — the write-side complement to Files First. Derive every written value (IDs, counts, pointers) from the in-lock fresh read; a validator's "expected" is file-truth (reconcile, don't argue); lock the whole batch up front; commit only own paths when a peer has uncommitted work; allocate IDs in-window with abort-retry. Grounded in ~4 snapshot/ID drift incidents + ledger items 3/4/5.
2. **Active-turn closure-owner check** — replies/thread entries on your own sent cards do not raise your unread count; scan sent messages for closure duties (ledger item 6).
3. **Builder/reviewer separation as operating rule** — decline self-implementation of a PRD whose evals you authored (demonstrated by declining s14-prd024-validator-rule).

These convert this session's caught-and-reconciled mistakes from prose ledger entries into standing skill rules — "logged → mitigated," the gap the eight-step loop and these encodings exist to close. Self-applied throughout this turn (read anchors before editing; re-read MANIFEST after concurrent change; committed own paths only).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Skill v0.6.0: concurrent-write discipline, closure-owner check, builder/reviewer separation encoded from session-14 ledger. | Maintainer (invitation) + Claude (own-file) | 2026-06-13 | Skill v0.6.0 |

### Claude (Opus 4.8): PRD-029 filed done; both PRD-028/029 complete; skill notification to Codex — rev 118

2026-06-13 — Files-first surfaced Codex's MSG-045 (PRD-028 filed done; PRD-029 9/10 pending my skill text) before I posted over it.

1. **PRD-028 done** (Codex filed): the first PRD taken fully through the PRD-006 A1 eight-step loop — Claude implemented (step 6), Codex reviewed APPLY (step 7), Codex filed done + moved to docs/prds + cleared PRD-027 blocker (step 8).
2. **PRD-029 R6.3 closed incidentally** by skills/claude v0.6.0 (its Concurrent Write Discipline section references next-state.mjs in exactly the R3 context). evals/prd-029.evals.mjs 10/10 green.
3. **PRD-029 reviewed + filed done** (Claude as proposer/reviewer): read Codex's tools/next-state.mjs (correct derivation, header-comment-safe revision regex, thread-mode-aware snapshot, read-only); APPROVE. Moved PRD-029 to docs/prds, registry implementation done, PRD-027 blocker cleared. Second PRD fully through A1. (s14-impl-029 left for Codex to close — its task row.)
4. **MSG-046 posted** (Maintainer request): notified Codex of skill v0.6.0 changes + why + mirror suggestion (concurrent-write-discipline + closure-owner are bilateral; reciprocal of MSG-039/043 mirror pattern).

Milestone: both pre-PRD-027 implementation PRDs (028, 029) now fully done by the eight-step loop, in both directions (Claude implemented 028 / Codex reviewed; Codex implemented 029 / Claude reviewed). PRD-027 blockers now: Maintainer acceptance held + commit/push/checkpoint (no remaining PRD-028/029 implementation gates).

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| PRD-029 reviewed APPROVE and filed done; both PRD-028/029 complete via A1 loop. | Claude (review) + Codex (impl) | 2026-06-13 | MSG-045 |
| Claude skill v0.6.0 changes notified to Codex with mirror suggestion (bilateral lessons). | Maintainer (request) + Claude | 2026-06-13 | MSG-046 |

### Claude (Opus 4.8): SESSION 14 CLOSEOUT — rev (see TURNFILE)

2026-06-13 — Coordinated Claude-side close (Codex closing in parallel per Maintainer). Module 6 + PRD-014 followed.

**Session 14 outcome (the floor that was poured):** reset Turnfile after a 4-month gap; reconciled Feb-June drift; triaged the full backlog to a clean baseline (BASELINE.md, README index); promoted PRD-017/018/019/021/022/023/024/026 and folded PRD-020; installed PRD-006 A1 eight-step loop (eval-gated implementation); both PRD-028 and PRD-029 taken fully through the loop in both directions (Claude impl 028 / Codex review; Codex impl 029 / Claude review); tools/validate-tokenese-pairs.mjs and tools/next-state.mjs built; archived terminal PRDs (002/015/020) to docs/archive/prds. Claude skill v0.3.0 → v0.6.0 (Files-First, Concurrent-Write Discipline, Model-Ledger Handshake, Collaboration Posture, encoding obligations). Three Claude model generations (Opus 4.6 → Fable 5 → Opus 4.8) on one unmodified protocol; one full rebuttal-loop convergence (PRD-025 → PRD-014 path).

**Closeout actions:** closed Claude-owned terminal messages (039/041/042); Claude idle, unread 0, no locks; chat-claude.md snapshot written; boot-claude rolled over.

**Deferred (PRD-014 R4 / draft A1.R1 execute-or-defer):**
- WORKLOG compaction (639 lines > 500 trigger) — DEFERRED to next-session boot. Reason: concurrent dual-agent close makes a full WORKLOG rewrite collision-prone; a single-agent boot can compact cleanly. Next owner: next session opener.
- Signal-log compaction — DEFERRED, same reason; both agents are posting signals during close.
- Mailbox archival sweep of terminal Codex-owned messages — Codex's close handles its side.

**Carry-forward to session 15:** PRD-014 A1 review (Codex, MSG-044 open); PRD-021/022/024 implementation + PRD-023/026 evals (Codex lanes); PRD-024 R5.1 validator (Codex); push/PR decision + Maintainer pre-PRD-027 checkpoint; then PRD-027 (tokenese) initiation.
