# Boot File - Codex (v8)

Read this first on Codex session start. It is the Codex handoff from session 18 closeout.

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

## Session 18 Close State

Session 18 closed from the Codex side on 2026-06-17 on `main`.

- Turnfile revision at Codex closeout prep: `217`.
- Codex status: `idle`; Claude status: `idle`.
- Mailbox state at closeout prep: Codex unread `0`; Claude unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: no Codex heartbeat carried forward.
- Boot rollover: v7 archived to `docs/archive/boot-codex/boot-codex_v7.md`; active boot is v8.

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

## Completed In Session 18

1. Codex authored RED eval suites for PRD-034, PRD-035, and PRD-036, with PRD_STATUS registering Codex as eval author, Claude as expected implementer, and Codex as reviewer.
2. Claude reviewed PRD-034, PRD-035, and PRD-036 as APPLY-with-counters. Codex has acknowledged the reviews, but full counter reconciliation remains next-session work unless the Maintainer redirects.
3. Claude observed the Tokenese increment read-only: package moved from the Codex draft-time baseline v0.3.2 to v0.3.7; grammar remained v0.3 and TKAB schema remained `tkab-check-1.1`.
4. Claude completed `working-session/docs/tk-calibration-audit.md`; Codex actioned MSG-20260617-034 and confirmed the verdict. `ev:obs` is conditional only with verifiable backing; `^N` remains untrusted; `plain` abstention passed.
5. Codex proposed the next-session scope to Claude: Gemini provisional onboarding led by Claude, bounded Tier-B Tokenese only if the Maintainer authorizes it, and PRD-036 then PRD-035 then PRD-034 as the likely implementation order.
6. The stale `tk-ab-run` task row was reconciled to done because the Tier-A result artifacts and calibration dependency were already complete.

## Carry Forward

1. At next boot, confirm mailbox state, run `tools/session-orient.mjs`, run ownership/closeout validators, and sign or update the next-session handshake before writes.
2. Maintainer decision needed: authorize or decline a bounded Tier-B operational/handoff Tokenese twin lane. English source text must remain authoritative either way.
3. Maintainer decision needed: accept, defer, or amend PRD-034, PRD-035, and PRD-036 after Claude counters are reconciled.
4. Recommended PRD order if broad eval advancement is desired: PRD-036 first, then PRD-035, then PRD-034 or PRD-034 in parallel only after result-counter semantics are settled.
5. Gemini onboarding is plausible under PRD-015 as a provisional third participant, with Claude primary and Codex cross-review. Suggested evidence order: OT-008 first, then OT-002, then OT-004. Keep Gemini in docs/review/evidence lanes until its onboarding evidence is clean.
6. Perplexity should remain a scorer/evaluator/tool contributor for now, not an active Turnfile participant.
7. Dirty worktree remains uncommitted. Do not stage or commit peer-owned files from the Codex lane without Maintainer direction.

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
4. Session completion criteria and scope: pick one bounded primary lane before implementation. Current recommendation is Gemini provisional onboarding plus PRD-036/035/034 advancement, with Tokenese adoption limited to the prudent Tier-B decision.
5. Outstanding issues/questions: PRD-034/035/036 counters, Tier-B Tokenese authorization, Gemini onboarding evidence, dirty-worktree commit strategy, and any Claude closeout additions after this file was written.

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

The calibration audit did not make self-report authoritative. It only bounded where Tokenese can expand safely: source-paired operational and handoff twins, with English source text winning every conflict.
