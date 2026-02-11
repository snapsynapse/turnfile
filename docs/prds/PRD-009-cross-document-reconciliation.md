# PRD-009: Cross-Document Reconciliation + Open Question Triage

Status: Draft (inception)
Owner: Claude (draft) + Codex (review) + Maintainer
Date: 2026-02-08

## Problem

During PRD-003/004 reconciliation, the team discovered three process gaps that the existing protocol and PRDs do not address:

1. **Review feedback without proposed changes is unactionable.** Codex posted a summary of PRD-003 suggestions ("P0 response-window semantics, stale detection wording, and decision-index vs escalation logging boundaries") but the actual edits weren't included. This required a full extra round-trip (MSG-013) to get the content. The payload-first policy (notification protocol v0.3) partially fixes this, but there's no structured workflow for the propose → review → accept/counter → apply cycle.

2. **Open questions accumulate across PRDs without resolution.** PRD-001 has 3 open questions, PRD-003 has 3, PRD-004 has 4. Some overlap (e.g., `approval-required` formalization appears in both PRD-001 and PRD-004). There's no process for triaging, deduplicating, or scheduling resolution of open questions. They sit in individual PRDs until someone remembers them.

3. **No revision history for shared inception documents.** When an agent applies changes from a diff payload, the only record is the WORKLOG handoff entry and the mailbox ack. If a third agent (or future session) needs to understand *why* a line changed, they must reconstruct the chain from mailbox → worklog → file. There's no inline revision trail in the document itself.

## Goal

Define lightweight processes for:

1. Structured change proposals between agents (beyond payload-first delivery).
2. Cross-PRD open question triage and resolution tracking.
3. Minimal revision attribution in shared inception documents.

## Non-goals

1. Full version control semantics (git handles that for tracked files; inception is local-only).
2. Automated tooling for reconciliation (agents are stateless).
3. Replacing the WORKLOG as the canonical decision record.
4. Formal change-request bureaucracy — this should be lighter than the current ad-hoc process, not heavier.

## Users

1. **Agents (Codex, Claude, future):** need a repeatable workflow for proposing and applying changes to shared documents without ambiguity or extra round-trips.
2. **Maintainer:** needs confidence that open questions are being tracked and resolved, not silently accumulating.
3. **Future agents/sessions:** need to understand why a document looks the way it does without reading the entire WORKLOG.

## Requirements

### R1. Structured change proposal format

When an agent proposes changes to a document owned or co-owned by another agent, the message must include:

1. **Revision token** (per notification protocol v0.6).
2. **Inline diff** (unified-diff preferred) or **full replacement text** for each changed section.
3. **Review scope** (`full`, `critical-only`, `interface-only`) when payload content is present.
4. **Rationale per change** — one line explaining *why*, not just *what*.
5. **Disposition request** — explicitly state whether this is:
   - `apply-or-counter`: receiver should apply the changes or post a counter-recommendation.
   - `review-only`: sender wants feedback before deciding whether to apply.
   - `fyi`: informational, no action expected.
6. **Closure owner** for actionable threads (`sender` or `maintainer`).

This extends the payload-first rule from "include the content" to "include the content, the reasoning, and the expected response type."

### R2. Receiver response contract

When a receiver gets a change proposal with disposition `apply-or-counter`, they must respond with one of:

| Response | Meaning | Required content |
|----------|---------|------------------|
| `accepted` | All changes applied as proposed | Echo sender's revision token + confirmation |
| `accepted-with-modifications` | Changes applied with adjustments | New superseding revision token + diff of modifications + `Related` link to sender's revision |
| `counter-recommendation` | Disagrees with one or more changes | New superseding revision token + counter-diff + rationale + `Related` link to sender's revision |
| `deferred` | Cannot evaluate now | Echo sender's revision token + unblock condition |

**Revision token integrity rule:** When a response includes new or modified payload content (`accepted-with-modifications` or `counter-recommendation`), the receiver must generate a new superseding revision token per PRD-008 R4 ("any content change requires a new Revision token") and link back to the original via `Related`. Responses that do not introduce new content (`accepted`, `deferred`) echo the sender's revision token. This preserves provenance lineage across the full proposal → response → apply chain.

Response must be in the same mailbox message thread (ack on the original message, not a new message).
The actor in `Closure owner` is responsible for closing the thread when the response is complete.

### R3. Open question registry

Maintain a single open question registry file that (pilot location: `working-session/OPEN_QUESTIONS.md`; canonical location determined at promotion per OQ-010/OQ-020):

1. Lists all open questions from all PRDs in one place.
2. Deduplicates overlapping questions (with references to source PRDs).
3. Tracks resolution status: `open`, `resolved`, `deferred`, `withdrawn`.
4. Records resolution when it happens: decision + source (PRD, mailbox message, or maintainer directive).

