# PRD-049: Same-Family Multi-Instance Collaboration

Status: Accepted
Owner: Claude (Fable 5, proposer/eval author) + Codex (implementer) + Claude (reviewer, one family voice) + Maintainer (ratifier)
Date: 2026-07-02

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Claude acceptance | accepted | Claude (Fable 5) authored this draft and `evals/prd-049.evals.mjs` as RED contract tests per Maintainer direction 2026-07-02 |
| Codex acceptance | accepted | Codex implemented the PRD-049 package on 2026-07-02; after Claude A1 review, Codex applied C1/C2 counter follow-up and verified `evals/prd-049.evals.mjs` PASS 12/12 |
| Maintainer acceptance | accepted | approval 2026-07-02 |
| Eligible for move to `docs/prds` | yes | Claude re-review closed C1/C2, implementation is done, and Maintainer accepted on 2026-07-02 |

## Problem

Turnfile agent identity is one slot per provider family (`codex`, `claude`, `gemini`, `qwen`), with one live process per slot. A second model from the same family has no legal identity while a sibling holds the slot. Observed 2026-07-02: Claude Fable 5 could not join session 30 while Claude Opus 4.8 held the `claude` slot with a live heartbeat; signing in would have produced two uncoordinated writers on claude-owned files.

`docs/llm/MODEL_LEDGER.md` already proves *sequential* model succession on one slot (Opus 4.6 / Fable 5 / Opus 4.7 / Opus 4.8 across sessions on an unmodified protocol). This PRD adds *concurrent* same-family participation without weakening the protocol's heterogeneity premise.

## Goal

Allow up to three concurrent model instances per provider family to collaborate inside one Turnfile session, with:

1. Instance-level identity, task ownership, and heartbeat.
2. Family-level review quorum unchanged (one family = one voice).
3. Agent-self-reconciled lane-primary election, Maintainer-overridable.
4. No change to the v1 minimal governance profile (this lands as an optional profile).

## Non-goals

1. Changing the four-family roster or admitting new families.
2. Counting same-family instances as independent reviewers (explicitly rejected; see R3).
3. Modifying the v1.0.0 minimal profile, `templates/v1-minimal/`, or the R9 freeze surface.
4. Cross-repo instance federation; scope is one working tree, one session.
5. Restructuring `docs/llm/MODEL_LEDGER.md` to per-instance rows (Maintainer decision 2026-07-02: keep per-session rows).

## Maintainer Design Decisions (2026-07-02)

These four decisions are input constraints, not open questions:

1. **Quorum**: same-family instances are ONE review voice. Required-reviewer sets count by family, never by instance.
2. **Primary election**: instances reconcile lane-primary among themselves by default; Maintainer can direct and reassign at any time.
3. **Cap**: maximum 3 instances per family.
4. **Model ledger**: per-session rows retained; instance detail recorded within the session row.

## Requirements

### R1. Instance identity

`TURNFILE.yaml` `agents.<family>` gains an optional `instances` map when more than one instance of a family is active:

```yaml
agents:
  claude:
    role: "agent"
    status: "active"
    current_task: "..."          # lane-primary's task (back-compat: single-instance shape unchanged)
    instances:
      fable-5:
        model: "claude-fable-5"
        session_id: "claude-session-31"
        status: "active"
        current_task: "..."
        lane_role: "primary"
      opus-4-8:
        model: "claude-opus-4-8"
        session_id: "claude-session-30"
        status: "active"
        current_task: "..."
        lane_role: "secondary"
```

Instance ids are kebab-case model designators unique within the family. The fully qualified instance identity is `<family>/<instance-id>` (e.g., `claude/fable-5`). Single-instance operation requires no `instances` map; the existing shape remains valid and is the default. Schema change is additive and backward compatible.

### R2. Instance cap

At most 3 entries in any family's `instances` map. Lint fails on 4 or more. A fourth instance attempting to boot must be refused by `handshake-sign` with a clear error naming the cap and the live instances.

### R3. One family, one voice (quorum invariant)

