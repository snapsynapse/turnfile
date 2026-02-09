# Session Charter

Inception charter for the current collaboration session in `consensus-collab-protocol`.

Governance references:
- `docs/PROTOCOL_CORE.md`
- `docs/HUMAN_GOVERNANCE.md`
- `docs/CONFLICT_RESOLUTION.md`

## Session Metadata

| Field | Value |
|-------|-------|
| **Session ID** | `2026-02-08-inception` |
| **Date** | `2026-02-08` |
| **Project** | `consensus-collab-protocol` |
| **Milestone** | Planning v1 + notification protocol draft for multi-agent execution |
| **Risk tier** | Medium |

## Agent Roster

| Role | Agent | Model/Provider | Lane |
|------|-------|----------------|------|
| Maintainer | Human Maintainer | — | Final authority, merge, lane assignment |
| Protocol collaborator | Codex | OpenAI Codex (GPT-5) | Inception artifacts + assigned protocol edits |
| Protocol collaborator | Claude | Anthropic Opus 4.6 | Inception artifacts + assigned protocol edits |

## Lane Ownership

| Lane | Owner | Files/Scope |
|------|-------|-------------|
| Inception workspace | Codex | `inception/*.md` (excluding files explicitly assigned later) |
| Canonical protocol changes | Maintainer-assigned | `docs/`, `templates/` |
| Shared (append-only) | All | `inception/WORKLOG.md` |

## Shared Contract

- Location: `docs/PROTOCOL_CORE.md` + `templates/*.md`
- Owner: Maintainer (with agent recommendations)
- Validation tests: Documentation consistency + explicit WORKLOG rationale for protocol edits
- Status: Locked for kickoff; changeable via proposal + decision record

## Governance

| Setting | Value |
|---------|-------|
| Decision mode | Consent-first, maintainer-adjudicated when needed |
| Objection window | Next WORKLOG cycle |
| Cross-review mode | Aspirational (default) |
| Merge policy | Maintainer merges to public repository |
| Test policy | Include validation evidence appropriate to change type |

## Approval Gates

| Band | Scope |
|------|-------|
| **Auto** | Inception-file updates within lane ownership |
| **Notify + Delay** | Proposed edits to `docs/` or `templates/` |
| **Approval Required** | Invariant-rule changes, destructive operations, lane reassignments |

## Conflict Escalation

- Level 1: Counter-recommendation with evidence
- Level 2: One rebuttal each in the next WORKLOG cycle
- Level 3: Risk-minimizing default
- Level 4: Maintainer adjudication

Maintainer tie-break condition:
- Agents remain unresolved after the rebuttal round

## Acceptance Criteria

1. Planning document identifies prioritized protocol improvements for Codex, Claude, and the maintainer.
2. Notification protocol draft exists and is testable in this session.
3. Human-readable mailbox file is initialized for targeted LLM-to-LLM notifications.
4. Lane-safe next steps are ready for maintainer assignment.

## Handshake Acknowledgments

### Codex (OpenAI)

**Signed:** Codex (OpenAI)
**Role:** Inception bootstrap collaborator
**Handshake status:** Accepted
**Notes:**
- Accepts protocol invariants and lane ownership rules.
- Will use WORKLOG + structured handoffs for task completion.
**Timestamp:** 2026-02-08

### Claude (Anthropic)

**Signed:** Claude (Anthropic)
**Role:** Protocol collaborator
**Handshake status:** Accepted
**Notes:**
- Protocol invariants reviewed and accepted (co-author of v5 core).
- Lane ownership acknowledged: will not edit inception bootstrap files without maintainer reassignment.
- Ready for canonical protocol work when lanes are assigned.
**Timestamp:** 2026-02-08
