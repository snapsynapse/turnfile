# Tokenese Pilot Result Publication Package

**Date of Generation:** 2026-06-18  
**Source Authority:** Derived from `working-session/docs/tk-ab-run-results.md` and generated from `working-session/tokenese-pairs/*.result.json` artifacts.  
*Note: This is a generated document. No token counts, ratios, or outcome values were manually transcribed.*

## 1. Executive Summary

This package summarizes the outcomes of the Turnfile Tokenese A/B pilot (consisting of W1-W5 and L1-L3 pairs). The pilot compared dense Tokenese representation with natural English prose to evaluate compression, conformance, and audibility.

### Clear Distinction vs. Tokenese Upstream N2 Requirements

> [!IMPORTANT]
> **This pilot evidence does not satisfy the broader Tokenese N2 validating experiment requirements.**
> The Turnfile pilot is a limited evaluation focused on coordination, tool validation, and initial calibration. It has a small sample size (8 pairs) and is restricted to the two-model family (Claude and Codex). It serves as observational evidence only, not the full validation of the Tokenese N2 specification.

## 2. Test Cases and Outcomes

| Case | Arm | Direction | Grammar | Artifact Class | Outcome | Conformance | Repair Events | Misparse Hits | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| TKAB-W1 | W1 | Claude→Codex | v0.2 | deploy-status | win-conformant | L3 | 0 | 0 | WIN — Tokenese fewer tokens both tokenizers |
| TKAB-L1 | L1 | Codex→Claude | v0.2 | deadlock-debug | l1-plain-success | L3 | 0 | 0 | NEGATIVE CONTROL PASS — correct `plain` refusal, `dense_statement_count: 0` (R1 dense inadmissible) |
| TKAB-W2-v03 | W2 | Codex→Claude | v0.3 | multi-service-health | win-conformant | L3 | 0 | 0 | LOSS on tokens — valid structure, poor compression |
| TKAB-W5-v03 | W5 | Codex→Claude | v0.3 | session-status-handoff | win-conformant | L3 | 0 | 0 | LOSS on tokens — valid structure, poor compression |
| TKAB-W3-v03 | W3 | Claude→Codex | v0.3 | task-handoff-typed-holes | indeterminate | L3 | 0 | 0 | LOSS on tokens — valid structure, zero misparse; frameset telemetry report-only |
| TKAB-L2-v03 | L2 | Claude→Codex | v0.3 | open-ended-design | indeterminate; `plain_mode_present: true` | L3 | 0 | 0 | NEGATIVE CONTROL PASS — correct `plain` refusal; expected LOSS on tokens |
| TKAB-W4-v03 | W4 | Codex→Claude | v0.3 | structured-code-review-finding | indeterminate | L3 | 0 | 0 | WIN — structured finding compressed on both tokenizers; `ev:obs` only on observed command/test output |
| TKAB-L3-v03 | L3 | Codex→Claude | v0.3 | verbatim-heavy-code-review | indeterminate; `plain_mode_present: true` | L3 | 0 | 0 | NEGATIVE CONTROL PASS — plain/fenced passthrough preserved exact strings; expected LOSS |

## 3. Metadata & Version Details

| Case | Arm | Grammar Version | Checker Version | Schema Version | Tokenizer Set |
|---|---|---|---|---|---|
| TKAB-W1 | W1 | v0.2 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-L1 | L1 | v0.2 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-W2-v03 | W2 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-W5-v03 | W5 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-W3-v03 | W3 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-L2-v03 | L2 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-W4-v03 | W4 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |
| TKAB-L3-v03 | L3 | v0.3 | tkab-check-1.1 | tkab-check-1.1 | anthropic, o200k |

## 4. Token Compression Summary & Ratios

Compression ratio is calculated as `clone tokens / source tokens`. Ratios less than 1.0 indicate successful compression.

| Case | Arm | Anthropic Tokens (Src→Clone) | Anthropic Ratio | o200k Tokens (Src→Clone) | o200k Ratio |
|---|---|---|---|---|---|
| TKAB-W1 | W1 | 107→63 | 0.59 | 72→52 | 0.72 |
| TKAB-L1 | L1 | 192→183 | 0.95 | 115→98 | 0.85 |
| TKAB-W2-v03 | W2 | 118→168 | 1.42 | 83→135 | 1.63 |
| TKAB-W5-v03 | W5 | 147→170 | 1.16 | 112→146 | 1.30 |
| TKAB-W3-v03 | W3 | 107→131 | 1.22 | 64→101 | 1.58 |
| TKAB-L2-v03 | L2 | 111→292 | 2.63 | 64→181 | 2.83 |
| TKAB-W4-v03 | W4 | 233→203 | 0.87 | 135→117 | 0.87 |
| TKAB-L3-v03 | L3 | 225→233 | 1.04 | 133→148 | 1.11 |

## 5. Misparse & Repair Statistics

Across all v0.2 and v0.3 active pairs:
- **Total Misparse Hits:** 0 (all parsed successfully by the toolchain).
- **Total Repair Events:** 0 (no repair events triggered in checkout scorer execution).

Detailed misparse family count (binding, scope, sense, triangulation) is registered as zero across all conformant test points.

## 6. Known Limitations

1. **Small Sample Size:** The pilot contains only 8 data points, which is insufficient for broad statistical significance.
2. **Two-Model-Family Scope:** Tests were run exclusively between Claude (Opus 4.8) and Codex (GPT-5.5). Multi-model generalization remains unproven.
3. **Calibration Dependency:**Evidential channels (`ev:`) and confidence scores (`^N`) require verification and must not be trusted standalone without audit backing.
