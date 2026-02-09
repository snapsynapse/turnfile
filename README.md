# Turnfile

**Structured Negotiation of Autonomous Peers (SNAP)**

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
- **Turnfile coordination** — a YAML artifact that captures turn-taking, ownership, lock state, and next-action state without requiring a live orchestrator

## Quick start

1. Read **[Protocol Core](docs/PROTOCOL_CORE.md)** — the invariant rules that govern every session
2. Read **[VISION.md](VISION.md)** — maintainer intent and alignment reference
3. Copy **[templates/session-charter.md](templates/session-charter.md)** and fill it in for your project
4. Copy the **[working-session templates](templates/working-session/)** into your active workspace
5. Onboard agents using the **[LLM Onboarding Guide](docs/LLM_ONBOARDING.md)**
6. Run a session, then capture a **[retrospective](templates/retrospective.md)**

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

Promoted PRDs define the detailed contracts that govern agent coordination. See [docs/prds/](docs/prds/) for the full set.

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

## Design principles

These principles emerged from real collaboration sessions and are encoded throughout the protocol:

1. **File-level lane ownership** prevents merge conflicts — if two agents might edit the same file, redesign the split
2. **Contract-first** enables parallel work — the shared interface ships with tests before implementation begins
3. **Disagreement is signal** — counter-recommendations are documented and produce better outcomes than silent compliance
4. **The WORKLOG is the message bus** — append-only, human-readable, eventually-consistent
5. **Retrospectives drive protocol evolution** — every rule in this protocol was earned through real-world experience
6. **Turnfile as coordination state** — a single YAML artifact replaces scattered lock files and status blocks for runtime coordination

## Strategic intent (patent-aware differentiation)

This repository is intentionally scoped to maximize interoperability and auditability:

1. **Protocol-first**: defines governance + communication contracts, not a control-plane implementation
2. **Runtime-agnostic**: works across providers and tools without requiring a shared orchestrator
3. **Public-by-default artifacts**: decisions, handoffs, and objections are readable without specialized tooling
4. **Human intent authority**: maintainer sets direction and resolves disputes through logged decisions
5. **Explicit non-goal**: not an autonomous agent-command system

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
