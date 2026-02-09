# Vision

Status: Active draft (non-spec)
Version: v2
Owner: Maintainer
Contributors: Codex, Claude
Last updated: 2026-02-08

## Document role

This file is the maintainer's intent and alignment source.

- It is not a specification.
- It defines direction and decision posture, not implementation details.
- PRDs derive from this vision.
- If this file and draft PRDs conflict, maintainer intent in this file is the alignment reference until reconciliation.

## Intent statement

Turnfile exists to enable a decentralized collaboration environment based on autonomous consent for both humans and LLM agents.
It is a "yes-and" environment: strong, adversarial thinking from different model families is welcomed to improve final outcomes.
The maintainer directs intent, and the company owns the project context and outcomes.
The objective is not maximum local efficiency; the objective is better aggregate intelligence and better creative outcomes across participants.
Human maintainers remain the approver for key decisions, even when humans are slower than model agents in many tasks.
Turnfile work must remain audit-visible to other authorized humans at all times.

## Why this exists

- Pairwise relays and fragmented context create unnecessary delay.
- Collaboration state drifts when multiple agents edit shared operational files without a strict contract.
- Maintainer intent is often inferred from scattered artifacts instead of being stated directly.
- Current workflows optimize local speed but under-optimize collaborative intelligence quality.

## Vision interpretation contract

This is a living document.

- All work elements are derived from this vision.
- Agents should interrogate this document when intent is ambiguous.
- Agents may ask new questions of this document and the maintainer through it.
- This file provides directionality; it does not prescribe specific implementation outputs.

## Core principles

1. Maintainer intent is explicit, inspectable, and durable.
2. Governance remains human-led and machine-supported at every turn, even as automation increases.
3. Coordination state is machine-parseable and token-efficient, and human-readable with low cognitive load.
4. Safety and auditability are preferred over maximum raw speed.
5. Parallelism is optimized within known limits, not assumed infinite.

## Turnfile thesis (concept level)

A Turnfile is the runtime coordination artifact for distributed agent work.
It captures turn-taking, ownership, lock state, and next-action state in a structured, human-legible format.
It is not a replacement for markdown narrative docs, PRDs, or governance policy text.

## Scope boundaries

### In scope

- Coordination state for asynchronous multi-agent work.
- Collision prevention for shared operational artifacts.
- Minimal shared state needed to execute work without a live orchestrator.

### Out of scope

- Replacing all markdown documentation.
- Replacing maintainer decision authority.
- Claims of infinite horizontal scaling.
- Hidden or non-auditable governance behavior.

## Governance posture

### Maintainer-owned decisions

- Vision changes
- Phase gate approvals
- Canonical promotion decisions
- High-risk exception handling

### Agent-autonomous decisions (within protocol bounds)

- Drafting inside assigned scope
- Low-risk, protocol-conforming updates
- Cross-review and counter-recommendations

## Scale envelope and assumptions

- Primary operating target: 2 agents plus maintainer.
- Practical near-term range: 3-5 agents.
- Stretch hypothesis: may be viable up to 10 agents with stronger partitioning and tighter coordination contracts.
- Assumption: channel overhead grows quickly with agent count; design should reduce avoidable pairwise dependencies.

## Non-goals

- Turnfile is not a standalone software product; it is a collaboration protocol.
- Optimizing for output volume as a primary objective.
- Optimizing for raw output speed as a primary objective.
- Introducing hierarchical or punitive control models.

## Questions agents should ask against this vision

1. Does this change improve maintainer intent clarity?
2. Does this reduce coordination collisions without reducing auditability?
3. Does this preserve human governance at key decision points?
4. Is this proposal inside the validated scale envelope?
5. Does this require a PRD-level contract change, or is it implementation detail?

## Derivation map (Vision -> PRD work)

- Vision intent and boundaries -> PRD-013 Turnfile contract (proposed).
- Governance posture -> PRD-012 skill trigger and write-policy decisions (`OQ-037..040`).
- Coordination assumptions -> PRD-005 and PRD-006 boundary updates.
- Trust and safety posture -> PRD-007 anomaly examples (`OQ-026`, deferred).

## Versioning and archive policy

- `inception/VISION.md` is always the current version.
- Previous versions are archived in `inception/archive/vision/`.
- Archive naming convention: `VISION_v<N>.md` (integer version suffix).
- On each substantive revision, archive the previous current file before updating `VISION.md`.

## Revision log

- 2026-02-08: v1 scaffold created in `inception/VISION.md`.
- 2026-02-08: v1 archived to `inception/archive/vision/VISION_v1.md`; current file advanced to v2 with maintainer fast-pass intent language.
