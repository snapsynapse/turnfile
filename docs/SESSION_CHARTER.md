# Session Charter Template

Copy this file to start a new collaborative session. Fill in each section before work begins. All agents must review and sign the handshake before implementation starts.

> Governance reference: [Protocol Core](./PROTOCOL_CORE.md) | [Human Governance](./HUMAN_GOVERNANCE.md) | [Conflict Resolution](./CONFLICT_RESOLUTION.md)

---

## 1) Session metadata

| Field | Value |
|-------|-------|
| **Session ID** | <!-- unique identifier, e.g. "2026-02-07-alpha" --> |
| **Date** | |
| **Project** | |
| **Milestone** | <!-- what this session aims to deliver --> |
| **Risk tier** | <!-- Low / Medium / High --> |

---

## 2) Agent roster

> List every participant. Each agent must have a defined lane before implementation begins.

| Role | Agent | Model/Provider | Lane |
|------|-------|----------------|------|
| Maintainer | | — | Final authority, merge, lane assignment |
| | | | |
| | | | |

---

## 3) Lane ownership

> Each file has exactly one owner. If two agents might edit the same file, redesign the split. Lane changes require a logged maintainer decision in the WORKLOG. See [Protocol Core, section 3](./PROTOCOL_CORE.md#3-invariant-rules).

| Lane | Owner | Files/Scope |
|------|-------|-------------|
| | | |
| | | |
| Shared (append-only) | All agents | `WORKLOG.md` |

---

## 4) Shared contract

> What interfaces, schemas, or contracts must be defined and tested before parallel implementation begins? See [Protocol Core, invariant 2](./PROTOCOL_CORE.md#3-invariant-rules).

- Contract location:
- Contract owner:
- Validation tests:
- Status: <!-- Not started / Draft / Locked -->

---

## 5) Governance settings

| Setting | Value |
|---------|-------|
| **Decision mode** | <!-- consent / quorum / maintainer-adjudicated --> |
| **Objection window** | <!-- e.g. "next WORKLOG cycle" or "30 minutes" --> |
| **Cross-review mode** | <!-- aspirational (default) / mandatory --> |
| **Merge policy** | <!-- e.g. "Maintainer merges to main after review" --> |
| **Test policy** | <!-- e.g. "Deterministic tests required; live tests optional" --> |

---

## 6) Approval gates

> Define what actions each approval band covers for this session. See [Human Governance](./HUMAN_GOVERNANCE.md) for band definitions.

| Band | Scope |
|------|-------|
| **Auto** | <!-- e.g. docs/tests in owned lanes --> |
| **Notify + Delay** | <!-- e.g. config/workflow changes --> |
| **Approval Required** | <!-- e.g. security changes, destructive ops --> |

---

## 7) Conflict escalation

> Configure the escalation ladder for this session. See [Conflict Resolution](./CONFLICT_RESOLUTION.md) for the full framework.

- Level 1: Counter-recommendation with evidence
- Level 2: Time-boxed rebuttal round (window: <!-- e.g. "1 WORKLOG cycle" -->)
- Level 3: Risk-minimizing default selection
- Level 4: Maintainer adjudication
- Maintainer tie-break condition: <!-- e.g. "when agents disagree after one rebuttal round" -->

---

## 8) Acceptance criteria

> What must be true for this milestone to be considered complete?

1.
2.
3.
4.

---

## 9) Handshake acknowledgments

> Each agent and the maintainer reviews this charter and signs below before implementation begins. Handshakes carry forward across protocol versions unless roles or lane assignments change.
>
> Signing acknowledges the governance docs listed in the header: [Protocol Core](./PROTOCOL_CORE.md), [Human Governance](./HUMAN_GOVERNANCE.md), and [Conflict Resolution](./CONFLICT_RESOLUTION.md).

### <!-- Agent name (Provider) -->

**Signed:** <!-- Agent name, provider -->
**Role:** <!-- Lane description -->
**Handshake status:** <!-- Accepted / Accepted with reservations -->
**Scope acknowledgment:**
<!-- Standard acknowledgments:
- Accepts protocol invariants in `docs/PROTOCOL_CORE.md`.
- Accepts human maintainer authority per `docs/HUMAN_GOVERNANCE.md`.
- Accepts structured disagreement flow per `docs/CONFLICT_RESOLUTION.md`.
- Commits to file-based communication and append-only WORKLOG participation.
-->
**Notes:**
- <!-- Additional reservations or context -->
**Timestamp:**

### <!-- Agent name (Provider) -->

**Signed:**
**Role:**
**Handshake status:**
**Scope acknowledgment:**
**Notes:**
-
**Timestamp:**

### Maintainer (Human)

**Signed:**
**Handshake status:**
**Acknowledgment:**
**Timestamp:**

---

## 10) Session kickoff checklist

> Run through this before any implementation begins. See [Protocol Core, section 8](./PROTOCOL_CORE.md#8-session-kickoff-checklist).

- [ ] Lane boundaries confirmed (section 3 above)
- [ ] Shared contract exists with tests, or will be created first (section 4 above)
- [ ] WORKLOG initialized with pinned status block (one line per agent)
- [ ] Handoff format expectations confirmed (quick vs full thresholds)
- [ ] Acceptance criteria confirmed (section 8 above)
- [ ] All agents have signed the handshake (section 9 above)
- [ ] Retro commitment acknowledged
