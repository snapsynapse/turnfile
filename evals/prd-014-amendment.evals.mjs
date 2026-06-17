// PRD-014 Amendment A1 implementation evals — Closeout Compaction + Projection Sync.
// Proposer/eval-author: Claude. Implementer: Codex. Reviewer: Claude.
// RED until Codex implements tools/validate-closeout.mjs and the skill/boot closeout
// references to the unified compaction set land.
//
// Amendment A1 (docs/prds/PRD-014-...md) defines, at session close:
//   A1.R1 unified compaction set: worklog compaction, signal-log compaction (PRD-013 R5.3),
//         mailbox archival, boot archive, heartbeat lifecycle (PRD-030 R6) — each execute-or-defer.
//   A1.R2 projection synchronization: MAILBOX.json, PRD_STATUS.json, TURNFILE revision, next-state;
//         a failing projection blocks clean close unless the Maintainer records an explicit deferral.
//   A1.R3 scope boundary vs PRD-026 (session-level vs per-review-cycle).
//   A1.R5.3 the implementation evals verify: signal-log compaction honors the retention window;
//         terminal messages are archived and absent from the active mailbox; closeout fails
//         clean-close when a projection validator fails and no deferral is recorded.
//   A1.R5.4 boot files and skill closeout modules reference the unified compaction set.
//
// ─────────────────────────────────────────────────────────────────────────────
// TOOL CONTRACT — tools/validate-closeout.mjs (read-only)
//
//   node tools/validate-closeout.mjs --turnfile <tf> --mailbox <mb>
//        [--retention-sessions <N>] [--defer <item>]...
//
//   Exits 0 when closeout is clean (or every blocking item is deferred via --defer),
//   nonzero when a blocking item remains undeferred. Prints a JSON report to stdout:
//     {
//       compaction: {
//         signal_log: { retention_sessions: <N>, eligible: [<SIG ids past the window>],
//                       preserved_last_per_agent: [<SIG ids>], ok: <bool> },
//         mailbox_archival: { terminal_in_active: [<MSG ids>], ok: <bool> }
//       },
//       projection: {
//         mailbox_json: { stale: <bool> },
//         turnfile_revision: { header: <int>, coordination: <int>, match: <bool> }
//       },
//       blocking: [ { item, reason } ],   // failed checks not covered by --defer
//       deferred: [ <item> ],
//       clean: <bool>
//     }
//
//   Retention (PRD-013 R5.3): a session boundary is a `ready` signal. Signals belonging to
//   sessions older than the most-recent <N> `ready` markers (default N=2) are `eligible` for
//   compaction. The latest signal from EACH agent is always preserved and never eligible
//   (ok=false if any last-per-agent signal is eligible). Read-only: never mutates a file.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-closeout.mjs");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd014a1-${name}-`));
}
function runTool(args) {
  const r = spawnSync(process.execPath, [TOOL, ...args], { cwd: root, encoding: "utf8" });
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}
function report(args) {
  return JSON.parse(runTool(args).stdout);
}

// Minimal TURNFILE with a controllable signal log. `sigs` = [{id, from, signal, rev}].
function turnfile(revisionHeader, coordinationRevision, sigs) {
  const lines = sigs
    .map((s) => `  - id: "${s.id}"\n    from: "${s.from}"\n    to: "all"\n    signal: "${s.signal}"\n    rev: ${s.rev}\n    detail: "fixture"`)
    .join("\n");
  return `# TURNFILE.yaml — SNAP Coordination State
# Last modified revision: ${revisionHeader}
# Modified by: claude

turnfile:
  version: "0.1"
  project: "turnfile"
  workspace: "working-session/"

agents:
  codex:
    role: "agent"
    status: "idle"
    current_task: null
    last_seen: "codex"
    session_id: "codex-session"
  claude:
    role: "agent"
    status: "active"
    current_task: null
    last_seen: "claude"
    session_id: "claude-session"

maintainer:
  id: "snap"
  status: "available"
  last_seen: "maintainer"

coordination:
  revision: ${coordinationRevision}
  active_phase: "phase-2"
  active_step: "p2-g"
  tasks: {}

locks: {}

turn_queue: []

messages:
${lines}
`;
}

// Minimal compact mailbox. `closedActive` = MSG ids wrongly left as active cards with closed status.
function mailbox({ closedActive = [] } = {}) {
  const cards = closedActive
    .map(
      (id) => `### ${id}\n\n**From:** Claude -> Codex\n**Status:** closed\n**Subject:** fixture\n**Closure owner:** Claude\n`,
    )
    .join("\n");
  return `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

${cards}
## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
`;
}

