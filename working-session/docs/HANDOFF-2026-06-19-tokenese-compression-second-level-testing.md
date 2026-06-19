# HANDOFF 2026-06-19 Tokenese compression second-level testing

Scope: Turnfile working-session handoff for the next Tokenese testing session. This is a transition artifact for Turnfile coordination, not a normative Tokenese spec change. Tokenese repo artifacts remain source for the eval harness and fixture details.

## Status

Open. Start next Turnfile session from this handoff if the Maintainer wants Claude Opus 4.8, Gemini 3.5 Flash, Codex, and optionally Perplexity to run deeper behavioral tests on the current Tokenese compression candidates.

## Source context

Tokenese compression premise was re-examined after the old flagship example failed measurement:

- Verbose English: 36 o200k / 37 cl100k
- Terse English: 18 o200k / 19 cl100k
- Old Tokenese v0.3 example: 47 o200k / 48 cl100k

Conclusion from Tokenese repo work: broad “Tokenese is generally more compressed than English” is not defensible. The surviving path is narrower and more interesting: Tokenese can beat equally precise English when it transmits structure English normally drops or explains verbosely, especially evidence, confidence, ranked alternatives, repair state, and repeated referents.

## Tokenese repo artifacts created this session

In `/Users/snap/Git/tokenese`:

- `tools/translator/tokenese_translator/compression_eval.py`
- `tools/translator/tokenese_translator/receiver_eval.py`
- `tools/translator/tokenese_translator/evals/compression_cases.json`
- `tools/translator/tokenese_translator/evals/hypothesis_cases.json`
- `tools/translator/tokenese_translator/evals/receiver_cases.json`
- `tools/translator/tests/test_compression_eval.py`
- `tools/translator/tests/test_hypothesis_eval.py`

Also added:

- `count_cl100k` in `token_count.py`
- console scripts in `tools/translator/pyproject.toml`:
  - `tokenese-compression-eval`
  - `tokenese-receiver-eval`

Project-env validation at close:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m pytest -q
# 152 passed

cd /Users/snap/Git/tokenese
.venv/bin/python -m pytest -q test_audit_anthropic.py test_audit_gemma4.py
# 7 passed
```

Important environment caveat: bare `python3` or bare `pytest` may fail outside the repo `.venv` because `tiktoken` / `tokenizers` may be absent. Use the project `.venv` unless explicitly testing portability.

## Local Gemma / oMLX status

The local oMLX server is the `jundot/omlx` OpenAI-compatible API at:

```text
http://localhost:8000/v1
```

Verified model list:

```json
{"id":"gemma-4-e4b-it-4bit","owned_by":"omlx"}
```

After the Maintainer restarted/fixed generation, the live receiver eval ran successfully:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.receiver_eval --live --min-score 0.75
```

The expanded combo suite currently exits nonzero only when a candidate falls below the threshold. That is expected for failing candidates like C2; inspect JSON output rather than treating nonzero as infrastructure failure.

## Current top three

### 1. I1 symbol-table amortization

Candidate:

```text
@a=pcegwmrsxzzznowwnksu supabase edge-fn deploy
get @a status
if fail -> get @a logs first-error+ts
then get @a owner retry-state
```

Token result:

- Candidate: 44 o200k / 45 cl100k
- Terse English baseline: 84 o200k / 92 cl100k
- Savings: 47.62% o200k / 51.09% cl100k

Gemma receiver score: 1.0.

Gemma recovered target, status query, failure logs, first error, timestamp, owner, retry state. Weakness: Gemma paraphrased the first line as “deploy” rather than “bind deploy target” in one output; still preserved the operational meaning. This candidate is read-only and relatively safe.

Next Turnfile test: multi-turn amortization, not just one-shot. Use repeated referent counts 1, 3, 5, 10, 20. Compare against terse English with pronouns and shorthand.

### 2. I9 / C4b distribution-rank syntax

Preferred candidate syntax after C4 variants:

```text
cause_rank[oom:6 disk:3 net:1] ev:obs
fix_rank[restart:5 logs:4 rollback:2] ev:guess
```

Why C4b over alternatives:

- C4a `cause[...]@obs` works but `@obs` is confusable with a handle, not canonical evidential syntax.
- C4c `cause_score[...]` works for Gemma but weakens ordinal semantics; “score” can be read as calibrated score, utility, probability, or confidence.
- C4b’s explicit `rank` best preserves ordinal intent across GPT receiver review.

Token result for C4b rough baseline:

- Candidate: 33 o200k / 33 cl100k
- Equal-precision English: 42 o200k / 43 cl100k
- Savings: about 21% / 23%

Gemma receiver score for C4b: 0.9444. It recovered rank values and guessed fix evidence, but missed the word “observed” in the simple term scorer while paraphrasing “based on observation.” Treat as semantic pass with scorer limitation.

Next Turnfile test: rank preservation and probability-misread. Ask each model whether values are probabilities, ranks, scores, or confidence. Desired answer: ordinal/ranked weights unless explicitly declared otherwise.

### 3. Revised I8 precision channels

Revised candidate:

```text
status:up ev:obs confidence:8/9
cause[oom:6 disk:3 net:1] ev:guess
act[restart:5 logs:4 rollback:2] ev:guess
repair:timestamp -> plain
```

Why revised: the earlier compact form used `^8` and `?? ts plain`; Gemma dropped confidence, timestamp repair, and plain output. The revised form is more English-like and recovered perfectly.

Token result:

- Candidate: 49 o200k / 49 cl100k
- Equal-precision English baseline: 79 o200k / 80 cl100k
- Savings: 37.97% o200k / 38.75% cl100k

Gemma receiver score: 1.0.

Gemma recovered status up, observed evidence, confidence 8/9, cause rank, action rank, repair target timestamp, and plain output request.

Next Turnfile test: preserve evidence/confidence/rank/repair state under readback across Claude Opus 4.8, Gemini 3.5 Flash, Codex, local Gemma, and optional Perplexity.

## Other combo tests and disposition

### C1 stateful probabilistic session

Candidate:

```text
@a=pcegwmrsxzzznowwnksu supabase edge-fn deploy
status @a:up ev:obs confidence:8/9
cause @a[oom:6 disk:3 net:1] ev:guess
act @a[restart:5 logs:4 rollback:2] ev:guess
repair @a.timestamp -> plain
```

Gemma receiver score: 0.92.

Good: combines referent binding with precision/ranking/repair. Bad: one-shot token savings only about 10-11% because it combines several channels. Likely needs multi-turn session amortization to shine. GPT receiver said syntax is semantically decent but not yet robust/formal enough.

Disposition: advance only as multi-turn/session test, not as one-shot compression proof.

### C3 advisory incident packet

Candidate:

```text
^pack:incident
sev:2 scale:0..4 ev:obs confidence:8/9
cause[oom:6 disk:3 net:1] ev:guess
next[page-owner:5 inspect-logs:4 rollback-review:2] ev:guess
```

Gemma receiver score: 1.0.

Good: preserves severity scale, confidence, causes, advisory next-step ranks. GPT receiver flagged missing subject/service/environment/timestamp and ambiguous `page-owner` / `rollback-review`.

Disposition: promising if revised with a subject handle and clearer advisory action tokens. Keep state-changing actions as advisory review lanes, not commands.

### C5 near/far weighted

Candidate:

```text
guardrail near[policy:7 compliance-control:6] far[preference:5 ui-rail:8] ev:obs confidence:8/9
```

Gemma receiver score: 0.9375 by term scorer, but paraphrase was weak: “The guardrail is near, and the far element is related to the UI-rail.” GPT receiver recovered intended meaning better but flagged polarity ambiguity: `far[...]` uses positive weights, so polarity is structural and can be missed.

Disposition: do not advance until syntax makes polarity harder to drop. Possible revision:

```text
guardrail near[policy:7 compliance-control:6] far_from[preference:5 ui-rail:8] ev:obs confidence:8/9
```

or split lines:

```text
guardrail near[policy:7 compliance-control:6]
guardrail far_from[preference:5 ui-rail:8]
ev:obs confidence:8/9
```

### C2 word neighborhood

Candidate:

```text
guardrail near:safety-policy far:ui-rail far:preference
sense[policy:7 compliance-control:6 preference:-5 ui-rail:-8]
ev:obs confidence:8/9
```

Gemma receiver score: 0.60. It recovered near/far but dropped weighted sense layer. Do not advance as written.

