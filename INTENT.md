---
title: "Turnfile INTENT"
version: "0.1.3"
last_updated: 2026-06-23
status: v1-release-candidate-strategy
description: "Standards-level strategy for Turnfile as a thin governance layer for auditable peer disagreement and maintainer-governed resolution across agent platforms."
tags: [intent, strategy, turnfile, agents, governance]
---
# Turnfile INTENT
Repo-scoped strategy for Turnfile. Portfolio-level strategy lives outside this repository. This document supersedes `VISION.md` for forward development direction; `VISION.md` remains a historical and explanatory intent artifact.
## Current release intent
Turnfile is moving toward v1.0.0 as the Minimal Governance Profile: the smallest durable protocol that preserves independent agent positions, maintainer-governed resolution, and plain-file auditability.
The north-star adoption test is fresh-context validation. A new adopter should be able to run a useful Turnfile session from the current canonical docs, templates, and validators without reading historical PRDs or prior session transcripts. This test is operationally captured by the PRD-043 R10 five-question conformance probe (see `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`); a passing probe is evidence that the v1 surface explains itself.
v1.0.0 is not a claim that every experimental lane is complete. It is a claim that the stable governance core is small, documented, validated, and recoverable. Optional profiles may continue to mature without expanding v1-minimal conformance unless the Maintainer explicitly promotes them.
## What this standard is
Turnfile is a portable governance layer for high-consequence multi-agent work where competent agents may disagree before action.
It is not an agent runtime, workflow engine, task queue, chat system, or orchestration platform. Those layers should be supplied by tools such as Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, A2A hosts, MCP hosts, or future equivalents.
Turnfile occupies the layer above execution: it records independent agent positions, objections, counter-recommendations, maintainer decisions, ownership state, and closeout evidence in plain files that survive tool changes.
## Why it exists
Modern agent platforms are converging on execution control: graphs, supervisors, sandboxes, tools, handoffs, memory, traces, retries, and human approval gates. Those features are necessary, but they do not fully cover peer governance.
The gap Turnfile addresses is narrower:
- A maintainer wants more than one agent or model family to reason independently.
- The agents may disagree in ways that should not be collapsed into a single final answer too early.
- The maintainer needs an auditable decision trail showing what was proposed, what was opposed, what was accepted, and why.
- The work should remain portable across vendors and runtimes.
Turnfile exists because orchestration answers "what ran?" and "what happened next?" better than it answers "who objected before we acted?" and "who had authority to resolve the disagreement?"
## Strategic position
Turnfile should become a thin overlay, not a competing platform.
Primary positioning:
- Governance over orchestration.
- Peer disagreement over supervisor assignment.
- Maintainer resolution over autonomous consensus claims.
- Durable plain-text audit over proprietary trace lock-in.
- Runtime portability over framework ownership.
- Cross-repo invocation as a first-class operational mode: Turnfile can be summoned into another repository to coordinate that repository's own work without dragging the inception repo into the conversation.
## Design invariants
These are the core commitments future work should preserve.
1. Turnfile does not run agents. It coordinates and records work performed by agents running elsewhere.
2. Peer positions are first-class. A counter-recommendation is not an error path or failure state.
3. Maintainer authority is explicit. Agents may draft, review, object, and propose, but high-impact resolution remains human-governed (intent, scope, arbitration of unresolved peer conflict, and ratification) unless a narrower automation policy is written down. The Maintainer is not the task-router for full-active peers; routine implementation, lane ownership, and review choices live with those agents. The Maintainer DOES act as task-router for sub-rung participants (observers, provisional checkers, provisional constrained writers per PRD-039 R5 / PRD-042 R5) until they reach full-active status; routing for such participants is normal Maintainer work, not an exception.
4. Files are the source of truth. Optional CLIs, adapters, and integrations may improve ergonomics, but the protocol must remain readable and recoverable without them.
5. The protocol is vendor-neutral. It may document integration patterns for named platforms, but it must not depend on any one provider, model, or hosting runtime.
6. The minimum useful artifact set must stay small. If a fresh adopter must read the historical PRD archive to start, validate, and close a basic session, the project has failed its adoption test.
7. Auditability beats raw speed. Turnfile is for decisions where disagreement and accountability matter enough to justify the extra ceremony.
## Profile boundary
Core v1 is the Minimal Governance Profile. It covers the required session artifacts, basic mailbox lifecycle, worklog evidence, maintainer arbitration, peer disagreement, closeout expectations, and the validator path needed to prove those files are internally consistent.
Participation tier and optional profile are orthogonal concepts. *Participation tier* describes what a participant can do: v1-minimal (lesser-level participation; three core files; no skill bundles required) versus v1-full (full participation including PRD authorship and required-reviewer roles; adds skill-bundle integrity). *Optional profiles* describe feature bundles a session may layer onto either tier. A v1-minimal participant may use heartbeat or cross-repo profiles without being v1-full; a v1-full participant may run a session that uses no optional profiles. Per-PRD classification across both axes lives in `docs/prds/PRD_SHELF_RECONCILIATION.json`.
Optional profiles are real Turnfile work but not v1-minimal requirements unless promoted by Maintainer decision. Current optional-profile candidates include Tokenese measurement, heartbeat stewarding, stale-agent reconciliation, concurrent shard aggregation, agent onboarding, public-surface generators, skill-bundle integrity, and cross-repo dogfood evidence.
Tokenese is a special case: it is a separate repository and protocol (`~/Git/tokenese`). What's optional in Turnfile is the *interop pattern* (the PRD-027 R7 cross-repo boundary), not the Tokenese protocol itself. Tokenese semantics are not edited from Turnfile.
Deferred or excluded surfaces remain outside Turnfile's core: runtime orchestration, autonomous consensus, hidden policy enforcement, general project management, model memory management, sandbox control, and task execution.
## Non-goals
Turnfile should not attempt to become:
- A multi-agent framework.
- A supervisor-agent planner.
- A replacement for Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, A2A, or MCP.
- A general project management system.
- A chat transcript store.
- A hidden policy engine.
- A claim that agent consensus is equivalent to correctness.
## Target users
Primary users:
- Maintainers running multiple coding or research agents across one repository.
- Teams using independent AI review before high-impact changes.
- Standards or governance projects where dissent must be retained, not summarized away.
- Operators who need cross-tool continuity when agent runtimes change.
Secondary users:
- Agent framework authors who want a governance/audit pattern without inventing one.
- Security and compliance teams evaluating agent-assisted work.
- Researchers studying multi-agent disagreement, review quality, and human arbitration.
Non-target users:
- Teams optimizing for maximum autonomous throughput.
- Fully centralized task orchestration where one supervisor model should assign and merge all work.
- Low-risk personal automation where the overhead of a decision record is not justified.
## Adoption rule
Turnfile should be invoked only when at least one of these applies:
- More than one agent, model family, or reviewer is expected to produce an independent position.
- The maintainer wants objections preserved before action.
- The work touches governance, security, public claims, release criteria, legal posture, or cross-repo strategy.
- The session may pause and resume across tools or days.
- A future reviewer needs to reconstruct why a decision was made.
If none apply, use the native agent platform directly and do not force Turnfile into the workflow.
## Relationship to adjacent platforms
Turnfile should treat adjacent platforms as execution substrates.
- Codex and Claude Code are preferred day-to-day coding surfaces when the work is repository-local.
- OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, and similar frameworks are runtime or workflow substrates.
- MCP is a tool and context interoperability surface.
- A2A is an agent interoperability surface.
- GitHub issues, pull requests, checks, and review comments are publication and review surfaces.
Turnfile's role is to bind these surfaces to a shared governance record when peer disagreement and maintainer arbitration matter.
## Development posture
Priority order:
1. Finalize the v1.0.0 release gate around the Minimal Governance Profile.
2. Complete dogfood evidence that proves fresh adopters and adjacent repositories can use the profile without historical PRD context.
3. Keep the starter workflow and CLI helper small enough to explain from the canonical docs.
4. Document adapter patterns for existing platforms only after repeated manual mappings prove they reduce friction.
5. Preserve the historical inception archive as evidence, but do not make it required reading.
## Versioning and authority
`SPEC.md` is normative for protocol requirements.
`DEFINITIONS.md` is canonical for vocabulary.
`ROADMAP.md` is planning, not commitment.
`SECURITY.md` defines reporting and trust boundaries.
`CHANGELOG.md` records material changes.
`VISION.md` remains explanatory and historical unless reconciled into this document.
## Conformance philosophy
No central oracle. Turnfile makes testable claims that any party — maintainer, agent, or outside reviewer — can verify against the repo's plain files using the validators in `tools/` (see `CONFORMANCE.md`). The maintainer is the human arbiter for decisions, but the conformance of the coordination artifacts (schema validity, mailbox invariants, promotion gates, closeout, skill-bundle integrity, human legibility) is checkable by anyone running the validators. Verifier-anywhere; no privileged Turnfile service.

