// PRD-031 Phase 1 implementation evals — Concurrent Multi-Agent Coordination Contract.
// Proposer/eval-author: Claude. Implementer: Codex (tools/aggregate-coordination.mjs + shard layout).
// Reviewer: Claude. RED until tools/aggregate-coordination.mjs exists.
//
// Phase 1 scope (PRD-031 Migration Phase 1, resolves OQ-4): per-agent namespaced ids +
// per-agent append-only signal/message/read-state logs + a derivation tool that regenerates
// the MAILBOX (md + json) and the TURNFILE signal snapshot as a BUILD ARTIFACT (R3: derived on
// read, never a committed merge target). Tasks/agents tables stay hand-authored this phase.
//
// ─────────────────────────────────────────────────────────────────────────────
// SHARD LAYOUT (R1, R2) — the only committed authoritative state in Phase 1:
//
//   <shards>/<agent>/signals.jsonl      append-only, one JSON object per line
//   <shards>/<agent>/outbox.jsonl       append-only, messages this agent sent
//   <shards>/<agent>/read-state.jsonl   append-only, this agent's read/ack/close events
//
// An agent writes ONLY its own shard. Appends from different agents touch different files /
// different bytes, so disjoint concurrent writes merge with zero conflict (AC1).
//
// EVENT SCHEMAS (one object per line; unknown fields ignored, never reordered in place):
//
//   signals.jsonl line:
//     { "id": "SIG-claude-0007", "from": "claude", "to": "all"|"<agent>",
//       "signal": "ready"|"notify"|"yield"|"request_turn"|...,
//       "ts": "2026-06-17T00:00:01Z", "detail": "...", "deps": ["SIG-codex-0004"] }
//     - `deps` (optional) lists event ids this signal happens-after (R6 happens-before edge).
//
//   outbox.jsonl line:
//     { "id": "MSG-claude-20260617-0003", "from": "claude", "to": "codex"|"maintainer"|"all",
//       "date": "20260617", "ts": "...", "priority": "P1", "type": "request",
//       "subject": "...", "body": "...", "deps": [...] }
//
//   read-state.jsonl line:
//     { "reader": "claude", "msg_id": "MSG-codex-20260617-0002",
//       "state": "read"|"acknowledged"|"actioned"|"closed", "ts": "..." }
//
// NAMESPACED IDS (R4): SIG-<agent>-<4+digit seq> and MSG-<agent>-<YYYYMMDD>-<4+digit seq>.
// An agent allocates only within its own namespace, so two agents never contend for one id (AC2).
// The owner segment of every id in a shard MUST equal that shard's agent (derivation flags
// any cross-namespace id as a `namespace-violation` conflict).
//
// ─────────────────────────────────────────────────────────────────────────────
// DERIVATION TOOL CONTRACT — tools/aggregate-coordination.mjs
//
//   node tools/aggregate-coordination.mjs --shards <dir> [--emit json|mailbox-md|mailbox-json]
//
//   --shards <dir>  directory whose immediate subdirectories are agent shards.
//   --emit json (default)  print the aggregate object (below) to stdout.
//   --emit mailbox-md      print a legible MAILBOX.md document to stdout.
//   --emit mailbox-json    print the MAILBOX.json projection to stdout.
//
//   Read-only (R3.2 / PRD-030 R9): the tool never writes, locks, or mutates any shard file.
//   Deterministic (R3.3, AC3): identical shard inputs → byte-identical stdout on every run.
//
//   Aggregate object (--emit json):
//     {
//       "agents": ["claude","codex",...],            // sorted ascending
//       "signals":  [ <signal events in causal order> ],
//       "messages": [ { ...outbox fields, "read_by": { "<reader>": "<state>" } } in causal order ],
//       "snapshot": { "Codex": { "unread": <int>, "oldest_unread": "<MSG-ID|none>" },
//                     "Claude": {...}, "Maintainer": {...} },
//       "namespaces": { "<agent>": { "max_sig": <int>,
//                                    "max_msg": { "<YYYYMMDD>": <int>, ... } }, ... },
//       "conflicts": [ { "kind": "namespace-violation"|"duplicate-id"|..., "detail": "..." } ]
//     }
//
//   CAUSAL ORDER (R6): topological by `deps` happens-before edges, ties broken deterministically
//   by (ts ascending, then id lexicographic). No global revision counter is read or written;
//   any human-facing scalar is computed, never a write target.
//
//   UNREAD DERIVATION: a message addressed to R (to == R, or to == "all" and R != from) is
//   unread by R unless R's read-state carries an event for that msg_id with state in
//   {read, acknowledged, actioned, closed}. oldest_unread = the unread message smallest by
//   (ts, id). Recipients are rendered capitalized (Claude/Codex/Maintainer) in the snapshot.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/aggregate-coordination.mjs");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd031-${name}-`));
}
function sha256(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}
function jsonl(objs) {
  return objs.map((o) => JSON.stringify(o)).join("\n") + (objs.length ? "\n" : "");
}
// Build a shard tree: shards = { agent: { signals: [...], outbox: [...], readState: [...] } }
function writeShards(shards) {
  const dir = tmp("shards");
  for (const [agent, files] of Object.entries(shards)) {
    const adir = path.join(dir, agent);
    fs.mkdirSync(adir, { recursive: true });
    if (files.signals) fs.writeFileSync(path.join(adir, "signals.jsonl"), jsonl(files.signals));
    if (files.outbox) fs.writeFileSync(path.join(adir, "outbox.jsonl"), jsonl(files.outbox));
    if (files.readState) fs.writeFileSync(path.join(adir, "read-state.jsonl"), jsonl(files.readState));
  }
  return dir;
}
function runTool(shardsDir, emit) {
  const args = [TOOL, "--shards", shardsDir];
  if (emit) args.push("--emit", emit);
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}
function aggregate(shardsDir, emit) {
  return JSON.parse(runTool(shardsDir, emit).stdout);
}

