# Chat Log — Claude

This is Claude's scratchpad for session commentary, reasoning, and context
that doesn't fit cleanly into mailbox messages or WORKLOG handoffs.
Readable by maintainer and other agents.

Session state snapshots go at the bottom of this file (PRD-011 R1).

---

## Session 12 — 2026-02-10

### Session start

Claude session 12 started on `feature/skills` branch. Codex bootstrapped `working-session/`
control plane from templates. Claude came online, updated TURNFILE.yaml (agents.claude → active,
session_id → claude-session-12, SIG-002 posted). WORKLOG status block updated.

State at start:
- Phase: phase-2, step: p2-e
- 4 tasks in Turnfile (all pending/unassigned or maintainer-owned)
- Mailbox: 0 unread for all agents
- No active locks or turn queue entries
- Coordination revision: 2

### Session 12 close snapshot

**State at close:**
- Phase: phase-2, step: p2-e
- Branch: `feature/skills` (forked from main after session 11)
- TURNFILE.yaml revision: 13 (after closeout signal)
- 4 tasks in Turnfile — all pending (p2e-prd-001-consolidation, p2e-prd-002-planning, prd-015/016-maintainer-acceptance)
- Mailbox: 0 unread for all agents. All Claude-owned messages closed.
- No active locks or turn queue entries
- WORKLOG: 243 lines (under 500 compaction threshold)

**Session 12 accomplishments:**
1. Installed skill-versioning metaskill at `skills/skill-versioning/` (v3, cross-platform)
2. Validated all 3 skills for conflicts and protocol fidelity — 0 conflicts, 2 minor gaps
3. Identified 6 session init friction points, agreed 7 mitigations (P-1 through P-7)
4. Executed P-1: boot-claude.md rewrite v4→v5→v6 (all `inception/` refs removed, cold-start bootstrap added, session close hardened)
5. Executed P-2: Module 0 (Session Bootstrap) added to Claude SKILL.md, version bumped to v0.3.0
6. Applied skill-versioning to Claude bundle (MANIFEST.yaml + CHANGELOG.md, bundle v3)
7. Reviewed Codex PRD-018/019/020 drafts — APPLY on all three scopes
8. Resolved OQ-052 (all changes Maintainer-gated by default) and OQ-053 (subsumed)
9. Cross-reviewed boot-codex.md v2→v3 — APPLY, no contradictions
10. Boot file alignment achieved: boot-claude.md v6 and boot-codex.md v3 at protocol parity

**Open items for next session:**
- 5 active OQs: OQ-051, OQ-054, OQ-055, OQ-056, OQ-057
- PRD-001 consolidation and PRD-002 planning tasks unassigned
- PRD-015/016 awaiting maintainer acceptance
- PRD-017/018/019/020 in draft
- Maintainer selective unlocks for decision authority matrix pending

**Decisions made:**
- `current_task` must reference registered Turnfile tasks only (Claude proposal, session 12)
- All changes Maintainer-gated by default; selective unlocks to follow (OQ-052, Maintainer decision)

---

## Session 13 Close Snapshot — Claude

**Session:** claude-session-13
**Date:** 2026-02-11
**Close reason:** Maintainer-directed session close
**Turnfile revision:** 30

### Active task status

| Task | Status |
|------|--------|
| p2e-prd-018-020-refinement | **done** (completed rev 30) |
| Gemini onboarding artifacts | All staged, cross-reviewed, counters resolved |

### Mailbox state

- Claude unread: 0
- Open queue: 0 messages
- All Claude-owned threads closed (MSG-010, MSG-013, MSG-017)

### Session accomplishments

1. **PRD-001 full review** (MSG-011): 3 amendments applied — field name alignment, routing-critical minimum, PRD-019 cross-reference.
2. **PRD-002 review** (MSG-014): 3 counters posted — unread count, parse fields, refresh independence. Codex applied all.
3. **Onboarding test suite review** (MSG-016): 1 counter posted — add OT-008 skills artifact conformance. Codex applied.
4. **Gemini onboarding artifacts staged** (MSG-017):
   - `GEMINI.md` (project root bootstrap)
   - `working-session/boot-gemini.md` (v1)
   - `skills/gemini-3/SKILL.md` (v0.1.0, 9 modules)
   - `skills/gemini-3/MANIFEST.yaml` + `CHANGELOG.md`
   - `working-session/docs/gemini-onboarding/vetting-plan.md` (OT-001 through OT-008 mapping)
   - `skills/STRUCTURE.md` updated
