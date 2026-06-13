#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_REGISTRY = "working-session/docs/PRD_STATUS.json";
// "deferred" and "superseded" added in session 14 (Maintainer decision 2026-06-12):
// terminal non-promotable states so the registry can record triage outcomes faithfully.
const VALID_STATUSES = new Set(["accepted", "pending", "not_applicable", "deferred", "superseded"]);
const TERMINAL_STATES = new Set(["deferred", "superseded"]);
// "docs/archive/prds" added session 14 (Maintainer-approved + Maintainer-moved 2026-06-13):
// terminal home for deferred/superseded PRDs, beside the existing docs/archive/ convention.
// Archived PRDs MUST be terminal and non-promotable (enforced below).
const VALID_SHELVES = new Set(["working-session/docs", "docs/prds", "docs/archive/prds"]);
const ARCHIVE_SHELF = "docs/archive/prds";

function usage() {
  console.error(
    "Usage: node tools/validate-prd-promotion.mjs [--registry <path>] [--check-ids PRD-001,PRD-002]",
  );
}

function parseArgs(argv) {
  const args = {
    registry: DEFAULT_REGISTRY,
    checkIds: [],
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--registry") {
      args.registry = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--check-ids") {
      const raw = argv[i + 1] || "";
      args.checkIds = raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function mustReadJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function listPrdFiles(rootDir, subdir) {
  const dirPath = path.join(rootDir, subdir);
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath)
    .filter((name) => /^PRD-\d{3}-.+\.md$/.test(name))
    .map((name) => `${subdir}/${name}`)
    .sort();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function summarizeAcceptance(entry, requiredReviewers) {
  const acceptance = entry.acceptance || {};
  let accepted = true;

  for (const reviewer of requiredReviewers) {
    const slot = acceptance[reviewer] || {};
    if (slot.status !== "accepted") {
      accepted = false;
      break;
    }
  }

  const blockers = asArray(entry.blocking_items);
  const eligible = accepted && blockers.length === 0;
  return { eligible, blockers };
}

function main() {
  const args = parseArgs(process.argv);
  const repoRoot = process.cwd();
  const registryPath = path.resolve(repoRoot, args.registry);

  if (!fs.existsSync(registryPath)) {
    throw new Error(`Registry not found: ${args.registry}`);
  }

  const registry = mustReadJson(registryPath);
  const errors = [];
  const warnings = [];

  if (!Array.isArray(registry.prds)) {
    throw new Error("Registry JSON must include an array at prds");
  }

  const requiredReviewers = asArray(registry.policy?.required_reviewers);
  if (requiredReviewers.length === 0) {
    throw new Error("Registry policy.required_reviewers must include at least one reviewer");
  }

  const byId = new Map();
  const byPath = new Map();

  for (const entry of registry.prds) {
    if (!entry || typeof entry !== "object") {
      errors.push("Registry entry must be an object");
      continue;
    }

    const id = String(entry.id || "").trim();
    const entryPath = String(entry.path || "").trim();
    const shelf = String(entry.shelf || "").trim();

    if (!/^PRD-\d{3}$/.test(id)) {
      errors.push(`Invalid id format: ${id}`);
      continue;
    }
    if (byId.has(id)) {
      errors.push(`Duplicate id in registry: ${id}`);
    }
    byId.set(id, entry);

    if (!entryPath) {
      errors.push(`${id}: path is required`);
    } else if (path.isAbsolute(entryPath)) {
      errors.push(`${id}: path must be repository-relative, got absolute path`);
    }

    if (byPath.has(entryPath)) {
      errors.push(`Duplicate path in registry: ${entryPath}`);
    }
    byPath.set(entryPath, entry);

    if (!VALID_SHELVES.has(shelf)) {
      errors.push(`${id}: invalid shelf '${shelf}'`);
    } else if (entryPath && !entryPath.startsWith(`${shelf}/`)) {
      errors.push(`${id}: path '${entryPath}' does not match shelf '${shelf}'`);
    }

    if (entryPath) {
      const abs = path.resolve(repoRoot, entryPath);
      if (!fs.existsSync(abs)) {
        errors.push(`${id}: path does not exist on disk (${entryPath})`);
      }
    }

    const acceptance = entry.acceptance || {};
    for (const reviewer of requiredReviewers) {
      const slot = acceptance[reviewer];
      if (!slot || typeof slot !== "object") {
        errors.push(`${id}: missing acceptance entry for '${reviewer}'`);
        continue;
      }

      const status = slot.status;
      if (!VALID_STATUSES.has(status)) {
        errors.push(`${id}: invalid acceptance status '${status}' for ${reviewer}`);
      }

      const evidence = asArray(slot.evidence);
      if (status === "accepted" && evidence.length === 0) {
        errors.push(`${id}: ${reviewer} is accepted but evidence is empty`);
      }
    }

    const blockingItems = asArray(entry.blocking_items);
    if (!Array.isArray(entry.blocking_items)) {
      errors.push(`${id}: blocking_items must be an array`);
    }

    const { eligible } = summarizeAcceptance(entry, requiredReviewers);

    if (typeof entry.eligible_for_docs_prds !== "boolean") {
      errors.push(`${id}: eligible_for_docs_prds must be boolean`);
    } else if (entry.eligible_for_docs_prds !== eligible) {
      errors.push(
        `${id}: eligible_for_docs_prds=${entry.eligible_for_docs_prds} but computed eligible=${eligible}`,
      );
    }

    if (shelf === "docs/prds" && !eligible) {
      errors.push(
        `${id}: in docs/prds but not eligible (requires all reviewer acceptances and zero blockers)`,
      );
    }

    if (shelf === "working-session/docs" && eligible) {
      warnings.push(`${id}: eligible and still in working-session/docs (candidate for promotion)`);
    }

    if (shelf === ARCHIVE_SHELF) {
      if (!TERMINAL_STATES.has(entry.state)) {
        errors.push(
          `${id}: in ${ARCHIVE_SHELF} but state '${entry.state}' is not terminal (must be deferred or superseded)`,
        );
      }
      if (entry.eligible_for_docs_prds === true) {
        errors.push(`${id}: in ${ARCHIVE_SHELF} but marked eligible_for_docs_prds (archived PRDs are not promotable)`);
      }
    }

    if (blockingItems.length === 0 && !eligible && !TERMINAL_STATES.has(entry.state)) {
      warnings.push(`${id}: no blockers listed but acceptance gate is incomplete`);
    }
  }

  const diskPaths = new Set([
    ...listPrdFiles(repoRoot, "working-session/docs"),
    ...listPrdFiles(repoRoot, "docs/prds"),
    ...listPrdFiles(repoRoot, ARCHIVE_SHELF),
  ]);

  for (const diskPath of diskPaths) {
    if (!byPath.has(diskPath)) {
      errors.push(`Missing registry entry for file on disk: ${diskPath}`);
    }
  }

  for (const registryEntryPath of byPath.keys()) {
    if (!diskPaths.has(registryEntryPath)) {
      errors.push(`Registry path not found in known PRD shelves: ${registryEntryPath}`);
    }
  }

  if (args.checkIds.length > 0) {
    for (const id of args.checkIds) {
      const entry = byId.get(id);
      if (!entry) {
        errors.push(`--check-ids requested unknown id: ${id}`);
        continue;
      }

      const { eligible, blockers } = summarizeAcceptance(entry, requiredReviewers);
      if (!eligible) {
        errors.push(
          `${id}: not promotable (eligible=${eligible}, blockers=${blockers.join("; ") || "none"})`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("PRD promotion validation failed:\n");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    process.exit(1);
  }

  console.log("PRD promotion validation passed.");
  console.log(`- Registry: ${args.registry}`);
  console.log(`- PRDs checked: ${registry.prds.length}`);
  console.log(`- Required reviewers: ${requiredReviewers.join(", ")}`);

  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const warn of warnings) {
      console.log(`- ${warn}`);
    }
  }

  if (args.checkIds.length > 0) {
    console.log(`- Requested promotion IDs are eligible: ${args.checkIds.join(", ")}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
