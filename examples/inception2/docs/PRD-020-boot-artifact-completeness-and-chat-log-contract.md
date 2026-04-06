# PRD-020: Boot Artifact Completeness and Chat Log Contract

Status: Draft (working-session; not yet actioned)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-11  
Last revised: 2026-02-11

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | — |
| Claude acceptance | pending | — |
| Maintainer acceptance | pending | — |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

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

Boot must ensure these files exist (create if missing):

1. `working-session/chat-codex.md`
2. `working-session/chat-claude.md`
3. Existing control-plane artifacts already required by PRD-017.

## R2. Unconditional `chat-codex.md` creation

Codex boot flow must create `working-session/chat-codex.md` unconditionally when absent.

## R3. Artifact template contract

Per-agent chat files must share a minimal template:

1. Title and purpose.
2. Session header block.
3. State snapshot section.

## R4. Boot gate

If required artifacts are missing after initialization steps, boot cannot continue to substantive shared-file mutation.

## R5. Ownership and scope

Each agent owns edits to its own chat file, while Maintainer and peer agent retain read access.

## Acceptance criteria

1. Clean-start boot creates both chat files when absent.
2. Boot validation fails when required artifacts are missing.
3. Boot docs and skill modules reference this requirement.
4. At least one test scenario covers missing `chat-codex.md` recovery.

## Risks

1. Artifact sprawl may increase maintenance burden.
   Mitigation: minimal template and periodic compaction guidance.
2. Confusion between chat logs and decision records.
   Mitigation: keep decision authority in mailbox/worklog references.

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-056 | Should chat logs include fixed metadata fields (branch, rev, phase) for machine parsing? | pending | R3 |
| OQ-057 | Should boot create timestamped session subsections automatically or leave structure manual? | pending | R3 |
