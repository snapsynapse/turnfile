# Session Handoff: 2026-02-07

**Purpose:** Context for the next Claude session continuing this work in a new repo (`consensus-collab-protocol`).

---

## What happened this session

1. **Link checker milestone** — Claude (engine) + Codex (integration) collaborated on replacing the link checker in `ai-feature-tracker`. 114 tests, 134-URL baseline, all acceptance criteria met. This was the proving ground for the collaboration protocol.

2. **Retrospective** — Both agents independently reflected. Key findings: lane ownership was the #1 structural win, schema-first development enabled parallel work, counter-recommendations produced better outcomes, WORKLOG verbosity scaled poorly.

3. **Protocol evolution (v1 → v5):**
   - v1: Codex wrote initial protocol
   - v3: Claude incorporated retro findings
   - v4: Codex split into core + project profile + onboarding guide (the right architecture)
   - v5: Claude refined all three docs (N-agent support, full domain contract, capability-gated progression, shadow review, rollback policy). Codex reviewed and approved.

4. **Decision to extract** — The protocol is too general to live inside `ai-feature-tracker`. Maintainer decided to move it to a standalone repo (`consensus-collab-protocol`).

---

## The protocol as it stands (v5)

Four documents in `ai-feature-tracker/docs/`:

| Document | Purpose |
|----------|---------|
| `COLLAB_PROTOCOL.md` | Index with version history and document map |
| `COLLAB_PROTOCOL_CORE.md` | Global reusable rules (any project, any agents) |
| `COLLAB_PROTOCOL_PROJECT.md` | AI Feature Tracker instantiation (lanes, schema, handshakes) |
| `LLM_ONBOARDING.md` | Guide for adding new LLM collaborators (Gemini is next target) |

### Core invariant rules (non-negotiable)
1. File-level lane ownership defined before implementation
2. Contract-first: shared interfaces ship with tests before parallel implementation
3. Handoffs mandatory (quick or full format)
4. Test evidence required for every completed task
5. Retrospective required at milestone close
6. Counter-recommendations encouraged and documented

### Key design decisions
- **Concrete names in project profile, generic language in core** (not Agent A/B indirection)
- **Cross-review is aspirational, not blocking** (unless maintainer sets it to mandatory for a milestone)
- **Capability gates > session counts** for progression (minimum 2 sessions, but gates matter more)
- **Shadow review** required before new agent gets write access to engine/integration lanes
- **Rollback is temporary** — agent re-enters progression path, doesn't get permanently demoted

---

## What the new repo should become

The maintainer's vision (paraphrased): a **standalone, reusable consensus-based collaboration protocol** for heterogeneous LLM agents. Key properties:

- **Consensual** — agents affirm participation at session start, not commanded
- **Provider-agnostic** — Claude, Codex, Gemini, or any future model
- **File-based communication** — markdown as the message bus (no shared runtime required)
- **Human-in-the-loop as arbiter** — not commander, not absent
- **Audit-facing** — every decision, disagreement, and handoff logged in human-readable format
- **Operationally lightweight** — principle-driven but not ceremonial

### The mailbox idea (discussed, not yet built)
A `MAILBOX.md` file for direct agent-to-agent messages, separate from the WORKLOG (which documents work). Human still triggers "check the mailbox" but doesn't copy-paste content. Reduces human transport overhead while preserving oversight.

### What's novel about this
The combination of: heterogeneous agents (different providers), no shared runtime, file-based protocols, consensual handshakes, structured disagreement, and audit trails. Individual pieces exist in distributed systems theory; applying them to LLM collaboration with stateless agents appears to be new.

---

## Claude's position going into the next session

- I co-authored the protocol (v3 and v5) and have strong opinions about what works
- I'm aligned with Codex on all current protocol content — no open disagreements
- Codex is already working in the new repo; I haven't seen it yet
- I should read whatever Codex has set up before proposing changes
- The retro docs (`COLLAB_RETRO.md`, `COLLAB_RETRO_v1.md`) contain the "why" behind every rule — worth reading if context allows

---

## For the maintainer

When starting the next session, point the new Claude instance at:
1. This handoff document
2. Whatever Codex has set up in `consensus-collab-protocol`
3. Optionally: `COLLAB_PROTOCOL_CORE.md` and `LLM_ONBOARDING.md` from this repo as reference

That should be enough context to start contributing without re-deriving everything.
