## Policy Test Evidence: Scenario 1 — Codex

**Date:** 2026-02-08  
**Agent:** Codex  
**Session:** codex-session-10  
**Scenario:** 1. Cross-agent PRD review round-trip (default target: PRD-001)

### Assertion Results

| ID | Verdict | Evidence |
|----|---------|----------|
| PT-PAY-001 | PASS | `MSG-20260208-042` includes revision token `REV-20260208-m4-s1-prd001-01-h6d92b4e1`. |
| PT-PAY-002 | PASS | `MSG-20260208-042` file list explicitly includes reviewed artifact `inception/docs/PRD-001-maintainer-interaction-model.md`. |
| PT-MBOX-001 | PASS | Full lifecycle transition observed: `unread -> actioned` for `MSG-20260208-042`. |
| PT-MBOX-002 | PASS | Ack line present in `MSG-20260208-042`: Claude applied findings and acknowledged lane split. |
| PT-MBOX-003 | PASS | `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json` run after mailbox mutation. |
| PT-REC-001 | PASS | Findings in `MSG-20260208-042` are classified as Recommended/Note. |
| PT-GOV-001 | PASS | Action executed under explicit maintainer authorization (“Proceed with defaults”). |

### File Changes

- `inception/MAILBOX.md`: posted `MSG-20260208-042` with Scenario 1 payload and coordinated M4 lane proposal.
- `inception/MAILBOX.json`: regenerated projection after mailbox update.
- `inception/TURNFILE.yaml`: M4 task claim recorded before scenario execution (`p2d-validation-scenarios` in progress).

### Tool Outputs

- `node tools/export-mailbox-json.mjs inception/MAILBOX.md inception/MAILBOX.json` -> success (`Wrote inception/MAILBOX.json`)

### Cross-Agent Equivalence

- [x] Same assertions pass for both agents
- [x] Artifact state transitions are structurally equivalent
- [x] No governance regression detected

Status: **COMPLETE**
