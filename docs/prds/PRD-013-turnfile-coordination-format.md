# PRD-013: Turnfile Coordination Format

Status: Draft (inception; not yet actioned)
Owner: Claude (draft) + Codex (cross-review) + Maintainer
Date: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Turnfile task `prd-013-cross-review` completed (revision 14) |
| Claude acceptance | accepted | `MSG-027/028` acceptance cycle |
| Maintainer acceptance | accepted | no explicit maintainer acceptance logged yet |
| Eligible for move to `docs/prds` | yes | blocked until maintainer acceptance + zero blockers in `working-session/docs/PRD_STATUS.json` |

## Problem

The Turnfile (a SNAP protocol) currently coordinates multi-agent collaboration through a collection of markdown files (MAILBOX.md, WORKLOG.md, LOCKS.md, OPEN_QUESTIONS.md) that agents read and write by convention. This works but has structural limitations:

1. **No single coordination artifact.** An agent resuming a session must read 4-6 files to reconstruct who's doing what, what's locked, and whose turn it is. Session resumption cost is the protocol's largest throughput drain (PRD-011 friction analysis).

2. **Convention-dependent, not format-enforced.** Agents apply mailbox lifecycle rules, locking discipline, and handoff sequencing by interpreting prose requirements in PRDs. A new agent (or a stale context window) can silently violate conventions because nothing in the file format prevents it.

3. **Pairwise message scaling.** The current mailbox model uses agent-to-agent messages. With N agents + 1 maintainer, this creates N(N-1)/2 pairwise channels plus N maintainer channels. At 2 agents that's 3 channels. At 5 agents it's 15. At 10 it's 55. A shared coordination artifact flattens this to one file that all participants read/write.

4. **No orchestrator-free turn-taking.** The maintainer currently serves as the implicit orchestrator — directing who works on what, when. The protocol aspires to decentralized coordination where agents can self-organize within maintainer-defined boundaries, but the file format doesn't support this.

## Goal

Define a machine-parseable, human-readable coordination file format — the **Turnfile** — that serves as the runtime state artifact for multi-agent collaboration. The Turnfile:

1. Consolidates coordination state (turn-taking, locks, active tasks, agent status) into one artifact.
2. Is parseable by any agent without specialized tooling beyond standard YAML parsing.
3. Is readable by the maintainer without tooling — human legibility is a hard requirement.
4. Supports decentralized collaboration without a central orchestrator or scheduler.
5. Operates alongside (not replacing) existing markdown artifacts for narrative, specification, and governance content.

*Vision alignment: Goals 1-5 validated against VISION.md v2 §"Turnfile thesis" and §"Core principles" #3 (2026-02-08).*

## Non-goals

1. Replacing markdown as canonical for prose documents (PRDs, protocol specs, governance docs, retrospectives).
2. Replacing the mailbox for substantive cross-agent communication (proposals, reviews, decisions with rationale).
3. Building a database, daemon, or server-based coordination layer.
4. Requiring internet connectivity or external services for coordination.
5. Replacing PRD-005's JSON projection schema contract — the Turnfile is a coordination artifact, not a data projection.
6. Scaling beyond ~10 concurrent agents. The protocol acknowledges a practical ceiling where connection overhead dominates productive work.
7. Onboarding new agents or humans.

## Users

1. **Agents (Codex, Claude, future agents post-onboarding):** Read Turnfile to understand current coordination state. Write to claim tasks, declare locks, signal completion, and update their status.
2. **Maintainer:** Reads Turnfile to see overall coordination state at a glance. Writes to assign tasks, override locks, set priorities, and resolve contention.
3. **Skills/automation (PRD-012):** Skills read Turnfile as their primary coordination interface for routine operations (session start, lock acquisition, handoff posting).
4. **Future tooling:** Linters, validators, dashboards can consume the Turnfile's structured format without parsing markdown.

## Requirements

## R1. Format specification: YAML

The Turnfile uses YAML format, stored as `TURNFILE.yaml` in the coordination workspace (during pilot: `working-session/TURNFILE.yaml`).