// Reusable signal/message builders with sane defaults.
function sig(agent, seq, extra = {}) {
  return {
    id: `SIG-${agent}-${String(seq).padStart(4, "0")}`,
    from: agent,
    to: "all",
    signal: "notify",
    ts: extra.ts || `2026-06-17T00:00:${String(seq).padStart(2, "0")}Z`,
    detail: extra.detail || "fixture",
    ...(extra.deps ? { deps: extra.deps } : {}),
  };
}
function msg(agent, date, seq, to, extra = {}) {
  return {
    id: `MSG-${agent}-${date}-${String(seq).padStart(4, "0")}`,
    from: agent,
    to,
    date,
    ts: extra.ts || `2026-06-17T01:00:${String(seq).padStart(2, "0")}Z`,
    priority: extra.priority || "P1",
    type: extra.type || "request",
    subject: extra.subject || "fixture",
    body: extra.body || "fixture body",
  };
}

// ── AC1: concurrent shard appends from N=3 agents merge + derive cleanly ──────
test("AC1: N=3 disjoint shards derive with no error and contain the union of events", () => {
  const dir = writeShards({
    claude: { signals: [sig("claude", 1), sig("claude", 2)], outbox: [msg("claude", "20260617", 1, "codex")] },
    codex: { signals: [sig("codex", 1)], outbox: [msg("codex", "20260617", 1, "claude")] },
    gemini: { signals: [sig("gemini", 1)] },
  });
  const res = runTool(dir, "json");
  assert.equal(res.status, 0, `tool exited nonzero: ${res.stderr}`);
  const agg = JSON.parse(res.stdout);
  assert.deepEqual(agg.agents, ["claude", "codex", "gemini"]);
  const sigIds = agg.signals.map((s) => s.id).sort();
  assert.deepEqual(sigIds, ["SIG-claude-0001", "SIG-claude-0002", "SIG-codex-0001", "SIG-gemini-0001"]);
  const msgIds = agg.messages.map((m) => m.id).sort();
  assert.deepEqual(msgIds, ["MSG-claude-20260617-0001", "MSG-codex-20260617-0001"]);
  assert.deepEqual(agg.conflicts, []);
});

// ── AC2: ids never collide under concurrency; namespacing is enforced ─────────
test("AC2: concurrent same-seq allocation across agents yields no duplicate ids", () => {
  // Every agent independently allocates seq 1..3 — collision-free only because of namespacing.
  const mk = (a) => ({ signals: [sig(a, 1), sig(a, 2), sig(a, 3)] });
  const dir = writeShards({ claude: mk("claude"), codex: mk("codex"), gemini: mk("gemini") });
  const agg = aggregate(dir, "json");
  const ids = agg.signals.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate signal id under concurrent allocation");
  assert.equal(ids.length, 9);
});

