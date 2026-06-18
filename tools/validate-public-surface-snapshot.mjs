#!/usr/bin/env node
// validate-public-surface-snapshot.mjs - PRD-034 public and agent-facing surface
// snapshot reconciliation contract.
//
// Detection-only validator. It derives the promoted-PRD count from the registry
// (working-session/docs/PRD_STATUS.json, the single source of truth) and checks
// the current public/agent-facing surfaces for stale promoted-count claims and
// machine-readable freshness markers. Historical surfaces under docs/archive/**
// are excluded: only current public-surface drift fails the gate.
import fs from "node:fs";
import path from "node:path";

const SURFACES = [
  "README.md",
  "docs/index.html",
  "docs/llms.txt",
  "assistant-guide.txt",
];

const ARCHIVE_PREFIX = path.join("docs", "archive") + path.sep;

function usage(exitCode = 0) {
  const out = exitCode === 0 ? console.log : console.error;
  out("Usage: node tools/validate-public-surface-snapshot.mjs [--root <dir>] [--format json]");
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { root: process.cwd(), format: "text" };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage(0);
    } else if (arg === "--root") {
      args.root = argv[i + 1];
      i += 1;
    } else if (arg === "--format") {
      args.format = argv[i + 1];
      i += 1;
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage(1);
    }
  }
  if (!args.root) usage(1);
  if (args.format !== "text" && args.format !== "json") {
    console.error("--format must be text or json");
    process.exit(1);
  }
  return args;
}

function promotedCount(root) {
  const registryPath = path.join(root, "working-session/docs/PRD_STATUS.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  return registry.prds.filter((p) => p.shelf === "docs/prds").length;
}

// A surface path that lives under docs/archive/** is historical and excluded.
function isArchive(relPath) {
  const normalized = relPath.split(path.posix.sep).join(path.sep);
  return normalized.startsWith(ARCHIVE_PREFIX);
}

function checkSurface(root, relPath, expected) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return [];
  if (isArchive(relPath)) return [];
  const text = fs.readFileSync(abs, "utf8");
  const findings = [];

  // Machine-readable freshness marker: turnfile:prd-promoted=<N>.
  for (const m of text.matchAll(/turnfile:prd-promoted=(\d+)/g)) {
    const found = Number(m[1]);
    if (found !== expected) {
      findings.push(
        `${relPath}: stale promoted-count marker turnfile:prd-promoted=${found} (registry promoted count is ${expected})`,
      );
    }
  }

  // Human-readable claim: "<N> promoted PRDs".
  for (const m of text.matchAll(/\b(\d+)\s+promoted PRDs\b/gi)) {
    const found = Number(m[1]);
    if (found !== expected) {
      findings.push(
        `${relPath}: stale promoted-count claim "${found} promoted PRDs" (registry promoted count is ${expected})`,
      );
    }
  }

  return findings;
}

function main() {
  const args = parseArgs(process.argv);
  const root = path.resolve(args.root);

  let expected;
  try {
    expected = promotedCount(root);
  } catch (err) {
    const message = `Unable to derive promoted count from working-session/docs/PRD_STATUS.json: ${err.message}`;
    if (args.format === "json") {
      console.log(JSON.stringify({ ok: false, error: message }, null, 2));
    } else {
      console.error(message);
    }
    process.exit(2);
  }

  const findings = [];
  for (const relPath of SURFACES) {
    findings.push(...checkSurface(root, relPath, expected));
  }

  const ok = findings.length === 0;
  if (args.format === "json") {
    console.log(
      JSON.stringify(
        {
          ok,
          promoted_count: expected,
          surfaces: SURFACES,
          archive_excluded: "docs/archive/**",
          findings,
        },
        null,
        2,
      ),
    );
  } else if (ok) {
    console.log(`PASS: current public/agent surfaces report ${expected} promoted PRDs (registry-derived).`);
  } else {
    console.error(`FAIL: stale promoted-count claims on current public/agent surfaces (registry promoted count is ${expected}):`);
    for (const f of findings) console.error(`  - ${f}`);
  }

  process.exit(ok ? 0 : 1);
}

main();