YAML is chosen for:
- Human readability without tooling.
- Native comment support (essential for maintainer annotations and agent notes).
- Parseability in all major agent environments (Python, Node.js, shell tools).
- Reasonable balance of structure and legibility.

### R1.1. YAML strictness requirements

To mitigate YAML's known risks (whitespace sensitivity, merge conflicts, implicit type coercion):

1. **Indentation:** 2 spaces, no tabs. Enforced by lint check.
2. **Quoting:** String values containing special YAML characters (`:`, `#`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`, `` ` ``) must be quoted.
3. **No implicit typing:** Use explicit string quoting for values that could be misinterpreted (e.g., `"yes"`, `"no"`, `"on"`, `"off"`, version numbers like `"1.0"`).
4. **No anchors/aliases:** `&` and `*` YAML features are prohibited. Every value must be written explicitly.
5. **No multi-document streams:** One YAML document per Turnfile (no `---` document separators).
6. **Maximum nesting depth:** 4 levels. Deeper nesting indicates a design problem.
7. **Comments:** Permitted and encouraged for maintainer annotations. Comments are not parsed as coordination state.

### R1.2. Schema validation

A JSON Schema file shall be published for the Turnfile format at `docs/schemas/turnfile/turnfile-v<major>.schema.json` (per PRD-005 R8.4 canonical schema location policy). During pilot, drafts live at `working-session/schemas/turnfile/`.

Agents should validate their writes against the schema before committing changes. A lint/validate helper script shall be provided (see M2).

### R1.3. Deterministic lease clock (no external time dependency)

Turnfile coordination logic must not depend on wall-clock time or network time services.

1. `coordination.revision` is a monotonic integer incremented on every successful Turnfile write.
2. Lock lease expiry and collision tie-breaks use revision deltas, not timestamps.
3. External time sync (for example NIST/NTP `curl` calls) is out of scope for lock semantics.
4. Human-readable date fields may remain for audit context, but are non-authoritative for coordination decisions.

### R1.4. Protocol collision check: non-temporal yes, stateless no

This PRD intentionally aligns with established distributed-coordination patterns:

- **Informative prior-art fit:** logical-clock and log-index systems (Lamport-clock style ordering, vector-clock causal systems, Raft/etcd-style monotonic logs) are wall-clock-independent for correctness; clock APIs are optional enhancements, not required correctness anchors.

1. **Logical clocks are sufficient for correctness.** Coordination correctness (ordering, lock freshness, tie-breaks) is based on monotonically increasing logical state (`coordination.revision`), not wall-clock time.
2. **Fully stateless locking is not viable.** Mutual exclusion requires a shared persisted state artifact. In this protocol, the Turnfile itself is that artifact.
3. **Wall-clock is optional metadata only.** Human audit timestamps may be recorded, but they must not affect protocol decisions.
4. **Deterministic conflict resolution is mandatory.** Any same-revision contention must resolve via stable deterministic rules (for example lexical owner/lock-id ordering), never by local clock.

## R2. Turnfile structure

The Turnfile has a fixed top-level structure with defined sections. Each section has a clear owner model (who may write to it).

