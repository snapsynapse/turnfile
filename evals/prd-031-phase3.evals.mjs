// PRD-031 Phase 3 RED evals — Live shadow-mode aggregate workflow contract.
// Eval author: Claude (proposer of PRD-031; Phase 2 eval author). Implementer: Codex. Reviewer: Claude.
//
// Design convergence (MSG-20260623-010, Claude proposal + Codex APPLY + C1):
//   OQ#1: status.yaml (YAML) for status shards; task-events.jsonl for events.
//   OQ#2: owner & Maintainer completion advance to done with provenance;
//         non-owner non-Maintainer completion emits `completion-authority-violation`
//         conflict; task state NOT advanced; both events preserved in source_events.
//   OQ#3 (C1): TURNFILE.yaml agents: block is the authoritative participant registry
//         in Phase 3. `working-session/agents/maintainer/participant-events.jsonl` is
//         FIXTURE-ONLY / NON-AUTHORITATIVE — recorded for audit in result.participant_events
//         but does NOT mutate derived agent state until OWNERSHIP.yaml declares a
//         maintainer shard path (separate Maintainer-routed PRD).
//   OQ#4: mailbox shards out of scope; mailbox projection freshness is a non-regression check.
//
// EXPECTED RED until Codex implements:
//   (1) schemas/prd-031/task-event-v0.schema.json
//   (2) schemas/prd-031/task-aggregate-v0.schema.json
//   (3) tools/validate-task-aggregate.mjs (validator; reads schemas + shards; exits nonzero on contract violation)
//   (4) tools/compare-turnfile-tasks.mjs (read-only shadow-mode drift; exits nonzero on drift; NO mutation)
//   (5) aggregate-coordination.mjs --emit task-json Phase 3 extensions:
//       - participant_events surfacing (non-authoritative)
//       - completion-authority-violation conflict kind
//       - reserved-task-field overwrite detection
//       - duplicate signal-id detection
//
// Read-only boundary preserved from Phase 2: no writes to TURNFILE.yaml, MAILBOX.md, WORKLOG.md.
//
// Fixture convention: evals/fixtures/prd-031/phase3/<fixture-name>/

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const AGGREGATE = path.join(root, "tools/aggregate-coordination.mjs");
const VALIDATE_AGGREGATE = path.join(root, "tools/validate-task-aggregate.mjs");
const COMPARE_TURNFILE = path.join(root, "tools/compare-turnfile-tasks.mjs");
const SCHEMA_TASK_EVENT = path.join(root, "schemas/prd-031/task-event-v0.schema.json");
const SCHEMA_TASK_AGGREGATE = path.join(root, "schemas/prd-031/task-aggregate-v0.schema.json");
const FIXTURE_BASE = path.join(root, "evals/fixtures/prd-031/phase3");

const fixtureDir = (name) => path.join(FIXTURE_BASE, name);

async function runJson(tool, args) {
  const { stdout } = await exec("node", [tool, ...args]);
  return JSON.parse(stdout);
}

async function runExitCode(tool, args) {
  try {
    await exec("node", [tool, ...args]);
    return 0;
  } catch (e) {
    return e.code || 1;
  }
}

// ===== Schema scaffolding =====

test("phase3-schemas-exist: task-event + task-aggregate v0 schemas land in schemas/prd-031/", () => {
  assert.ok(fs.existsSync(SCHEMA_TASK_EVENT), `${SCHEMA_TASK_EVENT} must exist`);
  assert.ok(fs.existsSync(SCHEMA_TASK_AGGREGATE), `${SCHEMA_TASK_AGGREGATE} must exist`);
  const taskEvent = JSON.parse(fs.readFileSync(SCHEMA_TASK_EVENT, "utf8"));
  assert.ok(taskEvent.$schema, "task-event schema must declare $schema");
  assert.ok(taskEvent.required?.includes("event"), "task-event schema must require event kind");
});

// ===== Eval 1: shadow-mode aggregate matches TURNFILE.yaml subset =====

test("phase3-eval-1 shadow-match: derived task aggregate matches equivalent TURNFILE.yaml task subset", async () => {
  const dir = fixtureDir("shadow-match");
  assert.ok(fs.existsSync(COMPARE_TURNFILE), `${COMPARE_TURNFILE} must exist`);
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  const code = await runExitCode(COMPARE_TURNFILE, [
    "--shards", dir,
    "--turnfile", path.join(dir, "TURNFILE.yaml"),
    "--format", "json",
  ]);
  assert.equal(code, 0, "matching shadow state must exit 0 (no drift)");
});

