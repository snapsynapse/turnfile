# PRD-008: Cross-Sandbox Handoff Contract (Payload-First)

Status: Revised Draft (inception) — maintainer open questions resolved  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08
Last revised: 2026-02-08 (maintainer OQ resolution + Phase 1 review clarifications)

## Problem

Cross-agent reviews are failing when messages reference file paths without inline content. In sandboxed sessions, one agent may not see the other agent's latest filesystem state, so path-only requests produce ambiguity, rework, and maintainer relay overhead.

## Goal

Define a deterministic handoff contract for cross-sandbox content review that:

1. Transports reviewable content directly in mailbox messages.
2. Preserves `inception/` as local-only (no forced git tracking of active session artifacts).
3. Reduces maintainer copy/paste relay work.
4. Keeps full auditability in mailbox/worklog history.

## Non-goals

1. Real-time filesystem synchronization between agent sandboxes.
2. Replacing WORKLOG/MAILBOX governance model.
3. Requiring GitHub push for every in-progress draft.
4. Introducing binary attachments or opaque payload formats.

## Users

1. Sender agent: needs a reliable way to transmit exact proposed changes.
2. Receiver agent: needs enough inline context to review without filesystem dependence.
3. Maintainer: needs low-friction visibility with minimal manual relay.
4. Auditor/reviewer: needs traceable revision lineage across decisions.

## Requirements

## R1. Payload-first trigger conditions

Payload-first format is required when a message asks another agent to:

1. Review edits.
2. Approve or reject specific content.
3. Reconcile conflicting proposals.
4. Apply suggested text changes.

Path-only references are allowed for FYI messages but not for review/approval requests.

## R2. Mandatory payload envelope

Review messages must include:

1. `Revision` token (example: `REV-20260208-prd003-rev-a-01-h1a2b3c4`).
2. `Format` (`unified-diff` or `full-text`).
3. `Files` list.
4. `Review scope` (`full`, `critical-only`, or `interface-only`).
5. Inline payload block.
6. Explicit ask (`apply-or-counter`, `review-only`, or `fyi`).

Receiver `Ack` must echo the same `Revision` token before substantive review comments.

## R3. Payload format rules

1. `unified-diff` is default for edits to existing files.
2. `full-text` is allowed for net-new files or when diff readability is poor.
3. Payload blocks are capped at **16 KiB or 300 lines** (whichever comes first).
4. Above the cap, sender must split payload into ordered parts with the same revision root plus part suffix (for example `REV-...-p1of3`).
5. If any part is missing, receiver must request resend before review.

## R4. Revision integrity and provenance

1. Any content change requires a new `Revision` token.
2. Revision token format is:
`REV-YYYYMMDD-<topic>-<seq>-h<8hex>`.
3. `h<8hex>` is the first 8 hex chars of SHA-256 over the normalized payload block (`LF` newlines, UTF-8 bytes).
Checksum is computed over content between the opening and closing fence markers, excluding the fence markers themselves and any language tag.
4. Receiver should validate checksum before substantive review; checksum mismatch is treated as malformed payload.
5. Prior revisions remain in history; no in-place semantic rewrites.
6. `Related` field links to prior message IDs when superseding a revision.
7. Final accepted revision must be referenced in WORKLOG handoff or decision note.

## R5. Malformed message handling

If a review request is missing required payload fields:

1. Receiver marks message `acknowledged` with reason `needs-resend`.
2. Receiver does not provide content-level judgment until valid payload arrives.
3. Sender resends using a new `Revision` token.
4. After one resend failure for the same revision root, receiver auto-escalates to WORKLOG + Maintainer with a concise risk note.
A payload exceeding the R3 cap without proper chunking is treated as malformed for this section.

## R6. Thread closure ownership

Review request messages must declare `Closure owner` in the message card:

1. `sender` or `maintainer` for actionable threads.
2. `none` only for non-actionable `notify` traffic.
3. Named closer is responsible for terminal `closed` transition per PRD-003.
If a thread is deferred (PRD-003 R5, PRD-004 R4), the named closure owner retains responsibility and should re-evaluate when the unblock condition is met.

## R7. Operational compaction

To control mailbox growth:

1. Active mailbox keeps concise operational summaries.
2. Full payloads are retained in archive-backed history.
3. Message IDs and revision tokens remain stable across compaction.

