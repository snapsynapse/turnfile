# Worklog — Turnfile

References:
- `/Users/snap/Git/turnfile/docs/PROTOCOL_CORE.md`

Now Working (Codex): Session 16 PRD-031 Phase-1 implementation turn complete at rev 170. Codex validated Tokenese v0.3 first and ran W2/W5 pairs, then implemented Claude's PRD-031 Phase-1 handoff in `tools/aggregate-coordination.mjs`. Red baseline: `node --test evals/prd-031-phase1.evals.mjs` failed 12/14 because the tool did not exist. Green after implementation: 14/14 pass. MSG-20260617-007 is actioned; MSG-20260617-008 routes A1 step 7 review to Claude. Codex unread 0; Claude unread 1; Maintainer unread 0.
Now Working (Claude): Session 16 ACTIVE (Opus 4.8) at rev 171. PRD-031 Phase-1 COMPLETE via A1 loop: Claude authored evals (rev 168, RED 12/14) -> Codex implemented `tools/aggregate-coordination.mjs` (rev 170, 14/14 green) -> Claude reviewed APPROVE at rev 171 (no counters; independently re-ran evals 14/14). `s16-prd-031-phase1` done; MSG-007/008 closed. Maintainer confirmed Tokenese v0.3 valid + scoped as recommended; relayed to Codex in MSG-20260617-009 (delivery-mirror) with arm-field-fix (W2/W5 pairs mislabeled arm:W1) + per-data-point version-tagging asks. Created `working-session/docs/tk-ab-run-results.md` folding W1/L1 (v0.2) + W2/W5 (v0.3), version-tagged, with 2 hygiene flags + R6.4 scope boundary. Claude active, unread 0, no locks. Codex unread 1 (MSG-009).
Maintainer Focus: tonight's session is clean to close. PRD-027 live mini-pilot W1+L1 is complete; PRD-030 and PRD-031 are accepted and promoted; heartbeat lifecycle closed. Remaining active work is implementation/review, not acceptance: PRD-031 Phase 1 now awaits Claude review; PRD-030 implementation lane; formal `tk-ab-run` results artifact plus W2/W3/W4 and L2/L3 expansion; standing Codex lanes PRD-014 A1, PRD-021/022/024, PRD-023/026/017 evals, and PRD-024 R5.1.
Maintainer Decision Queue (PRD-004 A1): (1) final confirm for any remote branch deletion still desired; (2) PRD-003/004/008 A1 document acceptances if still desired; (3) model-specific skill directory retention only by explicit decision; (4) later Maintainer decision on broader Tokenese adoption after `tk-ab-run` results and calibration evidence.
Next Review Checkpoint: next session boots from files, not memory. Claude reviews PRD-031 Phase-1 implementation from MSG-20260617-008. Separately, record W1 and L1 as the first formal `tk-ab-run` data points, then expand the remaining suite. PRD-030 implementation remains Codex eval-author -> Claude implementer -> Codex review.
Heartbeat (PRD-030 R5/R9): DELETED at close. App heartbeat `turnfile-session-heartbeat` was deleted by Codex on 2026-06-17 because its stop condition was satisfied and no carried-forward heartbeat is needed for the closed session.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Tokenese v0.3 run confirmed valid, scoped as recommended. Maintainer: "confirm valid to run Tokenese v0.3 as proposed by Codex in this session, scoped as recommended" / "yes". Basis (Claude, files-verified): v0.3 admitted in `~/Git/tokenese` (GRAMMAR-v0.3.md 0.3.0, additive/backward-compatible, R7 boundary intact), checker supports it (124/124; 63/63 focused), W2/W5 pairs source-authoritative, L3, zero misparse, measurement-only. Confirms RUNNING v0.3 in the pilot only; adoption as a Turnfile default / promotion beyond pilot still needs published results + a Maintainer decision (R6.4). Relayed to Codex in MSG-20260617-009 with arm-field-fix + version-tagging asks. | Maintainer + Claude | 2026-06-17 | Tokenese v0.3 run confirmed |
| PRD-031 Phase-1 COMPLETE via PRD-006 A1: Claude authored `evals/prd-031-phase1.evals.mjs` (proposer), Codex implemented `tools/aggregate-coordination.mjs`, Claude reviewed APPROVE (no counters; evals 14/14 green, independently re-run). Per-agent shard + namespaced-id + derivation contract lands; the two-agent mailbox/signal collision class is removed. Phase 2/3 remain future eval-first lanes. | Claude + Codex | 2026-06-17 | PRD-031 Phase-1 complete |
| Session closeout accepted Claude's delivery: W1+L1 Tokenese mini-pilot complete with two clean corroborated points; PRD-030 and PRD-031 promoted to `docs/prds`; PRD-031 implementation remains pending under A1 with Claude eval author, Codex implementer, Claude reviewer. | Claude + Codex + Maintainer | 2026-06-17 | Session 15/16 closeout |
| Codex deleted app heartbeat `turnfile-session-heartbeat` at session close under PRD-030 R5/R9. No heartbeat is carried forward. Future turns must boot from Turnfile files and create a fresh heartbeat only by Maintainer direction or handshake agreement. | Codex | 2026-06-17 | Heartbeat lifecycle close |
| Tokenese W1+L1 mini-pilot exit condition met: W1 deploy-status passed as `win-conformant` with Tokenese token savings; L1 deadlock-debug passed as `l1-plain-success` with correct dense refusal. Next Tokenese step is formal `tk-ab-run` results artifact and suite expansion. | Claude + Codex | 2026-06-17 | Tokenese mini-pilot complete |
| Codex found `working-session/docs/PRD-031-enforced-shared-file-mutual-exclusion-contract.md` present on disk without a `PRD_STATUS.json` entry while validating the heartbeat handoff. Codex added a draft/pending registry entry only; PRD-031 remains unreviewed and unaccepted by Codex. | Claude + Codex | 2026-06-16 | PRD-031 registry repair |
| Codex validated Claude's PRD-030 R9 handoff and initiated app heartbeat `turnfile-session-heartbeat` at 15-minute cadence. The heartbeat treats Turnfile project files as authoritative, model/platform memory as cache, and must refresh files plus derive state with `tools/next-state.mjs` before writes. | Maintainer + Codex | 2026-06-16 | PRD-030 heartbeat initiated |
| Maintainer amended accepted PRD-030 before implementation to add a Turnfile memory boundary: Turnfile project files are authoritative session memory; model/platform/thread memory is non-authoritative cache; heartbeat and active-turn work must refresh relevant files from disk before assertions or writes. | Maintainer + Codex | 2026-06-16 | PRD-030 memory-boundary amendment |
| Maintainer ratified the PRD-027 session charter (R2.4), confirmed PRD-027 approved/greenlit, and (via Codex APPLY on MSG-009) approved pruning stale branches (remote-ref deletes await a final Maintainer confirm). PRD-030 confirmed Maintainer-accepted (PRD_STATUS is source of truth; stale WORKLOG text reconciled). Claude confirmed Codex's framing in MSG-010 and proposed the PRD-030 implementation lane in MSG-011. | Maintainer + Claude + Codex | 2026-06-16 | Charter ratified + PRD-027 greenlit + PRD-030 acceptance reconciled |
| Codex reviewed Claude's PRD-014 A1 amendment and returned APPLY with no counters: PRD-026 boundary is clean, compaction set is sufficient, and the lane is Claude eval-author / Codex implement / Claude review under PRD-006 A1. | Codex + Claude | 2026-06-16 | MSG-20260613-044 |
| Claude accepted all Codex amendments from MSG-20260616-007 in MSG-20260616-008. The A/B suite is agreed by both agents and `tk-ab-suite-design` is done. The session charter is signed by both agents and ready for Maintainer ratification before any live Tokenese clone traffic. PRD-030 counters C1-C5 are confirmed applied; PRD-030 later received Maintainer acceptance. | Claude + Codex | 2026-06-16 | Charter and A/B suite accepted |
| Codex completed the PRD-027 charter and A/B suite counter-review. Codex signed `working-session/SESSION_CHARTER.md`, accepted the narrowed dense-lane scope, confirmed W1+L1 mini-pilot and direction balance, added W1 evidential discipline, stable source IDs, a mini-pilot dense-reasoning failure criterion, and concrete L1-L3 inputs. Review posted to Claude in MSG-20260616-007; Maintainer ratification remains required before live Tokenese clone traffic. | Codex + Claude | 2026-06-16 | Charter and A/B suite counter-review complete |
| Claude reviewed PRD-030 APPLY with five counters in MSG-20260616-006. Codex applied C1-C5: PRD-014 A1 seam, mandatory WORKLOG entries for carried-forward heartbeats, no `automation_state` in Turnfile, heartbeat as interaction gearing not protocol cadence, and false-idle/prolonged-silence rule. PRD-030 agent acceptance gates accepted; Maintainer acceptance later recorded in PRD_STATUS. | Claude + Codex | 2026-06-16 | PRD-030 counters applied |
| Maintainer requested a new PRD for session heartbeat management after Codex deleted the obsolete `turnfile-mailbox-heartbeat` automation during closeout. Codex drafted PRD-030 as a standalone proposal covering heartbeat negotiation at session handshake, runtime files-first discipline, notification behavior, and closeout deletion/update/carry-forward. Draft routed to Claude for apply-or-counter in MSG-20260616-005. | Maintainer + Codex | 2026-06-16 | PRD-030 heartbeat management draft |
| Claude delivered the PRD-027 session charter and A/B suite in MSG-20260616-004. Codex acknowledged the request and explicitly deferred counter-review while drafting the Maintainer-requested PRD-030; Codex still owns the charter/suite counter-review next unless the Maintainer reprioritizes. | Claude + Codex | 2026-06-16 | Charter and A/B suite counter-review queued |
| Maintainer brought in Perplexity Computer to build a deterministic, scripted Tokenese->English checker/decoder in `~/Git/tokenese` (conformance checker, lexicon audit, token counter, projector, readback-differ, misparse-family classifier). Scope chosen: instrument + decoder only, NOT a generator — models still produce the Tokenese in the A/B, preserving the model-competence claim. It becomes the objective `tk-ab-run` scorer and the audit/projection surface (R4.5/INTENT-7). Ownership stays in the tokenese repo (PRD-027 R7); Perplexity is a tokenese tool-contributor, not yet a Turnfile participant (no PRD-015 onboarding/charter/ledger unless it later joins the A/B as a generating/consuming agent). PRD-027 unchanged. | Maintainer + Claude | 2026-06-16 | Perplexity deterministic checker/decoder scope |
| Claude graded Codex's Tokenese production attempt from MSG-20260616-001: 7/8 valid first-pass, all special requirements met, production-competence gate passed, and `tk-teach-tokenese` complete. E1's `ev:obs` on inferred cause ranking is recorded as the first calibration datapoint and repair: reserve `ev:obs` for harness-verifiable claims in context, elide evidential or use `ev:guess` for inferred rankings, and do not attach evidentials to queries. Next owner is Claude for narrowed session charter plus A/B suite draft, then Codex counter-review. | Claude + Codex | 2026-06-16 | Tokenese teach-phase grade |
| Codex completed the first Tokenese production attempt in response to Claude's teach packet: E1-E8 examples, three expected-to-lose dense-mode task nominations, and two charter counters. Claude remains teacher and will grade against the posted rubric before `tk-teach-tokenese` can close. | Codex + Claude | 2026-06-16 | Tokenese production attempt 1 |
| Maintainer directed Codex to learn Tokenese and ask Claude what is needed. Codex entered the `tk-teach-tokenese` lane as student, recorded corpus-read understanding, and requested Claude's teach-phase packet plus validation rubric in MSG-20260615-003. Live Tokenese clone traffic remains gated by charter ratification, teach completion, production-competence check, and legible activation note. | Maintainer + Codex | 2026-06-15 | Tokenese teach-phase start |
| Maintainer approved PRD-027 initiation after confirming readiness with Codex and Claude. This supersedes the earlier 2026-06-15 hold-confirmation state for PRD-027 only: the completion-register work remains real but continues as parallel carry-forward, not as a PRD-027 initiation blocker. PRD-027 promoted to docs/prds as the binding Tokenese A/B pilot contract; live Tokenese clone traffic remains gated by session-charter opt-in, Claude teach phase, Codex production-competence check, and a legible activation note. | Maintainer + Codex + Claude | 2026-06-15 | PRD-027 initiation approval |
| Session-15 re-check (Maintainer-requested): ground-truth verification confirmed only PRD-028/029 are implementation-`done`; PRD-021 (evals 0/9), PRD-022 (1/6), PRD-024 R5.1 (4/5), PRD-023/026/017 (no eval suites authored), PRD-014 A1 (drafted, unreviewed) are all genuinely open. No supersession marker exists for any of them (only PRD-020->PRD-017 R7 and old PRD-015). R5/R6 propagation artifacts physically absent from CONFLICT_RESOLUTION.md, schema, PRD-018 matrix, and validators. | Claude (verification) | 2026-06-15 | Session 15 register re-check |
| Maintainer confirmed the session-14 PRD-027 hold STANDS as written: PRD-027 stays gated on the completion register reaching implementation-`done` (acceptance != done framework intact), then commit/push/checkpoint, then PRD-027. PRD-027 not initiated; Maintainer acceptance not given. Work proceeds on the register (Codex implementation + eval-author lanes; Claude implements 023/026/017 after Codex evals; PRD-014 A1 after Codex review). | Maintainer | 2026-06-15 | PRD-027 hold confirmed |
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
| 13 | 2026-02-11 | Compacted to WORKLOG_ARCHIVE.md. Claude-only: PRD-001 review, mailbox processing, Gemini onboarding artifacts staged, thread closures; `working-session/` made git-tracked. Revisions ~29–30. |
| 14 | 2026-06-12/13 | Compacted to WORKLOG_ARCHIVE.md. The reset: 4-month drift reconciled, backlog triaged to a clean baseline (BASELINE.md + README index), PRD-006 A1 eight-step loop installed, PRD-017/018/019/021/022/023/024/026 promoted + PRD-020 folded, PRD-028/029 taken fully through the A1 loop in both directions, terminal PRDs (002/015/020) archived, Claude skill v0.3.0→v0.6.0. Three Claude model generations (Opus 4.6→Fable 5→Opus 4.8) and Codex 5.3→5.5 on one unmodified protocol. Revisions 31–124. |

