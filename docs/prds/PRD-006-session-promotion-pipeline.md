# PRD-006: Session Promotion Pipeline

Status: Draft (inception)
Owner: Claude (draft) + Codex (review) + Maintainer
Date: 2026-02-08

## Problem

The Turnfile protocol distinguishes three artifact tiers, each with different visibility and governance rules:

1. **`working-session/`** — local-only working directory. Gitignored. Contains active session files (mailbox, worklog, PRDs, chat logs). Not published. Ephemeral by design.
2. **`docs/` + `templates/`** — canonical, tracked, published. The protocol specification. Changes require maintainer approval.
3. **`examples/`** — historical reference. Tracked and published. Contains complete session artifacts from past engagements for onboarding and pattern reference.

The problem: there is no governed process for moving artifacts between tiers. The maintainer established the tier boundaries (Session 0 decision) but the protocol does not define:

1. **When** an inception artifact is ready to graduate — what "validated through live usage" means concretely.
2. **How** graduation happens — who initiates, who approves, what transformations are required (renaming, redacting, restructuring).
3. **Where** artifacts land — which inception files become canonical protocol additions vs. historical examples vs. discarded working notes.
4. **What happens to the source** — does the inception workspace reset, archive, or persist after promotion?

Without a pipeline, the team repeatedly defers promotion ("promote to canonical docs if stable") without a trigger condition, and inception files accumulate indefinitely as undifferentiated local artifacts.

## Goal

Define a lightweight, governed promotion pipeline that:

1. Specifies concrete readiness criteria for each promotion path.
2. Defines the transformation steps required to move an artifact from inception to its target tier.
3. Assigns clear roles (who proposes, who reviews, who approves, who executes).
4. Handles the common case (inception PRD → canonical docs) and the archival case (inception session → examples).
5. Is simple enough that a single agent can execute a promotion in one session turn with maintainer approval.

## Non-goals

1. Automated promotion tooling (agents are stateless; this is a governance process, not a CI pipeline).
2. Demoting canonical docs back to inception (canonical docs are versioned via git, not via this pipeline).
3. Defining the canonical format itself (that's PRD-005's territory — data schema and compatibility).
4. Real-time synchronization between tiers (promotion is a discrete event, not a sync mechanism).

## Users

1. **Agents (Codex, Claude, future):** need clear criteria for when to propose promotion and what preparation is required.
2. **Maintainer:** needs confidence that promotion proposals are complete and ready for a single approve/reject decision.
3. **Future session participants:** need to find historical session artifacts in a predictable location with enough context to learn from them.
4. **External contributors:** need to understand the maturity level of any document they read in the repository.

## Definitions

| Term | Meaning |
|------|---------|
| **Artifact** | Any file produced during a session: PRD, protocol doc, mailbox, worklog, chat log, template, tool |
| **Promotion** | Moving an artifact from a lower tier to a higher tier with appropriate transformation |
| **Canonical promotion** | inception → docs/ or templates/ (becomes part of the protocol specification) |
| **Archival promotion** | inception → examples/ (becomes historical reference material) |
| **Readiness gate** | A set of conditions that must be true before promotion can be proposed |
| **Promotion proposal** | A mailbox message requesting maintainer approval to promote one or more artifacts |

## Requirements

### R1. Promotion paths

Define exactly two promotion paths from inception:

| Path | Source | Target | Purpose |
|------|--------|--------|---------|
| **Canonical** | `working-session/docs/*.md`, `working-session/NOTIFICATION_PROTOCOL.md`, etc. | `docs/*.md`, `templates/*.md` | Protocol rules, templates, and reference docs validated through pilot use |
| **Archival** | `working-session/` (compact operational subset) | `examples/<session-name>/` | Historical reference bundle sized for onboarding and pattern reference |

No other promotion paths exist. Files that don't fit either path (scratch notes, debugging artifacts, redundant drafts) are discarded at session close — they exist only in local filesystem history.

### R2. Readiness gates

#### R2a. Canonical promotion gates

An inception artifact is ready for canonical promotion when ALL of the following are true:

