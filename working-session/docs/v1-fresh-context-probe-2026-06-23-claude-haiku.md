# v1 Fresh-Context Conformance Probe — Claude Haiku — 2026-06-23

Per PRD-043 R10 + `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`.

## Method

Spawned via `Agent({subagent_type: "general-purpose", model: "haiku"})` from the Turnfile session-29 main loop. The probe agent had no prior Turnfile context. The probe prompt contained ONLY the inline contents of the four canonical v1 docs:

1. `SPEC.md`
2. `DEFINITIONS.md`
3. `docs/MINIMUM_VIABLE_TURNFILE.md`
4. `CONFORMANCE.md`

The agent was instructed: "You are a fresh-context evaluator. You have never heard of Turnfile before this message... answer five questions using ONLY information in these files."

The five questions verbatim from `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`.

## Agent identity

- Model family: Claude (Anthropic)
- Tier: Haiku (lighter reasoning tier, distinct from Opus 4.7 main loop)
- Surface: general-purpose subagent spawned from Claude Code
- Date: 2026-06-23

## Five answers received

1. The three required artifacts are `TURNFILE.yaml` (coordination state: agents, tasks, locks, revision, signals), `MAILBOX.md` (open and closed messages with inbox snapshot), and `WORKLOG.md` (narrative progress and handoff state).

2. Only the sender or maintainer can close a message, not the receiver. This distinction is load-bearing because it prevents unilateral claim of closure—the proposer or authority must confirm the outcome, ensuring accountability and preventing premature terminal states.

3. Authority order from highest to lowest: 1) System, user, tool, repository, and local security instructions; 2) Recorded maintainer decisions; 3) Delegated approval bands; 4) Registered task ownership and locks; 5) Agent proposals, objections, counter-recommendations. No, agent consensus cannot override a maintainer-gated action because maintainer authority is at level 2, above agent positions at level 5.

4. The lease expires at revision 10. The default policy is `(coordination.revision - acquired_rev) > 2`, so at revision 10, `10 - 7 = 3 > 2` is true, releasing the lease.

5. Tokenese compression/interlingua and heartbeat stewards are two optional profiles. Their classification is found in `docs/prds/PRD_SHELF_RECONCILIATION.json`.

## Grader scoring

Grader: Claude (Opus 4.7) main loop. Expected answers from `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`.

| Q | Pass/Fail | Notes |
|---|-----------|-------|
| 1 | PASS | Correctly names all three artifacts; per-artifact records line up with MVT "Core v1 artifacts" section. |
| 2 | PASS | Identifies sender + maintainer as the only closers; states the load-bearing reason (prevents unilateral receiver termination, preserves accountability). Matches MVT "Message lifecycle". |
| 3 | PASS | Lists all five authority tiers in correct order; correctly answers that agent consensus cannot override maintainer-gated actions and cites the per-tier ranking as the reason. Matches SPEC §3 + MVT "Authority order". |
| 4 | PASS | Correctly computes revision 10 from the formula `(revision - acquired_rev) > 2`; shows arithmetic. Matches MVT "Locks and revision". |
| 5 | PASS | Names two valid optional profiles (Tokenese, heartbeat stewards) and correctly identifies `docs/prds/PRD_SHELF_RECONCILIATION.json` as the classification location. Matches MVT + CONFORMANCE. |

**Overall: 5/5 PASS.**

## Evidence integrity

- The probe agent's response contained only the five numbered answers in the format requested — no preamble, no follow-up, no fabricated material.
- No file system access was granted; the agent could only reason from the inline content.
- The four-file packet contained no historical-PRD references (verified by `tools/validate-v1-profile.mjs` regex C2 scan).

## Conclusion

The v1 Minimum Governance Profile (SPEC.md + DEFINITIONS.md + docs/MINIMUM_VIABLE_TURNFILE.md + CONFORMANCE.md) is sufficient for a fresh-context Claude-family agent at the Haiku tier to correctly answer all five core conformance questions. This satisfies PRD-043 R10 evidence requirement.

This evidence file satisfies the `working-session/docs/v1-fresh-context-probe-*` glob check added by Codex's PRD-043 R10 hardening (MSG-20260623-024).
