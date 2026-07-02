# PRD-044: Handshake-sign CLI Argument Ergonomics

Status: Accepted; implementation done; promoted to docs/prds
Owner: Codex (author/eval author) + Claude (reviewer/implementer) + Maintainer (approval)
Date: 2026-06-23

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored this draft and `evals/prd-044.evals.mjs` as RED implementation tests |
| Claude acceptance | accepted | Claude applied and implemented the direct-flag path; Codex A1 review approved |
| Maintainer acceptance | accepted | Maintainer acceptance carries forward per PRD_STATUS |
| Eligible for move to `docs/prds` | yes | promoted to `docs/prds`; implementation done per PRD_STATUS |

## Problem

`tools/handshake-sign.mjs` reduced the session-open ceremony, but its only input path is a JSON payload file or stdin. That is correct for full automation, but it is too clumsy for common human-agent session opens. Session 29 exposed this directly: simple fields such as session number, model, surface, and scope had to be staged through a temporary JSON file.

## Goal

Add direct CLI flags for the common handshake path while preserving the existing JSON payload path.

The target is a backward-compatible UX improvement:

1. Existing `--payload <json-file|->` behavior remains valid.
2. Agents may instead provide common fields directly as flags.
3. Direct flags and payload mode have clear conflict behavior.
4. `--dry-run` works for both modes.
5. The generated Turnfile, handshake row, and WORKLOG output are identical in shape to the current canonical payload behavior.

## Non-goals

1. Changing PRD-037 handshake semantics.
2. Changing heartbeat capability policy.
3. Creating or deleting runtime heartbeat automations.
4. Replacing JSON payload mode.
5. Moving `handshake-sign` into v1 core before PRD-043 validates.

## Requirements

### R1. Direct flag mode

`tools/handshake-sign.mjs` must accept these flags when `--payload` is omitted:

1. `--session <number>`
2. `--model <label>`
3. `--surface <label>`
4. `--scope <value>` repeatable
5. `--heartbeat-cadence <value>`
6. `--heartbeat-policy <value>`
7. `--heartbeat-stop <value>`
8. `--heartbeat-owner <value>`
9. `--tokenese-lead` and `--no-tokenese-lead`

### R2. Defaults

When direct flag mode is used:

1. `--heartbeat-cadence` defaults to `5m`.
2. `--heartbeat-policy` defaults to `notify-material`.
3. `--heartbeat-stop` defaults to `close`.
4. `--heartbeat-owner` defaults to `self`.
5. `--tokenese-lead` defaults to true.
6. `--scope` must be supplied at least once.

### R3. Conflict handling

The tool must reject mixed input modes:

1. `--payload` cannot be combined with direct payload fields such as `--session`, `--model`, `--surface`, or `--scope`.
2. Error output must name the conflict and exit non-zero.

### R4. Help text

`--help` must document both input modes and include at least one direct-flag example.

### R5. Backward compatibility

Existing JSON payload behavior must keep passing the current PRD-037 evals.

## Acceptance Criteria

1. `node --test evals/prd-044.evals.mjs` passes.
2. Direct flag dry-run emits JSON with `dry_run: true`, the derived `next_rev`, and the parsed scope list.
3. Direct flag live run writes `TURNFILE.yaml`, `NEXT_SESSION_HANDSHAKE.md`, and `WORKLOG.md` in the same canonical shape as payload mode.
4. Mixed `--payload` plus direct fields exits non-zero with a clear conflict message.
5. `--help` documents both modes and shows a direct-flag example.
6. Existing `evals/prd-037.evals.mjs` remains green for the handshake-sign cases it covers.

## Implementation Notes

This is a tooling ergonomics PRD, not a policy PRD. It does not decide selective unlock classes and does not alter the PRD-043 v1 Minimal Governance Profile. It may be implemented before or after PRD-043 because it is backward-compatible and scoped to a tool that already exists.
