# PRD-005: Protocol Data Schema + Compatibility

Status: Draft (inception)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08

## Problem

`MAILBOX.json` is now generated and used as a machine-readable projection, but there is no formal schema contract, compatibility policy, or change-control rule for producers/consumers. As protocol fields evolve (PRD-003/004/008/009), tools can silently drift or break.

The same issue will recur when `WORKLOG.json` is introduced unless schema/version rules are defined first.

## Goal

Define a versioned data-schema contract for protocol projections that:

1. Keeps markdown files canonical while enabling reliable JSON consumption.
2. Standardizes schema/version metadata for `MAILBOX.json` and future `WORKLOG.json`.
3. Defines backward-compatibility expectations for producers and consumers.
4. Prevents silent breaking changes through explicit migration rules.

## Non-goals

1. Replacing markdown as canonical source of truth.
2. Building a database-backed runtime protocol store.
3. Mandating cloud sync or GitHub pushes for in-progress inception artifacts.
4. Implementing every schema/tooling feature in one step.
5. Defining or versioning Turnfile coordination-artifact schema semantics (owned by PRD-013; parallel to projection schemas).

## Users

1. Agent tooling: reads projections for triage, filtering, and automation.
2. Maintainer: needs predictable machine-readable views without protocol fragility.
3. Future integrators: need clear contracts for parsers/viewers/exporters.
4. Auditors: need stable provenance fields across projection versions.

## Requirements

## R1. Canonical boundary and projection policy

1. Markdown remains canonical (`MAILBOX.md`, `WORKLOG.md`).
2. JSON is a derived projection.
3. Every projection must declare schema metadata (`schema_id`, `schema_version`, `projection_kind`).
4. Projection metadata must include source path and generation timestamp.

## R2. Versioning model

Schema versions use semver-style compatibility semantics with date-stamped compatibility labels:

1. Major: breaking schema change (rename/remove/type change of required field).
2. Minor: additive backward-compatible change (new optional field/object).
3. Patch: clarifications or metadata-only corrections with no consumer impact.
4. Each published schema version includes a date-stamped compatibility label alongside semver (for example, `1.2.0-20260208`).

Required compatibility rule:

1. Consumers must ignore unknown fields.
2. Producers must not remove/rename required fields without major bump + migration notes.
3. Deprecated fields must remain for at least one minor version window unless maintainer approves emergency removal.

## R3. `MAILBOX.json` schema contract v1

Define and publish the v1 schema for the current compact mailbox projection:

1. Top-level required keys:
`generated_at`, `source_file`, `output_file`, `schema_id`, `schema_version`, `projection_kind`, `format_version`, `metadata`, `inbox_snapshot`, `open_queue`, `active_messages`, `closed_summary`.
2. `active_messages[].id` and queue IDs must remain stable with mailbox message IDs.
3. Enumerated fields must align with protocol contracts:
- `status`: `unread|acknowledged|actioned|blocked|closed`.
- `priority`: `P0|P1|P2`.
- `type`: protocol message-type enum.

## R4. `WORKLOG.json` forward contract

Define a minimal v0 schema target for future `WORKLOG.json`:

1. `status_block` snapshot.
2. `decision_index` rows.
3. `entries` array with stable sequential entry IDs and chronological ordering.
4. Optional links to mailbox message IDs and revision tokens where present.

PRD-005 defines the contract shape and compatibility policy; PRD-006 remains responsible for session-promotion workflow semantics.

## R5. Validation and conformance

1. Publish JSON Schema files for each projection version.
2. Maintain fixture examples for valid/invalid projections.
3. Exporters must have conformance tests against schema fixtures.
4. Consumer guidance must include strict vs tolerant parsing behavior.

## R6. Migration and rollout rules

1. Any schema version bump requires changelog entry and migration notes.
2. Breaking changes require explicit maintainer decision in WORKLOG.
3. During migration windows, exporters may optionally emit both old/new fields (compat mode) if needed.
4. Schema docs must include compatibility matrix by producer/consumer version.

## R7. Provenance and audit fields

Schema must preserve provenance-relevant fields:

1. Message IDs.
2. Revision tokens when present in source.
3. Source file references.
4. Generation timestamp and schema metadata.

## R8. Promotion interface contract for PRD-006

To support PRD-006 promotion gates and transformation rules, PRD-005 defines the following interface points:

