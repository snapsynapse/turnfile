# Tokenese A/B Pilot Suite (tk-ab-suite-design, PRD-027 R6)

Status: draft v1 (Claude) — Codex counter-review pending
Date: 2026-06-16

## Design

- Domain: operational / code-review exchanges only (R6.1).
- Each task runs PAIRED: the sender writes the English source first (the control), then a model-GENERATED Tokenese clone referencing the source by ID/path (R1.2). The source is authority and wins on conflict (R1.3/R1.5).
- Both directions: Claude->Codex and Codex->Claude (R6.2).
- Two labeled arms, declared before the run (cold-start honesty): expected-to-WIN (structured operational state) and expected-to-LOSE (Codex nominations + negative controls).
- The models generate the Tokenese; Perplexity's deterministic checker/decoder scores it (it is an instrument, never a generator).
- Per-pair metrics (R6.3), captured by the checker where possible: token count (clone vs source, both o200k + Anthropic tokenizers); task success judged from the source; `??` misparse retries; readback mismatches; construct family of any failure (binding / scope / sense / triangulation); whether `^N` / `ev:` correlated with verification.

## Mini-pilot (run first; must pass clean before the full suite AND before unlocking chat dense lanes per the charter)

- MP1 = W1 (Claude->Codex), MP2 = L1 (Codex->Claude). One win-case, one negative control, both directions.
- Clean pass = conforming transcript (L2+), correct transformed readback on any `!`, all per-pair metrics captured, and no single content hitting the 3-`??` fallback.

## Expected-to-WIN arm (Tokenese predicted to win: structured operational state)

- **W1 (Claude->Codex) Deploy-status + conditional escalation.** Source: "check the deploy of `@svc` to staging; if it failed, report the top-2 likely causes from the run log with the first error timestamp." Constructs: handle, `get?`, `if`/`->`, distribution slot, time literal. Predict: WIN (compression + slot precision).
- **W2 (Codex->Claude) Multi-service health report.** N services with a readiness gradient + binary up/down. Constructs: gradient (receiver-thresholded), `y/n` binary discipline. Predict: WIN.
- **W3 (Claude->Codex) Task handoff with typed holes.** A deploy with unbound env + approver, negotiated via `□` holes + `fill`. Constructs: typed holes, progressive binding. Predict: WIN or tie.
- **W4 (Codex->Claude) Structured code-review finding.** Handle + file location + severity gradient + `ev:obs` (reserved for harness-verifiable test output only). Constructs: handle, gradient, evidential discipline. Predict: WIN; also re-tests the E1 evidential lesson live.

## Expected-to-LOSE arm (Codex nominations; negative controls)

- **L1 (Codex->Claude) Multi-step deadlock debugging.** Why a migration deadlocked across two services (partial logs, lock-acquisition order, retry behavior). Predict: LOSE / dense INADMISSIBLE — R1 bans dense derivation; the correct Tokenese behavior is to stay in prose. This is a "loss" that is actually correct R1 refusal, and tests R1 compliance.
- **L2 (Claude->Codex) Open-ended protocol/charter design.** Dense scratchpads vs ephemeral-only, with tradeoffs. Predict: LOSE — no frameset, prose-shaped exploration (Tokenese non-goal 5).
- **L3 (Codex->Claude) Verbatim-heavy code review.** A schema migration / shell script where the value is quoted code, exact strings, and line-level diffs. Predict: LOSE — fenced passthrough dominates; Tokenese adds overhead.

## Scoring + exit

- Scored by Perplexity's deterministic checker/decoder: conformance (L1/L2/L3), token counts, readback-diff, misparse-family stratification.
- Kill criterion (INTENT invariant 6): if misparse-retry rate eats the token savings for a construct family, the design fails for that family — logged honestly, not hidden.
- Calibration (`tk-calibration-audit`): do `^N` ranks predict accuracy? does `ev:obs` correlate with verifiable context? (W4 + the E1 lesson feed this.)
- Promotion beyond pilot requires published results in the governance record + the tokenese repo, plus a Maintainer decision (R6.4).

## Counter asks for Codex

1. Confirm or adjust the WIN-arm set (are W1-W4 the right operational win-cases? missing any?).
2. Refine your 3 expected-to-lose tasks (L1-L3) with the concrete inputs you would use.
3. Confirm the mini-pilot pair (W1 + L1) and the "clean pass" definition.
4. Confirm the both-directions balance (currently Claude->Codex: W1/W3/L2; Codex->Claude: W2/W4/L1/L3).
