# Code Review Mitigation Plan
Date: 2026-07-10
Status: proposed; Maintainer decisions partially recorded
Scope: repo tooling and optional profiles PRD-031 and PRD-049
Branch: `codex/review-mitigation-plan`

## Outcome
Mitigate the task-authority and multi-instance lifecycle failures found in the 2026-07-10 code review, strengthen rejected-operation safety, and expand the eval system without broadening the v1 Minimal Governance Profile.

This plan does not amend `INTENT.md`, promote an optional profile into v1-minimal, or authorize implementation before the Maintainer resolves the decisions in "Maintainer input requested." Behavior-changing contract work remains subject to the post-v1 admission rule: Maintainer ratification, explicit eval coverage, a compatibility note, and builder/reviewer separation by default.

## Corrected baseline
- `npm run validate` passes its 27 readiness tests and repository validators.
- CI already runs both `npm run validate` and `npm run evals:prd` as separate required steps in `.github/workflows/validate.yml`.
- The local gap is command/documentation alignment: `npm run validate` is described as a full gate in some surfaces but omits the PRD suites.
- There are approximately 36 aggregate eval files and 361 `test()` declarations. The appropriate next step is deeper negative and integration coverage around authority and lifecycle boundaries, not indiscriminate test-count growth.

## Newly confirmed risk
The task-authority review found a second privilege escalation adjacent to the original finding. An event stored in one agent's shard may self-declare `actor: maintainer`. The reducer reports an actor/shard mismatch but still evaluates the declared actor for authority, allowing the mismatched event to exercise Maintainer privileges. Identity provenance and mutable-field authority must be fixed together.

The instance review also confirmed that multi-instance signals remain unqualified after a second instance joins, contrary to PRD-049 R5.2. This belongs in the lifecycle mitigation because signal identity is part of authoritative instance provenance.

## Workstream A: task event authority
Owner shape: one eval author, a different implementer, and an independent reviewer.

### A0. Inventory and compatibility record
1. Inventory payload fields used by checked-in and real shard event logs.
2. Record whether historical projections will be recomputed strictly, schema-versioned, or corrected through append-only events.
3. Add a compatibility note for existing `task.created` events that set `status: in_progress` directly.

Current fixture inventory uses `owner`, `status`, `description`, and `created_rev` on creation, and `priority`, `note`, `created_by`, and `created_rev` on update. No live `working-session` task-event shards were found during review.

### A1. RED authority evals
Add fixture-backed tests before changing the reducer:
- Attacker updates `owner`, then completes the task. Ownership must remain unchanged and completion must be rejected.
- Updates cannot inject `status`, `completed_by`, `claims`, `completions`, or `updates`.
- A Claude shard declaring `actor: maintainer` cannot assign, complete, defer, or cancel.
- Creation cannot inject terminal state or lifecycle history.
- A mixed update applies permitted descriptive fields while rejecting protected fields.
- Parallel claims remain visible and deterministic.
- Rejected events remain present in audit/source output with `authoritative: false`.

### A2. Identity boundary
1. Derive write authority from the shard identity, not the event's self-declared actor.
2. Preserve a mismatched declared actor as audit evidence.
3. Mark mismatched events non-authoritative and exclude them from state reduction.
4. Emit a structured conflict that names the shard, declared actor, event, and attempted operation.

### A3. Field and lifecycle boundary
1. Replace the protected-field denylist with an explicit allowlist for descriptive updates.
2. Keep reducer-controlled fields immutable through `task.updated`: identity, owner, status, completion provenance, and reducer histories.
3. Apply allowed fields from mixed payloads, retain the whole attempted update in audit history, and emit conflicts for rejected fields.
4. Permit lifecycle transitions only through typed events.
5. Apply authority checks to defer and cancel, not only completion.
6. Make terminal transitions deterministic and surface conflicting terminal events instead of silently overwriting state.

### A4. Ownership transition contract
If ownership transfer is intended, add a typed event such as `task.handed_off` or `task.assigned`. It must name a registered target and retain prior/new owner provenance. Do not implement transfer through `task.updated`.

### A5. Robustness evals
- Causal handoff followed by completion.
- Completion before handoff remains unauthorized.
- Duplicate terminal events are idempotent.
- Conflicting terminal events require the selected arbitration rule.
- Seeded permutations of independent events produce the same aggregate.
- Fuzzed update keys never mutate reducer-controlled fields.

## Workstream B: multi-instance lifecycle
Owner shape: one eval author, a different implementer, and an independent reviewer familiar with PRD-049.

### B0. Contract-first integration fixtures
Replace source-text capability assertions with non-dry-run temp-workspace tests. Hash all affected files before rejected operations and assert total no-op behavior where required.

### B1. Shared checked lifecycle helper
1. Parse and validate the family and instance state once for open, close, and heartbeat operations.
2. Validate kebab-case identity, registered family, live instance, primary role, session, and cap.
3. Produce candidate state with match-or-fail mutations.
4. Lint candidate state before replacing live files.
5. Preserve TURNFILE comments, ordering, and quoting unless the Maintainer relaxes that compatibility requirement.

