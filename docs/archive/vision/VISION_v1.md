# Vision (Scaffold)

Status: Maintainer draft scaffold (non-spec)
Owner: Maintainer
Contributors: Codex, Claude
Last updated: 2026-02-08

## How to use this document

This file captures maintainer intent and alignment. It is upstream of PRDs.

- This is not a specification.
- This file should explain why and direction, not implementation details.
- PRDs should derive from this vision, not replace it.
- If wording here conflicts with active protocol docs, maintainer intent governs until reconciled.

## Intent statement

Fill in 3-8 sentences in plain language:

Prompt:
- What is Turnfile trying to make possible?
- What kind of collaboration should it create?
- What outcomes matter most to you as maintainer?

Draft seed:
Turnfile is a decentralized way for multiple agents and one maintainer to collaborate without a live orchestrator. It is designed to preserve human governance while increasing parallel throughput and reducing coordination collisions. The maintainer's intent should remain legible and durable across sessions, not reconstructed from scattered logs.

## Why this exists

Prompt:
- What current pain does this solve?
- What is broken in existing multi-agent workflows?

Draft seed:
- Pairwise handoffs and relay overhead create avoidable latency.
- Session resets cause repeated re-orientation cost.
- Coordination state can drift when multiple agents edit shared control-plane files.
- Maintainer intent is often implicit instead of explicitly articulated.

## Vision principles

Write short principles (1-2 lines each) that agents can use for ambiguous decisions.

Starter principles:
1. Maintainer intent is explicit, inspectable, and durable.
2. Governance remains human-led, even when automation increases.
3. Coordination state should be machine-parseable and human-readable.
4. Safety and auditability are preferred over maximum raw speed.
5. Parallelism is optimized within known limits, not assumed infinite.

## Turnfile thesis (concept-level)

Define the concept before the format.

Prompt:
- What is a Turnfile?
- What is it explicitly not?

Draft seed:
A Turnfile is the runtime coordination artifact for distributed agent work. It tracks turn-taking and lock state in a structured, human-legible format. It is not a replacement for narrative protocol docs; it is the operational state layer.

## Scope boundaries

### In scope

- Coordination state (ownership, turn, lock, status, next action).
- Collision avoidance for shared operational files.
- Minimal shared state needed for asynchronous collaboration.

### Out of scope

- Replacing all markdown docs.
- Replacing maintainer decision authority.
- Infinite horizontal scaling claims.
- Autonomous governance without human review.

## Scale envelope and operating assumptions

Prompt:
- What scale is the system designed for now?
- What scale is stretch-only and must be validated?

Draft seed:
- Primary design target: 2 agents plus maintainer.
- Likely practical range with current model: 3-5 agents.
- Stretch hypothesis: may work up to 10 with stronger partitioning and stricter coordination discipline.
- Assumption: connection overhead grows quickly as agents increase, so workflow design must reduce unnecessary pairwise dependencies.

## Governance posture

Prompt:
- Which decisions always remain maintainer-owned?
- What can agents do autonomously?

Starter structure:
- Maintainer-owned:
  - Vision changes
  - Phase gate approvals
  - Canonical promotion decisions
  - High-risk exception handling
- Agent-autonomous:
  - Drafting within assigned scope
  - Low-risk protocol-conforming updates
  - Cross-review and counter-recommendations

## Agent behavior expectations (non-spec)

Prompt:
- What behavior should agents default to when uncertain?

Draft seed:
- Ask for clarification when intent is ambiguous and risk is material.
- Prefer transparent tradeoffs over hidden assumptions.
- Preserve authored meaning when editing shared artifacts.
- Log substantive governance-impacting actions in WORKLOG.

## Non-goals and anti-goals

List outcomes you explicitly do not want.

Draft seed:
- Creating an opaque automation layer the maintainer cannot audit.
- Prioritizing output volume over correctness and alignment.
- Introducing brittle orchestration dependencies.
- Treating trust metrics as punitive rankings.

## Questions agents should ask against this vision

Use this as an interrogation checklist during planning and review.

1. Does this change improve maintainer intent clarity?
2. Does this reduce coordination collisions without reducing auditability?
3. Does this preserve human governance at decision points?
4. Is this within the current scale envelope, or does it assume unvalidated scale?
5. Does this require a PRD update, or is it merely implementation detail?

## Derivation map (Vision -> Specs)

Document how this vision should generate specification work.

Starter mapping:
- Vision intent + boundaries -> PRD-013 Turnfile contract (proposed).
- Vision governance posture -> PRD-012 skill trigger and write-policy decisions (OQ-037..040).
- Vision coordination assumptions -> PRD-005/006 boundary updates.
- Vision trust/safety posture -> PRD-007 anomaly handling examples (deferred OQ-026).

## Open maintainer prompts (fill)

1. Which statements above are definitely true and should be locked first?
2. Which statements are hypotheses and should stay provisional?
3. Which tradeoff do you prefer when speed and auditability conflict?
4. What failure mode worries you most in the next phase?

## Revision log

- 2026-02-08: Initial scaffold created by Codex for maintainer-authoring pass.