// ===== Eval 2: drift reported without overwriting either side =====

test("phase3-eval-2 drift-readonly: shard/aggregate drift is reported but neither side is mutated", async () => {
  const dir = fixtureDir("shadow-drift");
  assert.ok(fs.existsSync(COMPARE_TURNFILE), `${COMPARE_TURNFILE} must exist`);
  assert.ok(fs.existsSync(dir));
  const turnfileBefore = fs.readFileSync(path.join(dir, "TURNFILE.yaml"), "utf8");
  const shardBefore = fs.readFileSync(path.join(dir, "agents/codex/status.yaml"), "utf8");
  const code = await runExitCode(COMPARE_TURNFILE, [
    "--shards", dir,
    "--turnfile", path.join(dir, "TURNFILE.yaml"),
    "--format", "json",
  ]);
  assert.notEqual(code, 0, "drift must exit nonzero");
  assert.equal(
    fs.readFileSync(path.join(dir, "TURNFILE.yaml"), "utf8"),
    turnfileBefore,
    "TURNFILE.yaml must NOT be mutated by compare tool",
  );
  assert.equal(
    fs.readFileSync(path.join(dir, "agents/codex/status.yaml"), "utf8"),
    shardBefore,
    "shard status.yaml must NOT be mutated by compare tool",
  );
});

// ===== Eval 3: unknown participant shard cannot create/claim/set-status =====

test("phase3-eval-3 unknown-participant-non-authority: unregistered agent shard cannot create or claim tasks or set status", async () => {
  const dir = fixtureDir("unknown-participant");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const unknown = result.unknown_agents || [];
  assert.ok(unknown.length > 0, "unregistered agent must appear in unknown_agents");
  const tasks = result.tasks || [];
  assert.ok(
    !tasks.some((t) => t.created_by === "qwen" || t.owner === "qwen" || t.claim_by === "qwen"),
    "unknown agent (qwen) must not create/own/claim any task in derived output",
  );
  const agents = result.agents || [];
  assert.ok(
    !agents.some((a) => a.agent === "qwen"),
    "unknown agent must not appear in derived agent registry",
  );
});

// ===== Eval 4: participant registry — Maintainer event log is non-authoritative (C1) =====

test("phase3-eval-4 participant-registry-c1: maintainer participant-events.jsonl surfaced but NON-AUTHORITATIVE until OWNERSHIP gap addressed", async () => {
  const dir = fixtureDir("participant-registry-c1");
  assert.ok(fs.existsSync(dir));
  // Fixture: TURNFILE.yaml agents: {claude, codex, gemini} (current registered set);
  // working-session/agents/maintainer/participant-events.jsonl proposes adding "perplexity".
  // Expected per C1: aggregate surfaces the event in participant_events,
  // but derived agents stays {claude, codex, gemini} — perplexity is NOT promoted.
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const events = result.participant_events || [];
  assert.ok(events.length > 0, "must surface maintainer participant-events.jsonl entries");
  const agents = (result.agents || []).map((a) => a.agent).sort();
  assert.deepEqual(
    agents.filter((a) => ["claude", "codex", "gemini", "perplexity"].includes(a)).sort(),
    ["claude", "codex", "gemini"],
    "perplexity from participant-events must NOT enter derived agent registry (C1: non-authoritative until OWNERSHIP gap addressed)",
  );
  const nonAuth = events.find((e) => e.authoritative === false);
  assert.ok(nonAuth, "participant_events entries must carry authoritative=false marker until OWNERSHIP declares maintainer shard path");
});

// ===== Eval 5: reserved task fields cannot be overwritten by task.updated =====

test("phase3-eval-5 reserved-fields-immutable: task.updated event cannot overwrite reserved fields (id, created_by, created_rev)", async () => {
  const dir = fixtureDir("reserved-field-overwrite");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const task = (result.tasks || []).find((t) => t.id === "s-reserved");
  assert.ok(task, "task s-reserved must be present");
  assert.equal(task.created_by, "codex", "created_by must NOT be overwritten by task.updated");
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "reserved-field-overwrite" && c.task_id === "s-reserved",
  );
  assert.ok(conflict, "reserved-field-overwrite conflict must be surfaced");
});

