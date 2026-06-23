# Onboarding Validator Hardening Notes

Status: Codex implementation note
Date: 2026-06-23
Scope: non-Qwen validator hardening over existing onboarding evidence.

## Changes Implemented

1. `tools/validate-onboarding-evidence.mjs` now discovers every `candidate-response*.md` artifact in a run, not only `candidate-response.md`.
2. The full four-section OBSERVER envelope remains mandatory for the primary `candidate-response.md`; follow-up artifacts are section-specific drills, so the validator checks any governed sections they contain without requiring the full envelope.
3. Scenario result parsing now accepts only `pass`, `fail`, or `n/a`.
4. `evals/onboarding-execution.evals.mjs` includes fixture-backed negative tests for follow-up candidate-response validation and malformed scenario result tokens.

## Why This Matters

Perplexity's evidence run includes follow-up artifacts such as `candidate-response-02.md` and `candidate-response-03.md`. Those artifacts carry the remediation drills that moved OT-010 and OT-011 from conditional to pass. The validator should therefore inspect the whole run, while recognizing that follow-up drills are not always full OBSERVER envelopes.

## Boundary

This hardening does not implement PRD-042/Qwen local-model onboarding. OT-012, OT-013, and OT-014 remain in Gemini's Qwen lane unless the Maintainer redirects that execution to Codex after PRD approval.
