# Boot File - Codex (v13)

Read this first on Codex session start. It is the Codex handoff from session 23 closeout.

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
7. If a heartbeat is negotiated, create the actual app automation before claiming it is operational, and delete it at clean close.

## Protocol Essentials

- **Conflict loop bound (PRD-021):** `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); on bound exhaustion escalate directly to Maintainer adjudication. The selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- **Out-of-band drift check (PRD-023):** before trusting remembered state, reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG; unrecorded changes that altered **governance state** are **decision-required** (record/escalate before acting), while non-governance drift is a warning.
- **Human-legibility (PRD-024):** governance artifacts stay English-legible; any Tokenese/dense encoding pairs to a legible English source (source wins), and encoding-profile obligations never override the legible record.
- **Chat-file semantics (PRD-017 R7):** create only your own `chat-codex.md`; a missing peer chat file is a warning only — boot never authors a peer's chat file.

## Session 23 Close State

Session 23 closed from the Codex side on 2026-06-19 on `main`.

- Turnfile revision at Codex close: `312`.
- Codex status: `idle`; current task: `null`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: Codex app heartbeat `turnfile-codex-readonly-steward-s23` deleted at close; no Codex heartbeat carried forward.
- Boot rollover: v12 archived to `docs/archive/boot-codex/boot-codex_v12.md`; active boot is v13.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 23

1. Opened session 23 with Claude and Gemini and ran a 5-minute read-only Codex heartbeat steward until close.
2. Promoted and executed the constrained Perplexity onboarding path under PRD-039 without granting Perplexity write authority or reviewer/approval authority.
3. Recorded Perplexity evidence under `working-session/docs/onboarding/evidence/perplexity-computer/2026-06-18-01/`.
4. Captured Perplexity PROVISIONAL CHECKER evidence: OT-009/OT-010/OT-011 pass, OT-008 conditional-pass, and explicit no-write/no-authority boundaries.
5. Added `tools/validate-onboarding-evidence.mjs`, registered it in PRD-039 implementation metadata, and verified `evals/onboarding-execution.evals.mjs` 14/14 plus `evals/prd-039.evals.mjs` 16/16.
6. Processed Perplexity Tokenese checker outputs for W4 drift, calibration rules, and eight proposed fixture pairs. These remain evidence-only and non-authoritative.
7. Actioned Claude's PRD-041 pre-A1 infrastructure request with a feasibility read: use per-agent shards plus deterministic merge, adapter-graded transport, expanded live-turn event schema, and router-grade queue/lease semantics beyond today's manual `turn_queue`/`locks`.
8. Actioned Gemini's skills-preflight recommendation. The live boot file now includes the Codex skills preflight command; a future scoped skill-bundle update should mirror it into `skills/codex/SKILL.md` with changelog/manifest alignment.
9. Deleted the Codex app heartbeat at close.

## Carry Forward

1. PRD-041 remains proposed and incomplete. Wait for Gemini's runtime/OQ#1 answer before formal A1 routing or implementation.
2. If PRD-041 proceeds, start with schema and fixtures, deterministic projection from fixture logs, a fake-adapter router demo, then real CLI adapters behind receipt/dedup contracts.
3. Perplexity remains PROVISIONAL CHECKER / no-write. Any writer or full-active transition requires a later explicit Maintainer decision.
4. Claude remains closure owner for MSG-20260618-016 and PRD-039 step-7 review. Do not close that thread from Codex without Claude or Maintainer direction.
5. `s22-perplexity-onboarding-exec` is left as carry-forward infrastructure/evidence lane, not active Codex current_task.
6. The dirty worktree remains mixed ownership. Do not stage peer-owned `skills/claude/*`, `boot-claude.md`, or `chat-claude.md` from the Codex lane without explicit Maintainer direction.
7. New PRDs require Gemini acceptance evidence in `PRD_STATUS.json` unless the Maintainer explicitly creates an exception.

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
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, run Codex skills preflight, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm active peer context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation.
5. Outstanding issues: PRD-041 runtime/transport decision, PRD-039 step-7 review, Perplexity no-write boundary, and dirty-worktree commit strategy.

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
