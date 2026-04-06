# PRD-017: Boot Sequence Commands and Documentation Contract

Status: Draft (working-session; not yet actioned)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-10
Last revised: 2026-02-11

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260211-010 amendment pass verified and accepted by Codex |
| Claude acceptance | accepted | MSG-20260211-010 review + amendment pass from Claude |
| Maintainer acceptance | pending | — |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

## Alignment reference

This PRD aligns with:

1. `VISION.md` (auditability + explicit governance decisions)
2. PRD-011 (session resumption contract)
3. PRD-013 (Turnfile coordination state)
4. PRD-014 (session closeout + boot handoff)
5. PRD-012 (agent skill execution consistency)

## Problem

Boot and resume flows currently depend on loosely coordinated notes and historical context. This creates avoidable startup drift.

Observed failure modes:

1. Boot command order is not centrally specified, leading to inconsistent first-read behavior.
2. Documentation references can point to stale paths (`examples/inception/` vs `working-session/`), causing startup confusion.
3. Validation commands are not always run as a standard pre-flight set.
4. New contributors and future agents need extra manual interpretation to identify the current authoritative startup sequence.

## Goal

Define a single boot-sequence contract that standardizes:

1. Required startup commands and their execution order.
2. Required startup documentation read order.
3. Required validation checks before substantive edits.
4. Startup output artifacts that make session state explicit and auditable.

## Non-goals

1. Replacing protocol governance contracts already defined in PRD-003/004/013/014.
2. Introducing mandatory new runtime dependencies beyond current repo tooling.
3. Automating thread/session creation in external systems.
4. Defining model-specific internal reasoning workflows.

## Users

1. Maintainer: needs predictable startup behavior and reduced onboarding friction.
2. Active agents (Codex/Claude): need deterministic startup sequence and guardrails.
3. Future agents: need a portable, testable startup procedure.

## Requirements

## R1. Canonical boot command manifest

The protocol must define a canonical command set for session startup.

### R1.1 Required command classes

The manifest must include:

1. Repository state commands (branch/status checks).
2. Session workspace integrity checks.
3. Protocol validation checks (`turnfile-lint`, mailbox invariants, mailbox JSON projection).

### R1.2 Ordered execution

Commands must define a required execution order and failure-handling behavior (stop/continue/escalate).

## R2. Canonical boot read order

A startup documentation order must be defined and versioned.

### R2.1 Required sources

Read order must identify, at minimum:

1. Coordination artifact (`working-session/TURNFILE.yaml`).
2. Session status artifact (`working-session/WORKLOG.md` status block first).
3. Message state artifact (`working-session/MAILBOX.md` and optional `MAILBOX.json` projection).
4. Open-question and PRD status registries.

### R2.2 Freshness requirement

Before writing to shared files, agents must re-read target files if any concurrent edit risk exists.

## R3. Documentation-path authority and drift prevention

Startup docs must declare which workspace root is authoritative (`working-session/` for active local work) and how historical archives are referenced.

### R3.1 Path contract

Each boot instruction must clearly label one of:

1. Active path (mutable, current session).
2. Historical path (read-only archive/reference).

### R3.2 Drift checks

Boot flow must include at least one check that flags stale root references in active instructions.

## R4. Startup output contract

Boot sequence execution must produce a lightweight startup summary in the active worklog.

### R4.1 Minimum startup summary fields

1. Active branch.
2. Workspace health status.
3. Validation results.
4. Unresolved blockers requiring maintainer direction.

## R5. Error handling and escalation

Boot sequence must define how failures are handled.

### R5.1 Failure classes

At minimum:

1. Missing required file(s).
2. Validation failure.
3. Branch mismatch with maintainer expectation.

### R5.2 Escalation contract

Failures that block safe progress require explicit maintainer notification in mailbox/worklog before proceeding with substantive edits.

## R6. Skill and onboarding integration

Boot-sequence requirements must map cleanly into agent skill files and onboarding checks.

### R6.1 Skill mapping

Each required startup step must map to at least one skill module or explicit procedure section.

### R6.2 Onboarding evidence

New agent vetting (PRD-015) must include one boot-sequence conformance scenario.

## Acceptance criteria

1. A canonical boot command manifest exists and is referenced by both active agent workflows.
2. A startup run can be executed end-to-end with deterministic results from a clean checkout.
3. Validation failures produce explicit, documented escalation behavior.
4. Active startup docs no longer mix authoritative active paths with historical paths without labels.
5. At least one onboarding scenario verifies boot-sequence conformance for a candidate agent.

## Risks

1. Over-prescriptive startup rules may slow simple sessions.
   Mitigation: keep manifest minimal and automation-friendly.
2. Documentation updates may lag protocol changes.
   Mitigation: tie boot-doc updates to PRD promotion and closeout checklists.
3. Tooling assumptions may not hold across all environments.
   Mitigation: define fallbacks and classify optional vs required commands.

## Dependencies

1. PRD-011 session resumption contract.
2. PRD-012 protocol skills pack.
3. PRD-013 Turnfile coordination format.
4. PRD-014 session closeout + boot handoff contract.
5. PRD-015 onboarding + vetting contract (for boot conformance checks).
6. PRD-020 boot artifact completeness + chat log contract (defines what artifacts must exist before boot proceeds).

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| PRD-011 | Strengthens startup read-order and minimum-state checks. |
| PRD-012 | Adds explicit startup module mapping expectations. |
| PRD-013 | Uses Turnfile as first authoritative coordination read. |
| PRD-014 | Extends closeout-to-next-boot continuity expectations. |
| docs/LLM_ONBOARDING.md | Adds concrete startup conformance checks for new agents. |

## Milestones

1. **M0:** Draft PRD-017 (this document).
2. **M1:** Define canonical boot command manifest + validation matrix.
3. **M2:** Reconcile boot docs with active path conventions (`working-session/` authority).
4. **M3:** Add onboarding boot-conformance scenario tied to PRD-015.
5. **M4:** Run cross-agent trial and capture evidence for promotion gate.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-051 | Should boot sequence be codified as a single script or remain a documented command contract with optional helper scripts? | pending | R1, R5 |