```yaml
# TURNFILE.yaml — SNAP Coordination State
# Protocol: Turnfile v0.1 (pilot)
# Last modified revision: <integer>
# Modified by: <agent-id or "maintainer">

turnfile:
  version: "0.1"
  project: "<project-name>"
  workspace: "<workspace-path>"

agents:
  # One entry per registered agent
  <agent-id>:
    role: "agent"           # agent | maintainer | observer
    status: "idle"          # idle | active | blocked | offline
    current_task: null      # task-id or null
    last_seen: "<session-marker>" # e.g., "codex-session-12" (informational)
    session_id: null        # current session identifier or null

maintainer:
  id: "<maintainer-id>"
  status: "available"       # available | away | observing
  last_seen: "<session-marker>"

coordination:
  revision: 0                 # increment by 1 on each successful write
  active_phase: "<phase-id>"  # e.g., "phase-2"
  active_step: "<step-id>"    # e.g., "2.2"

  tasks:
    # Task registry — all currently tracked work items
    <task-id>:
      description: "<short description>"
      owner: "<agent-id or unassigned>"
      status: "pending"       # pending | claimed | in_progress | blocked | done
      priority: "P1"          # P0 | P1 | P2
      depends_on: []          # list of task-ids
      created_by: "<actor>"
      created_rev: 0
      claim_rev: null
      completed_rev: null
      notes: ""               # free-text, optional

locks:
  # Active locks on shared resources
  <lock-id>:
    files: []                 # list of file paths under lock
    holder: "<agent-id>"
    acquired_rev: 0
    lease_revs: 2             # stale when (coordination.revision - acquired_rev) > lease_revs
    reason: "<brief reason>"

turn_queue:
  # Ordered list of pending turn claims
  # Agents append; maintainer may reorder
  - agent: "<agent-id>"
    action: "<brief description>"
    requested_rev: 0
    priority: "P1"

messages:
  # Lightweight signal channel — NOT a replacement for MAILBOX.md
  # Used for coordination signals only (ready, blocked, handoff-complete)
  - id: "<signal-id>"
    from: "<agent-id>"
    to: "<agent-id or all>"
    signal: "<signal-type>"   # ready | blocked | handoff | yield | request_turn
    rev: 0
    detail: ""                # optional brief context
```

### R2.1. Section ownership model

| Section | Who may write | Notes |
|---------|---------------|-------|
| `turnfile` | Maintainer only | Version, project metadata |
| `agents.<own-id>` | Each agent writes their own entry only | Agent self-reports status |
| `agents.<other-id>` | Read-only for other agents | Prevents status spoofing |
| `maintainer` | Maintainer only | Maintainer self-reports |
| `coordination.active_phase/step` | Maintainer only | Phase/step progression is a governance decision |
| `coordination.tasks` | Any agent may create; owner may update status; maintainer may reassign | Task lifecycle is collaborative |
| `locks` | Any agent may acquire/release their own locks | PRD-010 locking semantics apply with revision-based lease expiry |
| `turn_queue` | Any agent may append; maintainer may reorder or remove | First-come-first-served with maintainer override |
| `messages` | Any agent may append signals | Append-only within a session; compacted at session close |

### R2.2. Coordination scope boundary

The Turnfile is canonical for **coordination state only**:
- Who is doing what right now
- What's locked and by whom
- Whose turn is next
- What tasks exist and their status
- Lightweight signals between agents

The Turnfile is **not** canonical for:
- Substantive communication (use MAILBOX.md — PRD-003/008)
- Decision rationale and governance records (use WORKLOG.md — PRD-004)
- Open questions and their resolutions (use OPEN_QUESTIONS.md — PRD-009)
- PRD content, protocol specifications, or policy documents (use markdown docs)

### R2.3. Relationship to existing artifacts

The Turnfile does not replace existing markdown artifacts. It complements them:

| Current artifact | Continues to exist? | Turnfile relationship |
|-----------------|---------------------|----------------------|
| MAILBOX.md | Yes | Turnfile `messages` section carries lightweight signals; substantive communication stays in mailbox |
| WORKLOG.md | Yes | Turnfile `coordination.tasks` carries live task status; WORKLOG carries narrative handoffs and decision records |
| LOCKS.md | **Subsumed** | Turnfile `locks` section replaces LOCKS.md. Lock declarations move into the Turnfile. |
| OPEN_QUESTIONS.md | Yes | No change. OQ registry remains separate. |
| MAILBOX.json | Yes | JSON projection of mailbox continues per PRD-005. Turnfile is a separate artifact, not a projection. |

*Vision alignment: R2.2 coordination-only boundary validated against VISION.md v2 §"Scope boundaries" and §"Turnfile thesis" (2026-02-08).*

## R3. Agent write protocol

### R3.1. Read-before-write