## Session 15 — 2026-06-15/16 (Claude Opus 4.8 + Codex 5.5 + Maintainer)

### Claude: SESSION 15 CLOSEOUT — rev 141

2026-06-16 — Coordinated close. Module 6 + PRD-014 followed.

Session 15 outcome (the Tokenese pilot, initiated and staged):
- Ran the deferred session-14 compaction first (WORKLOG 655->69; signal log per PRD-013 R5.3).
- PRD-027 approved by Maintainer + initiated: acceptance recorded, promoted to docs/prds, Tokenese task list registered (tk-teach/ab-suite-design/ab-run/calibration-audit/spec-v02).
- First full Tokenese teach cycle through the protocol: Claude taught (packet), Codex produced E1-E8, Claude graded 7/8 -> production-competence gate PASSED; tk-teach-tokenese done. E1 ev:obs-on-inference logged as first calibration datapoint.
- Session charter (R2.4, narrowed dense-lane scope) + A/B suite drafted, Codex counter-reviewed and signed; suite agreed both agents (AC5) -> tk-ab-suite-design done; charter draft v2 awaiting Maintainer ratification.
- Perplexity Computer scoped as the deterministic checker/decoder (tokenese repo, R7) and A/B scorer — instrument, not generator, not a Turnfile participant. Delivered a translator package (next-session eval).
- PRD-030 (session heartbeat management) drafted by Codex, reviewed by Claude APPLY w/ 5 counters (C1-C5 applied) — awaiting Maintainer acceptance.
- 2-minute mailbox sync loop enabled (interaction gearing) and DELETED at close (PRD-030 AC6 worked example). Committed + pushed branch session-15-compaction (273dbb1).
- Three+ model generations on one unmodified protocol continues (Claude Opus 4.8 / Codex 5.5).

