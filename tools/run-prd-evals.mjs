#!/usr/bin/env node

// PRD-036: Portable aggregate PRD eval runner.
//
// Canonical runner for `npm run evals:prd`. Reads the evals/ directory
// directly, filters files matching `*.evals.mjs`, and spawns
// `node --test <files>` with the resolved file list. It does NOT depend on
// shell glob expansion or `node --test <dir>` directory discovery, so it
// behaves identically across shells and Node versions (the bare-directory
// target broke under Node v26).
//
// Flags:
//   --root <dir>        Repo root to scan (default: this script's parent).
//   --dry-run, --list   Resolve and report files without running them.
//   --format <fmt>      Output format for dry-run: "json" or "text" (default text).
//
// Exit codes:
//   0  success (files ran green, or dry-run resolved at least one file)
//   1  no PRD eval files found (fail-on-empty), or the gated test run failed.
//
// PRD evals whose registry implementation.state is not done/eval-verified/
// grandfathered are still run and logged as expected-pending, but their result
// is excluded from the gate exit code. This keeps the release gate green for
// completed lanes without hiding unimplemented RED contract suites.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function parseArgs(argv) {
  const opts = { dryRun: false, format: "text", root: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run" || arg === "--list") {
      opts.dryRun = true;
    } else if (arg === "--format") {
      opts.format = argv[i + 1] || "text";
      i += 1;
    } else if (arg.startsWith("--format=")) {
      opts.format = arg.slice("--format=".length);
    } else if (arg === "--root") {
      opts.root = argv[i + 1] || null;
      i += 1;
    } else if (arg.startsWith("--root=")) {
      opts.root = arg.slice("--root=".length);
    }
    // Unknown flags are ignored so `npm run -s evals:prd -- ...` stays forgiving.
  }
  return opts;
}

function resolveRoot(optRoot) {
  if (optRoot) {
    return path.resolve(optRoot);
  }
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
}

function discoverEvalFiles(root) {
  const evalsDir = path.join(root, "evals");
  let entries = [];
  try {
    entries = fs.readdirSync(evalsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".evals.mjs"))
    .map((entry) => entry.name)
    .sort()
    .map((name) => path.posix.join("evals", name));
}

function loadRegistryByEval(root) {
  const registryPath = path.join(root, "working-session/docs/PRD_STATUS.json");
  try {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    const byEval = new Map();
    for (const prd of registry.prds || []) {
      const evalPath = prd.implementation?.evals;
      if (!evalPath) continue;
      byEval.set(evalPath, {
        id: prd.id,
        state: prd.implementation?.state || "unknown",
      });
    }
    return byEval;
  } catch {
    return new Map();
  }
}

function classifyEvalFiles(root, files) {
  const gatedStates = new Set(["done", "eval-verified", "grandfathered"]);
  const registryByEval = loadRegistryByEval(root);
  const gated = [];
  const expectedPending = [];

  for (const file of files) {
    const registered = registryByEval.get(file);
    if (registered && !gatedStates.has(registered.state)) {
      expectedPending.push({ file, id: registered.id, state: registered.state });
    } else {
      gated.push(file);
    }
  }

  return { gated, expectedPending };
}

function runNodeTest(root, files) {
  if (files.length === 0) return { status: 0 };
  return spawnSync(process.execPath, ["--test", ...files], {
    cwd: root,
    stdio: "inherit",
  });
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const root = resolveRoot(opts.root);
  const files = discoverEvalFiles(root);
  const { gated, expectedPending } = classifyEvalFiles(root, files);

  if (files.length === 0) {
    const message = `run-prd-evals: no PRD eval files found in ${path.join(root, "evals")} (expected evals/*.evals.mjs)`;
    if (opts.dryRun && opts.format === "json") {
      process.stderr.write(`${JSON.stringify({ ok: false, files: [], reason: message })}\n`);
    } else {
      process.stderr.write(`${message}\n`);
    }
    process.exit(1);
  }

  if (opts.dryRun) {
    if (opts.format === "json") {
      process.stdout.write(
        `${JSON.stringify({
          ok: true,
          root,
          count: files.length,
          files,
          gated_files: gated,
          expected_pending: expectedPending,
        })}\n`,
      );
    } else {
      process.stdout.write(`run-prd-evals: ${files.length} PRD eval file(s):\n`);
      for (const file of files) {
        process.stdout.write(`  ${file}\n`);
      }
      if (expectedPending.length > 0) {
        process.stdout.write("run-prd-evals: expected-pending suites excluded from the gate exit code:\n");
        for (const pending of expectedPending) {
          process.stdout.write(`  ${pending.file} (${pending.id} implementation.state=${pending.state})\n`);
        }
      }
    }
    process.exit(0);
  }

  if (expectedPending.length > 0) {
    process.stderr.write("run-prd-evals: expected-pending suites will run but will not fail the gate:\n");
    for (const pending of expectedPending) {
      process.stderr.write(`  - ${pending.file} (${pending.id} implementation.state=${pending.state})\n`);
    }
    const pendingResult = runNodeTest(root, expectedPending.map((pending) => pending.file));
    if (pendingResult.error) {
      process.stderr.write(`run-prd-evals: failed to spawn expected-pending node --test: ${pendingResult.error.message}\n`);
      process.exit(1);
    }
    if (pendingResult.status !== 0) {
      process.stderr.write("run-prd-evals: expected-pending suite failures recorded; gated suites still determine exit status.\n");
    }
  }

  const result = runNodeTest(root, gated);
  if (result.error) {
    process.stderr.write(`run-prd-evals: failed to spawn node --test: ${result.error.message}\n`);
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
}

main();
