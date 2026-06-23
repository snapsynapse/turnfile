// PRD-031 Phase 2 RED evals — Task/Status Shard Event-Sourcing Contract.
// Eval author: Claude (proposer of PRD-031). Implementer: Codex. Reviewer: Claude.
// EXPECTED RED until Codex implements:
//   (1) status.yaml shard support in aggregate-coordination.mjs
//   (2) task-events.jsonl shard support with reducer
//   (3) --emit task-json output shape
//
// Fixture convention: evals/fixtures/prd-031/phase2/<fixture-name>/
//   Each fixture is a self-contained agents/ tree that aggregate-coordination
//   can read with --input <fixture-dir>.
//
// Contract surfaces (PRD-031 Phase 2):
//   - Status shards: working-session/agents/<agent>/status.yaml
//   - Task event shards: working-session/agents/<agent>/task-events.jsonl
//   - Derived outputs: task-json (tasks + agents + conflicts + unknown_agents)
//   - Read-only aggregate: no writes to TURNFILE.yaml, MAILBOX.md, WORKLOG.md

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const AGGREGATE = path.join(root, "tools/aggregate-coordination.mjs");
const FIXTURE_BASE = path.join(root, "evals/fixtures/prd-031/phase2");

function fixtureDir(name) {
  return path.join(FIXTURE_BASE, name);
}

function hasAggregate() {
  return fs.existsSync(AGGREGATE);
}

// ===== R1: Status shard owner match =====

test("status-owner-match: shard with matching agent folds into derived agent table", async () => {
  const dir = fixtureDir("status-owner-match");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate(), "aggregate-coordination.mjs must exist");

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  assert.ok(Array.isArray(result.agents), "result must have agents array");
  const codex = result.agents.find((a) => a.agent === "codex");
  assert.ok(codex, "codex agent should appear in derived table");
  assert.equal(codex.status, "active", "status should reflect shard value");
});

test("status-owner-mismatch: shard whose agent field mismatches directory owner emits conflict", async () => {
  const dir = fixtureDir("status-owner-mismatch");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "status-owner-mismatch",
  );
  assert.ok(conflict, "must emit status-owner-mismatch conflict");
  assert.ok(
    !(result.agents || []).some((a) => a.agent === "gemini" && a._source === "codex-shard"),
    "mismatched shard must not update another agent's state",
  );
});

// ===== R2: Unknown agent shards =====

test("unknown-agent-status: shard from unregistered agent emits unknown_agents candidate", async () => {
  const dir = fixtureDir("unknown-agent-status");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  assert.ok(Array.isArray(result.unknown_agents), "result must have unknown_agents array");
  const qwen = result.unknown_agents.find((u) => u.agent === "qwen");
  assert.ok(qwen, "qwen should appear as unknown_agents candidate, not full participant");
});

// ===== R3: Task lifecycle fold =====

test("single-task-flow: created->claimed->updated->completed folds into done task", async () => {
  const dir = fixtureDir("single-task-flow");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  assert.ok(Array.isArray(result.tasks), "result must have tasks array");
  const task = result.tasks.find((t) => t.task_id === "s-single-flow");
  assert.ok(task, "task must appear in derived table");
  assert.equal(task.status, "done", "task should be done after completed event");
});

// ===== R4: Concurrent claim conflict =====

test("concurrent-claims: two agents claim same task, reducer emits claim-conflict", async () => {
  const dir = fixtureDir("concurrent-claims");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "claim-conflict" && c.task_id === "s-contested",
  );
  assert.ok(conflict, "must emit claim-conflict for concurrent claims");
  assert.ok(
    conflict.actors.length >= 2,
    "conflict must name at least two actors",
  );
});

test("owner-completion-only: completion does not erase competing claims", async () => {
  const dir = fixtureDir("concurrent-claims");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const task = result.tasks.find((t) => t.task_id === "s-contested");
  assert.ok(task, "contested task must appear");
  assert.ok(
    task.claims && task.claims.length >= 2,
    "both claims must be retained even if one agent completed",
  );
});

// ===== R5: Duplicate create =====

test("duplicate-create: two creates for same task_id emit duplicate-task-create conflict", async () => {
  const dir = fixtureDir("duplicate-create");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "duplicate-task-create",
  );
  assert.ok(conflict, "must emit duplicate-task-create conflict");
});

// ===== R6: Causal ordering determinism =====

test("causal-ordering: out-of-order files produce deterministic table from deps graph", async () => {
  const dir = fixtureDir("causal-ordering");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const run1 = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const run2 = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  assert.deepEqual(
    JSON.parse(run1.stdout),
    JSON.parse(run2.stdout),
    "two runs on identical input must produce identical output",
  );
});

// ===== R7: Cycle detection =====

test("cycle-ordering: cyclic deps emit dependency-cycle and fall back to deterministic ordering", async () => {
  const dir = fixtureDir("cycle-ordering");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "dependency-cycle",
  );
  assert.ok(conflict, "must emit dependency-cycle conflict");
  assert.ok(Array.isArray(result.tasks) && result.tasks.length > 0, "tasks still produced despite cycle");
});

// ===== R8: Read-only aggregate =====

test("read-only-aggregate: --emit task-json writes no shared aggregate files", async () => {
  const dir = fixtureDir("single-task-flow");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const turnfileBefore = fs.existsSync(path.join(root, "working-session/TURNFILE.yaml"))
    ? fs.readFileSync(path.join(root, "working-session/TURNFILE.yaml"), "utf8")
    : null;
  const mailboxBefore = fs.existsSync(path.join(root, "working-session/MAILBOX.md"))
    ? fs.readFileSync(path.join(root, "working-session/MAILBOX.md"), "utf8")
    : null;
  const worklogBefore = fs.existsSync(path.join(root, "working-session/WORKLOG.md"))
    ? fs.readFileSync(path.join(root, "working-session/WORKLOG.md"), "utf8")
    : null;

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);

  const turnfileAfter = fs.existsSync(path.join(root, "working-session/TURNFILE.yaml"))
    ? fs.readFileSync(path.join(root, "working-session/TURNFILE.yaml"), "utf8")
    : null;
  const mailboxAfter = fs.existsSync(path.join(root, "working-session/MAILBOX.md"))
    ? fs.readFileSync(path.join(root, "working-session/MAILBOX.md"), "utf8")
    : null;
  const worklogAfter = fs.existsSync(path.join(root, "working-session/WORKLOG.md"))
    ? fs.readFileSync(path.join(root, "working-session/WORKLOG.md"), "utf8")
    : null;

  assert.equal(turnfileBefore, turnfileAfter, "TURNFILE.yaml must not be modified by aggregate");
  assert.equal(mailboxBefore, mailboxAfter, "MAILBOX.md must not be modified by aggregate");
  assert.equal(worklogBefore, worklogAfter, "WORKLOG.md must not be modified by aggregate");
});

// ===== R9: Unknown agent cannot bootstrap authority =====

test("unknown-agent-no-task-authority: unknown agent task events do not create authoritative tasks", async () => {
  const dir = fixtureDir("unknown-agent-status");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  assert.ok(hasAggregate());

  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);
  const { stdout } = await exec("node", [AGGREGATE, "--input", dir, "--emit", "task-json"]);
  const result = JSON.parse(stdout);
  const qwenTasks = (result.tasks || []).filter(
    (t) => t.owner === "qwen" || t.created_by === "qwen",
  );
  assert.equal(
    qwenTasks.length,
    0,
    "unknown agent must not own or create authoritative tasks",
  );
});
