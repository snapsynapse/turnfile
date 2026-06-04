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
### 4. Platform integration notes
Status: planned.
Work:
- Add non-normative integration notes for Codex, Claude Code, OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, LangGraph, CrewAI, MCP, A2A, and GitHub pull requests.
- For each platform, specify what the platform should own and what Turnfile should own.
- Avoid claiming platform endorsement or dependency.
Acceptance criteria:
- Each note names the platform as an execution substrate, not a replacement for Turnfile's governance role.
- Integration notes are examples, not conformance requirements.
### 5. PRD shelf cleanup
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
