# Working Session Docs

Active iteration documents for the current local session workspace.

## Draft PRDs

None.

## Accepted / Not Yet Promoted PRDs

None.

## Actioned PRDs Promoted To `docs/prds/`

1. `PRD-001-maintainer-interaction-model.md`
2. `PRD-003-message-lifecycle-sla-contract.md`
3. `PRD-004-maintainer-decision-contract.md`
4. `PRD-005-protocol-data-schema-compatibility.md`
5. `PRD-006-session-promotion-pipeline.md`
6. `PRD-007-trust-provenance-layer.md`
7. `PRD-008-cross-sandbox-handoff-contract.md`
8. `PRD-009-cross-document-reconciliation.md`
9. `PRD-010-shared-file-transaction-locking.md`
10. `PRD-011-session-resumption-contract.md`
11. `PRD-012-protocol-skills-codex-claude.md`
12. `PRD-013-turnfile-coordination-format.md`
13. `PRD-014-session-closeout-boot-handoff-contract.md`
14. `PRD-016-session-rotation-trigger-contract.md`
15. `PRD-017-boot-sequence-commands-and-documentation-contract.md`
16. `PRD-018-maintainer-approval-authority-matrix-contract.md`
17. `PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`
18. `PRD-021-conflict-loop-bound-and-selective-unlock-gradient-contract.md`
19. `PRD-022-decision-mirror-delivery-contract.md`
20. `PRD-023-out-of-band-activity-reconciliation-contract.md`
21. `PRD-024-human-legibility-invariant-and-encoding-profiles-contract.md`
22. `PRD-026-review-cycle-closure-and-task-state-consistency-contract.md`
23. `PRD-027-tokenese-cloned-communication-ab-contract.md`
24. `PRD-028-tokenese-dual-artifact-sync-and-maintainer-legibility-contract.md`
25. `PRD-029-pre-write-state-derivation-contract.md`
26. `PRD-030-session-heartbeat-management-contract.md`
27. `PRD-031-concurrent-multi-agent-coordination-contract.md`
28. `PRD-032-session-orientation-tool-contract.md`
29. `PRD-033-skill-ownership-integrity-guard.md`

## Promotion Gate Policy (Required)

Before any PRD is moved from `working-session/docs/` to `docs/prds/`, all of the following must be true:

1. Codex acceptance is explicitly logged with evidence.
2. Claude acceptance is explicitly logged with evidence.
3. Maintainer acceptance is explicitly logged with evidence.
4. Blocking items are empty for that PRD.
5. `working-session/docs/PRD_STATUS.json` records the same status.
6. `node tools/validate-prd-promotion.mjs` passes.

`working-session/docs/PRD_STATUS.json` is the source-of-truth registry for PRD shelf eligibility.

## Supporting Files

- `../OPEN_QUESTIONS.md` — cross-PRD open question registry
- `../TURNFILE.yaml` — pilot Turnfile coordination state artifact
- `PRD_STATUS.json` — promotion gate registry (Codex/Claude/Maintainer evidence)
- `onboarding/ONBOARDING_TEST_SUITE.md` — candidate-agnostic onboarding scenario matrix (pilot staging)
- `onboarding/ONBOARDING_EVIDENCE_TEMPLATE.md` — standard evidence capture template for onboarding runs
