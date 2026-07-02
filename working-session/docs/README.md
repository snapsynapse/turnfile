# Working Session Docs

Active iteration documents for the current local session workspace.

## Active PRDs

1. `PRD-047-cross-repo-v1-validation-tests.md` - active release-evidence PRD; blocked on Maintainer dogfood evidence ratification before final v1.0.0 ratification.

## Completed PRDs

Completed PRDs do not remain in this directory. They belong on the promoted shelf at `docs/prds/` once Codex, Claude, and Maintainer acceptance are recorded with evidence and `blocking_items` is empty.

Use the registry lookup instead of maintaining a hand-written promoted list:

```bash
node tools/prd-status-summary.mjs --filter promoted
node tools/prd-status-summary.mjs --filter draft
node tools/prd-status-summary.mjs --filter blocked
```

## Promotion Gate Policy (Required)

Before any PRD is moved from `working-session/docs/` to `docs/prds/`, all of the following must be true:

1. Codex acceptance is explicitly logged with evidence.
2. Claude acceptance is explicitly logged with evidence.
3. Maintainer acceptance is explicitly logged with evidence.
4. Any session-scoped additional reviewer requirement is explicitly satisfied.
5. Blocking items are empty for that PRD.
6. `working-session/docs/PRD_STATUS.json` records the same status.
7. `node tools/validate-prd-promotion.mjs` passes.

Gemini acceptance is not required unless Gemini is an active scoped participant for that PRD or the Maintainer explicitly requires Gemini review.

`working-session/docs/PRD_STATUS.json` is the source-of-truth registry for PRD shelf eligibility.

## Supporting Files

- `../OPEN_QUESTIONS.md` - cross-PRD open question registry
- `../TURNFILE.yaml` - pilot Turnfile coordination state artifact
- `PRD_STATUS.json` - promotion gate registry (Codex/Claude/Maintainer evidence)
- `onboarding/ONBOARDING_TEST_SUITE.md` - candidate-agnostic onboarding scenario matrix (pilot staging)
- `onboarding/ONBOARDING_EVIDENCE_TEMPLATE.md` - standard evidence capture template for onboarding runs

## Active Release Evidence

- `v1-cross-repo-test-tokenese-2026-06-23.md` - Tokenese v1 dogfood evidence.
- `v1-cross-repo-test-aidr-2026-07-02.md` - AIDR v1 dogfood evidence.
- `v1-fresh-context-probe-2026-06-23-claude-haiku.md` and `v1-fresh-context-probe-2026-06-23-claude-sonnet.md` - fresh-context v1 probe evidence.

## Onboarding Evidence

- `onboarding/` - protocol glossary, test suite, and evidence template.
- `onboarding/evidence/` - candidate run evidence for Antigravity, Gemini CLI, Perplexity Computer, and Qwen MLX.
- `gemini-onboarding/`, `gemini-teach-gate.md`, `local-model-onboarding-matrix.md`, and `onboarding-validator-hardening-codex-notes.md` - active onboarding support notes.

## Historical Notes And Pilot Evidence

- Tokenese artifacts: `tk-*.md`, `tokenese-*.md`, and `../tokenese-pairs/`.
- PRD-031 implementation notes: `prd-031-*.md` and `s21-prd-031-infrastructure-audit.md`.
- PRD-041 spike note: `r4-arbitration-primitive-schema-spike-prd-041.md`.
- Qwen relay notes: `qwen-mlx-execution-handoff-codex.md` and `qwen-mlx-formal-ot-relay-packet-codex.md`.
- Tokenese pivot records: `DECISION-2026-06-18-tokenese-precision-pivot.md` and related 2026-06-19 handoffs.

## Organization Recommendations

1. Keep PRD-047 here until Maintainer dogfood evidence ratification completes.
2. After v1.0.0 ratification, move release evidence to a durable evidence shelf such as `docs/evidence/v1/` or archive it with the release notes.
3. Promote stable onboarding docs out of `working-session/docs/` once the onboarding protocol is no longer session-local.
4. Archive historical PRD-031, PRD-041, Tokenese, and Qwen notes only after references in PRDs, worklog entries, and validators are updated.