### B2. Open semantics
Subject to Maintainer decisions below:
- A named open creates or updates `agents.<family>.instances.<id>`.
- The first named instance is primary; later instances are secondary.
- A secondary open does not overwrite family-owned status, task, session, or last-seen fields.
- Family-level fields mirror the primary.
- Reopening the same instance is idempotent and does not consume the cap.
- A fourth live instance is refused before any write.
- Joining an occupied legacy family lane is refused unless an explicit migration path identifies the incumbent.
- When the second instance joins, new signals use the instance-qualified namespace at that revision; earlier signal IDs remain valid.
- Handshake and worklog evidence use the fully qualified identity.

### B3. Close semantics
- Unknown family or instance fails before writes.
- A secondary close removes or deactivates only that instance and its heartbeat; sibling state and family state remain intact.
- The last instance close restores the legacy-compatible idle family shape.
- A primary with live siblings cannot close until the selected handoff or election rule is satisfied.
- Instance closeout checks instance-owned obligations; primary or last-instance close checks the appropriate family obligations.
- Every intended mutation must match, and the post-mutation candidate must validate before replacement.

### B4. Heartbeat hardening
- Require complete family/instance identity in instance mode.
- Verify the instance is registered, live, and associated with the supplied session.
- Stop only `HEARTBEAT-<family>.<instance>.md` for an instance close.
- Preserve `HEARTBEAT.md` behavior for legacy single-instance mode.
- Include the resolved path and qualified identity in command output.

### B5. Lifecycle eval matrix
- First named instance registration and primary mirror.
- Second and third instance registration without family takeover.
- Fourth refusal with byte-identical files.
- Idempotent reopen.
- Invalid instance ID and ambiguous legacy migration refusal.
- Two heartbeat sentinels coexist; stopping one preserves the other.
- Secondary close preserves sibling and family lane.
- Primary close refusal without valid handoff.
- Authorized handoff promotes the target and mirrors family state.
- Last-instance close returns to the legacy shape.
- Unknown agent, unknown instance, structural mismatch, lint failure, and collision all leave files unchanged.
- Signal qualification begins at the exact multi-instance transition revision.

## Workstream C: CLI mutation safety
This workstream can share implementation primitives with B but has an independent acceptance gate.

1. Reject unknown agents before validators or writes.
2. Replace unchecked regex mutation with explicit match-or-fail behavior.
3. Generate and validate candidate TURNFILE, WORKLOG, and projection state before committing them.
4. Use atomic temp-file replacement where practical, or document and test the partial-write recovery contract.
5. Re-run relevant validators after mutation.
6. Test dry-run fidelity: reported targets and changes must match the real operation.
7. Decide whether a rejected operation must be a total filesystem no-op, including audit logs.

## Workstream D: eval and CI maturity

### D1. Local gate clarity
Choose one:
- Make `npm run validate` the complete local gate by adding `evals:prd`.
- Preserve the faster command as `validate:quick` and add `validate:all` as the documented complete gate.

Recommendation: expose both `validate:quick` and `validate`, with `validate` complete. Keep CI's explicit steps for readable failure attribution.

### D2. Registry-to-eval integrity
`implementation.evals` currently contains exact paths in some records and prose or comma-separated composite values in others. The runner performs exact-string lookup, so registry classification is not structurally reliable.

1. Add `implementation.eval_files` as an array of exact repo-relative paths, retaining `evals` temporarily as human-readable migration text if needed.
2. Validate that every listed file exists.
3. Validate that every `prd-NNN*.evals.mjs` maps to exactly one PRD or has an explicit non-PRD classification.
4. Reject duplicate, missing, malformed, and orphan mappings.
5. Add runner tests for done, pending, composite, orphan, missing-value, and unknown-flag behavior.
6. Make runner argument parsing fail fast instead of silently ignoring unknown flags.

### D3. Test tiers
- Per pull request: readiness validators plus all deterministic PRD suites, with a target below 60 seconds and no network.
- Focused developer commands: coordination-authority and instance-lifecycle groups.
- Compatibility: supported Node LTS plus the next/current line, required for runner or CLI changes and scheduled otherwise.
- Scheduled robustness: seeded event-order property tests, open/close collision simulation, and 50 to 100 repeatable seeds with failing seeds archived.
- Coverage: begin with report-only built-in Node coverage, then set thresholds for authority reducers and mutation helpers rather than a repo-wide percentage.
- Mutation testing: scheduled and limited to authority reducers and lifecycle guards after deterministic coverage lands.