5. **MSG-017 counters resolved**: Module 5 lock tie-break + mailbox ID collision, Module 2 stale-message escalation. Both applied, Codex verified.
6. **Threads closed**: MSG-010, MSG-013, MSG-017.
7. **Session close**: .gitignore updated (working-session/ now tracked), WORKLOG compacted, boot archived.

### Open commitments

- None. All Claude threads closed.

### Files to read on resume (ordered, with token budgets)

1. `working-session/boot-claude.md` — orientation (~800 tokens)
2. `working-session/TURNFILE.yaml` — coordination state (~300 tokens)
3. `working-session/WORKLOG.md` lines 1-10 — status block (~200 tokens)
4. `working-session/MAILBOX.md` inbox snapshot — unread check (~100 tokens)
5. `working-session/OPEN_QUESTIONS.md` Active section — (~200 tokens)

### Pending Maintainer decisions

1. PRD-017/018/019/020 acceptance (agent acceptance complete, Maintainer pending)
2. PRD-002 acceptance (scaffold v2, agent-reviewed)
3. PRD-015 re-acceptance (requires onboarding validation evidence)
4. Gemini onboarding governance approval (Band C)

### OQs touched

- No new OQs registered this session
- Active: OQ-051, OQ-054, OQ-055, OQ-056, OQ-057

---

## Session 14 Close Snapshot — Claude

```yaml
session_id: claude-session-14
agent: Claude
models: [Claude Opus 4.6, Claude Fable 5, Claude Opus 4.8]   # three generations, one protocol
surface: Claude Code
timestamp: 2026-06-13
close_reason: Maintainer-directed coordinated close (Codex closing in parallel)
revision_token: REV-20260613-snapshot-claude-14-h2ab83ed3
branch: prd-021-conflict-loop-gradient
turnfile_revision: 123
phase: phase-2 / p2-f
```

### Active task status
- Claude lanes: all complete or handed off. PRD-028 implemented+filed done; PRD-029 evals authored, reviewed Codex impl, filed done; PRD-014 A1 drafted (awaiting Codex review, MSG-044 open); skill v0.6.0.
- Open Claude-owned messages (carry): MSG-044 (PRD-014 A1 review), MSG-046 (skill v0.6.0 notify; Codex acknowledged).

### Mailbox state
- Claude unread 0, no locks held, Claude idle.
- Closed this session-close: MSG-039/041/042. Codex closes its own terminal messages.

### Open commitments / carry-forward to session 15
1. Deferred WORKLOG compaction (639>500) + signal-log compaction — run at next boot FIRST (single-agent, safe).
2. PRD-014 A1 amendment — Codex review pending (MSG-044).
3. Codex lanes: PRD-021/022/024 implementation, PRD-023/026 eval authoring → then Claude implements 023/026.
4. PRD-024 R5.1 dense-fragment validator (Codex lane).
5. Maintainer pre-PRD-027 checkpoint + push/PR decision → then PRD-027 (tokenese) initiation.

### Key files changed this session
- New: BASELINE.md, tools/validate-tokenese-pairs.mjs, tools/next-state.mjs, evals/{prd-021,022,024,028,029,archive-shelf}.evals.mjs, docs/archive/prds/ (002/015/020), skills/claude/ (role-keyed v0.6.0).
- Promoted to docs/prds: PRD-017,018,019,021,022,023,024,026,028,029. Folded: PRD-020→PRD-017 R7. Amendments: PRD-006 A1, PRD-003/004/008 A1 (draft), PRD-014 A1 (draft).

### Files to read on resume (ordered)
1. working-session/boot-claude.md (v8) — orientation (~900 tokens)
2. working-session/TURNFILE.yaml — coordination state (~400 tokens)
3. working-session/WORKLOG.md status block + closeout entry (~400 tokens)
4. working-session/MAILBOX.md inbox snapshot (~150 tokens)
5. This snapshot (carry-forward) (~400 tokens)

### Decision context
- Eight-step A1 loop is now the law for PRD implementation (acceptance ≠ done). PRD-027 double-gated behind PRD-028 (done) + Maintainer checkpoint.
- Files-First + Concurrent-Write Discipline (skill v0.5.0/v0.6.0) are the session's hardest-won operating lessons.

### OQs touched
- Session 14 resolved OQ-051 through OQ-068 (zero active OQs at close). Registry: working-session/OPEN_QUESTIONS.md.

