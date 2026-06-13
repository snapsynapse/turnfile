# PRD-022: Decision-Mirror Delivery Contract

Status: Draft v1 (working-session; agent gates complete, Maintainer acceptance pending)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (session 14 draft by Claude)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted with amendment | MSG-20260613-028 reply: Codex APPLY with amendment resolving OQ-065 and adding bound-party receiver validation |
| Claude acceptance | accepted | author; Codex amendment (R2.5 relay default, R5.4 bound-party validator check) reviewed and accepted 2026-06-13 — both match Claude positions |
| Maintainer acceptance | pending | drafting green-lit by Maintainer 2026-06-12 |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

## Input Provenance Tags

1. `observed`: Session 14 gap — decision mirrors MSG-20260612-019/021 were posted closed-on-posting per the MSG-20260211-007 reference pattern and generated no unread flag; Codex learned of their content only via an explicit sync message (MSG-20260612-022).
2. `explicit`: Codex amendment in MSG-20260612-023: split mirrors into `audit-mirror` and `delivery-mirror` modes rather than mandating delivery guarantees everywhere; per-session digest is defense-in-depth, not the primary guarantee.
3. `explicit`: Claude design point flagged in MSG-20260612-024: decision-significant mirrors should default to the guaranteed mode.
4. `derived`: Maintainer clarification 2026-06-12 (protocol cadence vs interaction gearing): delivery guarantees must be defined in protocol terms (session turns), never in wall-clock terms, so harness speed differences never change what an agent owes.

## Alignment reference

This PRD aligns with:

