# Consensus Collaboration Protocol

A standalone framework for **consent-based, peer multi-LLM collaboration** with human-on-the-loop governance and public auditability.

## What this is

A reusable protocol for collaborative sessions where multiple LLM agents work in parallel on a shared codebase, coordinated through markdown files and a human maintainer. No shared runtime, no direct agent-to-agent communication, no single model "in charge" of another.

This project is a **protocol standard**, not a centralized orchestration runtime.

## What's novel

Most multi-agent frameworks assume a shared runtime or an orchestrator model that controls subordinate agents. This protocol is designed for the opposite situation:

- **Heterogeneous agents** — different providers, different capabilities, different context windows
- **No shared runtime** — agents are stateless across sessions, communicate only through files on disk
- **Consensual participation** — agents affirm the protocol at session start, not commanded into compliance
- **Structured disagreement** — counter-recommendations are a first-class protocol feature, not an error state
- **Human as arbiter** — the maintainer holds veto and audit authority without becoming a message-relay bottleneck
- **File-based audit trail** — every decision, handoff, and disagreement is logged in human-readable markdown

## Strategic intent (patent-aware differentiation)

This repository is intentionally scoped to maximize interoperability and auditability:

1. **Protocol-first**: defines governance + communication contracts, not a control-plane implementation
2. **Runtime-agnostic**: works across providers and tools without requiring a shared orchestrator
3. **Public-by-default artifacts**: decisions, handoffs, and objections are readable without specialized tooling
4. **Human intent authority**: maintainer sets direction and resolves disputes through logged decisions
5. **Explicit non-goal**: not an autonomous agent-command system

## Quick start

1. Read **[Protocol Core](docs/PROTOCOL_CORE.md)** — the invariant rules that govern every session
2. Copy **[templates/session-charter.md](templates/session-charter.md)** and fill it in for your project
3. Onboard agents using the **[LLM Onboarding Guide](docs/LLM_ONBOARDING.md)**
4. Run a session, then capture a **[retrospective](templates/retrospective.md)**

## Document map

### Protocol (the rules)

| Document | Purpose |
|----------|---------|
| [Protocol Core](docs/PROTOCOL_CORE.md) | Invariant rules, handoff formats, WORKLOG structure, session checklist |
| [Communications Protocol](docs/COMMUNICATIONS_PROTOCOL.md) | Event model, delivery semantics, mailbox extension |
| [Session Charter](docs/SESSION_CHARTER.md) | Template for session-level governance (lanes, contracts, approval gates) |
| [Conflict Resolution](docs/CONFLICT_RESOLUTION.md) | Escalation ladder, counter-recommendation template, rollback policy |
| [Human Governance](docs/HUMAN_GOVERNANCE.md) | Maintainer role, approval bands, audit requirements |
| [LLM Onboarding](docs/LLM_ONBOARDING.md) | Adding new agents: checklist, progression path, shadow review |
| [Legal Summary](docs/LEGAL_SUMMARY.md) | High-level patent landscape summary for counsel handoff |

### Templates (copy and fill)

| Template | When to use |
|----------|-------------|
| [Session Charter](templates/session-charter.md) | Starting a new collaborative session |
| [Handoff](templates/handoff.md) | Transferring task ownership between agents |
| [Proposal](templates/proposal.md) | Proposing a design decision or scope change |
| [Decision Record](templates/decision.md) | Recording a finalized decision |
| [Counter-Recommendation](templates/counter-recommendation.md) | Disagreeing with another agent's recommendation |
| [Retrospective](templates/retrospective.md) | Closing a milestone with a structured review |

### Examples (real-world reference)

| Directory | What it contains |
|-----------|-----------------|
| [examples/ai-feature-tracker/](examples/ai-feature-tracker/) | Full artifacts from the first real multi-agent session — protocol versions v1-v5, WORKLOG, retrospectives, onboarding guide. Shows how the protocol works in practice. |

## Design principles

These principles emerged from real collaboration sessions and are encoded throughout the protocol:

1. **File-level lane ownership** prevents merge conflicts — if two agents might edit the same file, redesign the split
2. **Contract-first** enables parallel work — the shared interface ships with tests before implementation begins
3. **Disagreement is signal** — counter-recommendations are documented and produce better outcomes than silent compliance
4. **The WORKLOG is the message bus** — append-only, human-readable, eventually-consistent
5. **Retrospectives drive protocol evolution** — every rule in this protocol was earned through real-world experience

## Status

This protocol has been tested in one real-world collaboration (two LLM agents + human maintainer, ~45 minute session, 114 tests, zero file collisions). The core rules are stable. The framework docs are complete but will evolve as more sessions are run.

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
