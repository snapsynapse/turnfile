# Changelog

All notable changes to Turnfile (SNAP — Structured Negotiation of Autonomous Peers).

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

#### Three-agent protocol (sessions 18–23)
- Gemini (Google, Gemini 3.5 Flash (High), Google Antigravity IDE) onboarded under PRD-015 and promoted to full-active peer in session 21. Turnfile now runs three heterogeneous agents — Claude, Codex, Gemini — on one unmodified protocol, each with its own role-keyed skill bundle. Required reviewers extended to {codex, claude, maintainer, gemini}.
- PRD-037 (boot simplification) and PRD-038 (read-only heartbeat stewards) accepted, promoted, and implemented. New `tools/handshake-sign.mjs` collapses the boot write to a single tool call; the default heartbeat is a 5-minute self-owned, read-only steward (notify-on-material-only, deleted at clean close).
- PRD-039 (Perplexity onboarding deltas) accepted: a four-rung onboarding ladder (OBSERVER → PROVISIONAL CHECKER → PROVISIONAL CONSTRAINED WRITER → FULL-ACTIVE) for search-grounded candidates, with citation discipline as a contract obligation. New `tools/validate-onboarding-evidence.mjs` and `evals/onboarding-execution.evals.mjs` enforce the evidence-artifact structure and rung-transition gates.
- PRD-040 (heartbeat loop prompt contract) accepted.
- PRD-041 (unified terminal transport + deterministic projection) drafted and accepted: a structured event log as source of truth, with the terminal view and repo markdown both as deterministic projections (no LLM in the projection path) and a router that removes the human from routine message transport while preserving maintainer governance.
- Tier-B Tokenese operational/handoff twin lane authorized after the calibration audit — English source-wins, governance English-only, self-report channels untrusted by default.

#### Tooling and docs
- New tools: `handshake-sign`, `session-orient`, `validate-onboarding-evidence`, plus execution-layer onboarding evals.

### Changed
- Registry grew to 40 tracked PRDs (37 promoted).
- Refreshed public and agent-facing surfaces (README, `docs/index.html`, `docs/llms.txt`, the `assistant-guide` GuideCheck pair + manifest) to the current registry snapshot.


## [0.3.0] — 2026-06-17

### Added

#### Implementation arc (sessions 13–16)
- Ran the eight-step eval-gated implementation loop (PRD-006 A1) end-to-end across many contracts, each with builder/reviewer separation between two heterogeneous agents (Claude, Codex).
- Implemented PRD-017 (boot sequence + docs), PRD-021 (conflict-loop bound + selective-unlock gradient), PRD-022 (decision-mirror delivery), PRD-023 (out-of-band reconciliation), PRD-024 R5.1 (dense-fragment validator), PRD-026 (review-cycle closure), PRD-028/029, PRD-030 (session heartbeat management), and PRD-031 Phase 1 (concurrent multi-agent coordination: per-agent shards + namespaced ids + derived aggregates). Landed the PRD-014 Amendment A1 closeout compaction/projection contract.
- New tools: `aggregate-coordination`, `validate-closeout`, `validate-boot-sequence`, `validate-out-of-band-reconciliation`, `validate-review-cycle-closure`, `next-state`, `validate-tokenese-pairs`, plus `validate-prd-promotion` and `export-mailbox-json`.
- New docs: `BOOT_SEQUENCE.md` (canonical boot command manifest), `CONFORMANCE.md`, `RELEASE_CHECKLIST.md`, `NEXT_SESSION_HANDSHAKE.md`.
- Live Tokenese A/B pilot (PRD-027): teach phase, agreed suite, mini-pilot + W2/W3/W5/L1/L2 pairs scored by a deterministic checker; measurement-only, English authoritative.
- Promoted session-17 contracts: PRD-032 (session orientation tool) and PRD-033 (skill ownership integrity guard), both implementation-done.
- Role-keyed per-agent skill bundles (`skills/claude`, `skills/codex`, `skills/gemini-3`) with model compatibility recorded in MANIFEST; one unmodified protocol validated across Claude Opus 4.6, Fable 5, and Opus 4.8.
- Repo-standards adoption: GitHub Pages `/docs` publish, `docs/llms.txt` + `docs/sitemap.xml` + `assistant-guide.txt` trust-anchored pair, `LICENSE`/`LICENSE-SPEC` split, expanded `INTENT.md`.

#### Direction reset
- Added `INTENT.md` to reposition Turnfile as a thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms.
- Added `SPEC.md` as the concise forward normative contract for the narrowed protocol.
- Added `DEFINITIONS.md`, `ROADMAP.md`, and `SECURITY.md` to align Turnfile with the repository conventions used across related PAICE projects.
- Updated README document map to distinguish forward direction docs from historical protocol and inception artifacts.

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
- Shared metaskill subproject for cross-agent skill bundle versioning:
  - `skills/skill-versioning/` (`SKILL.md`, `MANIFEST.yaml`, `CHANGELOG.md`, `README.md`, `evals.json`)
  - Canonicalized with cross-platform minimal frontmatter mode for Codex + Claude interoperability
  - Skill template for onboarding new agents (`templates/SKILL.md`)

#### Tooling
- `tools/turnfile-lint.mjs` — YAML validation + schema conformance for TURNFILE.yaml
- `tools/validate-prd-promotion.mjs` — PRD promotion gate validator
- `tools/validate-mailbox-invariants.mjs` — mailbox state consistency checker
- `tools/export-mailbox-json.mjs` — markdown-to-JSON mailbox exporter
- `tools/new-payload-envelope.mjs` — checksum-bearing payload envelope generator
- `tools/validate-skills-preflight.mjs` — skill install/parity/versioning preflight validator

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
