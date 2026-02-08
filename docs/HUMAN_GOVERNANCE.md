# Human Governance & Audit

The human maintainer's role, responsibilities, and constraints.

---

## 1) Human-on-the-loop, not human-in-the-loop

The maintainer is an **arbiter**, not a commander:

- **Arbiter:** sets priorities, resolves conflicts, holds veto power, audits outcomes. Agents do the work autonomously within their lanes.
- **Not a commander:** does not dictate implementation details, does not micro-manage agent decisions within owned lanes, does not serve as a copy-paste relay when the WORKLOG suffices.
- **Not absent:** retains the ability to pause, redirect, or override at any time. "On the loop" means informed and able to intervene, not disengaged.

---

## 2) Maintainer responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Priority setting** | Defines milestone goals, acceptance criteria, and risk tier |
| **Lane assignment** | Assigns file ownership to agents; resolves ownership disputes |
| **Tie-breaking** | Makes binding decisions when agents cannot converge (see [Conflict Resolution](./CONFLICT_RESOLUTION.md)) |
| **Merge authority** | Only the maintainer merges to the main branch |
| **Session orchestration** | Triggers agent sessions, ensures WORKLOG is shared, manages timing |
| **Audit** | Reviews WORKLOG entries, handoffs, and test evidence for compliance |
| **Rollback decisions** | Applies rollback policy when agents violate protocol (see [Conflict Resolution, section 4](./CONFLICT_RESOLUTION.md#4-rollback-policy)) |

---

## 3) What the maintainer should NOT do

- **Micro-manage implementation.** Once a lane is assigned, the owning agent decides how to implement within that lane. The maintainer reviews outcomes, not approach (unless the agent asks for guidance).
- **Relay messages manually.** If the WORKLOG is working, the maintainer should not copy-paste information between agents. Point agents to the WORKLOG instead.
- **Override without logging.** Every maintainer decision — especially overrides, vetoes, and lane reassignments — must be logged in the WORKLOG. Unlogged overrides undermine the audit trail.
- **Skip the retro.** Even if the milestone went smoothly, the retrospective captures what to repeat. The maintainer is responsible for ensuring it happens.

---

## 4) Approval bands

Actions fall into three bands based on risk. The session charter configures which actions fall into which band for a given session.

### Band A: Auto

Low-risk actions within an agent's owned lane. No maintainer approval needed.

**Examples:**
- Writing or updating tests for files the agent owns
- Editing documentation within the agent's lane
- Refactoring internals that don't change the shared contract
- Posting WORKLOG entries

### Band B: Notify + Delay

Moderate-risk actions that the maintainer should be aware of. The agent proceeds but the maintainer has a veto window.

**Examples:**
- Configuration or workflow file changes
- Adding new dependencies or tools
- Changing build/CI behavior
- Expanding scope beyond the original acceptance criteria

### Band C: Approval Required

High-risk or irreversible actions. The agent must wait for explicit maintainer approval before proceeding.

**Examples:**
- Security-sensitive changes (auth, permissions, secrets)
- Destructive operations (deleting files, dropping data, force-pushing)
- Production-impacting behavior changes
- Lane reassignment proposals
- Changes to the shared contract after implementation has begun

---

## 5) Veto and pause powers

The maintainer may at any time:

- **Pause** an agent's work (logged in WORKLOG as a status update)
- **Veto** a decision or proposed change (logged with reasoning)
- **Reassign** a lane (logged as a lane change decision)
- **Revert** an agent's changes (logged with reasoning; see [rollback policy](./CONFLICT_RESOLUTION.md#4-rollback-policy))

All of these are logged. "The maintainer said so" is a valid reason, but a logged reason is always better than an unlogged one.

---

## 6) Required audit artifacts

At session close, the following must exist for the session to be considered properly governed:

| Artifact | Location | Purpose |
|----------|----------|---------|
| **Session charter** | Project docs | Records governance settings, lanes, and handshakes |
| **Decision index** | WORKLOG (top section) | Scannable table of all significant decisions |
| **Handoff log** | WORKLOG (body) | Chronological record of task transfers and completions |
| **Retrospective** | Separate retro file | What worked, what didn't, what to change |

If any of these are missing, the maintainer should create them retroactively before starting the next session.
