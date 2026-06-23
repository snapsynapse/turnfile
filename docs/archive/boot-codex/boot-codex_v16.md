# Boot File - Codex (v16)

Read this first on Codex session start. It is the Codex handoff from session 26 closeout.

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

## Session 26 Close State

Session 26 closed from the Codex side on 2026-06-22.

- Turnfile revision at Codex close: `364`.
- Codex status: `idle`; current task: `null`; last_seen: `codex-session-26-close`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: Codex app heartbeat `turnfile-codex-readonly-steward-s26` deleted before close; no Codex heartbeat carried forward.
- Boot rollover: v15 archived to `docs/archive/boot-codex/boot-codex_v15.md`; active boot is v16.
- Active shared step after Codex close: `await-maintainer-next-session-scope`.
- Active mailbox carry-forward: no Codex-unread cards. `MSG-20260622-006` remains open/actioned with Claude as closure owner; Codex has actioned its side. Claude marked `s25-tokenese-round2-harness` done and closed `MSG-20260620-004` in TURNFILE at rev 363.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 26

1. Established session-26 handshakes with Claude Opus 4.8 and Gemini 3.5 Flash High.
2. Created and operated the Codex app heartbeat `turnfile-codex-readonly-steward-s26` at a 5-minute read-only cadence, then deleted it before close.
3. Implemented PRD-038 follow-through after registry drift showed the expected eval file was missing.
4. Added `evals/prd-038.evals.mjs` and verified it with `node --test evals/prd-038.evals.mjs` 8/8 PASS.
5. Updated `tools/handshake-sign.mjs` so generated heartbeat rows distinguish read-only steward mode from explicit write-capable heartbeat scope, and later derived PRD count from `PRD_STATUS.json`.
6. Received Claude A1 step-7 APPROVE on PRD-038 and filed PRD-038 implementation `done`.
7. Recorded Maintainer-relayed fresh-thread Codex round-2 Tokenese decode at `working-session/tokenese-pairs/tokenese-round2-codex-decode.json` with provenance caveat.
8. Routed the Codex-family round-2 decode to Gemini; Gemini scored it PASS on all 9 dimensions and later closed its session after syncing the ratified Tokenese precision-pivot spec direction to `/Users/snap/Git/tokenese`.
9. Actioned Claude's status-lag reconciliation card by flipping PRD-040 implementation state to `done` while holding PRD-039, PRD-018, PRD-019, and PRD-031.
10. Regenerated `MAILBOX.json` and left Codex unread 0.

## Carry Forward

1. Claude marked `s25-tokenese-round2-harness` done at rev 363; re-check mailbox/TURNFILE on boot because `MAILBOX.md` may lag that closure.
2. `MSG-20260622-006` remains actioned with Claude as closure owner.
3. PRD-039 remains `eval-verified` pending Gemini reviewer confirmation or Maintainer direction. Do not flip it from Codex without that evidence.
4. PRD-018 and PRD-019 remain pending and Maintainer-gated for any done/grandfathered-done flip.
5. PRD-031 remains pending for Phase 2/3 mechanics; it is real future infrastructure work, not a status-lag cleanup.
6. Perplexity remains external PROVISIONAL CHECKER / no-write. Any writer or full-active transition requires explicit Maintainer decision.
7. Re-check `/Users/snap/Git/tokenese` before asserting current Tokenese repo status; Gemini changed it during session 26.
8. Dirty worktree remains mixed ownership. Do not stage or commit peer-owned Gemini files from the Codex lane without Maintainer direction.

## Next Session Plan

1. Boot from fresh files with `docs/BOOT_SEQUENCE.md` and `tools/session-orient.mjs --agent codex --emit json`.
2. If Codex has unread cards, clear those first.
3. Confirm whether Claude has closed the Tokenese harness and whether PRD-039 reviewer evidence has landed.
4. If no mailbox work is waiting, ask the Maintainer to choose between PRD-031 Phase 2/3 design, PRD-034/035 follow-through, or any new Tokenese/Turnfile integration lane.
5. Keep closeout validation strict: mailbox projection fresh, PRD promotion passing, Turnfile lint passing, and owner-scoped active-card review clean.

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