### S1 old semantic packet with `~=` / `!~=`

Gemma repeatedly misread `~=` / `!~=` as equivalence/not-equivalence rather than vector-neighborhood near/far. Drop these operators for semantic-neighborhood work.

## Safety / semantics findings

1. Opaque sigils lose to compact words when receiver fidelity matters.
   - Bad: `^8`, `?? ts plain`, `~=`, `!~=`.
   - Better: `confidence:8/9`, `repair:timestamp -> plain`, `near`, `far_from`, `rank`.

2. `rank` beats `score` when the semantics are ordinal.
   - `score` invites calibrated numeric interpretation.
   - Use `rank` unless we explicitly define a score scale.

3. State-changing actions need gates.
   - `sev>=2 -> rollback @p` is unsafe as a command.
   - Prefer advisory forms like `next[rollback-review:2]` unless an explicit imperative + approval gate exists.

4. Handle syntax works, but shorthand around it must be precise.
   - `?p` was ambiguous; use `? @p` or another explicit query form.
   - Bindings must preserve the long target, not collapse to “current package.”

5. Evidence/confidence scope must be line-local unless explicitly declared.
   - Prefer one line per claim with its own `ev:*` and `confidence:*` where scope matters.

## Recommended next Turnfile protocol for deeper testing

Use a three-part receiver packet per candidate:

1. Candidate payload only.
2. Receiver instruction: decode into JSON with keys `paraphrase`, `bindings`, `claims`, `evidence`, `confidence`, `ranks`, `repairs`, `ambiguities`, `unsafe_actions`.
3. Scoring rubric hidden from receiver but available to evaluator:
   - binding preserved
   - evidence class preserved
   - confidence preserved
   - rank order preserved
   - all alternatives preserved
   - repair state preserved
   - no probability misread
   - no unsafe action escalation
   - ambiguity surfaced rather than silently resolved

Run across:

- Claude Opus 4.8
- Gemini 3.5 Flash
- Codex
- local Gemma 4 via oMLX
- optional Perplexity as external checker/critic

Suggested minimum pass thresholds for next round:

- Binding preservation: 100% for I1/C1.
- Rank order preservation: 100% for I8/I9/C4b.
- Evidence preservation: 90%+ and no false `ev:obs` upgrade.
- Confidence preservation: 90%+ when present.
- Repair preservation: 90%+ for revised I8.
- Unsafe action score: zero unapproved production state-changing commands.
- Probability misread: less than 20% unless syntax explicitly says probability.

## Commands for next session

Token counts:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.compression_eval --suite tokenese_translator/evals/hypothesis_cases.json --format markdown
```

Gemma receiver eval:

```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.receiver_eval --live --min-score 0.75
```

If Gemma fails:

```bash
curl -sS http://localhost:8000/v1/models
curl -sS -X POST http://localhost:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"gemma-4-e4b-it-4bit","messages":[{"role":"user","content":"Say ok"}],"max_tokens":32}'
```

## Recommended next-session outcome

Decide whether Tokenese pivots from “compression language” to “precision-preserving structured interlingua with measured compression against equally precise English.” Current evidence supports that pivot more strongly than any general terse-English compression claim.

Candidate grammar direction emerging from evidence:

```text
@a=<long referent>
status @a:up ev:obs confidence:8/9
cause_rank @a[oom:6 disk:3 net:1] ev:guess
act_rank @a[restart:5 logs:4 rollback-review:2] ev:guess
repair @a.timestamp -> plain
```

Open questions for the next session:

1. Should `rank` become a first-class lane name with ordinal semantics?
2. Should `confidence:8/9` replace or supplement `^8` in grammar examples?
3. Should `repair:<slot> -> plain` replace or supplement `?? <slot> plain` for receiver clarity?
4. Should semantic-neighborhood syntax use `near[...]` / `far_from[...]` and abandon `~=` entirely?
5. What explicit safety marker distinguishes advisory recommendations from commands?
6. What minimum cross-model receiver pass rate is enough to justify spec-level changes?

## Dirty-state note

The Tokenese repo currently has unrelated pre-existing local edits in `INTENT.md`, `README.md`, and `spec.md`, plus this session's eval harness additions under `tools/translator`. Do not assume all dirty files belong to the same change. Review before staging.
