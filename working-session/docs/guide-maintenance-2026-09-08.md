# September 8 guide maintenance

Date: 2026-09-08. Scope: repository-local documentation and validation maintenance under Sam's continuing local-commit authorization. Base commit: `38fab250056fb46301118793bdd333b7bde5b04f`, branch `codex/fix-prd047-ci`. The named Codex lane is `codex-guide-maintenance-20260908`; it does not change Turnfile protocol v1.0.0.

## Delivered candidate

The public guide now gives consistent v1.0.0 wording, an explicit repository and representation-only task scope, compact verification, and ASCII-safe content. It remains an undeclared-profile guide, assessed at Level 2 by `guidecheck-reference-local 0.7.1`; this is not a migration to corrected profile 2.0.0. Both guide copies match at 3,712 bytes, SHA-256 `92e21bedb5922e79d6192d8a883d84e7632bb09220a7c00a5bf1ebb9182802c5`.

Both legacy sidecars match and record the actual guide hash, bytes and date. They establish same-repository integrity, not independent Level 4 provenance. Historical PRD/agent markers and participation claims are preserved. No executable task or additional protocol obligation was invented to raise conformance.

The existing public-surface validator and PRD-034 evals now check guide/manifest parity, exact metadata, dates, byte limits, ASCII, compact verification and a single version claim matching SPEC. Regressions include malformed and empty duplicate metadata, missing scope/repository, contradictory versions and mismatched dates. CONTRIBUTING separates live-target diagnostics, evaluator and target identities, persisted API receipts, and post-deployment acceptance.

## Validation and review

- Native GuideCheck: Level 2, zero blockers or warnings, exit 0.
- Focused PRD-034: 10 of 10 tests passed, including negative fixture mutations through the production validator.
- Required `npm run validate`: passed, including 27 general evals.
- Required `npm run evals:prd`: 335 of 335 passed.
- Ownership and startup checks: passed; peer-owned and maintainer-owned files preserved.
- Same-family delegated code review was inspected and adopted by Codex. This is one OpenAI-family voice and does not establish independent protocol quorum or another family's participation.

Earlier native attempts returned Level 0 despite zero findings because the legacy verifier requires recognized repository and task-scope fields. Those failed attempts are retained in the dated rollout packet. The achieved level and process exit, rather than absence of findings alone, govern acceptance.

## Diagnostic and delivery boundary

A single direct local Siteline scan of the then-live `https://turnfile.work/` pages used pushed candidate `7bb24a6`, scanner 2.1.0/rubric 2.4.0, with external panels disabled. It returned C/77, raw score 100, all nine SNAP checks passing, exit 0 and empty stderr. No new target defect was identified. Applicability-dependent enablement scoring does not justify adding runtime/API/MCP surfaces to the stable file protocol.

The scan did not persist a result, evaluate the pending guide, prove its deployment, or accept production. Local signed delivery is authorized. Push, merge, publication and deployed-byte acceptance were pending when this record was written; see Delivery below.

## Coordination closeout

Opening used PRD-010 lease revisions 485-486; closeout uses 487-488. The current WORKLOG, acknowledgment and own boot/chat pointers record the lane. Codex closes idle with current task/session cleared, zero unread messages, no owned actionable mailbox cards and no remaining locks. No heartbeat was created by this lane. Existing peer state, old records, optional profiles and separate signing/collaboration handoffs remain preserved. Historical compaction is deferred to the normal session-history owner; no new open implementation item is hidden by that deferral.

This document is the durable repository record. The temporary guide handoff retains only pending delivery. Exact raw command receipts, candidate hashes, delegated review and signed-commit readback are retained in the dated `/Users/snap/Git/_repo-standards-delivery-2026-09-08/resumed/turnfile/` packet; repository validators do not depend on that external path or LocalBrain.

## Delivery

- Published through PR #5, merged to `main` as `ebb4718` on 2026-09-22 after rebasing the guide-contract repair onto current `main`. Deployed-byte acceptance was verified that day against the live site: 3,712 bytes with the served hash matching the manifest (WORKLOG, Claude repo-baseline maintenance lane, rev 489).
- The guide was later refreshed in PR #9 (`95c6f2b`, 2026-09-23). On 2026-09-24 the live `https://turnfile.work/.well-known/assistant-guide.txt` was 3,729 bytes with SHA-256 `a8b9ad784eb8c8d00cea1fafb9fb215db38a4d6272e7669d8c13c7ada1ea2cc6`, matching the live manifest, and `validate-public-surface-snapshot.mjs` passed the guide contract.
- Not performed: a persisted live Siteline assessment of the deployed guide under CONTRIBUTING. The 2026-09-08 diagnostic above remains the latest Siteline evidence.
- The temporary publication handoff (`handoffs/2026-09-07-repo-standards-next-actions.md`, untracked) was disposed on 2026-09-23 by Maintainer direction after this section was written.