---

## Session 15 Close Snapshot — Claude

```yaml
session_id: claude-session-15
agent: Claude
model: Claude Opus 4.8 (1M)
surface: Claude Code
timestamp: 2026-06-16
close_reason: Maintainer-directed close; Maintainer reviews/approves charter + PRD-030 between sessions
branch: session-15-compaction (pushed; commit 273dbb1 + closeout commit)
turnfile_revision: ~142 at close
phase: phase-2 / p2-g
```

### Session 15 outcome
- Deferred session-14 compaction run first (WORKLOG + signal log).
- PRD-027 Tokenese pilot initiated: approved, promoted, task list registered.
- First full Tokenese teach cycle: Claude taught -> Codex produced E1-E8 -> Claude graded 7/8 (gate PASSED); tk-teach-tokenese done.
- Session charter (R2.4, narrowed scope) + A/B suite drafted, Codex counter-reviewed + signed; suite agreed (AC5) -> tk-ab-suite-design done; charter draft v2 awaiting Maintainer ratification.
- Perplexity scoped as deterministic checker/decoder (instrument, tokenese repo, R7); package delivered (next-session eval).
- PRD-030 (heartbeat mgmt) drafted by Codex, reviewed APPLY w/ 5 counters (C1-C5 applied); awaiting Maintainer acceptance.
- 2-min sync loop enabled then DELETED at close (PRD-030 AC6 worked example).
- Closed 7 fulfilled Claude threads; committed + pushed branch session-15-compaction.

### FIRST ACTIONS ON RESUME (session 16)
1. Boot, then CONFIRM Maintainer approvals: (a) charter ratification (R2.4), (b) PRD-030 acceptance. If ratified, record + (if directed) promote.
2. Deep-inspect + apply Perplexity's deterministic checker/decoder against the pre-eval checklist (WORKLOG session-15 closeout entry). BLOCKER check: DESIGN section 7 grammar coverage.
3. Then tk-ab-run mini-pilot (W1 + L1), scored by Perplexity's checker — only after charter ratified.

### Open Claude-owned threads carried (unread 0)
- MSG-20260616-008 (charter/suite/PRD-030 acceptance; Codex unread 1, Codex acks/closes).
- MSG-20260613-044 (PRD-014 A1 apply-or-counter; still pending Codex review).

### Carry-forward (Codex lanes, unchanged)
- PRD-014 A1 review (MSG-044); PRD-021/022/024 impl (evals red); PRD-023/026/017 eval-authoring -> Claude implements; PRD-024 R5.1 validator.

### Key files this session
- New: working-session/SESSION_CHARTER.md, working-session/docs/tokenese-ab-suite.md, working-session/docs/PRD-030-...md (Codex).
- PRD-027 promoted to docs/prds. tools unchanged. Tokenese corpus read: ~/Git/tokenese (spec/DESIGN/INTENT/CONFORMANCE/HANDOFF).

---

## Session Close Snapshot (tonight) — Claude — 2026-06-17

```yaml
agent: Claude
model: Claude Opus 4.8 (1M)
timestamp: 2026-06-17
turnfile_revision: ~166 at close
close_reason: Maintainer-directed close for the night
```

### Done this session arc (PRD-027 execution + governance)
- W1+L1 Tokenese mini-pilot COMPLETE: 2 clean independently-corroborated points. W1 (deploy-status, Claude->Codex) win-conformant, Tokenese wins (o200k 0.72 / anthropic 0.59); L1 (deadlock-debug, Codex->Claude) l1-plain-success, correct `plain` refusal (R1). First live Tokenese A/B data — recorded in WORKLOG tk-ab-run section.
- Perplexity deterministic checker/decoder evaluated: 72/72 tests, every pre-eval checklist item cleared (DESIGN §7 grammar, 6 capabilities, no-generation, PairScore schema, unparseable markers, golden corpus, provenance pinning, tkab scorer, AUDIT_CARD). o200k gap (tiktoken) closed by Codex f3a3a89.
- PRD-030 + PRD-031 PROMOTED to docs/prds (Maintainer-directed). PRD-031 Claude acceptance recorded; all 3 gates accepted; implementation-pending object set.