test("AC2: each id carries its owning agent's namespace segment", () => {
  const dir = writeShards({
    claude: { signals: [sig("claude", 1)], outbox: [msg("claude", "20260617", 1, "codex")] },
    codex: { signals: [sig("codex", 1)] },
  });
  const agg = aggregate(dir, "json");
  for (const s of agg.signals) assert.match(s.id, /^SIG-(claude|codex)-\d{4,}$/);
  for (const m of agg.messages) assert.match(m.id, /^MSG-(claude|codex)-\d{8}-\d{4,}$/);
});

test("R4: a cross-namespace id (wrong owner segment in a shard) is flagged, not silently merged", () => {
  // codex shard contains a claude-namespaced signal id → namespace-violation.
  const dir = writeShards({
    codex: { signals: [{ ...sig("claude", 9), from: "codex" }] },
  });
  const agg = aggregate(dir, "json");
  assert.ok(
    agg.conflicts.some((c) => c.kind === "namespace-violation"),
    "expected a namespace-violation conflict for a cross-namespace id",
  );
});

// ── AC3: derivation reproduces a known-good aggregate from a fixed shard set ──
test("AC3: derivation reproduces the known-good fixture (signals order + snapshot)", () => {
  const dir = writeShards({
    claude: {
      signals: [sig("claude", 1, { ts: "2026-06-17T00:00:01Z" })],
      outbox: [msg("claude", "20260617", 1, "codex", { ts: "2026-06-17T01:00:01Z", subject: "review request" })],
    },
    codex: {
      signals: [sig("codex", 1, { ts: "2026-06-17T00:00:02Z", deps: ["SIG-claude-0001"] })],
      readState: [], // codex has NOT read claude's message → it is unread by codex
    },
  });
  const agg = aggregate(dir, "json");
  // Causal order: claude-0001 before codex-0001 (happens-before via deps; ts also earlier).
  assert.deepEqual(agg.signals.map((s) => s.id), ["SIG-claude-0001", "SIG-codex-0001"]);
  assert.deepEqual(agg.snapshot.Codex, { unread: 1, oldest_unread: "MSG-claude-20260617-0001" });
  assert.deepEqual(agg.snapshot.Claude, { unread: 0, oldest_unread: "none" });
  assert.deepEqual(agg.snapshot.Maintainer, { unread: 0, oldest_unread: "none" });
});

// ── R6: deterministic causal ordering ────────────────────────────────────────
test("R6: identical shards produce byte-identical stdout across runs (deterministic)", () => {
  const shards = {
    claude: { signals: [sig("claude", 1), sig("claude", 2)] },
    codex: { signals: [sig("codex", 1)] },
  };
  const dir = writeShards(shards);
  const a = runTool(dir, "json").stdout;
  const b = runTool(dir, "json").stdout;
  assert.equal(a, b, "derivation is not deterministic");
});

test("R6: a happens-before dep forces order even when ts would sort the other way", () => {
  // codex-0001 has an EARLIER ts but happens-after claude-0001 via deps → claude-0001 first.
  const dir = writeShards({
    claude: { signals: [sig("claude", 1, { ts: "2026-06-17T00:00:09Z", deps: ["SIG-codex-0001"] })] },
    codex: { signals: [sig("codex", 1, { ts: "2026-06-17T00:00:01Z" })] },
  });
  const agg = aggregate(dir, "json");
  const order = agg.signals.map((s) => s.id);
  assert.ok(
    order.indexOf("SIG-codex-0001") < order.indexOf("SIG-claude-0001"),
    "happens-before dep was not respected",
  );
});

// ── R2: append-only superseding correction (no in-place mutation) ────────────
test("R2: a superseding signal that references a prior event is carried, both retained", () => {
  const dir = writeShards({
    claude: {
      signals: [
        sig("claude", 1, { detail: "first" }),
        sig("claude", 2, { detail: "correction", deps: ["SIG-claude-0001"] }),
      ],
    },
  });
  const agg = aggregate(dir, "json");
  const ids = agg.signals.map((s) => s.id);
  assert.ok(ids.includes("SIG-claude-0001") && ids.includes("SIG-claude-0002"), "both events must survive");
});

