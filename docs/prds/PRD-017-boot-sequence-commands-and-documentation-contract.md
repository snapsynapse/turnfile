# PRD-017: Boot Sequence Commands and Documentation Contract

Status: Actioned (promoted to docs/prds, session 14, 2026-06-12; amended by PRD-037 session 21, 2026-06-18)
Owner: Maintainer + Codex + Claude + Gemini
Date: 2026-02-10
Last revised: 2026-06-18 (session 21: PRD-037 Amendment A1 — session-orient is boot fast path + signed-row-is-baseline-ack)

## Amendment A1 — Boot Simplification (PRD-037 R2 + R4)

PRD-037 (accepted + promoted session 21) amends this contract. Canonical text lives in PRD-037; summary here:

### A1.1 session-orient JSON output is the boot read (fast path)

A clean `node tools/session-orient.mjs --agent <self> --emit json` output satisfies the boot read **only when it reports no findings that require targeted reads**. If orient reports any of: unread mailbox work, stale projection, validator failure, missing artifacts, or dirty peer-owned paths, the agent MUST read the relevant underlying files before acting. PRD-017's failure/escalation behavior (R5) is preserved unchanged. Files-First remains in force — `session-orient` itself is a fresh disk read. Targeted reads (TURNFILE bodies, MAILBOX bodies, OPEN_QUESTIONS, boot-<agent>.md) become on-demand. (PRD-037 R2.1–R2.4)

### A1.2 Signed sign-off row is the boot-baseline ack

A signed handshake sign-off row in `working-session/NEXT_SESSION_HANDSHAKE.md` constitutes the agent's session-open baseline acknowledgment (protocol baseline match, skills self-validated, Tokenese confirmed, default scope ack, heartbeat spec, identity enforcing). No separate ack-or-counter mailbox card is required for boot baseline. The row CANNOT carry: a new lane assignment or task claim; a Maintainer decision relay; a substantive scope change; PRD acceptance; any policy normally requiring delivery-mirror or audit-mirror. Substantive work continues to use full mailbox cards with ack-or-counter lifecycle. Peer disagreement with a signed row's baseline claim is raised via a `counter` mailbox card pointing at the row. (PRD-037 R4.1–R4.6)

### A1.3 Canonical boot write tool

`tools/handshake-sign.mjs` is the canonical boot write surface: atomic sequential write with hash collision guard and PARTIAL WRITE detection across `TURNFILE.yaml`, `NEXT_SESSION_HANDSHAKE.md`, and `WORKLOG.md`, with auto-regeneration of `MAILBOX.json` and post-write validators. Use is opt-in per agent; manual boot remains valid. (PRD-037 R1)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260211-010 amendment pass verified and accepted by Codex; R7 fold re-verified by Codex in MSG-20260612-020 |
| Claude acceptance | accepted | MSG-20260211-010 review + amendment pass from Claude; R7 fold authored by Claude session 14 |
| Maintainer acceptance | accepted | Maintainer decision 2026-06-12 (session 14 triage): accept with PRD-020 folded in; OQ-051 resolved as documented contract + optional helpers |
| Eligible for move to `docs/prds` | yes | all acceptances recorded; folded R7 content re-verified by Codex |

## Alignment reference

This PRD aligns with:

1. `VISION.md` (auditability + explicit governance decisions)
2. PRD-011 (session resumption contract)
3. PRD-013 (Turnfile coordination state)
4. PRD-014 (session closeout + boot handoff)
5. PRD-012 (agent skill execution consistency)

## Problem

Boot and resume flows currently depend on loosely coordinated notes and historical context. This creates avoidable startup drift.

Observed failure modes:

1. Boot command order is not centrally specified, leading to inconsistent first-read behavior.
2. Documentation references can point to stale paths (`examples/inception/` vs `working-session/`), causing startup confusion.
3. Validation commands are not always run as a standard pre-flight set.
4. New contributors and future agents need extra manual interpretation to identify the current authoritative startup sequence.

## Goal

Define a single boot-sequence contract that standardizes:

1. Required startup commands and their execution order.
2. Required startup documentation read order.
3. Required validation checks before substantive edits.
4. Startup output artifacts that make session state explicit and auditable.

## Non-goals

1. Replacing protocol governance contracts already defined in PRD-003/004/013/014.
2. Introducing mandatory new runtime dependencies beyond current repo tooling.
3. Automating thread/session creation in external systems.
4. Defining model-specific internal reasoning workflows.

