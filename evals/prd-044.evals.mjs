// PRD-044 RED evals - handshake-sign direct CLI argument ergonomics.
// Eval author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until tools/handshake-sign.mjs supports direct flag mode.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tool = path.join(root, "tools/handshake-sign.mjs");

const read = (p) => fs.readFileSync(p, "utf8");

function tmpFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd044-"));
  fs.mkdirSync(path.join(dir, "working-session"), { recursive: true });
  fs.mkdirSync(path.join(dir, "schemas/turnfile"), { recursive: true });
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  for (const f of ["MAILBOX.md", "WORKLOG.md", "NEXT_SESSION_HANDSHAKE.md", "TURNFILE.yaml"]) {
    fs.copyFileSync(path.join(root, "working-session", f), path.join(dir, "working-session", f));
  }
  fs.copyFileSync(
    path.join(root, "schemas/turnfile/turnfile-v0.schema.json"),
    path.join(dir, "schemas/turnfile/turnfile-v0.schema.json"),
  );
  for (const t of ["handshake-sign", "export-mailbox-json", "turnfile-lint", "validate-mailbox-invariants"]) {
    fs.copyFileSync(path.join(root, "tools", `${t}.mjs`), path.join(dir, "tools", `${t}.mjs`));
  }
  try {
    fs.symlinkSync(path.join(root, "node_modules"), path.join(dir, "node_modules"), "dir");
  } catch {
    // Fixture still works in environments where dependencies are already resolvable.
  }
  return dir;
}

function run(args, cwd = root, input = undefined) {
  return spawnSync(process.execPath, [tool, ...args], { cwd, encoding: "utf8", input });
}

function directArgs({ cadence = "5m", extra = [] } = {}) {
  return [
    "--agent", "codex",
    "--session", "44",
    "--model", "Codex 5.5",
    "--surface", "Codex desktop",
    "--scope", "stable-release",
    "--scope", "protocol-refinement",
    "--heartbeat-cadence", cadence,
    "--heartbeat-policy", "notify-material",
    "--heartbeat-stop", "close",
    "--heartbeat-owner", "self",
    "--tokenese-lead",
    ...extra,
  ];
}

function payload() {
  return JSON.stringify({
    session: 44,
    model: "Codex 5.5",
    surface: "Codex desktop",
    scope_ack: ["stable-release", "protocol-refinement"],
    heartbeat: { cadence: "5m", policy: "notify-material", stop: "close", owner: "self" },
    gates: "ok",
    tokenese_lead: true,
  });
}

test("R4: help documents payload mode, direct flag mode, and a direct-flag example", () => {
  const result = run(["--help"]);
  assert.equal(result.status, 0, result.stderr);
  const help = `${result.stdout}${result.stderr}`;
  assert.match(help, /--payload/);
  for (const flag of ["--session", "--model", "--surface", "--scope", "--heartbeat-cadence"]) {
    assert.match(help, new RegExp(flag), `help missing ${flag}`);
  }
  assert.match(help, /example/i);
  assert.match(help, /handshake-sign\.mjs[\s\S]*--session[\s\S]*--model/);
});

test("R1/R2/AC2: direct flag dry-run parses common fields and defaults", () => {
  const dir = tmpFixture();
  const before = read(path.join(dir, "working-session/TURNFILE.yaml"));
  const result = run(["--dry-run", ...directArgs({ cadence: "10m" })], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dry_run, true);
  assert.equal(output.agent, "codex");
  assert.equal(output.payload.session, 44);
  assert.deepEqual(output.payload.scope_ack, ["stable-release", "protocol-refinement"]);
  assert.equal(output.payload.heartbeat.cadence, "10m");
  assert.equal(output.payload.heartbeat.owner, "self");
  assert.equal(read(path.join(dir, "working-session/TURNFILE.yaml")), before, "dry-run must not write");
});

test("R1/R2: direct flag mode applies heartbeat defaults when heartbeat flags are omitted", () => {
  const dir = tmpFixture();
  const args = [
    "--agent", "codex",
    "--session", "44",
    "--model", "Codex 5.5",
    "--surface", "Codex desktop",
    "--scope", "stable-release",
    "--dry-run",
  ];
  const result = run(args, dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.payload.heartbeat.cadence, "5m");
  assert.equal(output.payload.heartbeat.policy, "notify-material");
  assert.equal(output.payload.heartbeat.stop, "close");
  assert.equal(output.payload.heartbeat.owner, "self");
  assert.equal(output.payload.tokenese_lead, true);
});

test("R1/AC3: direct flag live run writes canonical session artifacts", () => {
  const dir = tmpFixture();
  const result = run(directArgs(), dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const tf = read(path.join(dir, "working-session/TURNFILE.yaml"));
  const hs = read(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"));
  const wl = read(path.join(dir, "working-session/WORKLOG.md"));
  assert.match(tf, /last_seen: "codex-session-44-open"/);
  assert.match(tf, /current_task: "s44-handshake-heartbeat"/);
  assert.match(hs, /## Sign-off \(session 44\)/);
  assert.match(hs, /\| Codex \| yes .*stable-release, protocol-refinement/);
  assert.match(wl, /Now Working \(Codex\): SESSION 44 OPEN/);
});

test("R3/AC4: payload mode cannot be mixed with direct payload fields", () => {
  const dir = tmpFixture();
  const payloadPath = path.join(dir, "payload.json");
  fs.writeFileSync(payloadPath, payload(), "utf8");
  const result = run(["--agent", "codex", "--payload", payloadPath, "--session", "44"], dir);
  assert.notEqual(result.status, 0, "mixed payload and direct flags must fail");
  assert.match(`${result.stdout}${result.stderr}`, /payload.*direct|direct.*payload|cannot.*combine/i);
});

test("R5: existing JSON payload mode remains valid", () => {
  const dir = tmpFixture();
  const payloadPath = path.join(dir, "payload.json");
  fs.writeFileSync(payloadPath, payload(), "utf8");
  const result = run(["--agent", "codex", "--payload", payloadPath, "--dry-run"], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dry_run, true);
  assert.equal(output.agent, "codex");
  assert.equal(output.next_rev > 0, true);
});

test("Registry: PRD-044 records A1 ownership split", () => {
  const registry = JSON.parse(read(path.join(root, "working-session/docs/PRD_STATUS.json")));
  const entry = registry.prds.find((p) => p.id === "PRD-044");
  assert.ok(entry, "PRD-044 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-044-handshake-sign-cli-ergonomics.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.evals, "evals/prd-044.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
