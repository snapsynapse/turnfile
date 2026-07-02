# Boot File — Gemini (v12)

Read this first on Gemini session start. It is the Gemini handoff from session 29 closeout.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest. This Gemini boot file holds Gemini-specific carry-forward and orientation notes.

1. `docs/BOOT_SEQUENCE.md`
2. `working-session/TURNFILE.yaml`
3. `working-session/WORKLOG.md` status block
4. `working-session/MAILBOX.md` inbox snapshot and any Gemini-assigned unread cards
5. `working-session/docs/PRD_STATUS.json`
6. `docs/llm/MODEL_LEDGER.md` and `.agents/skills/turnfile-protocol-gemini/SKILL.md`
7. `BASELINE.md`
8. `working-session/OPEN_QUESTIONS.md`
9. `working-session/chat-gemini.md` latest close snapshot
10. Scope-specific PRDs, evals, and protocol docs for the task at hand

Prefer `tools/session-orient.mjs` for a one-shot fresh-state read after the manual boot file read:

```bash
node tools/session-orient.mjs --agent gemini --emit json
```

## Boot Checks

1. Check `working-session/MAILBOX.md` first and action any Gemini unread message before asserting readiness.
2. Run the Gemini skills preflight early: `node tools/validate-skills-preflight.mjs --repo-skill-bundle .agents/skills/turnfile-protocol-gemini`.
3. Create or update only the own chat file `working-session/chat-gemini.md` when the current session needs a chat snapshot.
4. A missing peer chat file is warning only. Do not author peer chat files from the Gemini lane.
5. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`.
6. Run `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent gemini` before assuming Gemini can close cleanly.

## Protocol Essentials

- Conflict loop bound (PRD-021): `coordination.conflict.rebuttal_rounds` bounds the apply-or-counter rebuttal loop (min 1, max `unbounded`); on bound exhaustion escalate directly to Maintainer adjudication. The selective-unlock gradient is a binary `gated`/`unlockable` flag (agent self-tags, Maintainer ratifies).
- Out-of-band drift check (PRD-023): before trusting remembered state, reconcile any peer/Maintainer edits made outside the turn loop against the WORKLOG; unrecorded changes that altered governance state are decision-required (record/escalate before acting), while non-governance drift is a warning.
- Human-legibility (PRD-024): governance artifacts stay English-legible; any Tokenese/dense encoding pairs to a legible English source (source wins), and encoding-profile obligations never override the legible record.
- Chat-file semantics (PRD-017 R7): create only your own `chat-gemini.md`; a missing peer chat file is warning only. Boot never authors a peer chat file.

## Current State

Always query live files at boot. Do not treat this boot file as a source for current PRD status, mailbox state, release readiness, participant state, or carry-forward work.

```bash
node tools/session-orient.mjs --agent gemini --emit human
node tools/prd-status-summary.mjs
node tools/prd-status-summary.mjs --filter open
node tools/prd-status-summary.mjs --filter blocked
node tools/prd-status-summary.mjs --filter unratified
node tools/prd-status-summary.mjs --filter draft
node tools/prd-status-summary.mjs --filter promoted
node tools/prd-status-summary.mjs --filter archived
node tools/prd-status-summary.mjs --id PRD-NNN
node tools/prd-status-summary.mjs --gates v1
node tools/validate-v1-release.mjs --format json
```

Carry-forward from prior sessions lives in the top of `working-session/WORKLOG.md` and in any active cards in `working-session/MAILBOX.md`. Read those live artifacts instead of trusting session-specific text in this file.

Agent live state comes from `working-session/TURNFILE.yaml`:
- `agents.gemini.{status,current_task,last_seen,session_id}` for Gemini.
- `agents.<peer>.{status,current_task,last_seen,session_id}` for peer availability.
- `coordination.active_step`, `coordination.tasks`, `locks`, and `turn_queue` for current coordination.

PRD live state comes from `working-session/docs/PRD_STATUS.json` and the `tools/prd-status-summary.mjs` lookups above. Maintainer acceptance carries forward unless a PRD materially changes; do not turn later evidence gaps into repeat approval requests.

## First Actions On Resume

1. Run `node tools/session-orient.mjs --agent gemini --emit human`.
2. If Gemini has unread mailbox work, action it before asserting readiness.
3. Read the top of `working-session/WORKLOG.md` for carry-forward and recent changes.
4. Query PRD state with `node tools/prd-status-summary.mjs --filter open` and `node tools/prd-status-summary.mjs --gates v1`.
5. Check `working-session/TURNFILE.yaml` for live peer state, locks, task ownership, and active step.
6. Run ownership guard before edits: `node tools/validate-ownership-guard.mjs --format json`.
7. Use `tools/next-state.mjs` before shared-file edits.

## Gemini Boundaries

- Gemini may edit Gemini-owned files and shared governance artifacts when Maintainer direction or mailbox lifecycle authorizes the work.
- Do not edit Claude-owned or Codex-owned boot files, chat files, skill bundles, or agent shards from the Gemini lane without explicit Maintainer authorization.
- If `boot-claude.md` or `boot-codex.md` shows any stale-state pattern, route a recommendation to the respective peer or surface it to the Maintainer rather than editing it.
- Qwen remains whatever the live `TURNFILE.yaml`, `PRD_STATUS.json`, and WORKLOG say it is. Do not infer authority from old session snapshots in this file.
- Dirty worktree state is expected in this project. Inspect the relevant diff and avoid staging or overwriting peer-owned changes.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent gemini --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent gemini
node tools/validate-ownership-guard.mjs
node tools/validate-skills-preflight.mjs --repo-skill-bundle .agents/skills/turnfile-protocol-gemini
git diff --check
```

Run focused evals for the next implementation lane before relying on current implementation state.
