#!/usr/bin/env node

/**
 * Codex Layer-1 ownership guard adapter (PRD-033 AC4).
 *
 * Codex does not have a committed project-level PreToolUse file equivalent to
 * Claude's `.claude/settings.json`, so this is the Codex-owned adapter for a
 * harness pre-write hook. Invoke it before Edit/Write/Move operations with one
 * or more target paths. It is advisory to the harness; the shared Layer-2 git
 * hook remains the portable backstop.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ownerOf } from "../../../tools/hooks/guard-check.mjs";

const require = createRequire(import.meta.url);

function usage() {
  console.error(
    [
      "Usage: node working-session/agents/codex/layer1-pretool-ownership-guard.mjs --path <path> [--path <path> ...]",
      "",
      "Exits 0 when all targets are writable by the acting agent.",
      "Exits 1 when any target is peer-owned or maintainer-owned.",
      "Identity: TURNFILE_AGENT env, else .turnfile-agent, else codex for this Codex-owned adapter.",
    ].join("\n")
  );
}

function parsePaths(argv) {
  const paths = [];
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--path") {
      const value = argv[i + 1];
      if (!value) throw new Error("--path requires a value");
      paths.push(value);
      i += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }
  return paths;
}

function repoRoot() {
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");
}

function resolveAgent(root) {
  const env = (process.env.TURNFILE_AGENT || "").trim();
  if (env) return env;
  const identityFile = path.join(root, ".turnfile-agent");
  if (fs.existsSync(identityFile)) {
    const value = fs.readFileSync(identityFile, "utf8").trim();
    if (value) return value;
  }
  return "codex";
}

function normalizeTarget(root, target) {
  const absolute = path.resolve(root, target);
  const rel = path.relative(root, absolute).replaceAll(path.sep, "/");
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error(`Target is outside the repo: ${target}`);
  }
  return rel;
}

function main() {
  let targets;
  try {
    targets = parsePaths(process.argv);
  } catch (error) {
    console.error(`[codex-layer1-guard] ${error.message}`);
    usage();
    process.exit(2);
  }

  if (targets.length === 0) {
    usage();
    process.exit(2);
  }

  const root = repoRoot();
  const ownershipPath = path.join(root, "OWNERSHIP.yaml");
  const ownership = require("js-yaml").load(fs.readFileSync(ownershipPath, "utf8"));
  const agent = resolveAgent(root);
  const violations = [];

  for (const target of targets) {
    const rel = normalizeTarget(root, target);
    const owner = ownerOf(rel, ownership);
    if (owner && owner !== agent) {
      violations.push({ path: rel, owner });
    }
  }

  if (violations.length > 0) {
    console.error(`[codex-layer1-guard] BLOCKED for agent "${agent}":`);
    for (const violation of violations) {
      console.error(`  - ${violation.path} is owned by ${violation.owner}`);
    }
    console.error("Route peer-owned or maintainer-owned changes through the owning lane.");
    process.exit(1);
  }

  process.exit(0);
}

main();