### FIRST ACTIONS ON RESUME (next session)
1. Boot; confirm Codex retired `turnfile-session-heartbeat` (PRD-030 R5) — if still active, coordinate deletion.
2. PRD-031 Phase 1: author `evals/prd-031-phase1.evals.mjs` (A1 step 4) -> Codex implements -> Claude reviews.
3. Expand the A/B suite (W2/W3/W4, L2/L3); write the formal `tk-ab-run` results artifact.

### Open Claude-owned threads (unread 0)
- MSG-20260617-005 (mini-pilot complete), MSG-20260617-006 (close + heartbeat ask) — Codex acks/closes.
- MSG-20260613-044 (PRD-014 A1) — Codex returned APPLY; implementation lane pending.

### Carry-forward (Codex lanes, unchanged)
- PRD-014 A1 impl; PRD-021/022/024 impl (evals red); PRD-023/026/017 eval-authoring -> Claude implements; PRD-024 R5.1 validator.

### Pilot pair fixtures (for reference, in ~/Git/tokenese checker env)
- TKAB-W1.claude.codex.live1 (deploy-status), TKAB-L1.codex.claude.live1 (deadlock-debug).

---

## Session Close Snapshot — Claude — 2026-06-17 (session 16, rev 193)

```yaml
agent: Claude
model: Claude Opus 4.8 (1M)
date: 2026-06-17
branch: main
turnfile_revision: 193
phase: phase-2 / p2-g
close_reason: Maintainer-directed close; both agents closed
```

### Done this session (large arc)
- Completed via full PRD-006 A1 loops: PRD-030, PRD-031 Phase 1, PRD-014 Amendment A1, PRD-024 R5.1, PRD-021/022, PRD-017/023/026.
- New tools: `tools/aggregate-coordination.mjs` (Codex), `tools/validate-closeout.mjs` (Codex), `tools/validate-boot-sequence.mjs` + `tools/validate-out-of-band-reconciliation.mjs` + `tools/validate-review-cycle-closure.mjs` (Claude); new doc `docs/BOOT_SEQUENCE.md`.
- `skills/claude` v0.6.0 -> v0.9.0 / bundle v12 (heartbeat mgmt, Tokenese guardrails, read-tool/edit-guard + re-Read-peer lessons, Decision Mirror Modes, boot-manifest + drift refs, header reconciled).
- Tokenese: W1+L1 mini-pilot + W2/W5 v0.3 scored; W3+L2 (Claude dir) authored conformant (token-score pending Codex verified env); charter reconciled to RATIFIED; `tk-ab-run-results.md` maintained.
- Drafts/reviews: PRD-032 (Codex) Claude APPLY+counters; PRD-033 (Claude) Codex APPLY+counters — both agents converged, Maintainer acceptance pending.
- `NEXT_SESSION_HANDSHAKE.md` drafted (5 Maintainer elements + 6 Claude additions).

### FIRST ACTIONS ON RESUME (session 17)
1. Boot via `docs/BOOT_SEQUENCE.md`; run the `NEXT_SESSION_HANDSHAKE.md` contract (versions, skills self-validate, scope, outstanding, sign-off) and converge it with Codex.
2. Closure-owner sweep: scan own sent threads for peer replies that did not raise unread.
3. Resolve guard/commit posture (PRD-033) before any commit; report enforcing `TURNFILE_AGENT` + `core.hooksPath`.

### Outstanding (authoritative: NEXT_SESSION_HANDSHAKE.md §5)
- Maintainer acceptance: PRD-032, PRD-033. Tokenese: W3/L2 verified scoring + W4/L3 + calibration + Tier-B decision. Decision Queue items. PRD-031 Phase 2/3. Deferred closeout: signal-log compaction (64 eligible) + boot-archive rollover.

---

## Session 17 Close Snapshot — Claude — 2026-06-17 (rev ~209)

```yaml
agent: Claude
model: Claude Opus 4.8 (1M)
date: 2026-06-17
branch: main
turnfile_revision: ~209
phase: phase-2 / p2-g
close_reason: Maintainer-directed close after full 4-lane scope achieved
commit: 06968d3 (not pushed — push held)
```

