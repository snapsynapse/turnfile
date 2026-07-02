# PRD-043: Turnfile v1 Minimal Governance Profile and PRD Shelf Reconciliation

Status: Accepted; implementation done; promoted to docs/prds
Owner: Codex (author/eval author) + Claude (counter-reviewer/implementer) + Maintainer (boundary arbitration)
Date: 2026-06-23

## Promotion Gate Snapshot

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Codex authored this draft and `evals/prd-043.evals.mjs` as RED implementation tests |
| Claude acceptance | accepted | Claude counter-reviewed and implemented the v1 cut-list; Codex A1 review approved |
| Maintainer acceptance | accepted | Maintainer arbitrates disputed boundary lines only |
| Eligible for move to `docs/prds` | yes | promoted to `docs/prds`; implementation done per PRD_STATUS |

## Problem

Turnfile has a useful protocol corpus, but v1 cannot require a fresh adopter to read the full PRD inception archive. The current working system is stronger than the adoption surface: many accepted PRDs encode real lessons, but the normative path is too broad, too historically entangled, and too easy to satisfy only because current participants already know the backstory.

The v1 lock needs a minimal governance profile that is readable from the current public/spec surface, testable from a fresh fixture, and explicit about what is core v1 versus optional profile or historical archive.

## Goal

Define and implement a Turnfile v1 Minimal Governance Profile that a fresh adopter can validate without reading `PRD-001` through `PRD-042`.

The profile must preserve:

1. Thin governance layer, not runtime orchestration.
2. Plain files as source of truth.
3. Maintainer authority over high-impact resolution.
4. First-class peer disagreement and counter-recommendations.
5. Evidence-backed closeout.
6. Verifier-anywhere conformance with no Turnfile service.

## Non-goals

1. Rewriting every historical PRD.
2. Making Tokenese, heartbeat automation, local-model onboarding, or terminal transport part of required v1 conformance.
3. Creating a hosted service, daemon, central registry, account system, or runtime scheduler.
4. Replacing the current active working-session protocol before the v1 profile validates as a reference implementation.
5. Publishing `turnfile.work` before the v1 core validates locally.

## A1 Roles

1. Codex authors this PRD, the proposed v1 cut-list, and RED evals.
2. Claude counter-reviews the cut-list before implementation.
3. Maintainer arbitrates only disputed boundary lines.
4. Claude implements the accepted PRD/evals.
5. Codex reviews implementation against the PRD and evals.

This keeps author/eval-author separated from implementer while preserving a disagreement window before the evals become the implementation target.

## Proposed V1 Cut-list

### Core v1

Core v1 requirements are required for the Minimal Governance Profile.

1. `SPEC.md` as the normative v1 contract.
2. `DEFINITIONS.md` for canonical vocabulary.
3. `CONFORMANCE.md` for verifier-anywhere claims.
4. `SECURITY.md` for explicit security non-claims.
5. `CHANGELOG.md` for material protocol changes.
6. Minimal session artifact set:
   - `TURNFILE.yaml`
   - `MAILBOX.md`
   - `WORKLOG.md`
   - validation path
7. Optional-but-recognized starter artifacts:
   - `MAILBOX.json`
   - `OPEN_QUESTIONS.md`
   - agent boot notes
   - archive files
8. Authority model:
   - higher platform/user/tool/security instructions
   - recorded Maintainer decisions
   - delegated approval bands
   - task ownership and locks
   - agent proposals, objections, recommendations
9. Message lifecycle sufficient to keep open work visible and terminal work out of active queues.
10. Apply-or-counter review envelope sufficient to preserve acceptance, amendment, counter, and block outcomes.
11. Maintainer decision record sufficient to explain accepted and rejected material alternatives.
12. Evidence references sufficient to reconstruct closeout state without duplicating secrets or large logs.
13. Fresh adopter starter template and v1 validator.

### Optional profiles

Optional profiles are real Turnfile work but not required for v1 minimal conformance.

1. Concurrent shard profile from PRD-031.
2. Boot simplification and session orientation profile from PRD-032 and PRD-037.
3. Heartbeat steward profile from PRD-030, PRD-038, and PRD-040.
4. Tokenese profile from PRD-027, PRD-028, and PRD-035.
5. Agent onboarding profile from PRD-015, PRD-039, and PRD-042.
6. Unified terminal transport profile from PRD-041.
7. Public-surface snapshot profile from PRD-034.
8. Skill-bundle ownership/integrity profile from PRD-012 and PRD-033.

### Participation tiers

The Minimal Governance Profile supports two participation tiers:

1. `v1-minimal`: a model or tool can participate through the file-based governance contract without requiring a skill bundle.
2. `v1-full`: a full Turnfile participant must also satisfy the skill-bundle integrity profile from PRD-012 and PRD-033.

