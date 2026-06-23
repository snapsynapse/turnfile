# Boot File - Codex (v15)

Read this first on Codex session start. It is the Codex handoff from session 25 closeout.

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
2. Run the Codex skills preflight early: `node tools/validate-skills-preflight.mjs --repo-turnfile-skill skills/codex/SKILL.md`.
3. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
4. A missing peer chat file is warning only. Do not author peer chat files from the Codex lane.
5. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`.
6. Run `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex` before assuming Codex can close cleanly.

## Protocol Essentials

- Conflict loop bound (PRD-021): `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); on bound exhaustion escalate directly to Maintainer adjudication. The selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- Out-of-band drift check (PRD-023): before trusting remembered state, reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG; unrecorded changes that altered governance state are decision-required (record/escalate before acting), while non-governance drift is a warning.
- Human-legibility (PRD-024): governance artifacts stay English-legible; any Tokenese/dense encoding pairs to a legible English source (source wins), and encoding-profile obligations never override the legible record.
- Chat-file semantics (PRD-017 R7): create only your own `chat-codex.md`; a missing peer chat file is warning only. Boot never authors a peer chat file.

## Session 25 Close State

Session 25 closed from the Codex side on 2026-06-21.

- Turnfile revision at Codex close: `345`.
- Codex status: `idle`; current task: `null`; last_seen: `codex-session-25-close`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: Codex app heartbeat `turnfile-codex-readonly-steward-s25` deleted before close; no Codex heartbeat carried forward.
- Boot rollover: v14 archived to `docs/archive/boot-codex/boot-codex_v14.md`; active boot is v15.
- Active mailbox carry-forward: `MSG-20260620-004` remains open and acknowledged. Closure owner is Claude. Current Codex context is contaminated for blind Tokenese scoring, so a valid Codex-family decode must run in a fresh independent Codex context using only the inline mailbox card.
- Active shared step after Codex close: Claude-owned `s25-tokenese-round2-harness`.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 25

1. Established session-25 handshakes with Claude Opus 4.8 and Gemini 3.5 Flash High.
2. Created and operated the Codex app heartbeat `turnfile-codex-readonly-steward-s25` at a 5-minute read-only cadence, then deleted it before close.
3. Implemented PRD-041 arbitration event schema at `schemas/prd-041/arbitration-event-v0.schema.json`.
4. Implemented `tools/aggregate-coordination.mjs --emit arbitration-json --rev <N>` over per-agent `arbitration.jsonl` shards.
5. Verified PRD-041 focused evals with `node --test evals/prd-041.evals.mjs` 9/9 PASS.
6. Observed Claude A1 step-7 APPROVE and Gemini peer-review APPROVE; PRD-041 implementation state is now `done`.
7. Acknowledged the Tokenese round-2 Codex decode blocker after accidentally reading evaluator-only harness material. The current context is non-scoring for blind decode.

## Carry Forward

1. If OQ#6 still requires a Codex-family receiver, run `MSG-20260620-004` in a fresh independent Codex context that has not opened `working-session/docs/tokenese-round2-receiver-harness.md`.
2. Decode only from the inline Blind Packet in `MSG-20260620-004`; write the output to `working-session/tokenese-pairs/tokenese-round2-codex-decode.json` or return it inline, then let Claude score and close.
3. PRD-041 is complete. Do not reopen its implementation unless a new counter appears in the mailbox or PRD_STATUS changes.
4. Perplexity remains external checker/tool contributor only. No Turnfile write, reviewer, PRD approval, or Maintainer authority exists for Perplexity.
5. Re-check `/Users/snap/Git/tokenese` state before asserting Tokenese spec status; the Tokenese repo has its own process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese state: observe fresh Tokenese repo state before asserting current version or spec status.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, run Codex skills preflight, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm active peer context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation.
5. Outstanding issues: fresh-context Codex Tokenese round-2 blind decode if still needed, Claude-owned Tokenese harness closure, Perplexity no-write boundary, dirty-worktree commit strategy, and deferred signal-log compaction.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex
node tools/validate-ownership-guard.mjs
node tools/validate-skills-preflight.mjs --repo-turnfile-skill skills/codex/SKILL.md
git diff --check
```

Run focused evals for the next implementation lane before relying on current implementation state.