### Done this session (full 4-lane scope achieved)
- Handshake converged + signed (Claude + Codex + Maintainer rows).
- PRD-033 Skill Ownership Integrity Guard: built the Maintainer-owned/agent-locked shared guard (OWNERSHIP.yaml + tools/hooks/{pre-commit,guard-check.mjs} + validate-ownership-guard.mjs), authored evals/prd-033.evals.mjs (12/12), Codex implemented Layer-1 adapter + activation (core.hooksPath=tools/hooks), Claude reviewed APPROVE (LIVE active-hook commit-block verified). Guard is LIVE.
- PRD-032 Session Orientation Tool: implemented tools/session-orient.mjs (read-only; composes next-state + validate-closeout; repo-layout defaults; ownership heuristic; --validate opt-in), evals 11/11, resolved two Codex review counters (defaults; default false-stale projection). skills/claude v0.9.1/bundle 13 prefers it (AC8). Codex APPROVE.
- Tokenese Tier-A: Codex scored W3/L2 (verified o200k) + authored/scored W4/L3; Claude acked + sanity-checked. All 8 pairs scored; W4 WIN both tokenizers; tk-ab-run-results.md reconciled with version tags; frameset_validation report-only; R7 intact.
- Deferred closeout: signal-log compaction done (SIG-031..128 removed). PRD-032 + PRD-033 promoted to docs/prds. Session committed 06968d3 (TURNFILE_AGENT=maintainer).

### FIRST ACTIONS ON RESUME (session 18)
1. Boot via docs/BOOT_SEQUENCE.md + NEXT_SESSION_HANDSHAKE.md (session-18 addendum); converge with Codex.
2. Report guard posture; use `node tools/session-orient.mjs --agent claude --emit human` for orientation (PRD-032 is live now).
3. Bounded goal: tk-calibration-audit (PRD-027 R5.5) using W4 + E1/W1 evidence; then Maintainer Tier-B decision. Tokenese measurement-only; chat dense scratchpads OFF.

### Commit identity reminder (guard LIVE)
- core.hooksPath=tools/hooks; .turnfile-agent=codex in this clone. Claude-owned commits need TURNFILE_AGENT=claude; whole-tree/cross-ownership commits need TURNFILE_AGENT=maintainer (Maintainer-directed). push held.

### Open Claude-owned threads (unread 0)
- All session-17 mailbox threads actioned. MSG-029 (PRD-032 fix) Codex APPROVE'd. Nothing carried unread.

### Key files this session
- New: OWNERSHIP.yaml, tools/hooks/{pre-commit,guard-check.mjs,README.md}, tools/validate-ownership-guard.mjs, tools/session-orient.mjs, evals/prd-032.evals.mjs, evals/prd-033.evals.mjs. skills/claude -> v0.9.1/bundle 13. PRD-032/033 docs -> docs/prds.

---

## Session 18 Close Snapshot — Claude — 2026-06-17 (rev 218)

```yaml
agent: Claude
model: Claude Opus 4.8 (1M)
date: 2026-06-17
branch: main
turnfile_revision: 218
phase: phase-2 / p2-g
close_reason: Maintainer-directed close; session-19 scope adopted per Codex proposal
commit: directed this close — whole-tree as TURNFILE_AGENT=maintainer + push
```

### Done this session
- Reviewed the 3 Codex-queued drafts (apply-or-counter, all APPLY-with-counters, none rejected; each claim code-verified first): PRD-034 (4 counters), PRD-035 (4 counters), PRD-036 (2 counters) → MSG-031/032/033. Codex acknowledged; substantive reconciliation is its carry-forward.
- Tokenese expansion: observed the increment read-only (R7) — ~/Git/tokenese 0.3.2->0.3.7 (translator/docs + new official skill bundle v1.0.0; grammar v0.3 + TKAB schema tkab-check-1.1 UNCHANGED). Maintainer-directed pull to origin/main@7edad11. Re-scored all 6 v0.3 pairs on 0.3.7 -> anthropic ratios byte-identical (bump does not perturb outcomes); only local diffs W2/W5 win-conformant->indeterminate from missing tiktoken (o200k) in Claude env. All 8 Tier-A pairs stand.
- tk-calibration-audit COMPLETE -> working-session/docs/tk-calibration-audit.md. Verdict: ev:obs conditional (held across 6 A/B pairs post-repair; E1 teach miss proves it is not self-validating -> untrusted-by-default, verifiable backing only); ^N insufficient (N=3, no scale); plain abstention pass. Codex applied the verdict + Tier-B recommendation with NO counter (MSG-034). PRD-035 R4 -> single calibration source.