This encodes the Maintainer decision that skills are core for full Turnfile participation while preserving lesser participation for models that cannot load skills.

### Historical or migration reference

Historical or migration references may remain in the archive, changelog, or migration guide, but must not be required reading for v1 adoption.

1. Superseded PRDs.
2. Session-specific implementation details.
3. Inception-session mailbox patterns.
4. Legacy skill-directory migration detail.
5. Tokenese pilot measurements.
6. Local-model relay evidence.

## Requirements

### R1. Minimal Governance Profile document

Create `docs/MINIMUM_VIABLE_TURNFILE.md`.

It must define the smallest conforming v1 session in less than 250 lines, including artifact set, roles, task/message/decision/evidence lifecycle, and closeout. It must include one worked session lifecycle example showing open, mid-turn, and close states. It must not require reading historical PRDs.

### R2. SPEC v1 consolidation

Update `SPEC.md` to `Version: v1.0.0` or equivalent v1 header. The spec must be self-contained for core v1 behavior. Historical PRDs may be referenced as provenance or optional profiles, but not as required reading for core conformance.

### R3. PRD shelf reconciliation

Add a machine-readable reconciliation artifact at `docs/prds/PRD_SHELF_RECONCILIATION.json`.

Each PRD from `PRD-001` through `PRD-043` must have:

1. `id`
2. `classification`: one of `core-v1`, `optional-profile`, `historical`, `deferred`, `superseded`, or `draft`
3. `v1_surface`: short human-readable reason
4. `required_for_minimal_profile`: boolean
5. `profile`: profile name or `null`

No PRD except this one may be left unclassified.

### R4. Starter template extraction

Create `templates/v1-minimal/` as the portable starter.

Required template files:

1. `templates/v1-minimal/README.md`
2. `templates/v1-minimal/working-session/TURNFILE.yaml`
3. `templates/v1-minimal/working-session/MAILBOX.md`
4. `templates/v1-minimal/working-session/WORKLOG.md`

The template must be valid without copying the active inception `working-session/` history.

### R5. V1 schema freeze

Create `schemas/v1/` for the minimal profile. The v1 schema must validate the starter `TURNFILE.yaml` and must not require optional-profile fields.

### R6. V1 conformance validator

Create `tools/validate-v1-profile.mjs`.

The validator must:

1. Accept `--root <path>`.
2. Validate the minimal template.
3. Fail when required artifacts are missing.
4. Fail when active mailbox state contradicts the inbox/open queue.
5. Fail when the minimal profile depends on historical PRD documents.
6. Print machine-readable JSON with `--format json`.
7. Avoid network access and hosted Turnfile dependencies.

The historical-PRD dependency scan must match `PRD-0(0[1-9]|[1-3][0-9]|4[0-2])` in `SPEC.md`, `docs/MINIMUM_VIABLE_TURNFILE.md`, and `templates/v1-minimal/**`, excluding explicit sections headed `Provenance` or `Optional profiles`. Failure output must include path, line, and matched PRD id.

### R7. Documentation split

Update `CONFORMANCE.md`, `README.md`, and `ROADMAP.md` so core v1, optional profiles, and historical material are visually distinct. Publication work may reference this split, but landing-page generation is not required for PRD-043 implementation.

### R8. Fresh-adopter test

A clean fixture that contains only the v1 starter template and public v1 docs must pass the v1 validator. It must not contain `docs/prds/PRD-001...PRD-042`.

### R9. Version-bump guardrail

The transition from `0.x.x` version to `1.0.0` affects `SPEC.md`, `schemas/v1/`, `turnfile.version` in `TURNFILE.yaml`, and `CHANGELOG.md`. No implementation may move those version strings to final v1 status until all of the following are true:

1. `tools/validate-v1-profile.mjs` is green.
2. At least two agents have approved the PRD-043 review chain.
3. The Maintainer has explicitly ratified the v1 release cutline.

### R10. Fresh-context conformance probe

After implementation, a fresh-context agent must read only `SPEC.md`, `DEFINITIONS.md`, `docs/MINIMUM_VIABLE_TURNFILE.md`, and `CONFORMANCE.md`, then correctly answer five core conformance questions. The probe result must be recorded as evidence before PRD-043 is marked implementation done.

### R11. Canonical landing page

Create or update the Turnfile public landing page as a Phase 2 PRD-043 deliverable. The landing page must surface the v1 Minimal Governance Profile, distinguish `v1-minimal` from `v1-full`, link the canonical v1 docs, and avoid requiring readers to traverse historical PRDs for core adoption.

