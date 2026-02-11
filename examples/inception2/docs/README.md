# Inception Docs

Active iteration documents for the current local session workspace.

## In-Progress / Not Yet Actioned PRDs

1. `PRD-001-maintainer-interaction-model.md`
2. `PRD-002-rust-notification-viewer-mvp.md`
3. `PRD-015-agent-onboarding-vetting-contract.md`
4. `PRD-016-session-rotation-trigger-contract.md`
5. `PRD-017-boot-sequence-commands-and-documentation-contract.md`
6. `PRD-018-maintainer-approval-authority-matrix-contract.md`
7. `PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`
8. `PRD-020-boot-artifact-completeness-and-chat-log-contract.md`

## Actioned PRDs Promoted To `docs/prds/`

1. `PRD-003-message-lifecycle-sla-contract.md`
2. `PRD-004-maintainer-decision-contract.md`
3. `PRD-005-protocol-data-schema-compatibility.md`
4. `PRD-006-session-promotion-pipeline.md`
5. `PRD-007-trust-provenance-layer.md`
6. `PRD-008-cross-sandbox-handoff-contract.md`
7. `PRD-009-cross-document-reconciliation.md`
8. `PRD-010-shared-file-transaction-locking.md`
9. `PRD-011-session-resumption-contract.md`
10. `PRD-012-protocol-skills-codex-claude.md`
11. `PRD-013-turnfile-coordination-format.md`
12. `PRD-014-session-closeout-boot-handoff-contract.md`

## Promotion Gate Policy (Required)

Before any PRD is moved from `inception/docs/` to `docs/prds/`, all of the following must be true:

1. Codex acceptance is explicitly logged with evidence.
2. Claude acceptance is explicitly logged with evidence.
3. Maintainer acceptance is explicitly logged with evidence.
4. Blocking items are empty for that PRD.
5. `inception/docs/PRD_STATUS.json` records the same status.
6. `node tools/validate-prd-promotion.mjs` passes.

`inception/docs/PRD_STATUS.json` is the source-of-truth registry for PRD shelf eligibility.

## Supporting Files

- `../OPEN_QUESTIONS.md` — cross-PRD open question registry
- `../TURNFILE.yaml` — pilot Turnfile coordination state artifact
- `PRD_STATUS.json` — promotion gate registry (Codex/Claude/Maintainer evidence)