Closeout actions: closed 7 fulfilled Claude-owned threads (open queue 18->11); heartbeat loop deleted; Claude idle, unread 0, no locks; chat-claude.md snapshot; boot rolled v8->v9.

Carry-forward to session 16 (next-session plan, Maintainer-agreed):
1. Claude boot -> confirm Maintainer approvals: (a) charter ratification (R2.4), (b) PRD-030 acceptance.
2. Deep-inspect + apply Perplexity's deterministic checker/decoder against the pre-eval checklist (below).
3. Then tk-ab-run mini-pilot (W1 + L1) once charter ratified; scored by Perplexity's checker.
4. Codex lanes updated: PRD-014 A1 awaits Claude closure/eval handoff after Codex APPLY; PRD-021/022/024 impl (evals red); PRD-023/026/017 eval-authoring -> Claude implements; PRD-024 R5.1 validator.

Perplexity pre-eval checklist (verify against the delivered tokenese-translator before trusting its scores):
1. BLOCKER if missing — grammar target covers spec v0.1 PLUS DESIGN section 7 sigils (@noun, ??slot, because, square-hole / dagger / check / brace-quote / not() / ev: / dense-plain); pin the spec+DESIGN commit it locks to.
2. Coverage of the 6 brief deliverables: conformance checker L1/L2/L3; lexicon audit vs anthropic_costs.json; token counter BOTH tokenizers (o200k + Anthropic); Tokenese->English decoder/projector; readback-differ (transformed-vs-verbatim); misparse-family classifier (binding/scope/sense/triangulation).
3. Determinism: no model calls in decode/score path; no English->Tokenese generation (instrument only).
4. Machine output schema (JSON per pair: conformance level, token counts both tokenizers, readback-diff, misparse-family); how Anthropic-side tokens are counted (cached vs live API + credentials).
5. Unparseable input -> explicit marker, never a hallucinated English guess.
6. A small golden corpus (labeled conformant + failing transcripts with expected verdicts) to validate the oracle; its 16 tests may suffice.

### Decision Index — Session 15 closeout

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Session 15 closed with PRD-027 Tokenese pilot fully staged: teach done, suite agreed, charter signed by both agents (awaiting Maintainer ratification), PRD-030 reviewed (awaiting Maintainer acceptance), Perplexity checker scoped + delivered (next-session eval). Heartbeat loop deleted at clean close (PRD-030 AC6). | Maintainer + Claude + Codex | 2026-06-16 | Session 15 closeout |
| Post-close correction: Codex PRD-014 A1 review from MSG-044 is actioned APPLY, so session 16 should treat the review as complete and await Claude closure/eval handoff. | Codex | 2026-06-16 | MSG-20260613-044 |

## tk-ab-run — Mini-pilot results (PRD-027 R6.3) — 2026-06-17

First live Tokenese A/B data. Both pairs scored by Perplexity's deterministic `tkab` checker, independently by both agents (matching results). Domain: operational / code-review (R6.1).

| Pair | Dir | Artifact | Outcome | Conformance | anthropic ratio | o200k ratio | Misparse | Verdict |
|------|-----|----------|---------|-------------|-----------------|-------------|----------|---------|
| TKAB-W1 | Claude->Codex | deploy-status | win-conformant | L3 | 0.59 | 0.72 | 0/0/0/0 | win-case PASSED — Tokenese wins on tokens |
| TKAB-L1 | Codex->Claude | deadlock-debug | l1-plain-success | L3 | ~0.95 | 0.85 | 0/0/0/0 | negative-control PASSED — correct `plain` refusal (R1 dense inadmissible) |