R11 is intentionally phased after R1-R10 because it depends on canonical-spec-page and repo-polish work that is adjacent to, but not required for, local v1 conformance validation. R1-R10 may be marked done after their review and validation gates pass; R11 remains a separate PRD-043 blocker before promotion or public release.

## Acceptance Criteria

1. `node --test evals/prd-043.evals.mjs` passes.
2. `node tools/validate-v1-profile.mjs --root templates/v1-minimal --format json` exits 0 and reports `ok: true`.
3. Removing any required minimal artifact from a copied template causes the validator to exit non-zero with a clear machine-readable error.
4. Adding a required-reading dependency on `PRD-001` through `PRD-042` to the minimal profile causes the validator or eval suite to fail.
5. `docs/prds/PRD_SHELF_RECONCILIATION.json` classifies every PRD through PRD-043.
6. `SPEC.md` and `docs/MINIMUM_VIABLE_TURNFILE.md` are sufficient for a new adopter to explain the v1 core without reading historical PRDs.
7. Existing optional profiles remain preserved as optional, not deleted or dismissed.
8. Version-bump guardrails prevent final v1 version strings from landing without validator success, two-agent approval, and Maintainer ratification.
9. Fresh-context conformance probe evidence exists before implementation is marked done.
10. The v1 docs or reconciliation artifact distinguish `v1-minimal` from `v1-full`, with skill-bundle integrity required for full participation but not for lesser participation.
11. R11 landing-page work is tracked as a Phase 2 blocker for promotion/public release, not as a blocker for the R1-R10 local conformance done-flip.

## RED Eval Package

`evals/prd-043.evals.mjs` is intentionally RED until implementation.

Expected implementer tasks:

1. Create the v1 docs and starter template.
2. Create schema and validator support.
3. Classify the PRD shelf.
4. Update validation/conformance docs.
5. Make the fresh-adopter fixture pass without historical PRD leakage.
6. Add version-bump guardrails and fresh-context conformance probe evidence.

## Open Questions

1. OQ-043-1: Should skill-bundle integrity be core v1 or an optional profile? **Resolved by Maintainer 2026-06-23:** skills are a core requirement of full Turnfile participation, but models without skill capability may still participate at a lesser level. Codex applies this as a `v1-minimal` versus `v1-full` tier split: skill-bundle integrity is required for full participation and not required for lesser minimal participation.
2. OQ-043-2: Should PRD-031 concurrent shards be required for v1? Codex proposes optional profile for v1.1 because minimal adoption must work with the current three-file session set. **Maintainer says: optional**
3. OQ-043-3: Should `MAILBOX.json` be required? **Resolved by Maintainer 2026-06-23:** `MAILBOX.md` is required and must remain English-legible; `MAILBOX.json` is not required and may be used by optional Tokenese/profile tooling.
4. OQ-043-4: Should the public landing page be part of this PRD? **Resolved by Maintainer 2026-06-23:** yes. Codex applies this as R11, a Phase 2 landing-page deliverable that blocks promotion/public release but does not block the R1-R10 local conformance done-flip.

## Deferred Follow-up Candidates

1. Gemini orphan-close pattern: define a Maintainer-relayed forced-close or stale-agent reconciliation path after Gemini self-reconciles session 28.
2. `handshake-sign` UX: add direct CLI flags for common payload fields while preserving JSON payload support.
3. Selective-unlock classes: OQ-069 resolved 2026-06-23. Agents may edit their own files under a selective unlock with an inform-and-confirm line to the Maintainer. Editing another LLM's files remains disallowed unless explicitly authorized.

## Counter Application Log

- 2026-06-23: Claude counter-review `MSG-20260623-013` applied. C1 added the required worked session lifecycle example to R1. C2 made the historical-PRD dependency scan precise. C3 added R9 version-bump guardrails. C4 added R10 fresh-context conformance probe. D1-D3 recorded as deferred follow-up candidates.
- 2026-06-23: Maintainer resolved OQ-069 for D3. Self-owned file edits are selectively unlockable with an inform-and-confirm line to the Maintainer; another LLM's files remain off-limits without explicit authorization.
- 2026-06-23: Claude `MSG-20260623-017` Maintainer-encoding request applied by Codex. OQ-043-1 is encoded as `v1-minimal` versus `v1-full`; OQ-043-3 keeps English `MAILBOX.md` required and `MAILBOX.json` optional; OQ-043-4 adds R11 canonical landing page as a Phase 2 deliverable.

## Implementation Notes

The implementation should preserve existing active-session files and should not rewrite historical PRDs in place unless required for explicit classification metadata. Prefer adding `PRD_SHELF_RECONCILIATION.json`, v1 docs, schemas, templates, and validators over editing every promoted PRD.
