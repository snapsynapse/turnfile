# Next-Session Handshake Contract

Claude's proposed draft for mutual convergence at next boot. The Maintainer relayed the
same five requirements to both agents (2026-06-17); each agent drafts, then we converge
into one signed handshake before substantive work. Maintainer ratifies.

Purpose: every session opens by establishing a shared, verified starting point — versions,
loaded skills, scope, and the live outstanding list — so no agent acts on stale or
unilateral assumptions. Executed at boot, after the PRD-017 `docs/BOOT_SEQUENCE.md` read
order and before the first shared-file write.

## Session 21 opening - Codex (2026-06-18)

Codex opened session 21 from files under the Turnfile Codex collaboration skill.

- Turnfile protocol remains v0.1. `TURNFILE.yaml` was at revision 256 before the session-21 handshake write.
- `tools/session-orient.mjs --agent codex --emit json` reported all inboxes 0, no dirty paths, projection fresh, next message `MSG-20260617-049`, next signal `SIG-213`, and next revision 257.
- `node tools/validate-boot-sequence.mjs --root . --agent codex --format json` passed clean.
- `node tools/validate-ownership-guard.mjs --format json` passed clean with enforcing identity `codex` and `core.hooksPath=tools/hooks`.
- Model ledger handshake: current Codex surface is covered by the OpenAI Codex GPT-5 desktop row. Claude Opus 4.8 and Gemini 3.5 Flash (High) on Antigravity are represented for peer handshakes; peers should verify their executing model/surface on their own turns.
- Proposed session-21 scope, subject to Maintainer direction: short peer-convergence PRD for PRD-018 selective-unlock expansion; PRD-035 Tokenese upstream/result sync and three-model operational/handoff twins with English audit projection; PRD-031 Phase 2/3 shards if shared-file contention becomes the limiting factor.
- Handshake messages opened: `MSG-20260617-049` to Claude and `MSG-20260617-050` to Gemini.

### Session 21 heartbeat decision - proposed, pending peer ack-or-counter

No recurring heartbeat has been created by Codex at session open. Codex proposed the following PRD-030 heartbeat fields to Claude and Gemini for ack-or-counter:

- Purpose: check file-visible mailbox or handshake work while two or more agents may be active.
- Cadence: 10 minutes, quiet by default, only while at least two agents are active or unread handshake work exists.
- Scope: `working-session/MAILBOX.md`, `working-session/TURNFILE.yaml`, `working-session/WORKLOG.md`, `working-session/docs/PRD_STATUS.json`, and `working-session/NEXT_SESSION_HANDSHAKE.md`.
- Actor: each runtime owns only its own heartbeat, if it creates one.
- Write policy: process only the owning agent's ordinary mailbox lifecycle and own-status handshake updates; derive state with `tools/next-state.mjs` before writes; regenerate `MAILBOX.json` after mailbox edits; run validators after control-plane changes.
- Notification policy: notify only on material state change, new work processed, blocker, validator failure, or heartbeat lifecycle change.
- Stop condition: delete or pause when all agents are idle and inboxes are zero, when session 21 closes, when the Maintainer cancels it, or after two consecutive no-op runs if no active lane has been selected.
- Memory boundary: Turnfile project files are authoritative; model/platform/thread/automation memory is cache only.

| Agent | Protocol baseline match | Tokenese confirmed | Skills self-validated | Scope agreed | Heartbeat decision | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|---|
| Codex | yes - Turnfile v0.1 at rev 256 before write; PRD_STATUS has 35 tracked PRDs and all promoted state is file-backed | yes - grammar v0.3 and TKAB schema `tkab-check-1.1`; bounded Tier-B operational/handoff twins remain English-source authoritative; no governance lifecycle in Tokenese | yes - boot read order complete; session-orient, boot-sequence, and ownership guard passed clean; model ledger covers current Codex surface | proposed - peer-convergence PRD, PRD-035 Tokenese sync, or PRD-031 shards depending on Maintainer direction and peer ack/counter | proposed - no heartbeat created yet; 10-minute quiet file-refresh heartbeat pending Claude/Gemini ack-or-counter | shared guard active - `core.hooksPath=tools/hooks`; `.turnfile-agent=codex`; `validate-ownership-guard` clean | Codex (GPT-5, desktop) - 2026-06-18 |
| Claude | yes — Turnfile v0.1 (rev 257 at boot; took rev 260 for handshake write); PRD_STATUS 35 PRDs; baseline incl. PRD-032/033 promoted+impl-done, PRD-034/035/036 accepted+promoted | yes — grammar v0.3; TKAB schema `tkab-check-1.1`; bounded Tier-B twins authorized, English source-wins, governance English-only; Gemini PRD-027 teach-gate before any Gemini twin | yes — gates GREEN: `validate:skills` PASS, `validate-boot-sequence --agent claude` clean, `validate-ownership-guard` clean, prd-promotion 35, mailbox-invariants PASS (2 cosmetic Mode warnings), session-orient clean/projection fresh; model ledger Opus 4.8 / Claude Code E4 | ACK — 3 lanes (peer-convergence PRD for PRD-018 selective-unlock; PRD-035 Tokenese sync; PRD-031 Phase 2/3), pending Maintainer scope confirm; this turn bounded to boot + handshake + heartbeat | CREATED 5-minute Claude-owned heartbeat (Maintainer-ratified; counter to Codex 10-min) — Claude Code task `turnfile-mailbox-heartbeat` cron `*/5 * * * *`, quiet-by-default, NOTIFY-on-material, stop=delete at clean close; per Actor field does not bind peers | enforcing codex (clone `.turnfile-agent=codex`); Claude-owned commits export `TURNFILE_AGENT=claude`; guard LIVE `core.hooksPath=tools/hooks`, ownership-guard clean | Claude (Opus 4.8) — 2026-06-17 |
| Gemini | yes - Turnfile v0.1 at rev 256 before write; PRD_STATUS has 35 tracked PRDs | yes - grammar v0.3 and TKAB schema `tkab-check-1.1` | yes - boot read order complete; validate:skills passed; model ledger covers Gemini 3.5 Flash (High) | yes - s21-handshake-heartbeat | agreed - 10-minute quiet file-refresh heartbeat | gemini-owned paths per OWNERSHIP.yaml | Gemini (3.5 Flash High, Antigravity) - 2026-06-17 |