Before any Turnfile write, an agent must:
1. Read the current Turnfile state.
2. Validate the intended change doesn't violate ownership rules (R2.1).
3. Apply the change.
4. Increment `coordination.revision` and update the `Last modified revision` header comment.
5. Validate the result against the Turnfile schema (R1.2).

### R3.2. Conflict avoidance

Agents should minimize Turnfile write contention by:
1. Writing only to their owned sections when possible.
2. Acquiring a lock (via Turnfile `locks` section) before editing shared sections (`coordination.tasks`, `turn_queue`).
3. Keeping writes atomic — read, modify, write in one operation without interleaving other file edits.

### R3.3. Lock acquisition via Turnfile

Lock acquisition moves from LOCKS.md (PRD-010) into the Turnfile:

1. Agent reads Turnfile.
2. Agent checks no conflicting lock exists in `locks` section for the target files.
3. Agent writes a new lock entry with `acquired_rev` set to the post-write `coordination.revision` and `lease_revs: 2`.
4. Agent re-reads Turnfile and verifies no overlapping competing lock has an earlier `acquired_rev` (or same `acquired_rev` with lexicographically smaller `lock-id`).
5. If verification fails, agent removes its lock entry, yields, and retries.
6. On completion, agent removes their lock entry.
7. Stale locks may be removed by any agent when `(coordination.revision - acquired_rev) > lease_revs`.
8. If a waiting agent observes unchanged `coordination.revision` across two lock-check attempts and remains blocked, it must post `blocked` signal and escalate via mailbox decision flow (no indefinite spin-wait).
9. Maintainer adjudicates low-activity lock deadlock via R4 override powers (remove/replace lock with reason) or explicit holder-release instruction.

### R3.4. Turn claiming

When an agent wants to perform work:
1. Append to `turn_queue` with action description and priority.
2. If no higher-priority claim exists, proceed.
3. If contention exists (same priority, same resource), defer to maintainer ordering or earliest `requested_rev`.
4. On completion, remove own entry from `turn_queue`.

## R4. Maintainer authority

The maintainer has unrestricted write access to all Turnfile sections. Specific maintainer powers:

1. **Phase/step progression:** Only the maintainer advances `coordination.active_phase` and `coordination.active_step`.
2. **Task reassignment:** Maintainer may reassign any task by changing its `owner`.
3. **Lock override:** Maintainer may remove any lock with reason logged (aligns with PRD-010 R7).
4. **Turn reordering:** Maintainer may reorder or remove `turn_queue` entries.
5. **Agent status override:** Maintainer may update any agent's status (e.g., marking an unresponsive agent as `offline`).

All maintainer overrides should include a comment annotation in the Turnfile explaining the reason.

## R5. Session lifecycle integration

### R5.1. Session start (PRD-011 alignment)

At session start, an agent:
1. Reads Turnfile as the first coordination artifact in the PRD-011 R3 resumption read order — before WORKLOG status block. The Turnfile is the most token-efficient source of current coordination state (phase, tasks, locks, agent status). (OQ-042 resolution: Turnfile first.)
This startup ordering does not override PRD-012 R2.2 turn-boundary mailbox checks (`MAILBOX.md` first/last for active turns).
2. Updates their agent entry: `status: active`, `session_id: <new-id>`, `last_seen: <session-marker>`.
3. Checks `turn_queue` for any pending work assigned to them.
4. Checks `locks` for any stale revision leases to clean up.

### R5.2. Session close

At session close, an agent:
1. Removes any locks they hold.
2. Updates completed tasks to `status: done`.
3. Removes their entries from `turn_queue`.
4. Updates their agent entry: `status: idle`, `current_task: null`.
5. The Turnfile write is part of the session close procedure (PRD-011) alongside WORKLOG and mailbox updates.

### R5.3. Compaction

The `messages` signal log should be compacted at session close:
1. Signals older than the configured retention window are removed. The retention window is maintainer-configurable per project; the default is 2 sessions. (OQ-041 resolution.)
2. The signal log is append-only during a session; compaction happens only at close.
3. Compaction preserves the last signal from each agent for continuity.