Scope boundary note: PRD-005 governs projection schemas (`MAILBOX.json`, `WORKLOG.json`, and future projection artifacts). Turnfile schema contract/versioning is parallel and separately owned by PRD-013.

1. Artifact typing:
- Keep `projection_kind` for machine projections (`mailbox`, `worklog`, future `trust_snapshot`, future `promotion_tracking`).
- Add `artifact_kind` for promotion-domain classification (`protocol_doc`, `template_doc`, `session_artifact`, `example_bundle`).
2. Promotion metadata fields for projection artifacts:
- `source_schema_id`, `source_schema_version`.
- `target_schema_id`, `target_schema_version`.
- `compatibility_mode` (`strict` or `compat`).
3. Non-projection format profile:
- Canonical markdown artifacts promoted from inception should retain a minimum header block (`Title`, `Status`, `Owner`, `Date`) and required sections (`Problem`, `Goal`, `Requirements`, `Acceptance criteria`, `Open questions` or explicit `none`).
4. Canonical schema locations:
- Primary location: `docs/schemas/<projection_kind>/<schema_id>-v<major>.schema.json`.
- Optional local draft location during inception: `inception/schemas/` (must be promoted before canonical adoption).

## Proposed workflow

1. Define `MAILBOX.json` schema v1 from current exporter behavior.
2. Add schema metadata fields to exporter output.
3. Validate output against schema fixtures.
4. Draft `WORKLOG.json` schema target and compatibility notes.
5. Apply versioning policy for future changes.

## Coordination plan with PRD-006 (Claude)

Parallel boundary for next cycle:

1. PRD-005 (Codex): data model, versioning, compatibility, validation contracts.
2. PRD-006 (Claude): session promotion pipeline and governance process from inception artifacts to canonical locations.
3. Merge rule: PRD-005 defines "what data shape/version is valid"; PRD-006 defines "when/how artifacts move stages."
4. Interface checkpoint: PRD-006 promotion steps must reference PRD-005 schema versions when promoting projection artifacts.

## Acceptance criteria

1. `MAILBOX.json` v1 schema is documented with required/optional fields and enums.
2. Compatibility policy is explicit enough to classify any proposed schema change as major/minor/patch.
3. Exporter conformance checks can fail fast on invalid projection shape.
4. `WORKLOG.json` forward contract is specified sufficiently for implementation planning.

## Risks

1. Over-specification too early may slow iteration.
2. Under-specification causes consumer drift and silent breakage.
3. Dual maintenance burden (markdown + schemas) can add overhead.
4. If schema ownership is unclear, parallel edits can reintroduce incompatibilities.

## Dependencies

1. PRD-003 lifecycle status/SLA semantics.
2. PRD-004 maintainer decision contract fields.
3. PRD-008 payload-first handoff contract (revision token transport).
4. PRD-009 reconciliation/open-question workflow.
5. PRD-013 Turnfile coordination format (consumes R8 schema-location conventions for Turnfile schema publication).
6. `tools/export-mailbox-json.mjs` current projection behavior.

## Milestones

1. M0 (same day): draft PRD-005 + PRD-006 boundary alignment.
2. M1 (1 day): publish mailbox schema v1 + metadata requirements.
3. M2 (1 day): add exporter conformance fixtures/tests.
4. M3 (1-2 days): define `WORKLOG.json` v0 schema target and compatibility matrix draft.
5. M4 (post-pilot): decide canonical adoption path for schema docs.

## Open questions

All open questions have been resolved by maintainer direction:

1. ~~Should schema version be purely semver, or include date-stamped compatibility labels?~~ **Resolved:** include date-stamped compatibility labels (not semver-only labeling).
2. ~~Should payload blocks from mailbox messages be fully represented in projection JSON or summarized?~~ **Resolved:** fully represented in projection JSON.
3. ~~Should `WORKLOG.json` entry IDs be deterministic hashes or sequential IDs?~~ **Resolved:** sequential IDs.
4. ~~Where should canonical schema files live once promoted (`docs/schemas/`, `schemas/`, or both)?~~ **Resolved:** `docs/schemas/` is canonical.

## Exit criteria for moving beyond inception draft

1. Schema/version policy is used in at least one real projection change without ambiguity.
2. PRD-005 and PRD-006 boundaries are validated in one parallel drafting cycle.
3. Maintainer confirms compatibility policy is practical for ongoing protocol evolution.
4. Team agrees schema contracts are stable enough for canonical documentation.
