# PRD-048: Portable Turnfile CLI

Status: Draft
Owner: Claude (author + eval author) + Codex (implementer) + Maintainer (approval)
Reviewer: Claude (PRD-006 step 7)
Date: 2026-06-23
Parent gate: PRD-043 R9 (v1.0.0 release)
Sibling: PRD-046 (Repo Minimization), PRD-047 (Cross-Repo v1 Validation Tests)

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | Codex apply-or-counter requested via MSG-20260623-024 |
| Claude acceptance | accepted | Claude authored this draft + RED evals at Maintainer direction |
| Maintainer acceptance | pending | Required before promotion |
| Eligible for move to `docs/prds` | no | Draft remains in `working-session/docs/` until review, implementation, and acceptance complete |

## A1 ownership (Maintainer-directed exception)

Per Maintainer direction 2026-06-23 ("define these scripts now in terms of PRD and evals, and hand them off to Codex to deliver"), this PRD inverts the PRD-046 A1 split: Claude authors PRD + RED evals, Codex implements, Claude reviews per A1 step 7. This is consistent with PRD-006 norm "never self-implement a PRD whose evals you authored" — Codex implements what Claude specified.

## Problem

Today a fresh adopter cannot run a Turnfile session in another repo with a single command. The deterministic pieces exist but are scattered:

- Handshake: `tools/handshake-sign.mjs` (direct flag mode landed in PRD-044)
- Mailbox inspection: `tools/session-orient.mjs` + `tools/export-mailbox-json.mjs` + `tools/validate-mailbox-invariants.mjs`
- Heartbeat: `tools/validate-heartbeat-loop.mjs` is a read-only check, but no portable start/stop entry point — each runtime spawns its own cron via its own mechanism
- Close: validators exist (`tools/validate-closeout.mjs`, `tools/turnfile-lint.mjs`, `tools/validate-prd-promotion.mjs`, `tools/validate-v1-release.mjs`) but no orchestration script that performs the active-card sweep + WORKLOG status block update + TURNFILE idle flip + MAILBOX.json regen + boot archive rotation in a single call

Without a unified entry point, the Tokenese + PAICE2 dogfood tests (PRD-047) and any future external adopter would have to read the skill bundle and hand-orchestrate the close protocol from a checklist. The v1.0.0 portability promise is incomplete until a participant can run `node tools/turnfile.mjs <verb>` and have the protocol execute deterministically.

## Goal

Ship a single CLI entry point `tools/turnfile.mjs` exposing five verbs that wrap (or, where needed, implement) the deterministic protocol surface:

```
node tools/turnfile.mjs init       Scaffold working-session/ from templates/v1-minimal/
node tools/turnfile.mjs open       Open a session (wraps handshake-sign.mjs direct flag mode)
node tools/turnfile.mjs status     Inspect coordination + mailbox state (wraps session-orient.mjs)
node tools/turnfile.mjs heartbeat  Manage the read-only steward lifecycle (write / stop sentinel)
node tools/turnfile.mjs close      Orchestrate close protocol (validators + archive + status updates)
```

All five verbs MUST be runtime-agnostic (no dependency on a specific scheduler, runtime, or MCP server). Existing tools remain callable directly for advanced use; the CLI is the friendly entry point.

## Non-goals

1. npm publishing or `npx` distribution (deferred to v1.1).
2. Replacing existing tools — the CLI wraps them; `tools/handshake-sign.mjs` remains directly callable.
3. Cross-runtime cron management — heartbeat writes a HEARTBEAT.md sentinel; the runtime decides cadence per the existing memory rule `feedback-heartbeat-must-self-drive`.
4. Multi-agent orchestration on the same machine — each agent runs its own CLI invocation, same as today.
5. Mailbox edit operations beyond the close protocol (no `turnfile send`, `turnfile ack`, etc., in v1.0.0).

## Requirements

### R1. Single entry point

Add `tools/turnfile.mjs` with a subcommand dispatcher accepting: `init`, `open`, `status`, `heartbeat`, `close`, `--help`, `--version`.

The dispatcher MUST exit non-zero on unknown subcommand and print a usage hint.

### R2. `init` — scaffold working-session

`node tools/turnfile.mjs init [--project <name>] [--maintainer <id>] [--agent <id>]* [--root <path>] [--dry-run]` MUST:

