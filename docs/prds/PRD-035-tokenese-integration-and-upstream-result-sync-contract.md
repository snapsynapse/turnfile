# PRD-035: Tokenese Integration and Upstream Result Sync Contract

Status: Accepted; implementation pending
Owner: Codex proposer; Claude reviewed APPLY with counters; Maintainer acceptance confirmed
Date: 2026-06-17
Last revised: 2026-06-17

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Drafted by Codex after Maintainer requested Turnfile audit and comparison to newest Tokenese; applied Claude counters C1-C4 in session 19 |
| Claude acceptance | accepted | MSG-20260617-032: APPLY with counters C1-C4; counters applied by Codex |
| Maintainer acceptance | accepted | keep this repo as evidence for the Tokenese repo (which it can cite) but do not confuse the two |
| Eligible for move to `docs/prds` | yes | all acceptances complete; promotion move still pending |

## Input Provenance Tags

1. `explicit`: Maintainer asked Codex to compare Turnfile to the newest version of Tokenese and create PRDs for next-session action only.
2. `observed`: Draft-time local Tokenese repo inspection showed `main`, package `tokenese-translator` version `0.3.2`, grammar version `v0.3`, TKAB schema `tkab-check-1.1`, with report-only frameset validation.
3. `observed`: Tokenese roadmap says the validating A/B experiment is still open and is the kill-criterion, while Turnfile has a session-17 Tier-A pilot result set.
4. `observed`: Turnfile `validate-tokenese-pairs.mjs` reports "Tokenese twins checked: 0" because it scans `*.tk.md`, not the active `working-session/tokenese-pairs/*.pair.json` and `*.result.json` TKAB artifacts.
5. `observed`: Tokenese docs disagree internally on GuideCheck status: README/assistant guide present Level 4 language, while INTENT/Roadmap say the DNS anchor is pending and current posture is Level 3 plus manifest.
6. `observed`: Turnfile currently records Tokenese v0.3.2 as no normative grammar change and correctly treats `frameset_validation` as report-only.
7. `maintainer-reported`: After Codex authored the PRD-035 evals, the Maintainer noted that Tokenese has incremented since Codex last touched it. The local checkout visible to Codex in this turn still reported tag `v0.3.2` at `e3b2839`; therefore implementation must perform a fresh Tokenese observation and must not treat the draft-time v0.3.2 note as current.

## Problem

Turnfile is now producing real Tokenese A/B pilot evidence, but there is no contract for synchronizing that evidence with Tokenese's own release and roadmap state.
The draft-time Tokenese version observation is already potentially stale, so the contract must force a current observed-state refresh before implementation or adoption decisions.

This creates three risks:

1. Turnfile could overstate its Tier-A pilot as satisfying Tokenese's broader N2 validating experiment.
2. Turnfile could expand Tokenese lanes before the calibration and upstream-result publication gates are clear.
3. Turnfile validators currently do not check the TKAB JSON pair/result artifacts that contain the live Tokenese evidence.

There is also an upstream documentation conflict in Tokenese itself around GuideCheck Level 4. Turnfile should record that conflict as external observed state, avoid importing the stronger claim, and route any upstream correction through the Tokenese repo rather than editing Tokenese from Turnfile.

## Goal

1. Define how Turnfile records the currently observed Tokenese version and toolchain state.
2. Define how Turnfile pilot results are packaged for upstream Tokenese review without modifying Tokenese semantics from this repo.
3. Add a validation layer for TKAB pair/result JSON artifacts.
4. Keep Tokenese adoption bounded: calibration first, then Maintainer decision, then any Tier-B lane.
5. Prevent Turnfile public or agent-facing surfaces from importing unverified Tokenese GuideCheck Level claims.

## Non-goals

1. Editing `/Users/snap/Git/tokenese` from this PRD.
2. Changing Tokenese grammar, framesets, checker semantics, or roadmap priority.
3. Treating Turnfile's Tier-A pilot as Tokenese's full validating A/B experiment.
4. Enabling Tokenese as an authoritative Turnfile communication channel.
5. Expanding dense scratchpads.

## Requirements

## R1. Tokenese version observation artifact

Turnfile must maintain a small observed-state artifact, tentatively `working-session/docs/tokenese-version-observation.md`, with a fresh observation of the current Tokenese state rather than inherited draft-time values:

1. Tokenese repo path inspected.
2. Git branch and dirty summary.
3. Grammar version.
4. Translator package version.
5. TKAB schema version.
6. Claimed test count from Tokenese docs.
7. Frameset status and whether it is report-only.
8. GuideCheck status as observed, including conflicts between Tokenese docs.
9. Date and actor of observation.
10. Previous Turnfile draft baseline when it differs from the current Tokenese state.
11. Whether the Maintainer reported a newer Tokenese increment before the observation.

The artifact is observational and non-authoritative. Tokenese repo docs remain the authority for Tokenese.

## R2. TKAB artifact validation

Add a Turnfile-side validator, tentatively `tools/validate-tkab-results.mjs`, for `working-session/tokenese-pairs/*.pair.json` and `*.result.json`.

This is a new, separate validator for TKAB JSON artifacts. It does not extend, replace, or change `tools/validate-tokenese-pairs.mjs`, which remains the PRD-028 validator for `*.tk.md` English/Tokenese twin artifacts. The two validators cover different artifact classes and must not overlap silently.

Minimum checks:

1. Every pair JSON has a matching result JSON when result evidence is claimed.
2. Result `source_id`, `clone_id`, direction, author, and artifact type match its pair.
3. Result schema is `tkab-check-1.1` or an explicitly allowed older schema.
4. `provenance.grammar_version_supported` and detected grammar are present.
5. `frameset_validation` exists for v0.3.2-scored artifacts and is explicitly report-only.
6. `source_text` and `clone_text` are preserved verbatim between pair and result.
7. Outcomes use the closed TKAB enumeration.
8. Token counts include both `o200k` and `anthropic` where the result claims both.

