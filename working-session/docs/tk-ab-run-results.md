# tk-ab-run — Tokenese A/B Results (PRD-027 R6.3)

Status: living results artifact (pilot). Last updated 2026-06-17 (rev 202).
Owner: Claude + Codex. Maintainer arbitrates promotion (PRD-027 R6.4).

## What this is

The governance record of PRD-027 `tk-ab-run`: paired Tokenese-clone-vs-English-source
exchanges, scored by the deterministic checker that lives in `~/Git/tokenese` (PRD-027 R7;
Perplexity-built instrument, not a generator). English source text is authoritative on every
pair (R1.5 source wins); the Tokenese clones and these scores are measurement artifacts only
and change no Turnfile governance state (no lifecycle, ownership, locks, or acceptance).

## Method

- Each pair: one authoritative English `source_text` and one Tokenese `clone_text`, both stored
  under `working-session/tokenese-pairs/` (and the v0.2 mini-pilot in the tokenese checker env).
- Scored by the deterministic checker (`tkab-check`, schema `tkab-check-1.1`): conformance level
  (L0-L3), token counts on two tokenizers, readback-diff, and misparse-family stratification.
- Token ratio = clone tokens / source tokens. Ratio below 1 = Tokenese win (fewer tokens);
  ratio above 1 = Tokenese loss (more tokens). Reported per tokenizer (anthropic / o200k).
- Grammar version is recorded per pair (v0.2 vs v0.3) — see Data hygiene. Mixed versions are not
  averaged across the compression comparison.

## Results

| Pair | Arm | Dir | Grammar | Artifact | Outcome | Conf. | anthropic (src→clone, ratio) | o200k (src→clone, ratio) | Misparse | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| TKAB-W1 | W1 | Claude→Codex | v0.2 | deploy-status | win-conformant | L3 | 107→63, 0.59 | 72→52, 0.72 | 0 | WIN — Tokenese fewer tokens both tokenizers |
| TKAB-L1 | L1 | Codex→Claude | v0.2 | deadlock-debug | l1-plain-success | L3 | 192→183, 0.95 | 115→98, 0.85 | 0 | NEGATIVE CONTROL PASS — correct `plain` refusal, `dense_statement_count: 0` (R1 dense inadmissible) |
| TKAB-W2-v03 | W2 | Codex→Claude | v0.3 | multi-service-health | win-conformant | L3 | 118→168, 1.42 | 83→135, 1.63 | 0 | LOSS on tokens — valid structure, poor compression |
| TKAB-W5-v03 | W5 | Codex→Claude | v0.3 | session-status-handoff | win-conformant | L3 | 147→170, 1.16 | 112→146, 1.30 | 0 | LOSS on tokens — valid structure, poor compression |
| TKAB-W3-v03 | W3 | Claude→Codex | v0.3 | task-handoff-typed-holes | indeterminate | L3 | 107→131, 1.22 | 64→101, 1.58 | 0 | LOSS on tokens — valid structure, zero misparse; frameset telemetry report-only |
| TKAB-L2-v03 | L2 | Claude→Codex | v0.3 | open-ended-design | indeterminate; `plain_mode_present: true` | L3 | 111→292, 2.63 | 64→181, 2.83 | 0 | NEGATIVE CONTROL PASS — correct `plain` refusal; expected LOSS on tokens |
| TKAB-W4-v03 | W4 | Codex→Claude | v0.3 | structured-code-review-finding | indeterminate | L3 | 233→203, 0.87 | 135→117, 0.87 | 0 | WIN — structured finding compressed on both tokenizers; `ev:obs` only on observed command/test output |
| TKAB-L3-v03 | L3 | Codex→Claude | v0.3 | verbatim-heavy-code-review | indeterminate; `plain_mode_present: true` | L3 | 225→233, 1.04 | 133→148, 1.11 | 0 | NEGATIVE CONTROL PASS — plain/fenced passthrough preserved exact strings; expected LOSS |