1. Refuse if `<root>/working-session/TURNFILE.yaml` already exists (exit non-zero with "working-session/ already initialized — refusing to overwrite"), unless `--force` is passed.
2. Copy `templates/v1-minimal/working-session/{TURNFILE.yaml, MAILBOX.md, WORKLOG.md}` into `<root>/working-session/`.
3. Substitute placeholders: `your-project-name` → `--project`, `your-name` → `--maintainer`, `agent-a` → first `--agent` flag (repeatable for additional agents).
4. Locate `templates/v1-minimal/` relative to the tool's own directory (so it works when the repo is cloned).
5. `--dry-run` prints the planned files + substitutions as JSON without writing.
6. On success emit JSON `{ok: true, root, files: [...], substitutions: {...}}`.

### R3. `open` — wrap handshake-sign

`node tools/turnfile.mjs open --agent <id> --session <N> --model <label> --surface <label> --scope <val>... [--heartbeat-*...] [--dry-run]` MUST be a thin pass-through to `tools/handshake-sign.mjs` direct flag mode (PRD-044). All PRD-044 flags + defaults are honored. Output is the handshake-sign JSON envelope.

### R4. `status` — wrap session-orient

`node tools/turnfile.mjs status [--agent <id>] [--emit json|human]` MUST shell out to `tools/session-orient.mjs --agent <id> --emit <emit>`. Default `--emit human`. Exit code mirrors session-orient's.

### R5. `heartbeat` — sentinel-file lifecycle

`node tools/turnfile.mjs heartbeat write --agent <id> --session <N> [--cadence 5m] [--policy notify-material] [--stop close]` MUST:

1. Write `working-session/HEARTBEAT.md` containing the PRD-038 read-only steward prompt contract: agent identity, cadence, policy (notify-material), stop condition (close), the deny-list (no file edits, no MAILBOX.json regen, no status changes, no signal creation, no revision bumps from the heartbeat itself), and the self-drive rule from `feedback-heartbeat-must-self-drive`.
2. Be idempotent — re-running with the same agent/session updates the existing HEARTBEAT.md in place.
3. Emit JSON `{ok: true, action: "write", path: "working-session/HEARTBEAT.md", agent, session}`.

`node tools/turnfile.mjs heartbeat stop` MUST:

1. Remove `working-session/HEARTBEAT.md` if present.
2. Emit JSON `{ok: true, action: "stop", removed: true|false}`.

The runtime owns the actual cron / loop driver. The CLI owns the contract sentinel. Each runtime's heartbeat reads HEARTBEAT.md on each tick and follows the contract; if absent, the heartbeat stops.

### R6. `close` — orchestrate close protocol

`node tools/turnfile.mjs close --agent <id> [--carry-forward-summary <text>] [--dry-run]` MUST orchestrate the full close protocol in order:

1. Run `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json` (refresh projection).
2. Run `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md` — abort non-zero on failure.
3. Run `node tools/validate-closeout.mjs --agent <id>` — abort non-zero on failure (active-card owner review).
4. Run `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json` — abort non-zero on failure.
5. Run `node tools/validate-prd-promotion.mjs` — abort non-zero on failure.
6. Run `node tools/heartbeat stop` (R5 stop) to remove HEARTBEAT.md if present.
7. Update `working-session/TURNFILE.yaml` `agents.<id>` block: `status: "idle"`, `current_task: null`, `last_seen: "<id>-session-<N>-close"`. Bump `coordination.revision`. Add a `yield` signal.
8. Append a close line to `working-session/WORKLOG.md` summarizing the session: agent, model, deliverables (from `--carry-forward-summary` if supplied), revision, carry-forward.
9. Re-export MAILBOX.json once more (post-write freshness).
10. Emit JSON `{ok: true, agent, prev_rev, next_rev, validators: {...}, files: {...}}`.

`--dry-run` runs validators only (steps 1-5), reports what WOULD be written in steps 7-9, no file mutations.

### R7. `--help` and `--version`

`node tools/turnfile.mjs --help` MUST list all subcommands with a one-line description and at least one example invocation per subcommand.

`node tools/turnfile.mjs --version` MUST emit JSON `{cli: <semver>, protocol: <turnfile.version-from-spec-or-schema>}`.