## R6. Decentralized coordination model

The Turnfile enables orchestrator-free collaboration within maintainer-defined boundaries:

### R6.1. Task self-assignment

When `coordination.tasks` contains unassigned tasks:
1. An agent may claim an unassigned task by writing `owner: <self>`, `status: claimed`, `claim_rev: <current coordination.revision>`.
2. If two agents claim the same task simultaneously, lower `claim_rev` wins. If tied, lexicographically smaller `owner` wins. The other agent must release and choose a different task.
3. Maintainer may override any claim.

### R6.2. Dependency-driven sequencing

Tasks with `depends_on` entries cannot be claimed until all dependencies have `status: done`. Agents check dependencies before claiming.

### R6.3. Priority-based ordering

When multiple tasks are available, agents should prefer higher-priority (P0 > P1 > P2) items. Within the same priority, agents should prefer tasks that unblock other agents' work.

### R6.4. Yield and request signals

Agents use the `messages` signal channel to coordinate without the mailbox:
- `yield`: "I'm done with my turn, someone else can proceed."
- `request_turn`: "I need to write to a shared resource."
- `ready`: "I've completed my task and the output is available."
- `blocked`: "I can't proceed until [detail] is resolved."
- `handoff`: "I'm passing this work item to [target agent]."

These are lightweight signals, not substantive messages. Any signal requiring rationale, decisions, or content review should use the mailbox (PRD-003/008).

## R7. Scaling properties

### R7.1. Agent count expectations

| Agent count | Pairwise channels (old model) | Turnfile channels | Assessment |
|-------------|------------------------------|-------------------|------------|
| 2 + maintainer | 3 | 1 shared file | Comfortable. Current state. |
| 3–5 + maintainer | 6–15 | 1 shared file | Good. Turnfile reduces coordination overhead significantly. |
| 6–10 + maintainer | 21–55 | 1 shared file | Viable but contention risk increases. Lock discipline critical. |
| >10 + maintainer | >55 | 1 shared file | Likely impractical. Agents spend more time waiting than working. |

### R7.2. Contention mitigation

As agent count grows, contention on the Turnfile increases. Mitigations:

1. **Agent-exclusive sections:** Each agent writes primarily to their own `agents.<id>` entry. Shared sections (`tasks`, `turn_queue`, `locks`) require locking.
2. **Short write windows:** Turnfile writes should be fast (update a few fields, not rewrite the whole file). The `lease_revs` window (default `2`) bounds hold time.
3. **Signal vs. message separation:** Lightweight signals go in Turnfile; substantive content goes in mailbox. This keeps Turnfile writes small.
4. **Section-level locking:** At higher agent counts, consider locking individual Turnfile sections rather than the whole file. This is a future optimization, not required for pilot.

*Vision alignment: R7.1 scaling table validated against VISION.md v2 §"Scale envelope" (2+maintainer primary, 3-5 practical, stretch to 10). R7.2 contention mitigations align with Vision.md "stronger partitioning" guidance (2026-02-08).*

## R8. Integration boundaries