### Maintainer decisions at close
1. Bounded Tier-B Tokenese operational/handoff twin lane AUTHORIZED (SESSION_CHARTER Amendment A1): W2/W5 source-paired shape, English source-wins, governance English-only, self-reports untrusted, chat dense lane stays OFF, R7 intact.
2. Session-19 scope ADOPTED per Codex proposal (Gemini provisional onboarding led by Claude + PRD-034/035/036 advancement eval-first + bounded Tier-B implementation).
3. Commit whole-tree as TURNFILE_AGENT=maintainer + push.

### Concurrent-collaboration note (Codex live this session)
Codex worked the same tree concurrently: authored RED evals/prd-034/035/036, recorded the Tokenese-increment note (SIG-170/171), actioned MSG-034 (calibration accepted), reconciled tk-ab-run -> done, rolled boot-codex v7->v8, proposed session-19 scope (SIG-174). Re-grounded almost every turn (rev 210->218); the Read-before-edit guard caught two stale-state edits — both re-derived from fresh files.

### FIRST ACTIONS ON RESUME (session 19)
1. Boot via docs/BOOT_SEQUENCE.md + NEXT_SESSION_HANDSHAKE.md (session-19 addendum); converge with Codex (its session-18 handshake row is still unsigned — confirm/re-sign for session 19).
2. Open the adopted scope: Claude leads Gemini provisional onboarding under PRD-015 (reactivated), Codex cross-review, evidence OT-008 -> OT-002 -> OT-004.
3. Codex carry-forward to clear early: sign handshake row + apply-or-counter the 3 draft-review counters (MSG-031/032/033). Then advance PRD-034/035/036 eval-first (PRD-036 first if broad eval repair needed, else PRD-035).
4. Implement the bounded Tier-B Tokenese twin lane (charter A1; English source-wins, governance English-only).

### Carry-forward / open
- Codex session-18 handshake row unsigned; 3 draft-review counters acknowledged-not-applied.
- PRD-034/035/036 still draft (Codex-authored RED evals exist; implementer=Claude, reviewer=Codex per PRD_STATUS) — need counter reconciliation + Maintainer acceptance before A1 implementation.
- `npm run evals:prd` is broken (PRD-036 target). Mailbox at ~48 active cards — optional compaction next session.
- Local ~/Git/tokenese now at 0.3.7 (pulled); Claude env still lacks tiktoken (o200k local-scoring gap).

---

## Session 19 Close Snapshot — Claude — 2026-06-17 (rev ~234)

```yaml
agent: Claude
model: Claude Opus 4.8 (1M)
date: 2026-06-17
branch: main
turnfile_revision: ~234
phase: phase-2 / p2-g
close_reason: Maintainer-directed close; scope met (Gemini onboarding mechanism confirmed + PRD promotion ACK)
commit: directed this close — whole-tree as TURNFILE_AGENT=maintainer + push
```

### Done this session
- Booted, signed handshake; Model-Ledger Handshake (Opus 4.8). Codex live concurrently — signed its row, cleared its entire PRD-034/035/036 counter carry-forward, closed at rev 228.
- **Gemini onboarding lead lane (PRD-015):** evaluator-prep evidence → `working-session/docs/onboarding/evidence/gemini-cli/2026-06-17-01/{evidence.md,antigravity-readiness.md}`. OT-001 PASS (R1 approved; runtime corrected to **Google Antigravity**). OT-008 conditional-pass + findings F1/F2/F3/F4. Codex cross-reviewed APPLY (MSG-036 closed).
- **LIVE Antigravity test** (Maintainer brought it live): GEMINI.md auto-loads as a rule but `@import` is INERT; `.agents/skills/` is the discovery path (indexed at workspace load); live model **Gemini 3.5 Flash (High)**; read/shell/validators clean. **Path B confirmed**, F3 mechanism risk retired; MODEL_LEDGER row added; Antigravity boot procedure documented; throwaway probe deleted.
- **PRD-034/035/036:** Maintainer ACCEPTED all three; Codex promoted to `docs/prds/`; Claude verified + ACK'd promotion (MSG-037 actioned). Implementation eval-first, not started.

### FIRST ACTIONS ON RESUME (session 20)
1. Boot via BOOT_SEQUENCE + NEXT_SESSION_HANDSHAKE (session-20 addendum); converge with Codex; report guard posture.
2. Gemini live-Antigravity execution lane: port bundle to `.agents/skills/turnfile-protocol-gemini/`, refresh content, reload, run behavioral OT-002/OT-004 (fixtures in antigravity-readiness.md). Gemini self-remediates gemini-owned files (OT-007). Maintainer adds the new home to OWNERSHIP.yaml first. Use a fresh `antigravity/` evidence path.
3. PRD-034/035/036 implementation (eval-first; PRD-036 first if `npm run evals:prd` repair is needed, else PRD-035 then PRD-034).
4. Bounded Tier-B Tokenese twins (charter A1).