function writePair(tf, mb) {
  const dir = tmp("pair");
  const tfp = path.join(dir, "TURNFILE.yaml");
  const mbp = path.join(dir, "MAILBOX.md");
  const jsonp = path.join(dir, "MAILBOX.json");
  fs.writeFileSync(tfp, tf);
  fs.writeFileSync(mbp, mb);
  return { dir, tfp, mbp, jsonp };
}

// ── A1.R1 / A1.R2 / A1.R3 / A1.R5 doc contract ──────────────────────────────
test("A1.R1: PRD-014 enumerates the unified compaction set with execute-or-defer semantics", () => {
  const s = read("docs/prds/PRD-014-session-closeout-boot-handoff-contract.md");
  assert.match(s, /A1\.R1 Closeout compaction set/);
  for (const item of [/Worklog compaction/i, /Signal-log compaction/i, /Mailbox archival/i, /boot archive/i, /Heartbeat lifecycle/i]) {
    assert.match(s, item, `A1.R1 missing compaction item ${item}`);
  }
  assert.match(s, /executed or logged as an explicit deferral with reason and next owner/i);
});

test("A1.R2: PRD-014 enumerates projection sync and blocks clean close on a failing projection", () => {
  const s = read("docs/prds/PRD-014-session-closeout-boot-handoff-contract.md");
  assert.match(s, /A1\.R2 Projection synchronization/);
  for (const item of [/MAILBOX\.json/i, /PRD_STATUS\.json/i, /TURNFILE\.yaml.*revision|header revision/i, /next-state\.mjs/i]) {
    assert.match(s, item, `A1.R2 missing projection item ${item}`);
  }
  assert.match(s, /failing projection blocks clean close unless the Maintainer records an explicit deferral/i);
});

test("A1.R3: PRD-014 states the PRD-026 scope boundary (session-level vs per-review-cycle)", () => {
  const s = read("docs/prds/PRD-014-session-closeout-boot-handoff-contract.md");
  assert.match(s, /A1\.R3 Scope boundary/);
  assert.match(s, /session-level/i);
  assert.match(s, /PRD-026/);
  assert.match(s, /per-review-cycle/i);
});

test("A1.R5.4: both skill bundles' closeout modules reference the unified compaction set", () => {
  for (const agent of ["claude", "codex"]) {
    const s = read(`skills/${agent}/SKILL.md`);
    assert.match(s, /compaction set|unified closeout|A1\.R1/i, `${agent} skill closeout missing unified-compaction reference`);
  }
});

// ── A1.R5.3 behavioral: signal-log retention honors window + preserves last-per-agent ──
test("A1.R5.3a: signal-log compaction preserves the last signal from each agent", () => {
  // 4 sessions (ready markers at rev 1,3,5,7). Retention 2 → sessions at rev<5 are old.
  const sigs = [
    { id: "SIG-001", from: "claude", signal: "ready", rev: 1 },
    { id: "SIG-002", from: "codex", signal: "notify", rev: 2 },
    { id: "SIG-003", from: "claude", signal: "ready", rev: 3 },
    { id: "SIG-004", from: "codex", signal: "notify", rev: 4 },
    { id: "SIG-005", from: "claude", signal: "ready", rev: 5 },
    { id: "SIG-006", from: "codex", signal: "notify", rev: 6 },
    { id: "SIG-007", from: "claude", signal: "ready", rev: 7 },
    { id: "SIG-008", from: "claude", signal: "yield", rev: 8 },
  ];
  const { tfp, mbp } = writePair(turnfile(8, 8, sigs), mailbox());
  const r = report(["--turnfile", tfp, "--mailbox", mbp, "--retention-sessions", "2"]);
  // codex's latest signal is SIG-006; claude's latest is SIG-008 — neither may be eligible.
  assert.ok(r.compaction.signal_log.preserved_last_per_agent.includes("SIG-006"), "codex last-signal not preserved");
  assert.ok(r.compaction.signal_log.preserved_last_per_agent.includes("SIG-008"), "claude last-signal not preserved");
  assert.ok(!r.compaction.signal_log.eligible.includes("SIG-006"), "last-per-agent must never be compaction-eligible");
  assert.equal(r.compaction.signal_log.ok, true);
});

