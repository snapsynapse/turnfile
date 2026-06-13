# PRD-020: Boot Artifact Completeness and Chat Log Contract

Status: **Superseded — folded into PRD-017 R7** (Maintainer decision, 2026-06-12, session 14)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-06-12 (session 14: superseded)

> **Supersession notice.** All requirements in this PRD were folded into
> `PRD-017-boot-sequence-commands-and-documentation-contract.md` section R7 by Maintainer
> decision on 2026-06-12 (session 14 backlog triage). OQ-056 and OQ-057 were resolved at
> fold time (fixed metadata fields: yes; session structure: manual) and are recorded in
> PRD-017's open-questions table. This file is retained as a historical record per the
> consolidation path it proposed in its own "Scope relationship to PRD-017" section.
> Do not implement from this document; PRD-017 R7 governs.

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted (content carried into PRD-017 R7) | MSG-20260211-010 deadlock counter resolved and accepted by Codex |
| Claude acceptance | accepted | MSG-20260211-010 amendment pass submitted by Claude |
| Maintainer acceptance | superseded | Maintainer decision 2026-06-12: fold into PRD-017 R7 rather than accept standalone |
| Eligible for move to `docs/prds` | no — superseded | content promotes with PRD-017 |

## Input Provenance Tags

1. `explicit`: `working-session/chat-codex.md` should be created unconditionally during boot.
2. `implied`: boot should verify required audit artifacts exist for both agents.
3. `explicit`: current process shows gaps when one agent artifact exists and the peer artifact is missing.

## Alignment reference

This PRD aligns with:

1. `docs/prds/PRD-011-session-resumption-contract.md`
2. `docs/prds/PRD-014-session-closeout-boot-handoff-contract.md`
3. `working-session/docs/PRD-017-boot-sequence-commands-and-documentation-contract.md`

## Problem

Session boot is not currently enforcing complete audit artifact initialization for both agents. Missing per-agent chat logs reduce transparency and make for uneven handoff quality.

## Goal

Require boot to initialize and verify a minimum artifact set, including both agent chat logs, before substantive shared-file work.

## Non-goals

1. Mandating verbose reasoning logs in chat files.
2. Changing whether working-session artifacts are git-tracked.
3. Replacing mailbox/worklog as canonical decision records.

## Requirements

## R1. Mandatory artifact set

Boot must ensure the booting agent's own chat file exists (create if missing). The full set of per-agent chat files is:

1. `working-session/chat-codex.md`
2. `working-session/chat-claude.md`
3. Existing control-plane artifacts already required by PRD-017.

Each agent is responsible for creating its own chat file only. Peer agent chat files are validated as **existing or absent** — absence of a peer chat file is not a boot-blocking condition (the peer will create it on its own next boot).

## R2. Unconditional per-agent chat file creation

Each agent's boot flow must create its own `working-session/chat-<agent>.md` unconditionally when absent. An agent does not create peer chat files.

### R2.1 Root cause and primary fix

The observed gap (missing `chat-codex.md` in session 12) originated from Module 0 step 3 not being executed: the template `chat-agent.md` was not renamed to `chat-<agent>.md` during bootstrap. The **primary fix** is procedural — Module 0 in each agent's skill file must include explicit chat file creation from template. R4 (boot gate) serves as **defense-in-depth**, not the primary fix.

### R2.2 Generalization

This requirement applies to any per-agent artifact defined in the template set. If `templates/working-session/` contains `chat-agent.md`, `boot-agent.md`, or similar agent-parameterized files, each agent must instantiate its own copy during bootstrap.

## R3. Artifact template contract

Per-agent chat files must share a minimal template:

1. Title and purpose.
2. Session header block.
3. State snapshot section.

## R4. Boot gate

After initialization steps, boot validates:

1. **Own-agent chat file exists** — blocks boot if missing (should have been created in R2).
2. **Control-plane artifacts exist** (TURNFILE.yaml, MAILBOX.md, WORKLOG.md) — blocks boot if missing.
3. **Peer chat file** — logged as warning if absent, but does **not** block boot. The peer will create it on its own next session.

## R5. Ownership and scope

Each agent owns edits to its own chat file, while Maintainer and peer agent retain read access.

## Acceptance criteria

1. Clean-start boot creates the booting agent's own chat file when absent.
2. Boot validation fails when required artifacts are missing.
3. Boot docs and skill modules reference this requirement.
4. At least one test scenario covers missing `chat-codex.md` recovery.

## Scope relationship to PRD-017

PRD-017 defines the canonical boot command manifest and documentation contract. PRD-020's scope (artifact completeness + chat log contract) is narrow enough to potentially fold into PRD-017 as R1.x additions. However, PRD-017 is already dense with boot-command and validation concerns. Keeping PRD-020 standalone is defensible because:

1. The artifact completeness concern is about **what must exist**, while PRD-017 is about **what commands to run and in what order**.
2. The chat log template contract (R3) and per-agent ownership model (R5) are distinct from boot-sequence mechanics.
3. Consolidation can happen at promotion time if both PRDs are accepted and the Maintainer prefers fewer documents.

## Risks

1. Artifact sprawl may increase maintenance burden.
   Mitigation: minimal template and periodic compaction guidance.
2. Confusion between chat logs and decision records.
   Mitigation: keep decision authority in mailbox/worklog references.
3. Overlap with PRD-017 may create maintenance drift between the two documents.
   Mitigation: explicit scope-relationship section above; consider consolidation at promotion.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-056 | Should chat logs include fixed metadata fields (branch, rev, phase) for machine parsing? | pending | R3 |
| OQ-057 | Should boot create timestamped session subsections automatically or leave structure manual? | pending | R3 |