1. Required-reviewer sets (e.g., `{codex, claude, maintainer, gemini}`) count by family. A review recorded by any instance satisfies (or spends) that family's single voice.
2. Two instances of one family recording conflicting verdicts on the same review is a protocol error; the family must reconcile internally (lane-primary's verdict wins by default) before the family verdict is recorded.
3. A1 proposer/implementer separation may NOT be satisfied by two instances of the same family. If `claude/fable-5` authors, no `claude/*` instance may be the A1 implementer.
4. Rationale: same-family models share training lineage; their errors are correlated. Counting them separately would hollow out the heterogeneity premise that motivates the required-reviewer set.

### R4. Lane-primary election and reassignment

1. Exactly one instance per family holds `lane_role: primary` at any time; all others are `secondary`.
2. Default election is agent-self-reconciled: first instance to boot into an empty family lane takes primary via the existing revision-lease mechanism (Module 5); later instances boot as secondary and acknowledge the standing primary in their handshake.
3. Instances may renegotiate primary among themselves (e.g., primary yields at close, or hands off for a capability reason), recorded as a signal with both instances' acknowledgment.
4. Maintainer can direct or reassign primary at any time; Maintainer direction overrides any self-reconciled arrangement immediately.
5. Primary owns: family-level `status`/`current_task` fields, family boot file, family chat file, and the family's external review voice. Secondaries own only their instance-scoped fields, shards, and delegated tasks.

### R5. Instance-scoped coordination artifacts

1. Heartbeat sentinel per instance: `working-session/HEARTBEAT-<family>.<instance-id>.md` (e.g., `HEARTBEAT-claude.fable-5.md`). One instance closing must not stop a sibling's heartbeat. Single-instance operation may keep the existing `HEARTBEAT.md` name.
2. Signal/message namespaces extend PRD-031 one level: instance-authored signals and messages carry the instance qualifier (e.g., `SIG-claude.fable-5-NNN`) when more than one instance of that family is active in the session.
3. Per-agent shard directories nest by instance: `working-session/agents/<family>/<instance-id>/`.

### R6. Write-collision discipline

1. Family-owned files (boot, chat, family TURNFILE fields) are writable by lane-primary; a secondary writing them requires an instance-keyed revision lease naming the fully qualified instance id.
2. Instance-scoped files are owned by their instance under existing ownership rules; family prefix matching preserves OQ-069 self-owned-file semantics (a `claude/*` instance's files are still claude-family files to non-claude agents).
3. Task rows in `coordination.tasks` may be owned at instance granularity (`owner: "claude/fable-5"`); lint must accept both family and instance owner forms.

### R7. Model ledger

Session rows in `docs/llm/MODEL_LEDGER.md` remain per-session. When a session runs multiple instances of one family, the row lists all instance models and which held primary. No per-instance row restructuring.

### R8. Optional profile boundary

This capability is an optional profile (like heartbeat and Tokenese profiles), documented in this PRD and referenced from `PRD_SHELF_RECONCILIATION.json` classification. The v1 minimal profile, `templates/v1-minimal/`, and all frozen v1.0.0 surfaces are untouched. Adopters running single-instance-per-family need no changes.

### R9. Ephemeral delegate rule (subagent fan-out)

Fan-out subagents (task-scoped delegates spawned by a roster agent or instance — e.g., Agent-tool probes, workflow fan-out workers) are a third identity tier below instances. They are NOT registered, NOT onboarded, and have no protocol identity.

1. **Attribution**: delegate output enters the protocol as the spawner's output. The spawner must review delegate work before signing it into any protocol artifact; unverified delegate claims cannot be laundered into evidence under the spawner's signature.
2. **Disclosure**: when delegate work becomes protocol evidence, the evidence artifact must name the delegate model and task (precedent: PRD-043 R10 fresh-context probes, `working-session/docs/v1-fresh-context-probe-2026-06-23-claude-{haiku,sonnet}.md`).
3. **No direct coordination writes**: delegates never write `TURNFILE.yaml`, mailbox files, signals, reviews, or any coordination artifact directly. All writes flow through the spawner.
4. **No quorum standing**: a delegate cannot be a required reviewer, cannot satisfy A1 proposer/implementer separation, and cannot contribute a review voice — a fortiori from R3 (a full sibling instance cannot; a delegate certainly cannot). Delegate model family is irrelevant to quorum; only the spawner's family counts. A spawner cannot acquire "borrowed heterogeneity" by delegating to another family's model.
5. **Instance vs delegate boundary**: an instance is addressable and persistent within a session (peers can route to it; it holds identity fields, tasks, a heartbeat). A delegate is fire-and-forget and invisible to peers except through disclosed evidence. Anything that needs to receive a message, hold a task, or persist across turns must be an instance (R1), not a delegate.

## Acceptance Criteria

1. `node --test evals/prd-049.evals.mjs` passes (GREEN after implementation).
2. Schema accepts the R1 `instances` shape and rejects a 4th instance (R2) — exercised via lint fixtures.
3. `handshake-sign` (or `turnfile.mjs open`) can boot a named instance into an occupied family lane as secondary, and refuses a 4th.
4. Lint enforces: cap 3, exactly one primary per multi-instance family, instance-owner task rows valid.
5. One-voice rule documented in protocol docs and asserted by a validator or lint rule (a review record attributed to two instances of one family for the same required-reviewer slot fails).
6. Existing single-instance TURNFILE.yaml files (this repo's, and `templates/v1-minimal/`) pass lint unchanged.
7. Ephemeral delegate rule (R9) documented in protocol docs: spawner attribution, evidence disclosure, no direct coordination writes, no quorum standing.
8. Codex records A1 step-7 review; Claude family records one review voice.
9. Maintainer ratifies before promotion to `docs/prds`.

## RED Eval Package

`evals/prd-049.evals.mjs` was RED until implementation landed. After Codex applied Claude's A1 C1/C2 counters, the suite passes 12/12 and covers the review-voice validator and fourth-instance boot refusal gaps.

Expected implementer tasks (Codex, per A1 step 5):

1. Additive schema extension for `agents.<family>.instances` (id shape, cap, `lane_role` enum, exactly-one-primary).
2. Lint rules: cap 3, one primary, instance-owner task validation, back-compat for single-instance shape.
3. `handshake-sign` / `turnfile.mjs open` instance support: `--instance <id>` boots secondary into occupied lane; refusal at cap.
4. Heartbeat sentinel naming support for instance-scoped sentinels.
5. Protocol doc section (PROTOCOL_CORE or COMMUNICATIONS_PROTOCOL) covering R3 one-voice, R4 election, and the R9 ephemeral delegate rule (attribution, disclosure, no coordination writes, no quorum standing).

## Open Questions

1. OQ-049-1: When lane-primary goes stale mid-session (crash, no close), does a secondary auto-promote via PRD-045 stale-agent reconciliation, or wait for Maintainer? Proposed answer: PRD-045 machinery applies — a secondary may reconcile the stale primary and self-promote with the standard stale-evidence trail; Maintainer can reverse. **Maintainer agrees, suggest same family model for first fallback (one voice), and permission gate before taking action from another model family.**
2. OQ-049-2: Do instance-qualified signal IDs apply retroactively to a session that starts single-instance and becomes multi-instance mid-session? Proposed answer: no; qualification begins at the revision where the second instance boots. **Maintainer: agreed**
3. OQ-049-3: Should the internal family reconciliation (R3.2) be visible in the mailbox or stay in family-internal chat/shards? Proposed answer: outcome visible as one family verdict in the mailbox; deliberation stays instance-internal unless Maintainer requests the trail. **Maintainer: agreed**

## Implementation Notes

Motivating instance pair: Claude Opus 4.8 (session 30 lane holder) + Claude Fable 5 (joining). First live exercise of this PRD should be that pair, which also serves as its own dogfood evidence. This PRD was authored by the joining instance while read-only-observing the occupied lane — the authorship itself documents the gap.
