# Definitions
This document defines the controlled vocabulary for Turnfile. `SPEC.md` uses these terms normatively.
## Scope
Turnfile describes coordination and governance for multi-agent work. The vocabulary intentionally distinguishes runtime execution, peer disagreement, maintainer authority, and audit artifacts.
## Core terms
| Term | Definition |
|---|---|
| Turnfile | The protocol and artifact family used to coordinate and record peer agent work. The project name and the coordination file name both derive from this term. |
| `TURNFILE.yaml` | The machine-readable coordination state file for a working session. It records agents, tasks, locks, revision state, turn queue state, and signals. |
| Working session | A bounded period of coordinated work under one Turnfile state. A session may span multiple agent threads and may pause or resume. |
| Agent | A tool-using AI system or model instance participating in the session. An agent may be hosted by any runtime or platform. |
| Maintainer | The human authority for intent, scope, approval, and final resolution. The maintainer may delegate bounded decisions, but the delegation must be recorded. |
| Peer agent | An agent whose position is considered independently rather than as a subordinate worker under another agent's unchecked authority. |
| Runtime | The system that actually runs agents, tools, sandboxes, memory, traces, retries, or workflows. Turnfile is not a runtime. |
| Orchestrator | A runtime or control process that assigns, sequences, or supervises agent work. Turnfile may record work performed by orchestrators but does not require one. |
| Governance layer | The Turnfile layer that records positions, objections, approvals, decisions, and evidence across runtimes. |
| Lane | A declared ownership boundary for work, usually by file, artifact, task, or review responsibility. |
| Lock | A temporary claim on a shared artifact or lane to prevent conflicting edits. Locks are coordination state, not operating-system locks. |
| Task | A registered work item in `TURNFILE.yaml`. A task has an owner, status, priority, dependencies, and notes. |
| Signal | A short state update in `TURNFILE.yaml` indicating readiness, yield, notification, or other coordination state. |
| Mailbox | The session message artifact used for review requests, proposals, counter-recommendations, approvals, and closure records. |
| Worklog | The narrative audit artifact for session progress, decisions, and handoff state. |
| Boot file | A session startup artifact for one agent or runtime, summarizing current state, required reads, open tasks, and operating rules. |
| Handoff | A structured transfer of context, ownership, or next action from one participant to another. |
| Closeout | The final session state update confirming completed work, open items, validation status, and next owner. |
## Governance terms
| Term | Definition |
|---|---|
| Position | An agent's stated view of a proposal, implementation, review, or decision. |
| Objection | A concrete concern that should be resolved before action or promotion. |
| Counter-recommendation | A first-class alternative recommendation that disagrees with or amends another participant's proposal. |
| Apply-or-counter | A review request requiring the recipient either to accept the proposal or provide a counter-recommendation. |
| Maintainer-gated | Requiring explicit maintainer approval before promotion, execution, release, or other high-impact action. |
| Approval band | A declared level of authority for a decision or action. Bands may define what agents can do autonomously and what requires maintainer approval. |
| Resolution | The recorded decision that closes a disagreement, approval request, or open question. |
| Evidence | The files, tests, validation output, review notes, or external artifacts supporting a position or resolution. |
| Promotion | Moving a draft artifact into canonical status after required review and acceptance gates pass. |
## Status vocabulary
### Agent status
| Status | Definition |
|---|---|
| `idle` | The agent has no active claimed task. |
| `working` | The agent is actively working on a claimed task. |
| `blocked` | The agent cannot make progress without a decision, dependency, or external state change. |
| `reviewing` | The agent is evaluating another participant's proposal or artifact. |
| `closed` | The agent's session thread is closed and should not be treated as active. |
### Task status
| Status | Definition |
|---|---|
| `todo` | The task is known but not claimed. |
| `in_progress` | The task is claimed and active. |
| `blocked` | Progress requires a dependency or decision. |
| `review` | The task output is ready for review. |
| `done` | The task is complete. |
| `deferred` | The task is intentionally postponed. |
| `canceled` | The task will not proceed. |
### Message status
| Status | Definition |
|---|---|
| `open` | The message requires recipient attention. |
| `acknowledged` | The recipient has seen the message and recorded next handling. |
| `actioned` | The requested work or review has been performed, but final closure may still be pending. |
| `closed` | The message has reached a terminal state. |
| `superseded` | A newer message or decision replaces this message. |
## Relationship terms
| Term | Definition |
|---|---|
| MCP | Model Context Protocol. A tool and context interoperability layer that may expose data or tools to agents. Turnfile may record governance around MCP-enabled work but does not depend on MCP. |
| A2A | Agent-to-Agent protocol or analogous agent interoperability layer. Turnfile may record governance around delegated or remote-agent work but does not depend on A2A. |
| Native trace | A runtime's own execution log, span trace, workflow history, or audit event stream. Turnfile can reference native traces but does not replace them. |
| Adapter | A small integration that maps a runtime, issue tracker, review system, or trace system into Turnfile artifacts. |
## Terms to avoid or qualify
| Term | Guidance |
|---|---|
| Consensus | Use only when the record shows actual convergence. Do not use as a synonym for "no one objected." |
| Autonomous approval | Avoid unless the delegation policy is explicit. Prefer "agent-autonomous within recorded bounds." |
| Safe | Avoid as a blanket claim. Turnfile improves auditability and governance, not inherent safety. |
| Orchestration | Use for execution sequencing or control. Do not use for Turnfile's governance layer unless describing an adjacent runtime. |
## Versioning and changes
Changes to controlled vocabulary should update this document and, when normative behavior changes, `SPEC.md` and `CHANGELOG.md`.
