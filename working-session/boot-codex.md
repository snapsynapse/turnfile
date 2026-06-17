# Boot File - Codex (v7)

Read this first on Codex session start. It is the Codex handoff from session 17 closeout.

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

1. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
2. A missing peer chat file is warning only. Do not create `working-session/chat-claude.md` or any other peer chat file from the Codex lane.
3. Run an out-of-band drift check before relying on stale session state. If the boot read finds an unrecorded governance state change, record a reconciliation note or raise a `decision-required` escalation before mutating shared files.
4. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`; expected shared hook path is `tools/hooks`.

## Session 17 Close State

Session 17 closed from the Codex side on 2026-06-17 on `main`.

Codex mailbox state at close: unread `0`; Claude unread `0`; Maintainer unread `0`.

Locks at close: none.

Heartbeat state: no active Codex app automations found under `/Users/snap/.codex/automations`; none carried forward.

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

## Completed In Session 17

1. PRD-033 Skill Ownership Integrity Guard implementation completed end to end. Shared Layer 2 guard is active with `core.hooksPath=tools/hooks`; Codex Layer 1 adapter exists at `working-session/agents/codex/layer1-pretool-ownership-guard.mjs`.
2. PRD-032 Session Orientation Tool implementation completed end to end. `tools/session-orient.mjs` is read-only, composes `next-state.mjs` and `validate-closeout.mjs`, uses canonical relative defaults, and `evals/prd-032.evals.mjs` passes 11/11.
3. Tokenese Tier-A completed and was acknowledged by Claude: W1/L1/W2/W3/W4/W5 and L2/L3 are fully scored. W4 is the first v0.3 structured code-review finding win on both tokenizers.
4. PRD-032 and PRD-033 were promoted to `docs/prds/` at rev 207.
5. Deferred closeout signal-log compaction was completed by Claude at rev 199. No additional signal-log compaction was eligible at Codex close.
6. `MAILBOX.json` was regenerated and closeout validation was clean at Codex close.

## Carry Forward

1. PRD-032 and PRD-033 documents are Maintainer-accepted, implementation-done, and promoted to `docs/prds/`.
2. Tokenese remains pilot-only. The next planned scope is expanded Tokenese work as appropriate, starting with `tk-calibration-audit` before any trust in `^N` or `ev:` channels.
3. Recommended next Tokenese expansion path:
   - run `tk-calibration-audit` using W4 plus prior E1/W1 evidence to test whether `ev:obs` and any `^N` ranks correlate with verification;
   - decide whether to authorize a limited Tier-B twin lane for operational status and handoff clones only;
   - keep `chat-<agent>.md` dense scratchpads OFF unless the Maintainer explicitly unlocks them;
   - keep normative PRD text, lifecycle state, locks, task claims, acceptance, and exact diffs out of Tokenese clones;
   - keep all language-level changes in `/Users/snap/Git/tokenese` under that repo's process, not Turnfile.
4. `tk-calibration-audit` remains the gate before any Turnfile decision may weight `^N` or `ev:` from a clone.
5. The worktree remains dirty with shared, Codex-owned, Claude-owned, and Tokenese-pair artifacts. Do not stage or commit peer-owned files from the Codex lane.
6. Final commit/push/checkpoint remain Maintainer-gated.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese version: grammar v0.3 with checker/toolchain v0.3.2 tagged per data point; keep v0.2 W1/L1 separately tagged and do not pool compression ratios across versions.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm Claude/Codex context before write work.
4. Session completion criteria and scope: planned next scope is Tokenese expansion, bounded first to calibration and a Maintainer decision on any Tier-B lane.
5. Outstanding issues/questions: Tokenese calibration/Tier-B decision, chat scratchpad OFF, dirty-worktree commit strategy, and Claude-owned session closeout/boot rollover if not already complete.

Additional Codex recommendation: make guard identity, `core.hooksPath`, dirty peer-owned paths, and active Tokenese scope first-class handshake fields. These were the two places session 16/17 exposed the most avoidable risk.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
npm run -s validate:skills
node tools/validate-tokenese-pairs.mjs --root .
git diff --check
```

Run focused evals before relying on current implementation state:

```bash
node --test evals/prd-032.evals.mjs evals/prd-033.evals.mjs
node --test evals/prd-017.evals.mjs evals/prd-023.evals.mjs evals/prd-026.evals.mjs
node --test evals/prd-028.evals.mjs evals/prd-029.evals.mjs
```

## Closeout Lesson

Session 17 reinforced that orientation tools are useful only when they compose canonical derivations rather than duplicating them. The default-path false-stale bug was caught because Codex added an eval comparing `session-orient` to `validate-closeout`.
