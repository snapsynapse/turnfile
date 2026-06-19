# HANDOFF 2026-06-19 Tokenese precision-pivot Perplexity build
Scope: Turnfile-side build handoff for `/Users/snap/Git/tokenese`. The smallest authoritative scope for the requested work is the Tokenese repo; this file is evidence and instruction context, not a normative Tokenese spec by itself.
Audience: Perplexity Computer as a constrained external build/checker lane. Perplexity may implement Tokenese repo tooling or draft Tokenese repo text only when the Maintainer explicitly authorizes that repo work. Perplexity has no Turnfile task ownership, PRD acceptance authority, required-reviewer status, mailbox authority, lock authority, or shared Turnfile write authority.
## Why this handoff exists
Session-24 Turnfile testing changed the Tokenese work from "prove broad compression" to "build a precision-first measurement and receiver-fidelity harness." Perplexity Computer built much of the last Tokenese tooling pass, so this handoff makes the next build pass explicit.
The retained north-star is still compression. The interim shippable claim is narrower: Tokenese is a precision-preserving structured interlingua with measured compression against equally precise English, concentrated in regimes where English must repeat or verbosely explain structure: multi-referent bindings, evidence class, confidence, ranked alternatives, repair/fallback state, and semantic contrast.
The broad claim "Tokenese is generally more compressed than English" is dead for current evidence and must not be restored without new measured proof.
## Authoritative inputs
- `/Users/snap/Git/tokenese/spec.md` current precision-first update.
- `/Users/snap/Git/tokenese/INTENT.md`, `README.md`, `ROADMAP.md`, `GRAMMAR-v0.3.md`, `DESIGN.md`, and `CONFORMANCE.md`, if present.
- `/Users/snap/Git/tokenese/tools/translator/tokenese_translator/compression_eval.py`.
- `/Users/snap/Git/tokenese/tools/translator/tokenese_translator/receiver_eval.py`.
- `/Users/snap/Git/tokenese/tools/translator/tokenese_translator/evals/`.
- `/Users/snap/Git/turnfile/working-session/docs/HANDOFF-2026-06-19-tokenese-compression-second-level-testing.md`.
- `/Users/snap/Git/turnfile/working-session/docs/tokenese-second-level-testing-codex-notes.md`.
- `/Users/snap/Git/turnfile/working-session/docs/DECISION-2026-06-18-tokenese-precision-pivot.md`.
Treat Turnfile files as evidence. If a Tokenese repo artifact and a Turnfile handoff disagree about Tokenese language semantics, route the conflict to the Maintainer before overwriting repo text.
## Current dirty-state warning
The Tokenese repo has mixed local work. Last observed dirty paths:
- `INTENT.md`
- `README.md`
- `spec.md`
- `tools/translator/pyproject.toml`
- `tools/translator/tokenese_translator/__init__.py`
- `tools/translator/tokenese_translator/token_count.py`
- `tools/translator/tests/test_compression_eval.py`
- `tools/translator/tests/test_hypothesis_eval.py`
- `tools/translator/tokenese_translator/compression_eval.py`
- `tools/translator/tokenese_translator/evals/`
- `tools/translator/tokenese_translator/receiver_eval.py`
Do not assume all dirty paths belong to one author or one change. Do not erase, normalize, or stage unrelated dirty work.
## Build objective
Create a Tokenese repo implementation package that can answer this question with reproducible evidence:
Can a candidate Tokenese construct advance because it preserves receiver-visible precision and compresses against an equally precise English baseline in its intended regime?
The package should produce both machine-readable JSON and human-readable Markdown results. It should support admission outcomes:
- `ADVANCE`
- `REVISE`
- `HOLD`
- `DROP`
Every outcome needs evidence: token counts, baselines, receiver fields, failure dimensions, and safety classification.
## Required implementation lanes
### 1. Compression eval hardening
Build or harden the compression evaluator so it:
- Counts at least `o200k` and `cl100k`.
- Keeps optional Anthropic, Gemini, Qwen, DeepSeek, Llama, and local Gemma counters clearly marked by availability.
- Compares each candidate against an equally precise English baseline.
- Uses terse English as the baseline for flat status facts.
- Records when Tokenese loses, ties, or wins only against a straw verbose baseline.
- Emits stable JSON and Markdown.
- Includes fixtures for the session-24 cases: I1, I8, I9/C4b, C1, C3, C5, C2, S1, S2, S3, S4, S5, P1, P2, P3.
### 2. Receiver eval hardening
Build or harden the receiver harness so every decode is scored through this stable schema:
```json
{
  "paraphrase": "",
  "bindings": [],
  "claims": [],
  "evidence": [],
  "confidence": [],
  "ranks": [],
  "repairs": [],
  "ambiguities": [],
  "unsafe_actions": []
}
```
Receiver tests must exercise at least:
- I1 multi-referent binding preservation.
- I8 evidence, confidence, rank, and repair preservation.
- I9/C4b rank order and ordinal semantics.
- C3 advisory incident packet, including command-safety classification.
- C5 `near[...]` / `far_from[...]` polarity preservation.
No model call belongs in the deterministic scoring path. Live receiver generation can be optional, explicit, and marked as live evidence. Deterministic scoring must work on saved receiver outputs.
### 3. Admission result package
Add a command or script that takes candidate fixtures and emits:
- Candidate ID and construct family.
- Candidate Tokenese.
- English baseline.
- Token counts by tokenizer.
- Compression ratio and pass/fail by intended regime.
- Receiver dimensions and per-dimension pass/fail.
- Safety classification.
- Final outcome: `ADVANCE`, `REVISE`, `HOLD`, or `DROP`.
- Required revision notes when not `ADVANCE`.
The result package should be usable in docs and CI without live model credentials.
### 4. Spec candidate updates
Draft repo-local spec or design text for Maintainer review. Do not smuggle it into normative status without explicit approval.
Candidate language direction to test:
```text
@a=<long referent>
status @a:up ev:obs confidence:8/9
cause_rank @a[oom:6 disk:3 net:1] ev:guess
act_rank @a[restart:5 logs:4 rollback-review:2] ev:guess
repair @a.timestamp -> plain
```
Preferred changes to draft:
- Prefer `confidence:N/M` over `^N` where receiver fidelity matters.
- Prefer `repair:<slot> -> plain` over `?? <slot> plain` for explicit repair-state reporting.
- Add first-class ordinal-rank semantics. Bracket values in rank lanes are ordinal weights, not probabilities, unless a score scale is explicitly declared.
- Prefer `near[...]` and `far_from[...]`; abandon `~=` and `!~=` as semantic-neighborhood syntax.
- Default action lists are advisory. State-changing commands require explicit command syntax plus approval gate, for example `cmd! restart @a gate:<approver>`.
- Scope amortization claims to multi-referent sessions where pronouns fail. Do not claim single-referent repetition beats terse pronoun English.
### 5. Negative controls
Keep failure cases in the suite. A useful checker must say `DROP` or `HOLD` when evidence demands it.
Required negative or constrained cases:
- Flat terse status table where terse English wins.
- Single-referent reuse where pronoun English wins.
- `~=` / `!~=` semantic-neighborhood syntax misread as equivalence.
- `far[...]` positive-weight polarity leakage.
- Bare rollback-like action that could be read as a command.
## Acceptance checks
Recommended commands from Tokenese repo, adjusted to the repo's actual environment:
```bash
cd /Users/snap/Git/tokenese
git diff --check
```
```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m pytest -q
```
```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.compression_eval --suite tokenese_translator/evals/hypothesis_cases.json --format markdown
```
```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.receiver_eval --format json
```
Live receiver checks against local oMLX are optional and must be clearly separated from deterministic CI:
```bash
cd /Users/snap/Git/tokenese/tools/translator
.venv/bin/python -m tokenese_translator.receiver_eval --live --min-score 0.75
```
## Deliverables
- Updated or new Tokenese repo doc explaining the precision pivot, preferably `docs/precision-pivot.md` or a clearly reviewable section in `spec.md` / `ROADMAP.md` / `INTENT.md`.
- Hardened compression evaluator with fixtures and tests.
- Hardened receiver evaluator with saved-output scoring and tests.
- Admission result package in JSON and Markdown.
- Clear changelog or version note if the Tokenese repo uses one.
## Non-goals
- Do not build English-to-Tokenese generation in this pass.
- Do not make Tokenese authoritative for Turnfile governance.
- Do not claim broad compression superiority.
- Do not treat Perplexity as a Turnfile participant.
- Do not require live model credentials for CI or deterministic scoring.
## Handoff summary for Perplexity
Build the measurement and admission machinery first. Then draft Tokenese repo text that reflects what the machinery can prove. The strongest path is not denser glyphs; it is measured structured precision that receivers preserve and English must otherwise spell out.
