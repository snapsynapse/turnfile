# PRD-034: Public and Agent-Facing Surface Snapshot Reconciliation Contract

Status: Accepted; implementation pending
Owner: Codex proposer; Claude reviewed APPLY with counters; Maintainer accepted
Date: 2026-06-17
Last revised: 2026-06-17

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | Drafted by Codex after Maintainer requested a detection-only repo audit; applied Claude counters C1-C4 in session 19 |
| Claude acceptance | accepted-with-amendment | MSG-20260617-031: APPLY with counters C1-C4 |
| Maintainer acceptance | accepted | thank you |
| Eligible for move to `docs/prds` | yes | all acceptances complete; promotion move still pending |

## Input Provenance Tags

1. `explicit`: Maintainer requested a code audit looking for gaps, overlaps, and conflicts in documentation, canonical webpage, and agent-facing surfaces, with PRDs drafted for next-session action only.
2. `observed`: `working-session/docs/PRD_STATUS.json` reports 32 registry-tracked PRDs and 29 promoted PRDs after PRD-032 and PRD-033 moved to `docs/prds/`.
3. `observed`: `README.md`, `docs/index.html`, `docs/llms.txt`, `assistant-guide.txt`, `BASELINE.md`, and `CHANGELOG.md` still contain session-16 / 27-promoted-PRD / PRD-032-and-033-draft claims.
4. `observed`: `README.md` still describes `skills/claude/SKILL.md` as v0.6.0 bundle 9 and Codex as v2, while the live manifests report Claude bundle 13 and Codex bundle 9.
5. `observed`: The GuideCheck root and served `.well-known` assistant-guide pair is byte-identical and hash-aligned; the issue is freshness and claim coverage, not integrity of the copied files.

## Problem

Turnfile has no single freshness gate for public, canonical webpage, and agent-facing claims. After session 17, the authoritative registry and working-session state advanced, but several surfaces still describe the older session-16 baseline:

1. `docs/index.html` meta descriptions, hero byline, PRD shelf snippet, and inception/current-baseline section say session 16 and 27 promoted PRDs.
2. `README.md` lists PRD-032 and PRD-033 as draft/pending even though both are promoted and implementation-done.
3. `docs/llms.txt` and `assistant-guide.txt` still advertise 27 promoted PRDs.
4. `BASELINE.md` is intentionally a point-in-time snapshot, but the quick-start flow points readers at it without a current-state handoff to the newer registry.
5. `CHANGELOG.md` Unreleased/0.3.0 entries still say PRD-032/033 are drafts under review.
6. Skill bundle versions in public docs are stale relative to live manifests.

The result is a credibility and adoption gap: humans and agents reading different canonical surfaces receive incompatible current-state claims.

## Goal

1. Define a release-time snapshot reconciliation contract for Turnfile public and agent-facing surfaces.
2. Make PRD counts, promoted shelf state, implementation status, skill bundle versions, and current session baseline derive from authoritative sources.
3. Prevent `docs/index.html`, README, `llms.txt`, assistant guide, changelog, and release checklist claims from drifting silently.
4. Preserve point-in-time documents such as `BASELINE.md` while making their snapshot status obvious to cold-start readers and agents.

## Non-goals

1. Updating the public surfaces in this PRD draft turn.
2. Changing Turnfile protocol semantics.
3. Replacing `PRD_STATUS.json` as the source of truth for PRD shelf state.
4. Requiring every historical archive to be rewritten when current state changes.
5. Asserting live deployed website state without a deployment verification step.

## Requirements

## R1. Surface inventory

The implementation must maintain an explicit inventory of current-state-bearing surfaces:

1. `README.md`.
2. `docs/index.html`.
3. `docs/llms.txt`.
4. `assistant-guide.txt`.
5. `docs/.well-known/assistant-guide.txt`.
6. `assistant-guide-manifest.txt`.
7. `docs/.well-known/assistant-guide-manifest.txt`.
8. `CHANGELOG.md`.
9. `BASELINE.md` and any other document that is intentionally a snapshot.
10. Skill bundle tables or references in public docs.
11. `docs/sitemap.xml` when public modified dates change.
12. `RELEASE_CHECKLIST.md`.

## R2. Source-of-truth mapping

The implementation must define which file owns each claim class:

1. PRD total, shelf, and promoted counts derive from `working-session/docs/PRD_STATUS.json`.
2. PRD promoted list derives only from `working-session/docs/PRD_STATUS.json`; `working-session/docs/README.md` is a derived index surface and must never be treated as a source of truth.
3. Skill bundle versions derive from `skills/<agent>/MANIFEST.yaml`.
4. Protocol version derives from `SPEC.md` and `working-session/TURNFILE.yaml`.
5. Tokenese status claims derive from the latest verified Tokenese observation recorded under PRD-035 or its successor.
6. Snapshot dates must state whether they are current release dates or historical baseline dates.

## R3. Snapshot status labels

Point-in-time documents must be labeled so agents do not treat stale snapshots as current state.

1. `BASELINE.md` may remain a session-14 snapshot, but README and agent-facing guides must tell readers to use `PRD_STATUS.json` and `WORKLOG.md` for current state.
2. If a public page cites a "current baseline", it must match the latest release snapshot or avoid the word current.
3. Historical archives may keep original claims, but public entry points must not expose them as live facts.

## R4. Public webpage reconciliation

`docs/index.html` must be reconciled in all current-state locations:

