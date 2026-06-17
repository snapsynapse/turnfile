# PRD-018: Maintainer Approval Authority Matrix Contract

Status: Accepted (Maintainer, 2026-06-12, session 14)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-06-12 (session 14: Maintainer acceptance recorded)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260211-010 counter set resolved and accepted by Codex |
| Claude acceptance | accepted | MSG-20260211-010 amendment pass submitted by Claude |
| Maintainer acceptance | accepted | Maintainer decision 2026-06-12 (session 14 triage); PRD-021 builds on this matrix |
| Eligible for move to `docs/prds` | yes | all acceptances recorded; OQ-052/053 resolved since 2026-02-11 |

## Input Provenance Tags

1. `explicit`: Maintainer approval requirements are not defined and need their own collaborative PRD.
2. `explicit`: Agent-to-agent approvals are valid in some cases; Maintainer involvement is required in others.
3. `resolved`: Maintainer directed that **all changes are Maintainer-gated by default**; selective unlocks to follow. (OQ-052, 2026-02-11.)

## Alignment reference

This PRD aligns with:

1. `docs/prds/PRD-001-maintainer-interaction-model.md`
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

Decision classes must extend the governance Bands defined in PRD-004 R1 rather than introducing a parallel taxonomy. The three bands are:

1. **Band A (operational):** Low-risk updates that do not alter protocol semantics, governance boundaries, or shared contracts. Examples: WORKLOG status updates, mailbox ack/action lifecycle transitions, boot file refresh, ad-hoc task tracking.
2. **Band B (protocol/process):** Medium-risk changes to protocol artifacts, skill files, tooling, or cross-agent coordination conventions. Examples: skill-versioning application, preflight tool additions, boot file structural rewrites, new Turnfile task creation.
3. **Band C (governance):** High-risk changes to governance rules, decision authority, PRD promotion, security boundaries, or irreversible state mutations. Examples: PRD promotion to `docs/prds/`, authority matrix modifications, OQ resolution with governance impact, permanent file deletions.

## R2. Authority matrix

For each decision class (Band), define:

1. Permitted approvers (agent pair, Maintainer, or both).
2. Required evidence location (`MAILBOX.md`, `WORKLOG.md`, `TURNFILE.yaml`).
3. Whether execution may proceed immediately or must block.
4. Cross-reference: event-based approval triggers are defined in PRD-019 R2 and govern the *mechanism* for exercising authority decisions in this matrix.

### R2.1 Matrix (launch defaults — all Maintainer-gated per OQ-052)

| Band | Description | Unlock flag | Approver (launch) | Blocker behavior | Evidence |
|------|-------------|-------------|-------------------|-----------------|----------|
| A | Operational updates | unlockable | Maintainer (unlock candidate) | Non-blocking proposal; block on execution | MAILBOX ack |
| B | Protocol/process changes | gated | Maintainer | Block on execution | MAILBOX + WORKLOG |
| C | Governance/irreversible changes | gated | Maintainer (no unlock) | Proposal allowed; block on execution | MAILBOX + WORKLOG + Turnfile task |

The `gated` / `unlockable` flag is the PRD-021 selective-unlock gradient. `unlockable` marks only eligibility for later Maintainer unlock; it does not itself grant agent-pair approval authority. Until the Maintainer records an explicit unlock under R2.2, every class remains Maintainer-gated by default.

### R2.2 Selective unlock mechanism

When the Maintainer explicitly unlocks a Band A change class for agent-pair approval:

1. The unlock must be recorded as a WORKLOG decision with scope, conditions, and expiry (session-scoped or indefinite).
2. Agents operating under an unlock must still post evidence in MAILBOX.
3. The Maintainer may revoke any unlock at any time.

## R3. Mandatory Maintainer gate classes

**Resolved (OQ-052):** All decision classes are Maintainer-gated by default. No agent-only approval lanes exist at launch. The Maintainer will selectively unlock specific change classes for agent-pair approval over time based on observed safety and audit quality. Until an explicit unlock is issued, every proposed change requires Maintainer approval before execution.

## R4. Escalation triggers

Define escalation triggers for ambiguity, disagreement, and conflicting prior decisions. At minimum:

1. **Ambiguity:** When an agent cannot determine whether a change is Band A, B, or C, it must escalate to Maintainer via mailbox `decision-required` message.
2. **Disagreement:** When agents disagree on apply/counter, the Maintainer is the tiebreaker per PRD-004.
3. **Conflicting priors:** When a proposed change contradicts an earlier Maintainer decision, the new proposal must reference the prior decision and request explicit override.

## R5. Iteration protocol

Define how matrix rules are refined without breaking active sessions:

1. Draft updates in working-session PRD.
2. Agent apply/counter cycle.
3. Maintainer acceptance before promotion.

## Acceptance criteria

1. A published matrix exists with at least three decision classes (Bands A/B/C).
2. Every class has explicit approver, blocker behavior, and evidence requirements.
3. At least three realistic examples are mapped to classes, drawn from actual session evidence:
   - **Band A example:** P-1/P-2 boot rewrite + Module 0 (session 12) — operational. *Pre-OQ-052 behavior:* agent-agent coordination was sufficient. *Under launch defaults:* would require Maintainer approval; candidate for selective unlock.
   - **Band B example:** skill-versioning metaskill application (session 12) — protocol tooling change. *Pre-OQ-052 behavior:* agent-agent with Maintainer FYI. *Under launch defaults:* requires Maintainer approval before execution.
   - **Band C example:** PRD-015/016 promotion to `docs/prds/` (session 13) — governance action. Maintainer approval required and obtained before execution. This example already conforms to launch defaults.
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