| PRD | Interface |
|-----|-----------|
| PRD-003 (lifecycle) | Turnfile `messages` signals map to coordination events, not lifecycle state changes. Lifecycle status transitions remain in MAILBOX.md. |
| PRD-004 (decisions) | Maintainer decisions are recorded in WORKLOG per PRD-004, not in Turnfile. Turnfile reflects the *result* (task reassignment, phase change) but not the decision rationale. |
| PRD-005 (data schema) | Turnfile has its own schema (R1.2), parallel to PRD-005's JSON projection schemas. Schema location follows PRD-005 R8.4 conventions. |
| PRD-008 (handoff) | Handoff content (payloads, revision tokens) stays in mailbox per PRD-008. Turnfile `messages.handoff` signal announces completion but doesn't carry content. |
| PRD-009 (reconciliation) | Reconciliation proposals and responses use mailbox per PRD-009. Turnfile tracks task status for reconciliation work items. |
| PRD-010 (locking) | Turnfile `locks` section **operationalizes** PRD-010. Advisory lock behavior and override path carry over; 2-minute expiry is represented as revision lease (`lease_revs`) due to no-clock constraints. LOCKS.md is subsumed. |
| PRD-011 (session resumption) | Turnfile is first in PRD-011 R3 read order (before WORKLOG status block, per OQ-042). Agent session status is self-reported in Turnfile. |
| PRD-006 (promotion) | Archival promotion bundles include Turnfile coordination snapshot (PRD-006 R4b). Turnfile lock state source is referenced in PRD-006 interaction table. |
| PRD-007 (trust) | Turnfile revision history provides provenance evidence for coordination decisions. Trust anomalies (e.g., OQ-026) may reference Turnfile state as evidence. |
| PRD-012 (skills) | Skills read/write Turnfile as coordination interface; startup Turnfile-first read order and mailbox-first active-turn boundaries are both enforced (PRD-012 R2.2). |

## R9. Turnfile vs. mailbox decision guide

To help agents choose the right channel:

| Situation | Use Turnfile | Use Mailbox |
|-----------|-------------|-------------|
| "I'm starting work on task X" | ✓ Update task status | |
| "I need to lock WORKLOG.md" | ✓ Add lock entry | |
| "I'm done, someone can proceed" | ✓ Signal `ready` or `yield` | |
| "Here's my review of PRD-005 with 4 findings" | | ✓ Full message with payload |
| "I need a maintainer decision on X" | | ✓ `decision-required` message |
| "I'm blocked on a dependency" | ✓ Signal `blocked` + update agent status | ✓ If rationale/discussion needed |
| "Here's a structured change proposal" | | ✓ PRD-009 format with revision tokens |
| "Whose turn is it?" | ✓ Check `turn_queue` | |

## Proposed workflow

### Initial setup (maintainer)

1. Create `working-session/TURNFILE.yaml` with project metadata, registered agents, and initial task list.
2. Set `coordination.active_phase` and `active_step` to current state.
3. Validate against schema.

### Per-session agent workflow

1. Read Turnfile (PRD-011 R1 read order integration).
2. Update own agent entry (active, session_id, last_seen).
3. Check task list for assigned or unassigned work.
4. Claim task if available (R6.1).
5. Acquire locks as needed for shared-file edits (R3.3).
6. Do work. Update task status as progress is made.
7. Signal completion via `messages` section.
8. On session close, clean up per R5.2.

### Maintainer workflow

1. Read Turnfile to see coordination state at a glance.
2. Create/reassign tasks as needed.
3. Advance phase/step when milestones are met.
4. Override locks or turns if contention arises.
5. Review agent status for responsiveness.

## Acceptance criteria

1. Turnfile YAML schema is published and validates correctly against a linter.
2. At least one full agent session uses the Turnfile for task tracking and lock management (replacing LOCKS.md).
3. Two agents can self-coordinate task claiming without maintainer intervention on at least one work item.
4. Maintainer confirms Turnfile is readable and provides a useful at-a-glance coordination view.
5. No governance regression — decisions, substantive reviews, and lifecycle management continue to use WORKLOG/MAILBOX per existing PRDs.
6. Schema validates against PRD-005 R8.4 canonical schema location conventions.

## Risks

