# DECISION 2026-06-18 Tokenese precision-pivot (Maintainer ratification requested)

Scope: Turnfile working-session decision artifact synthesizing session-24 second-level Tokenese
testing. This is a Maintainer-facing recommendation, NOT a normative Tokenese spec change. Per the
R7 cross-repo boundary, any grammar/spec text that the Maintainer ratifies is routed to
`~/Git/tokenese` and authored there — never edited from Turnfile. Inputs: the session-23/24 handoff
`HANDOFF-2026-06-19-tokenese-compression-second-level-testing.md`, fresh session-24 cross-model
receiver tests (Claude Opus 4.8 blind subagents + live Gemma 4 via oMLX), and the deterministic
`compression_eval` token table from `~/Git/tokenese`.

## The decision requested

Ratify the INTERIM repositioning of Tokenese's claim and design center — without relinquishing the
long-term compression goal.

- RETAINED GOAL (north-star, NOT abandoned): "Tokenese is a compression language." The Maintainer
  has not given this up. The evidence says we are not there *today* for general content, not that it
  is unreachable.
- INTERIM POSITION (what is defensible and what we ship now): "Tokenese is a precision-preserving
  structured interlingua with MEASURED compression against equally precise English, concentrated in
  structure English normally drops or explains verbosely: evidence class, confidence, ranked
  alternatives, repair/fallback state, and multi-referent amortization with reuse."

The relationship between the two: the interim position is a STEP toward the goal, not a replacement
for it. Compression is already achieved (30–59%) wherever Tokenese carries exploitable structure
(Evidence 1, 1b); the gap is flat/simple content where terse English is already near-minimal. So the
roadmap to the retained goal is to widen the set of regimes that carry exploitable structure and to
push tokenizer-native redesign (I6/S3 show the new operators already beat old v0.3 but not yet terse
English — headroom exists). The interim spec changes below must not foreclose that; each is chosen to
*increase* receiver-safe density, which is the same direction the compression goal needs.

Recommendation: RATIFY the interim position; KEEP compression as the retained north-star with the
trajectory above. The blanket "generally more compressed than English" CLAIM is empirically dead and
should not be made today; the goal behind it is not.

Maintainer ratification (session 24, 2026-06-18): AGREED to the direction. Compression intent
explicitly retained as the long-term goal; precision-preserving interim accepted; language changes
authorized for the interim. (Sam, direct.)

## Evidence 1 — compression is regime-dependent (deterministic token counts)

Source: `tokenese_translator.compression_eval` (o200k / cl100k), session-24 fresh run. Candidate vs
the *equally precise* or terse English baseline. Positive = Tokenese saves tokens.

WINS (structure-dense regimes):

| Case | Candidate | Baseline | Save o200k | Structure carried |
|---|---:|---:|---:|---|
| I1 symbol-table amortization | 44 | 84 | 48% | repeated referent (`@a`) |
| S2 amortized domain session | 59 | 108 | 45% | multi-referent session |
| S1 probabilistic semantic packet | 38 | 64 | 41% | confidence + ranks |
| I9 distribution-first assertions | 29 | 48 | 40% | ranked alternatives |
| I8 precision channels | 49 | 79 | 38% | evidence + confidence + rank + repair |
| P1 precision-distribution | 32 | 52 | 38% | ranked alternatives |
| P2 anchored precision | 23 | 34 | 32% | anchored evidence |
| I2 whole-phrase admission | 16 | 23 | 30% | admitted phrase |
| P3 handle-glossary | 39 | 54 | 28% | repeated referent |
| I10 semantic neighborhood | 28 | 36 | 22% | near/far structure |
| I3 domain-pack devops | 32 | 40 | 20% | domain pack |
| I7 controlled abbreviation | 32 | 38 | 16% | glossary |

LOSES or TIES (flat regimes — terse English already minimal):

| Case | Candidate | Baseline | Result |
|---|---:|---:|---|
| S5 session-state table | 59 | 54 | LOSE (flat state table) |
| I4 dense-table status | 37 | 30 | LOSE (simple status) |
| I6 tokenizer-native operators | 23 | 18 | LOSE vs terse (but beats old v0.3 = 47) |
| S3 grammar redesign | 21 | 18 | LOSE vs terse (but beats old v0.3 = 47) |
| S4 domain fact-table | 61 | 62 | ~TIE |
| I5 lossless elision | 29 | 29 | TIE |

Reading: the old v0.3 flagship example REGRESSED (47 vs 37 terse English). The new operator syntax
fixes that regression (23 vs 47) but still does not beat terse English on flat content — and it does
not need to. Real, large savings (30–48%) appear only where the payload carries referents,
evidence/confidence, ranked alternatives, or neighborhood structure. This is the empirical backbone
of the pivot.

## Evidence 1b — referent amortization is CONDITIONAL (multi-turn N-curve)

