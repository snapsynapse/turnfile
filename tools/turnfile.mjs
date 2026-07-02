#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const CLI_VERSION = "0.1.0";
const PROTOCOL_VERSION = "1.0.0";
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const EXIT = {
  usage: 1,
  refused: 2,
  validator: 3,
  fs: 4,
};

function usage() {
  return [
    "Usage: node tools/turnfile.mjs <command> [options]",
    "",
    "Commands:",
    "  init       Scaffold working-session/ from templates/v1-minimal/",
    "  open       Open a session through handshake-sign direct flag mode",
    "  status     Inspect coordination and mailbox state through session-orient",
    "  heartbeat  Write or stop the read-only heartbeat sentinel",
    "  close      Run closeout validators and optionally write close state",
    "",
    "Examples:",
    "  node tools/turnfile.mjs init --project demo --maintainer snap --agent claude --root /tmp/demo",
    "  node tools/turnfile.mjs open --agent claude --instance fable-5 --session 48 --model 'Fable 5' --surface 'Claude Code' --scope v1",
    "  node tools/turnfile.mjs status --agent claude --emit json",
    "  node tools/turnfile.mjs heartbeat write --agent claude --session 48",
    "  node tools/turnfile.mjs close --agent claude --dry-run",
  ].join("\n");
}

function parseFlags(argv, { repeatable = new Set() } = {}) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      out._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    const value = !next || next.startsWith("--") ? true : argv[++i];
    if (repeatable.has(key)) {
      if (!Array.isArray(out[key])) out[key] = [];
      out[key].push(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function stripFlag(argv, flag) {
  const out = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] !== flag) {
      out.push(argv[i]);
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) i += 1;
  }
  return out;
}

function emitJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function die(code, message) {
  console.error(message);
  process.exit(code);
}

function copyFileWithSubstitutions(src, dest, substitutions) {
  let text = fs.readFileSync(src, "utf8");
  for (const [from, to] of Object.entries(substitutions)) {
    text = text.split(from).join(to);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text, "utf8");
}

function commandInit(argv) {
  const flags = parseFlags(argv, { repeatable: new Set(["agent"]) });
  const root = path.resolve(String(flags.root || "."));
  const project = String(flags.project || flags["project-name"] || "turnfile-project");
  const maintainer = String(flags.maintainer || flags["maintainer-name"] || "maintainer");
  const agents = Array.isArray(flags.agent) ? flags.agent.map(String) : [String(flags.agent || "agent-a")];
  const dryRun = flags["dry-run"] === true;
  const force = flags.force === true;
  const existing = path.join(root, "working-session/TURNFILE.yaml");
  if (fs.existsSync(existing) && !force) {
    die(EXIT.refused, "working-session/ already initialized — refusing to overwrite working-session/TURNFILE.yaml");
  }

  const templateRoot = path.join(repoRoot, "templates/v1-minimal/working-session");
  const files = ["TURNFILE.yaml", "MAILBOX.md", "WORKLOG.md", "NEXT_SESSION_HANDSHAKE.md"];
  const substitutions = {
    "your-project-name": project,
    "your-name": maintainer,
    "agent-a": agents[0],
    "replace-on-first-use": new Date().toISOString().slice(0, 10),
  };
  const planned = files.map((name) => ({
    from: path.relative(repoRoot, path.join(templateRoot, name)),
    to: path.relative(root, path.join(root, "working-session", name)),
  }));

  if (!dryRun) {
    try {
      for (const file of files) {
        copyFileWithSubstitutions(
          path.join(templateRoot, file),
          path.join(root, "working-session", file),
          substitutions,
        );
      }
    } catch (error) {
      die(EXIT.fs, `init write failed: ${error.message}`);
    }
  }

  emitJson({ ok: true, dry_run: dryRun, root, files: planned, substitutions });
}

function runNode(script, args, options = {}) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  });
}

function mirrorAndExit(result) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

function commandOpen(argv) {
  const flags = parseFlags(argv, { repeatable: new Set(["scope"]) });
  const root = path.resolve(String(flags.root || process.cwd()));
  if (flags["dry-run"] === true) {
    const scopes = Array.isArray(flags.scope) ? flags.scope.map(String) : flags.scope ? [String(flags.scope)] : [];
    emitJson({
      ok: true,
      dry_run: true,
      root,
      agent: String(flags.agent || ""),
      payload: {
        session: Number.parseInt(String(flags.session || "0"), 10) || 0,
        model: String(flags.model || ""),
        surface: String(flags.surface || ""),
        instance: flags.instance ? String(flags.instance) : null,
        scope_ack: scopes,
      },
    });
    return;
  }
  const delegated = stripFlag(argv, "--root");
  const result = runNode(path.join(repoRoot, "tools/handshake-sign.mjs"), delegated, { cwd: root });
  mirrorAndExit(result);
}