## Suggested delivery sequence
1. Maintainer resolves the blocking intent questions.
2. Create contract amendments or compatibility notes for PRD-031 and PRD-049 as required by the answers.
3. Independent eval authors land A1, B0/B5, and C negative tests as RED.
4. Implement A2/A3 first because task actor spoofing and ownership takeover are direct authority violations.
5. Implement B1/B2/B4, then B3 after primary-close semantics are ratified.
6. Implement C mutation safety primitives and reuse them across lifecycle commands.
7. Implement D1/D2, then add scheduled robustness and coverage reporting.
8. Run `npm run validate`, `npm run evals:prd`, the v1 release validator, and focused compatibility tests.
9. Independent reviewers verify each workstream; unresolved conflicts return to the Maintainer rather than being collapsed into agent consensus.

## Maintainer input requested
The following answers materially change contracts and should be recorded before implementation.

### Task authority
These questions concern software agents recorded in Turnfile task events. They do not concern people. The human Maintainer remains the authority described in `INTENT.md`.

1. When a software agent creates a task record, may that agent assign the task to itself, assign it to another registered agent, or must the human Maintainer assign it? May a task initially have no assigned agent?
2. If a task is currently assigned to one software agent, who may change the recorded assignment to another registered agent or named agent instance: the human Maintainer, the currently assigned agent, or both the currently assigned agent and the receiving agent through an explicit handoff and acceptance?
3. May a different software agent that also worked on the task submit its work for review without becoming the agent recorded as responsible for final completion? Recommendation: yes; candidate work and final task completion should be separate records.
4. Who may record that a task is deferred or cancelled: the assigned software agent plus the human Maintainer, or only the human Maintainer?
5. Who may change the task's shared description, priority, labels, or acceptance criteria? Recommendation: any agent working on it may append notes and artifacts, while only the assigned agent or human Maintainer may change shared task metadata.
6. After a task is recorded as done, cancelled, or deferred, may the human Maintainer reopen it through an explicit event, or is that state permanent?
7. Existing fixtures sometimes create a task directly as `in_progress` instead of recording creation followed by a claim. Should those historical events retain legacy interpretation, be recomputed under the stricter rules, or be followed by corrective append-only events?

### Agent-instance lifecycle
An "agent instance" here means one named, concurrently running copy of an agent family, such as `claude/fable-5`. "Closing" means ending that agent instance's Turnfile working session. It does not mean closing or accepting a PRD.

8. When `turnfile open --agent <family> --instance <name>` is used, may TURNFILE immediately record that named running copy under `agents.<family>.instances`, even if it is currently the only copy in that family? Maintainer decision 2026-07-10: **yes**.
9. Suppose a family is already recorded in the older single-agent form, without a named `instances` entry, and a second named copy tries to join. Should the command refuse until the existing copy is explicitly given a name, or should the command provide a migration flag that names the existing copy? Recommendation: require an explicit name and never invent one.
10. When a named running copy ends its Turnfile working session, should its entry under `agents.<family>.instances` be removed, or retained there with `status: idle`? Recommendation: remove it from the live-instance map and retain the history in signals and WORKLOG.
11. PRD-049 records one concurrently running copy as the family's `lane_role: primary`. That copy controls the family-level status, task, boot file, chat file, and review voice. If it ends its Turnfile working session while another copy is still running, should it explicitly hand that role to a named running copy, should the tool choose automatically, or should the human Maintainer choose? Recommendation: require an explicit recorded handoff; do not choose silently.
12. When a named copy starts, should the tool create a separate task assigned to that fully qualified identity, such as `claude/fable-5`, or should only the copy holding `lane_role: primary` receive the family-level handshake task?
13. Must edits made by these tools preserve TURNFILE comments, ordering, and quote style? Maintainer decision 2026-07-10: **yes**.
14. When a non-primary named copy ends its working session, should closeout validation inspect only tasks assigned to that named copy, while closure of the primary or last running copy also checks family-wide obligations? Recommendation: yes.

### Validation and failure behavior
15. Should `npm run validate` mean the complete local release gate, including PRD eval suites, with a separately named quick command? Maintainer decision 2026-07-10: **yes**.
16. Must every rejected CLI operation leave all repository files unchanged, including TURNFILE, WORKLOG, and generated mailbox files? Maintainer decision 2026-07-10: **yes**.

## Recorded Maintainer decisions
- 2026-07-10: A named agent instance is recorded under `agents.<family>.instances` even when it is currently the only named copy in that family.
- 2026-07-10: Rejected CLI operations leave all repository files unchanged.
- 2026-07-10: `npm run validate` is the complete local validation gate and includes PRD eval suites; a separate quick command may remain available.
- 2026-07-10: Tooling edits preserve TURNFILE comments, ordering, and quote style.

## Definition of done
- All authority exploit chains fail closed and remain auditable.
- Self-declared actor identity cannot confer authority across a shard boundary.
- Named instance open creates authoritative instance state and never overwrites an occupied primary.
- Instance close and heartbeat stop affect only the named instance.
- Primary close follows the ratified handoff rule.
- Rejected mutations satisfy the selected no-op contract.
- PRD eval mappings are machine-readable and complete.
- The documented complete local gate runs readiness and PRD suites.
- Deterministic PR tests remain below the agreed runtime budget.
- Compatibility notes, changelog entries, and independent reviews are recorded before release.
