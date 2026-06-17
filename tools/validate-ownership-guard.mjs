#!/usr/bin/env node

/**
 * validate-ownership-guard.mjs — PRD-033 R4.5 / R7.3 control-plane check.
 *
 * Collaborative tool (tools/, not tools/hooks/). Read-only. Run at boot and closeout to
 * confirm the ownership guard is configured and to surface `core.hooksPath` drift.
 *
 * Checks:
 *   1. core.hooksPath points at the Maintainer-owned shared hooks dir (tools/hooks).
 *      Any other value (incl. an agent-owned dir, or unset) is DRIFT = decision-required.
 *   2. OWNERSHIP.yaml exists, parses, and declares agents + maintainer_owned.
 *   3. tools/hooks/pre-commit and tools/hooks/guard-check.mjs exist and are executable.
 *   4. Reports the enforcing identity (TURNFILE_AGENT env or .turnfile-agent file).
 *
 * Usage:  node tools/validate-ownership-guard.mjs [--root .] [--format json|human]
 * Exit:   0 clean · 1 decision-required (drift / missing guard) · 2 fatal
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);

function arg(flag, def) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const root = path.resolve(arg("--root", "."));
const format = arg("--format", "human");
const EXPECTED_HOOKS_PATH = "tools/hooks";

const findings = [];
function add(severity, code, message) {
  findings.push({ severity, code, message });
}

// 1. core.hooksPath
let hooksPath = null;
try {
  hooksPath = execFileSync("git", ["config", "--get", "core.hooksPath"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
} catch {
  hooksPath = "";
}
const hooksPathNorm = hooksPath.replace(/\/+$/, "");
if (hooksPathNorm === EXPECTED_HOOKS_PATH) {
  // ok
} else if (!hooksPathNorm) {
  add("decision-required", "hookspath-unset", "core.hooksPath is unset; the shared ownership guard is not active (expected tools/hooks).");
} else {
  add(
    "decision-required",
    "hookspath-drift",
    `core.hooksPath points at "${hooksPathNorm}" (expected "${EXPECTED_HOOKS_PATH}"). PRD-033 R4.5: repointing the guard is a guarded action — reconcile before committing.`
  );
}

// 2. OWNERSHIP.yaml
let ownership = null;
const mapPath = path.join(root, "OWNERSHIP.yaml");
if (!fs.existsSync(mapPath)) {
  add("decision-required", "map-missing", "OWNERSHIP.yaml not found at repo root.");
} else {
  try {
    ownership = require("js-yaml").load(fs.readFileSync(mapPath, "utf8"));
    if (!ownership || typeof ownership !== "object") {
      add("decision-required", "map-empty", "OWNERSHIP.yaml did not parse to a map.");
    } else {
      if (!ownership.agents || Object.keys(ownership.agents).length === 0) {
        add("decision-required", "map-no-agents", "OWNERSHIP.yaml declares no agents.");
      }
      if (!Array.isArray(ownership.maintainer_owned) || ownership.maintainer_owned.length === 0) {
        add("decision-required", "map-no-maintainer-owned", "OWNERSHIP.yaml declares no maintainer_owned paths (guard config could be edited by agents).");
      }
    }
  } catch (e) {
    add("decision-required", "map-parse-error", `OWNERSHIP.yaml parse error: ${e.message}`);
  }
}

// 3. hook files present + executable
for (const rel of ["tools/hooks/pre-commit", "tools/hooks/guard-check.mjs"]) {
  const f = path.join(root, rel);
  if (!fs.existsSync(f)) {
    add("decision-required", "hook-missing", `${rel} is missing.`);
  } else {
    try {
      fs.accessSync(f, fs.constants.X_OK);
    } catch {
      add("warning", "hook-not-executable", `${rel} exists but is not executable (chmod +x).`);
    }
  }
}

// 4. enforcing identity (report only)
let identity = (process.env.TURNFILE_AGENT || "").trim();
let identitySource = identity ? "env:TURNFILE_AGENT" : "";
if (!identity) {
  const f = path.join(root, ".turnfile-agent");
  if (fs.existsSync(f)) {
    identity = fs.readFileSync(f, "utf8").trim();
    identitySource = identity ? ".turnfile-agent" : "";
  }
}
if (!identity) {
  add("warning", "identity-unset", "No enforcing identity set (TURNFILE_AGENT unset and no .turnfile-agent). Commits will fail closed until set.");
}

const decisionRequired = findings.filter((f) => f.severity === "decision-required");
const clean = decisionRequired.length === 0;

const report = {
  root,
  core_hooks_path: hooksPathNorm || null,
  expected_hooks_path: EXPECTED_HOOKS_PATH,
  guard_active: hooksPathNorm === EXPECTED_HOOKS_PATH,
  enforcing_identity: identity || null,
  identity_source: identitySource || null,
  findings,
  clean,
};

if (format === "json") {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("Ownership Guard (PRD-033)");
  console.log(`- core.hooksPath: ${report.core_hooks_path ?? "(unset)"} (expected ${EXPECTED_HOOKS_PATH})`);
  console.log(`- guard active:   ${report.guard_active}`);
  console.log(`- enforcing id:   ${report.enforcing_identity ?? "(none)"}${identitySource ? " via " + identitySource : ""}`);
  if (findings.length === 0) {
    console.log("- findings:       none — guard configured and consistent.");
  } else {
    console.log("- findings:");
    for (const f of findings) console.log(`    [${f.severity}] ${f.code}: ${f.message}`);
  }
}

process.exit(clean ? 0 : 1);