## Users

1. Maintainer: needs predictable startup behavior and reduced onboarding friction.
2. Active agents (Codex/Claude): need deterministic startup sequence and guardrails.
3. Future agents: need a portable, testable startup procedure.

## Requirements

## R1. Canonical boot command manifest

The protocol must define a canonical command set for session startup.

### R1.1 Required command classes

The manifest must include:

1. Repository state commands (branch/status checks).
2. Session workspace integrity checks.
3. Protocol validation checks (`turnfile-lint`, mailbox invariants, mailbox JSON projection).

### R1.2 Ordered execution

Commands must define a required execution order and failure-handling behavior (stop/continue/escalate).

## R2. Canonical boot read order

A startup documentation order must be defined and versioned.

### R2.1 Required sources

Read order must identify, at minimum:

1. Coordination artifact (`working-session/TURNFILE.yaml`).
2. Session status artifact (`working-session/WORKLOG.md` status block first).
3. Message state artifact (`working-session/MAILBOX.md` and optional `MAILBOX.json` projection).
4. Open-question and PRD status registries.

**R2.1 amendment (Maintainer 2026-06-23):** these sources are required unless `node tools/session-orient.mjs --agent <self> --emit json` reports a clean snapshot per PRD-037 R2 (Amendment A1). When orient reports clean (no findings on unread work, projection freshness, validator failures, missing artifacts, or dirty peer-owned paths), the orient output IS the boot read and on-demand targeted reads replace mandatory enumeration. Targeted reads still fall back to this enumeration when orient surfaces findings.

### R2.2 Freshness requirement

Before writing to shared files, agents must re-read target files if any concurrent edit risk exists.

## R3. Documentation-path authority and drift prevention

Startup docs must declare which workspace root is authoritative (`working-session/` for active local work) and how historical archives are referenced.

### R3.1 Path contract

Each boot instruction must clearly label one of:

1. Active path (mutable, current session).
2. Historical path (read-only archive/reference).

### R3.2 Drift checks

Boot flow must include at least one check that flags stale root references in active instructions.

## R4. Startup output contract

Boot sequence execution must produce a lightweight startup summary in the active worklog.

### R4.1 Minimum startup summary fields

1. Active branch.
2. Workspace health status.
3. Validation results.
4. Unresolved blockers requiring maintainer direction.

## R5. Error handling and escalation

Boot sequence must define how failures are handled.

### R5.1 Failure classes

At minimum:

1. Missing required file(s).
2. Validation failure.
3. Branch mismatch with maintainer expectation.

### R5.2 Escalation contract

Failures that block safe progress require explicit maintainer notification in mailbox/worklog before proceeding with substantive edits.

## R6. Skill and onboarding integration

Boot-sequence requirements must map cleanly into agent skill files and onboarding checks.

### R6.1 Skill mapping

Each required startup step must map to at least one skill module or explicit procedure section.

### R6.2 Onboarding evidence

New agent vetting (PRD-015) must include one boot-sequence conformance scenario.

*Session 14 note: PRD-015 is deferred (Maintainer decision 2026-06-12). This requirement activates when PRD-015 resumes; it is not a promotion blocker for PRD-017.*

## R7. Boot artifact completeness and chat log contract (folded from PRD-020)

*Folded from PRD-020 by Maintainer decision 2026-06-12 (session 14). PRD-020 is superseded by this section. Rationale: PRD-020's own scope-relationship note anticipated consolidation; artifact completeness is a boot concern and INTENT.md directs reducing protocol mass.*

### R7.1 Mandatory artifact set

Boot must ensure the booting agent's own chat file exists (create from `templates/working-session/chat-agent.md` if missing):

1. `working-session/chat-<agent>.md` (own file only).
2. Control-plane artifacts already required by R1-R2 (TURNFILE.yaml, MAILBOX.md, WORKLOG.md).

Each agent creates its own chat file only. Peer chat files are validated as existing-or-absent; absence of a peer chat file is a logged warning, never a boot-blocking condition (the peer creates it on its own next boot — deadlock-free by construction).

### R7.2 Unconditional per-agent instantiation

