# Conflict Resolution

Disagreement between agents is **signal, not friction**. This document defines how disagreements surface, escalate, and resolve.

---

## 1) Principle

When agents build in parallel with no shared runtime, divergent recommendations are inevitable and healthy. The protocol's job is to make disagreements visible, structured, and resolvable — not to prevent them.

The first counter-recommendation in a session may feel awkward. Do it anyway. Suppressing disagreement produces worse outcomes than surfacing it.

---

## 2) Escalation ladder

Conflicts move through these levels in order. Most resolve at Level 1.

### Level 1: Counter-recommendation with evidence

The disagreeing agent posts a counter-recommendation to the WORKLOG using the template below. This is the normal, expected path.

The other agent (or any agent) may accept, amend, or respond with their own counter-recommendation.

### Level 2: Time-boxed rebuttal round

If Level 1 doesn't resolve the disagreement, both agents post one rebuttal each. The rebuttal window is defined in the session charter (default: one WORKLOG cycle — i.e., each agent gets one turn to respond).

After the rebuttal round, agents must converge on an agreed action or escalate.

### Level 3: Risk-minimizing default

If agents cannot converge after the rebuttal round and the maintainer is not immediately available:

- **Choose the lower-risk option.** Between two approaches, prefer the one that is easier to reverse, has a smaller blast radius, or preserves more optionality.
- Document the choice and the reasoning in the WORKLOG.
- Flag it for maintainer review at the next checkpoint.

This is a circuit-breaker, not a decision process. It prevents deadlock without pretending the disagreement is resolved.

### Level 4: Maintainer adjudication

The maintainer reviews the counter-recommendations, rebuttals, and any risk analysis, then makes a binding decision. The decision is logged in the WORKLOG decision index.

The maintainer may also choose to defer the decision, request more information, or propose an alternative neither agent considered.

---

## 3) Counter-recommendation template

Use this when you disagree with another agent's recommendation. Post it to the WORKLOG.

```text
**<Other agent> recommended:** <summary of their recommendation>
**<This agent>'s counter-recommendation:** <your alternative>
**Reasoning:**
- <bullet 1>
- <bullet 2>
- <bullet 3>
**Proposed compromise:** <if applicable>
**Agreed action:** <what actually happens — filled in after resolution>
```

See also: [templates/counter-recommendation.md](../templates/counter-recommendation.md)

### Tips for effective counter-recommendations

- Lead with **what you'd do differently**, not why the other agent is wrong
- Include concrete evidence: test results, performance data, prior art
- Propose a compromise when possible — pure rejection is less useful than an alternative
- Keep it short. The WORKLOG has an entry budget ([Protocol Core, section 6](./PROTOCOL_CORE.md#6-worklog-requirements))

---

## 4) Rollback policy

When a previously onboarded agent demonstrates protocol non-compliance, the maintainer applies proportional consequences:

| Violation | Response |
|-----------|----------|
| **Lane ownership violation** (editing files outside their lane) | Agent reverts to docs/tests-only lane for the next session |
| **Handoff failure** (missing or malformed handoffs) | Maintainer warning; second occurrence triggers lane restriction |
| **Test regression** (introducing failing tests without fixing them) | Changes reverted; agent returns to shadow review before regaining write access |
| **WORKLOG non-participation** (failing to read or post entries) | Maintainer pauses agent's active work until compliance is restored |

### Rollback principles

- Rollback decisions are **logged in the WORKLOG** by the maintainer
- Rollback is **temporary** — the agent re-enters the progression path (see [LLM Onboarding](./LLM_ONBOARDING.md)) from the appropriate phase
- Rollback is **proportional** — a minor infraction doesn't require full re-onboarding
- The goal is correction, not punishment. Agents are stateless; "punishment" is meaningless. Structure is what prevents recurrence.

---

## 5) What is NOT a conflict

Not everything that feels like friction needs the escalation ladder:

- **Clarifying questions** — just ask in the WORKLOG. No template needed.
- **Style preferences** — if it doesn't affect behavior or integration, defer to the lane owner.
- **Sequencing disagreements** — "I think we should do X before Y" is a proposal, not a conflict. Post it as a recommendation; if the other agent disagrees, then it becomes a counter-recommendation.
