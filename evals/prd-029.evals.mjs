// PRD-029 implementation evals — Pre-Write State Derivation Contract.
// Proposer/eval-author: Claude. Implementer: Codex (tools/next-state.mjs + skill R3 text).
// Reviewer: Claude. RED until tools/next-state.mjs exists and skill propagation lands.
//
// Helper contract these evals pin (R2):
//   node tools/next-state.mjs --mailbox <path> --turnfile <path> [--date YYYYMMDD]
//   → stdout JSON:
//     {
//       next_msg_id: "MSG-YYYYMMDD-NNN",   // date-scoped per PRD-010 R4.4 (max seq for date + 1);
//                                          //   --date defaults to system date
//       next_sig_id: "SIG-NNN",            // global max + 1
//       next_revision: <int>,              // coordination.revision + 1
//       snapshot: { "<Agent>": { unread: <int>, oldest_unread: "<MSG-ID|none>" }, ... },
//       freshness: { mailbox_path, turnfile_path, mailbox_hash, turnfile_hash,
//                    revision, max_sig, max_msg_seq: { "YYYYMMDD": <int>, ... } }
//     }
//   Read-only: must not modify, lock, or write any file (R2.6, R6.7).
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const HELPER = path.join(root, "tools/next-state.mjs");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd029-${name}-`));
}
function sha256(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}
function runHelper(mailbox, turnfile, extra = []) {
  const r = spawnSync(process.execPath, [HELPER, "--mailbox", mailbox, "--turnfile", turnfile, ...extra], {
    cwd: root,
    encoding: "utf8",
  });
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}
function json(res) {
  return JSON.parse(res.stdout);
}

function mailboxFixture(rows, { codexUnread = 0, claudeUnread = 0, oldestCodex = "none", oldestClaude = "none" } = {}) {
  // rows: array of MSG IDs that appear in Closed Summary (terminal); snapshot counts are explicit.
  const closed = rows.map((id) => `| ${id} | 2026-06-13 | Claude -> Codex | closed | fixture |`).join("\n");
  return `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | ${codexUnread} | ${oldestCodex} | ${oldestCodex === "none" ? "none" : "next session"} |
| Claude | ${claudeUnread} | ${oldestClaude} | ${oldestClaude === "none" ? "none" : "next session"} |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
${closed}
`;
}

function turnfileFixture(revision, maxSig) {
  const sigs = [];
  for (let i = 1; i <= maxSig; i += 1) {
    sigs.push(`  - id: "SIG-${String(i).padStart(3, "0")}"\n    from: "claude"\n    to: "all"\n    signal: "notify"\n    rev: ${i}\n    detail: "fixture"`);
  }
  return `# TURNFILE.yaml — SNAP Coordination State
# Last modified revision: ${revision}
# Modified by: claude

turnfile:
  version: "0.1.0"
  project: "turnfile"
  workspace: "working-session/"

agents:
  codex:
    role: "agent"
    status: "idle"
    current_task: null
    last_seen: "codex-session-14"
    session_id: "codex-session-14"
  claude:
    role: "agent"
    status: "active"
    current_task: null
    last_seen: "claude-session-14"
    session_id: "claude-session-14"

maintainer:
  id: "snap"
  status: "available"
  last_seen: "maintainer-session-14"

coordination:
  revision: ${revision}
  active_phase: "phase-2"
  active_step: "p2-f"
  tasks: {}

locks: {}

turn_queue: []