function commandStatus(argv) {
  const flags = parseFlags(argv);
  const root = path.resolve(String(flags.root || process.cwd()));
  const targetPrdStatus = path.join(root, "working-session/docs/PRD_STATUS.json");
  const fallbackPrdStatus = path.join(os.tmpdir(), "turnfile-empty-prd-status.json");
  if (!fs.existsSync(targetPrdStatus) && !fs.existsSync(fallbackPrdStatus)) {
    fs.writeFileSync(fallbackPrdStatus, JSON.stringify({ prds: [] }, null, 2), "utf8");
  }
  const args = [];
  args.push("--mailbox", path.join(root, "working-session/MAILBOX.md"));
  args.push("--turnfile", path.join(root, "working-session/TURNFILE.yaml"));
  args.push("--worklog", path.join(root, "working-session/WORKLOG.md"));
  args.push("--prd-status", fs.existsSync(targetPrdStatus) ? targetPrdStatus : fallbackPrdStatus);
  if (flags.agent) args.push("--agent", String(flags.agent));
  args.push("--emit", String(flags.emit || "human"));
  const result = runNode(path.join(repoRoot, "tools/session-orient.mjs"), args);
  if (String(flags.emit || "human") === "json" && result.status === 0) {
    try {
      const parsed = JSON.parse(result.stdout || "{}");
      const enriched = {
        revision: parsed?.freshness?.next_revision ? parsed.freshness.next_revision - 1 : parsed.revision,
        next_message: parsed?.freshness?.next_message_id || parsed.next_message,
        next_signal: parsed?.freshness?.next_signal_id || parsed.next_signal,
        ...parsed,
      };
      process.stdout.write(`${JSON.stringify(enriched, null, 2)}\n`);
      process.exit(0);
    } catch {
      // Fall through to raw mirroring if session-orient changes format.
    }
  }
  mirrorAndExit(result);
}

function heartbeatPath(root = process.cwd(), agent = "", instance = "") {
  if (agent && instance) {
    return path.join(root, `working-session/HEARTBEAT-${agent}.${instance}.md`);
  }
  return path.join(root, "working-session/HEARTBEAT.md");
}

function commandHeartbeat(argv) {
  const action = argv[0];
  const flags = parseFlags(argv.slice(1));
  const root = path.resolve(String(flags.root || "."));
  const agent = String(flags.agent || "");
  const instance = flags.instance ? String(flags.instance) : "";
  const file = heartbeatPath(root, agent, instance);
  if (action === "write") {
    const session = String(flags.session || "");
    if (!agent || !session) die(EXIT.usage, "heartbeat write requires --agent and --session");
    const cadence = String(flags.cadence || "5m");
    const policy = String(flags.policy || "notify-material");
    const stop = String(flags.stop || "close");
    const body = [
      "# Turnfile Heartbeat",
      "",
      `agent: ${agent}`,
      instance ? `instance: ${instance}` : null,
      `session: ${session}`,
      `cadence: ${cadence}`,
      `policy: ${policy}`,
      `stop: ${stop}`,
      "",
      "Contract: read-only steward. Notify on material changes only.",
      "Deny-list: no file edits, no MAILBOX.json regen, no status changes, no signal creation, no revision bumps from the heartbeat itself.",
      "Self-drive rule: the runtime owns the actual loop and reads this sentinel on each tick; absence of this file stops the heartbeat.",
      "",
    ].filter(Boolean).join("\n");
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, body, "utf8");
    } catch (error) {
      die(EXIT.fs, `heartbeat write failed: ${error.message}`);
    }
    emitJson({ ok: true, action: "write", path: path.relative(root, file), agent, instance: instance || null, session });
    return;
  }
  if (action === "stop") {
    let removed = false;
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        removed = true;
      }
    } catch (error) {
      die(EXIT.fs, `heartbeat stop failed: ${error.message}`);
    }
    emitJson({ ok: true, action: "stop", removed });
    return;
  }
  die(EXIT.usage, `unknown heartbeat action: ${action || ""}\n${usage()}`);
}