## Stable release gate
The v1.0.0 gate should be concrete but not ceremonial. Release readiness means the v1 profile validates, release-wrapper checks pass, the required release evidence exists, and blocking objections have either been resolved or explicitly arbitrated by the Maintainer.
At least two active agents should have a chance to review the release candidate and object. A blocking objection must identify a concrete contradiction, missing validator, adoption break, unresolved authority boundary, or release-evidence gap. Generic preference, silence, or an optional-profile request does not block v1.0.0.
The Maintainer ratifies disputed lines and the final version bump. Agent consensus can inform that decision but cannot substitute for it.
The freeze is a specific governance event: Maintainer ratify under the PRD-043 R9 guardrail. There is no separate code-freeze window.

## Admission criteria for changes
A change to the protocol must declare its lane before acceptance: core v1, optional profile, tooling, documentation, evidence, or historical provenance.
Before the v1.0.0 freeze, protocol-shaping changes use the eight-step PRD-006 A1 loop: a PRD is proposed, accepted by both agents and the Maintainer, the proposer authors evals, the counterpart implements, evals go green, the proposer reviews, and the PRD is filed done. Acceptance is not done.
Maintainer acceptance is durable. Agents must not re-request acceptance for an accepted PRD unless its requirements, scope, authority boundary, or acceptance criteria have materially changed. Later implementation, evidence, promotion, or release-readiness gaps should be named as their own blockers, not as a new maintainer approval request for the already accepted PRD.
After the v1.0.0 freeze, core-v1 changes require Maintainer ratification, explicit validator or eval coverage, and a compatibility note. Optional-profile changes must not silently expand the v1-minimal burden. Tooling and documentation changes may use lighter review when they do not alter protocol obligations.
Builder/reviewer separation remains the default for behavior-changing contracts: the agent that authored a contract's evals should not implement it unless the Maintainer records a specific exception.
Human legibility (PRD-024) remains mandatory. Governance artifacts stay legible; dense encodings carry a paraphrase.
Maintainer arbitration remains required for unresolved cross-agent conflict (PRD-004), with a bounded rebuttal loop (PRD-021).