1. **Pilot-validated:** The artifact has been used in at least two agent sessions without requiring structural changes. Minor wording edits don't reset the count.
2. **Agent-reconciled (explicit mutual acceptance):** Required reviewers (currently Codex and Claude) have each posted explicit acceptance with evidence; all objections are resolved.
3. **Maintainer-approved (explicit acceptance):** The maintainer has explicitly accepted the artifact's content. Evidence: WORKLOG decision record or mailbox ack from Maintainer.
4. **Open questions resolved:** All open questions in `OPEN_QUESTIONS.md` that reference this artifact are either resolved or explicitly deferred with documented rationale.
5. **Cross-reference audit passed:** All references to/from other documents are valid. Promoted docs must not reference inception-only files; inception files referencing the promoted doc must be updated.
6. **Format compliant:** The artifact conforms to the canonical format conventions defined by PRD-005 (or the existing canonical docs if PRD-005 is not yet adopted).
7. **Promotion-blocker disposition recorded:** Any deferred question marked promotion-relevant (currently `OQ-026` from PRD-007) has an explicit maintainer disposition (`allow`, `block`, or `conditional`) in the promotion proposal.
8. **Registry gate passed:** `working-session/docs/PRD_STATUS.json` marks the PRD as eligible with Codex/Claude/Maintainer acceptance evidence and zero blockers.

#### R2b. Archival promotion gates

An inception workspace is ready for archival promotion when ALL of the following are true:

1. **Session closed:** The maintainer has declared the session complete or the milestone achieved.
2. **Canonical promotions complete:** All artifacts worthy of canonical promotion have been promoted or explicitly deferred.
3. **Sensitive content redacted:** API keys, local paths, personal identifiers, or other non-publishable content has been removed or replaced with placeholders.
4. **README added:** An `examples/<session-name>/README.md` exists explaining what this session was, what was accomplished, and what patterns it demonstrates.
5. **Retrospective complete:** A session retrospective exists per Protocol Core §9.
6. **Compact scope declared:** The archival bundle explicitly lists included artifacts and confirms exclusion of long-form operational archives unless maintainer requests an exception.

### R3. Promotion proposal format

An agent proposing promotion sends a mailbox message with:

| Field | Value |
|-------|-------|
| Type | `decision-required` |
| To | Maintainer |
| Priority | P1 |
| Subject | `Promotion proposal: <artifact> → <target tier>` |

**Required payload:**

```text
## Promotion Proposal

Artifact: <source path>
Target: <target path>
Path: <canonical|archival>
Revision: <REV-...>
Review scope: <full|critical-only>
Ask: <approve|approve-with-conditions|defer|reject>

### Readiness Checklist

- [ ] Pilot-validated (sessions: <list session numbers>)
- [ ] Codex accepted (evidence: <MSG-ID or WORKLOG ref>)
- [ ] Claude accepted (evidence: <MSG-ID or WORKLOG ref>)
- [ ] Maintainer accepted (evidence: <MSG-ID or WORKLOG ref>)
- [ ] Open questions resolved (deferred: <list any deferred OQs>)
- [ ] Promotion-blocker disposition recorded (if deferred promotion-relevant OQs remain)
- [ ] Cross-reference audit passed
- [ ] Format compliant
- [ ] `PRD_STATUS.json` eligible gate is true
- [ ] Interface deltas listed (PRD-005/006/007/010/011/013 as applicable)

### Transformation Summary

<what changes between source and target — renames, redactions, restructuring>

### Impact

<what other files need updating when this promotion lands>

### Interface Delta Summary

<cross-PRD contract changes this promotion depends on or introduces>
```

### R4. Transformation rules

#### R4a. Canonical promotion transformations

When promoting an inception document to `docs/` or `templates/`:

1. **Remove inception metadata:** Strip "Status: Draft (inception)", replace with appropriate production status.
2. **Remove implementation plan section:** The inception-specific implementation plan is not relevant to the canonical doc. Replace with a brief "History" or "Origin" note if useful.
3. **Remove coordination sections:** Sections like "Coordination with Codex (PRD-004)" are session-specific. Extract any lasting interface contracts into the document body.
4. **Update cross-references:** Replace `working-session/` paths with `docs/` or `templates/` paths. Remove references to mailbox messages, worklog entries, or other inception-only files.
5. **Merge with existing canonical docs where appropriate:** Some inception PRDs (e.g., PRD-003 lifecycle rules) should be merged into an existing canonical doc (e.g., `docs/COMMUNICATIONS_PROTOCOL.md`) rather than creating a new standalone file. The promotion proposal must specify: new file vs. merge target.
6. **Preserve agent attribution:** Add a brief attribution note (e.g., "Originated as PRD-003 during inception session 2026-02-08. Drafted by Claude, reviewed by Codex.").
7. **Retain origin trace via promoted archive path:** If origin context is required, link to `examples/<session-name>/` artifacts, not `working-session/` paths.

#### R4b. Archival promotion transformations

When promoting an inception workspace to `examples/`:

1. **Create session directory:** `examples/<project-or-session-name>/`.
2. **Copy compact operational artifacts only:** Include the artifacts needed to reconstruct decisions and workflow (for example: `TURNFILE.yaml`, `MAILBOX.md` compact view, `WORKLOG.md`, `OPEN_QUESTIONS.md`, relevant PRDs, and session README/context files).
3. **Exclude long-form archives by default:** Do not include historical expansion artifacts (for example `MAILBOX_ARCHIVE.md`) unless maintainer explicitly requests a full archive exception.
4. **Redact sensitive content:** Replace API keys, tokens, and local filesystem paths with `<REDACTED>` or generic placeholders.
5. **Add README:** Explain session context, outcomes, included artifact scope, and excluded artifacts.
6. **Freeze:** Archival artifacts are read-only references. They are never updated after promotion.

### R5. Execution roles

| Step | Actor | Authority |
|------|-------|-----------|
| Identify promotion-ready artifacts | Any agent | Autonomous |
| Prepare promotion proposal (R3 format) | Proposing agent | Autonomous |
| Review promotion proposal | Non-proposing agent(s) | Advisory (aspirational cross-review) |
| Approve or reject promotion | Maintainer | Required (approval gate) |
| Execute transformation (R4) | Assigned agent | Per maintainer direction |
| Commit promoted artifacts | Maintainer | Merge authority |
| Acquire/release shared-file locks for control-plane updates | Executing agent | Required via PRD-010 + PRD-013 lease-lock semantics |
| Update inception references | Executing agent | Autonomous |
| Verify cross-references | Any agent | Session-start check |

### R6. Batch promotion

Multiple artifacts may be proposed for promotion in a single message when they are logically related (e.g., PRD-003 + PRD-004 together, since they have interface dependencies). The readiness checklist must be completed per-artifact, but the maintainer may approve or reject the batch as a unit.

### R7. Promotion tracking

Add a "Promotion Status" section to each inception PRD once it enters the promotion pipeline:

```text
## Promotion Status

| Field | Value |
|-------|-------|
| Proposed | <date> |
| Proposal MSG | <MSG-ID> |
| Target | <docs/ path or examples/ path> |
| Readiness | <gate status summary> |
| Maintainer decision | <pending|approved|rejected|deferred> |
| Executed | <date or pending> |
```

