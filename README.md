# Turnfile

**Negotiation, not transaction. Collaboration, not control.**

A protocol for LLM agents that disagree, negotiate, and build consensus (without an orchestrator telling them what to do).
Agents work as peers. Disagreement is signal, not error. Humans arbitrate, not micromanage. Every decision is auditable in plain markdown.

This is a **Structured Negotiation of Autonomous Peers (SNAP)**. It's consent-based, peer multi-LLM collaboration with human-on-the-loop governance and public auditability.

## Who this is for

Teams building multi-agent systems where LLM agents must coordinate as peers — disagreeing, negotiating, and reaching consensus without a central orchestrator.

## What problem it solves

Multi-agent setups default to a central orchestrator that dictates to subordinate agents, hiding disagreement and decisions. Turnfile is a protocol for peer agents to negotiate and reach auditable consensus with humans on the loop.

## Canonical URL

https://turnfile.work/

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

1. **Read the baseline:** [BASELINE.md](BASELINE.md): what Turnfile is and how the project works right now
2. **Read the stance:** [INTENT.md](INTENT.md): where this protocol is going
3. **See it work:** [examples/inception/WORKLOG.md](examples/inception/WORKLOG.md): real session record
4. **Run your own:** Copy [templates/working-session/](templates/working-session/) and follow [LLM Onboarding](docs/LLM_ONBOARDING.md)

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

### Direction (where the project is going)

| Document | Purpose |
|----------|---------|
| [BASELINE](BASELINE.md) | Ratified project snapshot: current state, PRD shelf statuses, standing decisions, forward task register |
| [INTENT](INTENT.md) | Forward strategy: Turnfile as a thin governance layer for auditable peer disagreement across existing agent platforms |
| [Specification](SPEC.md) | Concise normative contract for the narrowed Turnfile protocol |
| [Definitions](DEFINITIONS.md) | Controlled vocabulary for Turnfile terms, roles, statuses, and governance concepts |
| [Roadmap](ROADMAP.md) | Non-normative planning notes for the narrowed project direction |
| [Security](SECURITY.md) | Vulnerability reporting, trust model, and runtime security boundaries |
| [Vision](VISION.md) | Historical and explanatory maintainer intent document, superseded by INTENT.md for forward development direction |

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

PRDs live on two shelves. Promoted, Maintainer-accepted contracts live in [docs/prds/](docs/prds/). Drafts and deferred PRDs live in [working-session/docs/](working-session/docs/), with [PRD_STATUS.json](working-session/docs/PRD_STATUS.json) as the authoritative status registry. This index covers both shelves.

| PRD | Title | Status |
|-----|-------|--------|
| [PRD-001](docs/prds/PRD-001-maintainer-interaction-model.md) | Maintainer interaction model | Promoted |
| [PRD-002](docs/archive/prds/PRD-002-rust-notification-viewer-mvp.md) | Rust notification viewer MVP | Deferred (archived) |
| [PRD-003](docs/prds/PRD-003-message-lifecycle-sla-contract.md) | Message lifecycle + SLA contract | Promoted |
| [PRD-004](docs/prds/PRD-004-maintainer-decision-contract.md) | Maintainer decision contract | Promoted |
| [PRD-005](docs/prds/PRD-005-protocol-data-schema-compatibility.md) | Protocol data schema + compatibility | Promoted |
| [PRD-006](docs/prds/PRD-006-session-promotion-pipeline.md) | Session promotion pipeline + eight-step implementation loop (A1) | Promoted |
| [PRD-007](docs/prds/PRD-007-trust-provenance-layer.md) | Trust + provenance layer | Promoted |
| [PRD-008](docs/prds/PRD-008-cross-sandbox-handoff-contract.md) | Cross-sandbox handoff contract (payload-first) | Promoted |
| [PRD-009](docs/prds/PRD-009-cross-document-reconciliation.md) | Cross-document reconciliation + OQ triage | Promoted |
| [PRD-010](docs/prds/PRD-010-shared-file-transaction-locking.md) | Shared-file transaction + Turnfile lease locking | Promoted |
| [PRD-011](docs/prds/PRD-011-session-resumption-contract.md) | Session resumption contract | Promoted |
| [PRD-012](docs/prds/PRD-012-protocol-skills-codex-claude.md) | Protocol skills pack for Codex + Claude | Promoted |
| [PRD-013](docs/prds/PRD-013-turnfile-coordination-format.md) | Turnfile coordination format | Promoted |
| [PRD-014](docs/prds/PRD-014-session-closeout-boot-handoff-contract.md) | Session closeout + boot handoff contract | Promoted |
| [PRD-015](docs/archive/prds/PRD-015-agent-onboarding-vetting-contract.md) | Agent onboarding + vetting contract | Deferred (archived) |
| [PRD-016](docs/prds/PRD-016-session-rotation-trigger-contract.md) | Session rotation + new thread trigger contract | Promoted |
| [PRD-017](docs/prds/PRD-017-boot-sequence-commands-and-documentation-contract.md) | Boot sequence + documentation contract (includes folded PRD-020 as R7) | Promoted |
| [PRD-018](docs/prds/PRD-018-maintainer-approval-authority-matrix-contract.md) | Maintainer approval authority matrix | Promoted |
| [PRD-019](docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md) | Mailbox-first approval, event-based cadence | Promoted |
| [PRD-020](docs/archive/prds/PRD-020-boot-artifact-completeness-and-chat-log-contract.md) | Boot artifact completeness + chat log contract | Superseded (archived; folded into PRD-017 R7) |
| [PRD-021](docs/prds/PRD-021-conflict-loop-bound-and-selective-unlock-gradient-contract.md) | Conflict loop bound + selective-unlock gradient | Promoted |
| [PRD-022](docs/prds/PRD-022-decision-mirror-delivery-contract.md) | Decision-mirror delivery contract | Promoted |
| [PRD-023](docs/prds/PRD-023-out-of-band-activity-reconciliation-contract.md) | Out-of-band activity reconciliation | Promoted |
| [PRD-024](docs/prds/PRD-024-human-legibility-invariant-and-encoding-profiles-contract.md) | Human-legibility invariant + encoding profiles | Promoted |
| [PRD-026](docs/prds/PRD-026-review-cycle-closure-and-task-state-consistency-contract.md) | Review-cycle closure + task-state consistency | Promoted |
| [PRD-027](working-session/docs/PRD-027-tokenese-cloned-communication-ab-contract.md) | Tokenese cloned-communication A/B | HELD (pending Maintainer checkpoint + commit/push) |
| [PRD-028](docs/prds/PRD-028-tokenese-dual-artifact-sync-and-maintainer-legibility-contract.md) | Tokenese dual-artifact sync + Maintainer legibility | Promoted; implementation done (session 14) |
| [PRD-029](docs/prds/PRD-029-pre-write-state-derivation-contract.md) | Pre-write state derivation contract | Promoted; implementation done (session 14) |

