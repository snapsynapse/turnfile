# Boot File - Codex (v9)

Read this first on Codex session start. It is the Codex handoff from session 19 closeout.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest. This Codex boot file holds Codex-specific carry-forward and orientation notes; the manifest holds the ordered shared boot contract.

1. `docs/BOOT_SEQUENCE.md`
2. `working-session/TURNFILE.yaml`
3. `working-session/WORKLOG.md` status block
4. `working-session/MAILBOX.md` inbox snapshot and any Codex-assigned unread cards
5. `working-session/docs/PRD_STATUS.json`
6. `docs/llm/MODEL_LEDGER.md` and `skills/codex/MANIFEST.yaml`
7. `BASELINE.md`
8. `working-session/OPEN_QUESTIONS.md`
9. `working-session/chat-codex.md` latest close snapshot
10. Scope-specific PRDs, evals, and protocol docs for the task at hand

Prefer `tools/session-orient.mjs` for a one-shot fresh-state read after the manual boot file read:

```bash
node tools/session-orient.mjs --agent codex --emit json
```

## Boot Checks

1. Check `working-session/MAILBOX.md` first and action any Codex unread message before asserting readiness.
2. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
3. A missing peer chat file is warning only. Do not create `working-session/chat-claude.md` or any other peer chat file from the Codex lane.
4. Run an out-of-band drift check before relying on stale session state. If the boot read finds an unrecorded governance state change, record a reconciliation note or raise a `decision-required` escalation before mutating shared files.
5. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`; expected shared hook path is `tools/hooks`.

## Session 19 Close State

Session 19 closed from the Codex side on 2026-06-17 on `main`.

- Turnfile revision after Maintainer acceptance sync: `229`.
- Codex status: `idle`; Claude status: `active` / holding for Maintainer close direction on `s19-gemini-onboarding`.
- Mailbox state at closeout prep: Codex unread `0`; Claude unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: no Codex heartbeat carried forward.
- Boot rollover: v8 archived to `docs/archive/boot-codex/boot-codex_v8.md`; active boot is v9.

Immediate rule: re-read live files before asserting shared state. Claude, Codex, and the Maintainer may have changed coordination files between sessions.

## Current Protocol Anchors

1. Promoted PRDs live in `docs/prds/`.
2. Draft, held, deferred, and registry artifacts live in `working-session/docs/`.
3. `working-session/docs/PRD_STATUS.json` is the PRD shelf/status source of truth.
4. Role-keyed skill bundles are canonical session defaults: `skills/codex/` and `skills/claude/`.
5. Model-specific skill paths are compatibility artifacts, not deprecated unless the Maintainer explicitly says so.
6. English governance artifacts remain authoritative. Tokenese work must remain paired, synchronized, and Maintainer-legible.
7. Peer agents may request, propose, accept, counter, acknowledge, block, or decline. They may not order each other or the Maintainer.
8. Agents may read peer-owned files but may write only their own files and shared governance artifacts under protocol.
9. Conflict rebuttal depth is configurable through `coordination.conflict.rebuttal_rounds`; finite exhaustion routes to Maintainer adjudication, and unbounded convergence uses fresh `NO-NEW-OBJECTION` markers.
10. PRD-018 carries the selective-unlock gradient: Band A is `unlockable` by default, Bands B/C are `gated`; `unlockable` is only eligibility until explicit Maintainer unlock.

## Completed In Session 19

1. Codex converged the session-19 handshake, signed the session-19 row, and actioned MSG-20260617-035.
2. Codex applied Claude's PRD-036 counters C1-C2 into the draft, eval contract, and PRD_STATUS: Node wrapper canonical, CI runs `validate` and `evals:prd` separately, and `tools/run-evals.mjs` must carry non-self-referential wrapper regression coverage.
3. Codex cross-reviewed Gemini/Antigravity onboarding evidence in MSG-20260617-036. Codex applied F1/F2/F3 severities, agreed to defer provisional transition until live Antigravity validation, and routed detailed Antigravity refit to Gemini OT-007 once live.
4. Codex applied Claude's PRD-035 counters C1-C4 into the draft, eval contract, and PRD_STATUS: derived result package, single calibration source, PRD-034 public-claim boundary, and separate TKAB JSON validator.
5. Codex applied Claude's PRD-034 counters C1-C4 into the draft, eval contract, and PRD_STATUS: PRD_STATUS-only promoted-list source, machine-readable freshness markers, generated-surface build discipline, and PRD-035 Tokenese/GuideCheck boundary.
6. Claude completed the session-19 evaluator-prep and live-mechanism portion for Gemini/Antigravity. Rev 230 live findings: `GEMINI.md` auto-loads as a rule, `@import` is inert, `.agents/skills/` is the skill discovery path, and the live model observed was Gemini 3.5 Flash (High).
7. Codex promoted PRD-034, PRD-035, and PRD-036 to `docs/prds` at rev 231 after Maintainer acceptance and notified Claude via MSG-20260617-037 for promotion-specific agreement.

## Carry Forward

1. At next boot, confirm mailbox state, run `tools/session-orient.mjs`, run ownership/closeout validators, and sign or update the next-session handshake before writes.
2. PRD-034, PRD-035, and PRD-036 are Maintainer-accepted after Codex/Claude counter reconciliation and promoted to `docs/prds`. Implementation lanes are open but not started.
3. Likely implementation order remains PRD-036 first if the aggregate PRD eval runner blocks broad validation, then PRD-035, then PRD-034.
4. Antigravity/Gemini onboarding remains execution work: Gemini self-remediates in OT-007 by porting the bundle to `.agents/skills/turnfile-protocol-gemini/`, reducing `GEMINI.md` to a thin pointer rule, then running live-load and behavioral OT-002/OT-004 from an `antigravity/` evidence path. Preserve `gemini-cli/2026-06-17-01/` as historical evaluator-prep evidence.
5. Bounded Tier-B Tokenese operational/handoff twins are authorized by Maintainer, but English source text remains authoritative; governance state remains English-only.
6. Perplexity should remain a scorer/evaluator/tool contributor for now, not an active Turnfile participant.
7. Dirty worktree remains uncommitted and includes Claude-owned/evaluator-prep changes. Do not stage or commit peer-owned files from the Codex lane without Maintainer direction.

## Tokenese Guardrails

1. English is authoritative for governance, lifecycle, locks, task claims, acceptance, normative PRD text, exact diffs, and public commitments.
2. Tokenese twins may be considered only for bounded operational status and handoff summaries after Maintainer approval.
3. `ev:obs` is useful only when paired with verifiable backing in the same source context. It is not standalone authority.
4. `^N` is not calibrated and must not be weighted in decisions.
5. Chat dense scratchpads remain OFF unless the Maintainer explicitly unlocks them.
6. Language-level changes stay in `/Users/snap/Git/tokenese` under that repo's process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese version: grammar v0.3, toolchain observed at v0.3.7 during session 18, and TKAB schema `tkab-check-1.1`; tag checker/toolchain per data point.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm Claude/Codex context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation. Current recommendation is one accepted PRD implementation lane or live Antigravity remediation, not both unless the Maintainer explicitly broadens scope.
5. Outstanding issues/questions: Claude ack/counter on MSG-20260617-037, Gemini OT-007 self-remediation, PRD-034/035/036 implementation ordering, dirty-worktree commit strategy, and any Claude closeout additions after this file was written.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md
node tools/validate-ownership-guard.mjs
npm run -s validate:skills
git diff --check
```

Run focused evals before relying on current implementation state:

```bash
node --test evals/prd-034.evals.mjs evals/prd-035.evals.mjs evals/prd-036.evals.mjs
```

## Closeout Lesson

Counter reconciliation is not implementation. PRD-034/035/036 are now aligned between Codex and Claude, but the validators, public-surface repairs, TKAB package, and eval-runner code stay blocked until Maintainer acceptance.
