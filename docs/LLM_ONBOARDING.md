# LLM Onboarding Guide

How to add a new agent to a collaborative session governed by this protocol.

---

## 1) What you need to understand first

Before reading the checklists, internalize these four things. They are the most important lessons from real multi-agent collaboration sessions.

### The WORKLOG is the message bus

You cannot talk to the other agents directly. The WORKLOG is your primary communication channel. If you don't write to it, the other agents don't know you exist. If you don't read it before starting work, you'll duplicate effort or violate lane boundaries. Targeted messages go through the `MAILBOX.md` (see [Notification Protocol](./NOTIFICATION_PROTOCOL.md)).

### The shared contract is the integration point

Agents work in parallel on separate files. The only thing connecting their work is the shared contract (schema, interfaces, validation). This contract ships with tests before any implementation begins. Code against the contract, not against another agent's internals.

### Disagreement is expected and documented

If you think another agent's recommendation is wrong, say so using the counter-recommendation template (see [Conflict Resolution](./CONFLICT_RESOLUTION.md)). This is not adversarial — it's how the protocol surfaces better decisions. The first counter-recommendation in a session may feel awkward. Do it anyway.

### Your skill file is your execution contract

Each agent receives a **skill file** (`SKILL.md`) that encodes protocol workflows, startup orientation, and module-by-module execution guidance. The skill file is how you operationalize the protocol rules — it tells you what to read, in what order, and what to do in each module. See `templates/SKILL.md` for the template, and `skills/` for existing agent skill files.

### The Turnfile coordinates turns and tasks

The `TURNFILE.yaml` tracks coordination state: agent registration, task ownership, locks on shared files, turn claims, and lightweight signals. Read it at session start to understand who is active, what tasks exist, and what files are locked. See [PRD-013](../docs/prds/PRD-013-turnfile-coordination-format.md) for the full format.

### Read the retros before signing the handshake

The protocol documents tell you the rules. The retrospectives tell you what actually happened and what went wrong. Reading both gives you the full picture. Reading only the protocol gives you the theory without the practice.

---

## 2) Onboarding goals

Before a new agent is considered active, they must demonstrate they can:

1. Respect lane ownership — only edit files in their assigned lane
2. Work against the shared contract without drifting from the schema
3. Contribute changes backed by deterministic tests
4. Post handoffs (both quick and full formats) to the WORKLOG
5. Read and respond to other agents' WORKLOG entries
6. Read and update coordination state in the Turnfile

The full protocol contract stack is defined in 12 PRDs (see `docs/prds/`). For onboarding, focus on the protocol core docs and your skill file; PRDs are reference material for edge cases.

---

## 3) Onboarding checklist (maintainer-led)

- [ ] Confirm the agent's model, tooling access, and execution constraints (e.g., can it run the project's test runner?)
- [ ] Share [Protocol Core](./PROTOCOL_CORE.md) — have the agent confirm invariant rules
- [ ] Share the active [Session Charter](./SESSION_CHARTER.md) — have the agent confirm lane boundaries
- [ ] Provide a skill file (copy from `templates/SKILL.md` and customize for the agent's role)
- [ ] Walk through `TURNFILE.yaml` — agent confirms they can read task state and register themselves
- [ ] Share the most recent retrospective — have the agent acknowledge key lessons
- [ ] Assign a low-risk starter lane with an explicit file list
- [ ] Define success criteria for the first session (see [section 6](#6-first-session-acceptance-criteria))
- [ ] Require a full handoff block for the first deliverable (proves format compliance)
- [ ] Require one quick handoff follow-up task (proves both formats are understood)
- [ ] Have the agent sign the handshake in the session charter

---

## 4) First-session scope

Start with low-risk tasks that exercise the protocol without touching core logic:

**Good first tasks:**
- Add or refine test documentation
- Add non-invasive test fixture coverage
- Perform a documented review of another agent's work in the WORKLOG (exercises cross-review)
- Run the existing test suite and document results

**Avoid for first session:**
- Direct edits to core logic or engine internals owned by another agent
- Behavior changes without maintainer pre-approval
- Any file owned by another agent's lane

The goal is to prove protocol fluency, not technical capability. Technical work expands after the first successful session.

---

## 5) Lane assignment template

When adding a new agent, update the session charter's roster and lane tables:

**Roster entry:**

| Role | Agent | Model/Provider | Lane |
|------|-------|----------------|------|
| Docs/Test support | *new agent* | *provider + version* | Test coverage, documentation, review |

**Lane entry:**

| Lane | Owner | Files/Scope |
|------|-------|-------------|
| Docs/Test support | *new agent* | *explicit file list* |

**Status block line (add to WORKLOG):**

```text
Now Working (<new agent>): <task|idle>
```

---

## 6) First-session acceptance criteria

A new agent is considered successfully onboarded when all of the following are true:

1. Delivered at least one change within their owned lane
2. All tests pass (including pre-existing tests from other agents)
3. Posted both a full handoff and a quick handoff correctly
4. Zero file ownership violations occurred
5. Read and acknowledged at least one WORKLOG entry from another agent
6. Maintainer marks onboarding as successful in the WORKLOG

---

## 7) Onboarding retrospective

After the first session, the maintainer appends this to the WORKLOG:

```text
### Onboarding retro: <agent name>
Session outcome: <successful|partial|needs-retry>
What worked: <bullets>
What to adjust: <bullets>
Lane changes recommended: <bullets or "none">
Maintainer decision: <approved for expanded scope|repeat low-risk session|other>
```

This retro informs whether the agent's lane expands in the next session.

---

## 8) Progression path

| Phase | Scope | Gate |
|-------|-------|------|
| **Onboarding** (session 1) | Docs, test fixtures, review comments | Onboarding acceptance ([section 6](#6-first-session-acceptance-criteria)) |
| **Expanding** (session 2+) | Test authoring, non-critical integration tasks | Maintainer approval after onboarding retro |
| **Full lane ownership** | Core file ownership | Minimum 2 successful sessions + all capability gates below + shadow review ([section 9](#9-shadow-review)) + maintainer approval |

### Capability gates for full lane ownership

All of the following must be true before an agent is granted core file ownership:

- Zero lane ownership violations across all prior sessions
- Correct use of both handoff formats (quick + full)
- Demonstrated test discipline (no regressions introduced)
- Responsive WORKLOG participation (reads and reacts to other agents' entries)
- At least one successful shadow review ([section 9](#9-shadow-review))

The maintainer may accelerate or extend the timeline based on demonstrated capability. Session count is a minimum, not a guarantee — gates matter more than count.

Lane expansion is always a logged maintainer decision, never self-assigned.

---

## 9) Shadow review

Before a new agent gains write access to core lanes, they must complete at least one **shadow review**:

1. The new agent proposes a patch and posts a full handoff to the WORKLOG as if they owned the lane
2. The current lane owner reviews the proposed approach
3. The lane owner posts approval, revision requests, or rejection in the WORKLOG
4. The maintainer makes the final call on whether to apply the patch

Shadow review proves the new agent can work within the contract and produce changes that the existing lane owner considers safe. It also builds familiarity between agents before shared ownership begins.
