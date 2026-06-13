---
title: "Turnfile INTENT"
version: "0.1.0"
last_updated: 2026-05-31
status: working-hypothesis
description: "Standards-level strategy for Turnfile as a thin governance layer for auditable peer disagreement and maintainer-governed resolution across agent platforms."
tags: [intent, strategy, turnfile, agents, governance]
---
# Turnfile INTENT
Repo-scoped strategy for Turnfile. Portfolio-level strategy lives outside this repository. This document supersedes `VISION.md` for forward development direction; `VISION.md` remains a historical and explanatory intent artifact.
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
The project should integrate with agent platforms rather than reproduce them. It should describe how to use their execution capabilities while preserving Turnfile's distinctive governance layer.
Primary positioning:
- Governance over orchestration.
- Peer disagreement over supervisor assignment.
- Maintainer resolution over autonomous consensus claims.
- Durable plain-text audit over proprietary trace lock-in.
- Runtime portability over framework ownership.
## Design invariants
These are the core commitments future work should preserve.
1. Turnfile does not run agents. It coordinates and records work performed by agents running elsewhere.
2. Peer positions are first-class. A counter-recommendation is not an error path or failure state.
3. Maintainer authority is explicit. Agents may draft, review, object, and propose, but high-impact resolution remains human-governed unless a narrower automation policy is written down.
4. Files are the source of truth. Optional CLIs, adapters, and integrations may improve ergonomics, but the protocol must remain readable and recoverable without them.
5. The protocol is vendor-neutral. It may document integration patterns for named platforms, but it must not depend on any one provider, model, or hosting runtime.
6. The minimum useful artifact set must stay small. If use requires reading the whole historical inception archive, the project has failed its adoption test.
7. Auditability beats raw speed. Turnfile is for decisions where disagreement and accountability matter enough to justify the extra ceremony.
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
Near-term work should reduce ceremony, not add protocol mass.
Priority order:
1. Clarify the narrowed scope.
2. Produce a minimal starter workflow.
3. Add small CLI helpers only where they reduce clerical overhead.
4. Document adapter patterns for existing platforms.
5. Preserve the historical inception archive as evidence, but do not make it required reading.
## Versioning and authority
`SPEC.md` is normative for protocol requirements.
`DEFINITIONS.md` is canonical for vocabulary.
`ROADMAP.md` is planning, not commitment.
`SECURITY.md` defines reporting and trust boundaries.
`CHANGELOG.md` records material changes.
`VISION.md` remains explanatory and historical unless reconciled into this document.
## Changelog
- 2026-05-31 v0.1.0 - Repositioned Turnfile as a thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms.
