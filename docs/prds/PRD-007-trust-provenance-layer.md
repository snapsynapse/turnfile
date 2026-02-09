# PRD-007: Trust + Provenance Layer

Status: Draft (inception)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08

## Problem

Current protocol artifacts capture decisions and message flow, but trust-relevant provenance is still fragmented across mailbox cards, worklog notes, and ad-hoc relay wording. As sessions scale, this creates avoidable risk:

1. Harder to prove who authored vs relayed vs approved a change.
2. Harder to distinguish process delay from protocol non-compliance.
3. Harder for maintainer to detect repeated quality/reliability issues early.
4. Harder to produce concise audit narratives without replaying whole threads.

PRD-003 defines lifecycle events, PRD-004 defines maintainer decision contracts, PRD-008 defines payload transport, and PRD-009 defines reconciliation workflow. PRD-007 defines how trust/provenance is modeled across those layers.

## Goal

Define a lightweight trust + provenance layer that:

1. Makes authorship and relay chains explicit and machine-readable.
2. Derives explainable trust signals from existing lifecycle/review events.
3. Supports maintainer governance without opaque scoring or hidden penalties.
4. Preserves human-readable auditability in markdown-first workflows.

## Non-goals

1. Replacing maintainer judgment with automated ranking.
2. Building cryptographic identity infrastructure in this phase.
3. Adding punitive enforcement beyond existing governance powers.
4. Turning collaboration logs into surveillance telemetry.

## Users

1. Maintainer: triages reliability risk and audits decision integrity.
2. Agents: need clear provenance expectations and fair, explainable trust signals.
3. Auditors/counsel: need compact provenance chains tied to concrete artifacts.
4. Tool builders: need stable fields for dashboards/projections.

## Requirements

## R1. Actor identity and role attribution

Every trust-relevant event must identify:

1. `authored_by` (originating author).
2. `sent_by` (actor who posted message).
3. `relayed_by` when applicable.
4. `reviewed_by` and `approved_by` where decisions/reviews occur.

Role attribution must be explicit in markdown text and projection fields (per PRD-005 schema policy).

5. Turnfile coordination events (task claims, lock acquisitions, signal posts) provide additional provenance data. `coordination.revision` anchors causal ordering for these events.

## R2. Provenance chain for messages and edits

For any substantive proposal or decision, provenance chain must be reconstructable:

1. Message ID lineage (`MSG-*` references).
2. Revision token lineage (`REV-*` references).
3. Artifact path linkage (source and target docs).
4. Decision linkage to WORKLOG row/entry where final outcome is recorded.
5. Turnfile revision linkage (`coordination.revision`) — establishes causal ordering for coordination events (task claims, lock operations, signal posts).

No silent semantic mutations: changes must be attributable to a revision message or maintainer decision.

## R3. Trust signal catalog (explainable, evidence-backed)

Define trust signals as transparent indicators, not black-box scores:

1. Response reliability: acknowledgment within SLA window (from PRD-003).
2. Review quality: proposal disposition ratio (`accepted`, `accepted-with-modifications`, `counter-recommendation`, `deferred`) from PRD-009.
3. Change integrity: payload completeness and revision-token compliance from PRD-008.
4. Decision follow-through: percent of maintainer decisions with correct WORKLOG linkage from PRD-004.

Every signal must include evidence pointers (message IDs, revision tokens, or worklog entries).

## R4. Trust event taxonomy

Standardize event types for trust analytics:

1. `sla_met`, `sla_missed`.
2. `payload_valid`, `payload_invalid`.
3. `review_accepted`, `review_countered`, `review_deferred`.
4. `decision_linked`, `decision_unlinked`.
5. `relay_explicit`, `relay_ambiguous`.

Taxonomy terms are logical categories; storage format is defined by PRD-005.

## R5. Governance actions and thresholds

Trust layer recommends governance checks; maintainer remains final authority:

1. Repeated `sla_missed` events trigger maintainer review checkpoint.
2. Repeated `payload_invalid` events trigger mandatory payload resend policy reminder.
3. Repeated `decision_unlinked` events trigger decision-audit cleanup before next milestone.
4. Any high-severity provenance ambiguity triggers explicit maintainer adjudication in WORKLOG.

Thresholds must be simple and configurable in session charter notes, not hard-coded globally.

## R6. Explainability and dispute handling

Any trust concern raised against an agent must be explainable with references:

1. Signal summary.
2. Supporting event evidence.
3. Time window/cycle used.
4. Proposed corrective action.

Agents may counter with evidence; maintainer logs final disposition.

## R7. Data schema and compatibility interface

PRD-007 requires PRD-005 schema support for provenance/trust projections:

1. Provenance fields on message and review records.
2. Optional trust-event projection tables/arrays.
3. Versioned compatibility policy for trust fields.

