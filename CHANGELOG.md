# Changelog

All notable changes to Turnfile (SNAP — Structured Negotiation of Autonomous Peers).

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

#### PRDs (Product Requirement Documents)
- 12 promoted PRDs defining the full protocol contract stack:
  - PRD-003: Message lifecycle + SLA contract
  - PRD-004: Maintainer decision contract
  - PRD-005: Protocol data schema + compatibility
  - PRD-006: Session promotion pipeline
  - PRD-007: Trust + provenance layer
  - PRD-008: Cross-sandbox handoff contract (payload-first)
  - PRD-009: Cross-document reconciliation + open question triage
  - PRD-010: Shared-file transaction + Turnfile lease locking
  - PRD-011: Session resumption contract
  - PRD-012: Protocol skills pack for Codex + Claude
  - PRD-013: Turnfile coordination format
  - PRD-014: Session closeout + boot handoff contract
- PRD template for drafting new PRDs (`templates/prd.md`)

#### Coordination
- VISION.md — maintainer intent and alignment reference (v2)
- Turnfile coordination format (YAML) with JSON Schema validation (`schemas/turnfile/`)
- Notification protocol v0.6 with 5-status message lifecycle, SLA tiers, payload-first review envelopes
- Open questions registry with 36 resolved questions across all PRDs

#### Skills system
- Per-agent skill files encoding full protocol workflow (PRD-012):
  - Claude skill file (`skills/claude-opus_4.6/SKILL.md`) — v0.2.0
  - Codex skill file (`skills/codex_5.3/SKILL.md`)
  - Skill template for onboarding new agents (`templates/SKILL.md`)

#### Tooling
- `tools/turnfile-lint.mjs` — YAML validation + schema conformance for TURNFILE.yaml
- `tools/validate-prd-promotion.mjs` — PRD promotion gate validator
- `tools/validate-mailbox-invariants.mjs` — mailbox state consistency checker
- `tools/export-mailbox-json.mjs` — markdown-to-JSON mailbox exporter
- `tools/new-payload-envelope.mjs` — checksum-bearing payload envelope generator

#### Templates
- Working-session templates for consistent file naming across agents:
  - TURNFILE.yaml, MAILBOX.md, MAILBOX.json, WORKLOG.md, OPEN_QUESTIONS.md
  - WORKLOG_ARCHIVE.md, MAILBOX_ARCHIVE.md
  - boot-agent.md, chat-agent.md
- Session charter template updated with merged handshake acknowledgments (governance doc references)

#### Examples
- Full inception pilot archive (`examples/inception/`) — 11 sessions of real multi-agent collaboration between Claude and Codex, including mailbox exchanges, WORKLOG, TURNFILE.yaml, skill files, and policy test evidence

#### Governance docs
- NOTIFICATION_PROTOCOL.md — mailbox format, delivery semantics, cross-sandbox handoff rules
- PHASE1_MAINTAINER_REVIEW.md — Phase 1 PRD batch review with test scenarios
- LEGAL_SUMMARY.md — patent landscape summary for counsel handoff
- OPEN_QUESTIONS.md — cross-PRD question registry

### Changed
- Session charter template now includes merged handshake section with protocol governance acknowledgments (replaces separate HANDSHAKE.md)
- Repository restructured: `inception/` archived to `examples/inception/`, active workspace is now `working-session/` (gitignored)
- Skills, schemas, and tools promoted from inception to tracked repository root

### Origin
- Protocol rules derived from a real multi-agent collaboration session (2026-02-07)
- Two LLM agents + human maintainer, ~45 minute session
- 114 tests, 134-URL baseline, zero file collisions
- Extended through 11+ inception sessions with Claude (Anthropic) and Codex (OpenAI)
- Key innovations: file-level lane ownership, contract-first development, structured counter-recommendations, append-only WORKLOG as message bus, Turnfile coordination format, revision-based lease locking
