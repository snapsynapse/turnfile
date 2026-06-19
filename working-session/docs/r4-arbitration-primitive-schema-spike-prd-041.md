# PRD-041 R4 Arbitration Primitive Schema Spike
Date: 2026-06-19
Owner: Codex
Scope: PRD-041 implementation sub-lane, before `evals/prd-041.evals.mjs`

## Purpose

Define the event-sourced arbitration primitive required by PRD-041 R4 before router and projector implementation begins.

This is not a replacement for PRD-031 per-agent physical shards. Shards solve concurrent file writes. This primitive serializes semantic turns, resource access, delivery state, and Maintainer gates.

## Recommended Files

- `working-session/agents/<agent>/arbitration.jsonl`: append-only arbitration events emitted by each participant or router adapter.
- `schemas/prd-041/arbitration-event-v0.schema.json`: JSON Schema for one arbitration event.
- Future derived view: `tools/aggregate-coordination.mjs --emit arbitration-json` or a sibling reducer reused by that tool.

## Event Identity

Arbitration event IDs should be namespaced like PRD-031 shard IDs:

```text
ARB-<agent>-<YYYYMMDD>-<NNNN>
```

Examples:

```text
ARB-codex-20260619-0001
ARB-router-20260619-0042
ARB-maintainer-20260619-0003
```

Required identity fields:

```json
{
  "schema_version": "prd-041-arbitration-event-v0",
  "id": "ARB-codex-20260619-0001",
  "ts": "2026-06-19T05:45:00.000Z",
  "actor": "codex",
  "kind": "request_turn",
  "resource": {
    "kind": "shard",
    "id": "working-session/agents/codex/outbox.jsonl"
  },
  "turn_ref": "TURN-codex-20260619-0001",
  "deps": []
}
```

`ts` is recorded for operator inspection and deterministic tie-breaking after `deps`; lease validity must not depend on wall-clock time.

## Event Kinds

Minimum Phase 1 event kinds:

| Kind | Actor | Purpose |
|---|---|---|
| `request_turn` | participant/router | Request semantic write turn for a resource. |
| `grant_turn` | router | Grant the request and start a lease. |
| `deny_turn` | router | Reject impossible or unauthorized request. |
| `renew_turn` | holder/router | Extend an active lease by deterministic revision/event budget. |
| `release_turn` | holder/router | Release a held turn after delivery/projection completes. |
| `expire_turn` | router | Deterministically expire a stale lease. |
| `delivery_update` | router/adapter | Record delivery state for a routed event. |
| `gate_request` | router/agent | Surface governance action for Maintainer decision. |
| `gate_decision` | maintainer | Approve, reject, or defer a gated governance action. |
| `interrupt` | maintainer | Pause or stop routing without assigning a new holder. |
| `preempt` | maintainer | Revoke an active holder and optionally grant another request. |

## Core Fields

Every event:

```json
{
  "schema_version": "prd-041-arbitration-event-v0",
  "id": "ARB-<agent>-<YYYYMMDD>-<NNNN>",
  "ts": "ISO-8601 string",
  "actor": "codex|claude|gemini|maintainer|router|perplexity",
  "kind": "request_turn",
  "resource": {
    "kind": "shard|conversation|governance|projection|adapter",
    "id": "stable logical resource id"
  },
  "turn_ref": "stable turn id or null",
  "deps": ["prior event ids"]
}
```

Turn lease events add:

```json
{
  "lease": {
    "holder": "codex",
    "grant_event": "ARB-router-20260619-0002",
    "start_rev": 328,
    "lease_revs": 2,
    "expires_after_rev": 330
  }
}
```

Delivery events add:

```json
{
  "delivery": {
    "message_event": "MSG-codex-20260619-0001",
    "adapter": "codex-headless",
    "state": "queued|delivering|delivered|acked|failed|replayed|blocked",
    "attempt": 1,
    "dedupe_key": "sha256:<hash>"
  }
}
```

Gate events add:

```json
{
  "gate": {
    "governance_kind": "prd_acceptance|prd_promotion|lock_override|onboarding_rung|protocol_change",
    "target": "PRD-041",
    "decision": "requested|approved|rejected|deferred",
    "maintainer_event": "ARB-maintainer-20260619-0003"
  }
}
```

Interrupt and preempt events add:

```json
{
  "preempt": {
    "target_turn_ref": "TURN-codex-20260619-0001",
    "reason": "maintainer override",
    "next_holder": "maintainer"
  }
}
```

## Derived State

A deterministic reducer over all per-agent `arbitration.jsonl` files produces:

```json
{
  "schema_version": "prd-041-arbitration-state-v0",
  "resources": {
    "working-session/agents/codex/outbox.jsonl": {
      "holder": "codex",
      "turn_ref": "TURN-codex-20260619-0001",
      "state": "granted",
      "expires_after_rev": 330,
      "queue": ["TURN-claude-20260619-0001"]
    }
  },
  "deliveries": {
    "MSG-codex-20260619-0001": {
      "state": "delivered",
      "attempts": 1,
      "adapter": "codex-headless"
    }
  },
  "gates": {
    "PRD-041/prd_promotion": {
      "state": "requested",
      "requested_by": "claude"
    }
  },
  "interrupts": []
}
```

Reducer ordering:

1. Causal `deps` order.
2. Lexicographic `ts`.
3. Lexicographic `id`.

Cycle fallback matches `tools/aggregate-coordination.mjs`: emit acyclic prefix, then cycle remainder in stable base order with a conflict entry.

## Lifecycle Rules

1. `request_turn` enters the resource queue unless blocked by an unresolved gate.
2. `grant_turn` is valid only if the target request is the queue head or the actor is `maintainer`.
3. A resource can have at most one active non-expired holder.
4. `release_turn` clears the holder only when emitted by the holder, router, or Maintainer.
5. `expire_turn` clears the holder only when `current_rev > expires_after_rev`.
6. `preempt` by Maintainer clears the holder regardless of lease status and records an audit edge to the interrupted turn.
7. Governance events never auto-apply from `gate_request`; only `gate_decision` with `decision: "approved"` can unblock the corresponding governance transition.
8. `delivery_update` must be idempotent by `dedupe_key`; duplicate delivered events collapse to one delivered state and increment replay evidence, not semantic delivery count.

## Eval Hooks for Claude

Suggested `evals/prd-041.evals.mjs` cases:

1. Schema rejects arbitration events missing `resource`, `turn_ref`, `kind`, `actor`, or `id`.
2. Reducer grants only one holder per resource when two agents request the same shard.
3. Queue order is deterministic under same timestamp, using event id tie-break.
4. Lease expiry is revision-based and deterministic, not wall-clock based.
5. Maintainer `preempt` overrides an active lease and records the interrupted turn.
6. `gate_request` for PRD acceptance does not apply acceptance until a Maintainer `gate_decision` approves it.
7. Duplicate delivery updates with the same `dedupe_key` do not create duplicate delivered turns.
8. Bridged participant events, such as Gemini/Antigravity, reduce through the same log without requiring a terminal adapter.
9. Direct edits to projected markdown are outside this primitive and remain PRD-023 reconciliation inputs; arbitration state derives only from event logs.

## Implementation Notes

The first implementation should prefer a pure reducer with fixture inputs before any live router:

1. Add the JSON Schema.
2. Add a read-only reducer function.
3. Add fixture arbitration shards under a temp eval directory.
4. Extend or compose with `tools/aggregate-coordination.mjs`; do not hand-edit projected markdown in the reducer.
5. Only after RED evals pass should router delivery or terminal integration begin.

## Open Edge Cases

1. Whether `router` gets its own shard namespace or writes only derived delivery events into target participant shards.
2. Whether `expires_after_rev` should reference Turnfile coordination revision in Phase 1 or a router-local event sequence once Turnfile becomes a projection.
3. Whether Maintainer interrupt should pause all resources by default or only named resources.
4. Whether delivery receipts belong in `arbitration.jsonl` or a separate `delivery.jsonl` file with a shared reducer.
