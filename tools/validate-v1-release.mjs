#!/usr/bin/env node
// Aggregated v1 release gate. This is intentionally stricter than the profile
// validator: it checks the live repo control plane and final release evidence.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULTS = {
  root: ".",
  agent: "codex",
  format: "human",
};

function usage() {
  console.error([
    "Usage: node tools/validate-v1-release.mjs [--root .] [--agent codex] [--format human|json]",
    "",
    "Runs mailbox gates, Turnfile lint, PRD promotion validation, v1 profile validation,",
    "public-surface validation, and PRD-043 R10 fresh-context evidence checks.",
  ].join("\n"));
}

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--root") args.root = argv[++i];
    else if (token === "--agent") args.agent = argv[++i];
    else if (token === "--format") args.format = argv[++i];
    else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${token}`);
      usage();
      process.exit(2);
    }
  }
  if (!["human", "json"].includes(args.format)) {
    console.error("--format must be human|json");
    process.exit(2);
  }
  args.root = path.resolve(args.root);
  return args;
}

function rel(root, subpath) {
  return path.join(root, subpath);
}

function runNode(root, script, scriptArgs) {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {
    cwd: root,
    encoding: "utf8",
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
  };
}

function checkCommand(id, label, root, script, args) {
  const result = runNode(root, script, args);
  return {
    id,
    label,
    ok: result.ok,
    detail: result.ok ? "PASS" : oneLine(result.output),
    status: result.status,
  };
}

function checkR10Evidence(root) {
  const dir = rel(root, "working-session/docs");
  let files = [];
  if (fs.existsSync(dir)) {
    files = fs
      .readdirSync(dir)
      .filter((name) => /^v1-fresh-context-probe-\d{4}-\d{2}-\d{2}-.+\.md$/.test(name))
      .sort();
  }
  return {
    id: "prd-043-r10-fresh-context-evidence",
    label: "PRD-043 R10 fresh-context probe evidence exists",
    ok: files.length > 0,
    detail: files.length > 0
      ? `found ${files.join(", ")}`
      : "missing working-session/docs/v1-fresh-context-probe-<date>-<agent>.md",
    files,
  };
}

function runGate(args) {
  const root = args.root;
  const checks = [
    checkCommand("mailbox-session-start", "mailbox session start gate", root, "tools/validate-mailbox-session-gate.mjs", [
      "--phase", "start",
      "--agent", args.agent,
    ]),
    checkCommand("mailbox-session-end", "mailbox session end gate", root, "tools/validate-mailbox-session-gate.mjs", [
      "--phase", "end",
      "--agent", args.agent,
    ]),
    checkCommand("turnfile-lint", "Turnfile lint", root, "tools/turnfile-lint.mjs", [
      "--turnfile", "working-session/TURNFILE.yaml",
      "--schema", "schemas/turnfile/turnfile-v0.schema.json",
    ]),
    checkCommand("prd-promotion", "PRD promotion registry", root, "tools/validate-prd-promotion.mjs", []),
    checkCommand("v1-profile", "v1 minimal profile", root, "tools/validate-v1-profile.mjs", [
      "--root", "templates/v1-minimal",
      "--format", "json",
    ]),
    checkCommand("public-surface", "public surface snapshot", root, "tools/validate-public-surface-snapshot.mjs", [
      "--format", "json",
    ]),
    checkR10Evidence(root),
  ];
  const failures = checks.filter((check) => !check.ok);
  return {
    ok: failures.length === 0,
    root,
    agent: args.agent,
    checks,
    failures,
  };
}

function printHuman(report) {
  console.log("Turnfile v1 release gate");
  console.log(`Root: ${report.root}`);
  console.log(`Agent: ${report.agent}`);
  console.log("");
  for (const check of report.checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} ${check.id}: ${check.detail}`);
  }
  console.log("");
  console.log(report.ok ? "V1 RELEASE GATE: PASS" : "V1 RELEASE GATE: FAIL");
}

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const args = parseArgs(process.argv);
const report = runGate(args);
if (args.format === "json") console.log(JSON.stringify(report, null, 2));
else printHuman(report);
process.exit(report.ok ? 0 : 1);
