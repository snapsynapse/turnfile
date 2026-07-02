// PRD-048 RED evals — portable Turnfile CLI (tools/turnfile.mjs).
// Eval author: Claude. Expected implementer: Codex. Reviewer: Claude.
// EXPECTED TO FAIL until tools/turnfile.mjs and its subcommands land.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cli = path.join(root, "tools/turnfile.mjs");
const node = process.execPath;

const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => fs.existsSync(p);

function run(args, cwd = root, input = undefined) {
  return spawnSync(node, [cli, ...args], { cwd, encoding: "utf8", input });
}

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "prd048-"));
}

function copyMinimalRepoStub(dir) {
  // Copy enough of the live repo for `open`, `status`, `close` subcommand wrappers to work.
  fs.mkdirSync(path.join(dir, "tools"), { recursive: true });
  fs.mkdirSync(path.join(dir, "schemas/turnfile"), { recursive: true });
  fs.mkdirSync(path.join(dir, "schemas/v1"), { recursive: true });
  fs.mkdirSync(path.join(dir, "templates/v1-minimal/working-session"), { recursive: true });
  fs.mkdirSync(path.join(dir, "working-session/docs"), { recursive: true });
  fs.mkdirSync(path.join(dir, "docs/prds"), { recursive: true });
  fs.mkdirSync(path.join(dir, "evals"), { recursive: true });
  for (const f of [
    "tools/turnfile.mjs",
    "tools/handshake-sign.mjs",
    "tools/session-orient.mjs",
    "tools/export-mailbox-json.mjs",
    "tools/validate-mailbox-invariants.mjs",
    "tools/validate-closeout.mjs",
    "tools/turnfile-lint.mjs",
    "tools/validate-prd-promotion.mjs",
    "tools/next-state.mjs",
  ]) {
    const src = path.join(root, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, f));
  }
  for (const f of [
    "schemas/turnfile/turnfile-v0.schema.json",
    "schemas/v1/turnfile-v1.schema.json",
    "templates/v1-minimal/README.md",
    "templates/v1-minimal/working-session/TURNFILE.yaml",
    "templates/v1-minimal/working-session/MAILBOX.md",
    "templates/v1-minimal/working-session/WORKLOG.md",
  ]) {
    const src = path.join(root, f);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dir, f));
  }
  try {
    fs.symlinkSync(path.join(root, "node_modules"), path.join(dir, "node_modules"), "dir");
  } catch {
    // tolerated when deps resolve from parent
  }
  return dir;
}

function assertNoTargetTools(dir) {
  assert.equal(
    exists(path.join(dir, "tools")),
    false,
    "true cold-start target must not contain a copied tools/ directory",
  );
}

test("R1: dispatcher exists and lists all five subcommands in --help", () => {
  assert.equal(exists(cli), true, `${cli} must exist`);
  const result = run(["--help"]);
  assert.equal(result.status, 0, result.stderr);
  const help = `${result.stdout}${result.stderr}`;
  for (const verb of ["init", "open", "status", "heartbeat", "close"]) {
    assert.match(help, new RegExp(`\\b${verb}\\b`), `help missing ${verb}`);
  }
  assert.match(help, /example/i);
});

test("R1: unknown subcommand exits non-zero with usage hint", () => {
  const result = run(["frobnicate"]);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /usage|unknown|--help/i);
});

test("R7: --version emits cli + protocol JSON", () => {
  const result = run(["--version"]);
  assert.equal(result.status, 0, result.stderr);
  const out = JSON.parse(result.stdout);
  assert.ok(typeof out.cli === "string" && /^[0-9]/.test(out.cli), "cli version must be a semver-ish string");
  assert.ok(typeof out.protocol === "string" && /^[01]\./.test(out.protocol), "protocol version must start with 0. or 1.");
});

test("R2/AC3: init scaffolds three working-session files with substitutions", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  const result = run([
    "init",
    "--project", "demo-project",
    "--maintainer", "snap",
    "--agent", "claude",
    "--root", dir,
  ], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  for (const f of [
    "working-session/TURNFILE.yaml",
    "working-session/MAILBOX.md",
    "working-session/WORKLOG.md",
    "working-session/NEXT_SESSION_HANDSHAKE.md",
  ]) {
    assert.equal(exists(path.join(dir, f)), true, `init must create ${f}`);
  }
  const tf = read(path.join(dir, "working-session/TURNFILE.yaml"));
  assert.match(tf, /demo-project/, "init must substitute --project");
  assert.match(tf, /snap/, "init must substitute --maintainer");
  assert.match(tf, /claude/, "init must substitute --agent");
});

test("R2/AC4: init refuses to overwrite existing working-session/", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  fs.copyFileSync(
    path.join(root, "templates/v1-minimal/working-session/TURNFILE.yaml"),
    path.join(dir, "working-session/TURNFILE.yaml"),
  );
  const result = run([
    "init",
    "--project", "demo",
    "--maintainer", "test",
    "--agent", "claude",
    "--root", dir,
  ], dir);
  assert.equal(result.status, 2, "init must exit 2 (refused) when working-session/TURNFILE.yaml already exists");
  assert.match(`${result.stdout}${result.stderr}`, /already initialized|refusing|exists/i);
});

