# PRD Shelf (`docs/prds`)

This directory is the actioned PRD shelf.

A PRD may be placed here only after the promotion gate passes:

1. Codex acceptance logged with evidence.
2. Claude acceptance logged with evidence.
3. Maintainer acceptance logged with evidence.
4. No blocking items remain.
5. Registry eligibility is `true` in `working-session/docs/PRD_STATUS.json`.
6. Validation passes: `node tools/validate-prd-promotion.mjs`.

If a PRD fails the gate, it must remain in `working-session/docs/`.