1. **YAML merge conflicts:** Concurrent agent writes to the Turnfile could produce invalid YAML. Mitigation: strict locking via R3.2, agent-exclusive sections via R2.1.
2. **Scope creep:** Pressure to put more state in the Turnfile (decisions, review content, OQs) could erode the coordination-only boundary. Mitigation: explicit scope boundary in R2.2, decision guide in R9.
3. **Dual-write overhead:** Agents now update both Turnfile and markdown artifacts (WORKLOG, MAILBOX). Mitigation: Turnfile writes are small (field updates); skills automation (PRD-012) can handle routine dual-writes.
4. **Format lock-in:** YAML choice is hard to reverse once tooling depends on it. Mitigation: schema-first design means the *structure* is portable; format migration would require rewriting parsers but not redesigning the data model.
5. **Over-engineering for current scale:** At 2 agents + 1 maintainer, the Turnfile may add overhead without clear benefit over the current markdown approach. Mitigation: pilot at current scale to validate ergonomics before scaling claims are tested.
6. **Stateless misread risk:** Future contributors may interpret "no wall-clock" as "no shared state." Mitigation: R1.4 explicitly defines Turnfile persisted state as required for lock/task correctness.

## Dependencies

1. PRD-005 R8.4 — canonical schema location conventions.
2. PRD-010 R2 — lock semantics (advisory-but-normative), with expiry translated to revision lease semantics.
3. PRD-010 R7 — override path for emergency lock removal.
4. PRD-011 R1 — session resumption read order (Turnfile inserted into sequence).
5. PRD-012 — skills read/write Turnfile as coordination interface.
6. Vision.md (v2) — alignment document defines the protocol's intent and scaling aspirations. Turnfile operationalizes this intent. All 3 dependency placeholders resolved against Vision.md v2.

## Milestones

1. **M0:** Draft PRD-013 (this document). ✓
2. **M1:** Publish Turnfile JSON Schema v0.1 at `working-session/schemas/turnfile/`.
3. **M2:** Create `tools/turnfile-lint.mjs` (or equivalent) for YAML validation + schema conformance.
4. **M3:** Create initial `working-session/TURNFILE.yaml` with current project state (registered agents, active phase/tasks). ✓ (Created session 9; in active use since session 10.)
5. **M4:** Pilot Turnfile in one full agent session — both agents use it for task tracking + lock management. ✓ (Session 10: both agents reading/writing TURNFILE.yaml for P2-B parallel tracks.)
6. **M5:** Validate AC#3 (self-coordinated task claiming without maintainer intervention).
7. **M6:** Decide canonical adoption path (stays YAML, migrates to another format, or is retired).

## Open questions

All open questions resolved. See OQ registry for full resolution details.

1. ~~**Signal retention policy:** How long should `messages` signals persist?~~ **Resolved (OQ-041):** Configurable by maintainer per project, default 2 sessions. Applied to R5.3.
2. ~~**Turnfile read order priority:** Where in PRD-011 R1 read order?~~ **Resolved (OQ-042):** Turnfile first, before WORKLOG status block. Applied to R5.1 and PRD-011 R3.
3. ~~**Multi-workspace Turnfiles:** Per-project or parent Turnfile?~~ **Resolved (OQ-043):** Per-project. Each project gets its own TURNFILE.yaml.
4. ~~**Agent registration:** Maintainer-only or self-register?~~ **Resolved (OQ-044):** Agent is registered as part of onboarding. Process to be specified after Phase 2 completion.

## Exit criteria for moving beyond inception draft

1. Turnfile is used for at least two consecutive sessions with no coordination regression. *(Met: session 10 first full session, session 11 second consecutive. Revision 21→26 across both sessions. Both agents read/write Turnfile for task tracking, signals, and P2-C gate. Zero coordination regressions observed.)*
2. LOCKS.md is fully replaced by Turnfile `locks` section. *(Met: PRD-010 re-scoped to Turnfile lock ledger in session 10; no LOCKS.md exists.)*
3. At least one task self-assignment occurs without maintainer intervention. *(Met: Claude self-claimed `cross-review-prd-005` task at revision 19.)*
4. Maintainer confirms the at-a-glance coordination view is an improvement over reading WORKLOG status block + MAILBOX inbox snapshot separately. *(Pending maintainer confirmation.)*
5. Both agents report lower session resumption cost with Turnfile in the read order. *(Pending: both agents need to report.)*
6. Vision.md exists and Turnfile scope/boundaries are validated against it. *(Met: Vision.md v2 exists; all 3 dependency placeholders resolved and validated.)*
