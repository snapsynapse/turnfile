# PRD-036: PRD Eval Runner Contract

Status: Accepted; implementation pending
Owner: Codex proposer; Claude reviewed APPLY with counters; Maintainer accepted
Date: 2026-06-17
Last revised: 2026-06-17

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Drafted by Codex after detection-only audit found `npm run evals:prd` failure; applied Claude counters C1-C2 in session 19 |
| Claude acceptance | accepted-with-amendment | MSG-20260617-033: APPLY with counters C1-C2 |
| Maintainer acceptance | accepted | ready |
| Eligible for move to `docs/prds` | yes | all acceptances complete; promotion move still pending |

## Input Provenance Tags

1. `explicit`: Maintainer asked Codex to note code issues and create PRDs as appropriate without repairing them.
2. `observed`: `npm run validate` passes because it runs `node tools/run-evals.mjs`, not the PRD eval suites under `evals/`.
3. `observed`: `npm run evals:prd` fails on the local Node runtime with `Cannot find module '/Users/snap/Git/turnfile/evals'` because the script is `node --test evals/`.
4. `observed`: PRD-006 says PRD evals live in `evals/prd-<NNN>.evals.mjs` and are runnable via `npm run evals:prd`.
5. `observed`: Individual PRD eval commands such as `node --test evals/prd-032.evals.mjs` and `node --test evals/prd-033.evals.mjs` pass.

## Problem

The repo has two eval lanes with different behavior:

1. `npm run evals` runs the tool regression harness through `tools/run-evals.mjs` and passes.
2. `npm run evals:prd` is documented as the PRD eval runner but currently fails before loading tests.

This is a protocol-contract problem, not just a package-script typo. PRD-006 A1 depends on PRD evals being easy to run as a lane-level gate. If the aggregate script is broken, agents may rely on selective one-file evals and miss cross-PRD regressions.

## Goal

1. Define a reliable aggregate command for all PRD eval suites.
2. Align `package.json`, PRD-006 wording, README/validation docs, and CI expectations.
3. Keep PRD evals separate from cheap repo validators when appropriate, but make that separation explicit.
4. Add regression coverage so the aggregate command cannot silently break again.

## Non-goals

1. Repairing the script in this draft turn.
2. Changing individual PRD eval semantics.
3. Requiring every PRD eval to run in every quick local validation command if Maintainer chooses a lighter default.
4. Replacing `tools/run-evals.mjs`.

## Requirements

## R1. Aggregate PRD eval command

`npm run evals:prd` must run every file matching `evals/*.evals.mjs` under the Node test runner on supported Node versions.

The canonical implementation is a portable Node wrapper script that:

1. Reads the `evals/` directory directly.
2. Filters files matching `*.evals.mjs`.
3. Spawns `node --test` with the resolved file list.
4. Does not depend on shell glob expansion or directory test discovery.

The command must fail if no PRD eval files are found.

## R2. Validation command taxonomy

Documentation must distinguish:

1. Repo readiness validators: schema, mailbox, PRD promotion, skill preflight, and tool regression harness.
2. PRD implementation evals: `evals/*.evals.mjs`, which are contract-specific A1 evidence.
3. Focused PRD evals: one or more explicit eval files used during a specific lane.

## R3. CI policy

The repo policy is that CI runs `npm run validate` and `npm run evals:prd` as separate required steps.

`npm run validate` remains the cheap repo readiness gate and must not silently fold in the full PRD eval suite. CI and release validation run the PRD eval lane explicitly so a broken aggregate PRD runner cannot stay hidden behind green readiness checks.

## R4. PRD-006 alignment

PRD-006 A1 documentation must match the actual runner. If `npm run evals:prd` remains the canonical runner, it must be green. If a different command becomes canonical, PRD-006 must be amended accordingly.

## R5. Regression coverage

Add lightweight regression coverage in the normal tool regression harness (`tools/run-evals.mjs`, reached by `npm run validate`) that verifies the aggregate PRD eval wrapper resolves and loads at least one known eval file in a fixture or dry-run mode.

The aggregate PRD eval suite may also verify the runner contract, but the non-self-referential harness coverage is required so `npm run validate` catches a broken `evals:prd` wrapper.

## Acceptance Criteria

1. `npm run evals:prd` exits 0 through the portable Node wrapper and runs all current `evals/*.evals.mjs` files.
2. The command fails when no matching eval files exist in a fixture.
3. README or `docs/VALIDATION.md` explains the distinction between repo readiness evals and PRD implementation evals.
4. PRD-006 references the actual canonical command.
5. CI policy for PRD evals is explicit: CI runs `npm run validate` and `npm run evals:prd` as separate steps.
6. Focused commands for PRD-032 and PRD-033 still pass.
7. `tools/run-evals.mjs` includes a regression that dry-runs or fixture-loads the PRD eval wrapper, so repo readiness catches wrapper regressions without executing the full PRD suite locally.

## Risks

1. Running all PRD evals may be slower than quick validation.
   Mitigation: R3 allows a separate CI step or documented release gate.
2. Shell glob behavior may vary.
   Mitigation: use a Node wrapper as the canonical runner.
3. Some historical PRD evals may assume live workspace state.
   Mitigation: failures should become evidence for fixture isolation or docs that define focused-only evals.

## Dependencies

1. PRD-006 session promotion pipeline and A1 loop.
2. `package.json` scripts.
3. `docs/VALIDATION.md`.
4. GitHub Actions validate workflow.
5. `tools/run-evals.mjs` regression harness.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `package.json` | `evals:prd` becomes reliable |
| `docs/prds/PRD-006-...` | Runner statement aligns with implementation |
| `docs/VALIDATION.md` | Eval taxonomy becomes explicit |
| `.github/workflows/validate.yml` | CI policy becomes explicit if changed |

## Milestones

1. M0: Draft PRD.
2. M1: Claude review and Maintainer acceptance decision.
3. M2: Author runner regression eval.
4. M3: Implement portable runner.
5. M4: Align docs and CI policy.
6. M5: Verify aggregate and focused evals.

## Open questions

*No open questions at this time.*
