// PRD-049 RED evals - same-family multi-instance collaboration.
// Eval author: Claude (Fable 5). Expected implementer: Codex. Reviewer: Claude family (one voice).
// EXPECTED TO FAIL until schema/lint/handshake instance support lands.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

const SCHEMA_REL = "schemas/turnfile/turnfile-v0.schema.json";

function runLint(turnfilePath) {
  try {
    const stdout = execFileSync(
      "node",
      [
        path.join(root, "tools/turnfile-lint.mjs"),
        "--turnfile",
        turnfilePath,
        "--schema",
        path.join(root, SCHEMA_REL),
      ],
      { encoding: "utf8" },
    );
    return { ok: true, output: stdout };
  } catch (err) {
    return { ok: false, output: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

function runPromotion(registryPath) {
  try {
    const stdout = execFileSync(
      "node",
      [
        path.join(root, "tools/validate-prd-promotion.mjs"),
        "--registry",
        registryPath,
      ],
      { encoding: "utf8" },
    );
    return { ok: true, output: stdout };
  } catch (err) {
    return { ok: false, output: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

function runHandshake(args, cwd = root) {
  try {
    const stdout = execFileSync(
      "node",
      [path.join(root, "tools/handshake-sign.mjs"), ...args],
      { cwd, encoding: "utf8" },
    );
    return { ok: true, output: stdout };
  } catch (err) {
    return { ok: false, output: `${err.stdout || ""}${err.stderr || ""}` };
  }
}

function writeFixture(yaml) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd049-"));
  const file = path.join(dir, "TURNFILE.yaml");
  fs.writeFileSync(file, yaml);
  return file;
}

function writeJsonFixture(value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd049-json-"));
  const file = path.join(dir, "PRD_STATUS.json");
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  return file;
}

function writeDuplicateReviewRegistryFixture() {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-049");
  assert.ok(entry, "live registry must contain PRD-049 for duplicate-review fixture");
  delete entry.acceptance.claude;
  entry.acceptance["claude/fable-5"] = { status: "accepted", evidence: ["fixture"] };
  entry.acceptance["claude/opus-4-8"] = { status: "accepted", evidence: ["fixture"] };
  return writeJsonFixture(registry);
}

function writeHandshakeRoot(turnfileYaml) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd049-handshake-"));
  fs.mkdirSync(path.join(dir, "working-session/docs"), { recursive: true });
  fs.writeFileSync(path.join(dir, "working-session/TURNFILE.yaml"), turnfileYaml);
  fs.writeFileSync(path.join(dir, "working-session/MAILBOX.md"), "# Mailbox\n");
  fs.writeFileSync(path.join(dir, "working-session/WORKLOG.md"), "# Worklog\n");
  fs.writeFileSync(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"), "# Handshake\n");
  fs.writeFileSync(path.join(dir, "working-session/docs/PRD_STATUS.json"), JSON.stringify({ prds: [] }, null, 2));
  return dir;
}

const baseFixture = (instancesBlock) => `turnfile:
  version: "0.5.0"
  project: "prd049-fixture"
  workspace: "working-session/"

agents:
  codex:
    role: "agent"
    status: "idle"
    current_task: null
    last_seen: "fixture"
    session_id: null
  claude:
    role: "agent"
    status: "active"
    current_task: "fixture-task"
    last_seen: "fixture"
    session_id: "claude-session-fixture"
${instancesBlock}
maintainer:
  id: "snap"
  status: "available"
  last_seen: "fixture"

coordination:
  revision: 1
  active_phase: "phase-1"
  active_step: "fixture"
  tasks:
    fixture-task:
      description: "PRD-049 lint fixture task."
      owner: "claude"
      status: "in_progress"
      priority: "P1"
      depends_on: []
      created_by: "claude"
      created_rev: 1
      claim_rev: 1
      completed_rev: null

locks: {}

turn_queue: []

messages: []
`;

const twoInstances = `    instances:
      fable-5:
        model: "claude-fable-5"
        session_id: "claude-session-31"
        status: "active"
        current_task: "fixture-task"
        lane_role: "primary"
      opus-4-8:
        model: "claude-opus-4-8"
        session_id: "claude-session-30"
        status: "active"
        current_task: null
        lane_role: "secondary"
`;

const fourInstances = `    instances:
      fable-5:
        model: "claude-fable-5"
        session_id: "s1"
        status: "active"
        current_task: null
        lane_role: "primary"
      opus-4-8:
        model: "claude-opus-4-8"
        session_id: "s2"
        status: "active"
        current_task: null
        lane_role: "secondary"
      opus-4-7:
        model: "claude-opus-4-7"
        session_id: "s3"
        status: "active"
        current_task: null
        lane_role: "secondary"
      haiku-4-5:
        model: "claude-haiku-4-5"
        session_id: "s4"
        status: "active"
        current_task: null
        lane_role: "secondary"
`;

const twoPrimaries = `    instances:
      fable-5:
        model: "claude-fable-5"
        session_id: "s1"
        status: "active"
        current_task: null
        lane_role: "primary"
      opus-4-8:
        model: "claude-opus-4-8"
        session_id: "s2"
        status: "active"
        current_task: null
        lane_role: "primary"
`;

const threeInstances = `    instances:
      fable-5:
        model: "claude-fable-5"
        session_id: "s1"
        status: "active"
        current_task: null
        lane_role: "primary"
      opus-4-8:
        model: "claude-opus-4-8"
        session_id: "s2"
        status: "active"
        current_task: null
        lane_role: "secondary"
      opus-4-7:
        model: "claude-opus-4-7"
        session_id: "s3"
        status: "active"
        current_task: null
        lane_role: "secondary"
`;

test("R1: schema accepts a valid two-instance family shape", () => {
  const result = runLint(writeFixture(baseFixture(twoInstances)));
  assert.equal(result.ok, true, `two-instance fixture must lint clean:\n${result.output}`);
});

test("R1 back-compat: single-instance shape (no instances map) still lints clean", () => {
  const result = runLint(writeFixture(baseFixture("")));
  assert.equal(result.ok, true, `single-instance fixture must lint clean:\n${result.output}`);
});

test("R1 back-compat: this repo's live TURNFILE.yaml lints clean unchanged", () => {
  const result = runLint(path.join(root, "working-session/TURNFILE.yaml"));
  assert.equal(result.ok, true, `live TURNFILE.yaml must lint clean:\n${result.output}`);
});

test("R2: lint rejects a 4th instance in one family (cap 3)", () => {
  // Guard against false green: the failure must be the cap, not schema
  // rejection of the instances shape itself. A valid 2-instance fixture
  // must lint clean before the 4-instance rejection counts.
  const twoOk = runLint(writeFixture(baseFixture(twoInstances)));
  assert.equal(twoOk.ok, true, "two-instance fixture must lint clean (else cap failure is untestable)");
  const result = runLint(writeFixture(baseFixture(fourInstances)));
  assert.equal(result.ok, false, "four-instance fixture must FAIL lint (cap is 3)");
  assert.match(result.output, /cap|at most|maximum/i, "failure output must name the instance cap");
});

test("R4: lint rejects two primaries in one family", () => {
  const result = runLint(writeFixture(baseFixture(twoPrimaries)));
  assert.equal(result.ok, false, "two-primary fixture must FAIL lint (exactly one primary)");
  assert.match(result.output, /primary/i, "failure output must name the primary invariant");
});

test("R4/R6: handshake or CLI open supports --instance flag", () => {
  const candidates = ["tools/handshake-sign.mjs", "tools/turnfile.mjs"];
  const supported = candidates.some(
    (rel) => exists(rel) && /--instance/.test(read(rel)),
  );
  assert.equal(supported, true, "handshake-sign.mjs or turnfile.mjs must implement --instance");
});

test("R2/AC3: handshake-sign refuses a fourth same-family instance before boot", () => {
  const fixtureRoot = writeHandshakeRoot(baseFixture(threeInstances));
  const result = runHandshake(
    [
      "--agent", "claude",
      "--session", "49",
      "--model", "Claude Haiku 4.5",
      "--surface", "Claude Code",
      "--scope", "prd049",
      "--instance", "haiku-4-5",
      "--dry-run",
    ],
    fixtureRoot,
  );
  assert.equal(result.ok, false, "handshake-sign must refuse a fourth instance before boot");
  assert.match(result.output, /cap|at most|maximum|fourth/i, "failure output must name the cap");
  assert.match(result.output, /fable-5|opus-4-8|opus-4-7/i, "failure output must name live instances");
});

test("R3: one-voice quorum rule documented in protocol docs", () => {
  const docCandidates = [
    "docs/PROTOCOL_CORE.md",
    "docs/COMMUNICATIONS_PROTOCOL.md",
    "docs/CONFLICT_RESOLUTION.md",
  ].filter(exists);
  const documented = docCandidates.some((rel) =>
    /one\s+(family[,\s]+one\s+)?voice|instances?\s+count\s+as\s+one/i.test(read(rel)),
  );
  assert.equal(documented, true, "protocol docs must state the one-family-one-voice quorum rule");
});

test("AC5: PRD validator rejects two same-family instance review records for one reviewer slot", () => {
  const registryPath = writeDuplicateReviewRegistryFixture();
  const result = runPromotion(registryPath);
  assert.equal(result.ok, false, "two same-family instance review records must fail validation");
  assert.match(result.output, /one[- ]family[- ]one[- ]voice|same-family|one voice|instance/i);
  assert.match(result.output, /claude\/fable-5|claude\/opus-4-8/i);
});

test("R5: instance heartbeat sentinel naming documented or implemented", () => {
  const sources = ["tools/turnfile.mjs", "docs/PROTOCOL_CORE.md", "docs/COMMUNICATIONS_PROTOCOL.md"]
    .filter(exists)
    .map(read)
    .join("\n");
  assert.match(
    sources,
    /HEARTBEAT-[\w<>.-]+\.md|HEARTBEAT-<family>/i,
    "instance-scoped heartbeat sentinel naming must be documented or implemented",
  );
});

test("R9: ephemeral delegate rule documented in protocol docs", () => {
  const docCandidates = [
    "docs/PROTOCOL_CORE.md",
    "docs/COMMUNICATIONS_PROTOCOL.md",
    "docs/HUMAN_GOVERNANCE.md",
  ].filter(exists);
  const text = docCandidates.map(read).join("\n");
  assert.match(
    text,
    /delegate|subagent|fan-?out/i,
    "protocol docs must define the ephemeral delegate tier",
  );
  assert.match(
    text,
    /spawner|spawning (agent|instance)/i,
    "protocol docs must state spawner attribution for delegate output",
  );
  assert.match(
    text,
    /(delegate|subagent)s?[^.\n]*(never|must not|cannot)[^.\n]*(coordination|TURNFILE|mailbox|review|quorum)/i,
    "protocol docs must deny delegates direct coordination writes and quorum standing",
  );
});

test("Registry: PRD_STATUS records PRD-049 ownership and promoted implementation package", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-049");
  assert.ok(entry, "PRD-049 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-049-same-family-multi-instance-collaboration.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.state, "done");
  assert.equal(entry.implementation?.evals, "evals/prd-049.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "claude");
  assert.equal(entry.implementation?.implementer, "codex");
  assert.equal(entry.implementation?.reviewer, "claude");
});