test("R2: init --dry-run does not write", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  const result = run([
    "init",
    "--project", "demo",
    "--maintainer", "test",
    "--agent", "claude",
    "--root", dir,
    "--dry-run",
  ], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.equal(
    exists(path.join(dir, "working-session/TURNFILE.yaml")),
    false,
    "init --dry-run must not write files",
  );
  const out = JSON.parse(result.stdout);
  assert.ok(Array.isArray(out.files) && out.files.length >= 3, "dry-run output must list planned files");
});

test("R3/AC5: open --dry-run produces same payload shape as handshake-sign direct flag mode", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  fs.copyFileSync(
    path.join(root, "templates/v1-minimal/working-session/TURNFILE.yaml"),
    path.join(dir, "working-session/TURNFILE.yaml"),
  );
  // session-orient writes need NEXT_SESSION_HANDSHAKE.md to exist; provide a stub.
  fs.writeFileSync(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"), "# Next Session Handshake\n");
  const result = run([
    "open",
    "--agent", "claude",
    "--session", "48",
    "--model", "Opus 4.7",
    "--surface", "Claude Code",
    "--scope", "v1-portable-cli",
    "--dry-run",
  ], dir);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const out = JSON.parse(result.stdout);
  assert.equal(out.dry_run, true);
  assert.equal(out.agent, "claude");
  assert.equal(out.payload.session, 48);
  assert.deepEqual(out.payload.scope_ack, ["v1-portable-cli"]);
});

test("R3/AC5: open --root delegates real execution inside the target repo", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  for (const f of [
    "working-session/TURNFILE.yaml",
    "working-session/MAILBOX.md",
    "working-session/WORKLOG.md",
  ]) {
    fs.copyFileSync(path.join(root, "templates/v1-minimal", f), path.join(dir, f));
  }
  const turnfilePath = path.join(dir, "working-session/TURNFILE.yaml");
  fs.writeFileSync(turnfilePath, read(turnfilePath).split("agent-a").join("claude"), "utf8");
  fs.writeFileSync(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md"), "# Next Session Handshake\n");

  const result = run([
    "open",
    "--root", dir,
    "--agent", "claude",
    "--session", "48",
    "--model", "Opus 4.8",
    "--surface", "Claude Code",
    "--scope", "v1-portable-cli",
    "--no-tokenese-lead",
  ], root);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.doesNotMatch(`${result.stdout}${result.stderr}`, /unknown arg: --root/);
  const tf = read(path.join(dir, "working-session/TURNFILE.yaml"));
  assert.match(tf, /claude-session-48/, "open --root must write session state in the target repo");
});

test("R3/R4/R6: fresh init -> open --root -> status -> close dry-run uses target repo", () => {
  const dir = tmpRoot();
  assertNoTargetTools(dir);
  const init = run([
    "init",
    "--project", "cold-start-project",
    "--maintainer", "snap",
    "--agent", "claude",
    "--root", dir,
  ], root);
  assert.equal(init.status, 0, `${init.stdout}${init.stderr}`);
  assert.equal(exists(path.join(dir, "working-session/NEXT_SESSION_HANDSHAKE.md")), true);
  assertNoTargetTools(dir);

  const open = run([
    "open",
    "--root", dir,
    "--agent", "claude",
    "--session", "48",
    "--model", "Opus 4.8",
    "--surface", "Claude Code",
    "--scope", "v1-portable-cli",
    "--no-tokenese-lead",
  ], root);
  assert.equal(open.status, 0, `${open.stdout}${open.stderr}`);
  assert.doesNotMatch(`${open.stdout}${open.stderr}`, /ENOENT|NEXT_SESSION_HANDSHAKE\.md|unknown arg: --root|Cannot find module/);

  const status = run(["status", "--root", dir, "--agent", "claude", "--emit", "json"], root);
  assert.equal(status.status, 0, `${status.stdout}${status.stderr}`);
  const out = JSON.parse(status.stdout);
  assert.equal(out.revision, 2, "status --root must read the opened target repo revision");
  assert.equal(out.inbox?.selected_agent?.unread, 0, "fresh opened target should not create unread mail");

  const close = run(["close", "--root", dir, "--agent", "claude", "--dry-run"], root);
  assert.equal(close.status, 0, `${close.stdout}${close.stderr}`);
  assert.doesNotMatch(`${close.stdout}${close.stderr}`, /ENOENT|NEXT_SESSION_HANDSHAKE\.md|unknown arg|Cannot find module/i);
  assert.match(`${close.stdout}${close.stderr}`, /validators|MAILBOX SESSION|LINT|ok/i);
});

test("R4/AC6: status JSON matches session-orient JSON shape", () => {
  const result = run(["status", "--emit", "json"]);
  assert.equal(result.status, 0, result.stderr);
  const out = JSON.parse(result.stdout);
  for (const k of ["revision", "next_message", "next_signal", "inbox", "projection"]) {
    assert.ok(k in out, `status JSON must include ${k}`);
  }
});

