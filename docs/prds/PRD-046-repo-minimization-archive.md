# PRD-046: Repo Minimization Archive

Status: Accepted; implementation done; promoted to docs/prds
Owner: Codex (author/eval author) + Claude (reviewer/implementer) + Maintainer (approval)
Date: 2026-06-23

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored this draft and `evals/prd-046.evals.mjs` as RED implementation tests |
| Claude acceptance | accepted | Claude applied counters and implemented the minimization/archive lane; Codex A1 review approved |
| Maintainer acceptance | accepted | Maintainer required repository minimization before final v1.0.0 ratification |
| Eligible for move to `docs/prds` | yes | promoted to `docs/prds`; implementation done per PRD_STATUS |

## Problem

Turnfile has a usable v1 release-candidate surface, but the repository root still carries the full development session record. That is useful for maintainers, but too heavy for a fresh adopter trying to understand the stable protocol. The v1 release needs a smaller default reading surface while preserving the complete development trail.

The portable CLI is now tracked separately as PRD-048. PRD-046 owns only the repository minimization and archive boundary.

## Goal

Move session-12-onward development history into a clear example/archive area while keeping the stable v1 surface easy to find.

After implementation:

1. `examples/turnfile-development/` preserves the session-12-onward development record.
2. `examples/inception/` remains present and semantically untouched.
3. Fresh adopters can start from README, SPEC, MVT, schemas, templates, tools, promoted PRDs, and public guides without reading live development artifacts.
4. The archive README explains what moved, why it moved, and that the cutoff is "current at minimization time".

## Non-goals

1. Implementing `tools/turnfile.mjs` or any CLI verb. That is PRD-048.
2. Publishing an npm package.
3. Deleting git history.
4. Changing v1 protocol semantics.
5. Running Tokenese or PAICE2 dogfood tests. That is PRD-047.
6. Rewriting `examples/inception/`.

## Requirements

### R1. Development archive path

Create `examples/turnfile-development/` as the preserved archive for session-12-onward Turnfile development history.

The archive must include a `README.md` that states:

1. It covers session 12 through "current at minimization time".
2. It is historical evidence, not required reading for fresh adopters.
3. `examples/inception/` remains the session 1-11 archive.
4. The stable v1 surface remains at the repo root plus `docs/`, `schemas/v1/`, `templates/v1-minimal/`, and `tools/`.

### R2. Archived material inventory

The archive must preserve, at minimum:

1. Development `WORKLOG` history.
2. Development `MAILBOX` history and archive material.
3. Retired drafts and intermediate working-session docs that are not part of the stable v1 public surface.
4. Model-ledger detail that is useful as portability evidence but not required for fresh adoption.
5. A manifest or README section listing the archive contents.

### R3. Stable surface statement

Root/public docs must tell fresh adopters where to start.

At minimum, one current public surface must identify these stable v1 entry points:

1. `README.md`
2. `SPEC.md`
3. `DEFINITIONS.md`
4. `CONFORMANCE.md`
5. `docs/MINIMUM_VIABLE_TURNFILE.md`
6. `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`
7. `schemas/v1/`
8. `templates/v1-minimal/`
9. `tools/`
10. promoted PRDs under `docs/prds/`
11. `tools/turnfile.mjs` as the portable CLI entry point (`node tools/turnfile.mjs --help`)

### R4. Inception archive preservation

`examples/inception/` must remain present. PRD-046 may reference it as precedent, but implementation must not rewrite or repurpose it.

### R5. Root clutter reduction

Final v1 release instructions must distinguish:

1. Stable v1 surface: current files a fresh adopter should read.
2. Development archive: historical evidence and prior session artifacts.
3. Live session state: temporary coordination material used by active Turnfile participants.

### R6. Validation

Validation must fail when:

1. `examples/turnfile-development/README.md` is missing.
2. The archive README does not mention session 12 through current-at-minimization-time.
3. `examples/inception/` is missing.
4. No current public surface points fresh adopters to the stable v1 entry points.
5. PRD_STATUS lacks the PRD-046 author/eval/implementer/reviewer split.

## Acceptance Criteria

1. `node --test evals/prd-046.evals.mjs` passes.
2. `examples/turnfile-development/README.md` exists and documents the archive range.
3. `examples/inception/` still exists.
4. The archive includes or points to the preserved WORKLOG, MAILBOX, retired drafts, and model-ledger detail. Git-revision pointers are preferred over duplicating large historical files when git already preserves the content.
5. Current public docs identify the stable v1 reading surface.
6. PRD_STATUS records PRD-046 with Codex as eval author, Claude as implementer, and Codex as reviewer.

## RED Eval Package

`evals/prd-046.evals.mjs` is intentionally RED until implementation.

Expected implementer tasks:

1. Create `examples/turnfile-development/`.
2. Preserve the required history and intermediate material there.
3. Update public docs with the stable-surface and archive distinction.
4. Leave `examples/inception/` intact.
5. Record implementation evidence in `PRD_STATUS.json`.

## Open Questions

1. OQ-046-1: Should active `working-session/` be physically moved before final v1.0.0, or should the release branch keep live session state until final ratify and archive it as the last release-prep step? Accepted answer: archive as the last release-prep step so current coordination remains intact while this session is active.
2. OQ-046-2: Should `docs/llm/MODEL_LEDGER.md` remain current-surface or move detailed historical rows into the archive? Accepted answer: keep the current compatibility summary public, move detailed historical session evidence into `examples/turnfile-development/`.

## Implementation Notes

PRD-046 should land before PRD-047. PRD-047 dogfood evidence should run against the minimized repo plus PRD-048 CLI rather than the pre-minimization working surface.

Claude review counters applied 2026-06-23:

1. C1: R3 explicitly lists `tools/turnfile.mjs` as a v1 entry point.
2. C2: AC4 prefers git-revision pointers over content duplication for large preserved history.
3. C3: The current public-surface keyword check is accepted for v1.0.0; a future PRD may add link-resolution validation.
