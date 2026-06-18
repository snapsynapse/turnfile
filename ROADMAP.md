# Roadmap
Status: planning notes for actions not yet executed and decisions not yet made.
This roadmap is not normative. It records likely future work so unresolved items remain visible without becoming commitments.
## Current state
Turnfile has a working protocol corpus, validation tooling, examples from real multi-agent sessions, skills for Codex and Claude, staged Gemini onboarding artifacts, and a passing local validation suite.
The project now narrows from "multi-agent collaboration protocol" to "thin governance layer for auditable peer disagreement and maintainer-governed resolution across existing agent platforms."
## Near-term reset
### 1. Scope reconciliation
Status: in progress.
Work:
- Make `INTENT.md` the forward strategy source.
- Make `SPEC.md` the concise normative contract.
- Keep `VISION.md` as historical/explanatory unless reconciled.
- Update README language away from platform-like positioning where needed.
- Identify which existing PRDs remain normative, which become historical, and which should be compacted into `SPEC.md`.
Acceptance criteria:
- A new maintainer or agent can explain Turnfile's narrowed role after reading README, INTENT, and SPEC.
- The project no longer implies it should compete with agent runtimes or workflow frameworks.
### 2. Minimal starter workflow
Status: planned.
Work:
- Define the smallest useful artifact set for a new Turnfile session.
- Reduce onboarding from many documents to a short sequence.
- Provide a "two agents plus maintainer" starter example.
- Provide a "single agent plus independent review" starter example.
Acceptance criteria:
- A repo can adopt Turnfile by copying one folder and reading one guide.
- The starter workflow validates locally.
- The starter workflow does not require reading the inception archive.
### 3. CLI ergonomics
Status: planned.
Work:
- Add minimal commands only where they reduce clerical overhead.
- Candidate commands: `init`, `validate`, `claim`, `message`, `close`.
- Keep files editable by hand.
- Avoid daemon, server, account, database, or hosted dependency requirements.
Acceptance criteria:
- The CLI is optional.
- Hand-edited files remain valid protocol artifacts.
- The validation suite covers the CLI-generated artifacts.
### 4. Machine-speed Tokenese coordination lane
Status: urgent planned.
Target: stretch by 2026-06-18; latest by 2026-06-19.
Goal:
- Make Turnfile useful for fast, multi-model solution construction, including iterating the next version of Tokenese itself.
- Use Tokenese at the CLI level across at least three model surfaces.
- Replicate all protocol-relevant Tokenese traffic into English mailbox, worklog, and documentation artifacts for audit.
- Preserve maintainer ownership while removing routine maintainer moderation from normal agent-to-agent loops.
Work:
- Finish PRD-036 first so aggregate PRD evals run reliably and broad validation is not blocked.
- Reconcile PRD-031 registry and implementation state, then make per-agent shards and derived aggregate views the default coordination write path for fast loops.
- Implement PRD-035 so Tokenese observed state, TKAB result artifacts, calibration references, and result packages are generated and validated from source artifacts.
- Complete Antigravity/Gemini OT-007 self-remediation, then run behavioral OT-002 and OT-004 so Gemini becomes the third live Turnfile participant.
- Define and validate a Tokenese CLI twin lane: Tokenese is allowed in fast operational/handoff traffic, English is generated or projected into audit artifacts, and validators block source/clone drift.
- Add a maintainer-owned automation policy that lets agents proceed on routine bounded work and escalates only for policy changes, unresolved counters, validator failures, ownership conflicts, or scope expansion.
Acceptance criteria:
- Claude, Codex, and Gemini/Antigravity each complete a file-backed Turnfile handshake with model-ledger evidence.
- At least one bounded Tokenese CLI exchange occurs across all three model surfaces with paired English projections.
- The English projection is present in mailbox or worklog artifacts and validates without manual re-keying.
- PRD-036 and PRD-035 evals pass in aggregate validation.
- PRD-031-derived coordination avoids hand-edited aggregate collision for the fast lane.
- Maintainer intervention is needed only for explicit escalation cases, not ordinary message routing, task claim, handoff, or review acknowledgment.
Non-goals:
- Do not make Turnfile an agent runtime, scheduler, or hidden policy engine.
- Do not let Tokenese carry authoritative lifecycle status, lock claims, acceptance, normative PRD text, exact diffs, or decisions without an English source.
- Do not broaden beyond bounded CLI and operational/handoff traffic until validators prove source/clone sync and the maintainer explicitly authorizes the next band.
### 5. Platform integration notes
Status: planned.
Work:
- Add non-normative integration notes for Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, MCP, A2A, and GitHub pull requests.
- For each platform, specify what the platform should own and what Turnfile should own.
- Avoid claiming platform endorsement or dependency.
Acceptance criteria:
- Each note names the platform as an execution substrate, not a replacement for Turnfile's governance role.
- Integration notes are examples, not conformance requirements.
### 6. PRD shelf cleanup
Status: planned.
Work:
- Review existing PRDs against the narrowed intent.
- Mark retained PRDs as active, historical, superseded, or deferred.
- Promote only the contracts still needed by the minimal governance layer.
- Archive protocol mass that belongs to the inception experiment rather than the future standard.
Acceptance criteria:
- Every PRD has an explicit status.
- The canonical spec does not require reading stale or superseded PRDs.
## Future directions
### Adapter library
Possible, not committed.
Candidate adapters:
- GitHub pull request review summaries into mailbox entries.
- Runtime traces into evidence links.
- MCP tool exposure review into maintainer-gated decisions.
- A2A delegated task results into apply-or-counter messages.
Decision trigger:
- Build adapters only after the starter workflow is stable and a repeated manual mapping is observed.
### Decision digest
Possible, not committed.
Work:
- Generate a compact maintainer digest from mailbox, worklog, and Turnfile state.
- Preserve dissent and unresolved objections rather than flattening into a single summary.
Decision trigger:
- Build when sessions produce enough open records that maintainer attention becomes the bottleneck.
### Tokenese-first coordination
Eventual goal, not urgent.
Goal:
- Move beyond Tokenese twins of English-first artifacts toward Tokenese-first operational exchanges.
- Generate English audit projections from Tokenese source traffic into mailbox, worklog, and documentation artifacts.
- Keep the generated English projection mandatory for audit, review, search, and maintainer governance.
Work:
- Define which Tokenese constructs are allowed to be source traffic and which remain English-only.
- Add deterministic Tokenese-to-English projection tooling with source IDs, hashes, and drift checks.
- Require every generated English projection to link back to its Tokenese source and validation result.
- Preserve English authority for lifecycle state, lock claims, acceptance, normative PRD text, exact diffs, and decisions until a future Maintainer decision explicitly changes that boundary.
- Add review workflows for projection quality, including human spot checks and model-independent validator checks.
Acceptance criteria:
- A bounded operational/handoff exchange can start in Tokenese, generate English mailbox or worklog projections, and pass source/projection drift validation.
- Maintainer can audit the English projection without needing to read Tokenese.
- Agents can reconstruct the Tokenese source, generated English projection, and validation evidence from stable IDs.
Decision trigger:
- Start only after the Tokenese CLI twin lane is validated across at least three model surfaces and PRD-035-style result/projection validators exist.
### Governance profile levels
Possible, not committed.
Candidate levels:
- Level 0: ad hoc notes.
- Level 1: session files present.
- Level 2: validation passes.
- Level 3: independent peer review recorded.
- Level 4: maintainer resolution recorded with evidence.
- Level 5: runtime traces or external review artifacts linked.
Decision trigger:
- Add only if adoption needs a conformance vocabulary. Avoid creating a maturity model prematurely.
### Public examples
Possible, not committed.
Work:
- Create cleaned examples that show a compact modern Turnfile workflow.
- Preserve the inception archive as raw evidence but stop using it as the first adoption path.
Decision trigger:
- Add after the minimal starter workflow is validated.
## Deferred
- Hosted Turnfile service.
- Central registry.
- Live multi-agent scheduler.
- Agent runtime implementation.
- Vendor-specific dependency.
- Full replacement of existing PRDs with a new spec corpus in one pass.
## Release readiness for narrowed v0.2
- README reflects thin-layer positioning.
- `INTENT.md`, `SPEC.md`, `DEFINITIONS.md`, `ROADMAP.md`, `SECURITY.md`, and `CHANGELOG.md` are aligned.
- Minimal starter workflow exists.
- Validation passes locally and in CI.
- Historical PRDs have explicit status.
- At least one modern platform integration note exists.
