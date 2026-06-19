# Tokenese Second-Level Testing - Codex Notes

Date: 2026-06-19
Actor: Codex
Source handoff: `working-session/docs/HANDOFF-2026-06-19-tokenese-compression-second-level-testing.md`

## Scope

This is a Turnfile-side testing note, not a Tokenese spec change. Tokenese language artifacts remain owned by `/Users/snap/Git/tokenese`.

## Current Interpretation

The broad claim "Tokenese is generally more compressed than English" should be treated as failed or at least unsupported. The viable hypothesis is narrower:

Tokenese can be useful when it preserves structured precision that terse English often drops, especially bindings, evidence class, confidence, ranked alternatives, repair state, and repeated referents.

## Compression Eval

Command:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.compression_eval --suite tokenese_translator/evals/hypothesis_cases.json --format markdown
```

Result: command completed successfully.

Notable winners:

| Case | Baseline | Candidate | o200k delta | cl100k delta |
|---|---:|---:|---:|---:|
| I1 symbol-table amortization | 84 | 44 | -40 | 92 -> 45 |
| I8 precision channels | 79 | 49 | -30 | 80 -> 49 |
| I9 distribution-first assertions | 48 | 29 | -19 | 48 -> 29 |
| S2 amortized-domain-session | 108 | 59 | -49 | 113 -> 63 |
| P1 precision-distribution | 52 | 32 | -20 | 53 -> 32 |

Notable weak or losing cases:

| Case | Baseline | Candidate | Result |
|---|---:|---:|---|
| I4 dense-table-status | 30 | 37 | candidate loses |
| I5 lossless-elision-defaults | 29 | 29 | no compression gain |
| S4 domain-fact-table-precision-lanes | 62 | 61 | negligible gain |
| S5 session-state-table | 54 | 59 | candidate loses |

Conclusion: advance structured precision and amortized-session candidates, not dense tables or broad compactness claims.

## Live Receiver Eval

Command attempted:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.receiver_eval --live --min-score 0.75
```

Sandboxed attempt failed because localhost access was not permitted. Escalated retry reached the local HTTP path but stalled waiting on a chunked response from the oMLX server. Codex interrupted the run after a prolonged no-output wait.

Observed blocker:

```text
KeyboardInterrupt while reading chunked HTTP response in receiver_eval.py
```

Interpretation: live receiver fidelity is not invalidated, but this Turnfile run does not have fresh live Gemma receiver scores. Treat the handoff's prior receiver scores as historical until the local server path is rechecked.

## Recommended Test Matrix

Use a three-layer matrix:

1. Compression measurement: compare candidate against equally precise English, not against vague terse English.
2. Receiver readback: force JSON fields `bindings`, `claims`, `evidence`, `confidence`, `ranks`, `repairs`, `ambiguities`, and `unsafe_actions`.
3. Safety classification: distinguish advisory rankings from executable commands.

Candidate priorities:

| Priority | Candidate family | Reason |
|---|---|---|
| P1 | I1 symbol-table amortization | Strong token win and safe read-only operational shape |
| P1 | I8 revised precision channels | Strong token win and preserves evidence/confidence/repair |
| P1 | I9/C4b rank syntax | Tests ordinal semantics and probability-misread risk |
| P2 | C1 stateful probabilistic session | Needs multi-turn amortization; weak one-shot proof |
| P2 | C3 advisory incident packet | Promising but needs subject/environment/timestamp clarity |
| P3 | C5 near/far weighted | Needs `far_from` or split-line polarity before promotion |
| Drop | S1 `~=` / `!~=` | Receiver misreads operators as equivalence/not-equivalence |

## Codex Position

Tokenese should pivot toward "precision-preserving structured interlingua with measured compression against equally precise English." Do not advance Tokenese as a general compression language until cross-model receiver tests prove that claim, and current data does not.

Grammar direction to test, not yet adopt:

```text
@a=<long referent>
status @a:up ev:obs confidence:8/9
cause_rank @a[oom:6 disk:3 net:1] ev:guess
act_rank @a[restart:5 logs:4 rollback-review:2] ev:guess
repair @a.timestamp -> plain
```

Open questions for Gemini/Claude review:

1. Should `rank` become first-class ordinal syntax?
2. Should `confidence:8/9` replace `^8` in examples where receiver fidelity matters?
3. Should `repair:<slot> -> plain` replace `?? <slot> plain` for receiver clarity?
4. Should semantic-neighborhood syntax abandon `~=` and use `near[...]` / `far_from[...]`?
5. What marker separates advisory next actions from executable commands?
6. What cross-model receiver pass rate is sufficient for Tokenese spec-level changes?