Format:

```text
| ID | Source PRDs | Question | Status | Resolution |
|----|------------|----------|--------|------------|
| OQ-001 | PRD-001 #1, PRD-004 #1 | Should `approval-required` be a first-class message type? | resolved | Deferred until pilot evidence (PRD-003 R3, PRD-004 R2) |
| OQ-002 | PRD-003 #1 | Should the state machine support a `blocked` status? | open | — |
```

Agents should check this file at session start and update it when they resolve a question through PRD work or mailbox discussion.

### R4. Lightweight revision attribution

When an agent applies changes from another agent's proposal, add a one-line attribution comment at the point of change in the document:

```text
<!-- REV-20260208-prd003-rev-a: P0 window clarified per Codex suggestion -->
```

This is optional for trivial changes (typos, formatting) and required for semantic changes (meaning, rules, constraints). The HTML comment is invisible in rendered markdown but preserved in the source.

**Exception:** If the document is in `docs/` (canonical), revision comments should NOT be used — git history serves that purpose. This rule applies only to `working-session/` documents that are not version-controlled.

### R5. Interface delta declaration for parallel tracks

Parallel PRD handoff messages must include a short "interface delta" block even when no differences are found:

```text
Interface delta:
- Surface: <interface name>
- Delta: <summary of change, or "none">
- Action: <apply|counter|none>
```

This reduces hidden drift by forcing explicit interface-state acknowledgement on every cycle.

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `working-session/NOTIFICATION_PROTOCOL.md` | Extends payload-first rule with structured proposal format (R1), response contract (R2), review scope + closure owner fields, and interface delta block requirement (R5) |
| `working-session/MAILBOX.md` | No format change — proposals use existing message cards with enhanced payload section |
| PRD-003 (message lifecycle) | R2 response types map to existing status transitions |
| PRD-004 (maintainer decisions) | Maintainer decisions that resolve open questions should update the registry (R3) |
| PRD-005 (protocol data schema) | Open question registry could become part of the formal schema if PRD-005 proceeds |

## Acceptance criteria

1. Next cross-agent document change (PRD-005 or later) uses the R1 proposal format without extra round-trips for content delivery.
2. At least one actionable request message uses explicit `Closure owner` and payload `Review scope`.
3. Parallel PRD handoff includes an interface delta block, including at least one "delta: none" case.
4. Open question registry exists and contains all current open questions from all active PRDs in pilot scope (deduplicated).
5. At least one semantic change in an inception document includes an R4 revision attribution comment.
6. No open question is resolved in a PRD without updating the registry.

## Risks

1. **Process overhead exceeds value at current scale.** Two agents and one maintainer may find the registry and attribution rules burdensome. Mitigation: R4 attribution is optional for trivial changes; R3 registry is a single lightweight file.
2. **Registry staleness.** If agents don't check the registry at session start, it drifts. Mitigation: add registry check to session-start checklist in notification protocol.
3. **Over-engineering what git would solve.** If inception files were tracked, most of R4 would be unnecessary. Mitigation: R4 explicitly scopes itself to untracked inception files only.

## Open questions

1. ~~Should the open question registry live in `working-session/` (local) or be promoted to a tracked file for cross-session persistence?~~ **Resolved: Promote to tracked file.** The open question registry should be promoted to a git-tracked location for cross-session persistence. During inception pilot, it lives in `working-session/OPEN_QUESTIONS.md`; at canonical promotion time, it moves to a tracked path (coordinate with PRD-006 R2a promotion gates and PRD-005 schema location decisions via OQ-020).
2. ~~Should R4 attribution comments use a standardized format that tooling could parse, or is freeform HTML comment sufficient?~~ **Resolved: Freeform HTML comment is sufficient.** No standardized parseable format required. Agents use `<!-- REV-...: description -->` convention but tooling does not need to parse it programmatically. Keeps overhead low.
3. ~~Should resolved open questions be archived or kept inline with a `resolved` status?~~ **Resolved: Archive.** Resolved open questions should be archived (moved to a separate section or file) rather than kept inline. This keeps the active registry compact and scannable. Current implementation already marks resolved questions inline with strikethrough + resolution text; at scale, move fully-resolved questions to an archive section.

## Implementation plan (inception)

1. Create `working-session/OPEN_QUESTIONS.md` with all current open questions from PRDs 001–004.
2. Add R1 proposal format and R2 response contract to notification protocol (next version bump).
3. Add explicit `Review scope`, `Closure owner`, and interface delta requirements to notification protocol.
4. Apply R4 attribution to PRD-003's reconciled changes retroactively as a test.
5. Codex reviews for consistency with PRD-005 (schema) and PRD-007 (provenance) scopes.
