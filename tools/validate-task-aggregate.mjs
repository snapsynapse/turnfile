#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function usage() {
  return "usage: node tools/validate-task-aggregate.mjs --input <dir> [--format json]";
}

function parseArgs(argv) {
  const args = { input: null, format: "json" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input" || arg === "--shards") args.input = argv[++i] || null;
    else if (arg === "--format") args.format = argv[++i] || "";
    else if (arg === "-h" || arg === "--help") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!args.input) throw new Error("--input is required");
  if (args.format !== "json") throw new Error("--format must be json when provided");
  return args;
}

function agentRoot(input) {
  const nested = path.join(input, "agents");
  return fs.existsSync(nested) && fs.statSync(nested).isDirectory() ? nested : input;
}

function validateJsonlEvents(input) {
  const errors = [];
  const root = agentRoot(input);
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).filter((item) => item.isDirectory())) {
    const file = path.join(root, entry.name, "task-events.jsonl");
    if (!fs.existsSync(file)) continue;
    const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
    for (const [index, line] of lines.entries()) {
      if (!line.trim()) continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch (error) {
        errors.push({ file, line: index + 1, reason: error.message });
        continue;
      }
      const kind = event.event || event.kind || event.type;
      if (!event.id) errors.push({ file, line: index + 1, reason: "missing id" });
      if (!kind) errors.push({ file, line: index + 1, reason: "missing event" });
      if (!event.task_id && !event.payload?.task_id) errors.push({ file, line: index + 1, reason: "missing task_id" });
      if (!event.ts) errors.push({ file, line: index + 1, reason: "missing ts" });
    }
  }
  return errors;
}

function aggregate(input) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const tool = path.join(root, "tools/aggregate-coordination.mjs");
  return JSON.parse(execFileSync("node", [tool, "--input", input, "--emit", "task-json"], { encoding: "utf8" }));
}

try {
  const args = parseArgs(process.argv.slice(2));
  const errors = validateJsonlEvents(args.input);
  const result = errors.length ? null : aggregate(args.input);
  if (result) {
    for (const field of ["tasks", "agents", "conflicts", "unknown_agents", "source_events"]) {
      if (!Array.isArray(result[field])) errors.push({ file: "aggregate", reason: `${field} must be an array` });
    }
  }
  const report = { ok: errors.length === 0, errors };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(2);
}