Any agent-parameterized template in `templates/working-session/` (`chat-agent.md`, `boot-agent.md`, or similar) must be instantiated by each agent for itself during bootstrap. The primary fix is procedural (skill Module 0 includes explicit creation); the R7.3 boot gate is defense-in-depth.

### R7.3 Boot gate

After initialization, boot validates:

1. Own-agent chat file exists — blocks if missing.
2. Control-plane artifacts exist — blocks if missing.
3. Peer chat file — warning only, non-blocking.

### R7.4 Chat file template contract

Per-agent chat files share a minimal template: title and purpose, session header block, state snapshot section. Session headers include fixed metadata fields for machine parsing: branch, Turnfile revision, phase, session ID, date (OQ-056 resolution). Session subsection structure remains manual; boot does not auto-create timestamped subsections (OQ-057 resolution).

### R7.5 Ownership

Each agent owns edits to its own chat file. Maintainer and peer agents retain read access. Decision authority remains in mailbox/WORKLOG; chat files are scratchpads and snapshots, not decision records.

## Acceptance criteria

1. A canonical boot command manifest exists and is referenced by both active agent workflows.
2. A startup run can be executed end-to-end with deterministic results from a clean checkout.
3. Validation failures produce explicit, documented escalation behavior.
4. Active startup docs no longer mix authoritative active paths with historical paths without labels.
5. At least one onboarding scenario verifies boot-sequence conformance for a candidate agent. *(Deferred with PRD-015; not a promotion blocker.)*
6. Clean-start boot creates the booting agent's own chat file when absent (R7).
7. Boot validation fails when required control-plane artifacts are missing; missing peer chat file warns without blocking (R7.3).
8. At least one test scenario covers missing peer chat file recovery (R7).

## Portable CLI entry point

`node tools/turnfile.mjs open --agent <id> --session <N> --model <label> --surface <label> --scope <lane>...` (PRD-048 R3) is the v1 portable boot entry that wraps `tools/handshake-sign.mjs` direct-flag mode (PRD-044) inside the orient-is-boot fast path (PRD-037 R2 + this PRD R2.1 amendment). The CLI is additive; direct invocation of `tools/handshake-sign.mjs` or `tools/session-orient.mjs` remains valid for advanced or scripted use.

## Risks

1. Over-prescriptive startup rules may slow simple sessions.
   Mitigation: keep manifest minimal and automation-friendly.
2. Documentation updates may lag protocol changes.
   Mitigation: tie boot-doc updates to PRD promotion and closeout checklists.
3. Tooling assumptions may not hold across all environments.
   Mitigation: define fallbacks and classify optional vs required commands.

## Dependencies

1. PRD-011 session resumption contract.
2. PRD-012 protocol skills pack.
3. PRD-013 Turnfile coordination format.
4. PRD-014 session closeout + boot handoff contract.
5. PRD-015 onboarding + vetting contract (for boot conformance checks).
6. PRD-020 boot artifact completeness + chat log contract (defines what artifacts must exist before boot proceeds).

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| PRD-011 | Strengthens startup read-order and minimum-state checks. |
| PRD-012 | Adds explicit startup module mapping expectations. |
| PRD-013 | Uses Turnfile as first authoritative coordination read. |
| PRD-014 | Extends closeout-to-next-boot continuity expectations. |
| docs/LLM_ONBOARDING.md | Adds concrete startup conformance checks for new agents. |

## Milestones

1. **M0:** Draft PRD-017 (this document).
2. **M1:** Define canonical boot command manifest + validation matrix.
3. **M2:** Reconcile boot docs with active path conventions (`working-session/` authority).
4. **M3:** Add onboarding boot-conformance scenario tied to PRD-015.
5. **M4:** Run cross-agent trial and capture evidence for promotion gate.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-051 | Should boot sequence be codified as a single script or remain a documented command contract with optional helper scripts? | **resolved** | R1, R5 — Documented command contract with optional helper scripts. No mandatory boot script; helpers must stay optional and hand-runnable. (Maintainer, 2026-06-12.) |
| OQ-056 | Should chat logs include fixed metadata fields (branch, rev, phase) for machine parsing? | **resolved** | R7.4 — Yes: branch, Turnfile revision, phase, session ID, date in session headers. (Maintainer, 2026-06-12.) |
| OQ-057 | Should boot create timestamped session subsections automatically or leave structure manual? | **resolved** | R7.4 — Manual structure. (Maintainer, 2026-06-12.) |
