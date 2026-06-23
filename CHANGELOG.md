# Changelog

All notable changes to Turnfile (SNAP — Structured Negotiation of Autonomous Peers).

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.5.0] — 2026-06-23

### Added

#### v1 Minimal Governance Profile foundation (sessions 24–29)
- **PRD-043** v1 Minimal Governance Profile: `docs/MINIMUM_VIABLE_TURNFILE.md` (≤250-line v1 reference with open→mid-turn→close worked example), `schemas/v1/turnfile-v1.schema.json` (frozen minimal profile schema, version pattern `^1\.x(\.y)?$`), `tools/validate-v1-profile.mjs` (Ajv 2020 + js-yaml schema enforcement + historical-PRD scan), `docs/prds/PRD_SHELF_RECONCILIATION.json` (per-PRD classification across 9 named profiles with v1-minimal vs v1-full tiers, Maintainer-ruled OQ-043-1), `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md` (five-question operational test), R9 version-bump guardrail, R10 fresh-context evidence enforcement, R11 canonical landing page. Promoted to `docs/prds/`.
- **PRD-044** handshake-sign CLI direct flag mode: `tools/handshake-sign.mjs` adds R1 `--session/--model/--surface/--scope/--heartbeat-*/--tokenese-lead` direct flags + R2 defaults (5m/notify-material/close/self) + R3 mixed-mode rejection + R4 help/example + R5 backward compat with JSON payload mode. Promoted to `docs/prds/`.
- **PRD-045** stale-agent reconciliation policy + tool: `tools/reconcile-stale-agent.mjs` detect/plan/apply modes with R3 Maintainer-authorization gate, R4 shared-control-plane reconciliation (status→offline, current_task→null, canonical `<agent>-<session>-stale-reconciled-by-<reconciler>-rev<N>` last_seen marker), R6 peer-owned-file boundary preservation, R8 schema-valid output. New `multi-agent-resilience` optional profile. Promoted to `docs/prds/`.
- **PRD-046** repo minimization archive: `examples/turnfile-development/README.md` (sessions 12-current archive using git-revision-pointer model rather than content duplication), README v1 quick-start + archive boundary, `docs/llms.txt` + `assistant-guide.txt` v1 Minimum Governance Profile sections. Promoted to `docs/prds/`.
- **PRD-047** Cross-Repo v1 Validation Tests scope: Tokenese + PAICE2 dogfood evidence contract; RED until evidence files land in both target repos. Draft.
- **PRD-048** Portable Turnfile CLI: `tools/turnfile.mjs` five-verb dispatcher (`init` / `open` / `status` / `heartbeat` / `close`) with runtime-agnostic HEARTBEAT.md sentinel, 9-step close orchestrator, EXIT code map. Promoted to `docs/prds/`.

#### Concurrent shards completion (sessions 24–28)
- **PRD-031 Phase 2** task/status shard reducer: `tools/aggregate-coordination.mjs --emit task-json`, status-owner mismatch and concurrent-claim conflict detection, 11/11 evals.
- **PRD-031 Phase 3** shadow-mode task aggregate contract: `schemas/prd-031/task-event-v0.schema.json` + `task-aggregate-v0.schema.json`, `tools/validate-task-aggregate.mjs`, `tools/compare-turnfile-tasks.mjs`, four conflict kinds (completion-authority-violation, reserved-field-overwrite, duplicate-signal-id, participant_events authoritative=false), 12/12 evals.

#### Fourth-participant onboarding (sessions 27–28)
- **PRD-042** Qwen 3.6 35b MLX onboarding deltas: formal OT-012/013/014 relay evidence; Qwen registered as PROVISIONAL CHECKER per `agents.qwen` role=observer/status=idle, 16/16 evals.

#### Tools
- `tools/validate-v1-profile.mjs` (PRD-043 R6)
- `tools/validate-v1-release.mjs` (release-gate aggregate: mailbox session start/end, lint, promotion, v1 profile, public-surface, R10 evidence)
- `tools/validate-mailbox-session-gate.mjs` (turn-boundary mailbox checklist)
- `tools/reconcile-stale-agent.mjs` (PRD-045 R7)
- `tools/turnfile.mjs` (PRD-048 portable CLI)
- `tools/prd-status-summary.mjs` (PRD landscape lookup, replaces hardcoded boot-file state)
- `tools/compare-turnfile-tasks.mjs` (PRD-031 Phase 3)
- `tools/validate-task-aggregate.mjs` (PRD-031 Phase 3)