### Carry-forward / open
- Gemini bundle port + behavioral OTs are execution-only next live-Antigravity run.
- OWNERSHIP.yaml needs Maintainer-owned add of `.agents/skills/turnfile-protocol-gemini/**` to gemini.
- Mailbox compaction deferred (~50 active cards; many actioned notify-threads archivable). 5 cosmetic Closed-Summary Mode-field warnings pre-exist.
- `npm run evals:prd` broken on Node v26 (PRD-036 implementation target).

### Concurrency note
Codex live the whole session (rev 219→233). Several mid-write collisions on MAILBOX/TURNFILE; the Read-before-edit guard caught each; re-grounded and took the next rev every time. Don't fight the rev number.

---

## Session 20 Close Snapshot — Claude — 2026-06-17 (rev 256)

```yaml
agent: Claude
model: Claude Opus 4.8 (Fast mode)
date: 2026-06-17
branch: main
turnfile_revision: 256
close_reason: Maintainer-directed close; session-20 milestone committed (8bbf081) + pushed; peers (Codex, Gemini) closed concurrently
commit: 8bbf081 whole-tree as TURNFILE_AGENT=maintainer + pushed to origin/main
```

### Done this session
- Opened session 20, converged the handshake with live Codex (it had opened on PRD-036); recorded the Maintainer redirect to two parallel lanes. THREE agents live concurrently for the first time.
- **Gemini/Antigravity onboarded provisional-active (PRD-015):** guided + verified Gemini's OT-007 bundle port to `.agents/skills/turnfile-protocol-gemini/`; OT-001/007/008/002/004 all passed; F1-F5 resolved; Codex cross-review APPROVE; OWNERSHIP gemini-home added.
- **PRD-034 implemented + APPROVE:** built `tools/validate-public-surface-snapshot.mjs`; reconciled README + docs/index.html + llms.txt + assistant-guide(+.well-known) to registry truth (32 promoted / 3-agent roster / freshness markers).
- **PRD-036 implemented + APPROVE:** `tools/run-prd-evals.mjs` portable runner; Codex took the PRD_STATUS-driven expected-pending gate-scope.
- **Handshake extended to 3 agents:** authored RED evals for validate-boot-sequence N-agent + `--repo-skill-bundle` gate (Codex implemented); BOOT_SEQUENCE registered-agents note; fixed boot-claude prd-017/021/023 content.
- **Role-specialization proposal** (MSG-047/048): Claude = reviewer/verifier/synthesizer/orchestrator; Codex + Gemini = fast implementers + routine coordination; peer-convergence to cut Claude + Maintainer bottlenecks. Both ACCEPTED.
- CI GREEN (validate + evals:prd exit 0); committed 8bbf081 + pushed.

### Maintainer feedback internalized
- **Files-First, hard:** read the project's LIVE files before trusting memory/context — saved as memory `read-project-before-memory`; fixed stale MEMORY.md. This is the main thing that was slowing me (re-deriving from memory then re-grounding).
- **Concurrency is normal:** 2-3 agents opening/closing simultaneously is expected; re-ground, take the next rev, don't be thrown.
- **Specialize + delegate:** route fast implementation to Codex/Gemini, keep Claude on review/synthesis/judgment; reduce Maintainer as decision-broker via the peer-convergence model.

### Carry-forward (session 21)
- Draft the short peer-convergence PRD (PRD-018 selective-unlock expansion).
- PRD-035 (Tokenese sync) implementation — machine-speed-Tokenese roadmap gateway.
- Gemini PRD-027 teach + production-competence gate before any Tier-B twin.
- PRD-031 Phase 2/3 (per-agent shards) to kill the re-grounding tax with 3 live agents.
- Deferred: mailbox compaction (large); gemini bundle SKILL-header 0.2.0 vs CHANGELOG 0.2.1 (gemini-owned cosmetic).

### Closeout bookkeeping
- claude idle / current_task null; s20-gemini-onboarding done; gemini status reconciled active->idle under maintainer closeout authority (Gemini closed but left status active); boot rolled v13->v14 (v13 archived); WORKLOG status updated; SIG-212 yield.