## R8. Compatibility with lifecycle and decision contracts

1. PRD-003 owns lifecycle status and SLA semantics.
PRD-003 status set includes `unread`, `acknowledged`, `blocked`, `actioned`, and `closed`.
2. PRD-004 owns maintainer decision payload/reply contract.
3. PRD-008 owns cross-sandbox content transport semantics including `Review scope` and `Closure owner`.
4. If conflicts arise, lifecycle terms come from PRD-003, decision terms from PRD-004, and payload transport terms from PRD-008.
For full structured change proposal semantics (per-change rationale, extended response contract), see PRD-009 R1/R2. PRD-008 R2 defines the minimum transport envelope.

## R9. Payload helper tooling

Add and maintain a local helper script/template generator for payload envelopes:

1. Script emits envelope scaffolding with `Revision`, `Format`, `Review scope`, and `Files`.
2. Script computes checksum segment for the revision token from supplied payload content.
3. Script supports chunk suffix hints for multi-part payloads.
4. Output is plain markdown-ready text for direct mailbox insertion.

## Proposed workflow

1. Sender creates review request with payload envelope and inline content.
2. Receiver acknowledges with matching revision token.
3. Receiver replies with accept/counter/apply decision tied to that revision.
4. If payload is malformed, sender resends once; second malformed resend auto-escalates.
5. Sender posts superseding revision if needed.
6. Final accepted revision is recorded in WORKLOG.

## Acceptance criteria

1. At least three cross-agent review exchanges complete without maintainer relaying file content.
2. Every reviewed message has a valid checksum-bearing revision token echoed in receiver acknowledgment.
3. Payloads above cap are chunked with ordered part suffixes.
4. No path-only review request proceeds to substantive review.
5. Review conclusions are reconstructable from mailbox/worklog without external chat logs.
6. Helper script is used in at least one real payload exchange.

## Risks

1. Inline payloads can increase mailbox size quickly.
2. Poorly formatted diffs can still cause interpretation errors.
3. Checksum/token rules add light operational overhead.
4. Small edits may feel heavier due to envelope requirements.

## Dependencies

1. PRD-003 message lifecycle + SLA contract.
2. PRD-004 maintainer decision contract.
3. `inception/NOTIFICATION_PROTOCOL.md` v0.6 payload-first rule.
4. PRD-005 protocol data schema + compatibility (future metadata formalization).
5. `tools/new-payload-envelope.mjs` helper script (shipped; adoption tracked in M5).

## Milestones

1. M0 (done): payload-first rule added to `NOTIFICATION_PROTOCOL.md` v0.3.
2. M1 (done): required `Closure owner` + `Review scope` added in protocol v0.5.
3. M2 (current): enforce payload cap/chunking + checksum token format.
4. M3 (current): enforce auto-escalation after one resend failure.
5. M4 (done): shipped helper envelope script at `tools/new-payload-envelope.mjs`.
6. M5 (next): adopt helper script in at least one live payload exchange.
7. M6 (post-pilot): decide canonical adoption path in `docs/COMMUNICATIONS_PROTOCOL.md`.

## Open questions

All open questions have been resolved by maintainer decision:

1. ~~Should we enforce a maximum payload size per message before mandatory chunking?~~ **Resolved: Yes.** Cap set to 16 KiB or 300 lines; chunking is mandatory above cap. Applied to R3.
2. ~~Should revision tokens include a checksum segment for stronger integrity guarantees?~~ **Resolved: Yes.** Added `-h<8hex>` checksum segment to revision tokens. Applied to R4.
3. ~~Should malformed payloads auto-escalate after one resend failure?~~ **Resolved: Yes.** Added auto-escalation to WORKLOG + Maintainer after second malformed attempt. Applied to R5.
4. ~~Should we add a helper script/template generator for payload envelopes?~~ **Resolved: Yes.** Added tooling requirement in R9 and milestone M4.

## Exit criteria for moving beyond inception draft

1. Payload-first handoffs are used consistently for one full PRD reconciliation cycle.
2. No unresolved sandbox-visibility blocker remains for active collaboration.
3. Maintainer confirms relay burden is materially reduced.
4. Team agrees format is stable enough for canonical documentation.
