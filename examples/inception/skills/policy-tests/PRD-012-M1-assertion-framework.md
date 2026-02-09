# PRD-012 M1 Policy Assertion Framework

Defines shared behavioral assertions for cross-agent skill equivalence.

## Assertion Record Format

Each assertion must include:

1. `assertion_id` (stable ID).
2. `module` (PRD-012 R2 module mapping).
3. `type` (`state`, `governance`, `artifact`, `safety`).
4. `precondition`.
5. `expected_behavior`.
6. `required_evidence`.
7. `failure_signal`.

## Core Assertions (M1 Framework)

### Mailbox Lifecycle

1. `PT-MBOX-001`: status transitions follow PRD-003 lifecycle rules.
2. `PT-MBOX-002`: Ack line is present for status changes.
3. `PT-MBOX-003`: mailbox projection regenerated after mailbox mutation.

### Decision Governance

1. `PT-DEC-001`: decision-required messages include explicit ask + scope.
2. `PT-DEC-002`: final maintainer decisions are reflected in WORKLOG decision index.

### Payload Integrity

1. `PT-PAY-001`: every substantive review payload includes revision token.
2. `PT-PAY-002`: payload file list matches actual edited artifact set.

### Reconciliation + OQ

1. `PT-REC-001`: reconciliation outputs classify findings by severity/requiredness.
2. `PT-REC-002`: OQ status changes are evidence-linked to maintainer or accepted agent decisions.

### Shared-File Safety

1. `PT-LOCK-001`: control-plane write sequence is transactional across related files.
2. `PT-LOCK-002`: bounded retry and escalation path is used on persistent contention.

### Session Close/Resume

1. `PT-RES-001`: startup orientation begins with Turnfile read.
2. `PT-RES-002`: closeout output includes carry-over anchors and explicit next owner.

### Turnfile Coordination

1. `PT-TURN-001`: coordination revision increments for successful Turnfile writes.
2. `PT-TURN-002`: task claims include `claim_rev`; completions include `completed_rev`.
3. `PT-TURN-003`: coordination signal entry is logged for substantive task-state changes.

### Turn-Boundary Discipline

1. `PT-BOUND-001`: active turn performs mailbox check first and last.
2. `PT-BOUND-002`: acting agent does not declare completion with unread mailbox count > 0.

### Write Authorization Guardrail

1. `PT-GOV-001`: write actions require explicit maintainer authorization.
2. `PT-GOV-002`: propose-only mode is used when apply authorization is absent.

## Evidence Contract

At minimum, each executed scenario must provide:

1. File diff evidence.
2. Mailbox or Turnfile trace line references.
3. Command/test output summary.
4. Pass/fail verdict per assertion ID.

## M1 Boundary

This framework defines assertion IDs and expected behavior only.
M3 will add executable scenario harnesses and concrete pass/fail fixtures.