Findings: both directions exercised; both agents scored identically; the win-case beats English on both tokenizers; the negative control correctly refuses dense reasoning (`dense_statement_count: 0`). W1 also validated the E1/W1 evidential discipline live (`ev:guess` on inferred ranking, `ev:obs` on observed timestamp). Mini-pilot exit condition met. Full suite (W2/W3/W4, L2/L3) + a formal results artifact deferred to next session. Pair fixtures used: `TKAB-W1.claude.codex.live1`, `TKAB-L1.codex.claude.live1`.

## tk-ab-run — v0.3 next iteration (PRD-027 R6.3) — 2026-06-17

Maintainer requested the next Tokenese test iteration and asked Codex to validate Tokenese v0.3 first. Validation passed using the Tokenese repo's local venv and deterministic checker:

| Check | Result |
|---|---|
| Tokenese grammar identity | `GRAMMAR-v0.3.md` version 0.3.0; translator package version 0.3.0 |
| Full translator/checker tests | 124/124 pass |
| Focused v0.3 + TKAB tests | 63/63 pass |
| Scorer schema | `tkab-check-1.1`, grammar support `v0.3` |

Codex then ran two v0.3 pairs. Because the current checker outcome classifier is still W1/L1-shaped, both were scored through the generic expected-to-win operational-status ladder while retaining their source IDs and artifact types.

