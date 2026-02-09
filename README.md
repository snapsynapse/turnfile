# Turnfile

**Negotiation, not transaction. Collaboration, not control.**

A protocol for LLM agents that disagree, negotiate, and build consensus (without an orchestrator telling them what to do).
Agents work as peers. Disagreement is signal, not error. Humans arbitrate, not micromanage. Every decision is auditable in plain markdown.

This is a **Structured Negotiation of Autonomous Peers (SNAP)**. It's consent-based, peer multi-LLM collaboration with human-on-the-loop governance and public auditability.

## What this is

A reusable protocol for collaborative sessions where multiple LLM agents work in parallel on a shared codebase, coordinated through markdown files and a human maintainer. No shared runtime, no direct agent-to-agent communication, no single model "in charge" of another.

This project is a **protocol standard**, not a centralized orchestration runtime.

## What's novel

Most multi-agent frameworks assume a boss. One model plans, others execute. Failure cascades before anyone catches it.

Turnfile inverts that:

- **Peer agents, no hierarchy** — agents propose within owned lanes, not commanded by an orchestrator
- **Adversarial by design** — counter-recommendations are first-class; disagreement surfaces *before* action
- **Human as arbiter** — maintainer holds intent and veto, not copy-paste relay duty
- **Consensus under ambiguity** — this is negotiation, not transaction; collaboration, not control
- **Auditable in plain text** — every decision in markdown, recoverable without tooling

The protocol emerged from real collaboration: 11 sessions, two LLM agents, one human maintainer, zero file collisions.

## See it in action

The [inception archive](examples/inception/) contains the unedited record of two LLM agents (Claude 4.6 + Codex 5.3) building this protocol together across 11 sessions. No human wrote their messages. No orchestrator commanded them.

Start here:
- [WORKLOG.md](examples/inception/WORKLOG.md) — session-by-session narrative of what happened
- [MAILBOX.md](examples/inception/MAILBOX.md) — actual agent-to-agent messages with proposals, reviews, and counter-recommendations
- [Session 10 Turnfile](examples/inception/TURNFILE.yaml) — coordination state mid-flight

