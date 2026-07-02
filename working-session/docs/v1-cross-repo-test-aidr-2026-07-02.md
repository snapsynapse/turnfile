# PRD-047 Test 2 Evidence — AIDR Cross-Repo v1 Dogfood (2026-07-02)

Target repo: `~/Git/aidr` (AI Decision Records; private repo; canonical site https://aidr.work/). The run was performed from inside the target repo per PRD-047 R2/R3, retargeted from PAICE2 by Maintainer direction (2026-07-02).

## Participants and roles (R1 / AC4)

- Claude (Opus 4.8, `claude`): dogfood operator; ran the v1 CLI against the target and compiled evidence.
- Fable 5 (`claude/fable-5`, Anthropic): authored the AIDR-0002 Anthropic position and AIDR's INTENT; double-insider on the target (disclosed).
- Codex (GPT-5, OpenAI): authored the AIDR-0002 OpenAI position; is also the v1 CLI implementer (PRD-048).
- Gemini (3.5 Flash, Google): authored the AIDR-0002 Google position.
- Sam Rogers (Maintainer): human arbiter; arbitrated AIDR-0002 and ratified SPEC v0.1.0.

Participant set differs materially from Test 1 (Tokenese): three distinct providers (Anthropic, OpenAI, Google) plus the Maintainer as arbiter.

## Resolved real item (R4)

The real open item resolved by this run is AIDR-0002: ratify AIDR `SPEC.md` v0.1.0 — a genuine, maintainer-listed open decision from AIDR's own INTENT, resolved via multi-model positions and human arbitration:

- Independent positions, all `recommend`: `claude/fable-5` (Anthropic), `gemini` (Google), `codex` (OpenAI). The record earns `[independent-positions, human-arbitrated]` under the AIDR reference linter.
- Arbitrated by Sam Rogers on 2026-07-02: decision "Ratify SPEC.md v0.1.0 and tag it as the v0.1.0 release."
- `SPEC.md` flipped `status: draft` to `status: ratified`. Committed to the target repo as `fd9a666`.
- Record: `~/Git/aidr/decisions/AIDR-0002-ratify-spec-v0.1.0.md`.

## v1 CLI surface exercised (R3)

Ran the v1 minimal CLI from inside `~/Git/aidr` via `--root`:

- `turnfile init --root ~/Git/aidr`: PASS. Scaffolded `~/Git/aidr/working-session/{TURNFILE.yaml, MAILBOX.md, WORKLOG.md}` from `templates/v1-minimal/`. Cold-start works.
- `turnfile status --root ~/Git/aidr`: PASS. Reads the scaffold at revision 1. FINDING 1 below.
- `turnfile open --root ~/Git/aidr` (dry-run): payload validates. Real execution: FINDING 2 below.
- `turnfile close --root ~/Git/aidr` (dry-run): the verb runs; its closeout validator correctly fails on a bare, unopened session (expected for a session that was never really opened).

## Findings

- FINDING 1 (minor, template): a fresh `init` leaves the `TURNFILE.yaml` header revision `null` while `coordination.revision` is 1, so `status` emits a warning on first read. Cosmetic; a template/init fix.
- FINDING 2 (portability bug, Codex / PRD-048 lane): `turnfile open --root <target>` cannot open a session in a consumer repo in real execution — it fails with `unknown arg: --root` because the `open` verb delegates to `handshake-sign.mjs`, which is root-unaware. The v1 "portable CLI" claim is therefore incomplete on the `open` verb. A clean in-repo test does not catch this; the cross-repo dogfood does. Recommended fix before v1.0.0 freeze: either `handshake-sign` accepts `--root`, or `open` translates `--root` into the target working directory before delegating. Whether this blocks Test 2's pass or is accepted as a fix-forward known gap is a Codex evidence-review + Maintainer-ratification decision (R6).

## Provenance lessons (governance, surfaced by this run)

1. No cross-model transcription. Positions must be authored first-party by each participant. A model transcribing another's position (done once here for the Codex position, then removed) obscures provenance. AIDR `CONTRIBUTING.md` was updated to require direct authorship and to resolve repository access rather than transcribe.
2. Agent-touches-arbitration open question. An agent normalized the human arbitration's metadata for lint conformance; the decision content was preserved, but whether an agent may make purely mechanical conformance fixes to an arbitration is an open Maintainer question, now flagged in AIDR `CONTRIBUTING.md`.

## Independence caveat

AIDR is Turnfile's spin-out (Turnfile is AIDR's declared "advanced profile"), and the Anthropic author (Fable) is a double-insider (authored AIDR's INTENT). Independence is therefore weaker than an arm's-length consumer. Mitigation: the counting positions span three distinct providers (Anthropic, OpenAI, Google); the Maintainer arbitrates; the insider status is disclosed both in the record and here.

## Pointers (target-repo artifacts; not copied wholesale)

- Target `working-session/TURNFILE.yaml`: `~/Git/aidr/working-session/TURNFILE.yaml` (init scaffold, revision 1; dogfood scratch, intentionally not committed to aidr).
- Target `working-session/MAILBOX.md`: `~/Git/aidr/working-session/MAILBOX.md` (init scaffold).
- Target `working-session/WORKLOG.md`: `~/Git/aidr/working-session/WORKLOG.md` (init scaffold).
- Resolved decision record: `~/Git/aidr/decisions/AIDR-0002-ratify-spec-v0.1.0.md` (committed `fd9a666`).
- Ratified spec: `~/Git/aidr/SPEC.md` (`status: ratified`, committed `fd9a666`).

## Privacy note

`~/Git/aidr` is a private repository. This evidence uses pointers and short summaries; no private target-repo content is copied back wholesale. The AIDR-0002 record and `SPEC.md` are public-by-design (served at https://aidr.work/), so their content is referenced freely.

## Review status

Claude operated the run. Awaiting Codex A1 step-7 evidence review (R6) and Maintainer ratification of the dogfood outcome before final v1.0.0. The open disposition is whether FINDING 2 (`open --root`) blocks Test 2's pass or is accepted as a fix-forward known gap.
