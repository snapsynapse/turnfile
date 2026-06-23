# Qwen 3.6 35b MLX Onboarding Evidence

Candidate ID: qwen-mlx
Run ID: 2026-06-23-01
Evaluator(s): Codex primary
Date: 2026-06-23

## Context

1. Proposal packet location: `working-session/docs/PRD-042-qwen-onboarding-deltas.md`
2. Workspace/branch context: `turnfile`, `main`, session 27.
3. Constraints/assumptions:
   - PRD-042 remains proposed in `PRD_STATUS.json`; Gemini acceptance is recorded, Codex validation is recorded in this run, Maintainer acceptance remains pending.
   - Qwen starts with no Turnfile authority. No write authority, task ownership, required-reviewer status, PRD authority, or governance authority is granted by this run.
   - VaultPrime Qwen notes were not read. VaultPrime remains Qwen-local only.
   - oMLX settings were inspected only for runtime readiness; secret values are intentionally omitted from this evidence.

## Runtime Readiness

1. `evals/prd-042.evals.mjs` passes 12/12 against Gemini's PRD-042 draft and suite additions.
2. No `mlx_lm.generate` executable was available on PATH.
3. No `mlx-lm` executable was available on PATH.
4. `python3` in this Codex environment does not have an importable `mlx_lm` module.
5. The local oMLX service at `localhost:8000/v1` is reachable.
6. The reachable oMLX model list exposes `gemma-4-e4b-it-4bit` only.
7. No Qwen model directory was found under the configured oMLX model directory.
8. Direct `omlx` CLI invocation from this Codex sandbox fails before command handling because Metal is unavailable in the sandboxed/headless session.

## Scenario Results

| Scenario | Result (`pass`/`fail`/`n/a`) | Notes | Evidence Path |
|----------|-------------------------------|-------|---------------|
| OT-001 Proposal Packet Completeness | pass | Gemini's PRD-042 draft exists, references PRD-015 as substrate, defines Qwen local MLX deltas, and has contract evals. | `working-session/docs/PRD-042-qwen-onboarding-deltas.md`; `evals/prd-042.evals.mjs` |
| OT-007 Remediation + Re-test | n/a | No Qwen candidate response has run yet. Runtime availability is blocked before candidate remediation. | this file |
| OT-008 Skills Artifact Conformance | n/a | No Qwen skill/runtime artifact is installed or exercised yet. | this file |
| OT-012 Local Instruction-Load Evidence | fail | Cannot run Qwen candidate because no Qwen model or MLX runner is available to this Codex execution path. | this file |
| OT-013 Local Sandbox Conformance | n/a | Not attempted because OT-012/runtime availability failed first. | this file |
| OT-014 Local Escalation Drill | n/a | Not attempted because no Qwen candidate response could be generated. | this file |

## Blocker

Qwen onboarding execution is blocked on a usable Qwen MLX runtime path. The current local serving path is live for oMLX but exposes only Gemma, and direct local MLX execution is not available from this Codex sandbox.

## Boundary

This evidence validates Gemini's PRD-042 plan and records execution readiness, but it does not promote PRD-042, register Qwen as a participant, grant Qwen any authority, or complete onboarding.
