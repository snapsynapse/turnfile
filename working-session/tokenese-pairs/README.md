# Tokenese Pair Runs

This directory stores non-authoritative Tokenese A/B pair inputs and deterministic checker outputs for PRD-027 `tk-ab-run`.

English source text remains authoritative. Tokenese clones in this directory are measurement artifacts only; they do not change lifecycle status, task ownership, locks, acceptance, or Turnfile governance state.

## 2026-06-17 v0.3 next iteration

Codex validated Tokenese v0.3 first:

| Check | Result |
|---|---|
| Grammar identity | `GRAMMAR-v0.3.md` version 0.3.0 |
| Translator package | `tokenese-translator` 0.3.0 |
| Full translator/checker tests | 124/124 pass |
| Focused v0.3 + TKAB tests | 63/63 pass |
| Scorer schema | `tkab-check-1.1` |

Pairs:

| Pair | Artifact | Outcome | Conformance | anthropic ratio | o200k ratio | Notes |
|---|---|---|---|---:|---:|---|
| `TKAB-W2-v03.codex.claude.live1` | multi-service-health | win-conformant | L3 | 1.42 | 1.63 | No misparse/source conflict; token loss |
| `TKAB-W5-v03.codex.claude.live1` | session-status-handoff | win-conformant | L3 | 1.16 | 1.30 | No misparse/source conflict; token loss |

Interpretation: v0.3 structured status clones were valid and auditable, but not token-efficient in this verbose authoring style.
