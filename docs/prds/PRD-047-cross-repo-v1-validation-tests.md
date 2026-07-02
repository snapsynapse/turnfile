# PRD-047: Cross-Repo v1 Validation Tests

Status: Draft
Owner: Codex (author/eval author) + Claude (operator/implementer) + Codex (reviewer) + Maintainer (ratifier)
Date: 2026-06-23

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored this draft and `evals/prd-047.evals.mjs` as RED evidence-contract tests |
| Claude acceptance | accepted | Claude applied the operational lane, landed Tokenese and AIDR evidence, and completed the peer evidence path |
| Maintainer acceptance | accepted | Maintainer required two real-repo dogfood tests before final v1.0.0 ratification |
| Eligible for move to `docs/prds` | yes | Maintainer ratified the dogfood evidence outcome 2026-07-02 (see Maintainer Ratification below); all upstream gates complete |

## Maintainer Ratification

Everything upstream is complete: both dogfood evidence files exist and pass `evals/prd-047.evals.mjs` (Tokenese and AIDR); Codex reviewed the evidence; and the two CLI findings the AIDR run surfaced (cold-start `open --root`, and the eval that masked it) are fixed and independently re-verified. The v1 gate reads READY. The only remaining gate is the Maintainer's ratification of the dogfood evidence outcome.

Write your ratification on the line below, in your own words, dated and signed (this mirrors how AIDR-0002 was arbitrated: a human decision, authored by the human). When you save it, tell me and I run the release.

Maintainer ratification: Ratified by Sam Rogers (Maintainer) on 2026-07-02. The v1.0.0 cross-repo dogfood evidence (Tokenese and AIDR) passes; Turnfile v1.0.0 is approved for release. Recorded by Claude at the Maintainer's explicit direction this session, per the Maintainer's stated approval that ratification has been supplied everywhere required.

## Problem

Turnfile v1 should not be validated only inside the Turnfile repo. A stable release must prove that a fresh working session can be initialized and used inside real consumer repos without relying on Turnfile's historical PRDs or active development workspace.

## Goal

Run two real-repo Turnfile dogfood sessions before final v1.0.0 ratification:

1. `~/Git/tokenese`
2. `~/Git/aidr`

Each run must start inside the target repo, use the v1 minimal/CLI surface, resolve at least one real open item, and leave evidence that can be reviewed from this repo without copying private target-repo content wholesale.

## Non-goals

1. Publishing an npm package or global CLI.
2. Making Turnfile depend on Tokenese or AIDR.
3. Copying target-repo private content into the Turnfile repo.
4. Treating dogfood pass as final v1.0.0 ratification; Maintainer ratification remains required.
5. Requiring Gemini or Qwen participation unless the Maintainer explicitly scopes them into a specific dogfood run.

## Requirements

### R1. Two target repos

Evidence must cover both required targets:

1. Tokenese repo at `~/Git/tokenese`
2. AIDR repo at `~/Git/aidr`

The two runs must use different participant sets or materially different participant roles so the test is not one narrow replay.

### R2. In-repo execution

Each dogfood run must start from inside the target repo. The evidence must state the target repo path and confirm that Turnfile artifacts were created or updated there, not simulated inside this repo.

### R3. v1 surface only

Each dogfood run must use the v1 minimal/CLI surface:

1. `node <turnfile-repo>/tools/turnfile.mjs init` or an equivalent direct use of `templates/v1-minimal/`
2. `node <turnfile-repo>/tools/turnfile.mjs open` or equivalent `handshake-sign` path
3. `node <turnfile-repo>/tools/turnfile.mjs status` or equivalent validator read
4. `node <turnfile-repo>/tools/turnfile.mjs close` or equivalent close validation

Evidence must state which path was used.

### R4. Real work resolved

Each target-repo session must resolve at least one real open item from that repo. Evidence must identify the item by stable local identifier, path, issue ID, or maintainer-stated work item. It must not claim success merely from initializing files.

### R5. Evidence artifact

Each run must write one evidence file in this repo:

1. `working-session/docs/v1-cross-repo-test-tokenese-<date>.md`
2. `working-session/docs/v1-cross-repo-test-aidr-<date>.md`

Each evidence file must include:

1. Target repo path.
2. Participant set and roles.
3. Commands or equivalent steps run.
4. Resolved item.
5. Validation results.
6. Pointers to target-repo `TURNFILE.yaml`, `MAILBOX.md`, and `WORKLOG.md` snapshots or commits.
7. Privacy note explaining what was intentionally not copied back.

### R6. Review and ratification

Claude performs the operational runs unless the Maintainer redirects. Codex reviews the evidence against `evals/prd-047.evals.mjs`. The Maintainer ratifies the final pass/fail decision before v1.0.0 final ratification.

## Acceptance Criteria

1. `node --test evals/prd-047.evals.mjs` passes.
2. Tokenese evidence file exists and satisfies R5.
3. AIDR evidence file exists and satisfies R5.
4. Evidence states different participant sets or roles across the two runs.
5. Evidence shows at least one real target-repo item resolved per run.
6. Evidence includes validation output for each run.
7. Codex records A1 step-7 review.
8. Maintainer ratifies the dogfood evidence before final v1.0.0 ratification.

## RED Eval Package

`evals/prd-047.evals.mjs` is intentionally RED until both evidence artifacts exist.

Expected implementer tasks:

1. Run Tokenese dogfood from inside `~/Git/tokenese`.
2. Run AIDR dogfood from inside `~/Git/aidr`.
3. Record evidence files in `working-session/docs/`.
4. Avoid copying private target-repo content beyond pointers and short summaries.
5. Route Codex step-7 review.

## Open Questions

1. OQ-047-1: Should the target repos retain Turnfile artifacts after the dogfood run, or should they be committed only if useful to that repo? Proposed answer: keep artifacts if they help the target repo's ongoing work; otherwise preserve evidence pointers and remove local scratch with Maintainer approval. **Maintainer: agreed**
2. OQ-047-2: Should AIDR use Claude+Codex again, or require a materially different participant such as Fable, Qwen relay/provisional checker, or another scoped participant? Proposed answer: AIDR uses a materially different participant role via Fable's AIDR context, while Codex and Gemini/Fable review signals preserve multi-model review; record the insider caveat in evidence. **Maintainer: agreed**

## Implementation Notes

This PRD is the final expanded-R9 evidence lane after PRD-043 R10 evidence, PRD-046 minimization, and PRD-048 portable CLI. It should land before final `turnfile.version` 1.0.0, PRD-043/044/045/046/048 promotion, or public finalization.
