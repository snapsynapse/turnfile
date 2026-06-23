#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function usage() {
  return "usage: node tools/compare-turnfile-tasks.mjs --shards <dir> --turnfile <file> [--format json]";
}

function parseArgs(argv) {
  const args = { shards: null, turnfile: null, format: "json" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--shards" || arg === "--input") args.shards = argv[++i] || null;
    else if (arg === "--turnfile") args.turnfile = argv[++i] || null;
    else if (arg === "--format") args.format = argv[++i] || "";
    else if (arg === "-h" || arg === "--help") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!args.shards || !args.turnfile) throw new Error("--shards and --turnfile are required");
  if (args.format !== "json") throw new Error("--format must be json when provided");
  return args;
}

function parseScalar(raw) {
  const value = String(raw || "").trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function parseTurnfileTasks(file) {
  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
  const tasks = new Map();
  const start = lines.findIndex((line) => line.trim() === "tasks:");
  if (start < 0) return tasks;

  let current = null;
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^[A-Za-z0-9_-]+:\s*$/.test(line)) break;
    const idMatch = /^    ([A-Za-z0-9_.-]+):\s*$/.exec(line);
    if (idMatch) {
      current = { id: idMatch[1] };
      tasks.set(current.id, current);
      continue;
    }
    const fieldMatch = /^      ([A-Za-z0-9_-]+):\s*(.*?)\s*$/.exec(line);
    if (current && fieldMatch) current[fieldMatch[1]] = parseScalar(fieldMatch[2]);
  }
  return tasks;
}

function aggregateTasks(shards) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  const tool = path.join(root, "tools/aggregate-coordination.mjs");
  return JSON.parse(execFileSync("node", [tool, "--input", shards, "--emit", "task-json"], { encoding: "utf8" }));
}

try {
  const args = parseArgs(process.argv.slice(2));
  const expected = parseTurnfileTasks(args.turnfile);
  const aggregate = aggregateTasks(args.shards);
  const actual = new Map((aggregate.tasks || []).map((task) => [task.id || task.task_id, task]));
  const drift = [];

  for (const [id, turnfileTask] of expected) {
    const derived = actual.get(id);
    if (!derived) {
      drift.push({ task_id: id, field: "task", expected: "present", actual: "missing" });
      continue;
    }
    for (const field of ["owner", "status", "created_by"]) {
      if (turnfileTask[field] !== undefined && String(derived[field] ?? "") !== String(turnfileTask[field])) {
        drift.push({ task_id: id, field, expected: turnfileTask[field], actual: derived[field] ?? null });
      }
    }
  }

  const report = { ok: drift.length === 0, drift };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(2);
}
