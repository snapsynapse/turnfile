# Boot File - Codex (v14)

Read this first on Codex session start. It is the Codex handoff from session 24 closeout.

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

- **Conflict loop bound (PRD-021):** `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); on bound exhaustion escalate directly to Maintainer adjudication. The selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- **Out-of-band drift check (PRD-023):** before trusting remembered state, reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG; unrecorded changes that altered **governance state** are **decision-required** (record/escalate before acting), while non-governance drift is a warning.
- **Human-legibility (PRD-024):** governance artifacts stay English-legible; any Tokenese/dense encoding pairs to a legible English source (source wins), and encoding-profile obligations never override the legible record.
- **Chat-file semantics (PRD-017 R7):** create only your own `chat-codex.md`; a missing peer chat file is a warning only — boot never authors a peer's chat file.

## Session 24 Close State

Session 24 closed from the Codex side on 2026-06-19 on `main`.

- Turnfile revision at Codex close: `336`.
- Codex status: `idle`; current task: `null`; last_seen: `codex-session-24-close`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: Codex app heartbeat `turnfile-codex-readonly-steward-s24` deleted before close; no Codex heartbeat carried forward.
- Boot rollover: v13 archived to `docs/archive/boot-codex/boot-codex_v13.md`; active boot is v14.
- Active mailbox carry-forward: `MSG-20260618-028` remains open and acknowledged. Closure owner is Claude. Codex owns the next implementation action.
- Closeout compaction: signal-log compaction is eligible but explicitly deferred because the worktree contains active peer-owned closeout files. Next closeout or Maintainer-directed compaction can handle it.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 24

1. Established session-24 handshakes with Claude Opus 4.8 and Gemini 3.5 Flash High.
2. Created and ran the Codex app heartbeat `turnfile-codex-readonly-steward-s24` at a 5-minute read-only cadence, updated it to use the PRD-040 loop prompt validator, and deleted it before close.
3. Implemented PRD-040 Heartbeat Loop Prompt Contract in `tools/validate-heartbeat-loop.mjs`.
4. Verified PRD-040 with focused evals 6/6, `node tools/run-evals.mjs` 27/27, `npm run -s validate` PASS, and Claude A1 step-7 APPROVE in `MSG-20260618-025`.
5. Promoted PRD-041 to `docs/prds` and reconciled public/agent promoted-count surfaces to 38.
6. Completed the PRD-041 R4 arbitration-primitive schema spike in `working-session/docs/r4-arbitration-primitive-schema-spike-prd-041.md`.
7. Routed the PRD-041 R4 spike to Claude; Claude authored `evals/prd-041.evals.mjs` as 9/9 intentionally RED and routed `MSG-20260618-028` back to Codex.
8. Acknowledged `MSG-20260618-028` as the PRD-041 step-6 implementation handoff. Implementation was not started during closeout.
9. Read the Tokenese second-level testing handoff, ran the compression eval, recorded Codex notes, and routed Tokenese testing/revision to Gemini.
10. Completed `tk-spec-v02-draft` in `/Users/snap/Git/tokenese/spec.md` under the cross-repo boundary after Maintainer approval.
11. Added `working-session/docs/HANDOFF-2026-06-19-tokenese-precision-pivot-perplexity-build.md` as a Tokenese repo build handoff for Perplexity Computer, preserving Perplexity's external checker/tool-contributor boundary.

## Carry Forward

1. PRD-041 implementation is the primary Codex-ready lane: add `schemas/prd-041/arbitration-event-v0.schema.json` and implement `node tools/aggregate-coordination.mjs --emit arbitration-json --rev <N>` over per-agent `arbitration.jsonl` shards until `evals/prd-041.evals.mjs` goes green.
2. After PRD-041 is green, route back to Claude or Gemini for A1 step-7 review. Claude remains closure owner for `MSG-20260618-028`.
3. Optional Tokenese receiver round 2 remains open: Codex and Gemini receiver decodes could help satisfy the PRD-041/Tokenese two-family bar before any broader Tokenese adoption claim.
4. Perplexity remains external checker/tool contributor only. No Turnfile write, reviewer, PRD approval, or Maintainer authority exists for Perplexity.
5. The dirty worktree remains mixed ownership. Do not stage peer-owned `working-session/boot-claude.md`, `working-session/chat-claude.md`, or Claude-owned closeout artifacts from the Codex lane without explicit Maintainer direction.
6. Re-check `/Users/snap/Git/tokenese` state before asserting Tokenese spec status; the Tokenese repo has its own dirty state and process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese state: observe fresh Tokenese repo state before asserting current version or spec status.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, run Codex skills preflight, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm active peer context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation.
5. Outstanding issues: PRD-041 reducer/schema implementation, optional Tokenese receiver round 2, Perplexity no-write boundary, dirty-worktree commit strategy, and deferred signal-log compaction.

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
