# PRD-021: Conflict Loop Bound and Selective-Unlock Gradient Contract

Status: Accepted (promoted to docs/prds)
Owner: Maintainer + Codex + Claude
Date: 2026-06-01
Last revised: 2026-06-13 (Maintainer acceptance + promotion)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted with amendment | MSG-20260612-018: Codex APPLY with amendment (promoted PRD-018/019 paths; made `NO-NEW-OBJECTION` marker scope/latest-entry semantics explicit) |
| Claude acceptance | accepted | MSG-20260612-018 closure: Codex amendment reviewed and accepted; marker staleness rule verified against the convergence race flagged in the review ask |
| Maintainer acceptance | accepted | Maintainer accepted PRD-021 as-is in chat on 2026-06-13 after agent cross-review |
| Eligible for move to `docs/prds` | yes | all acceptances logged; zero blockers in PRD_STATUS.json |

## Input Provenance Tags

1. `explicit`: Maintainer wants the rebuttal loop in conflict resolution to be a configurable bound, with one rebuttal each as the minimum and converge-until-stable as the maximum.
2. `explicit`: Maintainer wants a binary selective-unlock gradient (gated vs. unlockable) layered onto the existing authority matrix, driving Maintainer-gate unlock eligibility only.
3. `explicit`: Turnfile stays text-only and human-readable (markdown/text). No office-document workflow, no binary-artifact verification layer.
4. `explicit`: Maintainer declined an enumerate-only review lane; peer counter-recommendation stays as-is (OQ-061).
5. `external prior-art`: pattern inspiration (bounded reviewer loop, builder/reviewer separation, task-risk gradient) is independently re-authored from a published external article. No third-party text is reproduced in this repo.

## Alignment reference

This PRD aligns with:

1. `docs/CONFLICT_RESOLUTION.md`
2. `docs/prds/PRD-004-maintainer-decision-contract.md`
3. `docs/prds/PRD-018-maintainer-approval-authority-matrix-contract.md`
4. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`
5. `docs/HUMAN_GOVERNANCE.md`

## Problem

Two gaps exist in the current conflict and authority model.

1. **Fixed rebuttal depth.** `docs/CONFLICT_RESOLUTION.md` Level 2 hardcodes exactly one rebuttal each before agents must converge or escalate. Some disagreements are settled faster than that; others would converge cleanly with a few more exchanges before consuming Maintainer attention. The depth should be a Maintainer-set parameter, not a constant.
2. **No unlock gradient.** OQ-052 resolved that all changes are Maintainer-gated by default, with selective unlocks to follow. PRD-018 defines the Band taxonomy and an unlock mechanism, but there is no explicit, auditable flag that marks a given change class as unlock-eligible versus permanently gated, and no recorded owner for assigning that flag.

## Goal

1. Make the Level 2 rebuttal depth a bounded, configurable parameter (`rebuttal_rounds`) defined in `TURNFILE.yaml`, ranging from one round each (minimum) to unbounded converge-until-stable (maximum).
2. Define a binary selective-unlock gradient (`gated` / `unlockable`) that extends the PRD-018 authority matrix and governs unlock eligibility only.

## Non-goals

1. Changing the peer counter-recommendation model. Enumerate-only review is explicitly out of scope (OQ-061).
2. Introducing any office-document, spreadsheet, or binary-artifact workflow. Turnfile remains text-only and human-readable.
3. Letting the gradient affect loop depth or review intensity. The gradient governs unlock eligibility only.
4. Auto-unlocking any change class. Unlock still requires explicit Maintainer ratification per PRD-018 R2.2.

## Requirements

## R1. Rebuttal loop bound parameter

The Level 2 rebuttal round in `docs/CONFLICT_RESOLUTION.md` becomes a bounded, configurable loop.

1. A new parameter `rebuttal_rounds` is defined in `TURNFILE.yaml` as the repo-wide default. The session charter may override it for a single session.
2. The parameter counts fixed rebuttal rounds. Each round is one rebuttal post from each participating agent.
3. Value semantics:
   - `1` (minimum): one rebuttal each, then converge-or-escalate. This is the current Level 2 behavior and the default.
   - integer `N > 1`: up to `N` rebuttal rounds each before convergence is forced.
   - `"unbounded"` (maximum): loop continues until a convergence signal or a Maintainer circuit-breaker fires (R2).
4. The bound applies per conflict, not per session. Each distinct disagreement runs its own loop under the active bound.

### R1.1 TURNFILE.yaml schema addition (specification)

The following key is added under `coordination`. Wiring it into the live `TURNFILE.yaml` is deferred until this PRD is accepted (it is a coordination-state change subject to the PRD-018 gate).

```yaml
coordination:
  conflict:
    rebuttal_rounds: 1   # integer >= 1, or "unbounded"