The handoff carried I1's one-shot 48% forward as the headline amortization win. Session-24 ran the
multi-turn N-curve it asked for (single referent, N = 1/3/5/10/20 operations, `count_o200k`), and the
result narrows the claim materially. Tokenese binds `@a=<long referent>` once, then references `@a`;
English either repeats the full referent or pronominalizes ("its").

| Baseline (o200k savings, +=Tokenese wins) | N=1 | N=3 | N=5 | N=10 | N=20 |
|---|---:|---:|---:|---:|---:|
| vs repeat-English (re-types the referent) | −20% | +43% | +55% | +65% | +70% |
| vs pronoun-English (`its …`) | −9% | −13% | −15% | −19% | −21% |

Finding: amortization beats repeat-English decisively (crossover between N=1 and N=3, climbing to
70%), but LOSES to pronoun-English at every N — and loses more as N grows, because `get @a status` is
heavier per line than "Get its status." and carries the binding-line overhead. So the referent win is
real but conditional: it requires a context where pronouns cannot disambiguate — i.e. MULTIPLE
interleaved long referents (the S2 multi-referent session, +45%). For a single salient referent,
pronoun-English wins. The I1 one-shot 48% was measured against a repeat-style baseline and oversells
the single-referent case; the defensible amortization claim is "multiple distinct referents that
defeat pronominalization," not "any repeated referent." This tightens, not weakens, the pivot.

Confirmed with a 3-referent interleaved session (English must qualify each referent; Tokenese binds
`@a`/`@b`/`@c`):

| Multi-referent (o200k savings) | N=3 | N=6 | N=12 | N=21 |
|---|---:|---:|---:|---:|
| Tokenese vs disambiguating-English | −21% | +26% | +49% | +59% |

Crossover lands between N=3 and N=6 — once each of the three referents is reused ~2×; below that the
binding overhead dominates. This is the operative amortization regime and generalizes S2's single
+45% point into a curve: bind-and-reference pays off in multi-referent sessions with reuse, and only
there.

## Evidence 2 — receiver fidelity holds in the same regimes (cross-model)

Three blind Claude Opus 4.8 receivers (fresh subagents, never saw the handoff or the rubric) decoded
the top-3 candidates cold into the handoff's JSON schema. Live Gemma 4 (oMLX) confirmed C5 = 0.9375
and the handoff's prior per-candidate scores stand. Scored against the handoff rubric:

| Dimension | I1 | C4b (`*_rank`) | revised I8 |
|---|---|---|---|
| Binding preserved (long target, not collapsed) | PASS (100%) | n/a | n/a |
| Evidence class preserved (line-local obs/guess) | n/a | PASS | PASS |
| Confidence preserved (`8/9`) | n/a | n/a | PASS |
| Rank ORDER preserved | n/a | PASS | PASS |
| Rank SEMANTIC (ordinal vs score locked) | n/a | PARTIAL | PARTIAL |
| Repair state preserved | PASS (if-fail branch) | n/a | PASS (`timestamp -> plain`) |
| No probability misread | PASS | PASS (ruled out) | PASS (ruled out) |
| No unsafe escalation | PASS (flagged, not commanded) | PASS (advisory) | PASS (advisory) |
| Ambiguity surfaced not silently resolved | STRONG | STRONG | STRONG |

The strong-receiver tier (Claude) MEETS every handoff threshold for the precision-preserving
candidates (binding 100%, rank-order 100%, evidence with no false `ev:obs` upgrade, confidence and
repair preserved, probability-misread 0%, zero unsafe escalation). Gemma (weaker tier) meets most
(1.0 on I1 / revised I8 / C3; 0.94 on C4b). Fidelity and compression co-occur in the same regimes.

Two real defects surfaced by strong receivers (these are the actionable spec signals):

1. Ordinal-vs-score is NOT locked even with the `_rank` suffix. Both Claude receivers noticed
   `cause_rank`/`fix_rank` "suggest ranking intent" yet still hedged to "scores/weights." Naming a
   lane `rank` is necessary but insufficient.
