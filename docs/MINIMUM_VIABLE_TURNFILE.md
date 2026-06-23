# Minimum Viable Turnfile (v1.0.0)

This is the smallest conforming Turnfile session. It is sufficient for a fresh adopter to run a v1 session without reading historical PRDs. For the full normative contract see `SPEC.md`; for vocabulary see `DEFINITIONS.md`; for verifier-anywhere claims see `CONFORMANCE.md`.

## What Turnfile is

A thin governance layer for peer agent collaboration with maintainer authority, recorded in plain files as a file-based source of truth. Turnfile does not execute agents, manage memory, or replace your runtime. It records who is participating, what work is claimed, what positions and counter-recommendations were raised, what the maintainer decided, and what closeout evidence supports the result.

## Core v1 artifacts

A conforming v1 session MUST include three files in a `working-session/` directory:

- `TURNFILE.yaml` — coordination state (agents, tasks, locks, revision, signals)
- `MAILBOX.md` — open and closed messages with inbox snapshot
- `WORKLOG.md` — narrative progress and handoff state

A conforming v1 session MAY also include:

- `MAILBOX.json` — generated projection (not source of truth)
- `OPEN_QUESTIONS.md` — cross-PRD question registry
- per-agent boot notes and archive files

Anything else is an optional profile (see `docs/prds/PRD_SHELF_RECONCILIATION.json`).

## Roles

- **Maintainer** — single arbiter. Sets scope, ratifies decisions, breaks ties. Maintainer authority overrides agent consensus.
- **Agents** — peer participants. Propose, review, counter, implement. No agent is "in charge" of another.
- **Observer** (optional) — read-only participant. May produce evidence under a relay boundary; no shared-write authority.

## Authority order

Higher binds lower:
1. System / user / tool / repository / local security instructions
2. Recorded maintainer decisions
3. Delegated approval bands
4. Registered task ownership and locks
5. Agent proposals, objections, counter-recommendations

Agent consensus does not unlock a maintainer-gated action.

## Message lifecycle

Five states: `unread → acknowledged → blocked → actioned → closed`. Only the receiver can ack, block, or action. Only the sender or maintainer can close. Messages requiring response stay in the open queue until terminal. Counter-recommendations are first-class — never silently collapsed into a final summary.

Three priority tiers: P0 (next turn), P1 (next session), P2 (best effort).

## Task lifecycle

Tasks live in `TURNFILE.yaml` under `coordination.tasks.<id>`. Required fields: `description`, `owner`, `status` (one of `pending|claimed|in_progress|done|blocked|cancelled`), `priority`, `depends_on`, `created_by`, `created_rev`, `claim_rev`, `completed_rev`. Only the owner may transition a task to `done`.

## Locks and revision

`coordination.revision` is monotonic; every mutation should increment it. Locks identify holder, artifact, purpose, and acquired revision. Lease expiry is revision-based, not wall-clock — typical default `(coordination.revision - acquired_rev) > 2` releases the lease.

## Closeout evidence

A session closes by recording in `WORKLOG.md`: what changed, validation output, next owner, open items. Evidence may reference external artifacts (commits, PRs, traces) rather than duplicating them. The maintainer ratifies; agents do not self-ratify their own closeout.

## Validation

A v1 session is verified by `tools/validate-v1-profile.mjs --root <session-path>`. Pass means: required artifacts present, mailbox inbox snapshot matches the open queue, no historical-PRD dependency in the minimal profile, schema matches `schemas/v1/turnfile-v1.schema.json`.

## Worked example: one session, open → mid-turn → close

Two agents (Alex and Blake) and a maintainer (M) collaborate on a feature.

### Open

M opens the session by directing Alex to scope work. Alex writes a task to `TURNFILE.yaml`:

```yaml
coordination:
  revision: 1
  tasks:
    s1-feature-x:
      description: "Draft contract for feature X."
      owner: "alex"
      status: "in_progress"
      priority: "P1"
      depends_on: []
      created_by: "alex"
      created_rev: 1
      claim_rev: 1
      completed_rev: null
```

Alex appends to `WORKLOG.md`:

```
Alex: SESSION 1 OPEN at rev 1. Scoped s1-feature-x; drafting contract.
```

### Mid-turn

Alex drafts the contract, posts an apply-or-counter request to Blake via `MAILBOX.md`:

```
### MSG-20260101-001
From: Alex -> Blake
Status: unread
Subject: Feature X contract — apply or counter
Closure owner: Alex
```

Blake reads, finds a gap, posts a counter-recommendation (not silent edit):

```
**Ack:** Blake 2026-01-01 — counter C1: handle null input case. Apply with amendment.
```

Alex accepts C1, updates the contract, bumps revision, marks task `done`. Blake reviews and signs off. M ratifies the closeout in `WORKLOG.md` with a decision row.

### Close

Alex appends closeout to `WORKLOG.md`:

```
Alex: SESSION 1 CLOSED at rev 7. Delivered: feature X contract with null-handling amendment per Blake C1. Maintainer ratified. Next owner: Blake (implementation). Open items: none.
```

`MAILBOX.md` Closed Summary records MSG-001 outcome. `TURNFILE.yaml` shows `s1-feature-x.status=done`, `completed_rev=7`. Validator runs clean. Session is verifiable from these three files alone.

## Two participation tiers

Per Maintainer ruling 2026-06-23 (OQ-043-1), v1 supports two tiers of conformance:

- **v1-minimal** — lesser-level participation. This document is the contract. No skill bundles required. Suitable for agents whose runtime does not load skill bundles.
- **v1-full** — full participation, including PRD authorship, eval authoring, and required-reviewer roles. Adds the skill-bundle integrity profile (PRD-012 + PRD-033) on top of v1-minimal.

Both tiers share the same three core artifacts. `docs/prds/PRD_SHELF_RECONCILIATION.json` records per-PRD `required_for_minimal_profile` and `required_for_full_participation` flags.

## What v1 does not require

The following are real Turnfile work but optional profiles, not v1 core:

- **Tokenese** compression / interlingua (optional profile)
- **Heartbeat** stewards and read-only monitors (optional profile)
- **Concurrent shard** task aggregation (optional profile)
- **Agent onboarding** vetting suites (optional profile)
- **Unified terminal transport** (optional profile)
- **Public-surface snapshot** maintenance (optional profile)
- **Skill-bundle integrity** validation (optional profile)

A v1 session can run with none of these. See `docs/prds/PRD_SHELF_RECONCILIATION.json` for the full classification.

## Getting started

1. Copy `templates/v1-minimal/` to your project.
2. Name maintainer and agents in `working-session/TURNFILE.yaml`.
3. Register the first task; one agent claims it.
4. Use `MAILBOX.md` for cross-agent review with apply-or-counter.
5. Record maintainer decisions inline in `WORKLOG.md` or alongside the relevant message.
6. Run `node tools/validate-v1-profile.mjs --root . --format json` before close.
7. Close with next owner and open items.

That is the entire v1 surface.
