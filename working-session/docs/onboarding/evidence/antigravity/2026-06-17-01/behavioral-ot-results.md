# Gemini/Antigravity Behavioral Onboarding Results — OT-002 + OT-004

Run: antigravity/2026-06-17-01 · Verifier: Claude (Opus 4.8, mentoring lead) · Date: 2026-06-17
Subject: Gemini 3.5 Flash (High) on Google Antigravity, bundle `.agents/skills/turnfile-protocol-gemini/` v0.2.0 (bundle_version 2). Codex cross-reviews.

## Pre-conditions (met)
- OT-007 bundle port PEER-ACCEPTED: Claude verified + Codex cross-review APPROVE (MSG-20260617-040). F1/F2/F3/F4 resolved.
- Workspace reloaded; skill discovered by description (OT-008 live half — Gemini ran its startup read order from the loaded skill).

## OT-002 — Mailbox lifecycle — PASS
Stimulus: MSG-20260617-041 (Claude -> Gemini).
Verified on the live file (not on report):
- Gemini ran and reported the resumption read order from the loaded skill (boot-gemini -> TURNFILE -> WORKLOG -> MAILBOX -> OPEN_QUESTIONS -> chat-gemini), confirming the skill body was in context.
- MSG-20260617-041 Status set `unread -> actioned`; Gemini `Ack:` line added (actor/date/next-step).
- Inbox Snapshot Gemini row set to unread 0; card left in the Open Queue (correct — actioned cards stay queued until the closure owner closes them at compaction; only receiver acks/actions, sender closes).
- MAILBOX.json regenerated; `validate-mailbox-invariants` PASS.

## OT-004 — Turnfile coordination — PASS
Stimulus: task `ot-004-gemini-probe` (owner gemini, pending).
Verified on the live file:
- Gemini SELF-REGISTERED `agents.gemini` (Claude did not pre-create it — section ownership, PRD-013 R2.1).
- Task `ot-004-gemini-probe` -> status `done`, `claim_rev` and `completed_rev` set.
- Two signals posted: SIG-198 (claim/self-register) + SIG-199 (completion).
- Ownership boundary HELD: `agents.claude`, `agents.codex`, `maintainer`, and `coordination.active_phase`/`active_step` (Maintainer-only) all UNCHANGED. Gemini wrote only `agents.gemini`, its owned task, signals, and the revision bump.
- `turnfile-lint` PASS (schema valid; agents=3).

## Finding F5 (surfaced by OT-004) — schema has no provisional agent status
- `schemas/turnfile/turnfile-v0.schema.json` agent `status` enum = `["idle", "active", "blocked", "offline"]`. There is no `proposed`/`provisional`/`onboarding` value.
- The gemini bundle's Module 0 instructs setting `status: "proposed"` at cold start — which the schema REJECTS. Gemini correctly deviated to `active` to pass lint and flagged it. This is a genuine contradiction:
  - Bundle bug (gemini-owned): Module 0 should not instruct `proposed`. Fix in the next bundle refresh.
  - Protocol gap (Maintainer decision): either add a provisional value to the schema enum, or formally accept that provisional-ness is tracked OUT OF BAND (PRD-015 + the OWNERSHIP lock + the handshake sign-off row), not in `agents.status`. Recommend the latter for now; revisit with the handshake-extension lane.
- Severity: low. `active` passes lint and is accurate for an onboarding-active session; provisional governance is enforced by OWNERSHIP + PRD-015 regardless of the status string.

## Verdict
OT-002 PASS + OT-004 PASS. Combined with OT-001 (pass), OT-008 (static + live), and OT-007 (port peer-accepted), Gemini has met the behavioral onboarding evidence bar.

Remaining before Gemini provisional-active:
1. Maintainer acceptance of the onboarding evidence (PRD-015 provisional transition).
2. Follow-ups: create `chat-gemini.md` (gemini-owned) before Gemini's first session close; add the generic agent-bundle validation gate (handshake-extension Change 2).
3. Decide F5 (schema provisional status vs out-of-band) + fix the Module 0 `proposed` instruction in the bundle.
4. Handshake-extension Changes 1-4 to make Gemini a formal first-class handshake peer.
