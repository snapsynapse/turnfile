# Boot Sequence — Canonical Boot Command Manifest (PRD-017)

The canonical, runtime-neutral boot command manifest for Turnfile agents. Each agent's
boot file (`working-session/boot-<agent>.md`) and skill bundle reference this manifest;
the per-agent boot files hold orientation prose and carry-forward, while this file holds
the ordered command + read-order contract that is identical across agents.

This is a documented command contract with optional helper scripts (OQ-051), not a
mandatory script. The optional helper `tools/validate-boot-sequence.mjs` checks the
control-plane preconditions below.

## Registered agents

Three agents are registered in the PRD-033 ownership map: `claude` (Anthropic, Claude Code), `codex` (OpenAI GPT-5, Codex desktop), and `gemini` (Google, runtime Google Antigravity; live model Gemini 3.5 Flash (High)). Gemini is PRD-015 provisional (bounded scope, peer-reviewed until promoted); its skill bundle lives at `.agents/skills/turnfile-protocol-gemini/` (Antigravity skill-discovery home, Path B) rather than `skills/gemini/`, and `boot-gemini.md` follows the same read order below. `--agent <agent>` accepts any registered agent; with three agents, "peer" means every other registered agent (see Chat-file semantics).

## Phase 1 — Orientation read order (PRD-011 R3 + PRD-013 R5.1)

Read in this order; reason from the files, not memory (Files First, PRD-030 R9):

1. `working-session/boot-<agent>.md` — orientation, layout, current-state carry-forward.
2. `working-session/TURNFILE.yaml` — coordination state: revision, phase, tasks, locks, agent status, signals.
3. `working-session/WORKLOG.md` — status block (top) + Decision Index.
4. `working-session/MAILBOX.md` — inbox snapshot + your unread/own-action cards.
5. `working-session/docs/PRD_STATUS.json` — PRD registry (source of truth for PRD/acceptance/implementation state).
6. `working-session/OPEN_QUESTIONS.md` — active + deferred questions.
7. Relevant PRDs / task rows for the work at hand.

## Phase 2 — Verification commands (read-only)

Run these to confirm the control plane is consistent before substantive work:

1. `git status` — branch, dirty paths, peer-owned uncommitted changes (do not touch peer changes).
2. `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
3. `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
4. `node tools/validate-prd-promotion.mjs`
5. `npm run -s validate:skills` — skill bundle preflight (frontmatter + manifest hashes).
6. Optional: `node tools/validate-boot-sequence.mjs --root . --agent <agent> --format json` — control-plane precondition check.

## Phase 3 — Pre-write derivation (inside the write window)

Before any shared-file write, derive IDs/counts/revision from files, never memory:

1. `node tools/next-state.mjs --mailbox working-session/MAILBOX.md --turnfile working-session/TURNFILE.yaml`
2. After mailbox edits: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`

## Stop / continue / escalate

- STOP and do not mutate shared files if a required control-plane file
  (`TURNFILE.yaml`, `MAILBOX.md`, `WORKLOG.md`) is missing or a startup gate fails.
- CONTINUE to substantive work once Phase 1–2 pass and your unread count is known.
- ESCALATE to the Maintainer (do not nudge the peer) when a gate fails and cannot be
  resolved in-turn, when ownership is ambiguous, or when a validator reports drift you
  cannot reconcile.

## Chat-file semantics (PRD-017 R7)

- Boot creates only your OWN chat file (`chat-<agent>.md`) if absent.
- Missing PEER chat files (any other registered agent's `chat-<peer>.md`) are warnings only; boot never creates a peer chat file. With three registered agents, each agent has two peers.

## Cold start

If `working-session/TURNFILE.yaml` does not exist, follow the cold-start bootstrap in
your boot file (copy `templates/working-session/`, fill placeholders, run startup gates)
before this sequence applies.