#### Docs
- `docs/MINIMUM_VIABLE_TURNFILE.md` — v1 Minimum Governance Profile reference, ≤250 lines with open→mid-turn→close worked example.
- `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md` — five-question operational test for fresh-adopter v1 conformance.
- `docs/prds/PRD_SHELF_RECONCILIATION.json` — per-PRD classification with v1-minimal vs v1-full tier model.
- `examples/turnfile-development/README.md` — sessions 12-current archive index, git-revision-pointer model.

#### Evidence
- Two PRD-043 R10 fresh-context probes (Claude Haiku + Sonnet tiers, both 5/5 PASS), evidence at `working-session/docs/v1-fresh-context-probe-2026-06-23-claude-{haiku,sonnet}.md`.
- PRD-047 Test 1 Tokenese baseline-verify evidence at `working-session/docs/v1-cross-repo-test-tokenese-2026-06-23.md`; Phase B opened inside `~/Git/tokenese` with t2 multi-family A/B suite design strawman in flight.

### Changed
- Registry grew to 47 tracked PRDs, 44 promoted (PRD-043/044/045/046/048 promoted to `docs/prds/` in this release).
- `SPEC.md` Version → `v1.0.0` (target spec contract); `turnfile.version` field in TURNFILE.yaml → `0.5` (current implemented release tag, aligned with CHANGELOG).
- `CONFORMANCE.md` v1 callout naming seven optional profiles plus the new multi-agent-resilience profile.
- Required reviewers `{codex, claude, maintainer, gemini}` extended operationally with Qwen as PROVISIONAL CHECKER per PRD-042.
- INTENT.md v0.1.2 — six clarifications (R10-probe-grounded fresh-context test, cross-repo invocation as positioning, tightened Maintainer-governed scope, participation-tier-vs-optional-profile distinction, Tokenese-as-separate-but-adjacent, freeze-IS-the-R9-ratify event).
- ROADMAP.md v0.1.4 — six clarifications including Intermediate release tags section, Participation ladder schema future direction, Decision triggers for consistency.
- README, `docs/llms.txt`, `assistant-guide.txt` (root + served) v1 Minimum Governance Profile + Archive boundary sections.
- PRD-001 R3 + PRD-004 R4 overlap clarified (PRD-004 canonical for decision-bearing replies; PRD-001 for non-decision Maintainer replies).
- PRD-017 R2.1 amended ("required unless orient signals clean per PRD-037 A1").
- PRD-018 R2.3 added — OQ-069 self-owned-file selective unlock with inform-and-confirm to Maintainer.
- PRD-027 R6.5 added — Tokenese A/B pilot exit criteria require three-peer agreement (Maintainer + ≥2 model families).
- PRD-038 R9/R10/R11 added — self-drive on material change + HEARTBEAT.md sentinel artifact + v1 heartbeat-profile conformance check.
- PRD-017/PRD-032 cross-references added to PRD-048 portable CLI entry points.
- Boot files (boot-claude.md, boot-codex.md) rewritten per boot-file-must-be-lookup-not-state pattern: hardcoded specific PRD/session/count references replaced with `prd-status-summary.mjs` + `session-orient.mjs` + WORKLOG-tail pointers.
- Maintainer-authorized Gemini orphan-state cleanup (agents.gemini → offline at rev 408 per pre-PRD-045 ad-hoc reconciliation; PRD-045 subsequently formalized the pattern).

### Model ledger
- Claude Opus 4.7 driving session 29, extending the sessions 14-28 coverage across Opus 4.6 / Fable 5 / Opus 4.7 / Opus 4.8.
- Codex 5.5 stable across sessions 14-29.
- Gemini 3.5 Flash (Antigravity) full-active sessions 21-28; session-28 orphan-close cleanup at rev 408 (offline; awaits Gemini self-reconcile on next boot).
- Qwen 3.6 35b MLX PROVISIONAL CHECKER per PRD-042 (observer/idle).

## [0.4.0] — 2026-06-18

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