```

## R2. Unbounded-loop termination

When `rebuttal_rounds` is `"unbounded"`, the loop must still have a deterministic terminator. The loop ends on whichever of the following fires first:

1. **Convergence signal.** Both agents post a `NO-NEW-OBJECTION` marker for the conflict in the same WORKLOG cycle. This signals that neither agent has a new substantive edit to add. The conflict is then recorded as resolved-by-convergence.
2. **Maintainer circuit-breaker.** The Maintainer may stop any active loop at any time via a turn- or time-boxed break recorded in the WORKLOG, regardless of the configured bound. This is the same circuit-breaker role described in `docs/HUMAN_GOVERNANCE.md`.

A `NO-NEW-OBJECTION` marker posted by only one agent does not terminate the loop; the other agent may still post a rebuttal, which clears the marker. Markers are conflict-specific and current-round scoped: after any substantive rebuttal for that conflict, prior markers are stale, and convergence requires both agents' latest entries for that conflict in the same WORKLOG cycle to be `NO-NEW-OBJECTION`.

## R3. Escalation on bound exhaustion

When a finite `rebuttal_rounds` bound is exhausted without agreement (no convergence signal), the conflict escalates directly to Level 4 Maintainer adjudication. Level 3 (risk-minimizing default) is skipped.

1. This is a deliberate change to the `docs/CONFLICT_RESOLUTION.md` ladder: hitting the configured bound is itself the escalation signal, so the agents do not auto-pick a lower-risk default.
2. The escalating agent posts the conflict summary, both positions, and the round history to the WORKLOG and routes a `decision-required` mailbox message per PRD-019.
3. Level 3 remains available only as an explicit Maintainer instruction (the Maintainer may direct agents to take the lower-risk default rather than adjudicate), not as an automatic fall-through.

## R4. Selective-unlock gradient

Extend the PRD-018 authority matrix with a binary unlock-eligibility flag. This does not introduce a parallel taxonomy; it annotates the existing Bands and change classes.

1. Each change class carries one flag:
   - `gated`: always requires Maintainer approval. Never eligible for agent-pair approval.
   - `unlockable`: eligible to be unlocked for agent-pair approval, subject to explicit Maintainer ratification per PRD-018 R2.2.
2. The flag governs unlock eligibility only. It has no effect on rebuttal loop depth (R1) or on review intensity.
3. A flag of `unlockable` does not unlock anything by itself. Until the Maintainer issues an explicit unlock (PRD-018 R2.2), every change remains Maintainer-gated per OQ-052.
4. Default flags align with PRD-018 R2.1 launch defaults:
   - Band A (operational): `unlockable`.
   - Band B (protocol/process): `gated` (may be reclassified `unlockable` by Maintainer over time).
   - Band C (governance/irreversible): `gated`. Not eligible for unlock.

### R4.1 Flag assignment and ratification

1. The proposing agent self-tags a change with its Band (per PRD-018 R1) and the corresponding default flag.
2. The Maintainer ratifies the flag. No unlock takes effect on an `unlockable` class until the Maintainer both ratifies the flag and issues the unlock per PRD-018 R2.2.
3. Flag assignments and ratifications are recorded as WORKLOG decisions with scope and timestamp.
4. Ambiguous Band classification escalates per PRD-018 R4 (Maintainer decides the Band, hence the default flag).

## R5. Documentation propagation

On acceptance, the following are updated:

1. `docs/CONFLICT_RESOLUTION.md`: Level 2 references `rebuttal_rounds`; the ladder notes bound-exhaustion routing to Level 4 (R3); `NO-NEW-OBJECTION` convergence marker is documented.
2. `TURNFILE.yaml`: `coordination.conflict.rebuttal_rounds` key added (R1.1).
3. `docs/prds/PRD-018-...`: matrix annotated with the `gated` / `unlockable` flag column (R4).
4. Boot files (`boot-claude.md`, `boot-codex.md`, `boot-gemini.md`) reference the configurable bound and the gradient flag as authoritative.

## Acceptance criteria

1. `rebuttal_rounds` is defined with explicit minimum (`1`), finite (`N`), and maximum (`"unbounded"`) semantics, and a repo-wide default with charter-override path.
2. The unbounded mode has a documented dual terminator: `NO-NEW-OBJECTION` convergence signal or Maintainer circuit-breaker.
3. Bound exhaustion routes to Level 4 Maintainer adjudication, with Level 3 available only by explicit Maintainer instruction.
4. The authority matrix carries a binary `gated` / `unlockable` flag per change class, with documented defaults aligned to PRD-018 R2.1.
5. Flag assignment owner (proposing agent self-tags, Maintainer ratifies) is defined, and no `unlockable` class auto-unlocks.
6. At least one worked example each for: a finite-bound conflict that converges, a finite-bound conflict that exhausts and escalates, and an unbounded conflict terminated by `NO-NEW-OBJECTION`.

## Risks

1. Setting `rebuttal_rounds` too high (or `"unbounded"`) could delay escalation and consume agent cycles.
   Mitigation: default is `1`; the Maintainer circuit-breaker can stop any loop; unbounded is opt-in.
2. Skipping Level 3 on exhaustion removes the automatic lower-risk fallback, increasing Maintainer load on deadlock.
   Mitigation: this is intentional — exhaustion is treated as a signal that human judgment is needed; Level 3 remains available by explicit instruction.
3. Self-tagged Band flags could be mis-assigned by the proposing agent.
   Mitigation: Maintainer ratifies every flag; ambiguous Bands escalate per PRD-018 R4.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-058 | What should the rebuttal loop bound count, where is it configured, and how does the unbounded mode terminate? | **resolved** | R1, R2 — Fixed round counts; `rebuttal_rounds` in `TURNFILE.yaml` (charter may override); min `1`, max `"unbounded"`; unbounded terminates on `NO-NEW-OBJECTION` convergence signal or Maintainer circuit-breaker. (Maintainer, 2026-06-01.) |
| OQ-059 | When a finite rebuttal bound is exhausted without agreement, does the existing escalation ladder still fire? | **resolved** | R3 — Skip Level 3; escalate directly to Level 4 Maintainer adjudication. Level 3 available only by explicit Maintainer instruction. (Maintainer, 2026-06-01.) |
| OQ-060 | How is the selective-unlock gradient structured, what does it drive, and who assigns it? | **resolved** | R4 — Binary `gated` / `unlockable` flag extending the PRD-018 matrix; governs Maintainer-gate unlock eligibility only; proposing agent self-tags, Maintainer ratifies. (Maintainer, 2026-06-01.) |
| OQ-061 | Should Turnfile adopt an enumerate-only review lane (reviewer lists issues, does not propose the fix)? | **resolved** | Non-goal 1 — No. Peer counter-recommendation stays as-is; peers are equals and proposing an alternative is intended. (Maintainer, 2026-06-01.) |
