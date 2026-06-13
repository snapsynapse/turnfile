# PRD-028: Tokenese Dual-Artifact Sync and Maintainer Legibility Contract

Status: Draft v2 (working-session; Codex-authored, Claude accepted-with-amendment applied, Maintainer acceptance pending)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (Claude MSG-20260613-033 counters + MSG-20260613-034/035 peer input applied)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | author of draft v1; applied Claude counters and peer input in draft v2 |
| Claude acceptance | accepted-with-amendment | MSG-20260613-033 APPLY with 3 counters; counters applied in draft v2 |
| Maintainer acceptance | accepted | Maintainer requested PRD-028 on 2026-06-13 after reaffirming peer-only authority, own-file write boundaries, and maintainer-legible decisions |
| Eligible for move to `docs/prds` | no | blocked until Maintainer acceptance, implementation evals, implementation review, and zero blockers in PRD_STATUS.json |

## Input Provenance Tags

1. `explicit`: Maintainer reaffirmed on 2026-06-13 that no LLM can direct or order another LLM or the Maintainer; agents may only request and propose.
2. `explicit`: Maintainer reaffirmed on 2026-06-13 that each LLM can only edit its own files and shared governance files through protocol; peer files are readable but not writable.
3. `explicit`: Maintainer reaffirmed on 2026-06-13 that every decision must remain legible and traceable by the Maintainer.
4. `explicit`: Maintainer stated that as Tokenese is introduced, Turnfile will maintain both English and Tokenese versions of all Turnfile artifacts going forward, in sync and legible to humans.
5. `derived`: PRD-024 requires legible governance records and projection of protocol-relevant dense content.
6. `derived`: PRD-027 defines Tokenese as a cloned A/B layer, not a replacement for existing Turnfile communications.
7. `derived`: PRD-006 A1 requires evals and implementation review before PRDs are filed done.
8. `derived`: `working-session/MAILBOX.json` is an existing parallel projection of `working-session/MAILBOX.md`, regenerated in the same transaction and validated for source/projection consistency.
9. `peer-input`: Claude MSG-20260613-033/034/035 proposed profile-table hooks, sync tiers, shared-artifact twin obligations, sidecar naming, recursive-twin guards, round-trip verification, archive handling, Maintainer-edit handling, `tokenese-ahead` promotion semantics, third-agent English-only conformance, TURNFILE exception surfacing, and REV-token pair IDs.

## Alignment Reference

This PRD aligns with:

1. `docs/prds/PRD-003-message-lifecycle-sla-contract.md`
2. `docs/prds/PRD-004-maintainer-decision-contract.md`
3. `docs/prds/PRD-006-session-promotion-pipeline.md`
4. `docs/prds/PRD-010-shared-file-transaction-locking.md`
5. `docs/prds/PRD-012-protocol-skills-codex-claude.md`
6. `docs/prds/PRD-013-turnfile-coordination-format.md`
7. `docs/prds/PRD-014-session-closeout-boot-handoff-contract.md`
8. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`
9. `docs/prds/PRD-022-decision-mirror-delivery-contract.md`
10. `docs/prds/PRD-024-human-legibility-invariant-and-encoding-profiles-contract.md`
11. `working-session/docs/PRD-027-tokenese-cloned-communication-ab-contract.md`

## Problem

PRD-027 can safely define Tokenese as a cloned communication layer, but Turnfile does not yet have the artifact architecture needed to run that layer.

Turnfile already has one proven parallel-projection pattern: `MAILBOX.json` is a machine-readable projection of `MAILBOX.md`, regenerated in the same transaction as mailbox source edits and checked by validator. Tokenese paired artifacts generalize that pattern from a machine projection into a bilingual communication layer, with stricter authority and human-legibility constraints.

Without a dual-artifact contract:

1. English and Tokenese copies could drift without detection.
2. Maintainer-legible governance could depend on manual projection discipline alone.
3. Agents could treat Tokenese text as authoritative even when the English governance artifact says otherwise.
4. Peer request/proposal semantics could be compressed away into imperative or command-like dense exchanges.
5. File ownership boundaries could blur if one agent edits another agent's Tokenese copy for convenience.
6. PRD-027 could initiate before the repository can validate paired artifacts, sync state, and divergence handling.

## Goal

1. Define the required English + Tokenese artifact pairing model before Tokenese is initiated.
2. Preserve peer-only authority: agents request and propose; they do not direct or order each other or the Maintainer.
3. Preserve own-file write boundaries and shared-file lock discipline.
4. Guarantee that Maintainer-legible English remains present, authoritative, and traceable for every protocol decision.
5. Define sync, divergence, and validation rules for paired English and Tokenese artifacts.
6. Make this PRD a prerequisite for PRD-027 initiation.

## Non-goals

1. Defining Tokenese vocabulary, grammar, tokenizer rules, or conformance levels.
2. Replacing any existing Turnfile artifact with Tokenese.
3. Permitting Tokenese-only governance records.
4. Allowing agents to edit peer-owned files.
5. Deciding the exact repository layout for every future Tokenese artifact beyond the minimum contract needed for safe initiation.
6. Requiring any agent or Maintainer to understand Tokenese before participating fully in Turnfile.

## Requirements

## R1. PRD-027 prerequisite gate

PRD-027 may not be initiated until PRD-028 is:

1. Accepted by Codex, Claude, and Maintainer.
2. Implemented under the PRD-006 A1 eight-step loop.
3. Covered by evals that verify pairing, sync metadata, authority, peer-request semantics, and maintainer-legible projection.
4. Marked implementation `done` in `working-session/docs/PRD_STATUS.json`.
5. Reflected in PRD-027 blocking items as a satisfied prerequisite.

PRD-027 may remain drafted and reviewed, but no live Tokenese lane, clone exchange, or teach-phase Tokenese production starts before this gate is satisfied.

## R2. Dual-artifact model

Each Tokenese-enabled Turnfile artifact has an English artifact and a Tokenese paired artifact.

1. The English artifact is the maintainer-legible control and authority.
2. The Tokenese artifact is a clone, projection, or operational aid paired to the English artifact.
3. This model inherits from the existing `MAILBOX.md` plus `MAILBOX.json` projection discipline: the source remains legible, the projection is generated or updated in a controlled transaction, and drift is validator-visible.
4. Pilot Tokenese twins default to sidecar files beside the English artifact using `<name>.tk.md`, unless implementation review finds a stronger layout before PRD-027 initiation.
5. Every pair must carry stable pairing metadata:
   - `pair_id`
   - English source path or message ID
   - Tokenese clone path or message ID
   - source revision or content hash
   - clone revision or content hash
   - sync state
   - last sync actor
   - last sync evidence
6. `pair_id` should reuse the existing revision-token style where practical, such as `REV-YYYYMMDD-topic-seq-hash`, instead of inventing a new namespace.
7. Pairing metadata must be readable without Tokenese tooling.
8. A Tokenese artifact without a paired English source is invalid.
9. Pair metadata, sync-issue records, and sync-state registries are the meta-layer for the dual corpus. They remain English-only and are not themselves recursively paired.

## R3. Authority and divergence

1. English governs. If English and Tokenese differ, English is authoritative unless the Maintainer explicitly decides otherwise in English.
2. Divergence is not silently repaired. It is recorded as a sync issue with:
   - pair ID
   - affected artifacts
   - observed difference
   - proposed repair
   - owner of the repair request
3. Divergence handling distinguishes mistranslation from unprojected insight. Mistranslation is corrected against English; protocol-relevant Tokenese-only insight is promoted into English before it can govern.
4. Tokenese divergence cannot create or close tasks, change acceptance state, acquire or release locks, or record approval.
5. Tokenese may help detect or summarize state, but English artifacts carry final governance state.

## R4. Peer-only authority semantics

Tokenese exchanges must preserve the same peer relationship as English Turnfile exchanges.

1. Agents may request, propose, accept, counter, acknowledge, block, or decline.
2. Agents may not command, order, assign authority to themselves over peers, or require peer compliance outside Maintainer-approved protocol rules.
3. Tokenese syntax must not collapse request/proposal into imperative command unless the English projection explicitly preserves the non-command semantics.
4. Any ambiguity between request and command is interpreted as request.
5. Maintainer instructions remain Maintainer instructions only when recorded in English with the PRD-004 blockquote relay pattern or direct Maintainer action.

## R5. File ownership and write boundaries

1. Agents may read peer-owned English and Tokenese files.
2. Agents may not write peer-owned English or Tokenese files.
3. Agent-owned Tokenese files follow the same ownership rule as agent-owned English files.
4. Shared governance artifacts remain shared-file transactions subject to Turnfile locks, revision updates, mailbox lifecycle, and validation.
5. If a Tokenese clone is required for a peer-owned artifact, the requesting agent asks the owner to produce or update it rather than editing it directly.
6. For shared English artifacts, the mutating agent owes the paired Tokenese update or an `english-ahead` state declaration in the same lock window.
7. Maintainer-authored English edits never create a Maintainer obligation to write Tokenese. They automatically set affected pairs to `english-ahead`; the artifact owner, or the next mutating agent for shared artifacts, handles catch-up under protocol.

## R6. Maintainer legibility

Every protocol-relevant Tokenese artifact or exchange has a human-legible English projection.

1. The Maintainer can inspect the current English state and reconstruct the work process without knowing Tokenese.
2. Tokenese content never becomes the only record of a decision, objection, task claim, lock action, acceptance, rejection, or closure.
3. Session summaries and checkpoint discussions cite English artifacts first.
4. Dense Tokenese fragments in governance artifacts follow PRD-024 R3.2: labeled, fenced, and immediately paraphrased.
5. Maintainer projection demands have P1 priority and block Tokenese continuation for the affected pair until satisfied.
6. Tokenese competence is never a participation requirement. A third agent that can only read and write English remains fully conformant.

## R7. Sync states

Each pair has exactly one sync state:

| State | Meaning |
|-------|---------|
| `not-tokenized` | English exists; no Tokenese clone expected yet |
| `paired` | English and Tokenese pair exists and metadata is complete |
| `in-sync` | Pair is current according to validator checks |
| `english-ahead` | English changed and Tokenese clone has not caught up |
| `tokenese-ahead` | Tokenese clone contains content not projected to English |
| `diverged` | Pair conflicts materially |
| `suspended` | Maintainer or protocol suspended Tokenese for the pair |

`tokenese-ahead` and `diverged` are blocking states for any protocol-relevant use of the Tokenese artifact.

## R8. Sync trigger tiers

Tokenese pairs use tiered sync obligations.

1. Governance artifacts use same-transaction sync, matching the `MAILBOX.md` plus `MAILBOX.json` discipline.
2. Low-churn non-governance docs may use turn-end sync if the pair metadata records the temporary `english-ahead` state.
3. Active artifacts carry live twins once they are in Tokenese scope.
4. Archive files receive Tokenese twins at archival time and are archived together. They are not retroactively tokenized unless the Maintainer requests that work.
5. `TURNFILE.yaml` should surface only non-`in-sync` active pairs to avoid bloat while keeping divergence boot-visible.

## R9. PRD-024 profile-table amendment hook

On acceptance, PRD-024 R2 gains a Band C profile-table amendment row for Tokenese paired artifacts:

| Artifact class | Encoding profile | Rule |
|----------------|------------------|------|
| Tokenese paired artifacts | Dense permitted | Always paired to a legible English source per PRD-028 R2; never authoritative; protocol-relevant dense content must project to English before governing. |

This row is part of PRD-028 implementation and must be represented in the implementation evals.

## R10. Scope and rollout

The rollout is phased but the end-state commitment is not optional.

1. PRD-028 defines architecture and contracts now.
2. PRD-027 may later pilot pairs on a bounded set of active artifacts for A/B measurement.
3. The committed end state is English and Tokenese versions of all Turnfile artifacts going forward, kept in sync and legible to humans.
4. Binding layout, cost parameters, and scaling thresholds are calibrated after PRD-027 A/B data exists.

## R11. Validation requirements

The implementation must add or register validators that detect:

1. Missing paired English source for a Tokenese artifact.
2. Missing Tokenese clone where a pair is marked required.
3. Missing or malformed pairing metadata.
4. Tokenese-only decision or task state.
5. `tokenese-ahead` or `diverged` pair used as if authoritative.
6. Governance artifact dense fragments without immediate paraphrase.
7. Peer-owned file modification attempt when detectable from known paths or ownership metadata.
8. PRD-027 initiation while PRD-028 is not implementation `done`.
9. Missing PRD-024 profile-table amendment row for Tokenese paired artifacts.
10. Semantic mistranslation through round-trip verification: regenerate English from the Tokenese twin alone and compare to the English source.

Under PRD-006 A1, Codex authors `evals/prd-028.evals.mjs`, Claude implements PRD-028, and Codex reviews implementation before filing done.

## R12. Session and checkpoint behavior

1. Session charter declares whether Tokenese is disabled, proposed, pilot-only, or active.
2. Session closeout lists Tokenese pair sync state for every active pair.
3. A session cannot close cleanly with unresolved `tokenese-ahead` or `diverged` protocol-relevant pairs unless the Maintainer records an explicit deferral.
4. Before PRD-027 initiation, the commit/push/checkpoint discussion must include PRD-028 validation results and any known sync risks.

## Acceptance Criteria

1. PRD-028 is listed in `working-session/docs/PRD_STATUS.json`.
2. PRD-027 has a blocking item naming PRD-028 as a prerequisite for initiation.
3. A validator or registered eval checks that PRD-027 cannot initiate while PRD-028 implementation is not `done`.
4. Pair metadata fields and sync states are documented in this PRD or a referenced template.
5. Peer-only authority semantics are explicitly preserved for Tokenese exchanges.
6. Own-file write boundaries are explicitly preserved for English and Tokenese files.
7. English authority and Maintainer legibility are explicit.
8. A session-close or checkpoint rule records pair sync state.
9. Evals cover missing pair, stale/diverged pair, Tokenese-only decision, and PRD-027 prerequisite enforcement.
10. PRD-024 R2 has an explicit Tokenese paired artifact profile row.
11. `evals/prd-028.evals.mjs` starts red before implementation and encodes pairing, authority, authorship, sync, PRD-024, and PRD-027 prerequisite gates.

## Risks

1. Dual artifacts may add operational overhead.
   Mitigation: PRD-027 remains A/B, and PRD-028 validators should measure rather than hide the overhead.
2. Tokenese clones may lag English artifacts.
   Mitigation: English remains authoritative; lag is visible as `english-ahead`.
3. Agents may overfit to validator checks while preserving ambiguous dense semantics.
   Mitigation: peer-only request semantics and Maintainer projection rights remain substantive requirements.
4. Pair metadata could become noisy.
   Mitigation: metadata is minimal and machine-checkable.
5. Recursive pairing of sync metadata could create infinite governance overhead.
   Mitigation: the meta-layer remains English-only.
6. Hash checks could miss semantic mistranslation.
   Mitigation: round-trip verification catches semantic loss in addition to stale content.

## Open Questions

| OQ | Question | Proposed resolution | Applies to |
|----|----------|---------------------|------------|
| OQ-066 | Should paired Tokenese artifacts live beside English artifacts, under a parallel `tokenese/` tree, or in metadata sidecars? | Use sidecar files (`<name>.tk.md`) as pilot default; final layout remains subject to implementation review and PRD-027 A/B data. | R2, R8 | **approved by maintainer**
| OQ-067 | Should all Turnfile artifacts eventually require Tokenese pairs, or only Tokenese-active artifacts? | Resolved in draft v2: pilot-scope pairs first, with all-going-forward Turnfile artifacts as the committed end state once PRD-027 A/B data sets rollout and cost parameters. | R2, R10 | **approved by maintainer**