test("A1.R5.3a: signals from sessions older than the retention window are eligible (except last-per-agent)", () => {
  const sigs = [
    { id: "SIG-001", from: "claude", signal: "ready", rev: 1 },
    { id: "SIG-002", from: "claude", signal: "notify", rev: 2 },
    { id: "SIG-003", from: "claude", signal: "ready", rev: 3 },
    { id: "SIG-004", from: "claude", signal: "ready", rev: 5 },
    { id: "SIG-005", from: "codex", signal: "notify", rev: 6 },
    { id: "SIG-006", from: "claude", signal: "yield", rev: 7 },
  ];
  const { tfp, mbp } = writePair(turnfile(7, 7, sigs), mailbox());
  const r = report(["--turnfile", tfp, "--mailbox", mbp, "--retention-sessions", "2"]);
  // Retention 2 keeps the last 2 ready-sessions (rev>=3); SIG-001/002 are older → eligible.
  assert.ok(r.compaction.signal_log.eligible.includes("SIG-002"), "old-session signal should be eligible");
  assert.ok(!r.compaction.signal_log.eligible.includes("SIG-005"), "in-window signal must not be eligible");
});

// ── A1.R5.3b behavioral: terminal messages archived + absent from active mailbox ──
test("A1.R5.3b: a terminal (closed) message left in Active Messages is flagged", () => {
  const { tfp, mbp } = writePair(turnfile(7, 7, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox({ closedActive: ["MSG-20260617-001"] }));
  const r = report(["--turnfile", tfp, "--mailbox", mbp]);
  assert.ok(r.compaction.mailbox_archival.terminal_in_active.includes("MSG-20260617-001"));
  assert.equal(r.compaction.mailbox_archival.ok, false);
  assert.ok(r.blocking.some((b) => /archiv/i.test(b.item) || /archiv/i.test(b.reason)));
});

test("A1.R5.3b: a clean mailbox (no terminal active cards) passes archival", () => {
  const { tfp, mbp } = writePair(turnfile(7, 7, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox());
  const r = report(["--turnfile", tfp, "--mailbox", mbp]);
  assert.equal(r.compaction.mailbox_archival.ok, true);
  assert.deepEqual(r.compaction.mailbox_archival.terminal_in_active, []);
});

// ── A1.R5.3c behavioral: failing projection blocks clean close unless deferred ──
test("A1.R5.3c: a stale MAILBOX.json blocks clean close (nonzero exit, not clean)", () => {
  const { dir, tfp, mbp, jsonp } = writePair(turnfile(7, 7, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox());
  fs.writeFileSync(jsonp, JSON.stringify({ stale: "does-not-match-mailbox" }));
  const res = runTool(["--turnfile", tfp, "--mailbox", mbp]);
  const r = JSON.parse(res.stdout);
  assert.equal(r.projection.mailbox_json.stale, true);
  assert.equal(r.clean, false);
  assert.notEqual(res.status, 0, "stale projection must block clean close with nonzero exit");
  assert.ok(dir);
});

test("A1.R5.3c: an explicit --defer for the stale projection allows clean close (exit 0)", () => {
  const { tfp, mbp, jsonp } = writePair(turnfile(7, 7, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox());
  fs.writeFileSync(jsonp, JSON.stringify({ stale: "does-not-match-mailbox" }));
  const res = runTool(["--turnfile", tfp, "--mailbox", mbp, "--defer", "mailbox_json"]);
  const r = JSON.parse(res.stdout);
  assert.ok(r.deferred.includes("mailbox_json"));
  assert.equal(r.clean, true);
  assert.equal(res.status, 0, "an explicitly deferred projection failure should allow clean close");
});

test("A1.R5.3c: TURNFILE header revision must match coordination.revision", () => {
  const { tfp, mbp } = writePair(turnfile(7, 9, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox());
  const r = report(["--turnfile", tfp, "--mailbox", mbp]);
  assert.equal(r.projection.turnfile_revision.match, false);
  assert.equal(r.projection.turnfile_revision.header, 7);
  assert.equal(r.projection.turnfile_revision.coordination, 9);
});

// ── read-only ────────────────────────────────────────────────────────────────
test("read-only: validate-closeout does not mutate the turnfile or mailbox", () => {
  const { tfp, mbp } = writePair(turnfile(7, 7, [{ id: "SIG-001", from: "claude", signal: "ready", rev: 1 }]), mailbox());
  const tfBefore = fs.readFileSync(tfp, "utf8");
  const mbBefore = fs.readFileSync(mbp, "utf8");
  runTool(["--turnfile", tfp, "--mailbox", mbp]);
  assert.equal(fs.readFileSync(tfp, "utf8"), tfBefore, "TURNFILE was mutated");
  assert.equal(fs.readFileSync(mbp, "utf8"), mbBefore, "MAILBOX was mutated");
});