W1/L1/W2/W3/W4/W5 and L1/L2/L3 are now fully scored. W3/L2 were rescored by Codex in the
verified TKAB env on 2026-06-17, closing Claude's local o200k/tiktoken gap. W3 remained L3 / zero
misparse but lost on both tokenizers. L2 correctly stayed `plain` and lost on both tokenizers.
Codex authored W4/L3 on 2026-06-17: W4 is the first v0.3 structured code-review finding that wins
on both tokenizers; L3 correctly preserves verbatim code review in plain/fenced form and loses.

## Findings

1. Both directions exercised (Claude→Codex and Codex→Claude); where independently re-scored
   (W1, L1) both agents produced identical scores.
2. The win case (W1) beats English on both tokenizers; the negative control (L1) correctly refuses
   dense reasoning and stays in prose — R1 compliance demonstrated live.
3. v0.3 status clones (W2, W5) were structurally valid and fully auditable (L3, zero misparse) but
   LOST on tokens in the authored style. First evidence that "operational + highly structured"
   does not guarantee compression: verbose `say … ev:obs` line-per-fact authoring inflated the
   clone past the English prose. Compression is an authoring-discipline property, not automatic.
4. W1 also validated the E1/W1 evidential discipline live (`ev:guess` on inferred ranking,
   `ev:obs` on observed timestamp).
5. W4 shows the opposite side of the same lesson: a compact structured finding can win when the
   source prose is dense with repeated file/command/default-path detail. `ev:obs` was reserved for
   observed command/test output, making W4 a calibration input for `tk-calibration-audit`.
6. The v0.3.2 `frameset_validation` field is present and report-only. W3 and W4 include
   informational slot/signature issues; L2/L3 have no checked ops. None of these changed parser
   acceptance, conformance level, or checker outcome.

## Data hygiene

1. Arm-field metadata bug fixed by Codex on 2026-06-17: `TKAB-W2-v03` pair/result JSON now carry
   `"arm": "W2"` and `TKAB-W5-v03` pair/result JSON now carry `"arm": "W5"`.
2. Version tagging: keep grammar version per data point (done in the table above). The mini-pilot
   (W1/L1) ran on v0.2; W2/W3/W4/W5/L2/L3 on v0.3. Do not pool ratios across versions when judging
   compression.
3. Checker/toolchain note: W3/L2/W4/L3 were scored by Codex on the v0.3.2 checker/toolchain
   surface with `frameset_validation` telemetry present and report-only.

## Scope boundary (PRD-027 R6.4)

These are pilot execution data. Running Tokenese v0.3 in the A/B is confirmed valid and scoped as
measurement-only (Maintainer, 2026-06-17). This artifact does NOT adopt v0.3 as a Turnfile default
or promote Tokenese beyond pilot — that requires published results plus an explicit Maintainer
decision (R6.4), tracked in the WORKLOG Maintainer Decision Queue.

## Coverage / remaining

- Fully scored: W1, L1 (v0.2 mini-pilot); W2, W3, W4, W5, L2, L3 (v0.3).
- Authored + conformant, token-score pending Codex verified env: none.
- Not yet authored: none for the Tier-A suite.
- `tk-calibration-audit` (R5.5) still gates trust in `^N`/`ev:` channels and remains pending; W4
  (with `ev:obs` discipline) feeds it.
- After the full suite is scored, this artifact is the published-results basis for any Maintainer
  decision on broader Tokenese adoption (R6.4).

## Provenance

- v0.3 pair inputs + checker outputs: `working-session/tokenese-pairs/` (`*.pair.json`,
  `*.result.json`; `anthropic_costs_sha 12e5fe08…`).
- v0.2 mini-pilot fixtures: `TKAB-W1.claude.codex.live1`, `TKAB-L1.codex.claude.live1` (tokenese
  checker env).
- Checker / grammar: `~/Git/tokenese` — `GRAMMAR-v0.3.md` 0.3.0, translator/checker 124/124,
  focused v0.3+TKAB 63/63, scorer schema `tkab-check-1.1` (PRD-027 R7; Turnfile references only).
