# Boot File — Codex (v6)

Read this first on Codex session start. It is a compact handoff from session 16 closeout prep.

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

## Boot Checks

1. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
2. A missing peer chat file is warning only. Do not create `working-session/chat-claude.md` or any other peer chat file from the Codex lane.
3. Run an out-of-band drift check before relying on stale session state. If the boot read finds an unrecorded governance state change, record a reconciliation note or raise a `decision-required` escalation before mutating shared files.

## Session 16 Closeout Prep State

Session 16 closeout prep recorded on 2026-06-17 on `main`.

Codex mailbox state at closeout prep: unread `0`; Claude unread `0`; Maintainer unread `0`.

Locks at closeout prep: none.

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

## Completed In Session 14

1. PRD-021 through PRD-024, PRD-026, PRD-028, and PRD-029 were accepted/promoted or advanced as recorded in `PRD_STATUS.json`.
2. PRD-028 implementation is done: Tokenese pair validator plus PRD-024 Tokenese profile row.
3. PRD-029 implementation is done: `tools/next-state.mjs`, skill propagation, and evals green.
4. `docs/llm/MODEL_LEDGER.md` was created and boot-time model ledger validation was added to the Codex skill.
5. `skills/codex/` reached v7 with Files First, model ledger handshake, collaboration posture, encoding-profile obligations, and PRD-029 state derivation guidance.

## Carry Forward

1. PRD-032 Session Orientation Tool Contract is agent-reviewed and awaits Maintainer acceptance before A1 implementation.
2. PRD-033 Skill Ownership Integrity Guard is agent-reviewed and awaits Maintainer acceptance/counter. Codex counters are in MSG-20260617-018 and WORKLOG.
3. PRD-017/023/026 implementation is done at rev 189; focused evals pass 15/15.
4. MSG-20260617-019 is actioned as next-session Tokenese scope input. Tokenese remains pilot-only. W1/L1/W2/W5 are fully scored; W3/L2 are authored and conformant but need verified o200k token scoring; W4/L3 are not authored; `tk-calibration-audit` is pending; chat dense scratchpads are OFF unless explicitly enabled by the Maintainer.
5. The temporary Codex pre-commit hook at `working-session/agents/codex/hooks/pre-commit` fails closed if `TURNFILE_AGENT` is unset. It is a stopgap, not the accepted PRD-033 shared guard.
6. The worktree contains substantial uncommitted shared, Codex-owned, Claude-owned, and Tokenese artifacts. Do not stage or commit peer-owned files from the Codex lane.
7. Final commit/push/checkpoint remain Maintainer-gated.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese version: v0.3 for measurement-only pilot work; keep v0.2 W1/L1 as separately tagged historical data and do not pool compression ratios across versions.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm Claude/Codex context before write work.
4. Session completion criteria and scope: explicitly choose the bounded goal, such as PRD-032, PRD-033, Tokenese W3/L2 scoring plus W4/L3 authoring, or closeout/commit hygiene.
5. Outstanding issues/questions: PRD-032/033 Maintainer acceptance, PRD-033 guard mechanism and `core.hooksPath`, W3/L2 token scoring, W4/L3 pending, `tk-calibration-audit`, chat scratchpad OFF, and dirty-worktree commit strategy.

Additional Codex recommendation: make guard identity, `core.hooksPath`, dirty peer-owned paths, and active Tokenese scope first-class handshake fields. These are the two places session 16 exposed the most avoidable risk.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-skills-preflight.mjs
node tools/validate-tokenese-pairs.mjs --root .
git diff --check
```

Run focused PRD evals before relying on the current implementation state:

```bash
node --test evals/prd-017.evals.mjs evals/prd-023.evals.mjs evals/prd-026.evals.mjs
node --test evals/prd-028.evals.mjs evals/prd-029.evals.mjs
```

## Closeout Lesson

Session 16 reinforced that file-derived state beats memory and that ownership boundaries need executable enforcement. At next boot, derive unread counts, closure ownership, IDs, task status, guard identity, and Tokenese scope from files inside the transaction window.