| Pair | Dir | Artifact | Outcome | Conf | anthropic ratio | o200k ratio | Misparse | Verdict |
|---|---|---|---|---|---:|---:|---|---|
| TKAB-W2-v03 | Codex->Claude | multi-service-health | win-conformant | L3 | 1.42 | 1.63 | 0/0/0/0 | valid structure, token loss |
| TKAB-W5-v03 | Codex->Claude | session-status-handoff | win-conformant | L3 | 1.16 | 1.30 | 0/0/0/0 | valid structure, token loss |

Files: `working-session/tokenese-pairs/TKAB-W2-v03.codex.claude.live1.pair.json`, `working-session/tokenese-pairs/TKAB-W2-v03.codex.claude.live1.result.json`, `working-session/tokenese-pairs/TKAB-W5-v03.codex.claude.live1.pair.json`, `working-session/tokenese-pairs/TKAB-W5-v03.codex.claude.live1.result.json`.

Finding: v0.3 handled structured operational/session status cleanly, including source-authority preservation and `ev:` discipline, but the verbose clone style did not compress. Next test should either run W3/W4 with more compact constructs or adjust W2/W5 authoring style before counting them as positive compression evidence.

## PRD-031 Phase 1 implementation - 2026-06-17

Claude authored `evals/prd-031-phase1.evals.mjs` as PRD-006 A1 step 4 and routed MSG-20260617-007 to Codex for implementation. Codex first confirmed the RED baseline: `node --test evals/prd-031-phase1.evals.mjs` failed 12/14 because `tools/aggregate-coordination.mjs` did not exist.

Codex implemented `tools/aggregate-coordination.mjs` as a read-only deterministic derivation tool over per-agent shard directories. The tool supports `--emit json`, `--emit mailbox-md`, and `--emit mailbox-json`; reads `signals.jsonl`, `outbox.jsonl`, and `read-state.jsonl`; enforces namespaced signal/message IDs; reports namespace and duplicate conflicts; orders signals/messages causally by `deps`; derives unread snapshots; and reports per-agent namespace maxima.

Verification after implementation: `node --test evals/prd-031-phase1.evals.mjs` passed 14/14. Codex actioned MSG-20260617-007 and routed MSG-20260617-008 to Claude for A1 step 7 review.

### Decision Index — close (2026-06-17)

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| W1+L1 Tokenese mini-pilot complete: 2 clean independently-corroborated points (W1 win-conformant; L1 l1-plain-success). First live Tokenese A/B data; basis for tk-ab-run record. | Claude + Codex | 2026-06-17 | tk-ab-run mini-pilot |
| PRD-030 (session heartbeat management) and PRD-031 (concurrent multi-agent coordination) promoted to docs/prds at Maintainer direction; all three acceptance gates recorded, promotion validator passes (30 PRDs). PRD-031 carries an implementation-pending object (A1 Phase-1 lane: Claude authors evals -> Codex implements -> Claude reviews). | Maintainer + Claude + Codex | 2026-06-17 | PRD-030/031 promotion |
| PRD-031 Phase 1 implementation completed by Codex against Claude-authored evals; 14/14 green and routed to Claude for A1 step 7 review. | Codex | 2026-06-17 | PRD-031 Phase 1 implementation |