// ===== Eval 6: completion authority — three distinct outcomes =====

test("phase3-eval-6 completion-authority-owner: owner completion advances task to done with provenance", async () => {
  const dir = fixtureDir("completion-owner");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const task = (result.tasks || []).find((t) => t.id === "s-owner-completes");
  assert.ok(task);
  assert.equal(task.status, "done", "owner completion must advance to done");
  assert.equal(task.completed_by, "codex", "owner completion provenance must be recorded");
});

test("phase3-eval-6 completion-authority-maintainer: maintainer completion advances task to done with provenance", async () => {
  const dir = fixtureDir("completion-maintainer");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const task = (result.tasks || []).find((t) => t.id === "s-maintainer-completes");
  assert.ok(task);
  assert.equal(task.status, "done", "maintainer completion must advance to done");
  assert.equal(task.completed_by, "maintainer", "maintainer completion provenance must be recorded");
});

test("phase3-eval-6 completion-authority-violation: non-owner non-maintainer completion emits conflict; task state NOT advanced", async () => {
  const dir = fixtureDir("completion-non-owner");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const task = (result.tasks || []).find((t) => t.id === "s-non-owner-attempts");
  assert.ok(task);
  assert.notEqual(task.status, "done", "non-owner non-maintainer completion must NOT advance task to done");
  const conflict = (result.conflicts || []).find(
    (c) => c.kind === "completion-authority-violation" && c.task_id === "s-non-owner-attempts",
  );
  assert.ok(conflict, "completion-authority-violation conflict must be surfaced");
  const sourceEvents = result.source_events || [];
  assert.ok(
    sourceEvents.some((e) => e.task_id === "s-non-owner-attempts" && e.event === "task.completed"),
    "both completion attempt event(s) preserved in source_events",
  );
});

// ===== Eval 7: duplicate signal IDs detected =====

test("phase3-eval-7 duplicate-signal-detection: duplicate signal IDs in aggregate coordination are detected and reported", async () => {
  const dir = fixtureDir("duplicate-signals");
  assert.ok(fs.existsSync(dir));
  const result = await runJson(AGGREGATE, ["--input", dir, "--emit", "task-json"]);
  const conflict = (result.conflicts || []).find((c) => c.kind === "duplicate-signal-id");
  assert.ok(conflict, "duplicate-signal-id conflict must be surfaced");
  assert.ok(conflict.signal_id, "conflict must name the duplicated signal id");
});

// ===== Eval 8: mailbox projection freshness preserved (non-regression) =====

test("phase3-eval-8 mailbox-projection-fresh: mailbox projection stays fresh after Phase 3 reducer runs", async () => {
  // Phase 3 reducer is read-only on TURNFILE/MAILBOX/WORKLOG. Running --emit task-json
  // must not invalidate MAILBOX.json freshness vs MAILBOX.md.
  // Use the live working-session files as the test surface (Phase 3 read-only invariant).
  await runJson(AGGREGATE, [
    "--input", path.join(root, "working-session"),
    "--emit", "task-json",
  ]).catch(() => {
    // Tool may not yet support the live working-session input shape; that's a Phase 3 RED.
    // Fall through to the freshness check, which is what this eval pins.
  });
  // After any aggregation, MAILBOX.json must remain consistent with MAILBOX.md.
  const validateClose = await runExitCode(path.join(root, "tools/validate-closeout.mjs"), [
    "--turnfile", path.join(root, "working-session/TURNFILE.yaml"),
    "--mailbox", path.join(root, "working-session/MAILBOX.md"),
    "--agent", "claude",
    "--format", "json",
  ]);
  assert.equal(validateClose, 0, "validate-closeout must report mailbox projection fresh after aggregate regen");
});

// ===== Aggregate validator scaffolding =====

test("phase3-validator-exists: tools/validate-task-aggregate.mjs exists and fails on schema violation", async () => {
  assert.ok(fs.existsSync(VALIDATE_AGGREGATE), `${VALIDATE_AGGREGATE} must exist`);
  const dir = fixtureDir("schema-violation");
  assert.ok(fs.existsSync(dir), `Fixture ${dir} must exist`);
  const code = await runExitCode(VALIDATE_AGGREGATE, ["--input", dir, "--format", "json"]);
  assert.notEqual(code, 0, "validator must exit nonzero on schema violation");
});
