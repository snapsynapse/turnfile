# Fresh-Context Conformance Probe (PRD-043 R10)

This document defines the operational test that makes PRD-043 Acceptance #6 ("sufficient for a fresh adopter to explain v1 core without reading historical PRDs") a check rather than a claim.

## Method

A fresh-context agent — a cold instance of Claude, Codex, Gemini, or another LLM with no prior Turnfile exposure — is given exactly four files and no other context:

1. `SPEC.md`
2. `DEFINITIONS.md`
3. `docs/MINIMUM_VIABLE_TURNFILE.md`
4. `CONFORMANCE.md`

The agent is asked the five questions below and must answer correctly. Correct answers are recorded as evidence under `working-session/docs/v1-fresh-context-probe-<date>-<agent>.md`.

A passing probe is one fresh-context agent answering all five questions correctly from these four files alone. Two passing probes from independent agent families constitute strong evidence; one passing probe is acceptable for an initial v1 release.

## The five questions

1. What are the three required artifacts in a conforming v1 working session, and what does each one record?
2. Who can transition a message from `actioned` to `closed`, and why is that distinction load-bearing?
3. List the authority order from highest to lowest. Can agent consensus override a maintainer-gated action? Why or why not?
4. A new task is created at revision 5 and claimed at revision 7. A lock with `acquired_rev: 7` and the default lease policy is held. At what revision does the lease expire?
5. Name two optional profiles that a v1 minimal session does not require, and explain where to find their classification.

## Expected answers (graders' key)

1. `TURNFILE.yaml` (coordination state — agents, tasks, locks, revision, signals), `MAILBOX.md` (open and closed messages with inbox snapshot), `WORKLOG.md` (narrative progress and handoff state).
2. Only the sender or the maintainer can close. The receiver can ack, block, or action but cannot close a card they are responding to. The distinction prevents a receiver from unilaterally terminating a request that the sender still has open business on.
3. (1) System/user/tool/repository/local security instructions, (2) recorded maintainer decisions, (3) delegated approval bands, (4) registered task ownership and locks, (5) agent proposals/objections/counter-recommendations. No — agent consensus does not unlock a maintainer-gated action; SPEC §3 and `docs/MINIMUM_VIABLE_TURNFILE.md` "Authority order" both say so explicitly.
4. Revision 10. Default lease expiry is `(coordination.revision - acquired_rev) > 2`, so the first revision strictly greater than `7 + 2` is 10.
5. Any two of: Tokenese, heartbeat stewards, concurrent shard task aggregation, agent onboarding vetting suites, unified terminal transport, public-surface snapshot maintenance, skill-bundle integrity validation. Classification lives in `docs/prds/PRD_SHELF_RECONCILIATION.json`.

## Evidence capture

Per probe, record under `working-session/docs/v1-fresh-context-probe-<date>-<agent>.md`:

- agent identity (model + surface)
- exact prompt given
- exact answers received
- per-question pass/fail
- grader identity

## Failure mode

If a fresh-context agent fails any question, either (a) the four-file set is insufficient — fix the gap by editing `SPEC.md` / `DEFINITIONS.md` / `MINIMUM_VIABLE_TURNFILE.md` / `CONFORMANCE.md`, NOT by adding historical-PRD pointers — or (b) the question is unfair — revise the question. Either path re-runs the probe.

## Integration with PRD-043 R9

A passing probe is one of the inputs to the version-bump guardrail under R9 (`tools/validate-v1-profile.mjs` green + ≥2 agent APPROVE + Maintainer ratify). A failing probe blocks the 0.x → 1.0 version bump.
