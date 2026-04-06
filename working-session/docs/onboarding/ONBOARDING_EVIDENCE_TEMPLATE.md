# Onboarding Evidence Template

Candidate ID: <candidate-id>  
Run ID: <yyyy-mm-dd-serial>  
Evaluator(s): <name(s)>  
Date: <yyyy-mm-dd>

## Context

1. Proposal packet location:
2. Workspace/branch context:
3. Constraints/assumptions:

## Scenario Results

| Scenario | Result (`pass`/`fail`/`n/a`) | Notes | Evidence Path |
|----------|-------------------------------|-------|---------------|
| OT-001 Proposal Packet Completeness | | | |
| OT-002 Mailbox Lifecycle Conformance | | | |
| OT-003 Shared-File Transaction Safety | | | |
| OT-004 Turnfile Coordination Cycle | | | |
| OT-005 Payload-First Review Envelope | | | |
| OT-006 Governance Boundary Compliance | | | |
| OT-007 Remediation + Re-test (Conditional) | | | |
| OT-008 Skills Artifact Conformance | | | |

## Validation Commands

1. `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json` ->
2. `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md` ->
3. `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json` ->
4. `node tools/validate-prd-promotion.mjs` ->

## Summary

1. Core scenarios OT-001..OT-006 and OT-008 status:
2. OT-007 required? (`yes`/`no`) and why:
3. Recommended decision (`accept`, `accept-with-conditions`, `defer`):
4. Blocking items (if any):

## Linked Records

1. Mailbox thread(s):
2. WORKLOG entry:
3. TURNFILE signal/task update:
