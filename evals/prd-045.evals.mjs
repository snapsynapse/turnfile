// PRD-045 RED evals - stale agent reconciliation policy.
// Eval author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until tools/reconcile-stale-agent.mjs and fixtures land.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tool = path.join(root, "tools/reconcile-stale-agent.mjs");
const prd = path.join(root, "docs/prds/PRD-045-stale-agent-reconciliation-policy.md");

const read = (p) => fs.readFileSync(p, "utf8");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function tmpFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd045-"));
  fs.mkdirSync(path.join(dir, "working-session"), { recursive: true });
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  fs.mkdirSync(path.join(dir, "schemas/turnfile"), { recursive: true });
  fs.copyFileSync(path.join(root, "schemas/turnfile/turnfile-v0.schema.json"), path.join(dir, "schemas/turnfile/turnfile-v0.schema.json"));
  for (const file of ["MAILBOX.md", "MAILBOX.json", "WORKLOG.md"]) {
    fs.copyFileSync(path.join(root, "working-session", file), path.join(dir, "working-session", file));
  }
  for (const name of ["turnfile-lint", "validate-mailbox-invariants", "export-mailbox-json", "next-state"]) {
    const src = path.join(root, "tools", `${name}.mjs`);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, "tools", `${name}.mjs`));
  }
  write(
    path.join(dir, "working-session/TURNFILE.yaml"),
    [
      "# TURNFILE.yaml - stale fixture",
      "turnfile:",
      '  version: "0.1.0"',
      '  project: "turnfile"',
      '  workspace: "working-session/"',
      "agents:",
      "  codex:",
      '    role: "agent"',
      '    status: "active"',
      "    current_task: null",
      '    last_seen: "codex-session-45-open"',
      '    session_id: "codex-session-45"',
      "  gemini:",
      '    role: "agent"',
      '    status: "active"',
      '    current_task: "s44-gemini-unclosed-task"',
      '    last_seen: "gemini-session-44-open"',
      '    session_id: "gemini-session-44"',
      "maintainer:",
      '  id: "snap"',
      '  status: "available"',
      '  last_seen: "maintainer-session-45"',
      "coordination:",
      "  revision: 44",
      '  active_phase: "phase-2"',
      '  active_step: "stale-agent-fixture"',
      "  conflict:",
      "    rebuttal_rounds: 1",
      "  tasks:",
      "    s44-gemini-unclosed-task:",
      '      description: "Fixture stale task"',
      '      owner: "gemini"',
      '      status: "in_progress"',
      '      priority: "P1"',
      "      depends_on: []",
      '      created_by: "gemini"',
      "      created_rev: 44",
      "      claim_rev: 44",
      "      completed_rev: null",
      '      notes: "Agent disappeared before closeout."',
      "messages: []",
      "",
    ].join("\n"),
  );
  write(path.join(dir, "working-session/boot-gemini.md"), "Gemini owned boot file must not be edited.\n");
  write(path.join(dir, "working-session/chat-gemini.md"), "Gemini owned chat file must not be edited.\n");
  try {
    fs.symlinkSync(path.join(root, "node_modules"), path.join(dir, "node_modules"), "dir");
  } catch {
    // Dependencies may already be resolvable from the repo root.
  }
  return dir;
}

function run(args, cwd = root) {
  return spawnSync(process.execPath, [tool, ...args], { cwd, encoding: "utf8" });
}

test("PRD defines the required stale-agent vocabulary", () => {
  const body = read(prd);
  for (const term of ["suspected-stale", "maintainer-stale", "stale-reconciled", "self-reconciled"]) {
    assert.match(body, new RegExp(term), `missing ${term}`);
  }
  assert.match(body, /multi-agent-resilience/i);
  assert.match(body, /stale-reconciled-by/i);
});

test("Registry records PRD-045 ownership split and RED eval package", () => {
  const registry = JSON.parse(read(path.join(root, "working-session/docs/PRD_STATUS.json")));
  const entry = registry.prds.find((p) => p.id === "PRD-045");
  assert.ok(entry, "PRD-045 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-045-stale-agent-reconciliation-policy.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.evals, "evals/prd-045.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
  assert.match(JSON.stringify(entry), /multi-agent-resilience/i);
});

test("R7: detect mode reports suspected stale state without writing", () => {
  const dir = tmpFixture();
  const before = read(path.join(dir, "working-session/TURNFILE.yaml"));
  const result = run(["--agent", "gemini", "--mode", "detect", "--format", "json"], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const out = JSON.parse(result.stdout);
  assert.equal(out.agent, "gemini");
  assert.equal(out.mode, "detect");
  assert.equal(out.status, "suspected-stale");
  assert.ok(out.indicators.length >= 1, "expected at least one stale indicator");
  assert.equal(read(path.join(dir, "working-session/TURNFILE.yaml")), before, "detect mode must not write");
});

test("R7: plan mode emits Maintainer authority requirement and proposed shared-state patch", () => {
  const dir = tmpFixture();
  const result = run(["--agent", "gemini", "--mode", "plan", "--format", "json"], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const out = JSON.parse(result.stdout);
  assert.equal(out.requires_maintainer_authorization, true);
  assert.deepEqual(out.proposed_changes.agents.gemini, {
    status: "offline",
    current_task: null,
    session_id: null,
  });
  assert.equal(out.peer_owned_files_touched, false);
});

test("R3/R7: apply mode refuses to run without Maintainer authorization", () => {
  const dir = tmpFixture();
  const result = run(["--agent", "gemini", "--mode", "apply", "--format", "json"], dir);
  assert.notEqual(result.status, 0, "apply without Maintainer authorization must fail");
  assert.match(`${result.stdout}${result.stderr}`, /maintainer.*authorization/i);
});

test("R4/R6/R8: authorized apply updates only shared control-plane state", () => {
  const dir = tmpFixture();
  const bootBefore = read(path.join(dir, "working-session/boot-gemini.md"));
  const chatBefore = read(path.join(dir, "working-session/chat-gemini.md"));
  const result = run([
    "--agent",
    "gemini",
    "--mode",
    "apply",
    "--maintainer-authorization",
    "Maintainer authorized stale reconciliation for fixture",
    "--format",
    "json",
  ], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const out = JSON.parse(result.stdout);
  assert.equal(out.applied, true);
  assert.equal(out.peer_owned_files_touched, false);
  const turnfile = read(path.join(dir, "working-session/TURNFILE.yaml"));
  assert.match(turnfile, /status: "offline"/);
  assert.match(turnfile, /current_task: null/);
  assert.match(turnfile, /session_id: null/);
  assert.match(turnfile, /stale-reconciliation/);
  assert.match(turnfile, /gemini-session-44-stale-reconciled-by-maintainer-rev\d+/);
  assert.doesNotMatch(turnfile, /status: "done"/);
  assert.equal(read(path.join(dir, "working-session/boot-gemini.md")), bootBefore);
  assert.equal(read(path.join(dir, "working-session/chat-gemini.md")), chatBefore);
});

test("R8: valid apply fixture remains Turnfile schema-valid", () => {
  const dir = tmpFixture();
  const result = run([
    "--agent",
    "gemini",
    "--mode",
    "apply",
    "--maintainer-authorization",
    "Maintainer authorized stale reconciliation for fixture",
    "--format",
    "json",
  ], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const lint = spawnSync(process.execPath, ["tools/turnfile-lint.mjs", "--turnfile", "working-session/TURNFILE.yaml"], {
    cwd: dir,
    encoding: "utf8",
  });
  assert.equal(lint.status, 0, `${lint.stdout}${lint.stderr}`);
});