1. `docs/prds/PRD-003-message-lifecycle-sla-contract.md` (lifecycle, SLA tiers)
2. `docs/prds/PRD-004-maintainer-decision-contract.md` (decision recording, relay format)
3. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md` (R4 chat-to-mailbox mirroring — this PRD extends R4)
4. `docs/prds/PRD-013-turnfile-coordination-format.md` (signals are not a delivery channel for rationale)

## Problem

PRD-019 R4 requires chat-originated decisions to be mirrored into the mailbox, and the reference pattern (MSG-20260211-007) closes mirrors on posting. A closed message never appears in any agent's unread count, so:

1. The audit record exists, but no peer is ever *prompted* to read it.
2. A decision can bind an agent's future work without that agent having any lifecycle event pointing at it.
3. Discovery depends on peers happening to re-read the Closed Summary, or on ad hoc sync messages — both unreliable, the second unrecorded as a requirement.

Session 14 evidence: MSG-019 (triage decisions) and MSG-021 (baseline/README direction) were invisible to Codex until MSG-022 manually flagged them.

## Goal

1. Split mirrors into two explicit modes with different delivery semantics and costs.
2. Guarantee that decisions binding a peer's work generate a lifecycle event for that peer.
3. Keep low-significance mirroring cheap so the mirror habit survives.
4. Define all guarantees in session-turn terms (protocol cadence), independent of harness gearing.

## Non-goals

1. Replacing PRD-019 R4. This PRD refines the mirror record it already requires.
2. Guaranteeing *comprehension* — delivery is an ack, not a quiz.
3. Creating wall-clock deadlines. All SLAs remain session-turn-based per PRD-003.
4. Changing signal semantics. TURNFILE signals remain lightweight coordination, not a delivery channel.

## Requirements

## R1. Mirror modes

Every chat-decision mirror declares one mode in its card:

1. `audit-mirror`: records the decision for the audit trail. Posted with `Status: closed` on posting (current pattern). No delivery guarantee, no ack required, no unread flag. Cheap by design.
2. `delivery-mirror`: guarantees peer awareness. Posted with `Status: unread` addressed to every non-deciding participant whose future work the decision binds. Each receiver acks; the sender (or Maintainer) closes after all acks or after SLA lapse with the lapse recorded.

A mirror card without a declared mode is treated as `delivery-mirror` (fail-safe toward delivery).

## R2. Mode selection rule

1. **Default for decision-significant content is `delivery-mirror`.** A decision is significant to a peer if it changes: that peer's task scope or ownership; protocol rules or artifact conventions the peer must follow; acceptance/promotion state of an artifact the peer reviewed or owns; standing directives governing peer behavior (e.g. collision discipline, encoding rules).
2. `audit-mirror` is an explicit downgrade, permitted when the decision binds no peer's future work (e.g. Maintainer ratifies a record of an action already completed and closed, with no follow-on obligations).
3. When the deciding participant is uncertain, `delivery-mirror` is mandatory (fail-safe).
4. The Maintainer may override any mode selection in either direction at any time.
5. Maintainer-decision relays using the PRD-004 blockquote pattern default to `delivery-mirror`. They may be downgraded to `audit-mirror` only when the relay explicitly states that it binds no peer's future work and no non-deciding participant needs lifecycle awareness.

## R3. Delivery semantics (session-turn terms)

1. A `delivery-mirror` carries P1 SLA per PRD-003: each addressed receiver acks within its next session turn.
2. Receiver ack means: read, understood as binding context. Ack is not approval — objections still route through the normal counter/decision flow.
3. After all acks, the sender closes with outcome noted. On SLA lapse, the sender may close with the lapse recorded and the unacked receiver named; the lapsed receiver must reconcile on its next boot (interacts with PRD-023 R3 drift check).
4. Harness gearing (loops, polling) may make delivery fast; it never changes what is owed. An agent with no loop capability conforms by acking on its next natural turn.

## R4. Session digest (defense-in-depth)

At session close (PRD-014 surface), the closing agent's checklist includes a mirror digest check: every `delivery-mirror` posted this session is terminal (closed, or lapse-recorded). A non-terminal delivery-mirror blocks session close the same way unread messages do. `audit-mirror`s are listed in the digest by ID only, giving peers one predictable discovery point per session.

## R5. Documentation propagation

On acceptance:

1. `docs/prds/PRD-019-...` R4: mirror record gains the mode field; reference pattern updated (MSG-20260211-007 remains the `audit-mirror` example; a session 14 delivery case becomes the `delivery-mirror` example).
2. Mailbox card template: `Mode: audit-mirror | delivery-mirror` line for mirror-type messages.
3. Agent skill bundles: mode selection rule in the mailbox module; digest check in the session-close module.
4. `tools/validate-mailbox-invariants.mjs`: warn on mirror cards without a mode; error on closed `delivery-mirror` without all acks or a recorded lapse; warn when a `delivery-mirror` receiver set appears not to include all participants bound by the decision text.

## Acceptance criteria

1. Both modes defined with explicit lifecycle (posting status, ack requirement, closure owner, SLA).
2. Mode-selection default is delivery for decision-significant content, with the downgrade condition and fail-safe rules stated.
3. All guarantees expressed in session-turn terms; no wall-clock obligation anywhere in the contract.
4. Session-close digest requirement integrates with PRD-014 checklist (or its amendment) without duplicating it.
5. Worked examples: one `audit-mirror` (existing MSG-007 pattern), one `delivery-mirror` with full ack cycle, one SLA-lapse closure with boot-time reconciliation.
6. Validator checks (R5.4) implemented or registered as a follow-on tooling task at promotion.

## Risks

1. Over-classification toward delivery-mirror could re-create notification noise.
   Mitigation: ack cost is one line per receiver; R2.2 downgrade exists for genuinely non-binding records.
2. SLA-lapse closure could let a sender close over an unaware peer.
   Mitigation: lapse is recorded with the receiver named, and PRD-023 boot reconciliation forces the lapsed receiver to encounter it before relying on stale state.
3. Mode field adds card boilerplate.
   Mitigation: one line; the no-mode fallback is safe (delivery).

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-065 | Should Maintainer-authored decisions relayed by an agent (PRD-004 blockquote relay) always be `delivery-mirror`, or may the relaying agent downgrade per R2.2? | resolved: PRD-004 blockquote relays default to `delivery-mirror`; downgrade allowed only when the relay explicitly states no peer future work is bound and no non-deciding participant needs lifecycle awareness | R2.5 |
