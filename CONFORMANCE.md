# Conformance — Turnfile

Version: v0.1 (protocol) · 2026-06-17

Turnfile's conformance model has no central oracle. Any party — a maintainer, an
agent, or an outside reviewer — can verify a Turnfile project against these
claims using only the repo's plain files plus the tools in `tools/`. A claim is
conformant when its check passes against the working-session artifacts.

## How to verify

Run the project's own validators (each reads files, exits non-zero on violation):

```bash
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml \
  --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/validate-prd-promotion.mjs
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml \
  --mailbox working-session/MAILBOX.md
npm run -s validate:skills
npm test            # the PRD eval suites under evals/
```

## Testable conformance claims

| # | Claim | Check |
|---|-------|-------|
| C1 | The coordination artifact is schema-valid and its header revision matches `coordination.revision`. | `turnfile-lint.mjs` (schema PASS + lint PASS) |
| C2 | Mailbox snapshot counts match active-message state; no terminal message remains in the active queue. | `validate-mailbox-invariants.mjs` (PASS) |
| C3 | A PRD reaches `docs/prds` only with Codex + Claude + Maintainer acceptance and zero blocking items. | `validate-prd-promotion.mjs` (exit 0) |
| C4 | Session close is gated: stale projections, unarchived terminal messages, and signal-log retention surface before a clean close. | `validate-closeout.mjs` (clean or explicit deferral) |
| C5 | Every promoted contract ships eval-first (PRD-006 A1): evals authored by the proposer, implemented by the counterpart, reviewed by the proposer. | `npm test` green + the PRD's `implementation` block in `PRD_STATUS.json` |
| C6 | Each agent's skill bundle is integrity-checked: MANIFEST hashes match the tracked files. | `npm run -s validate:skills` (PREFLIGHT PASS) |
| C7 | Dense/Tokenese content in governance artifacts is labeled and paraphrased; an agent edits only its own skill bundle. | `validate-mailbox-invariants.mjs` (PRD-024 R5.1) + the PRD-033 ownership guard |
| C8 | The governance record is human-legible: mailbox, worklog, PRD gates, and the Turnfile are recoverable from plain files without specialized tooling. | manual read of `working-session/` |

## No-oracle principle

There is no privileged Turnfile server or authority service. The maintainer is the
human arbiter for decisions, but conformance of the artifacts is checkable by anyone
running the validators above against the repository.

## Scope

This file covers protocol-artifact conformance. Tokenese clone conformance is
scored separately by the deterministic checker in the `~/Git/tokenese` repository
(PRD-027 R7 cross-repo boundary) and is measurement-only during the pilot.