// ── unread lifecycle: a read-state event clears unread ───────────────────────
test("snapshot: a read-state event for a message clears its unread count", () => {
  const base = {
    claude: { outbox: [msg("claude", "20260617", 1, "codex")] },
  };
  const unreadDir = writeShards({ ...base, codex: { readState: [] } });
  assert.equal(aggregate(unreadDir, "json").snapshot.Codex.unread, 1);

  const readDir = writeShards({
    ...base,
    codex: { readState: [{ reader: "codex", msg_id: "MSG-claude-20260617-0001", state: "acknowledged", ts: "2026-06-17T02:00:00Z" }] },
  });
  const agg = aggregate(readDir, "json");
  assert.equal(agg.snapshot.Codex.unread, 0);
  assert.equal(agg.snapshot.Codex.oldest_unread, "none");
  // read_by reflected on the message projection.
  const m = agg.messages.find((x) => x.id === "MSG-claude-20260617-0001");
  assert.equal(m.read_by.codex, "acknowledged");
});

test("snapshot: a message to 'all' is unread by every recipient except the sender", () => {
  const dir = writeShards({
    claude: { outbox: [msg("claude", "20260617", 1, "all", { subject: "broadcast" })] },
    codex: { readState: [] },
  });
  const agg = aggregate(dir, "json");
  assert.equal(agg.snapshot.Codex.unread, 1, "codex should see the broadcast as unread");
  assert.equal(agg.snapshot.Maintainer.unread, 1, "maintainer should see the broadcast as unread");
  assert.equal(agg.snapshot.Claude.unread, 0, "sender does not count its own broadcast");
});

// ── R3: emit modes ───────────────────────────────────────────────────────────
test("R3: --emit mailbox-md renders a legible Inbox Snapshot table", () => {
  const dir = writeShards({
    claude: { outbox: [msg("claude", "20260617", 1, "codex", { subject: "review request" })] },
    codex: { readState: [] },
  });
  const md = runTool(dir, "mailbox-md").stdout;
  assert.match(md, /Inbox Snapshot/, "mailbox-md missing Inbox Snapshot heading");
  assert.match(md, /\|\s*Codex\s*\|\s*1\s*\|/, "mailbox-md snapshot row for Codex unread=1 missing");
  assert.match(md, /MSG-claude-20260617-0001/, "mailbox-md missing the message id");
});

test("R3: --emit mailbox-json projection snapshot matches the json aggregate snapshot", () => {
  const dir = writeShards({
    claude: { outbox: [msg("claude", "20260617", 1, "codex")] },
    codex: { readState: [] },
  });
  const aggSnap = aggregate(dir, "json").snapshot;
  const mbox = aggregate(dir, "mailbox-json");
  assert.deepEqual(mbox.snapshot, aggSnap, "mailbox-json snapshot diverges from json aggregate");
});

// ── R3.2 / PRD-030 R9: read-only ─────────────────────────────────────────────
test("R3.2: derivation does not modify any shard file (read-only)", () => {
  const dir = writeShards({
    claude: { signals: [sig("claude", 1)], outbox: [msg("claude", "20260617", 1, "codex")] },
    codex: { signals: [sig("codex", 1)], readState: [] },
  });
  const before = {};
  for (const f of walk(dir)) before[f] = sha256(f);
  runTool(dir, "json");
  runTool(dir, "mailbox-md");
  runTool(dir, "mailbox-json");
  for (const f of walk(dir)) assert.equal(sha256(f), before[f], `shard file mutated by read-only tool: ${f}`);
});

// ── namespaces summary (allocation high-water marks) ─────────────────────────
test("namespaces: per-agent max signal seq and per-date max message seq are reported", () => {
  const dir = writeShards({
    claude: {
      signals: [sig("claude", 1), sig("claude", 2), sig("claude", 7)],
      outbox: [msg("claude", "20260617", 1, "codex"), msg("claude", "20260617", 3, "codex")],
    },
    codex: { signals: [sig("codex", 4)] },
  });
  const ns = aggregate(dir, "json").namespaces;
  assert.equal(ns.claude.max_sig, 7);
  assert.equal(ns.claude.max_msg["20260617"], 3);
  assert.equal(ns.codex.max_sig, 4);
});

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