test("R4/AC6: status --root reads the target repo working-session", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  for (const f of [
    "working-session/TURNFILE.yaml",
    "working-session/MAILBOX.md",
    "working-session/WORKLOG.md",
  ]) {
    fs.copyFileSync(path.join(root, "templates/v1-minimal", f), path.join(dir, f));
  }
  const turnfilePath = path.join(dir, "working-session/TURNFILE.yaml");
  const turnfile = read(turnfilePath)
    .replace(/^# Last modified revision:\s*\d+\s*$/m, "# Last modified revision: 17")
    .replace(/^  revision:\s*\d+\s*$/m, "  revision: 17");
  fs.writeFileSync(turnfilePath, turnfile, "utf8");

  const result = run(["status", "--root", dir, "--emit", "json"], root);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  const out = JSON.parse(result.stdout);
  assert.equal(out.revision, 17, "status --root must report the target repo revision");
});

test("R5/AC7: heartbeat write creates HEARTBEAT.md with PRD-038 contract; stop removes it", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  const writeResult = run([
    "heartbeat", "write",
    "--agent", "claude",
    "--session", "48",
  ], dir);
  assert.equal(writeResult.status, 0, `${writeResult.stdout}${writeResult.stderr}`);
  const sentinel = path.join(dir, "working-session/HEARTBEAT.md");
  assert.equal(exists(sentinel), true, "heartbeat write must create working-session/HEARTBEAT.md");
  const body = read(sentinel);
  for (const needle of [
    /read-only/i,
    /notify-material/i,
    /stop[:\s]+close/i,
    /self-drive|self drive|main loop/i,
    /agent[:\s]+claude/i,
    /session[:\s]+48/i,
  ]) {
    assert.match(body, needle, `HEARTBEAT.md missing required contract clause matching ${needle}`);
  }
  const stopResult = run(["heartbeat", "stop"], dir);
  assert.equal(stopResult.status, 0, `${stopResult.stdout}${stopResult.stderr}`);
  assert.equal(exists(sentinel), false, "heartbeat stop must remove HEARTBEAT.md");
  const stopOut = JSON.parse(stopResult.stdout);
  assert.equal(stopOut.action, "stop");
  assert.equal(stopOut.removed, true);
});

test("R5: heartbeat write is idempotent (re-run updates in place)", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  const first = run(["heartbeat", "write", "--agent", "claude", "--session", "48"], dir);
  assert.equal(first.status, 0);
  const second = run(["heartbeat", "write", "--agent", "claude", "--session", "49"], dir);
  assert.equal(second.status, 0, `${second.stdout}${second.stderr}`);
  const body = read(path.join(dir, "working-session/HEARTBEAT.md"));
  assert.match(body, /session[:\s]+49/i, "re-run must update session field");
});

test("R6/AC8: close runs validators and aborts non-zero on a clearly broken state", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  // Provide MAILBOX.md without TURNFILE.yaml — closeout will fail.
  fs.writeFileSync(path.join(dir, "working-session/MAILBOX.md"), "# Mailbox\n");
  const result = run(["close", "--agent", "claude"], dir);
  assert.notEqual(result.status, 0, "close must exit non-zero when validators fail");
});

test("R6: close --dry-run does not mutate TURNFILE/WORKLOG", () => {
  const dir = tmpRoot();
  copyMinimalRepoStub(dir);
  fs.copyFileSync(
    path.join(root, "templates/v1-minimal/working-session/TURNFILE.yaml"),
    path.join(dir, "working-session/TURNFILE.yaml"),
  );
  fs.copyFileSync(
    path.join(root, "templates/v1-minimal/working-session/MAILBOX.md"),
    path.join(dir, "working-session/MAILBOX.md"),
  );
  fs.copyFileSync(
    path.join(root, "templates/v1-minimal/working-session/WORKLOG.md"),
    path.join(dir, "working-session/WORKLOG.md"),
  );
  const tfBefore = read(path.join(dir, "working-session/TURNFILE.yaml"));
  const wlBefore = read(path.join(dir, "working-session/WORKLOG.md"));
  const result = run(["close", "--agent", "agent-a", "--dry-run"], dir);
  // dry-run reports validator state regardless of exit code, but must not mutate.
  assert.equal(read(path.join(dir, "working-session/TURNFILE.yaml")), tfBefore, "close --dry-run must not mutate TURNFILE");
  assert.equal(read(path.join(dir, "working-session/WORKLOG.md")), wlBefore, "close --dry-run must not mutate WORKLOG");
  // Output should at least be parseable JSON.
  if (result.stdout.trim().startsWith("{")) {
    const out = JSON.parse(result.stdout);
    assert.equal(out.dry_run, true);
  }
});

test("Registry: PRD_STATUS records PRD-048 ownership", () => {
  const registry = JSON.parse(read(path.join(root, "working-session/docs/PRD_STATUS.json")));
  const entry = registry.prds.find((p) => p.id === "PRD-048");
  assert.ok(entry, "PRD-048 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-048-portable-turnfile-cli.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.evals, "evals/prd-048.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "claude");
  assert.equal(entry.implementation?.implementer, "codex");
  assert.equal(entry.implementation?.reviewer, "claude");
});
