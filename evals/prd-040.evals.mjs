// PRD-040 implementation evals — Heartbeat Loop Prompt Contract.
// Proposer/eval-author: Gemini. Expected implementer: Codex. Reviewer: Claude.
// EXPECTED TO FAIL until Codex implements tools/validate-heartbeat-loop.mjs.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-heartbeat-loop.mjs");

function read(p) {
  return fs.readFileSync(path.join(root, p), "utf8");
}

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd040-${name}-`));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function runValidator(args, cwd = root) {
  assert.equal(fs.existsSync(TOOL), true, "tools/validate-heartbeat-loop.mjs must exist");
  return spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: "utf8" });
}

test("R1-R4: PRD-040 defines the loop prompt, unblocked work criteria, quiet no-op, and proactive signaling", () => {
  const s = read("docs/prds/PRD-040-heartbeat-loop-prompt-contract.md");
  for (const needle of [
    /Do you have any unblocked work in your lane that you can complete now\?/i,
    /Sent Message Thread Activity/i,
    /Task Dependency Resolution/i,
    /Pending Handshake Work/i,
    /Quiet No-Op Discipline/i,
    /No Write Signaling/i,
    /No Auto-Execution/i,
  ]) {
    assert.match(s, needle);
  }
});

// Helper to construct fixture workspaces
function createFixtureWorkspace(options = {}) {
  const dir = tmp("workspace");
  const ws = path.join(dir, "working-session");
  fs.mkdirSync(ws, { recursive: true });

  const mailbox = options.mailbox || `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Gemini | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)
`;

  const turnfile = options.turnfile || `# TURNFILE.yaml — SNAP Coordination State
turnfile:
  version: "0.1"
  project: "turnfile"
  workspace: "working-session/"

agents:
  gemini:
    role: "agent"
    status: "active"
    current_task: null
    last_seen: "gemini-session-24-open"
    session_id: "gemini-session-24"

coordination:
  revision: 320
  active_phase: "phase-2"
  active_step: "s24-handshake-heartbeat"
  tasks: {}
locks: {}
turn_queue: []
messages: []
`;

  const handshake = options.handshake || `# Next-Session Handshake Contract

## Sign-off (session 24)

| Agent | Protocol baseline | Tokenese | Skills | Scope | Heartbeat | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|---|
| Gemini | yes — Turnfile v0.1 (rev 320) | yes — grammar v0.3 | yes | ACK | 5m | yes | Gemini (3.5 Flash (High)) — 2026-06-19 |
`;

  write(path.join(ws, "MAILBOX.md"), mailbox);
  write(path.join(ws, "TURNFILE.yaml"), turnfile);
  write(path.join(ws, "NEXT_SESSION_HANDSHAKE.md"), handshake);
  return dir;
}

test("AC2/R3: Idle state triggers DONT_NOTIFY quiet no-op", () => {
  const dir = createFixtureWorkspace();
  const res = runValidator(["--root", dir, "--agent", "gemini", "--format", "json"]);
  assert.equal(res.status, 0, res.stderr);
  const data = JSON.parse(res.stdout);
  assert.equal(data.outcome, "DONT_NOTIFY");
  assert.equal(data.reason, "idle");
});

test("AC2/R2.1: Peer reply on self-owned thread triggers NOTIFY", () => {
  const mailbox = `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Gemini | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|
| MSG-20260618-999 | Gemini -> Claude | P1 | Spec review (actioned) |

## Active Messages (Newest First)

### MSG-20260618-999

**From:** Gemini -> Claude
**Date:** 2026-06-18
**Type:** request
**Mode:** delivery-mirror
**Status:** actioned
**Closure owner:** Gemini

**Ack:** Claude — 2026-06-19 — actioned.

**Reply:** Claude reviewed and applied.
`;

  const dir = createFixtureWorkspace({ mailbox });
  const res = runValidator(["--root", dir, "--agent", "gemini", "--format", "json"]);
  assert.equal(res.status, 0, res.stderr);
  const data = JSON.parse(res.stdout);
  assert.equal(data.outcome, "NOTIFY");
  assert.equal(data.reason, "sent-message-activity");
  assert.ok(data.details.active_threads.includes("MSG-20260618-999"));
});

test("AC2/R2.2: Resolved task dependency triggers NOTIFY", () => {
  const turnfile = `# TURNFILE.yaml — SNAP Coordination State
agents:
  gemini:
    role: "agent"
    status: "active"
    current_task: "s24-gemini-prd-040-evals"

coordination:
  revision: 320
  tasks:
    s24-handshake-heartbeat:
      status: "done"
    s24-gemini-prd-040-evals:
      owner: "gemini"
      status: "pending"
      depends_on: ["s24-handshake-heartbeat"]
`;

  const dir = createFixtureWorkspace({ turnfile });
  const res = runValidator(["--root", dir, "--agent", "gemini", "--format", "json"]);
  assert.equal(res.status, 0, res.stderr);
  const data = JSON.parse(res.stdout);
  assert.equal(data.outcome, "NOTIFY");
  assert.equal(data.reason, "task-dependency");
  assert.ok(data.details.unblocked_tasks.includes("s24-gemini-prd-040-evals"));
});

test("AC2/R2.3: Pending handshake work triggers NOTIFY", () => {
  const handshake = `# Next-Session Handshake Contract

## Sign-off (session 24)

| Agent | Protocol baseline | Tokenese | Skills | Scope | Heartbeat | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|---|
| Claude | yes | yes | yes | ACK | 5m | yes | Claude — 2026-06-19 |
`;

  const dir = createFixtureWorkspace({ handshake });
  const res = runValidator(["--root", dir, "--agent", "gemini", "--format", "json"]);
  assert.equal(res.status, 0, res.stderr);
  const data = JSON.parse(res.stdout);
  assert.equal(data.outcome, "NOTIFY");
  assert.equal(data.reason, "pending-handshake");
});

test("R4: Heartbeat check remains read-only and does not mutate filesystem", () => {
  const dir = createFixtureWorkspace();
  
  // Get initial file stats
  const mailboxPath = path.join(dir, "working-session/MAILBOX.md");
  const turnfilePath = path.join(dir, "working-session/TURNFILE.yaml");
  const initialMailboxMtime = fs.statSync(mailboxPath).mtimeMs;
  const initialTurnfileMtime = fs.statSync(turnfilePath).mtimeMs;

  const res = runValidator(["--root", dir, "--agent", "gemini", "--format", "json"]);
  assert.equal(res.status, 0, res.stderr);

  // Verify file modification times have not changed
  assert.equal(fs.statSync(mailboxPath).mtimeMs, initialMailboxMtime, "MAILBOX.md must not be modified");
  assert.equal(fs.statSync(turnfilePath).mtimeMs, initialTurnfileMtime, "TURNFILE.yaml must not be modified");
});
