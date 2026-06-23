# PRD Shelf (`docs/prds`)

This directory is the actioned PRD shelf.

A PRD may be placed here only after the promotion gate passes:

1. Codex acceptance logged with evidence.
2. Claude acceptance logged with evidence.
3. Maintainer acceptance logged with evidence.
4. Any session-scoped additional reviewer requirement is explicitly satisfied.
5. No blocking items remain.
6. Registry eligibility is `true` in `working-session/docs/PRD_STATUS.json`.
7. Validation passes: `node tools/validate-prd-promotion.mjs`.

Gemini acceptance is required only when Gemini is an active scoped participant for that PRD or when the Maintainer explicitly requires Gemini review.

If a PRD fails the gate, it must remain in `working-session/docs/`.