function commandClose(argv) {
  const flags = parseFlags(argv);
  const agent = String(flags.agent || "");
  if (!agent) die(EXIT.usage, "close requires --agent");
  const dryRun = flags["dry-run"] === true;
  const root = path.resolve(String(flags.root || process.cwd()));
  const validators = [];

  function runStep(id, script, args) {
    const result = runNode(path.join(repoRoot, script), args, { cwd: root });
    validators.push({ id, status: result.status, ok: result.status === 0 });
    if (result.status !== 0) {
      return { ok: false, result };
    }
    return { ok: true, result };
  }

  const targetPrdStatus = path.join(root, "working-session/docs/PRD_STATUS.json");
  const fallbackPrdStatus = path.join(os.tmpdir(), "turnfile-empty-close-prd-status.json");
  if (!fs.existsSync(targetPrdStatus)) {
    fs.writeFileSync(
      fallbackPrdStatus,
      JSON.stringify({ policy: { required_reviewers: ["claude", "codex"] }, prds: [] }, null, 2),
      "utf8",
    );
  }

  const steps = [
    ["mailbox-invariants", "tools/validate-mailbox-invariants.mjs", ["--mailbox", "working-session/MAILBOX.md"]],
    ["closeout", "tools/validate-closeout.mjs", ["--turnfile", "working-session/TURNFILE.yaml", "--mailbox", "working-session/MAILBOX.md", "--agent", agent]],
    ["turnfile-lint", "tools/turnfile-lint.mjs", [
      "--turnfile", "working-session/TURNFILE.yaml",
      "--schema", path.join(repoRoot, "schemas/turnfile/turnfile-v0.schema.json"),
    ]],
    ["prd-promotion", "tools/validate-prd-promotion.mjs", [
      "--registry", fs.existsSync(targetPrdStatus)
        ? "working-session/docs/PRD_STATUS.json"
        : fallbackPrdStatus,
    ]],
  ];
  for (const [id, script, args] of steps) {
    const step = runStep(id, script, args);
    if (!step.ok) {
      emitJson({ ok: false, dry_run: dryRun, failed: id, validators });
      process.exit(EXIT.validator);
    }
  }

  if (dryRun) {
    emitJson({ ok: true, dry_run: true, agent, validators, would_write: ["TURNFILE.yaml", "WORKLOG.md", "MAILBOX.json"] });
    return;
  }

  const exportBefore = runNode(path.join(repoRoot, "tools/export-mailbox-json.mjs"), [
    "working-session/MAILBOX.md",
    "working-session/MAILBOX.json",
  ], { cwd: root });
  if (exportBefore.status !== 0) die(EXIT.validator, exportBefore.stderr || exportBefore.stdout);
  const heartbeatStop = spawnSync(process.execPath, [path.join(repoRoot, "tools/turnfile.mjs"), "heartbeat", "stop"], {
    cwd: root,
    encoding: "utf8",
  });
  if (heartbeatStop.status !== 0) die(EXIT.fs, heartbeatStop.stderr || heartbeatStop.stdout);

  const turnfilePath = path.join(root, "working-session/TURNFILE.yaml");
  const worklogPath = path.join(root, "working-session/WORKLOG.md");
  let turnfile = fs.readFileSync(turnfilePath, "utf8");
  const revMatch = /^coordination:\s*$[\s\S]*?^  revision:\s*(\d+)\s*$/m.exec(turnfile);
  const prevRev = revMatch ? Number.parseInt(revMatch[1], 10) : 0;
  const nextRev = prevRev + 1;
  turnfile = turnfile.replace(/^# Last modified revision:\s*\d+\s*$/m, `# Last modified revision: ${nextRev}`);
  turnfile = turnfile.replace(/^# Modified by:.*$/m, `# Modified by: ${agent}`);
  turnfile = turnfile.replace(/^  revision:\s*\d+\s*$/m, `  revision: ${nextRev}`);
  const blockRe = new RegExp(`(  ${escapeRegExp(agent)}:\\n(?:    .+\\n)+)`);
  turnfile = turnfile.replace(blockRe, (block) =>
    block
      .replace(/    status: ".+?"/, '    status: "idle"')
      .replace(/    current_task: .+/, "    current_task: null")
      .replace(/    last_seen: ".+?"|    last_seen: null/, `    last_seen: "${agent}-close-rev${nextRev}"`),
  );
  fs.writeFileSync(turnfilePath, turnfile, "utf8");
  fs.appendFileSync(
    worklogPath,
    `\n${agent}: close via tools/turnfile.mjs at rev ${nextRev}. ${String(flags["carry-forward-summary"] || "No carry-forward summary supplied.")}\n`,
    "utf8",
  );
  const exportAfter = runNode(path.join(repoRoot, "tools/export-mailbox-json.mjs"), [
    "working-session/MAILBOX.md",
    "working-session/MAILBOX.json",
  ], { cwd: root });
  if (exportAfter.status !== 0) die(EXIT.validator, exportAfter.stderr || exportAfter.stdout);
  emitJson({ ok: true, agent, prev_rev: prevRev, next_rev: nextRev, validators });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const command = process.argv[2];
if (!command || command === "--help" || command === "-h") {
  console.log(usage());
  process.exit(0);
}
if (command === "--version") {
  emitJson({ cli: CLI_VERSION, protocol: PROTOCOL_VERSION });
  process.exit(0);
}

const argv = process.argv.slice(3);
if (command === "init") commandInit(argv);
else if (command === "open") commandOpen(argv);
else if (command === "status") commandStatus(argv);
else if (command === "heartbeat") commandHeartbeat(argv);
else if (command === "close") commandClose(argv);
else die(EXIT.usage, `unknown command: ${command}\n${usage()}`);