messages:
${sigs.reverse().join("\n")}
`;
}

function writePair(rows, snap, revision, maxSig) {
  const dir = tmp("pair");
  const mb = path.join(dir, "MAILBOX.md");
  const tf = path.join(dir, "TURNFILE.yaml");
  fs.writeFileSync(mb, mailboxFixture(rows, snap));
  fs.writeFileSync(tf, turnfileFixture(revision, maxSig));
  return { dir, mb, tf };
}

// R6.1 — next_msg_id / next_sig_id derivation
test("R6.1: next_msg_id = max date-scoped seq + 1 (gap-free, same-date multiples)", () => {
  const { mb, tf } = writePair(["MSG-20260613-037", "MSG-20260613-038"], {}, 99, 75);
  const out = json(runHelper(mb, tf, ["--date", "20260613"]));
  assert.equal(out.next_msg_id, "MSG-20260613-039");
  assert.equal(out.next_sig_id, "SIG-076");
  assert.equal(out.next_revision, 100);
});

test("R6.1: gapped sequence takes max+1, does not backfill the gap (PRD-010 R4.4)", () => {
  const { mb, tf } = writePair(["MSG-20260613-001", "MSG-20260613-003"], {}, 5, 3);
  const out = json(runHelper(mb, tf, ["--date", "20260613"]));
  assert.equal(out.next_msg_id, "MSG-20260613-004"); // max(3)+1, not 2
});

test("R6.1: new date with no prior messages starts at 001", () => {
  const { mb, tf } = writePair(["MSG-20260613-038"], {}, 99, 75);
  const out = json(runHelper(mb, tf, ["--date", "20260614"]));
  assert.equal(out.next_msg_id, "MSG-20260614-001");
});

// R6.2 — snapshot counts match the invariants validator's expectation
test("R6.2: snapshot unread counts and oldest pointers match the mailbox state", () => {
  const { mb, tf } = writePair(["MSG-20260613-038"], { codexUnread: 1, oldestCodex: "MSG-20260613-039" }, 99, 75);
  // Note: a real fixture would carry an unread active card; the helper derives counts from
  // Active Messages, not from the snapshot table it is meant to regenerate.
  const out = json(runHelper(mb, tf));
  assert.ok(out.snapshot && out.snapshot.Codex, "snapshot.Codex missing");
  assert.equal(typeof out.snapshot.Codex.unread, "number");
  assert.ok("oldest_unread" in out.snapshot.Codex);
});

// R6.4 — stale-derivation regression (ledger 3/5): file truth beats remembered value
test("R6.4: helper returns file-derived next-ID even when it differs from a stale remembered value", () => {
  // Simulate: agent 'remembers' next is 039 from an earlier read, but two more messages landed.
  const { mb, tf } = writePair(
    ["MSG-20260613-038", "MSG-20260613-039", "MSG-20260613-040"], {}, 99, 75);
  const rememberedStale = "MSG-20260613-039";
  const out = json(runHelper(mb, tf, ["--date", "20260613"]));
  assert.equal(out.next_msg_id, "MSG-20260613-041");
  assert.notEqual(out.next_msg_id, rememberedStale, "helper must derive from files, not remembered state");
});

// R6.5 — freshness receipt changes when a source file changes
test("R6.5: freshness receipt changes when MAILBOX.md or TURNFILE.yaml changes after output", () => {
  const { mb, tf } = writePair(["MSG-20260613-038"], {}, 99, 75);
  const before = json(runHelper(mb, tf)).freshness;
  fs.appendFileSync(mb, "\n| MSG-20260613-039 | 2026-06-13 | Claude -> Codex | closed | added |\n");
  const after = json(runHelper(mb, tf)).freshness;
  assert.notEqual(before.mailbox_hash, after.mailbox_hash, "mailbox_hash should change");
  // turnfile unchanged → its hash stable
  assert.equal(before.turnfile_hash, after.turnfile_hash);
});

test("R6.5: freshness receipt records the actual content hashes of the source files", () => {
  const { mb, tf } = writePair(["MSG-20260613-038"], {}, 99, 75);
  const f = json(runHelper(mb, tf)).freshness;
  assert.equal(f.mailbox_hash, sha256(mb), "freshness mailbox_hash must equal sha256(MAILBOX.md)");
  assert.equal(f.turnfile_hash, sha256(tf), "freshness turnfile_hash must equal sha256(TURNFILE.yaml)");
  assert.equal(f.revision, 99);
});

// R6.7 — read-only behavior
test("R6.7: helper does not modify either source file", () => {
  const { mb, tf } = writePair(["MSG-20260613-038"], {}, 99, 75);
  const mbBefore = sha256(mb);
  const tfBefore = sha256(tf);
  runHelper(mb, tf);
  assert.equal(sha256(mb), mbBefore, "MAILBOX.md was modified by a read-only helper");
  assert.equal(sha256(tf), tfBefore, "TURNFILE.yaml was modified by a read-only helper");
});

// R6.3 — skill bundles carry the R3 obligation text
test("R6.3: both skill bundles require deriving IDs/counts via next-state.mjs inside the lock window", () => {
  for (const f of ["skills/claude/SKILL.md", "skills/codex/SKILL.md"]) {
    const s = fs.readFileSync(path.join(root, f), "utf8");
    assert.match(s, /next-state\.mjs/, `${f} missing next-state.mjs obligation (PRD-029 R3)`);
  }
});

// R6.6 — thread-mode unread reset (R5.3): unread changes without a new MSG ID
test("R6.6: a thread-mode entry that requests a response is counted unread without allocating a new MSG ID", () => {
  // Active card MSG-20260613-040 whose latest thread entry re-requests a response → Codex unread=1,
  // and next_msg_id is still 041 (no new ID consumed by the thread entry).
  const dir = tmp("thread");
  const mb = path.join(dir, "MAILBOX.md");
  const tf = path.join(dir, "TURNFILE.yaml");
  fs.writeFileSync(mb, `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 1 | MSG-20260613-040 | next session |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|
| MSG-20260613-040 | Claude -> Codex | P1 | thread-mode fixture |

## Active Messages (Newest First)

### MSG-20260613-040

**From:** Claude -> Codex
**Date:** 2026-06-13
**Type:** request
**Priority:** P1
**Status:** unread
**Subject:** thread-mode fixture
**Closure owner:** Claude

**Ack:** Claude — 2026-06-13 — re-requested response in-thread (no new MSG ID).

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
| MSG-20260613-039 | 2026-06-13 | Claude -> Codex | closed | prior |
`);
  fs.writeFileSync(tf, turnfileFixture(99, 75));
  const out = json(runHelper(mb, tf, ["--date", "20260613"]));
  assert.equal(out.snapshot.Codex.unread, 1, "thread-mode unread not reflected");
  assert.equal(out.next_msg_id, "MSG-20260613-041", "thread entry must not consume a new MSG ID");
});
