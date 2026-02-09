# PRD-012: Protocol Skills Pack for Codex + Claude

Status: Draft (inception; not yet actioned) — **Revision 2: re-scoped against Vision.md v2, PRD-013 (Turnfile), and OQ-037–040 resolutions**
Owner: Maintainer + Codex + Claude
Date: 2026-02-08
Last revised: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | `MSG-20260208-029` Codex cross-review completed |
| Claude acceptance | accepted | `MSG-20260208-029` ack confirms findings accepted and applied |
| Maintainer acceptance | accepted | no explicit maintainer acceptance logged yet |
| Eligible for move to `docs/prds` | yes | blocked until maintainer acceptance + zero blockers in `inception/docs/PRD_STATUS.json` |

## Alignment reference

This PRD derives from **Vision.md v2** (§ Governance posture, § Core principles).

Key alignment constraints from Vision.md:
- Governance remains human-led and machine-supported (Principle 2).
- Safety and auditability are preferred over maximum raw speed (Principle 4).
- Agent-autonomous decisions are limited to drafting, protocol-conforming updates, and cross-review (§ Agent-autonomous decisions).
- Skill invocation and writes require explicit maintainer confirmation (OQ-039, OQ-040; consistent with § Maintainer-owned decisions).

## Problem

The protocol is now detailed across multiple PRDs and codified in a runtime coordination artifact (TURNFILE.yaml, PRD-013), but execution still depends on each agent manually re-loading and re-applying the same process rules each session. This creates avoidable variability:

1. Session startup often re-derives workflow steps instead of using a reusable execution guide.
2. Cross-agent consistency depends on memory and ad-hoc reminders rather than shared operational modules.
3. Maintainer still spends effort steering routine process behavior that should be standardized.
4. The Turnfile coordination artifact (PRD-013) introduces new read/write responsibilities that must be encoded as skill behavior.

## Goal

Turn the protocol into reusable skills — one per agent, reconciled by shared policy tests — so routine collaboration behavior is:

1. Consistent across agents (validated by policy tests, not assumed from shared code).
2. Faster to start in new sessions.
3. Easier for maintainer to invoke with short, explicit prompts.
4. Integrated with TURNFILE.yaml as the runtime coordination interface.

## Non-goals

1. Replacing the canonical protocol documents in `docs/`.
2. Removing maintainer governance authority.
3. Building a fully autonomous multi-agent runtime.
4. Forcing identical tooling where agent environments differ.
5. Auto-applying skill actions without explicit maintainer confirmation.
6. Heuristic or opportunistic skill triggering.

## Users

1. Maintainer: needs reliable, low-friction invocation of protocol workflows.
2. Codex: needs repeatable operational instructions tied to local tools.
3. Claude: needs the same protocol intent expressed with environment-appropriate steps.
4. Future agents: need an onboarding path that does not require reading every historical thread.

## Requirements

## R1. Skill architecture: separate full skills per agent

<!-- OQ-038 resolved: separate full skills reconciled by policy tests (not shared core with thin wrappers).
     OQ-037 resolved: hybrid placement — both repository-managed artifacts AND per-agent home directories. -->

Each agent maintains its own **complete, self-contained skill file** expressing the full protocol workflow in its own execution environment. There is no shared-core file with thin adapters.

1. **Codex skill file**: full protocol execution instructions for Codex's environment (sandbox-local tools, file I/O patterns, response format).
2. **Claude skill file**: full protocol execution instructions for Claude's environment (tool-use patterns, context window management, chat-integrated output).
3. **Policy test suite**: a shared set of behavioral assertions that both skill files must satisfy. Policy tests validate that separate implementations produce equivalent protocol outcomes (same status transitions, same locking semantics, same governance behavior). Policy tests are the reconciliation mechanism.

### R1.1 Hybrid placement model

<!-- OQ-037 resolved: hybrid model — skills live in both repository and per-agent home directories. -->

Skill artifacts live in **two locations**:

1. **Repository-managed** (`inception/skills/` during pilot; `docs/skills/` after canonical promotion): the authoritative, versioned, reviewed copies.
2. **Per-agent home directory**: operational copies that agents load at session start. These are derived from the repository copies and may include agent-local configuration (e.g., environment-specific paths), but must not diverge on protocol semantics.

The repository copy is canonical. If home-directory copies diverge on protocol semantics, the repository copy wins and the agent must re-sync.

## R2. Required workflow modules

Each agent's skill file must encode operational instructions for at least:

1. Mailbox lifecycle + SLA handling (PRD-003).
2. Maintainer decision request/reply contract (PRD-004).
3. Payload-first review envelope and revision integrity (PRD-008).
4. Reconciliation workflow and OQ updates (PRD-009).
5. Shared-file lock/transaction discipline (PRD-010).
6. Session close/resumption snapshot routine (PRD-011).
7. **Turnfile coordination read/write** (PRD-013): read TURNFILE.yaml at session start; update agent status, task state, lock entries, and signals through the Turnfile write protocol (PRD-013 R3).

