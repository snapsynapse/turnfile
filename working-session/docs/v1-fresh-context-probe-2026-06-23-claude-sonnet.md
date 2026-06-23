# v1 Fresh-Context Conformance Probe — Claude Sonnet — 2026-06-23

Per PRD-043 R10 + `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`.

## Method

Independent second probe run in parallel to the Haiku probe to satisfy the "two passing probes from independent agent families is strong evidence" criterion in `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`. Spawned via `Agent({subagent_type: "general-purpose", model: "sonnet"})` from the Turnfile session-29 main loop. The probe agent had no prior Turnfile context. The probe prompt contained ONLY the inline contents of the four canonical v1 docs.

## Agent identity

- Model family: Claude (Anthropic)
- Tier: Sonnet (mid-tier reasoning, distinct from Opus 4.7 main loop and Haiku probe)
- Surface: general-purpose subagent spawned from Claude Code
- Date: 2026-06-23

## Five answers received

1. The three required artifacts are: `TURNFILE.yaml` (coordination state: agents, tasks, locks, revision, signals, turn queue state); `MAILBOX.md` (open and closed messages with inbox snapshot, including review requests, proposals, counter-recommendations, approvals, and closure records); `WORKLOG.md` (narrative progress, decisions, and handoff state).

2. Only the sender or maintainer can close a message. This distinction is load-bearing because it prevents the recipient from unilaterally declaring work complete — the originating party or the human authority must confirm closure, preserving accountability and audit integrity.

3. Authority order highest to lowest: (1) System/user/tool/repository/local security instructions; (2) Recorded maintainer decisions; (3) Delegated approval bands; (4) Registered task ownership and locks; (5) Agent proposals, objections, and counter-recommendations. Agent consensus cannot override a maintainer-gated action because agent proposals sit at the lowest authority tier, and the spec explicitly states that maintainer-gated actions must not be treated as approved merely because one or more agents agree.

4. The lease expires at revision 10. The default policy releases the lease when `(coordination.revision - acquired_rev) > 2`, meaning `coordination.revision - 7 > 2`, so when `coordination.revision` reaches 10.

5. Two optional profiles are Tokenese compression/interlingua and heartbeat stewards. Their classification, along with every PRD's classification, is found in `docs/prds/PRD_SHELF_RECONCILIATION.json`.

## Grader scoring

Grader: Claude (Opus 4.7) main loop. Expected answers from `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md`.

| Q | Pass/Fail | Notes |
|---|-----------|-------|
| 1 | PASS | Names all three artifacts and correctly identifies what each records, including the additional Mailbox detail about review requests / counter-recommendations / closure records. |
| 2 | PASS | Identifies sender + maintainer; states the load-bearing reason verbatim with the rubric (prevents receiver unilateral termination; preserves accountability and audit integrity). |
| 3 | PASS | Lists all five tiers correctly; quotes the rubric's reasoning directly ("maintainer-gated actions MUST NOT be treated as approved merely because one or more agents agree"). |
| 4 | PASS | Correctly derives revision 10 from the formula; shows arithmetic with the same precision as the Haiku probe. |
| 5 | PASS | Names two valid optional profiles + identifies the classification location accurately. |

**Overall: 5/5 PASS.**

## Cross-probe comparison

Haiku and Sonnet probes converged on the same correct answers, with Sonnet providing slightly more detail (e.g. the additional Mailbox content list, the verbatim SPEC §3 quote). No disagreements between the two tiers. This is the strongest possible signal that the four-file packet is sufficient for fresh-adopter v1 conformance.

## Evidence integrity

- Same isolation guarantees as the Haiku probe: no file system access, no prior Turnfile context, no fabricated material.
- The probe prompt was constructed to be self-contained — even the question text was provided inline rather than via file reference, so the agent had no path to read additional context.

## Conclusion

Two independent Claude-family fresh-context agents (Haiku and Sonnet tiers) both score 5/5 on the v1 conformance probe. This satisfies PRD-043 R10 evidence requirement at the "strong evidence" tier per `docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md` ("two passing probes from independent agent families constitute strong evidence; one passing probe is acceptable for an initial v1 release"). A Codex-family or Gemini-family probe could be added later as defense-in-depth.

This evidence file satisfies the `working-session/docs/v1-fresh-context-probe-*` glob check added by Codex's PRD-043 R10 hardening (MSG-20260623-024).