2. `@a=…deploy` leaks a binding-vs-command ambiguity: a receiver flagged that `deploy` could be
   imperative, and that `retry-state` could parse as the imperative `retry` + `state`. Bindings and
   queries need an explicit, non-imperative form (handoff safety finding #4).

## Per-candidate disposition

- ADVANCE (precision-preserving, compression + fidelity both proven): I1 (referent amortization —
  N-curve now run, see Evidence 1b: scope the claim to MULTI-referent sessions where pronouns fail,
  not single-referent), revised I8 (precision channels), I9 / C4b (distribution-rank, pending the
  ordinal-lock fix).
- REVISE THEN ADVANCE: C3 advisory incident packet (add subject handle + clearer advisory action
  tokens); C5 near/far (adopt `far_from[...]` or split lines — positive-weight `far[...]` leaks
  polarity, confirmed 0.9375 + polarity flag).
- HOLD as multi-turn only, not one-shot proof: C1 (combines channels; one-shot save ~10–11%; needs
  session amortization).
- DROP as written: C2 word-neighborhood (Gemma 0.60, weighted-sense layer dropped); `~=` / `!~=`
  operators (repeatedly misread as equivalence).

## Answers to the handoff's six open questions (evidence-grounded)

1. `rank` first-class with ordinal semantics? YES, but naming is insufficient — add a normative rule
   that bracketed numbers are ordinal weights unless a score scale is explicitly declared, plus an
   ordinal marker the receiver can't drop. (Evidence: rank ORDER 100%, but strong receivers hedged
   to "scores" even with `_rank`.)
2. `confidence:8/9` replace/supplement `^8`? REPLACE in examples. `confidence:N/M` recovered
   reliably; `^8` was dropped by Gemma and is consistent with the calibration audit's "`^N`
   untrusted." Keep `^N` only as optional shorthand, flagged untrusted.
3. `repair:<slot> -> plain` replace `?? <slot> plain`? REPLACE for receiver clarity (`repair:… ->
   plain` recovered; `?? ts plain` dropped).
4. `near[...]`/`far_from[...]`, abandon `~=`? YES abandon `~=`; adopt `near[...]` / `far_from[...]`.
   Positive-weight `far[...]` is insufficient — polarity is structural and droppable.
5. Safety marker distinguishing advisory from command? Default is advisory; an imperative requires an
   explicit command marker AND an approval gate (e.g. `cmd! … gate:<approver>`). Never let a bare
   line like `sev>=2 -> rollback @p` read as a command. (Evidence: I1 imperative leak.)
6. Minimum cross-model receiver pass rate for spec changes? Do NOT use one aggregate number. Require
   the handoff's PER-DIMENSION thresholds met on ≥2 independent receiver families before a spec
   change lands in `~/Git/tokenese`. Session-24 has Claude + Gemma; round-2 adds Codex + Gemini
   (routed) and optional Perplexity as external critic.

## Recommended grammar DIRECTION (proposal to route to ~/Git/tokenese — not a spec edit here)

```text
@a=<long referent>                         # binding only; never imperative
status @a:up ev:obs confidence:8/9         # line-local evidence + confidence
cause_rank @a[oom:6 disk:3 net:1] ev:guess # ordinal weights (declare score scale to override)
act_rank @a[restart:5 logs:4 rollback-review:2] ev:guess  # advisory ranks
repair @a.timestamp -> plain               # explicit repair/fallback
# state-changing command form, gated:
# cmd! restart @a gate:<approver>
```

## Recommendation

1. RATIFIED (session 24): adopt the interim precision-preserving position; KEEP compression as the
   retained north-star goal with the trajectory in "The decision requested." Stop making the blanket
   "generally more compressed" claim today; do not drop the goal.
2. Route the grammar-direction proposal + the six OQ answers to `~/Git/tokenese` as the interim
   spec-change work item (R7). The retained compression goal + this trajectory also belong in the
   tokenese repo's `INTENT.md` so the north-star survives the interim. Turnfile governance stays
   English-only; Tokenese remains a bounded Tier-B operational/handoff twin lane, English source-wins.
3. Each interim spec change is chosen to INCREASE receiver-safe density (the compression direction),
   never to lock in verbosity — so the interim does not foreclose the goal.
4. Authorize (optional, separate) round-2 cross-model receiver testing (Codex + Gemini decode the
   top-3 blind; Perplexity optional external critic) to satisfy OQ#6's ≥2-family rule before the spec
   change lands.
5. Feed this evidence into PRD-035 (Tokenese observation/result sync; Gemini lead) as calibration
   input — without coupling the decision to PRD-035's lifecycle.
6. Roadmap toward the retained goal (open research lane): widen the regimes that carry exploitable
   structure; push tokenizer-native redesign (I6/S3 headroom: new operators beat old v0.3 but not yet
   terse English); periodically re-measure against the equal-precision baseline to track progress.

## Carry-forward

- Round-2 receiver decodes: route blind top-3 to Codex + Gemini; capture per-dimension scores.
- DONE this session: multi-turn I1 referent-amortization N-curve (Evidence 1b) — corrected the
  single-referent overclaim; amortization is conditional on multi-referent pronoun-defeat.
- DONE this session: multi-referent N-curve (`@a`/`@b`/`@c` interleaved) — crossover N≈4–6, scaling
  to +59% at N=21 (Evidence 1b). The pronoun-defeat amortization regime is now a curve, not a point.
- Tokenese repo dirty-state caveat (handoff): `INTENT.md` / `README.md` / `spec.md` carry unrelated
  pre-existing edits; review before staging any spec change.