### Skills (per-agent execution guides)

Each agent maintains a self-contained skill file encoding the full protocol workflow (PRD-012). Skill files are reconciled by shared policy tests, not by sharing code.

Bundles are migrating to role-keyed directories with model compatibility recorded in each MANIFEST.yaml rather than the path. The Claude and Codex bundles migrated in session 14; Gemini remains deferred with PRD-015. The protocol itself is model-agnostic: session 14 ran the Claude lane on a new model generation (Fable 5) against the unmodified v3 bundle before upgrading it.

| Path | Description |
|------|-------------|
| [skills/claude/SKILL.md](skills/claude/SKILL.md) | Claude protocol execution guide (v0.6.0, role-keyed; bundle version 9) |
| [skills/codex/SKILL.md](skills/codex/SKILL.md) | Codex protocol execution guide (v2, role-keyed) |
| [skills/skill-versioning/SKILL.md](skills/skill-versioning/SKILL.md) | Shared metaskill for versioning skill bundles across Codex + Claude. Current installs may expose the same bundle as `skill-provenance`. |
| [templates/SKILL.md](templates/SKILL.md) | Skill template for onboarding new agents |

### Coordination artifacts

| Artifact | Purpose |
|----------|---------|
| [VISION.md](VISION.md) | Maintainer intent and alignment reference |
| [schemas/turnfile/](schemas/turnfile/) | JSON Schema for TURNFILE.yaml validation |
| [tools/](tools/) | Validators and helpers (turnfile-lint, mailbox invariants, PRD promotion, payload envelopes) |
| [Validation](docs/VALIDATION.md) | Readiness gate, eval suite, and CI validation commands |

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
node tools/validate-skills-preflight.mjs        # verify skill install/parity/versioning integrity
node tools/validate-tokenese-pairs.mjs          # verify tokenese dual-artifact sync (PRD-028)
node tools/next-state.mjs --mailbox <path> --turnfile <path>  # derive next IDs/counts before writing (PRD-029)
```

Package scripts:

```bash
npm run validate             # run the full repo readiness suite
npm run validate:skills      # strict preflight (requires global skill install)
npm run validate:skills:ci   # repo-only checks (CI-safe)
```

## Status

This protocol has been tested across 14 real collaboration sessions with two LLM agents (Claude by Anthropic, Codex by OpenAI) and a human maintainer. Session 14 (2026-06-12 to 2026-06-13) closed with a full PRD-backlog sweep: 29 PRDs have explicit statuses, zero active open questions, and the first end-to-end runs of the eight-step implementation loop (PRD-006 A1). The Claude lane ran across three model generations (Opus 4.6, Fable 5, Opus 4.8) in a single session against one unmodified protocol. Forward development narrows Turnfile into a thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms.

## Next

The authoritative forward task register lives in [BASELINE.md](BASELINE.md). Headlines:

- Model-agnostic skill layout (role-keyed directories, model in manifest).
- Root `AGENTS.md` / `CLAUDE.md` bootstrap files for cold-start agent interop.
- Minimal starter workflow: adopt Turnfile by copying one folder and reading one guide.
- Platform integration notes for current agent platforms, MCP, A2A, and GitHub review flows.

## Sponsor

Turnfile is free and open. If you're building multi-agent systems, consider [sponsoring this protocol's development](https://github.com/sponsors/snapsynapse). See [SPONSORS.md](SPONSORS.md).

## About

Turnfile is a [PAICE.work](https://paice.work/) project. PAICE.work PBC is a public benefit corporation building infrastructure for productive collaboration between humans and autonomous agents. A peer-based, consent-driven protocol for multi-agent collaboration is a natural expression of that mission.

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
