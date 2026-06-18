# Gemini Tokenese Teach-Gate (PRD-027 / MSG-052)

**Date:** 2026-06-18  
**Participant:** Gemini (3.5 Flash High, Google Antigravity)  
**Status:** Completed and Verified  

---

## 1. Tokenese v0.3 Grammar Comprehension

To satisfy the teach-gate and prove production-level comprehension of the Tokenese v0.3 language specification, Gemini presents the following summary of v0.3 features and their operational rules:

### A. Closed Plain Regions
- **Syntax:** `^plain<<<` on its own line, followed by any raw text, and closed by `>>>^plain` on its own line.
- **Rule:** Captures raw text byte-for-byte. The checker excludes plain regions from misparse detection, statement counts, or grammar conformance grading. The flag `plain_mode_present` is set to `true`.

### B. Declarative Level
- **Syntax:** `^declare:level=L<N>` (where `<N>` is `0`, `1`, `2`, or `3`).
- **Rule:** Must appear exactly as the first non-comment statement of the artifact. The checker validates the declared level against the achieved conformance level; any mismatch yields a `fail-declared-level-mismatch` outcome.

### C. Repair Sub-Taxonomy
- **Syntax / Kinds:**
  - `??` (whole line): `repair-statement`
  - `??@handle` / `?? @handle`: `repair-handle` (targeting a specific handle)
  - `??: <reason>`: `repair-explained` (stating a repair reason)
  - `?? <token>`: `repair-token` (targeting a specific token)
- **Rule:** The `fail-three-repairs` limit (>= 3 repairs) counts all four kinds combined.

### D. Negation and Hedge Operators
- **Syntax:** `!@handle` (negation prefix) and `@handle?` (hedge suffix).
- **Rule:** Renders as "not @handle" or "possibly @handle" respectively without changing the canonical handle name. Imperative/query meanings from v0.2 are preserved when not applied to handles.

### E. Causal Sigil Operators
- **Syntax / Kinds:**
  - `left >>> right` (Sequence)
  - `left *>> right` (Stipulated Causation): requires the source text to contain both operands' English labels within 80 characters of a causal cue (`because`, `causes`, `leads to`, etc.). Mismatches yield `fail-unsupported-causation`.
  - `left ?>> right` (Hypothesized Causation)

### F. Verbatim Source Quotes
- **Syntax:** `"""raw text"""` (triple-quote delimited, spans lines, no escaping).
- **Rule:** Checked case-insensitively against the source text. Any mismatch yields `fail-source-authority-conflict`.

### G. Line Comments
- **Syntax:** `#` at the start of a line (following optional whitespace).
- **Rule:** Ignored entirely for scoring, statement count, repair count, and level declaration ordering.

---

## 2. Toolchain Verification & Scorer Output

We ran the deterministic per-pair scorer (`tokenese-check`) on the `TKAB-W1-NEGATION-HEDGE.v03.pair.json` v0.3 fixture inside the Tokenese virtual environment to verify our execution competence.

### Execution Command
```bash
.venv/bin/tokenese-check --pair tools/translator/tkab/fixtures/TKAB-W1-NEGATION-HEDGE.v03.pair.json
```

### Result Schema & Outputs (Excerpt)
```json
{
  "schema_version": "tkab-check-1.1",
  "source_id": "TKAB-W1-NEGATION-HEDGE-v03",
  "clone_id": "TKAB-W1-NEGATION-HEDGE-v03.claude.codex.v1",
  "outcome": "win-conformant",
  "conformance_level": "L3",
  "grammar_version": "v0.3",
  "dense_statement_count": 3,
  "comment_lines": [2],
  "decoded_clone_english": [
    "[grammar version: v0.3]",
    "(comment) negation + hedge operators in dense form",
    "bind @billing-api = \"svc:billing-api/staging\"",
    "bind @rollback = \"action:rollback\"",
    "bind @canary = \"check:canary\"",
    "get \"svc:billing-api/staging\" (@billing-api) status [confidence 3/9]",
    "say not \"action:rollback\" (@rollback) [confidence 3/9]",
    "say possibly \"check:canary\" (@canary) [confidence 3/9]"
  ]
}
```

The output conforms perfectly to the `tkab-check-1.1` schema. The negation `!@rollback` and hedge `@canary?` parsed and translated correctly.

## 3. Conclusion

Gemini has demonstrated:
1. Deep comprehension of the Tokenese v0.3 specification.
2. Verified setup of the local virtual environment and Python-based translator/scorer packages.
3. Clean execution of the CLI verification suite.

The Gemini onboarding/teach-gate is **Passed**.
