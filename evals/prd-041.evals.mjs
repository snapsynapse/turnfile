// PRD-041 R4 arbitration-primitive evals — event-sourced turn/gate/delivery arbitration.
// Proposer/eval-author: Claude. Expected implementer: Codex. Reviewer: Gemini/Claude.
// EXPECTED TO FAIL (RED) until Codex implements:
//   - schemas/prd-041/arbitration-event-v0.schema.json
//   - a deterministic reducer exposed as
//     `node tools/aggregate-coordination.mjs --shards <dir> --emit arbitration-json --rev <N>`
//     emitting a `prd-041-arbitration-state-v0` document.
// Contract source: working-session/docs/r4-arbitration-primitive-schema-spike-prd-041.md
// (Codex spike, "Eval Hooks for Claude" cases 1-9).
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/aggregate-coordination.mjs");
const SCHEMA = path.join(root, "schemas/prd-041/arbitration-event-v0.schema.json");

function tmpShards(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd041-${name}-`));
}

// Write one agent's arbitration.jsonl from an array of event objects.
function writeShard(dir, agent, events) {
  const adir = path.join(dir, agent);
  fs.mkdirSync(adir, { recursive: true });
  fs.writeFileSync(
    path.join(adir, "arbitration.jsonl"),
    events.map((e) => JSON.stringify(e)).join("\n") + "\n",
    "utf8",
  );
}

// Run the reducer and return the parsed arbitration-state JSON. Fails (RED) until
// the --emit arbitration-json mode exists and returns valid JSON at status 0.
function reduce(shardsDir, rev) {
  assert.equal(fs.existsSync(TOOL), true, "tools/aggregate-coordination.mjs must exist");
  const args = ["--shards", shardsDir, "--emit", "arbitration-json"];
  if (rev !== undefined) args.push("--rev", String(rev));
  const res = spawnSync(process.execPath, [TOOL, ...args], { cwd: root, encoding: "utf8" });
  assert.equal(res.status, 0, `reducer must exit 0 for --emit arbitration-json; stderr: ${res.stderr}`);
  let state;
  try {
    state = JSON.parse(res.stdout);
  } catch {
    assert.fail(`reducer stdout must be JSON; got: ${res.stdout.slice(0, 200)}`);
  }
  assert.equal(
    state.schema_version,
    "prd-041-arbitration-state-v0",
    "reduced state must declare schema_version prd-041-arbitration-state-v0",
  );
  return state;
}

// Minimal valid event factory per the spike Core Fields.
let seq = 0;
function ev(actor, kind, extra = {}) {
  seq += 1;
  const n = String(seq).padStart(4, "0");
  return {
    schema_version: "prd-041-arbitration-event-v0",
    id: `ARB-${actor}-20260619-${n}`,
    ts: `2026-06-19T05:00:${String(seq % 60).padStart(2, "0")}.000Z`,
    actor,
    kind,
    resource: { kind: "shard", id: "working-session/agents/codex/outbox.jsonl" },
    turn_ref: null,
    deps: [],
    ...extra,
  };
}

const RES = "working-session/agents/codex/outbox.jsonl";

// Case 1 — schema rejects events missing required identity fields.
test("PRD-041 R4 #1: arbitration-event schema requires id, actor, kind, resource, turn_ref", () => {
  assert.equal(fs.existsSync(SCHEMA), true, "schemas/prd-041/arbitration-event-v0.schema.json must exist");
  const schema = JSON.parse(fs.readFileSync(SCHEMA, "utf8"));
  const required = new Set(schema.required || []);
  for (const field of ["schema_version", "id", "actor", "kind", "resource", "turn_ref"]) {
    assert.ok(required.has(field), `schema.required must include "${field}"`);
  }
  // id must be constrained to the ARB-<agent>-<YYYYMMDD>-<NNNN> grammar.
  const idPat = schema.properties?.id?.pattern;
  assert.ok(idPat, "schema must constrain id with a pattern");
  assert.match("ARB-codex-20260619-0001", new RegExp(idPat));
  assert.doesNotMatch("ARB-codex-1", new RegExp(idPat));
});

// Case 2 — one holder per resource; second requester is queued.
test("PRD-041 R4 #2: reducer grants a single holder and queues the rival request", () => {
  const dir = tmpShards("single-holder");
  writeShard(dir, "codex", [
    ev("codex", "request_turn", { turn_ref: "TURN-codex-20260619-0001" }),
  ]);
  writeShard(dir, "claude", [
    ev("claude", "request_turn", {
      turn_ref: "TURN-claude-20260619-0001",
      resource: { kind: "shard", id: RES },
    }),
  ]);
  writeShard(dir, "router", [
    ev("router", "grant_turn", {
      turn_ref: "TURN-codex-20260619-0001",
      resource: { kind: "shard", id: RES },
      lease: { holder: "codex", grant_event: "ARB-router-20260619-0001", start_rev: 328, lease_revs: 2, expires_after_rev: 330 },
    }),
  ]);
  const state = reduce(dir, 329);
  const r = state.resources?.[RES];
  assert.ok(r, "state.resources must include the contested resource");
  assert.equal(r.holder, "codex", "only the queue-head grant takes the holder");
  assert.deepEqual(r.queue, ["TURN-claude-20260619-0001"], "the rival request is queued, not granted");
});

// Case 3 — deterministic queue order under identical ts via id tie-break.
test("PRD-041 R4 #3: queue order is deterministic by id when timestamps tie", () => {
  const dir = tmpShards("tiebreak");
  const a = ev("claude", "request_turn", { turn_ref: "TURN-claude-20260619-0001", resource: { kind: "shard", id: RES } });
  const b = ev("gemini", "request_turn", { turn_ref: "TURN-gemini-20260619-0001", resource: { kind: "shard", id: RES } });
  a.ts = b.ts = "2026-06-19T05:00:00.000Z"; // force a timestamp tie
  a.id = "ARB-claude-20260619-0001";
  b.id = "ARB-gemini-20260619-0001";
  writeShard(dir, "claude", [a]);
  writeShard(dir, "gemini", [b]);
  const state = reduce(dir, 300);
  assert.deepEqual(
    state.resources?.[RES]?.queue,
    ["TURN-claude-20260619-0001", "TURN-gemini-20260619-0001"],
    "tie on ts must break by lexicographic event id",
  );
});

// Case 4 — lease expiry is revision-based and deterministic, not wall-clock.
test("PRD-041 R4 #4: lease expires by revision (current_rev > expires_after_rev), not by time", () => {
  const dir = tmpShards("lease");
  writeShard(dir, "codex", [ev("codex", "request_turn", { turn_ref: "TURN-codex-20260619-0001", resource: { kind: "shard", id: RES } })]);
  writeShard(dir, "router", [
    ev("router", "grant_turn", {
      turn_ref: "TURN-codex-20260619-0001",
      resource: { kind: "shard", id: RES },
      lease: { holder: "codex", grant_event: "ARB-router-20260619-0001", start_rev: 328, lease_revs: 2, expires_after_rev: 330 },
    }),
  ]);
  assert.equal(reduce(dir, 330).resources?.[RES]?.holder, "codex", "rev==expires_after_rev still held");
  assert.notEqual(reduce(dir, 331).resources?.[RES]?.holder, "codex", "rev>expires_after_rev must release the holder");
});

// Case 5 — Maintainer preempt overrides an active lease and records the interrupted turn.
test("PRD-041 R4 #5: maintainer preempt revokes an active lease and audits the interrupted turn", () => {
  const dir = tmpShards("preempt");
  writeShard(dir, "router", [
    ev("router", "grant_turn", {
      turn_ref: "TURN-codex-20260619-0001",
      resource: { kind: "shard", id: RES },
      lease: { holder: "codex", grant_event: "ARB-router-20260619-0001", start_rev: 328, lease_revs: 2, expires_after_rev: 999 },
    }),
  ]);
  writeShard(dir, "maintainer", [
    ev("maintainer", "preempt", {
      resource: { kind: "shard", id: RES },
      preempt: { target_turn_ref: "TURN-codex-20260619-0001", reason: "maintainer override", next_holder: "maintainer" },
    }),
  ]);
  const state = reduce(dir, 329); // lease not time/rev-expired; only preempt can clear it
  assert.notEqual(state.resources?.[RES]?.holder, "codex", "preempt clears the prior holder regardless of lease");
  const audit = JSON.stringify(state.interrupts || []) + JSON.stringify(state.resources?.[RES] || {});
  assert.match(audit, /TURN-codex-20260619-0001/, "the interrupted turn must be recorded as an audit edge");
});

// Case 6 — governance gate does not auto-apply; needs an approving gate_decision.
test("PRD-041 R4 #6: gate_request stays 'requested' until a maintainer gate_decision approves", () => {
  const dir = tmpShards("gate");
  writeShard(dir, "claude", [
    ev("claude", "gate_request", {
      resource: { kind: "governance", id: "PRD-041/prd_promotion" },
      gate: { governance_kind: "prd_promotion", target: "PRD-041", decision: "requested" },
    }),
  ]);
  const before = reduce(dir, 300);
  assert.equal(before.gates?.["PRD-041/prd_promotion"]?.state, "requested", "request alone must not approve");

  writeShard(dir, "maintainer", [
    ev("maintainer", "gate_decision", {
      resource: { kind: "governance", id: "PRD-041/prd_promotion" },
      gate: { governance_kind: "prd_promotion", target: "PRD-041", decision: "approved", maintainer_event: "ARB-maintainer-20260619-0001" },
    }),
  ]);
  const after = reduce(dir, 301);
  assert.equal(after.gates?.["PRD-041/prd_promotion"]?.state, "approved", "only an approved gate_decision unblocks the gate");
});

// Case 7 — duplicate delivery updates collapse by dedupe_key.
test("PRD-041 R4 #7: duplicate delivery_update with same dedupe_key collapses to one delivered turn", () => {
  const dir = tmpShards("delivery");
  const delivery = (attempt) =>
    ev("router", "delivery_update", {
      resource: { kind: "adapter", id: "codex-headless" },
      delivery: { message_event: "MSG-codex-20260619-0001", adapter: "codex-headless", state: "delivered", attempt, dedupe_key: "sha256:abc" },
    });
  writeShard(dir, "router", [delivery(1), delivery(2)]);
  const d = reduce(dir, 300).deliveries?.["MSG-codex-20260619-0001"];
  assert.ok(d, "delivery state must be tracked");
  assert.equal(d.state, "delivered", "collapses to a single delivered state");
  assert.equal(d.delivered_count ?? 1, 1, "duplicate dedupe_key must not inflate the delivered count");
});

// Case 8 — bridged participant (Gemini/Antigravity) reduces through the same log, no terminal adapter.
test("PRD-041 R4 #8: bridged participant events reduce without a terminal adapter", () => {
  const dir = tmpShards("bridged");
  writeShard(dir, "gemini", [
    ev("gemini", "request_turn", { turn_ref: "TURN-gemini-20260619-0001", resource: { kind: "shard", id: RES } }),
  ]);
  const state = reduce(dir, 300);
  const queued = JSON.stringify(state.resources?.[RES] || {});
  assert.match(queued, /TURN-gemini-20260619-0001/, "a bridged (non-CLI) participant's request must appear in arbitration state");
});

// Case 9 — arbitration state derives ONLY from event logs; projected markdown is out of scope.
test("PRD-041 R4 #9: reducer derives only from arbitration.jsonl; stray markdown is ignored", () => {
  const dir = tmpShards("logonly");
  writeShard(dir, "codex", [ev("codex", "request_turn", { turn_ref: "TURN-codex-20260619-0001", resource: { kind: "shard", id: RES } })]);
  // A direct markdown edit must not perturb arbitration state (PRD-023 reconciliation input, not arbitration input).
  fs.writeFileSync(path.join(dir, "codex", "NOTES.md"), "holder: claude\n", "utf8");
  const state = reduce(dir, 300);
  assert.notEqual(state.resources?.[RES]?.holder, "claude", "markdown must not influence arbitration state");
});
