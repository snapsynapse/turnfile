# Turnfile Specification
Version: v1.0.0
Status: v1 Minimal Governance Profile (per PRD-043)
Last updated: 2026-06-23
## How to read this document
This is the concise normative specification for Turnfile as a thin governance layer for peer agent collaboration with maintainer authority and file-based source of truth.
Core v1 conformance is defined by this document plus `DEFINITIONS.md`, `docs/MINIMUM_VIABLE_TURNFILE.md`, and `CONFORMANCE.md`. Historical PRDs remain in `docs/prds/` and `working-session/docs/` as provenance; classification is in `docs/prds/PRD_SHELF_RECONCILIATION.json`. Where this document conflicts with historical PRDs, this document governs.
## 0. v1 lock
Transition from v0.x to v1.0.0 is gated by the version-bump guardrail in PRD-043 R9: `tools/validate-v1-profile.mjs` green, ≥2 agent APPROVE, Maintainer ratify, with synchronized updates across `SPEC.md`, `schemas/v1/`, `turnfile.version` in `TURNFILE.yaml`, and `CHANGELOG.md`.
## 1. Purpose
Turnfile defines a file-based governance protocol for agent-assisted work where peer disagreement, maintainer authority, and auditability matter.
Turnfile records:
- who is participating
- what work is claimed
- which artifacts are locked or owned
- what positions and objections were raised
- what the maintainer decided
- what evidence supports the closeout state
Turnfile does not execute agents, assign tools, host workflows, manage memory, or provide sandboxing.
## 2. Conformance target
A conforming Turnfile working session MUST include:
- `TURNFILE.yaml` for coordination state
- `MAILBOX.md` for active and closed messages
- `WORKLOG.md` for narrative progress and handoff state
- a validation path that checks schema and mailbox invariants
A conforming starter MAY include:
- `MAILBOX.json`
- `OPEN_QUESTIONS.md`
- boot files for named agents
- archive files for compacted history
- session charter, decision, proposal, handoff, and retrospective templates
## 3. Authority model
Turnfile authority is ordered as follows:
1. System, user, tool, repository, and local security instructions.
2. Maintainer decisions recorded in the session.
3. Explicitly delegated approval bands.
4. Registered task ownership and locks.
5. Agent proposals, objections, and recommendations.
No agent message may override higher authority.
Maintainer-gated actions MUST NOT be treated as approved merely because one or more agents agree.
## 4. Runtime model
Turnfile is runtime-agnostic.
Agents MAY run in Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, A2A hosts, MCP-enabled hosts, shell sessions, IDEs, or other systems.
The runtime owns:
- model invocation
- tool execution
- sandboxing
- memory
- traces
- retries
- workflow control
- authentication
Turnfile owns:
- coordination state
- review state
- dissent and counter-recommendation records
- maintainer decisions
- closeout evidence
## 5. Coordination state
`TURNFILE.yaml` MUST identify:
- protocol version
- project
- workspace path
- participating agents
- maintainer identity or role
- revision number
- active tasks
- locks
- turn queue state, if any
- recent signals
Each mutation of coordination state SHOULD increment the revision.
Task ownership MUST refer to registered tasks. Ad hoc work SHOULD be recorded in `WORKLOG.md` until registered.
Locks MUST identify holder, artifact, purpose, and revision context where supported.
## 6. Message state
`MAILBOX.md` MUST make open work visible.
It SHOULD include:
- inbox snapshot
- open queue
- active messages
- closed summary
Messages requiring response MUST appear in the open queue until terminal.
Terminal messages MUST NOT remain active.
Closed messages SHOULD preserve outcome and evidence references.
## 7. Peer review and disagreement
A review request MAY use the apply-or-counter pattern.
When apply-or-counter is used, the recipient MUST either:
- accept the proposal as-is
- accept with amendments
- issue a counter-recommendation
- block with a concrete reason
Counter-recommendations MUST be recorded as first-class session artifacts or mailbox replies. They MUST NOT be silently collapsed into the final summary.
## 8. Maintainer decisions
Maintainer decisions SHOULD record:
- decision subject
- decision owner
- date
- accepted position or chosen alternative
- rejected alternatives, if material
- approval band or gate
- evidence references
- next action
High-impact actions SHOULD be maintainer-gated by default unless a narrower delegation rule is recorded.
## 9. Evidence
Evidence MAY include:
- changed files
- test commands and results
- validation output
- native runtime traces
- GitHub issues, pull requests, reviews, or checks
- external references
- message IDs
Evidence SHOULD be referenced rather than duplicated when duplication would expose secrets, private context, or large logs.
## 10. Minimal adoption profile
The minimal adoption profile is:
1. Copy starter session files.
2. Name maintainer and agents.
3. Register tasks and lanes.
4. Record independent positions or reviews.
5. Resolve objections with maintainer decisions.
6. Run validation.
7. Close the session with next owner and open items.
This profile is the primary future product surface. Larger PRD-driven workflows are optional.
## 11. Interoperability
Turnfile integrations MUST preserve the file-based source of truth.
Adapters MAY import or export data from runtimes, issue trackers, pull requests, traces, MCP hosts, or A2A hosts.
Adapters MUST NOT make a hosted service or vendor runtime the only authoritative record unless the spec is revised.
## 12. Security boundaries
Turnfile MUST NOT claim to provide:
- sandboxing
- identity verification
- access control
- malicious-agent prevention
- cryptographic attestation
- secret management
- runtime policy enforcement
Security posture is defined in `SECURITY.md`.
## 13. Change management
Normative changes SHOULD update:
- `SPEC.md`
- affected schemas or validators
- `DEFINITIONS.md`, if vocabulary changes
- `CHANGELOG.md`
- examples or templates, if behavior changes
Major changes SHOULD preserve migration notes for existing session archives.
