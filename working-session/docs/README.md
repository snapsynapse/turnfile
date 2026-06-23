# Working Session Docs

Active iteration documents for the current local session workspace.

## Active PRDs

1. `PRD-047-cross-repo-v1-validation-tests.md` — active release-evidence PRD; blocked on PAICE2 dogfood evidence, Codex evidence review, and Maintainer evidence ratification.

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

- `../OPEN_QUESTIONS.md` — cross-PRD open question registry
- `../TURNFILE.yaml` — pilot Turnfile coordination state artifact
- `PRD_STATUS.json` — promotion gate registry (Codex/Claude/Maintainer evidence)
- `onboarding/ONBOARDING_TEST_SUITE.md` — candidate-agnostic onboarding scenario matrix (pilot staging)
- `onboarding/ONBOARDING_EVIDENCE_TEMPLATE.md` — standard evidence capture template for onboarding runs
