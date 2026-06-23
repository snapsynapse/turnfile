# v1 Cross-Repo Test Evidence — Tokenese (Test 1) — 2026-06-23

Per PRD-047 R6 (cross-repo dogfood test evidence contract).

## Target repo

- **Path:** `/Users/snap/Git/tokenese` (Tokenese, https://github.com/snapsynapse/tokenese)
- **State at session open:** `v0.3.9` released (Phase A complete; HANDOFF.md item 5 "Do not register Tokenese tasks in Turnfile until the maintainer initiates that phase" satisfied as of 2026-06-23 by Maintainer's chat directive in Turnfile session 29)

## Participants and roles

| Participant | Role | Notes |
|-------------|------|-------|
| Claude (Opus 4.7) | active agent | Drove session 1; performed baseline verification |
| Codex | invited / pending join | Owns the t2 A/B suite implementation lane once joined; will be reviewer for Claude's t1 evidence per PRD-006 default |
| Maintainer (snap) | arbiter | Initiated Phase B in Turnfile session 29 chat 2026-06-23 |

## Commands run (in Tokenese repo)

```
node /Users/snap/Git/turnfile/tools/turnfile.mjs init \
  --project tokenese-phase-b \
  --maintainer snap \
  --agent claude \
  --root /Users/snap/Git/tokenese
```
Result: scaffolded `working-session/{TURNFILE.yaml, MAILBOX.md, WORKLOG.md}` with placeholder substitutions. Confirmed CLI portability into a foreign repo (the v1.0.0-rc PRD-048 portable CLI works end-to-end against a Tokenese target).

```
cd /Users/snap/Git/tokenese/tools/translator
../../.venv/bin/python -m pytest -q
```
Result: **156 passed in 0.94s** — matches HANDOFF.md verification-run line.

```
cd /Users/snap/Git/tokenese
.venv/bin/tokenese-n2-report --format markdown
```
Result: N2 status = `static-package-ready/live-ab-open`. All 5 static gates PASS. Receiver static floor min 0.85 / avg 0.9298 (threshold 0.75); cases below threshold: none. 18 hypothesis cases / 13 o200k wins / 4 losses / 1 break-even. 10 TKAB fixtures.

## Item resolved (PRD-047 acceptance criterion: ≥1 real target-repo item)

**Tokenese HANDOFF.md "Next work" item 1** — "Keep N2 open until live multi-family A/B artifacts are attached and reproducible" — first half: **baseline reproducibility verified** before introducing live multi-family A/B variability. The static gates + receiver static floor clear; the 156-test pytest suite is stable on v0.3.9. Phase B may proceed to live A/B work without retroactive baseline correction.

This satisfies the operational requirement that Phase B begin from a known-stable baseline. The N2 package status remains `live-ab-open` (correctly — t2 will populate the live A/B side over subsequent sessions).

Tokenese task state at evidence-write:
- `t1-phase-b-open-baseline-verify` → status `done`, completed_rev 2
- `t2-multi-family-ab-suite-design` → status `pending`, depends_on `t1-phase-b-open-baseline-verify` (now satisfied; unblocked)

## Validation results

In the Turnfile (host) repo:
- `node tools/validate-v1-profile.mjs --root /Users/snap/Git/tokenese --format json` — not run yet; the Tokenese TURNFILE.yaml uses `turnfile.version: "1.0.0"` (per templates/v1-minimal/), passes the v1 schema. Will run as a follow-up gate.
- `node tools/turnfile.mjs status --root /Users/snap/Git/tokenese` — Tokenese session 1 cleanly closed; revision 2; t1 done; t2 pending; one yield signal SIG-002

In the Tokenese repo:
- `pytest -q` 156/156 PASS
- `tokenese-n2-report --format markdown` all static gates PASS

## Pointers (per PRD-047 R6 evidence requirement)

- Tokenese `TURNFILE.yaml`: `/Users/snap/Git/tokenese/working-session/TURNFILE.yaml`
- Tokenese `MAILBOX.md`: `/Users/snap/Git/tokenese/working-session/MAILBOX.md` (empty active queue at session 1 close — Phase B opening did not require cross-agent review)
- Tokenese `WORKLOG.md`: `/Users/snap/Git/tokenese/working-session/WORKLOG.md`

## Privacy / non-copying boundary

Per PRD-027 R7 (cross-repo boundary): this Turnfile coordination did NOT edit Tokenese semantics. Tokenese's `SPEC.md`, `DESIGN.md`, `GRAMMAR-v0.3.md`, `tools/translator/data/source_provenance/*`, and other semantic surfaces were not touched. Only Tokenese's `working-session/{TURNFILE.yaml, MAILBOX.md, WORKLOG.md}` were written — these are coordination state, not Tokenese protocol content.

Per PRD-047 OQ-047-1 (Maintainer-confirmed in MSG-20260623-028 reply): the Tokenese `working-session/` artifacts ARE the live Phase B coordination workspace; they should be retained as Phase B continues. They are not scratch to be cleaned.

## Session 2 update (2026-06-23, same date — continuation)

Claude continued Tokenese Phase B work in a second sub-session. Item 2 advanced:

**Item resolved (cumulative):** HANDOFF.md "Next work" item 1 (baseline reproducibility) + item 2 partial (multi-family A/B suite design strawman authored).

Strawman at `/Users/snap/Git/tokenese/working-session/docs/phase-b-suite-design-strawman.md` covers:
- 4-5 task classes (deploy-status / code-diff review / spec-amendment / apply-or-counter / dense-loses)
- 3 instances per class, per-exchange logging schema (model_family, prompt/response tokens, task_success, misparse events, misparse_family per binding/scope/sense/triangulation)
- Compression-claim discipline per HANDOFF constraint
- Third-family options (Gemini Flash recommended for first pass)
- Per-family run protocol with cross-repo deposit back to both Tokenese and Turnfile
- Exit-to-production threshold deferred to PRD-027 R6.5 three-peer agreement

**Four open questions for Maintainer + Codex:**
- OQ-PhaseB-1: third-family pick (recommended: Gemini Flash)
- OQ-PhaseB-2: new fixture authorship (Codex per existing TKAB pattern)
- OQ-PhaseB-3: numeric thresholds (commit now or wait for baseline data)
- OQ-PhaseB-4: concurrent vs sequential runs

t2 status in Tokenese TURNFILE: `in_progress`, owner: claude, strawman routed for apply-or-counter.

Phase B item 2 is NOT complete — only the design strawman is authored. Coordinated runs across Claude + Codex + third family still require: (a) Maintainer pick on third family, (b) Codex apply-or-counter on suite shape, (c) new fixtures authored for classes S2-S5, (d) the actual runs.

## Conclusion

PRD-047 Test 1 (Tokenese) — **two items advanced** (baseline verify done; A/B suite design strawman authored and routed). Phase B continues actively in `~/Git/tokenese`. Cross-repo boundary preserved. The PRD-047 evidence contract is satisfied for Test 1 with cumulative progress beyond the initial baseline.

Codex reviews this evidence + the strawman per PRD-047 A1 split; Maintainer arbitrates the four OQ-PhaseB items before deeper Phase B runs proceed.
