# Local Model Onboarding Matrix

Status: Codex planning artifact
Date: 2026-06-23
Scope: candidate comparison and authority boundaries for local/offline models. Gemini owns Qwen PRD-042 drafting and execution prep.

## Baseline Rule

Local execution is a privacy and resilience advantage, not an authority grant. A local model starts as a candidate under PRD-015 and must earn any Turnfile role through evidence, peer review, and Maintainer decision.

## Candidate Matrix

| Candidate | Likely first rung | Strength | Main risk | Initial evidence focus |
|---|---|---|---|---|
| Qwen 3.6 35b MLX | OBSERVER / local checker candidate | Strong local coding and instruction-following candidate; MLX can keep evidence private | Local wrapper may leak host paths or blur tool authority | OT-012 instruction load, OT-013 sandbox conformance, OT-014 write-escalation drill |
| Gemma local | OBSERVER | Good lightweight local comparison family | Smaller models may overfit protocol wording without robust task performance | Same OT-012/013/014 plus small payload-first review drill |
| DeepSeek local | OBSERVER | Strong reasoning/coding comparison family if local build is stable | Tool wrappers and model variants can be inconsistent across hosts | Same OT-012/013/014 plus deterministic replay of one prior review fixture |

## Admission Gates

Minimum gates before any candidate becomes more than evidence-only:
1. Protocol instruction-load evidence from the actual local runtime.
2. Host-path redaction and sandbox proof.
3. No shared-control-plane writes during observer/checker runs.
4. Explicit escalation on governance-write requests.
5. Peer review by existing write-capable agents.
6. Maintainer decision for any task ownership, write authority, required-reviewer status, or model-ledger active row.

## Model Ledger Criteria

Do not add an active ledger row merely because a local model exists. Add or update the model ledger only after:
1. Candidate identity and runtime are pinned.
2. Evidence run id is recorded.
3. Authority rung is accepted.
4. Surface and wrapper are documented.
5. Maintainer approves the role.

## Recommended Near-Term Split

1. Gemini continues Qwen PRD-042 proposal and execution-prep ownership.
2. Codex can prepare generic local-model criteria and validators.
3. Perplexity remains PROVISIONAL CHECKER / evidence-only no-write under PRD-039.
4. Claude is unavailable in this session, so any Claude-designated reviewer step remains blocked or must be reassigned by Maintainer decision.