## R3. Result publication package

Before any broader Tokenese adoption decision, Turnfile must produce a result package for Tokenese upstream review.

The package must be derived from `working-session/docs/tk-ab-run-results.md` and the active `working-session/tokenese-pairs/*.result.json` artifacts. A generator may add structure and summary prose, but it must read the existing artifacts and must not re-key token counts, ratios, outcome values, or version tags by hand.

The package includes:

1. English summary of W1/L1/W2/W3/W4/W5 and L2/L3 outcomes.
2. Version tags per data point: grammar version, checker version, schema version, tokenizer set.
3. Misparse and repair counts.
4. Compression ratios by tokenizer.
5. Clear separation between Turnfile pilot evidence and Tokenese N2 validating experiment requirements.
6. Any known limitations, including small sample size and two-model-family scope.

## R4. Calibration gate

Turnfile must reference `working-session/docs/tk-calibration-audit.md` as the single calibration authority before any decision weights `^N` or `ev:` from a clone.

PRD-035 owns only the packaging and adoption-gate use of that audit result. It must not redefine the audit criteria in parallel. The current authority says:

1. `ev:obs` is conditional only when backed by in-context, independently verifiable observation.
2. `^N` remains untrusted and must not be weighted in Turnfile decisions.
3. `plain` abstention passed.
4. The audit does not make any self-reported channel standalone authority.

## R5. Adoption boundary

No Tier-B Tokenese lane may be opened until all are true:

1. R2 validator is green.
2. R3 result package exists.
3. R4 calibration audit is complete.
4. Maintainer explicitly authorizes the bounded Tier-B scope.
5. The scope excludes lifecycle state, locks, task claims, acceptance, normative PRD text, reasoning/proofs, and exact diffs unless a future PRD changes the boundary.

## R6. Upstream conflict handling

When Tokenese upstream docs conflict, Turnfile must:

1. Record the conflict in the observation artifact.
2. Use the weaker or more cautious claim in Turnfile surfaces.
3. Route proposed upstream fixes through Tokenese's repo process.
4. Not edit Tokenese files from the Turnfile repo.

Ownership split with PRD-034:

1. PRD-035 owns recording the current upstream observation and any Tokenese documentation conflict, including GuideCheck status conflicts, in the observation artifact.
2. PRD-034 owns what Turnfile public and agent-facing surfaces may assert from that observation.
3. PRD-035 produces the observed fact; PRD-034 enforces the public-surface claim.

## Acceptance Criteria

1. `working-session/docs/tokenese-version-observation.md` exists and records the currently observed Tokenese version, grammar version, TKAB schema, frameset status, git revision, and whether it supersedes the draft-time v0.3.2 observation.
2. A TKAB validator checks active pair/result JSON artifacts and fails a fixture with mismatched pair/result IDs.
3. The validator fails a fixture that lacks `frameset_validation` while claiming v0.3.2 scoring.
4. The validator fails a fixture where result `source_text` or `clone_text` differs from the pair.
5. A derived result publication package summarizes the session-17 Turnfile pilot without claiming it satisfies Tokenese N2 and without re-keying numbers from source artifacts.
6. `tk-calibration-audit` is completed before any Tier-B adoption recommendation.
7. Public Turnfile surfaces do not claim Tokenese GuideCheck Level 4 unless the upstream conflict is resolved and independently verified.
8. `validate-tkab-results.mjs` and `validate-tokenese-pairs.mjs` remain separate validators for separate artifact classes.

## Risks

1. Turnfile could become the de facto Tokenese spec fork.
   Mitigation: R1 and R6 make Turnfile observations non-authoritative and route language changes upstream.
2. Validator scope creep.
   Mitigation: R2 validates artifacts and provenance only, not Tokenese grammar semantics.
3. Premature adoption pressure after one positive W4 result.
   Mitigation: R4/R5 keep calibration and Maintainer decision gates explicit.

## Dependencies

1. PRD-027 Tokenese cloned-communication A/B.
2. PRD-028 Tokenese dual-artifact sync and Maintainer legibility.
3. PRD-024 human-legibility invariant.
4. Tokenese repo v0.3.2 observed locally on 2026-06-17 as the draft-time baseline.
5. Maintainer reported after eval authoring that Tokenese has incremented since Codex last touched it; exact current version requires a fresh Tokenese observation.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `working-session/docs/tk-ab-run-results.md` | Becomes input to a result publication package |
| `working-session/tokenese-pairs/` | TKAB JSON artifacts become validator-covered |
| `docs/prds/PRD-027-...` | Adoption gate clarified against newest Tokenese state |
| `docs/prds/PRD-028-...` | Existing `*.tk.md` twin validator remains separate from TKAB result validation |
| `docs/prds/PRD-034-public-and-agent-surface-snapshot-reconciliation-contract.md` | Owns public and agent-facing claims derived from the Tokenese observation |
| Public surfaces | Must avoid unverified Tokenese Level 4 or broad-adoption claims |

## Milestones

1. M0: Draft PRD.
2. M1: Claude review and Maintainer acceptance decision.
3. M2: Author TKAB validator eval fixtures.
4. M3: Implement TKAB validator.
5. M4: Record Tokenese version observation.
6. M5: Prepare Turnfile pilot result package.
7. M6: Run `tk-calibration-audit`.
8. M7: Ask Maintainer for any Tier-B decision.

## Open questions

*No open questions at this time.*