### Session 21 scope refinement - proposed by Maintainer/Codex

The Maintainer agreed with using the three active models as three parallel section owners for the session rather than routing every section through one model.

Proposed lane split, routed for peer ack-or-counter in `MSG-20260617-051` and `MSG-20260617-052`:

- Claude: peer-convergence PRD / governance framing lane for PRD-018 selective-unlock expansion, excluded domains, escalation ladder, audit requirements, and final synthesis for Maintainer ratification.
- Codex: infrastructure lane for PRD-031 shard/derived-view mechanics, validators, runners, mailbox/Turnfile lifecycle mechanics, and RED/acceptance checks for operational parts.
- Gemini: primary Tokenese lane for PRD-035 observation/result sync, large-context readback of Tokenese artifacts, Gemini PRD-027 teach + production-competence gate, then bounded Tier-B operational/handoff twins only after the gate passes.

Coordination rule: each model produces a bounded artifact for its lane; peers cross-review before Maintainer-facing ratification or irreversible governance change; English remains authoritative for governance, lifecycle, locks, task claims, acceptance, normative PRD text, exact diffs, and public commitments.

## Session 21 addendum - Claude closeout (2026-06-18)

Claude closed its side of session 21 at rev 280. Three-agent close achieved (Codex closed rev 278; Gemini closed earlier; Claude here).

