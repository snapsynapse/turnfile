# PRD-023: Out-of-Band Activity Reconciliation Contract

Status: Actioned (promoted to docs/prds, session 14, 2026-06-13)
Owner: Maintainer + Codex + Claude
Date: 2026-06-12
Last revised: 2026-06-13 (Claude amendment applied by Codex)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | author; Claude R4 amendment applied 2026-06-13 |
| Claude acceptance | accepted | MSG-20260612-026 reply: APPLY with R4 amendment requiring a decision-required Maintainer route when governance-state drift blocks |
| Maintainer acceptance | accepted | drafting green-lit by Maintainer 2026-06-12 |
| Eligible for move to `docs/prds` | yes | all acceptances recorded; promoted session 14 |

## Input Provenance Tags

1. `explicit`: Maintainer session 14 goal required honest reconciliation of Feb-June work that happened outside the Turnfile session record.
2. `explicit`: Maintainer authority under HUMAN_GOVERNANCE makes out-of-band work legitimate, but it must not silently weaken the audit record.
3. `derived`: Claude proposed PRD-023 in MSG-20260612-023; Codex accepted with amendment requiring a runtime-neutral minimum and treating git comparison as an enhancement.
4. `derived`: Session 14 drift record in WORKLOG demonstrates the failure mode: real repo history existed, but the coordination artifacts did not summarize it until session open.

## Alignment reference

This PRD aligns with:

1. `docs/HUMAN_GOVERNANCE.md`
2. `SPEC.md` v0.1.0-reset sections 1 and 11
3. `INTENT.md` design invariant 4
4. `docs/prds/PRD-011-session-resumption-contract.md`
5. `docs/prds/PRD-017-boot-sequence-commands-and-documentation-contract.md`
6. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`

## Problem

Turnfile assumes the working record is recoverable from plain files. That assumption breaks when legitimate work occurs outside an active Turnfile session and no reconciliation note is added.

Session 14 exposed the concrete gap:

1. Maintainer-authored repo work happened between session 13 and session 14.
2. The work was valid under Maintainer authority.
3. The coordination state did not record it until a later agent reconstructed it.
4. Future agents could misread the repo as stalled, infer wrong PRD state, or miss governance changes.

The protocol needs a lightweight reconciliation contract that preserves Maintainer freedom while making drift visible early.

## Goal

1. Define minimum conformance for recording legitimate out-of-band activity.
2. Add a boot-time drift check that flags unrecorded activity for reconciliation.
3. Keep the rule portable across runtimes and repositories without requiring git.
4. Block only when unrecorded activity affects governance state.

## Non-goals

1. Prohibiting Maintainer out-of-band work.
2. Requiring every repository to use git or any specific VCS.
3. Creating wall-clock polling or background monitoring obligations.
4. Treating cosmetic or non-governance drift as a hard blocker.
5. Reconstructing full commit history inside WORKLOG.

## Requirements

## R1. Out-of-band activity definition

Out-of-band activity is any repo, protocol, or governance change that occurs outside an active Turnfile session turn and is not already reflected in the current coordination artifacts.

Activity is in scope when it changes any of:

1. PRD state, acceptance evidence, OQ state, or governance decisions.
2. Turnfile protocol rules, skill behavior, boot files, or validation tools.
3. Canonical project positioning, scope, roadmap, security posture, or baseline documentation.
4. Source artifacts that active PRDs or session tasks depend on.

Activity is out of scope when it is purely local scratch work, generated build output, dependency cache churn, or another ignored/non-authoritative artifact.

## R2. Minimum reconciliation record

The minimum portable record is a Maintainer checkpoint note or agent-authored reconciliation note in `WORKLOG.md`.

The note must include:

1. Date or date range.
2. Actor, when known.
3. Short summary of changed artifact classes.
4. Whether governance state changed.
5. Follow-up owner or "none".

The note may reference commits, branches, mailbox messages, or external records, but those references are optional. The plain-text note is the minimum conformance artifact.

## R3. Boot drift check

At session boot, the active agent checks for evidence of out-of-band activity since the last recorded session close or checkpoint.

Minimum check:

1. Read the latest WORKLOG session close/checkpoint.
2. Inspect available local evidence for newer substantive activity.
3. If evidence exists and no reconciliation note covers it, add or request a reconciliation note before relying on stale state.

When git is available, the agent should compare commit history since the last recorded session close/checkpoint against the WORKLOG. When git is unavailable, the agent uses available file metadata, explicit Maintainer notes, or repository-local changelogs.

## R4. Flag vs. block behavior

Unrecorded out-of-band activity is normally a flag, not a blocker.

It blocks the active turn only when the unrecorded activity appears to change governance state, including:

1. PRD acceptance, rejection, deferral, supersession, or promotion.
2. OQ resolution or reopening.
3. Authority matrix, Maintainer gate, unlock, or conflict-resolution changes.
4. Active task ownership or session close/resume state.

For non-governance drift, the agent records a warning and continues after adding a lightweight reconciliation note or routing a request for one.

When the governance-state block fires, the blocking agent must route a `decision-required` mailbox message to the Maintainer per PRD-019. The message includes the observed evidence, the suspected governance impact, and a draft reconciliation note. A governance-state block must carry its own exit path; it is not left as an unowned stop condition.

## R5. Maintainer authority and agent responsibility

Maintainer out-of-band work remains valid immediately. This PRD adds record hygiene, not prior restraint.

1. The Maintainer may supply a checkpoint note directly.
2. An agent may draft the reconciliation note from observable evidence.
3. If an agent is uncertain whether the drift affected governance state, it asks the Maintainer rather than silently choosing.
4. The reconciliation note must distinguish observed facts from agent inference.

## R6. Propagation targets

On acceptance, update:

1. Boot files to include the R3 drift check.
2. Agent skill bundles to require reconciliation before trusting stale state.
3. Session charter or closeout templates to include an optional "last checkpoint" line.
4. `WORKLOG.md` conventions to include the R2 minimum fields.

## Acceptance criteria

1. Minimum reconciliation fields are explicit and runtime-neutral.
2. Boot drift check has a git path and a non-git fallback path.
3. Block behavior is limited to unrecorded governance-state changes.
4. Maintainer out-of-band authority is preserved without ambiguity.
5. Session 14 Feb-June drift can be represented by R2 without requiring additional tooling.

## Risks

1. Agents may over-block on harmless file drift.
   Mitigation: R4 makes flag-not-block the default and reserves blocking for governance-state changes.
2. Reconciliation notes may become verbose.
   Mitigation: R2 asks for changed artifact classes and governance impact, not exhaustive history.
3. Non-git fallback may be less precise.
   Mitigation: precision is optional; the minimum artifact is an honest checkpoint note.

## Dependencies

1. PRD-011 session resumption.
2. PRD-017 boot sequence commands.
3. PRD-019 mailbox-first approval and event-based cadence.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `WORKLOG.md` | Adds minimum reconciliation note convention |
| `boot-*.md` | Adds boot drift check before relying on stale state |
| Agent skill bundles | Adds turn-start stale-state reconciliation obligation |
| `docs/HUMAN_GOVERNANCE.md` | No authority change; records hygiene around Maintainer action |

## Milestones

1. M0: Draft PRD and route to Claude for cross-review.
2. M1: Apply Claude counters and register acceptance evidence.
3. M2: Add boot/skill propagation tasks after Maintainer acceptance.

## Open questions

*No open questions at this time.*