PRD-005/006/007 interfaces may be included as optional modules until those docs are finalized for canonical adoption.

### R2.1 Turnfile as coordination interface

Skills that read or write coordination state (locks, task status, agent availability) must use TURNFILE.yaml as the single source of truth for runtime coordination, per PRD-013 R2. Skills must not maintain shadow coordination state in other files. Narrative/governance artifacts (MAILBOX.md, WORKLOG.md, OPEN_QUESTIONS.md) remain authoritative for their respective domains; the Turnfile is authoritative only for coordination state (PRD-013 R2.2).

### R2.2 Turn-boundary mailbox discipline

Boundary note: PRD-011/PRD-013 still define startup-orientation read order (Turnfile first). R2.2 governs active-turn execution boundaries after startup orientation is complete.

For every active turn, skill behavior must enforce mailbox checks as boundary conditions:

1. First step: read mailbox inbox snapshot and any unread messages addressed to the acting agent.
2. Last step: re-check mailbox before declaring turn completion.
3. Completion gate: the acting agent's unread mailbox count must be `0` before the turn is marked complete.
4. If unread cannot be cleared in-turn, the turn remains open and must be escalated to maintainer with explicit blocker context.

## R3. Invocation contract: explicit maintainer invocation only

<!-- OQ-039 resolved: explicit maintainer invocation only. No heuristic trigger suggestions. -->

Skills are invoked **only** by explicit maintainer instruction. Agents must not:
- Heuristically suggest skill invocation based on inferred context.
- Auto-trigger skills in response to detected conditions.
- Proactively offer to run skill modules unprompted.

Each skill module must define:

1. **Trigger phrases/examples** a maintainer can use.
2. **Expected inputs** (files, message IDs, scope).
3. **Deterministic outputs** (which files are updated, what confirmations are posted).
4. **Stop conditions and escalation conditions.**

Maintainer-facing invocation should be short and explicit (for example: "Run mailbox reconciliation module for MSG-024").

An agent may answer direct maintainer questions about available skills, but must not proactively recommend a skill based on inferred context.

## R4. Agent-specific execution boundaries

Codex and Claude skill files may differ in tooling and instruction format, but must preserve equivalent protocol outcomes. The R1 policy test suite validates that both skills produce:

1. Same status-transition semantics.
2. Same revision-token and payload constraints.
3. Same governance and escalation behavior.
4. Same auditability expectations in mailbox/worklog/Turnfile.

If an environment limitation prevents a step, the skill file must define explicit fallback behavior (for example, manual projection-stale flagging when helper tooling is unavailable). Fallback behavior must still satisfy the relevant policy test assertions.

## R5. Safety and governance guardrails

<!-- OQ-040 resolved: always require explicit maintainer confirmation before writes. No auto-apply, even for low-risk actions.
     Aligns with Vision.md Principle 2 (human-led governance) and Principle 4 (safety over speed). -->

### R5.1 Mandatory maintainer confirmation before writes

Skills must **always** require explicit maintainer confirmation before writing to any file. There is no "low-risk auto-apply" category. Even formatting-only or state-update-only changes must be confirmed.
Invocation alone is not write permission unless the maintainer explicitly authorizes writes in that same instruction (for example: "run and apply"). Otherwise, the module runs in propose-only mode until explicit apply confirmation is given.
The agent presents the proposed change; the maintainer approves or rejects.

### R5.2 General safety requirements

Skill instructions must include:

1. Explicit non-destructive defaults.
2. No hidden/private channel behavior.
3. Requirement to preserve authored meaning during compaction/rewrites.
4. Requirement to log substantive governance actions in WORKLOG.
5. All skill-initiated actions must be audit-visible in mailbox, worklog, or Turnfile (Vision.md § Core principles: "audit-visible to other authorized humans at all times").

## R6. Validation scenarios

Before canonical promotion, validate the skills pack on at least four scenarios:

1. Cross-agent PRD review round-trip with revision-token lineage.
2. Shared-file update cycle using lock + invariant checks.
3. Session close + next-session resumption using snapshot contract.
4. **Turnfile coordination cycle**: agent reads TURNFILE.yaml, self-assigns task, acquires lock, performs work, updates task status, releases lock — confirming PRD-013 R3 write protocol is correctly encoded in each skill.

Validation passes only when Codex and Claude reach equivalent outcomes on the same scenario class. Policy tests (R1) provide the assertion framework.

## R7. Versioning and ownership

