# Boot Notes — Codex (Next Thread)

Purpose: safety-start bootstrap for the next Codex thread, with explicit skill adoption and Phase II cleanup guardrails.

## Read Order (first 5 minutes, Turnfile-first)

1. `inception/TURNFILE.yaml`
2. `inception/WORKLOG.md` (status block first, then latest entries)
3. `inception/MAILBOX.md` (Inbox Snapshot + active unread cards)
4. `inception/OPEN_QUESTIONS.md` (confirm active/deferred state)
5. `inception/skills/turnfile-codex-collaboration/SKILL.md`
6. `inception/chat-codex.md` latest section

## Skill Adoption Gate (Required)

1. Treat `inception/skills/turnfile-codex-collaboration/SKILL.md` as the default execution contract for Codex protocol work.
2. Apply module selection explicitly:
   - Mailbox lifecycle/SLA -> `M-01`
   - Decision flow -> `M-02`
   - Payload-first handoff -> `M-03`
   - Cross-PRD reconciliation -> `M-04`
   - Shared-file transaction -> `M-05`
   - Session close/resume -> `M-06`
   - Turnfile coordination -> `M-07`
   - OQ-only updates -> `M-08`
3. Before turn completion, enforce turn-boundary hygiene:
   - Codex unread must be `0`
   - Codex-owned actionable threads must be closed or explicitly deferred

## Current Carry-Over Anchors

1. Phase II execution complete: P2-D and deferred validations are done.
2. Deferred tasks status:
   - `deferred-prd008-ac6`: done (`completed_rev: 43`)
   - `deferred-prd003-ac4`: done (`completed_rev: 46`)
3. Control plane currently clean:
   - Inbox unread: `Codex=0`, `Claude=0`, `Maintainer=0`
   - Open queue: empty
4. Tooling hardening has been applied:
   - `tools/validate-mailbox-invariants.mjs`
   - `tools/export-mailbox-json.mjs` empty-queue fix

## Immediate Next Work (Phase Cleanup Coordination)

1. Coordinate with Claude before any broad `inception/` cleanup/move to `examples/`:
   - Post/confirm cleanup scope and guardrails in mailbox
   - Require ack-or-counter before execution
2. Enforce promotion gate boundaries during cleanup:
   - Do not treat cleanup as implicit PRD promotion
   - Keep non-actioned PRDs in `inception/docs/` unless maintainer explicitly directs otherwise
3. Require artifact manifest for any `examples/` move:
   - included files
   - excluded files (and why)
   - rollback list

## Cleanup Guardrails (Pre-flight)

1. Validate PRD shelf eligibility before any PRD relocation:
   - `node tools/validate-prd-promotion.mjs --registry inception/docs/PRD_STATUS.json`
2. Validate mailbox invariants after mailbox edits:
   - `node tools/validate-mailbox-invariants.mjs --mailbox inception/MAILBOX.md`
3. Regenerate mailbox projection after mailbox edits:
   - `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json`
4. Validate Turnfile after coordination edits:
   - `node tools/turnfile-lint.mjs --turnfile inception/TURNFILE.yaml --schema inception/schemas/turnfile/turnfile-v0.schema.json`

## Safety Notes

1. Avoid moving files from `inception/` to `docs/prds/` without explicit Codex + Claude + Maintainer acceptance evidence.
2. Prefer copy + verify + then prune only after manifest review.
3. If concurrent edits occur, re-read target files immediately before write and revalidate invariants after write.
