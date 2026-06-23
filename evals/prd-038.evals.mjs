// PRD-038 implementation evals - Read-Only Heartbeat Stewards.
// Proposer: Codex. Reviewer: Claude/Gemini. Expected implementer: Codex.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/handshake-sign.mjs");

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function tmpFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd038-"));
  fs.mkdirSync(path.join(dir, "working-session"), { recursive: true });
  fs.mkdirSync(path.join(dir, "schemas/turnfile"), { recursive: true });
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  for (const f of ["MAILBOX.md", "WORKLOG.md", "NEXT_SESSION_HANDSHAKE.md", "TURNFILE.yaml"]) {
    fs.copyFileSync(path.join(root, "working-session", f), path.join(dir, "working-session", f));
  }
  fs.copyFileSync(path.join(root, "schemas/turnfile/turnfile-v0.schema.json"), path.join(dir, "schemas/turnfile/turnfile-v0.schema.json"));
  for (const t of ["handshake-sign", "export-mailbox-json", "turnfile-lint", "validate-mailbox-invariants"]) {
    fs.copyFileSync(path.join(root, "tools", `${t}.mjs`), path.join(dir, "tools", `${t}.mjs`));
  }
  try {
    fs.symlinkSync(path.join(root, "node_modules"), path.join(dir, "node_modules"), "dir");
  } catch {
    // Best effort for filesystems that do not allow symlinks.
  }
  return dir;
}

function payload(overrides = {}) {
  return JSON.stringify({
    session: 38,
    model: "GPT-5",
    surface: "Codex desktop",
    scope_ack: ["boot+handshake+heartbeat"],
    heartbeat: {
      cadence: "5m",
      policy: "notify-material-only",
      stop: "delete-at-close",
      owner: "self",
      ...overrides.heartbeat,
    },
    gates: "ok",
    tokenese_lead: true,
    ...overrides,
  });
}

function runTool(cwd, args) {
  return spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: "utf8" });
}

function sessionSection(text, session) {
  const start = text.indexOf(`## Sign-off (session ${session})`);
  assert.ok(start >= 0, `session ${session} sign-off section missing`);
  const next = text.indexOf("\n## ", start + 1);
  return text.slice(start, next === -1 ? text.length : next);
}

test("R1-R8: PRD-038 records read-only steward semantics, heartbeat negotiation, and closeout lifecycle", () => {
  const s = read("docs/prds/PRD-038-read-only-heartbeat-stewards.md");
  for (const needle of [
    /One read-only steward per runtime/i,
    /Default steward mode is read-only/i,
    /Write-capable heartbeat is explicit elevation/i,
    /Handshake cadence-window negotiation/i,
    /Cadence does not synchronize agents/i,
    /Notification contract for read-only stewards/i,
    /Closeout lifecycle/i,
    /Relationship to PRD-030 and PRD-037/i,
  ]) {
    assert.match(s, needle);
  }
});

test("R2: read-only steward deny-list excludes shared-file mutation and Turnfile authority", () => {
  const s = read("docs/prds/PRD-038-read-only-heartbeat-stewards.md");
  for (const needle of [
    /must not:[\s\S]*Edit any file/i,
    /Regenerate `MAILBOX\.json`/i,
    /Change mailbox status/i,
    /Create Turnfile signals/i,
    /Advance `coordination\.revision`/i,
    /Claim or complete tasks/i,
    /Create, update, or delete locks/i,
    /Stage, commit, push, or run destructive commands/i,
  ]) {
    assert.match(s, needle);
  }
});

test("R4/AC1-AC2: handshake-sign emits read-only steward mode in the signed heartbeat row by default", () => {
  const dir = tmpFixture();
  const pf = path.join(dir, "payload.json");
  fs.writeFileSync(pf, payload());
  const out = runTool(dir, ["--agent", "codex", "--payload", pf]);
  assert.equal(out.status, 0, out.stdout + out.stderr);
  const hs = fs.readFileSync(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"), "utf8");
  const row = sessionSection(hs, 38).split("\n").find((line) => line.startsWith("| Codex |") && line.includes("GPT-5"));
  assert.ok(row, "Codex signed row missing");
  assert.match(row, /read-only steward/i);
  assert.match(row, /write-capable.*explicit|explicit.*write-capable/i);
});

test("R4/AC1-AC2: handshake-sign records explicit write-capable elevation separately when named", () => {
  const dir = tmpFixture();
  const pf = path.join(dir, "payload.json");
  fs.writeFileSync(pf, payload({ heartbeat: { mode: "write-capable", write_scope: "MAILBOX lifecycle only" } }));
  const out = runTool(dir, ["--agent", "codex", "--payload", pf]);
  assert.equal(out.status, 0, out.stdout + out.stderr);
  const hs = fs.readFileSync(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"), "utf8");
  const row = sessionSection(hs, 38).split("\n").find((line) => line.startsWith("| Codex |") && line.includes("GPT-5"));
  assert.ok(row, "Codex signed row missing");
  assert.match(row, /write-capable heartbeat/i);
  assert.match(row, /MAILBOX lifecycle only/);
});

test("R6: read-only heartbeat validator reports sent-message activity without mutating shared files", () => {
  assert.equal(fs.existsSync(path.join(root, "tools/validate-heartbeat-loop.mjs")), true);
  const s = read("tools/validate-heartbeat-loop.mjs");
  assert.match(s, /sentMessageActivity/);
  assert.doesNotMatch(s, /writeFileSync|appendFileSync|rmSync|renameSync|mkdirSync/);
});

test("AC8: closeout validator inspects heartbeat lifecycle for deletion or carry-forward decisions", () => {
  const s = read("tools/validate-closeout.mjs");
  assert.match(s, /heartbeat|active_card_owner_review|signal_log/i);
  const skill = read("skills/codex/SKILL.md");
  assert.match(skill, /Closeout must inspect active heartbeats/i);
  assert.match(skill, /carried-forward heartbeat.*WORKLOG/i);
});

test("AC9: implementation does not introduce a shared cross-runtime coordinator", () => {
  const combined = [
    read("tools/handshake-sign.mjs"),
    read("tools/validate-heartbeat-loop.mjs"),
  ].join("\n");
  assert.doesNotMatch(combined, /cross-runtime coordinator|shared scheduler|central coordinator/i);
  assert.match(combined, /self-owned|owning runtime|owner/i);
});

test("Registry records this concrete PRD-038 eval suite and Codex implementation lane", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-038");
  assert.ok(entry, "PRD-038 missing from registry");
  assert.equal(entry.implementation?.evals, "evals/prd-038.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "codex");
  assert.equal(entry.implementation?.reviewer, "claude");
});
