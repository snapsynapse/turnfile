---
title: "Turnfile ROADMAP"
version: "0.1.4"
last_updated: 2026-06-23
status: v1-release-candidate-planning
description: "Non-normative planning roadmap for Turnfile v1 release readiness, optional profiles, and future integration work."
tags: [roadmap, planning, turnfile, agents, governance]
---
# Roadmap
Status: planning notes for actions not yet executed and decisions not yet made.
This roadmap is not normative. It records likely future work so unresolved items remain visible without becoming commitments.
## Current state
Turnfile has a working protocol corpus, validation tooling, examples from real multi-agent sessions, skills for Codex and Claude, staged Gemini onboarding artifacts, and a passing local validation suite.
The project now narrows from "multi-agent collaboration protocol" to "thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms."
## Near-term reset
### 1. Scope reconciliation
Status: complete for v1 release-candidate planning.
Work:
- `INTENT.md` is the forward strategy source.
- `SPEC.md` is the concise normative contract.
- `VISION.md` is historical and explanatory unless later reconciled.
- README and public surfaces point fresh adopters toward the v1 minimal path.
- PRD status, shelf reconciliation, and archive notes classify historical protocol mass without making it required reading.
Acceptance criteria:
- A new maintainer or agent can explain Turnfile's narrowed role after reading README, INTENT, and SPEC.
- The project no longer implies it should compete with agent runtimes or workflow frameworks.
- A fresh adopter can use the canonical docs, templates, CLI, and validators without reading historical PRDs. (Operationally verified by the PRD-043 R10 five-question probe, evidence at `working-session/docs/v1-fresh-context-probe-*`.)
### 2. Minimal starter workflow
Status: release-candidate surface landed; final hardening continues through v1 evidence.
Work:
- Keep the smallest useful artifact set visible in `docs/MINIMUM_VIABLE_TURNFILE.md`, templates, and CLI output.
- Keep onboarding centered on a short sequence rather than the inception archive.
- Preserve examples that show "two agents plus maintainer" and "single agent plus independent review" patterns.
- Validate the starter workflow from a fresh context.
Acceptance criteria:
- A repo can adopt Turnfile by copying one folder and reading one guide.
- The starter workflow validates locally.
- The starter workflow does not require reading the inception archive.
### 3. CLI ergonomics
Status: initial portable CLI landed; refine only where repeated manual friction remains.
Work:
- Maintain minimal commands only where they reduce clerical overhead.
- Current command surface: `init`, `open`, `status`, `heartbeat`, `close`.
- Consider future commands only after repeated manual mappings prove useful.
- Keep files editable by hand.
- Avoid daemon, server, account, database, or hosted dependency requirements.
Acceptance criteria:
- The CLI is optional.
- Hand-edited files remain valid protocol artifacts.
- The validation suite covers the CLI-generated artifacts.
### 4. Fast audit-preserved coordination
Status: optional profile, not a core-v1 blocker.
Goal:
- Allow compact operational exchanges when speed matters, while preserving a complete English audit projection.
- Keep lifecycle state, task claims, locks, acceptance, counters, and maintainer decisions in English authoritative artifacts.
- Reduce routine maintainer mediation for bounded agent-to-agent work without weakening escalation rules.
- Validate any dense or compact lane across multiple model surfaces before broad use.
Work:
- Define which exchange classes are eligible for compact or dense communication.
- Require stable source IDs, English projections, drift checks, and repair records.
- Keep per-agent write paths and derived aggregate views as the preferred structure for fast loops once they are validated.
- Document escalation triggers for policy changes, unresolved counters, validator failures, ownership conflicts, and scope expansion.
- Treat Tokenese as the current measurement candidate for this profile, not as a core requirement.
- See §Tokenese-first coordination for the eventual Tokenese-as-source extension of this profile.
Acceptance criteria:
- A bounded operational or handoff exchange completes with source/projection links and validator evidence.
- English projections are present in mailbox, worklog, or documentation artifacts without manual reconstruction.
- Source/projection drift checks pass.
- Lifecycle state, acceptance, and maintainer decisions remain legible and authoritative.
- Maintainer intervention is limited to explicit escalation cases.
Non-goals:
- Do not make Turnfile an agent runtime, scheduler, or hidden policy engine.
- Do not let compact or dense traffic carry authoritative lifecycle status, lock claims, acceptance, normative text, exact diffs, or decisions without an English source.
- Do not broaden beyond bounded operational and handoff traffic until validators prove source/projection sync and the maintainer explicitly authorizes the next band.
- Do not make optional compact-lane work part of core v1 conformance.
### 5. Platform integration notes
Status: planned.
Work:
- Add non-normative integration notes for Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, MCP, A2A, and GitHub pull requests.
- For each platform, specify what the platform should own and what Turnfile should own.
- Avoid claiming platform endorsement or dependency.
Acceptance criteria:
- Each note names the platform as an execution substrate, not a replacement for Turnfile's governance role.
- Integration notes are examples, not conformance requirements.
Decision trigger:
- Add when at least one adopter requests a specific platform mapping, or when a manual platform integration is repeated three or more times.
### 6. PRD shelf cleanup
Status: complete for v1 release-candidate planning.
Work:
- `PRD_STATUS.json` gives every PRD an explicit lifecycle status.
- `docs/prds/PRD_SHELF_RECONCILIATION.json` classifies every PRD through PRD-048 for v1 planning.
- Promoted PRDs remain limited to contracts still needed by the minimal governance layer or accepted optional profiles.
- Historical and archived protocol mass is no longer required reading for the canonical v1 surface.
- Use `node tools/prd-status-summary.mjs --filter <open|blocked|unratified|draft|promoted|archived>` to report current shelf state without requiring readers to parse the JSON. `--gates v1` reports v1.0.0 R9 release-gate readiness; `--id PRD-NNN` returns one PRD's full record.
Acceptance criteria:
- Every PRD has an explicit status.
- The canonical spec does not require reading stale or superseded PRDs.
- New PRDs after PRD-048 must update both `PRD_STATUS.json` and the shelf reconciliation artifact before release claims rely on them.
## Future directions
### Adapter library
Possible, not committed.
Candidate adapters:
- GitHub pull request review summaries into mailbox entries.
- Runtime traces into evidence links.
- MCP tool exposure review into maintainer-gated decisions.
- A2A delegated task results into apply-or-counter messages.
Decision trigger:
- Build adapters only after the starter workflow is stable and a repeated manual mapping is observed.
### Decision digest
Possible, not committed.
Work:
- Generate a compact maintainer digest from mailbox, worklog, and Turnfile state.
- Preserve dissent and unresolved objections rather than flattening into a single summary.
Decision trigger:
- Build when sessions produce enough open records that maintainer attention becomes the bottleneck.
### Tokenese-first coordination
Eventual goal, not urgent.
Goal:
- Move beyond Tokenese twins of English-first artifacts toward Tokenese-first operational exchanges.
- Generate English audit projections from Tokenese source traffic into mailbox, worklog, and documentation artifacts.
- Keep the generated English projection mandatory for audit, review, search, and maintainer governance.
Work:
- Define which Tokenese constructs are allowed to be source traffic and which remain English-only.
- Add deterministic Tokenese-to-English projection tooling with source IDs, hashes, and drift checks.
- Require every generated English projection to link back to its Tokenese source and validation result.
- Preserve English authority for lifecycle state, lock claims, acceptance, normative PRD text, exact diffs, and decisions until a future Maintainer decision explicitly changes that boundary.
- Add review workflows for projection quality, including human spot checks and model-independent validator checks.
Acceptance criteria:
- A bounded operational/handoff exchange can start in Tokenese, generate English mailbox or worklog projections, and pass source/projection drift validation.
- Maintainer can audit the English projection without needing to read Tokenese.
- Agents can reconstruct the Tokenese source, generated English projection, and validation evidence from stable IDs.
Decision trigger:
- Start only after the Tokenese CLI twin lane is validated across at least three model surfaces and PRD-035-style result/projection validators exist.
### Governance profile levels
Possible, not committed.
Candidate levels:
- Level 0: ad hoc notes.
- Level 1: session files present.
- Level 2: validation passes.
- Level 3: independent peer review recorded.
- Level 4: maintainer resolution recorded with evidence.
- Level 5: runtime traces or external review artifacts linked.
Decision trigger:
- Add only if adoption needs a conformance vocabulary. Avoid creating a maturity model prematurely.
### Public examples
Possible, not committed.
Work:
- Create cleaned examples that show a compact modern Turnfile workflow.
- Preserve the inception archive as raw evidence but stop using it as the first adoption path.
Decision trigger:
- Add after the minimal starter workflow is validated.
### Tool layout consolidation
Possible after v1.0.0, not before.
Work:
- Keep `tools/` flat through the v1 freeze so existing evals, docs, and CI scripts remain stable.
- Maintain `tools/README.md` as the orientation layer for validators, session tools, PRD helpers, and optional-profile utilities.
- After v1.0.0, consider grouping scripts into `tools/session/`, `tools/validators/`, `tools/prd/`, and `tools/optional-profiles/`.
- If scripts move, update every eval, package script, public doc, boot file, and release checklist reference in the same change.
Decision trigger:
- Start only after v1.0.0 lands and a tool-layout change has its own eval coverage or scripted migration check.
### Participation ladder schema
Possible, not committed.
Work:
- Encode the participant onboarding ladder (observer → provisional checker → constrained writer → full-active) explicitly in `schemas/v1/turnfile-v1.schema.json` as `agents.<id>.rung`.
- Today the ladder is implicit: it lives across `role`, `status`, and per-PRD acceptance evidence (PRD-039 R5 for search-grounded candidates, PRD-042 R5 for local-model candidates such as Qwen).
- Provide a validator that asserts a participant cannot exercise a capability above its current rung without recorded promotion evidence.
Decision trigger:
- Add when adopter friction shows the implicit pattern isn't enough, or when more than three participants need to coexist at different rungs simultaneously.
## Deferred
- Hosted Turnfile service.
- Central registry.
- Live multi-agent scheduler.
- Agent runtime implementation.
- Vendor-specific dependency.
- Full replacement of existing PRDs with a new spec corpus in one pass.
## Intermediate release tags
Intermediate release tags between v0.x and v1.0.0 are acceptable. v1.0.0 is reserved for the Minimal Governance Profile freeze; intermediate tags (e.g. v0.5.0) record substantive interim work without claiming v1 conformance. Bump the `turnfile.version` field in `TURNFILE.yaml` only when an intermediate tag lands, so the field tracks the release tag rather than drifting against the CHANGELOG.

## Release readiness for v1.0.0
- README reflects thin-layer positioning.
- `INTENT.md`, `SPEC.md`, `DEFINITIONS.md`, `ROADMAP.md`, `SECURITY.md`, and `CHANGELOG.md` are aligned.
- Minimal starter workflow exists.
- Validation passes locally and in CI.
- Historical PRDs have explicit status.
- Fresh-context probe evidence exists at `working-session/docs/v1-fresh-context-probe-*.md` per PRD-043 R10.
- Cross-repo dogfood evidence exists at `working-session/docs/v1-cross-repo-test-<repo>-<date>.md` per PRD-047 R6.
- Blocking objections are resolved or explicitly arbitrated by the Maintainer.
- Optional profiles are clearly outside v1-minimal unless promoted.
- The release gate aggregate (`node tools/validate-v1-release.mjs --format json`) reports `ok:true`; per-condition status from `node tools/prd-status-summary.mjs --gates v1`.