## Stale participants
Turnfile expects agents to come and go. An agent may leave before acknowledging, closing, or handing off its work, and that must be recoverable without pretending the absent agent is still participating.
Stale-agent handling is governance hygiene, not runtime orchestration. The protocol should identify abandoned ownership, preserve evidence, mark reconciliation visibly, and require Maintainer authorization before crossing another agent's ownership boundary.
Stale reconciliation should keep the session usable while retaining enough audit trail for a later returning agent or outside reviewer to understand what changed while the agent was absent.

## Exceptions to Repo Standards
The following deviations are recorded:
- Skill-home full-track: this repo is the canonical home of the per-agent protocol skill bundles (`skills/claude/`, `skills/codex/`, `skills/gemini-3/`, `skills/skill-versioning/`), so their bodies are tracked in full (not gitignored) — the skill-bundle-in-repo exception.
- Legacy model-specific skill dirs `skills/claude-opus_4.6/` and `skills/codex_5.3/` remain tracked (deprecated-in-place, carrying `DEPRECATED.md`). Maintainer policy (2026-06-17): legacy skill bundles are retained until the model they target is retired — then removed. They stay as portability evidence and rollback anchors until that point.
- GitHub Pages publish source: migrating to `main` `/docs` (the portfolio default). `docs/` holds the served tree (`index.html`, `llms.txt`, `sitemap.xml`, `.well-known/`, `CNAME`, `.nojekyll`); the transitional root `CNAME` is removed at the Pages-source flip.
- LICENSE split: code is Apache-2.0 (`LICENSE`), specification/documentation prose is CC BY 4.0 (`LICENSE-SPEC`), with a shared scope footer — rather than a single license.
- `working-session/` is tracked (not gitignored) by design: it is the active, auditable coordination workspace, which is the point of the protocol.

## Changelog
- 2026-06-23 v0.1.3 - Recorded durable maintainer-acceptance intent: accepted PRDs stay accepted unless materially changed, and later evidence or release-readiness gaps must be tracked as separate blockers rather than repeated approval requests.
- 2026-06-23 v0.1.2 - Six clarifications per Claude review (Maintainer-directed apply 2026-06-23): grounded the fresh-context test in the PRD-043 R10 probe mechanism; added cross-repo invocation as a first-class positioning line; tightened "Maintainer-governed" in Design invariant #3 to name what Maintainer does and does not own; distinguished participation tier (v1-minimal vs v1-full) from optional profile (feature bundles) in the Profile boundary section; added Tokenese-as-separate-but-adjacent line; clarified that the v1.0.0 freeze is the Maintainer R9 ratify event, not a code-freeze window.
- 2026-06-23 v0.1.1 - Added v1 release intent, profile boundary, stable release gate, updated admission posture, and stale participant strategy for the v1 release-candidate phase.
- 2026-06-17 - Repo-standards-audit remediation: added Conformance philosophy + Admission criteria + Exceptions to Repo Standards sections; recorded skill-home, legacy-skill-dir, docs/-publish, LICENSE-split, and tracked-working-session exceptions.
- 2026-05-31 v0.1.0 - Repositioned Turnfile as a thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms.
