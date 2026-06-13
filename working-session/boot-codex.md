# Boot File — Codex (v5)

Read this first on Codex session start. It is a compact handoff from session 14 close.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

1. `working-session/TURNFILE.yaml`
2. `working-session/WORKLOG.md` status block
3. `working-session/MAILBOX.md` inbox snapshot and any Codex-assigned unread cards
4. `docs/llm/MODEL_LEDGER.md` and `skills/codex/MANIFEST.yaml`
5. `BASELINE.md`
6. `working-session/OPEN_QUESTIONS.md`
7. `working-session/chat-codex.md` latest close snapshot
8. Scope-specific PRDs, evals, and protocol docs for the task at hand

## Session 14 Close State

Session 14 closed on 2026-06-13 on branch `prd-021-conflict-loop-gradient`.

Codex mailbox state at close: unread `0`.

Locks at close: none expected.

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

## Completed In Session 14

1. PRD-021 through PRD-024, PRD-026, PRD-028, and PRD-029 were accepted/promoted or advanced as recorded in `PRD_STATUS.json`.
2. PRD-028 implementation is done: Tokenese pair validator plus PRD-024 Tokenese profile row.
3. PRD-029 implementation is done: `tools/next-state.mjs`, skill propagation, and evals green.
4. `docs/llm/MODEL_LEDGER.md` was created and boot-time model ledger validation was added to the Codex skill.
5. `skills/codex/` reached v7 with Files First, model ledger handshake, collaboration posture, encoding-profile obligations, and PRD-029 state derivation guidance.

## Carry Forward

1. PRD-014 Amendment A1 remains pending Codex apply-or-counter review from MSG-20260613-044.
2. MSG-20260613-046 remains a Claude-owned thread acknowledged by Codex; Codex accepted concurrent-write discipline and closure-owner scanning as future Codex skill hygiene.
3. `s14-impl-021-022-024` remains open for Codex implementation.
4. `s14-evals-023-026` remains open for Codex eval authoring.
5. `s14-prd024-validator-rule` remains pending and unassigned.
6. PRD-027 remains held until all non-PRD-027 PRD follow-through is complete, then commit, push, and Maintainer checkpoint discussion occur.
7. Final commit/push/checkpoint are Maintainer-gated.

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
node --test evals/prd-028.evals.mjs
node --test evals/prd-029.evals.mjs
```

## Closeout Lesson

Session 14 proved that file-derived state beats memory: unread counts, closure ownership, IDs, and task status must be derived from fresh files inside the transaction window.
