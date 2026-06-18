// PRD-032 implementation evals — Session Orientation Tool Contract.
// Proposer/eval-author: Codex. Implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until tools/session-orient.mjs exists and composes the
// existing next-state / closeout projection checks.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/session-orient.mjs");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd032-${name}-`));
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function sha256Tree(dir) {
  const out = {};
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(current, entry.name);
      const rel = path.relative(dir, full);
      if (entry.isDirectory()) walk(full);
      else out[rel] = sha256File(full);
    }
  }
  walk(dir);
  return out;
}

function fixture({ staleMailboxJson = false, revisionMismatch = false } = {}) {
  const dir = tmp("fixture");
  const ws = path.join(dir, "working-session");
  const docs = path.join(ws, "docs");
  fs.mkdirSync(docs, { recursive: true });

  const mailbox = `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 1 | MSG-20260617-024 | next turn |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|
| MSG-20260617-024 | Claude -> Codex | P1 | Fixture review |

## Active Messages (Newest First)

### MSG-20260617-024

**From:** Claude -> Codex
**Date:** 2026-06-17
**Type:** request
**Mode:** delivery-mirror
**Priority:** P1
**Subject:** Fixture review
**Status:** unread
**Closure owner:** Codex
**Response needed by:** next turn

Fixture body.
`;

  const turnfileRevision = revisionMismatch ? 40 : 41;
  const turnfile = `# TURNFILE.yaml — SNAP Coordination State
# Protocol: Turnfile v0.1
# Project: turnfile
# Last modified revision: 41
# Modified by: fixture

turnfile:
  version: "0.1"
  project: "turnfile"
  workspace: "working-session/"

agents:
  codex:
    role: "agent"
    status: "active"
    current_task: "s14-prd024-validator-rule"
    last_seen: "fixture"
    session_id: "fixture-codex"
  claude:
    role: "agent"
    status: "active"
    current_task: null
    last_seen: "fixture"
    session_id: "fixture-claude"

coordination:
  revision: ${turnfileRevision}
  active_phase: "phase-2"
  active_step: "fixture"
  conflict:
    rebuttal_rounds: 1
  tasks:
    s14-prd024-validator-rule:
      description: "Fixture task"
      owner: "codex"
      status: "pending"
      priority: "P1"
      depends_on: []
      created_by: "maintainer"
      created_rev: 37
      claim_rev: 38
      completed_rev: null
      notes: "Fixture task note."
  messages:
  - id: "SIG-041"
    from: "codex"
    signal: "ready"
    rev: 41
    detail: "fixture"
`;

  const worklog = `# Worklog — Turnfile

Now Working (Codex): fixture current task.
Now Working (Claude): idle.
Maintainer Focus: fixture maintainer focus.

## Decision Index

| Decision | Owner | Timestamp | Section |
|----------|-------|-----------|---------|
| Fixture decision. | Codex | 2026-06-17 | Fixture |
`;

  const prdStatus = {
    schema_version: "1.0",
    updated_at: "fixture",
    policy: {
      required_reviewers: ["codex", "claude", "maintainer"],
      promotion_rule: "fixture",
      registry_is_source_of_truth: true,
    },
    prds: [
      {
        id: "PRD-024",
        title: "Encoding Profile",
        path: "docs/prds/PRD-024-encoding-profile.md",
        shelf: "docs/prds",
        state: "actioned",
        acceptance: {
          codex: { status: "accepted", evidence: ["fixture"] },
          claude: { status: "accepted", evidence: ["fixture"] },
          maintainer: { status: "accepted", evidence: ["fixture"] },
        },
        blocking_items: [],
        eligible_for_docs_prds: true,
        implementation: { state: "done", evals: "evals/prd-024.evals.mjs" },
      },
    ],
  };

  fs.writeFileSync(path.join(ws, "MAILBOX.md"), mailbox);
  fs.writeFileSync(path.join(ws, "TURNFILE.yaml"), turnfile);
  fs.writeFileSync(path.join(ws, "WORKLOG.md"), worklog);
  fs.writeFileSync(path.join(docs, "PRD_STATUS.json"), `${JSON.stringify(prdStatus, null, 2)}\n`);
  fs.writeFileSync(
    path.join(ws, "MAILBOX.json"),
    staleMailboxJson
      ? JSON.stringify({ format_version: "mailbox-compact-v1", inbox_snapshot: [] }, null, 2)
      : JSON.stringify(
          {
            format_version: "mailbox-compact-v1",
            inbox_snapshot: [
              { agent: "Codex", unread: 1, oldest_unread: "MSG-20260617-024", needs_response_by: "next turn" },
              { agent: "Claude", unread: 0, oldest_unread: "none", needs_response_by: "none" },
              { agent: "Maintainer", unread: 0, oldest_unread: "none", needs_response_by: "none" },
            ],
            open_queue: [{ id: "MSG-20260617-024", from_to: "Claude -> Codex", priority: "P1", subject: "Fixture review" }],
            active_messages: [{ id: "MSG-20260617-024" }],
            closed_summary: [],
            source_file: path.join(ws, "MAILBOX.md"),
          },
          null,
          2,
        ),
  );

  return {
    dir,
    mailbox: path.join(ws, "MAILBOX.md"),
    mailboxJson: path.join(ws, "MAILBOX.json"),
    turnfile: path.join(ws, "TURNFILE.yaml"),
    worklog: path.join(ws, "WORKLOG.md"),
    prdStatus: path.join(docs, "PRD_STATUS.json"),
  };
}

function runOrient(paths, extraArgs = [], opts = {}) {
  const args = [
    TOOL,
    "--mailbox",
    paths.mailbox,
    "--turnfile",
    paths.turnfile,
    "--worklog",
    paths.worklog,
    "--prd-status",
    paths.prdStatus,
    ...extraArgs,
  ];
  return spawnSync(process.execPath, args, {
    cwd: opts.cwd || root,
    encoding: "utf8",
  });
}

function parseJsonResult(result) {
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

test("AC1/R5: --emit json returns the stable orientation schema on a hermetic fixture", () => {
  const f = fixture();
  const result = runOrient(f, ["--agent", "codex", "--emit", "json"]);
  const data = parseJsonResult(result);
  assert.deepEqual(Object.keys(data).sort(), [
    "agent",
    "findings",
    "freshness",
    "git",
    "inbox",
    "prd_status",
    "projection",
    "recommended_commands",
    "turnfile",
    "validators",
    "worklog",
  ].sort());
  assert.equal(data.agent, "codex");
  assert.equal(data.turnfile.revision, 41);
  assert.equal(data.freshness.max_signal_id, "SIG-041");
  assert.equal(data.inbox.selected_agent.unread, 1);
  assert.equal(data.inbox.selected_agent.oldest_unread, "MSG-20260617-024");
  assert.ok(Array.isArray(data.findings));
  assert.ok(Array.isArray(data.recommended_commands));
});

test("AC2/R4: --emit human reports current revision, next ids, unread count, findings, and recommendations", () => {
  const f = fixture();
  const result = runOrient(f, ["--agent", "codex", "--emit", "human", "--date", "20260617"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /agent:\s*codex/i);
  assert.match(result.stdout, /revision:\s*41/i);
  assert.match(result.stdout, /next message/i);
  assert.match(result.stdout, /MSG-20260617-025/);
  assert.match(result.stdout, /next signal/i);
  assert.match(result.stdout, /SIG-042/);
  assert.match(result.stdout, /next revision/i);
  assert.match(result.stdout, /42/);
  assert.match(result.stdout, /unread:\s*1/i);
  assert.match(result.stdout, /recommended/i);
});

test("R1/AC2: current repo layout paths are defaults when file arguments are omitted", () => {
  const result = spawnSync(process.execPath, [TOOL, "--agent", "codex", "--emit", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const data = JSON.parse(result.stdout);
  assert.equal(data.agent, "codex");
  assert.ok(data.freshness.next_message_id, "default-path output missing next message id");
  assert.ok(data.freshness.next_signal_id, "default-path output missing next signal id");
  assert.equal(typeof data.turnfile.revision, "number");
  assert.ok(data.inbox.selected_agent, "default-path output missing selected agent inbox");
});

test("R1/R3.8: default invocation reports projection freshness consistently with closeout validator", () => {
  const closeout = spawnSync(
    process.execPath,
    [
      path.join(root, "tools/validate-closeout.mjs"),
      "--turnfile",
      "working-session/TURNFILE.yaml",
      "--mailbox",
      "working-session/MAILBOX.md",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(closeout.status, 0, closeout.stderr || closeout.stdout);
  const expected = JSON.parse(closeout.stdout).projection.mailbox_json.stale;

  const orient = spawnSync(process.execPath, [TOOL, "--agent", "codex", "--emit", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(orient.status, 0, orient.stderr || orient.stdout);
  const data = JSON.parse(orient.stdout);
  assert.equal(data.projection.mailbox_json.stale, expected);
});

test("AC3/R3.8: stale MAILBOX.json projection is reported as a finding without failing the process", () => {
  const f = fixture({ staleMailboxJson: true });
  const data = parseJsonResult(runOrient(f, ["--agent", "codex", "--emit", "json"]));
  assert.equal(data.projection.mailbox_json.stale, true);
  assert.ok(
    data.findings.some((finding) => finding.level === "warning" && /MAILBOX\.json/i.test(finding.message)),
    "expected a warning finding for stale MAILBOX.json",
  );
});

test("AC4/R3.8: Turnfile header and coordination revision mismatch is reported", () => {
  const f = fixture({ revisionMismatch: true });
  const data = parseJsonResult(runOrient(f, ["--agent", "codex", "--emit", "json"]));
  assert.equal(data.projection.turnfile_revision.match, false);
  assert.deepEqual(data.projection.turnfile_revision, { header: 41, coordination: 40, match: false });
  assert.ok(
    data.findings.some((finding) => finding.level === "warning" && /revision/i.test(finding.message)),
    "expected a warning finding for Turnfile revision mismatch",
  );
});

test("AC5/R3.5-R3.6: selected PRD and task state are included when requested", () => {
  const f = fixture();
  const data = parseJsonResult(
    runOrient(f, ["--agent", "codex", "--prd", "PRD-024", "--task", "s14-prd024-validator-rule", "--emit", "json"]),
  );
  assert.equal(data.prd_status.selected.id, "PRD-024");
  assert.equal(data.prd_status.selected.state, "actioned");
  assert.equal(data.prd_status.selected.implementation.state, "done");
  assert.equal(data.turnfile.selected_task.id, "s14-prd024-validator-rule");
  assert.equal(data.turnfile.selected_task.owner, "codex");
  assert.equal(data.turnfile.selected_task.status, "pending");
});

test("AC6/R2: git dirty paths are reported read-only and fixture files are not modified", () => {
  const f = fixture();
  const before = sha256Tree(f.dir);
  const data = parseJsonResult(runOrient(f, ["--agent", "codex", "--emit", "json"], { cwd: root }));
  const after = sha256Tree(f.dir);
  assert.deepEqual(after, before, "orientation tool modified fixture files");
  assert.ok(Array.isArray(data.git.dirty_paths), "git.dirty_paths must be a list");
  assert.ok(Array.isArray(data.git.heuristic_peer_owned_paths), "git heuristic ownership paths must be a list");
  assert.match(data.git.ownership_note, /heuristic|best-effort/i);
});

test("AC7/R2: missing required files exit nonzero and emit a machine-readable JSON error", () => {
  const f = fixture();
  fs.rmSync(f.worklog);
  const result = runOrient(f, ["--agent", "codex", "--emit", "json"]);
  assert.notEqual(result.status, 0, "missing worklog should fail");
  const output = result.stdout.trim() || result.stderr.trim();
  const error = JSON.parse(output);
  assert.equal(error.ok, false);
  assert.equal(error.error.code, "missing-required-file");
  assert.match(error.error.message, /WORKLOG|worklog/i);
});

test("R3.9/C2: validators are listed by default and executed only when --validate is supplied", () => {
  const f = fixture();
  const defaultData = parseJsonResult(runOrient(f, ["--agent", "codex", "--emit", "json"]));
  assert.equal(defaultData.validators.ran, false);
  assert.ok(defaultData.recommended_commands.some((cmd) => /validate-mailbox-invariants\.mjs/.test(cmd)));
  assert.ok(defaultData.recommended_commands.some((cmd) => /turnfile-lint\.mjs/.test(cmd)));
  assert.ok(defaultData.recommended_commands.some((cmd) => /validate-prd-promotion\.mjs/.test(cmd)));

  const validateData = parseJsonResult(runOrient(f, ["--agent", "codex", "--emit", "json", "--validate"]));
  assert.equal(validateData.validators.ran, true);
  for (const name of ["mailbox", "turnfile", "prd_promotion"]) {
    assert.ok(validateData.validators[name], `missing validator result for ${name}`);
    assert.equal(typeof validateData.validators[name].status, "number");
    assert.ok(["pass", "fail", "skipped"].includes(validateData.validators[name].result));
  }
});

test("AC10/R8: implementation composes established derivation/projection logic instead of silently forking it", () => {
  assert.ok(fs.existsSync(TOOL), "tools/session-orient.mjs must exist");
  const source = fs.readFileSync(TOOL, "utf8");
  assert.match(source, /next-state\.mjs|nextState|deriveNextState|state-derivation/i);
  assert.match(source, /validate-closeout\.mjs|validateCloseout|projection|closeout/i);
});
