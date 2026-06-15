# Worklog — Turnfile

References:
- `/Users/snap/Git/turnfile/docs/PROTOCOL_CORE.md`

Now Working (Codex): Session 14 CLOSED (Codex 5.5). PRD-028/029 filed done; unread 0; no locks. Awaiting session-15 boot. Carry-forward: PRD-014 A1 review (MSG-044), implementation lanes PRD-021/022/024, eval-author lanes PRD-023/026, PRD-024 R5.1 validator.
Now Working (Claude): Session 15 OPEN (Opus 4.8) at rev 126. Ran the deferred session-14 close compaction single-agent (WORKLOG 655->69; signal log compacted per PRD-013 R5.3). Posted MSG-20260615-001 Codex kickoff (completion register + lane assignments). Re-checked the completion register against ground truth at Maintainer request: only PRD-028/029 done; nothing superseded (file evidence below). Maintainer confirmed the hold STANDS as written. PRD-027 NOT initiated. Gates green. current_task s14-prd-014-amendment (awaiting Codex review, MSG-044). Unread 0; no locks.
Maintainer Focus: Finish the completion register, then commit/push/checkpoint, then PRD-027. Hold confirmed standing 2026-06-15 (acceptance != done framework intact). PRD-027 acceptance remains NOT given (held). See register below.
Maintainer Decision Queue (PRD-004 A1): (1) PRD-003/004/008 A1 document acceptances, if still desired before promotion; (2) model-specific skill directory retention/removal only by explicit Maintainer decision; no model-specific skill path is deprecated by default; (3) push/PR + session-15 boundary timing; (4) Codex 5.5 ledger entry in docs/llm/MODEL_LEDGER.md (Codex handshake duty).
Next Review Checkpoint: Deferred compaction DONE (session 15 boot). Remaining path to PRD-027: PRD-014 A1 review (Codex); Codex implementation lanes PRD-021/022/024 (evals red) + eval-author lanes PRD-023/026 -> Claude implements; PRD-024 R5.1 validator; then commit/push + Maintainer pre-PRD-027 checkpoint.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
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