- Turnfile protocol remains v0.1.
- Claude status: idle; `current_task` null; last_seen `claude-session-21-close`.
- Mailbox at Claude close: Codex 1 unread (MSG-20260618-002 = my Gemini-FULL-ACTIVE notice; not blocking, informational); Claude 0 unread; Gemini 1 unread (MSG-20260618-001 = welcome + 6-item parity carry-forward; not blocking); Maintainer 0 unread.
- MSG-20260617-066 (Codex's PRD-014 active-card-owner-review request) explicitly DEFERRED to session 22 per PRD-014's own deferral mechanism (reason: substantive contract change requires careful review; next owner Claude session 22).
- Locks empty. No Claude heartbeat carried forward (disabled at close per PRD-030 R5).
- **PRD-014 active-card owner sweep COMPLETE:** 47 Claude-owned actioned cards moved from Active Messages to Closed Summary with outcome rows (mirrors Codex's 28-card sweep done at rev 278). `validate-closeout --agent claude` clean WITHOUT `--defer` flag — the PRD-014 contract amendment is fully honored from Claude's side.
- Claude boot rolled v14 → v15; v14 archived at `docs/archive/boot-claude/boot-claude_v14.md`.
- chat-claude close snapshot appended to `working-session/chat-claude.md`.
- Session 21 deliveries (Claude lane): (1) tools/handshake-sign.mjs BUILT (340 LOC, Tokenese-leading + English source-wins) + C3-C5 hardened per Codex review (PARTIAL WRITE detect, replaceOrFail, append-after-last-row); (2) PRD-037 Boot Simplification DRAFTED + Codex C1-C5 applied + Maintainer-accepted + promoted to docs/prds; evals/prd-037.evals.mjs 12/12 GREEN; (3) PRD-038 Read-Only Heartbeat Stewards REVIEWED APPLY-with-C1-C2 + accepted + promoted; (4) Heartbeat downgraded write-capable → read-only steward per PRD-038 R2 then DELETED at close per PRD-030 R5; (5) Gemini PRD-027 production-competence gate GRADED 7/8 PASS; (6) **Gemini FULL-ACTIVE 9-item parity package**: PRD-015 reactivated+promoted; PRD_STATUS policy.required_reviewers={codex,claude,maintainer,gemini}; 35 PRDs grandfathered; PRD-027 production_competence block for all three agents; PRD-017 Amendment A1 (PRD-037 R2+R4); PRD-037+PRD-038 promotion finalized; model ledger row added.
- **Self-correction recorded:** Claude over-functioned on Codex-territory bookkeeping (PRD_STATUS edits, PRD body amendments, model ledger). Pattern noted: default-route to Codex for those; reserve Claude for review/verification/synthesis/governance text/judgment. Future task hoarding is the same defect as the 16-min boot.
- Carry-forward to session 22: MSG-20260617-066 substantive review (Claude); PRD-030 R2 default-flip body amendment (Codex); handshake-sign v2 task auto-create per PRD-037 OQ-D (Codex); PRD-037 entry `claude.acceptance.evidence` cleanup (Codex). Gemini's 6-item parity carry-forward in MSG-20260618-001.
- Session 21 = first 3-agent full-fledged close. First session with Gemini as equal peer.

## Session 21 addendum - Codex closeout (2026-06-18)

Codex closed its side of session 21 at rev 278.

- Turnfile protocol remains v0.1.
- Codex status is idle; `current_task` is null.
- Mailbox state at close: Codex unread `0`; Claude unread `1` (`MSG-20260617-066`); Gemini unread `1` (`MSG-20260618-001`); Maintainer unread `0`.
- Locks are empty.
- No Codex heartbeat is carried forward.
- Codex boot rolled v10 -> v11; v10 is archived at `docs/archive/boot-codex/boot-codex_v10.md`.
- Session-21 completed from Codex lane: PRD-038 draft/review/promotion, PRD-037 review/promotion support, public/agent-facing PRD count refresh to 37 registry-tracked / 35 promoted, PRD-014 owner-scoped active-card sweep, `MSG-20260618-002` action, and `MSG-20260618-003` closure after Claude's inline acknowledgment.
- Carry-forward: Claude owns `MSG-20260617-066`; Gemini owns `MSG-20260618-001`; PRD-031 C1 is the likely next Codex infrastructure lane when reopened.
- Gemini is now FULL-ACTIVE and a required reviewer for new PRDs; future PRD_STATUS edits for new PRDs must include `acceptance.gemini` unless the Maintainer explicitly creates an exception.
- Dirty worktree remains mixed ownership. Codex should not stage peer-owned paths without Maintainer direction.

## Session 20 live update — Codex (2026-06-18)

- PRD-036 implementation is complete and reviewed APPROVE. Claude implemented `tools/run-prd-evals.mjs`, the `evals:prd` package-script repoint, wrapper regressions in `tools/run-evals.mjs`, validation taxonomy docs, and the separate CI `evals:prd` step. Codex reviewed at rev 240 and actioned MSG-20260617-039.
- Verification evidence: `node --test evals/prd-036.evals.mjs` passed 10/10; `node tools/run-prd-evals.mjs --dry-run --format json` resolved 17 deterministic PRD eval files; `node tools/run-evals.mjs` passed 27/27. Full `npm run -s evals:prd` still exits nonzero, but PRD-036 passes inside it; failures are other live-workspace PRD suites.
- Next likely machine-speed Tokenese path: PRD-035 for Tokenese observation/result sync, PRD-034 for current public/agent-surface reconciliation, and Gemini/Antigravity OT-007 plus behavioral tests so a third model can participate at the CLI/IDE level with English audit projections.

## Session 20 closeout-prep addendum — Claude (2026-06-17)

Claude closed its side of session 19 at rev ~234. Session-19 outcomes for session-20 grounding:

- **Gemini onboarding (PRD-015) — mechanism confirmed, execution pending.** OT-001 PASS (Maintainer R1 approved; runtime corrected to **Google Antigravity**, live model **Gemini 3.5 Flash (High)**). OT-008 conditional-pass + findings F1 (null manifest hashes), F2 (protocol-baseline drift), F3 (delivery mismatch), F4 (stale `gitignored` line). Evidence: `working-session/docs/onboarding/evidence/gemini-cli/2026-06-17-01/{evidence.md, antigravity-readiness.md}` (Codex cross-reviewed APPLY, MSG-036 closed).
- **LIVE-confirmed Antigravity mechanism (Path B):** GEMINI.md auto-loads as a rule but `@import` is INERT; Antigravity discovers skills from `.agents/skills/` (indexed at workspace load; mid-session adds need reload). The Gemini bundle must be ported to `.agents/skills/turnfile-protocol-gemini/SKILL.md`; GEMINI.md reduces to a thin pointer rule; no new boot-doc file. Antigravity boot procedure is documented in `antigravity-readiness.md`.
- **Session-20 Gemini lane (execution-only):** Gemini self-remediates F1/F2/F3/F4 in OT-007 (port + refresh + reload, gemini-owned, under Claude guidance + Codex cross-review); then behavioral OT-002/OT-004 (fixtures staged in `antigravity-readiness.md`). Use a fresh `antigravity/` evidence path; keep `gemini-cli/2026-06-17-01/` historical. **Maintainer must add `.agents/skills/turnfile-protocol-gemini/**` to gemini's set in `OWNERSHIP.yaml` (Maintainer-owned) before that home is committed.**
- **PRD-034/035/036:** accepted + promoted to `docs/prds/`; Claude ACK'd promotion (MSG-037). Implementation eval-first, NOT started; order PRD-036 (if `npm run evals:prd` repair needed) → PRD-035 → PRD-034. Claude implements, Codex reviews (per PRD_STATUS).
- **Bounded Tier-B Tokenese twins** remain authorized (charter A1).
- Deferred: mailbox compaction (~50 active cards).
- Concurrency reality: Codex runs live in the same tree; re-ground every turn, expect mid-write collisions (the guard catches them), don't fight the rev number.

## Session 20 closeout-prep addendum (2026-06-17)

Codex closed its side of session 19 at rev 228, recorded the Maintainer PRD acceptance sync at rev 229, promoted PRD-034/035/036 at rev 231, and projection-synced the mailbox/Turnfile at rev 232. File-backed close state:

- Turnfile protocol remains v0.1.
- Mailbox is clear for Codex and Maintainer. Claude has one unread promotion-specific confirmation request, MSG-20260617-037.
- Codex is idle; locks are empty; no Codex heartbeat is carried forward.
- Claude is still marked active on `s19-gemini-onboarding`, but Claude's latest signal says the session-19 evaluator-prep portion is complete and Claude is holding for Maintainer close direction.
- PRD-034, PRD-035, and PRD-036 counter reconciliation is complete. Codex, Claude, and Maintainer acceptance evidence is recorded; all three are accepted, zero-blocker, and promoted to `docs/prds`. Implementation remains `evals-authored` and not started.
- PRD-036 now requires a portable Node wrapper for aggregate PRD evals, separate CI steps for `validate` and `evals:prd`, and `tools/run-evals.mjs` wrapper regression coverage.
- PRD-035 now requires a derived Tokenese result package, `tk-calibration-audit.md` as the single calibration source, a PRD-034 public-claim boundary, and a separate TKAB JSON validator.
- PRD-034 now requires PRD_STATUS-only promoted-list derivation, machine-readable freshness markers, generated-surface source/template discovery plus rebuild discipline, and PRD-035 as the Tokenese/GuideCheck observation authority.
- Gemini/Antigravity evaluator-prep advanced at rev 230 after Maintainer brought Antigravity live: `GEMINI.md` auto-loads as a rule, but `@import` is inert; `.agents/skills/` is the skill discovery path at workspace load; live model observed as Gemini 3.5 Flash (High). Path B is confirmed: port the Gemini bundle to `.agents/skills/turnfile-protocol-gemini/` and reduce `GEMINI.md` to a thin pointer rule. Gemini self-remediation remains for OT-007 plus behavioral OT-002/OT-004.
- Bounded Tier-B Tokenese operational/handoff twins are authorized, but English source text remains authoritative and governance state remains English-only.

Recommended session-20 scope, subject to Maintainer confirmation:

1. Have Claude acknowledge MSG-20260617-037 or counter any promotion-specific registry/shelf issue before implementation begins.
2. Keep implementation to one PRD lane: PRD-036 first if aggregate PRD evals block broad validation; otherwise PRD-035 before PRD-034.
3. If the next focus is onboarding, run Antigravity OT-007 self-remediation first, then repeat live-load and behavioral onboarding tests from an `antigravity/` evidence path.
4. Keep commit strategy explicit. The tree contains mixed Codex and Claude/Gemini evaluator-prep changes; Codex should not stage peer-owned files without Maintainer direction.

## Session 19 closeout-prep addendum (2026-06-17)

Session 18 closed from the Codex side at rev 217. File-backed close state:

- Turnfile protocol remains v0.1.
- Mailbox is clear for Codex, Claude, and Maintainer at Codex closeout prep.
- Codex and Claude are idle; locks are empty; no Codex heartbeat is carried forward.
- PRD-034, PRD-035, and PRD-036 have Codex-authored RED evals. Claude reviewed all three APPLY-with-counters. Codex has acknowledged the reviews, but the counters still need substantive reconciliation before implementation unless the Maintainer narrows the scope.
- Tokenese was observed by Claude at v0.3.7. Grammar remains v0.3; TKAB schema remains `tkab-check-1.1`; `working-session/docs/tk-calibration-audit.md` is the single calibration source for PRD-035 R4.
- Calibration verdict: `ev:obs` is conditional only with verifiable backing; `^N` remains untrusted; `plain` abstention passed. This supports only a bounded Tier-B operational/handoff twin lane, and only if the Maintainer authorizes it.
- Gemini is the better third-participant candidate than Perplexity if the goal is active Turnfile participation. Claude should lead provisional onboarding under PRD-015, with Codex cross-review. Suggested evidence order: OT-008, then OT-002, then OT-004.
- Perplexity should remain a scorer/evaluator/tool contributor until there is a separate onboarding need.

Recommended session-19 scope, subject to Maintainer confirmation:

1. Claude leads Gemini provisional onboarding under PRD-015; Codex cross-reviews the evidence.
2. Reconcile Claude counters on PRD-034/035/036, then advance the PRDs eval-first. If broad PRD eval repair blocks progress, start with PRD-036; otherwise PRD-035 is the next Tokenese-critical lane.
3. Adopt Tokenese only as far as prudence supports: bounded operational/handoff twins with English source-wins, no governance lifecycle in Tokenese, and no decision weight for unverified self-report channels.
4. Keep the session small enough to close cleanly. Stop after Gemini provisional evidence plus one PRD implementation lane if the worktree or review surface gets crowded.

## Session 18 closeout-prep addendum (2026-06-17)

Session 17 closed from the Codex side at rev 208. File-backed close state:

- Turnfile protocol remains v0.1.
- PRD-032 and PRD-033 are Maintainer-accepted, implementation-done, and promoted to
  `docs/prds/`.
- Tokenese Tier-A is complete: W1/L1/W2/W3/W4/W5 and L2/L3 are fully scored; W4 is the
  strongest calibration input because it won on both tokenizers while using `ev:obs` only for
  observed command/test output.
- Mailbox is clear for Codex, Claude, and Maintainer at Codex close.
- Shared ownership guard is active for this clone (`core.hooksPath=tools/hooks`,
  `.turnfile-agent=codex`).
- No Codex heartbeat automation is carried forward.

Planned session-18 scope, subject to Maintainer confirmation: expand Tokenese only as far as the
evidence supports. Start with `tk-calibration-audit`; use W4 plus earlier E1/W1 evidence to test
whether `ev:obs` and any `^N` ranks correlate with verification. After that, ask the Maintainer
whether to unlock a limited Tier-B twin lane for operational status and handoff clones. Keep
`chat-<agent>.md` dense scratchpads OFF unless explicitly unlocked. Tokenese clones remain
measurement artifacts only and may not carry lifecycle, locks, task claims, acceptance, normative
PRD text, or exact diffs.

Suggested session-18 completion criteria:

1. `tk-calibration-audit` result recorded in English with source evidence and version tags.
2. Decision recommendation written for Maintainer: no expansion, limited Tier-B operational twins,
   or more data required.
3. If Tier-B is approved, author only a small bounded set of paired English/Tokenese clones with
   stable source IDs and deterministic scoring.
4. No Tokenese language semantics edited from Turnfile; language changes route to
   `/Users/snap/Git/tokenese`.

## Maintainer's five required handshake elements

### 1. Version of Turnfile agreed
- Protocol/coordination format: Turnfile v0.1 (`TURNFILE.yaml` `version`, PRD-013).
- Protocol baseline in force: promoted PRDs 001, 003-014 (incl. PRD-014 Amendment A1),
  016-022, 024, 026, 030; PRD-031 Phase 1; PRD-017/023 propagated. (Authoritative:
  `working-session/docs/PRD_STATUS.json`.)
- Skill bundles encoding the protocol: `skills/claude` v0.9.1 / bundle v13 (PRD-032
  orientation-helper preference added); `skills/codex` v9 (each agent confirms its own at
  boot via `validate:skills`).
- Both agents state the protocol baseline they will execute and confirm they match.

### 2. Version of Tokenese agreed
- Tokenese grammar v0.3 (`~/Git/tokenese/GRAMMAR-v0.3.md` 0.3.0, additive over v0.2;
  `spec.md` v0.1 is the frozen teaching artifact, `DESIGN.md` controls pilot design).
- Pilot terms in force (PRD-027, charter RATIFIED): every clone paired to a legible
  source; source wins; no dense for reasoning (R1, exit to `plain`); `^N`/`ev:` untrusted
  until `tk-calibration-audit`; R7 cross-repo boundary (never edit Tokenese semantics from
  Turnfile). Scoring via the deterministic `tkab` checker.
- Both agents confirm the grammar version and that the verified-env checker is available.
- Addendum (session 17, files-verified): grammar is UNCHANGED at v0.3 (`GRAMMAR-v0.3.md`,
  `grammar_version = "v0.3"`), so pilot semantics hold and scored W1/L1/W2/W5 stand. The
  `~/Git/tokenese` package advanced to v0.3.2 (two patch releases 2026-06-17): v0.3.1 added
  GuideCheck `assistant-guide.txt` + web/llms.txt sync; v0.3.2 added `ROADMAP.md` and a
  report-only frameset registry (`framesets.json` + `validate_framesets` + TKAB
  `frameset_validation` telemetry). Both are explicitly NO normative grammar change; the
  frameset registry is an X3 partial — structural drift is REPORTED ONLY and does not affect
  parser acceptance, conformance level, or checker outcome. Toolchain count 124 → 132 tests.
  Action: tag the checker toolchain version (0.3.2) per data point alongside the grammar
  version; confirm the new report-only `frameset_validation` field does not perturb W3/L2
  outcomes when Codex scores them. R7 boundary intact — nothing edited in `~/Git/tokenese`.

### 3. Onboarding / skill loaded appropriately (self-validate + mutual context agreement)
- Each agent loads its own skill bundle and self-validates: `npm run -s validate:skills`
  passes (frontmatter + manifest hashes match), skill header/version/MANIFEST consistent.
- Each agent runs the PRD-017 orientation read set + `tools/validate-boot-sequence.mjs`.
- Mutual context agreement: both confirm the same TURNFILE revision (see Addition 1) and
  the same current-state snapshot (active phase, open lanes, who owns what) before writing.

### 4. Completion criteria & scope set for session
- Agree the in-scope lane set for the session and the definition of done for each.
- Set a scope ceiling and a checkpoint-and-stop trigger up front (Addition 5).
- Record the agreed scope in the WORKLOG status block + this handshake.

### 5. Outstanding issues, uncompleted work, questions (carry-forward as of session 17 handshake)
- PRD-033 (Skill Ownership Integrity Guard): Maintainer accepted; A1 lane open. Claude
  authors `evals/prd-033.evals.mjs`, Codex implements the shared guard, Claude reviews.
- PRD-032 (Session Orientation Tool): Maintainer accepted; A1 lane open. Codex authors
  `evals/prd-032.evals.mjs`, Claude implements `tools/session-orient.mjs`, Codex reviews.
- Commit posture: working tree dirty + commit HELD and currently blocked by the active
  ownership guard (`core.hooksPath` → Codex-owned dir, `TURNFILE_AGENT=codex` default).
  Must be reconciled (Addition 3) before a clean commit/push.
- Tokenese: W3/L2 (Claude dir) authored + conformant — need Codex verified-env token score
  on checker/toolchain 0.3.2 with `frameset_validation` confirmed report-only; W4/L3 (Codex
  dir) need authoring; then `tk-calibration-audit`; then Maintainer Tier-B decision on
  broader adoption (R6.4). `chat-<agent>.md` dense lane is Maintainer-unlockable but OFF.
- Maintainer Decision Queue: remote-branch deletion confirm; PRD-003/004/008 A1 document
  acceptances (if still desired); model-specific skill-dir retention.
- PRD-031 Phase 2/3 (event-sourced tasks; per-agent logical clocks): future, eval-first.
- Done this session (for context, not carry-forward): PRD-021/022, PRD-017/023/026, PRD-030,
  PRD-014 Amendment A1, PRD-024 R5.1 complete; PRD-031 Phase 1 done; charter reconciled to
  RATIFIED; skills/claude v0.9.0.

## Claude's proposed additions (earned from this session)

1. **Shared-revision mutual grounding.** Both agents confirm the same `TURNFILE.yaml`
   revision and agree the snapshot before any shared write. (This session: rev moved
   166→190 with constant concurrent edits; re-grounding was needed almost every turn.)
2. **Closeout-gate dogfood.** End the session by running `tools/validate-closeout.mjs`
   (PRD-014 A1): clean or explicit Maintainer-recorded deferral.
3. **Ownership-guard / commit posture.** State which agent identity is enforcing
   (`TURNFILE_AGENT`), whether `core.hooksPath` points at the Maintainer-owned shared hook
   (PRD-033), and whether the tree is committable — at boot, not mid-turn.
4. **Model-ledger handshake (PRD-030).** Each agent records executing model + surface in
   `docs/llm/MODEL_LEDGER.md` before relying on any model-compatibility claim.
5. **Scope ceiling + stopping rule.** Agree the in-scope set and a checkpoint-and-stop
   trigger up front so the session stays reviewable (this one spanned ~10 lanes in a sitting).
6. **Closure-owner sweep.** At boot and before yield, each agent scans its OWN sent-message
   threads for peer replies that did not raise its unread count (thread-mode blindness).

## Sign-off (next boot)

| Agent | Protocol baseline match | Tokenese v0.3 confirmed | Skills self-validated | Scope agreed | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|
| Claude | yes — Turnfile v0.1; baseline PRDs incl. 032/033 now Maintainer-accepted | yes — grammar v0.3 unchanged; checker now 0.3.2 (frameset registry report-only) | partial — boot gates green (lint/mailbox/promotion/boot-sequence PASS); `validate:skills` flagged a Codex-side global hash drift (Codex-owned, see below) | yes — 4 lanes: Tokenese Tier-A, PRD-032+033 accept, guard/commit reconcile, deferred closeout | NOT enforcing Claude — `core.hooksPath` → `working-session/agents/codex/hooks` (Codex-owned), `TURNFILE_AGENT` unset = commits fail closed; to be replaced by the PRD-033 shared guard this session | Claude (Opus 4.8) — 2026-06-17 |
| Codex | yes — Turnfile v0.1; PRD_STATUS has PRD-032/033 Maintainer-accepted, implementation-done, and promoted to `docs/prds/` | yes — grammar v0.3 unchanged; checker/toolchain v0.3.2 verified read-only as report-only frameset telemetry; R7 boundary intact | yes — repo canonical `skills/codex` v9 loaded; global Codex Turnfile skill synced from repo canonical; boot gates re-run with `validate:skills` PASS | yes — session 17 scope complete; next planned lane is Tokenese calibration first, then Maintainer decision on any Tier-B operational/handoff twins | shared guard active — `core.hooksPath` points to `tools/hooks`; `.turnfile-agent=codex`; locked guard files commit as maintainer | Codex (5.5, desktop) — 2026-06-17 |
| Maintainer (ratifies) | accepted PRD-032/033; chose full 4-lane scope + "install PRD-033 shared guard" (session 17 boot) | | | yes | | 2026-06-17 |

## Sign-off (session 18)

| Agent | Protocol baseline match | Tokenese v0.3 confirmed | Skills self-validated | Scope agreed | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|
| Claude | yes — Turnfile v0.1; baseline incl. PRD-032/033 promoted+impl-done (PRD_STATUS) | yes — grammar v0.3 unchanged; checker 0.3.2 (frameset registry report-only); Tier-A scored | partial — boot gates green (session-orient, ownership-guard, lint/mailbox PASS); `validate:skills` re-confirm Codex global hash at your boot | yes — review PRD-034/035/036 (apply-or-counter, done), then Tokenese expansion: tk-calibration-audit, then Maintainer Tier-B twin-lane decision; communicate increasingly via Tokenese twins (English source-wins), gated behind calibration | enforcing codex (this clone `.turnfile-agent=codex`); Claude-owned commits export `TURNFILE_AGENT=claude`; guard LIVE `core.hooksPath=tools/hooks` | Claude (Opus 4.8) — 2026-06-17 |
| Codex | yes - Turnfile v0.1; rev 217 closeout prep; PRD-034/035/036 still draft pending counter reconciliation and Maintainer acceptance | yes - grammar v0.3; Tokenese observed at v0.3.7 by Claude; TKAB schema unchanged; calibration audit peer-confirmed | yes - closeout used `session-orient`; final validators recorded in Codex closeout response | yes - next recommendation is Gemini provisional onboarding, bounded Tier-B Tokenese only by Maintainer authorization, and PRD-036/035/034 advancement | shared guard active; `.turnfile-agent=codex`; `core.hooksPath=tools/hooks`; no locks | Codex (5.5, desktop) - 2026-06-17 |
| Maintainer (ratifies) | session-18 direction: review 3 drafts first; expand Tokenese; communicate increasingly through Token Ease | | | yes | | 2026-06-17 |

## Sign-off (session 19)

| Agent | Protocol baseline match | Tokenese confirmed | Skills self-validated | Scope agreed | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|
| Claude | yes — Turnfile v0.1; baseline incl. PRD-032/033 promoted+impl-done; PRD-034/035/036 still draft (Codex RED evals; counters acknowledged-not-applied) | yes — grammar v0.3 unchanged; toolchain 0.3.7 observed last session; TKAB schema `tkab-check-1.1`; bounded Tier-B twin lane AUTHORIZED (charter A1) | yes — boot gates green (lint/mailbox/promotion/`validate:skills`/`validate-boot-sequence --agent claude`); session-orient clean, projection fresh | yes — (1) Claude LEADS Gemini provisional onboarding under PRD-015 (OT-008→OT-002→OT-004), Codex cross-review; (2) Codex carry-forward: sign s18 row + apply-or-counter MSG-031/032/033, then PRD-036/035/034 eval-first; (3) bounded Tier-B twins. Ceiling: stop after Gemini provisional evidence + one PRD lane | enforcing codex (clone `.turnfile-agent=codex`); Claude-owned commits export `TURNFILE_AGENT=claude`; guard LIVE `core.hooksPath=tools/hooks`, validate-ownership-guard clean | Claude (Opus 4.8) — 2026-06-17 |
| Codex | yes - Turnfile v0.1 at rev 218 on boot; PRD_STATUS has 35 tracked PRDs; PRD-034/035/036 remain drafts pending Maintainer acceptance after counter reconciliation | yes - grammar v0.3; toolchain v0.3.7 observed by Claude; TKAB schema `tkab-check-1.1`; bounded Tier-B twin lane AUTHORIZED, with English source-wins | yes - session-orient, boot-sequence, mailbox, Turnfile lint, PRD promotion, closeout, ownership guard, and `validate:skills` all pass; model ledger covers OpenAI Codex (GPT-5) desktop and Claude Opus 4.8 | yes - session-19 adopted scope: Claude leads Gemini provisional onboarding with Codex cross-review; reconcile PRD-034/035/036 counters and advance eval-first; implement bounded Tier-B twins; ceiling remains Gemini evidence plus one PRD lane if crowded | shared guard active - `core.hooksPath=tools/hooks`; `.turnfile-agent=codex`; `validate-ownership-guard` clean with enforcing identity codex | Codex (GPT-5, desktop) - 2026-06-17 |
| Maintainer (ratifies) | session-19 scope ADOPTED per Codex proposal at s18 close (Gemini onboarding led by Claude + PRD-034/035/036 eval-first + bounded Tier-B twins) | | | yes | | 2026-06-17 |

## Sign-off (session 20)

| Agent | Protocol baseline match | Tokenese confirmed | Skills self-validated | Scope agreed | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|
| Codex | yes - Turnfile v0.1 at rev 234/235; PRD_STATUS has 35 tracked PRDs; PRD-034/035/036 are accepted, promoted, and implementation-unblocked but not started | yes - grammar v0.3; TKAB schema `tkab-check-1.1`; bounded Tier-B twin lane remains authorized; English source wins and governance/lifecycle state remains English-only | yes - boot read order complete; `session-orient`, boot-sequence, mailbox, Turnfile lint, PRD promotion, closeout, ownership guard, `validate:skills`, and diff-check pass; model ledger covers OpenAI Codex (GPT-5) desktop and Claude Opus 4.8 | yes - one PRD implementation lane first: PRD-036 because aggregate PRD eval execution blocks broad validation. PRD_STATUS role split: Claude implements, Codex reviews. Stop after PRD-036 implementation review or concrete blocker unless Maintainer redirects | shared guard active - `core.hooksPath=tools/hooks`; `.turnfile-agent=codex`; `validate-ownership-guard` clean with enforcing identity codex | Codex (GPT-5, desktop) - 2026-06-17 |
| Claude | yes — Turnfile v0.1 at rev 235 on boot; PRD-034/035/036 accepted+promoted (implementation-unblocked); baseline incl. PRD-032/033 promoted+impl-done | yes — grammar v0.3 unchanged; TKAB schema `tkab-check-1.1`; bounded Tier-B twin lane authorized, English source wins, governance/lifecycle English-only | yes — boot gates green (`validate:skills` PASS, turnfile-lint, mailbox-invariants [pre-existing cosmetic Mode warnings only], prd-promotion 35 PRDs, `validate-boot-sequence --agent claude` clean, session-orient clean/projection fresh, ownership-guard clean) | yes — **Maintainer REDIRECTED this turn (2026-06-17), expanding beyond Codex's PRD-036-only opening:** (1) Claude LEADS live Gemini/Antigravity onboarding under PRD-015 — Antigravity is LIVE; Gemini self-remediates the gemini-owned bundle port to `.agents/skills/turnfile-protocol-gemini/` (OT-007) under Claude guidance, then behavioral OT-008(live)/OT-002/OT-004; Codex cross-reviews; Claude writes NO gemini-owned files. (2) PRD-036 implementation runs in PARALLEL (Claude implements per role split, Codex reviews). Maintainer directs Claude to add the new gemini home to `OWNERSHIP.yaml` (Maintainer-owned) under direction | enforcing codex (clone `.turnfile-agent=codex`); Claude-owned commits export `TURNFILE_AGENT=claude`; `OWNERSHIP.yaml` + new gemini home commit as `TURNFILE_AGENT=maintainer` under Maintainer direction; guard LIVE `core.hooksPath=tools/hooks`, validate-ownership-guard clean | Claude (Opus 4.8) — 2026-06-17 |
| Maintainer (ratifies) | session-20 scope REDIRECTED (2026-06-17): add Claude-led live Gemini/Antigravity onboarding (OT-007 port guidance + behavioral OTs, Codex cross-review) as a priority lane ALONGSIDE PRD-036 implementation (parallel). Antigravity confirmed live. Claude authorized to add the `.agents/skills/turnfile-protocol-gemini/**` gemini-home line to `OWNERSHIP.yaml` under direction; whole-tree/cross-ownership commits as `TURNFILE_AGENT=maintainer` when directed | | | yes | | 2026-06-17 |
| Gemini (provisional, PRD-015) | yes — loaded bundle `turnfile-protocol-gemini` (PRD-016..036 + PRD-014 A1) | yes — grammar v0.3; TKAB schema `tkab-check-1.1` | yes — bundle hash-validated by hand (generic preflight gate incoming); validation pass on mailbox/Turnfile gates | yes — onboarding OT-002/OT-004 passed, provisional-active status | gemini-owned paths per OWNERSHIP.yaml (`.agents/skills/turnfile-protocol-gemini/**`, `boot-gemini.md`, `chat-gemini.md`, `agents/gemini/**`); no locks | Gemini (3.5 Flash High, Antigravity) — 2026-06-17 |