This section is added when an agent proposes promotion, not when the PRD is first drafted. It remains in the inception copy until promotion executes or the session closes.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `docs/PROTOCOL_CORE.md` | Canonical promotions add to or amend this document; §9 retrospective is a readiness gate |
| `docs/COMMUNICATIONS_PROTOCOL.md` | PRD-003 lifecycle rules would merge into §5/§6 upon canonical promotion |
| `docs/SESSION_CHARTER.md` | Template may need a "Promotion Plan" section for sessions that plan to produce canonical outputs |
| PRD-003 (message lifecycle) | Promotion proposals follow PRD-003 lifecycle (unread → actioned → closed) |
| PRD-004 (maintainer decisions) | Promotion approval is a `decision-required` message per PRD-004 contract |
| PRD-005 (data schema) | Defines format compliance gate; schema version compatibility rules apply to promoted artifacts |
| PRD-007 (trust/provenance) | Deferred promotion-relevant trust anomalies (for example OQ-026) require explicit maintainer disposition before canonical promotion |
| PRD-008 (cross-sandbox handoff) | Promotion proposals use payload-first format for transformation diffs |
| PRD-009 (reconciliation) | Agent-reconciled gate uses PRD-009's structured review workflow |
| PRD-010 (shared-file locking) | Promotion updates that touch shared control-plane files follow transaction + Turnfile lease lock flow |
| PRD-011 (session resumption) | Promotion outputs must keep resumption references valid (including Turnfile-first read order context) |
| PRD-013 (Turnfile format) | Archival bundles include Turnfile coordination snapshot; lock state source is Turnfile, not LOCKS.md |
| `working-session/OPEN_QUESTIONS.md` | OQ resolution is a readiness gate; promotion triggers a registry scan |

## Acceptance criteria

1. At least one canonical promotion proposal is prepared and evaluated using the R3 format during the inception pilot.
2. Readiness gates are testable — an agent can determine at session start whether any inception artifact meets all gates.
3. Transformation rules produce a canonical document that contains no inception-specific references.
4. Archival promotion of the `ai-feature-tracker` example (already in `examples/`) can be retroactively validated against the R2b gates.
5. Promotion tracking section (R7) is added to at least one inception PRD as a demonstration.
6. At least one promotion proposal demonstrates explicit disposition of deferred promotion-relevant trust anomalies (or records that none apply).

## Risks

1. **Premature promotion.** Artifacts promoted before sufficient pilot validation may need to be revised in canonical docs, where changes are more disruptive. Mitigation: two-session validation requirement in R2a.
2. **Promotion bottleneck.** If the maintainer is the sole approver and sessions run frequently, promotion proposals may queue up. Mitigation: batch promotion (R6) reduces the number of decisions needed.
3. **Transformation drift.** If transformation rules (R4) are not followed precisely, promoted docs may retain inception-specific language or broken references. Mitigation: cross-reference audit is an explicit readiness gate.
4. **Archival bloat.** Promoting every session to examples/ may make the examples directory unwieldy. Mitigation: archival promotion is optional and requires maintainer approval; not every session needs to become an example.
5. **PRD-005 dependency.** R2a gate 6 (format compliance) depends on PRD-005, which is still draft. Mitigation: if PRD-005 is not yet adopted, use existing canonical docs as the format reference.
6. **Deferred-trust ambiguity.** Deferred trust anomalies can create promotion inconsistency. Mitigation: R2a requires explicit maintainer disposition for promotion-relevant deferred items.

## Open questions

All open questions have been resolved by maintainer direction:

1. ~~Should there be a "staging" tier between inception and canonical — e.g., `docs/drafts/` — for documents that have passed agent review but not yet accumulated two sessions of pilot validation?~~ **Resolved:** no staging tier.
2. ~~Should archival promotion include the full mailbox archive or only the compact operational view?~~ **Resolved:** compact operational view only.
3. ~~Should promoted canonical docs retain a link back to their inception origin (e.g., "See examples/inception/ for the original PRD and review history")?~~ **Resolved:** yes, retain inception-origin backlink.
4. ~~Should the transformation rules (R4a) be automated with a script, or is manual transformation sufficient at current scale?~~ **Resolved:** manual now; automation later.

## Implementation plan (inception)

1. Finalize PRD-006 through agent cross-review (Claude draft, Codex review).
2. Add promotion readiness assessment to WORKLOG session-close checklist.
3. Prepare one trial canonical promotion proposal (suggest PRD-003 or notification protocol as the first candidate, since they have the most pilot mileage).
4. Validate archival promotion gates (including compact-scope rules) against the existing `examples/ai-feature-tracker/` directory.
5. If stable across two sessions, promote PRD-006's rules into `docs/PROTOCOL_CORE.md` as a new §11 (Artifact Promotion).

## P2-C interface deltas (PRD-005/006)

The following deltas define the current reconciliation surface for the P2-C integration gate:

| Delta ID | Interface delta | Source | Applied in PRD-006 |
|----------|------------------|--------|--------------------|
| D-001 | Promotion proposals carry revision/payload metadata (`Revision`, `Review scope`, `Ask`) to align with PRD-008/009 envelope semantics. | PRD-008, PRD-009 | R3 payload template |
| D-002 | Promotion checklist includes explicit promotion-blocker handling for deferred trust anomalies (`OQ-026`). | PRD-007 | R2a.7 + R3 checklist |
| D-003 | Archival promotions use compact operational bundles; long-form archives are excluded by default. | OQ-022 resolution | R1 archival path + R2b.6 + R4b |
| D-004 | Shared control-plane promotion edits require Turnfile lease-lock flow. | PRD-010, PRD-013 | R5 execution roles + interaction table |
| D-005 | Turnfile coordination snapshot is included in archival bundles; lock source remains Turnfile `locks` section. | PRD-013 | R4b + interaction table |
| D-006 | Format compliance continues to reference PRD-005 while PRD-005 remains draft; fallback remains existing canonical doc conventions. | PRD-005 | R2a.6 + Risks |

## Amendment A1 (draft, 2026-06-13): Implementation Verification Lifecycle

Status: Draft amendment — Maintainer structure stated and approved 2026-06-13 (session 14); Codex acceptance pending (MSG-20260613-032). Proposed by Claude per Maintainer direction.

### A1.R1 The eight-step PRD loop

Maintainer-stated structure, verbatim authority for this amendment:

1. LLM-A proposes something by way of PRD.
2. LLM-B accepts or amends according to Turnfile protocol.
3. Back-and-forth conversational turns ensue until the PRD meets their collective approval, then is surfaced to the Maintainer to approve.
4. If the Maintainer approves, LLM-A creates the evals for the PRD, and requests that LLM-B do the work.
5. LLM-B accepts the work and completes it, or reverts to discussion.
6. LLM-B runs its work against the evals, revises as needed, then requests LLM-A review.
7. LLM-A checks the work, approves or kicks back to LLM-B with specific requests to incorporate.
8. LLM-A files the PRD to done.

### A1.R2 State model

Acceptance is not completion. The registry tracks two layers:

1. **Acceptance state** (existing): draft → agent-accepted → Maintainer-accepted. Promotion of the contract *text* to `docs/prds` may occur at Maintainer acceptance (text becomes canonical).
2. **Implementation state** (new `implementation` object per registry entry): `pending` → `evals-created` → `implementing` → `eval-verified` → `reviewed` → `done`. A PRD's overall `state` may read `actioned` only when implementation is `done`. PRDs promoted before this amendment without implementation tracking are marked `grandfathered`; any with known-unmet acceptance criteria are retrofitted into the loop.

### A1.R3 Role separation

1. The proposer (LLM-A) writes the evals and reviews the implementation. The counterpart (LLM-B) implements. No agent implements its own proposal unsupervised; self-implemented work performed before this amendment is retroactively reviewed by the counterpart under the relevant eval suite.
2. Evals live in `evals/prd-<NNN>.evals.mjs`, runnable via `npm run evals:prd` (node test runner). Evals are written to fail before implementation (red), pass after (green); the red baseline is committed as evidence of the gap.
3. Eval suites must encode applicable lessons from the WORKLOG collision/discipline ledger so caught mistakes become regression checks, not prose.

### A1.R4 Done gate

`done` requires, in order: Maintainer acceptance; eval suite exists (authored by proposer); implementation by counterpart; eval suite green as run by the implementer (step 6) AND independently by the reviewer (step 7); reviewer approval recorded in the mailbox; proposer files to done in registry + WORKLOG. Any kick-back at step 7 carries specific, enumerable requests.

### A1.R5 Acceptance-criteria gate repair

The promotion checklist (R2a) gains one item: acceptance criteria that name concrete artifacts (worked examples, validator behavior, propagated documents) must be verified as existing — by eval where possible — before the PRD may be filed `done`. Acceptance signatures alone do not satisfy acceptance criteria.
