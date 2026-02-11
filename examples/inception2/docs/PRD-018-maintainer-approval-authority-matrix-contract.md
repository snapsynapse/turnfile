# PRD-018: Maintainer Approval Authority Matrix Contract

Status: Draft (working-session; not yet actioned)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-02-11

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | — |
| Claude acceptance | pending | — |
| Maintainer acceptance | pending | — |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

## Input Provenance Tags

1. `explicit`: Maintainer approval requirements are not defined and need their own collaborative PRD.
2. `explicit`: Agent-to-agent approvals are valid in some cases; Maintainer involvement is required in others.
3. `resolved`: Maintainer directed that **all changes are Maintainer-gated by default**; selective unlocks to follow. (OQ-052, 2026-02-11.)

## Alignment reference

This PRD aligns with:

1. `working-session/docs/PRD-001-maintainer-interaction-model.md`
2. `docs/prds/PRD-004-maintainer-decision-contract.md`
3. `docs/prds/PRD-013-turnfile-coordination-format.md`
4. `working-session/docs/PRD-017-boot-sequence-commands-and-documentation-contract.md`

## Problem

The collaboration model lacks a formal decision-authority matrix. Agents can coordinate effectively, but escalation boundaries are implicit and inconsistent.

Observed failure modes:

1. Agents are uncertain whether to proceed with peer approval or escalate to Maintainer.
2. Similar-risk changes are handled differently across sessions.
3. Audit trail quality degrades when authority decisions are made ad hoc.

## Goal

Define a decision-authority matrix that classifies work by risk and scope, then maps each class to required approver(s) and evidence artifacts.

## Non-goals

1. Finalizing every threshold in this first draft.
2. Replacing existing lifecycle rules in PRD-003/004.
3. Preventing agents from proposing options before Maintainer review.

## Requirements

## R1. Decision class taxonomy

Define deterministic decision classes at minimum:

1. Low-risk operational updates.
2. Medium-risk protocol/process updates.
3. High-risk governance, security, or irreversible changes.

## R2. Authority matrix

For each decision class, define:

1. Permitted approvers (agent pair, Maintainer, or both).
2. Required evidence location (`MAILBOX.md`, `WORKLOG.md`, `TURNFILE.yaml`).
3. Whether execution may proceed immediately or must block.

## R3. Mandatory Maintainer gate classes

**Resolved (OQ-052):** All decision classes are Maintainer-gated by default. No agent-only approval lanes exist at launch. The Maintainer will selectively unlock specific change classes for agent-pair approval over time based on observed safety and audit quality. Until an explicit unlock is issued, every proposed change requires Maintainer approval before execution.

## R4. Escalation triggers

Define escalation triggers for ambiguity, disagreement, and conflicting prior decisions.

## R5. Iteration protocol

Define how matrix rules are refined without breaking active sessions:

1. Draft updates in working-session PRD.
2. Agent apply/counter cycle.
3. Maintainer acceptance before promotion.

## Acceptance criteria

1. A published matrix exists with at least three decision classes.
2. Every class has explicit approver, blocker behavior, and evidence requirements.
3. At least three realistic examples are mapped to classes.
4. Boot and skill documents reference the matrix as authoritative.

## Risks

1. Over-constraining low-risk work may slow throughput.
   Mitigation: keep low-risk lane lightweight.
2. Under-scoping Maintainer-required classes may increase governance risk.
   Mitigation: conservatively classify ambiguous items as Maintainer-gated.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-052 | Which concrete change types must be Maintainer-gated from day one? | **resolved** | R2, R3 — All changes Maintainer-gated by default. Selective unlocks to follow. (Maintainer, 2026-02-11.) |
| OQ-053 | Should Maintainer gate be required for any cross-agent conflict, or only unresolved conflict after one counter cycle? | **resolved** | R4 — Subsumed by OQ-052: all changes Maintainer-gated. (2026-02-11.) |
