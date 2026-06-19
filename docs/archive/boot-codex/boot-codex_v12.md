# Boot File - Codex (v12)

Read this first on Codex session start. It is the Codex handoff from session 22 closeout.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest. This Codex boot file holds Codex-specific carry-forward and orientation notes.

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
3. A missing peer chat file is warning only. Do not create peer chat files from the Codex lane.
4. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`.
5. Run `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex` before assuming Codex can close cleanly.
6. If a heartbeat is negotiated, create the actual app automation before claiming it is operational, and delete it at clean close.

## Session 22 Close State

Session 22 closed from the Codex side on 2026-06-18 on `main`.

- Turnfile revision at Codex close: `291`.
- Codex status: `idle`; current task: `null`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: Codex app heartbeat `turnfile-codex-readonly-steward` deleted at close; no Codex heartbeat carried forward.
- Boot rollover: v11 archived to `docs/archive/boot-codex/boot-codex_v11.md`; active boot is v12.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 22

1. Opened the session with Claude and Gemini, negotiated 5-minute self-owned read-only heartbeat steward behavior, and corrected the earlier heartbeat failure by creating the actual Codex app heartbeat.
2. Completed the Codex heartbeat lifecycle by deleting `turnfile-codex-readonly-steward` at close.
3. Finished PRD-037 follow-through: PRD-030 now records the default read-only heartbeat steward amendment, and `tools/handshake-sign.mjs` auto-creates a missing `s<N>-handshake-heartbeat` task.
4. Extended `evals/prd-037.evals.mjs`; focused PRD-037 evals passed 13/13.
5. Processed PRD-039 Perplexity onboarding intake: Codex accepted Claude's draft/eval contract, registered PRD-039 in `PRD_STATUS.json`, added OT-009/010/011 to the onboarding suite, and verified `evals/prd-039.evals.mjs` 16/16 green.
6. Closed Codex-owned mailbox cards and cleared the active-card owner review gate.
7. Resolved the practical Codex lane question: actual Perplexity onboarding execution should not begin until the PRD-039 peer/maintainer gates are clear.

## Carry Forward

1. Codex has no unread mailbox messages at close.
2. PRD-039 remains draft/in-review. Do not run actual Perplexity onboarding until Maintainer accepts PRD-039 and peer closeout disposition is clear.
3. `s22-perplexity-onboarding-exec` remains pending for Codex and depends on PRD-039 acceptance.
4. The dirty worktree remains mixed ownership. `skills/claude/*` are peer-owned and should not be staged or edited from the Codex lane without explicit Maintainer direction.
5. New PRDs require Gemini acceptance evidence in `PRD_STATUS.json` unless the Maintainer explicitly creates an exception.
6. If the next session continues the Perplexity lane, start by reading PRD-039, PRD-015, the onboarding suite, and the latest mailbox/PRD_STATUS entries.

## Tokenese Guardrails

1. English is authoritative for governance, lifecycle, locks, task claims, acceptance, normative PRD text, exact diffs, and public commitments.
2. Tokenese twins are bounded to approved operational/handoff contexts with English projection.
3. `ev:obs` requires verifiable backing in the same source context. It is not standalone authority.
4. `^N` remains untrusted unless a later calibration decision changes that.
5. Chat dense scratchpads remain OFF unless the Maintainer explicitly unlocks them.
6. Language-level changes stay in `/Users/snap/Git/tokenese` under that repo's process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese state: observe fresh Tokenese repo state before asserting current version.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm active peer context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation.
5. Outstanding issues: PRD-039 acceptance and Perplexity execution gate, pending peer-owned closeout disposition, and dirty-worktree commit strategy.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex
node tools/validate-ownership-guard.mjs
npm run -s validate:skills
git diff --check
```

Run focused evals for the next implementation lane before relying on current implementation state.