PRD-007 defines semantics; PRD-005 defines wire format and versioning behavior.

4. Scope boundary: if trust/provenance data is projected as a standalone JSON artifact (e.g., `trust_snapshot`), it follows PRD-005 schema conventions. If trust metadata is embedded in Turnfile coordination state, it follows PRD-013 conventions. The two schema domains are parallel (per PRD-005 R8 scope note).

## R8. Privacy and anti-gaming guardrails

1. Trust signals must use protocol artifacts only (no hidden/private telemetry).
2. Signal publication should be aggregate where possible, evidence-linked when needed.
3. Metrics must not reward performative volume over substantive quality.
4. Maintainer may suspend signal use if gaming behavior is detected.

## Proposed workflow

1. Capture lifecycle/review/decision events using existing PRD-003/004/008/009 rules.
2. Annotate provenance links (message ID, revision token, decision reference).
3. Derive trust signals over a defined session window.
4. Post concise trust snapshot in WORKLOG or mailbox when governance action may be needed.
5. Maintainer confirms, defers, or rejects suggested corrective action.

## Coordination plan with PRD-005, PRD-006, PRD-010, and PRD-013

1. PRD-005 owns schema/version/compatibility for trust/provenance projection fields.
2. PRD-006 owns promotion gating; trust/provenance readiness can become promotion evidence. PRD-006 R2a.7 requires explicit promotion-blocker disposition for deferred trust anomalies.
3. PRD-010 generates trust-relevant events (lock acquisition/release, conflict resolution, override actions).
4. PRD-013 provides the revision clock (`coordination.revision`) that anchors causal ordering for provenance.
5. Interface checkpoint for PRD-005:
PRD-005 should declare where trust/provenance fields live in projection schemas and how trust projections are versioned.
6. Interface checkpoint for PRD-006:
PRD-006 R2a.7 specifies that unresolved trust anomalies require explicit maintainer disposition before canonical promotion. OQ-026 worked examples will validate this model.

## Acceptance criteria

1. For at least 3 recent decisions, provenance chain is reconstructable in under 2 minutes using mailbox/worklog IDs.
2. At least 1 trust snapshot is produced with evidence-backed signals and no ambiguous fields.
3. Maintainer can identify one repeated-process issue (if present) from signals without rereading full logs.
4. No trust signal is emitted without evidence references.

## Risks

1. Over-instrumentation may slow collaboration.
2. Poorly chosen thresholds can create noisy governance churn.
3. Trust indicators may be misread as hard rankings.
4. Schema coupling risk if PRD-005 lags behind trust semantics.

## Dependencies

1. PRD-003 message lifecycle + SLA contract.
2. PRD-004 maintainer decision contract.
3. PRD-005 protocol data schema + compatibility.
4. PRD-006 session promotion pipeline (R2a.7 promotion-blocker disposition for trust anomalies).
5. PRD-008 cross-sandbox handoff contract.
6. PRD-009 cross-document reconciliation + open question triage.
7. PRD-010 shared-file transaction locking (lock operations generate trust-relevant events).
8. PRD-013 Turnfile coordination format (revision clock provides causal ordering anchor for provenance).

## Milestones

1. M0 (same day): draft PRD-007 semantics + boundaries.
2. M1 (1 day): align trust event taxonomy with PRD-005 schema plan.
3. M2 (1-2 sessions): generate pilot trust snapshots from live mailbox/worklog events.
4. M3 (post-pilot): decide canonical adoption path and enforcement posture.

## Open questions

All open questions resolved. See OQ registry for full resolution details.

1. ~~Should trust signals be session-local only, or persisted across sessions for trend analysis?~~ **Resolved (OQ-025):** session-local only in pilot.
2. ~~Which trust anomalies should block canonical promotion under PRD-006, if any?~~ **Resolved (OQ-026):** Maintainer accepted worked-example framework. Quality-affecting anomalies (substantive contradictions, unresolved disputes) block promotion. Process anomalies (SLA, format, relay) receive `conditional` or `allow` disposition per PRD-006 R2a.7. Worked examples validated against 4 scenarios (SLA miss → allow, missing rev token → conditional, unlinked decision → conditional, relay ambiguity → allow if content correct).
3. ~~Should relay ambiguity be treated as a hard error or a soft warning in pilot?~~ **Resolved (OQ-027):** soft warning in pilot.
4. ~~Should trust snapshots be generated on fixed cadence or event-triggered only?~~ **Resolved (OQ-028):** event-triggered only in pilot.

## Exit criteria for moving beyond inception draft

1. Trust/provenance semantics are exercised in at least one live cycle without process friction spike.
2. PRD-005 alignment exists for required trust/provenance fields.
3. Maintainer confirms trust signals are useful and explainable.
4. Team agrees layer is stable enough for canonical protocol integration.