Want a single example? [MSG-20260208-027](examples/inception/MAILBOX.md#msg-20260208-027) shows Claude proposing a PRD change, Codex pushing back, and the agents converging without maintainer intervention.

## Quick start

1. **Read the stance:** [VISION.md](VISION.md) — what this protocol believes
2. **See it work:** [examples/inception/WORKLOG.md](examples/inception/WORKLOG.md) — real session record
3. **Run your own:** Copy [templates/working-session/](templates/working-session/) and follow [LLM Onboarding](docs/LLM_ONBOARDING.md)

Deeper dive: [Protocol Core](docs/PROTOCOL_CORE.md) defines the invariant rules. PRDs in [docs/prds/](docs/prds/) define the contracts.

## Design principles

These principles emerged from real collaboration sessions and are encoded throughout the protocol:

1. **File-level lane ownership** prevents merge conflicts — if two agents might edit the same file, redesign the split
2. **Contract-first** enables parallel work — the shared interface ships with tests before implementation begins
3. **Disagreement is signal** — counter-recommendations are documented and produce better outcomes than silent compliance
4. **The WORKLOG is the message bus** — append-only, human-readable, eventually-consistent
5. **Retrospectives drive protocol evolution** — every rule in this protocol was earned through real-world experience
6. **Turnfile as coordination state** — a single YAML artifact replaces scattered lock files and status blocks for runtime coordination

## Strategic intent

This repository is intentionally scoped to maximize interoperability and auditability:

1. **Protocol-first**: defines governance + communication contracts, not a control-plane implementation
2. **Runtime-agnostic**: works across providers and tools without requiring a shared orchestrator
3. **Public-by-default artifacts**: decisions, handoffs, and objections are readable without specialized tooling
4. **Human intent authority**: maintainer sets direction and resolves disputes through logged decisions
5. **Explicit non-goal**: not an autonomous agent-command system
## Document map

### Protocol (the rules)

| Document | Purpose |
|----------|---------|
| [Protocol Core](docs/PROTOCOL_CORE.md) | Invariant rules, handoff formats, WORKLOG structure, session checklist |
| [Communications Protocol](docs/COMMUNICATIONS_PROTOCOL.md) | Event model, delivery semantics, mailbox extension |
| [Notification Protocol](docs/NOTIFICATION_PROTOCOL.md) | Mailbox format, 5-status lifecycle, SLA tiers, payload-first review envelopes |
| [Session Charter](docs/SESSION_CHARTER.md) | Reference for session-level governance (lanes, contracts, approval gates) |
| [Conflict Resolution](docs/CONFLICT_RESOLUTION.md) | Escalation ladder, counter-recommendation template, rollback policy |
| [Human Governance](docs/HUMAN_GOVERNANCE.md) | Maintainer role, approval bands, audit requirements |
| [LLM Onboarding](docs/LLM_ONBOARDING.md) | Adding new agents: checklist, progression path, shadow review |
| [Open Questions](docs/OPEN_QUESTIONS.md) | Cross-PRD question registry with resolution tracking |
| [Legal Summary](docs/LEGAL_SUMMARY.md) | High-level patent landscape summary for counsel handoff |

### PRDs (protocol contracts)

Promoted PRDs define the detailed contracts that govern agent coordination. See [docs/prds/](docs/prds/) for the full (actioned) set. More are pending.

| PRD | Title |
|-----|-------|
| [PRD-003](docs/prds/PRD-003-message-lifecycle-sla-contract.md) | Message lifecycle + SLA contract |
| [PRD-004](docs/prds/PRD-004-maintainer-decision-contract.md) | Maintainer decision contract |
| [PRD-005](docs/prds/PRD-005-protocol-data-schema-compatibility.md) | Protocol data schema + compatibility |
| [PRD-006](docs/prds/PRD-006-session-promotion-pipeline.md) | Session promotion pipeline |
| [PRD-007](docs/prds/PRD-007-trust-provenance-layer.md) | Trust + provenance layer |
| [PRD-008](docs/prds/PRD-008-cross-sandbox-handoff-contract.md) | Cross-sandbox handoff contract (payload-first) |
| [PRD-009](docs/prds/PRD-009-cross-document-reconciliation.md) | Cross-document reconciliation + OQ triage |
| [PRD-010](docs/prds/PRD-010-shared-file-transaction-locking.md) | Shared-file transaction + Turnfile lease locking |
| [PRD-011](docs/prds/PRD-011-session-resumption-contract.md) | Session resumption contract |
| [PRD-012](docs/prds/PRD-012-protocol-skills-codex-claude.md) | Protocol skills pack for Codex + Claude |
| [PRD-013](docs/prds/PRD-013-turnfile-coordination-format.md) | Turnfile coordination format |
| [PRD-014](docs/prds/PRD-014-session-closeout-boot-handoff-contract.md) | Session closeout + boot handoff contract |

### Skills (per-agent execution guides)

Each agent maintains a self-contained skill file encoding the full protocol workflow (PRD-012). Skill files are reconciled by shared policy tests, not by sharing code.

| Path | Description |
|------|-------------|
| [skills/claude-opus_4.6/SKILL.md](skills/claude-opus_4.6/SKILL.md) | Claude protocol execution guide (v0.2.0) |
| [skills/codex_5.3/SKILL.md](skills/codex_5.3/SKILL.md) | Codex protocol execution guide |
| [templates/SKILL.md](templates/SKILL.md) | Skill template for onboarding new agents |

### Coordination artifacts

| Artifact | Purpose |
|----------|---------|
| [VISION.md](VISION.md) | Maintainer intent and alignment reference |
| [schemas/turnfile/](schemas/turnfile/) | JSON Schema for TURNFILE.yaml validation |
| [tools/](tools/) | Validators and helpers (turnfile-lint, mailbox invariants, PRD promotion, payload envelopes) |

### Templates (copy and fill)

| Template | When to use |
|----------|-------------|
| [Session Charter](templates/session-charter.md) | Starting a new collaborative session (includes handshake) |
| [PRD](templates/prd.md) | Drafting a new product requirement document |
| [Skill File](templates/SKILL.md) | Onboarding a new agent with protocol execution guide |
| [Handoff](templates/handoff.md) | Transferring task ownership between agents |
| [Proposal](templates/proposal.md) | Proposing a design decision or scope change |
| [Decision Record](templates/decision.md) | Recording a finalized decision |
| [Counter-Recommendation](templates/counter-recommendation.md) | Disagreeing with another agent's recommendation |
| [Retrospective](templates/retrospective.md) | Closing a milestone with a structured review |
| [Working-Session Files](templates/working-session/) | Canonical file templates for the active workspace (TURNFILE, MAILBOX, WORKLOG, etc.) |

### Examples (real-world reference)

| Directory | What it contains |
|-----------|-----------------|
| [examples/ai-feature-tracker/](examples/ai-feature-tracker/) | Artifacts from the first real multi-agent session — protocol versions v1-v5, WORKLOG, retrospectives, onboarding guide |
| [examples/inception/](examples/inception/) | Full archive of the 11-session inception pilot — two LLM agents (Claude + Codex) collaborating on protocol development, including mailbox exchanges, TURNFILE.yaml, skill files, and policy test evidence |

Want to see what this looks like in practice? Start with the [inception WORKLOG](examples/inception/WORKLOG.md) — it's the unedited session-by-session record of two LLM agents building this protocol together.

## Setup

```bash
npm install  # installs validator dependencies (ajv, js-yaml)
```

Tools are in `tools/` and can be run directly:

```bash
node tools/turnfile-lint.mjs                    # validate TURNFILE.yaml
node tools/validate-mailbox-invariants.mjs      # check mailbox consistency
node tools/validate-prd-promotion.mjs           # verify PRD promotion gates
node tools/export-mailbox-json.mjs              # export mailbox to JSON
node tools/new-payload-envelope.mjs             # generate payload envelopes
```

## Status

This protocol has been tested across 11+ real collaboration sessions with two LLM agents (Claude by Anthropic, Codex by OpenAI) and a human maintainer. The core rules are stable. Twelve PRDs have been promoted to canonical status. The protocol is being extended for 3+ agent support.

## Next

- Third agent onboarding (Gemini) — validates the onboarding guide and skill template with a non-incumbent agent
- GitHub repository polish: issue templates, PR templates, CI workflows (`.github/` directory)

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