1. Meta description.
2. OpenGraph description.
3. Twitter description.
4. Hero byline/status.
5. Hero hook.
6. PRD shelf snippet.
7. "See it in action" current baseline paragraph.
8. Structured data if it carries stale counts.
9. Last substantive revision text.

Before changing any public webpage output, the implementation must determine whether the target file is generated by inspecting build commands, generator inputs, templates, and references to the target path. Generated surfaces must be repaired at the generator or template source, rebuilt, and committed with source-plus-output changes together. If no generator exists, the implementation must record that direct-file editing is the source edit for that surface.

## R5. Agent-facing guide reconciliation

Agent-facing surfaces must be reconciled or explicitly scoped:

1. `assistant-guide.txt` and served `.well-known` copy must remain byte-identical.
2. The sidecar manifests must match the guide hash and byte count.
3. `docs/llms.txt` must match current PRD counts and public summary claims.
4. Any GuideCheck level claim must be verified from the relevant guide manifest, external anchor status, and the PRD-035 Tokenese observation before being advertised.
5. Agent-facing guidance must not imply Tokenese is adopted as a default. PRD-035 owns recording the upstream Tokenese observation and documentation conflict; PRD-034 owns enforcing what Turnfile public and agent-facing surfaces may claim from that observation.
6. Served `.well-known` outputs, `docs/llms.txt`, sitemap entries, and other generated agent-facing outputs must follow the same generator/template inspection and rebuild discipline as R4.

## R6. Validator

Add a read-only validator, tentatively `tools/validate-public-surface-snapshot.mjs`, that fails when freshness-sensitive claims drift.

Minimum checks:

1. PRD promoted count claim markers in `README.md`, `docs/index.html`, `docs/llms.txt`, and `assistant-guide.txt` match the registry.
2. PRD-032 and PRD-033 are not described as draft/pending in public current-state sections.
3. Skill bundle versions in public docs match live manifests.
4. `assistant-guide.txt` and `.well-known/assistant-guide.txt` are byte-identical.
5. Assistant-guide manifest hashes match the current guide.
6. The validator distinguishes historical archive hits from current public-surface failures.
7. Machine-readable freshness markers are present on current-state public surfaces before prose checks are trusted. Examples include an HTML comment such as `<!-- turnfile:prd-promoted=29 -->` in `docs/index.html` and a structured line such as `turnfile:prd-promoted=29` in `docs/llms.txt` or `assistant-guide.txt`.
8. The validator treats prose regex checks as secondary diagnostics only. Registry comparisons must use structured claim markers where a marker exists.

## R7. Release gate

`npm run validate` or a documented release command must include the public-surface validator before publish/deploy. The release checklist must name this gate.

## Acceptance Criteria

1. A public-surface validator exists and fails against a fixture with stale PRD counts.
2. The validator can distinguish current public pages from historical archives.
3. README, `docs/index.html`, `docs/llms.txt`, and assistant-guide current claims match `PRD_STATUS.json`.
4. Skill version claims in public docs match live manifests.
5. Assistant-guide root and served copies remain byte-identical and manifest hashes match.
6. `BASELINE.md` is either refreshed or clearly labeled as a historical snapshot from session 14 with a current-state pointer.
7. `npm run validate` or a release validation command includes the new gate.
8. Current-state public and agent-facing surfaces include machine-readable freshness markers, and the validator compares those markers against `PRD_STATUS.json`.
9. Implementation evidence identifies which target surfaces are generated, which templates or generators were edited, and which rebuilt outputs were committed.
10. Public GuideCheck and Tokenese adoption claims are derived from PRD-035 observation output and are enforced here without PRD-034 redefining Tokenese upstream facts.

## Risks

1. Overfitting the validator to exact prose.
   Mitigation: validate structured claim markers first and keep constrained regexes as diagnostics rather than authority.
2. Historical archives could create false positives.
   Mitigation: R6.6 requires archive exclusion or historical-context detection.
3. Release friction.
   Mitigation: the validator checks only freshness-sensitive claims, not every sentence.
4. Hand-editing generated files could hide the real source of drift.
   Mitigation: require generator/template discovery before edits and commit source-plus-output changes together.

## Dependencies

1. PRD-006 session promotion pipeline.
2. PRD-017 boot/documentation contract.
3. PRD-024 human-legibility invariant.
4. PRD-032 session orientation tool.
5. PRD-033 ownership guard for safe implementation.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `README.md` | Current PRD and skill claims become validator-governed |
| `docs/index.html` | Canonical public page gains release-snapshot consistency requirements |
| `docs/llms.txt` | Machine-facing summary becomes freshness-gated |
| `assistant-guide.txt` | Agent-facing guide remains hash-paired and must avoid stale current claims |
| `BASELINE.md` | Preserved as historical unless explicitly refreshed |
| `RELEASE_CHECKLIST.md` | Gains public-surface snapshot gate |
| `docs/prds/PRD-035-tokenese-integration-and-upstream-result-sync-contract.md` | Owns Tokenese upstream observations and conflicts that PRD-034 may expose or suppress on public surfaces |

## Milestones

1. M0: Draft PRD.
2. M1: Claude review and Maintainer acceptance decision.
3. M2: Author eval fixtures for stale-count, stale-status, and archive-exclusion cases.
4. M3: Implement validator.
5. M4: Reconcile public and agent-facing surfaces.
6. M5: Add release gate and close with evidence.

## Open questions

*No open questions at this time.*
