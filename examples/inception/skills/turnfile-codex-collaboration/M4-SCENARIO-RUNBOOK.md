# PRD-012 M4 Scenario Runbook (Codex Side)

Purpose: pre-stage Codex execution steps for PRD-012 R6 validation scenarios.

This file does not replace the shared M3 policy test suite. It is Codex-side execution prep so M4 can start quickly once shared assertions are finalized.

## Preconditions

1. Shared M3 policy test suite is finalized and accepted.
2. `inception/skills/turnfile-codex-collaboration/SKILL.md` and Claude skill draft are both current.
3. `inception/TURNFILE.yaml` and `inception/MAILBOX.md` are in sync (`MAILBOX.json` regenerated after mailbox edits).

## Scenario 1: Cross-Agent PRD Review Round-Trip

Goal: validate payload-first review exchange + revision lineage.

Steps:

1. Select one draft PRD target in `inception/docs/`.
2. Produce Codex review payload with revision token and explicit ask (`apply-or-counter`).
3. Post mailbox message and regenerate `MAILBOX.json`.
4. Await Claude response and classify outcome (`apply` or `counter`).
5. Verify superseding token linkage if content changed in response.

Expected evidence:

1. Mailbox card with payload token and file list.
2. Reply with apply/counter decision.
3. Final status progression through PRD-003 lifecycle.

## Scenario 2: Shared-File Lock + Transaction Cycle

Goal: validate shared-file mutation safety under Turnfile lease-lock semantics.

Steps:

1. Acquire lock in `TURNFILE.yaml` for intended shared file mutation.
2. Re-read target file and apply one controlled update.
3. Run required regeneration step if mailbox touched.
4. Release lock and verify revision progression.
5. Confirm no invariant drift (counters/queue alignment).

Expected evidence:

1. Lock entry lifecycle in `TURNFILE.yaml` (acquire -> release).
2. Matching coordination revision updates.
3. Post-write invariants pass.

## Scenario 3: Session Close + Resumption

Goal: validate closeout handoff + next-session startup orientation.

Steps:

1. Execute closeout checklist (mailbox clear, worklog handoff, carry-over anchors).
2. Update session state and signals in Turnfile.
3. Execute startup read order in next turn (Turnfile first).
4. Confirm active-turn mailbox-first/last boundary checks are enforced.

Expected evidence:

1. WORKLOG handoff block with next owner.
2. Turnfile state transition + signal.
3. Startup notes confirming read-order and boundary discipline.

## Scenario 4: Turnfile Coordination Cycle

Goal: validate task self-assignment, execution, and signaling.

Steps:

1. Claim a pending task (`claim_rev`) in Turnfile.
2. Execute the scoped work item.
3. Mark task complete (`completed_rev`) and clear `current_task`.
4. Post coordination signal with revision reference.
5. Run Turnfile lint + schema validation.

Expected evidence:

1. Task metadata progression in `TURNFILE.yaml`.
2. Signal entry in `messages`.
3. Lint output pass.

## Verification Commands

1. `node tools/turnfile-lint.mjs --turnfile inception/TURNFILE.yaml --schema inception/schemas/turnfile/turnfile-v0.schema.json`
2. `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json`
3. `node tools/validate-prd-promotion.mjs --registry inception/docs/PRD_STATUS.json`

## Evidence Pack Template

For each scenario record:

1. `scenario_id`
2. `assertions_checked`
3. `files_changed`
4. `commands_run`
5. `pass_fail`
6. `notes`