1. Each agent's skill file version must be explicit and tied to protocol revision state.
2. Changes to protocol semantics in either skill file require maintainer approval.
3. Environment-specific changes that do not alter protocol semantics can be agent-owned but must be documented.
4. Policy tests must be updated whenever a requirement in PRD-003/004/008/009/010/011/013 changes.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| PRD-003/004 | Becomes executable workflow modules in each agent's skill file |
| PRD-008/009 | Becomes review/reconciliation module contract |
| PRD-010 | Becomes shared-file mutation guardrail module (lock mechanics subsumed into Turnfile per PRD-013 R2.3) |
| PRD-011 | Becomes session close/resume module; Turnfile read added to resumption read order |
| **PRD-013** | **Defines Turnfile coordination format that skills read/write; R2.1 establishes Turnfile as the coordination interface for skill-driven state updates** |
| **Vision.md** | **Alignment reference for governance posture, invocation strictness, and audit requirements** |
| `inception/NOTIFICATION_PROTOCOL.md` | Remains the normative source; skills are execution guidance |
| `inception/OPEN_QUESTIONS.md` | Tracks unresolved design decisions for skills rollout |
| `inception/TURNFILE.yaml` | Runtime coordination artifact that skills interact with for lock, task, and agent state |

## Acceptance criteria

1. Separate skill files exist for Codex and Claude, each encoding the full protocol workflow (R1).
2. A policy test suite exists with assertions for all required workflow modules (R1, R2).
3. At least one maintainer-facing trigger phrase is defined per required module (R3).
4. A pilot runbook exists for four validation scenarios in R6, including the Turnfile coordination cycle.
5. Cross-agent execution results are equivalent for all four R6 scenario classes before canonical promotion, validated by policy tests.
6. Skills correctly read/write TURNFILE.yaml as their coordination interface (R2.1).
7. Skills enforce turn-boundary mailbox discipline: mailbox checked first and last, and turn completes only with `unread=0` for acting agent (R2.2).

## Risks

1. Over-automation pressure may hide governance decisions that should stay explicit. **Mitigated by R3 (explicit invocation only) and R5.1 (mandatory confirmation before writes).**
2. Separate skill files could diverge and reintroduce behavior drift. **Mitigated by R1 policy test suite as reconciliation mechanism.**
3. Skills may become stale if protocol updates are not reflected promptly. **Mitigated by R7.4 (policy test updates on PRD changes).**
4. Extra structure may add maintenance overhead if scope is too broad initially.
5. Hybrid placement (R1.1) creates a sync risk between repo and home-directory copies. **Mitigated by repo-canonical rule; agents must re-sync on divergence.**

## Dependencies

1. PRD-003 message lifecycle + SLA contract.
2. PRD-004 maintainer decision contract.
3. PRD-008 cross-sandbox handoff contract.
4. PRD-009 reconciliation + OQ triage contract.
5. PRD-010 shared-file transaction + locking contract.
6. PRD-011 session resumption contract.
7. **PRD-013 Turnfile coordination format** — defines the runtime artifact that skills read/write for coordination state.
8. **Vision.md v2** — alignment reference for governance posture and invocation strictness.

## Milestones

1. **M0**: Draft PRD-012 (this document). ✅
2. **M0.5**: PRD-012 Revision 2 — re-scope against Vision.md, PRD-013, OQ-037–040. ✅ (this revision)
3. **M1**: Define per-agent skill file structure and policy test assertion framework (R1).
4. **M2**: Draft maintainer invocation examples for each required module, including Turnfile coordination (R3).
5. **M3**: Draft policy test suite covering all required modules (R1, R2).
6. **M4**: Run four validation scenarios (R6) across Codex and Claude.
7. **M5**: Decide canonical adoption path — migrate from `inception/skills/` to `docs/skills/` (R1.1).

## Open questions

All four original open questions have been resolved by maintainer inline annotations:

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-037 | Where should canonical protocol skills live? | **Hybrid model**: both repository-managed and per-agent home directories. | R1.1 |
| OQ-038 | Shared core with wrappers, or separate full skills? | **Separate full skills** reconciled by policy tests. | R1 |
| OQ-039 | Explicit invocation only, or heuristic triggers? | **Explicit maintainer invocation only.** | R3 |
| OQ-040 | Auto-apply low-risk changes, or always confirm? | **Always require explicit maintainer confirmation.** | R5.1 |

No new open questions at this time. Cross-PRD open questions tracked in `inception/OPEN_QUESTIONS.md`.

## Exit criteria for moving beyond inception draft

1. Skills model is piloted in live session work with no governance regression.
2. Maintainer confirms invocation overhead is lower than current manual orchestration.
3. Cross-agent behavior drift is reduced in measured reconciliation cycles.
4. Team agrees scope and ownership are stable enough for canonical documentation.
