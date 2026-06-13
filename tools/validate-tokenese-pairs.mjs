#!/usr/bin/env node
// validate-tokenese-pairs.mjs — PRD-028 R11 conformance validator.
//
// Scans a repository root for Tokenese twin files (`*.tk.md`) and verifies the
// dual-artifact invariants from PRD-028: every twin has complete pairing metadata
// and a present legible English source, declares a valid sync state, is not used
// while in a blocking state (tokenese-ahead / diverged), and never carries a
// decision/governance act with no governing English source (no Tokenese-only
// governance record).
//
// Usage: node tools/validate-tokenese-pairs.mjs [--root <dir>]
//   --root  directory to scan (default: repo root). Exits non-zero on any violation.
//
// English governs (PRD-028 R3). This validator is the enforcement layer; the twin
// frontmatter is the declared state, and the English source is the authority.
import fs from "node:fs";
import path from "node:path";

const REQUIRED_FIELDS = [
  "pair_id",
  "english_source",
  "tokenese_clone",
  "source_hash",
  "clone_hash",
  "sync_state",
  "last_sync_actor",
  "last_sync_evidence",
];
const VALID_STATES = new Set([
  "not-tokenized",
  "paired",
  "in-sync",
  "english-ahead",
  "tokenese-ahead",
  "diverged",
  "suspended",
]);
// Blocking states must not be used as authoritative (PRD-028 R7).
const BLOCKING_STATES = new Set(["tokenese-ahead", "diverged"]);
// Governance/decision markers that may never live only in a Tokenese artifact (R8.4).
const DECISION_MARKERS = /\b(DECISION|ACCEPT|ACCEPTED|REJECT|APPROVE|TASK CLAIM|LOCK ACQUIRED|PROMOTE)\b/i;

function parseArgs(argv) {
  let root = process.cwd();
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--root") {
      root = argv[i + 1];
      i += 1;
    } else if (argv[i] === "--help" || argv[i] === "-h") {
      console.log("Usage: node tools/validate-tokenese-pairs.mjs [--root <dir>]");
      process.exit(0);
    }
  }
  return { root };
}

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.name.endsWith(".tk.md")) {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return fm;
}

function bodyOf(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const twins = walk(root);

  for (const twin of twins) {
    const rel = path.relative(root, twin);
    const text = fs.readFileSync(twin, "utf8");
    const fm = parseFrontmatter(text);

    if (!fm) {
      errors.push(`${rel}: missing or malformed pairing metadata (no frontmatter)`);
      continue;
    }
    for (const field of REQUIRED_FIELDS) {
      if (!fm[field]) errors.push(`${rel}: missing pairing metadata field '${field}'`);
    }

    // A Tokenese twin without a present legible English source is invalid (R2.5).
    const english = fm.english_source;
    const englishPresent = english ? fs.existsSync(path.join(root, english)) : false;
    if (english && !englishPresent) {
      errors.push(`${rel}: missing paired English source '${english}' — a Tokenese twin without a legible English source is invalid (PRD-028 R2.5)`);
    }

    // Sync state must be valid and not a blocking state used as authoritative (R7).
    const state = fm.sync_state;
    if (state && !VALID_STATES.has(state)) {
      errors.push(`${rel}: invalid sync_state '${state}'`);
    }
    if (state && BLOCKING_STATES.has(state)) {
      errors.push(`${rel}: sync_state '${state}' is a blocking state — a ${state} pair must not be used as authoritative (PRD-028 R7)`);
    }

    // No Tokenese-only decision/governance record (R3/R8.4): a decision act in the
    // twin requires a present English source that carries the governing state.
    if (DECISION_MARKERS.test(bodyOf(text)) && !englishPresent) {
      errors.push(`${rel}: Tokenese-only decision/governance content with no legible English source — English must carry the decision state (PRD-028 R3, R8.4)`);
    }
  }

  if (errors.length > 0) {
    console.error("Tokenese pair validation failed:\n");
    for (const err of errors) console.error(`- ${err}`);
    process.exit(1);
  }

  console.log("Tokenese pair validation passed.");
  console.log(`- Root: ${root}`);
  console.log(`- Tokenese twins checked: ${twins.length}`);
}

main();