### R8. Exit codes

| Code | Meaning |
|------|---------|
| 0 | success |
| 1 | usage error (unknown verb, missing required flag) |
| 2 | refused (e.g. init over existing working-session/) |
| 3 | validator failure during close |
| 4 | file write error |

### R9. No new runtime dependency

The CLI MUST NOT introduce a new runtime dependency beyond what `tools/handshake-sign.mjs` and `tools/validate-v1-profile.mjs` already use (`js-yaml`, `ajv`). It MAY spawn child Node processes for the existing tools.

### R10. Registry recording

`docs/prds/PRD_SHELF_RECONCILIATION.json` MUST add an entry for PRD-048 with `classification: core-v1` and `required_for_minimal_profile: true` once promoted (post-Maintainer-ratify). Initial draft state stays in `working-session/docs/`.

## Acceptance Criteria

1. `node --test evals/prd-048.evals.mjs` passes.
2. `node tools/turnfile.mjs --help` exits 0 and documents all five subcommands.
3. `node tools/turnfile.mjs init --project demo --maintainer test --agent claude --root <tmp>` scaffolds three files and exits 0.
4. `node tools/turnfile.mjs init` over an existing `working-session/` exits 2 (refused).
5. `node tools/turnfile.mjs open` direct flag mode produces the same TURNFILE/HANDSHAKE/WORKLOG deltas as `tools/handshake-sign.mjs` direct flag mode.
6. `node tools/turnfile.mjs status` produces the same JSON as `tools/session-orient.mjs --emit json`.
7. `node tools/turnfile.mjs heartbeat write` creates HEARTBEAT.md; `heartbeat stop` removes it.
8. `node tools/turnfile.mjs close --agent <id>` runs all 9 close-protocol steps in order; failure of any validator step aborts non-zero.
9. PRD-046, PRD-047 evidence-collection scripts can call `turnfile.mjs` subcommands without bypassing the CLI surface.
10. Existing tools (`handshake-sign.mjs`, `session-orient.mjs`, etc.) remain directly callable for advanced use; the CLI is additive.

## Implementation Notes

Suggested module shape for Codex:

```
tools/turnfile.mjs              — dispatcher + --help + --version
tools/turnfile-init.mjs         — R2 scaffolding (or inline if small)
tools/turnfile-heartbeat.mjs    — R5 sentinel write/stop (or inline)
tools/turnfile-close.mjs        — R6 orchestrator (or inline)
```

`open` and `status` are thin pass-throughs and can stay inline in the dispatcher.

Cross-platform concerns: use `node:path`, `node:fs`, `node:child_process.spawnSync`. No shell pipes. Path separators: `path.join`.

Use `process.execPath` for spawned Node children to avoid PATH dependencies.

## Open Questions

1. OQ-048-1: Should `close` archive `working-session/boot-<agent>.md` automatically as part of step 8, or leave that to the agent's skill bundle? Claude proposes: leave to skill bundle for v1.0.0 (boot rotation needs per-agent versioning logic the CLI shouldn't own); revisit if PRD-047 dogfood reveals friction.
2. OQ-048-2: Should `heartbeat write` accept `--write-capable` per PRD-038? Claude proposes: no — v1.0.0 ships read-only-only; write-capable heartbeat needs explicit elevation that belongs in a separate command, not a flag toggle.
3. OQ-048-3: Should `init` add the new repo's `tools/` directory by copying from this repo, or assume the adopter clones the whole repo? Claude proposes: assume full clone (per Maintainer's "node tools/turnfile.mjs init" spec). A `--standalone` mode that copies tools/ could land in v1.1.

## RED Eval Package

`evals/prd-048.evals.mjs` is intentionally RED until implementation.

Expected implementer tasks:
1. Create `tools/turnfile.mjs` dispatcher.
2. Implement R2 `init` with placeholder substitution + refusal logic.
3. Implement R3 `open` pass-through to handshake-sign.
4. Implement R4 `status` pass-through to session-orient.
5. Implement R5 `heartbeat` write/stop sentinel.
6. Implement R6 `close` orchestrator with 9-step protocol.
7. Implement R7 `--help` and `--version`.
8. Make all 10+ eval tests pass.
9. Update PRD_STATUS with the implementation evidence.
