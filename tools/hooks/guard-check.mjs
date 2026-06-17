#!/usr/bin/env node

/**
 * guard-check.mjs — Shared Layer-2 ownership guard brain (PRD-033 R4).
 *
 * MAINTAINER-OWNED, AGENT-LOCKED. Lives under tools/hooks/ (locked in OWNERSHIP.yaml).
 * No agent may edit/commit this file; only the Maintainer may.
 *
 * Two roles:
 *   1. Library: `classifyCommit({ agent, stagedPaths, ownership })` is a pure function
 *      with no git/fs/env dependency, so evals/prd-033.evals.mjs can test it hermetically.
 *   2. CLI: invoked by tools/hooks/pre-commit. Resolves the committing identity, reads the
 *      staged path list from git, loads OWNERSHIP.yaml, and exits 0 (allow) / 1 (block).
 *
 * Identity (PRD-033 R8, Maintainer choice 2026-06-17):
 *   TURNFILE_AGENT env var wins; else a per-clone, gitignored `.turnfile-agent` file;
 *   else unresolved → fail closed.
 *
 * Override (PRD-033 R5, Maintainer choice 2026-06-17):
 *   TURNFILE_AGENT=maintainer bypasses all ownership checks (trusted identity).
 *   TURNFILE_GUARD_OVERRIDE="<reason>" bypasses with a required reason; the reason is
 *   printed and appended to the gitignored `.turnfile-guard-overrides.log`. The committer
 *   must still record the override in WORKLOG (R5.2) — the hook cannot edit WORKLOG mid-commit.
 *
 * Exit codes (CLI): 0 allow · 1 blocked / unresolved identity · 2 fatal (config error).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// ---------------------------------------------------------------------------
// Pure glob + classification core (no I/O — safe to import in evals)
// ---------------------------------------------------------------------------

/** Convert a Turnfile ownership glob (`**`, `*`) to an anchored RegExp. */
export function globToRegExp(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") {
        re += ".*"; // ** — any depth
        i++;
        if (glob[i + 1] === "/") i++; // collapse `**/`
      } else {
        re += "[^/]*"; // * — within one segment
      }
    } else if ("\\^$+?.()|[]{}".includes(c)) {
      re += "\\" + c;
    } else {
      re += c;
    }
  }
  return new RegExp("^" + re + "$");
}

/**
 * Determine the owner of a single path against the ownership map.
 * @returns {string|null} owner agent id, "maintainer", or null (collaborative).
 */
export function ownerOf(filePath, ownership) {
  const p = filePath.replace(/^\.\//, "");
  for (const glob of ownership.maintainer_owned || []) {
    if (globToRegExp(glob).test(p)) return "maintainer";
  }
  for (const [agent, spec] of Object.entries(ownership.agents || {})) {
    for (const glob of spec.owned || []) {
      if (globToRegExp(glob).test(p)) return agent;
    }
  }
  for (const [glob, agent] of Object.entries(ownership.legacy || {})) {
    if (globToRegExp(glob).test(p)) return agent;
  }
  return null;
}

/**
 * Pure commit classifier (PRD-033 R4.1). No env, git, or fs access.
 * @param {{agent: string|null, stagedPaths: string[], ownership: object}} args
 * @returns {{ok: boolean, violations: {path: string, owner: string}[], reason: string}}
 */
export function classifyCommit({ agent, stagedPaths, ownership }) {
  // Maintainer identity bypasses every ownership check (R5.1).
  if (agent === "maintainer") {
    return { ok: true, violations: [], reason: "maintainer-bypass" };
  }
  // Unresolved/ambiguous identity fails closed (R4.2).
  if (!agent) {
    return {
      ok: false,
      violations: [],
      reason: "unresolved-identity",
    };
  }
  const violations = [];
  for (const p of stagedPaths) {
    const owner = ownerOf(p, ownership);
    if (owner && owner !== agent) {
      violations.push({ path: p, owner });
    }
  }
  return {
    ok: violations.length === 0,
    violations,
    reason: violations.length === 0 ? "clean" : "peer-owned-staged",
  };
}

// ---------------------------------------------------------------------------
// CLI side (identity resolution + git + I/O) — only runs when invoked directly
// ---------------------------------------------------------------------------

function repoRoot(startDir) {
  // tools/hooks/guard-check.mjs → repo root is two levels up.
  return path.resolve(startDir, "..", "..");
}

function resolveIdentity(root) {
  const env = (process.env.TURNFILE_AGENT || "").trim();
  if (env) return { agent: env, source: "env" };
  const file = path.join(root, ".turnfile-agent");
  if (fs.existsSync(file)) {
    const v = fs.readFileSync(file, "utf8").trim();
    if (v) return { agent: v, source: ".turnfile-agent" };
  }
  return { agent: null, source: "none" };
}

function loadOwnership(root) {
  const yaml = require("js-yaml");
  const mapPath = path.join(root, "OWNERSHIP.yaml");
  if (!fs.existsSync(mapPath)) {
    throw new Error(`OWNERSHIP.yaml not found at ${mapPath}`);
  }
  return yaml.load(fs.readFileSync(mapPath, "utf8"));
}

function stagedPaths(root) {
  const { execFileSync } = require("node:child_process");
  const out = execFileSync(
    "git",
    ["diff", "--cached", "--name-only", "--diff-filter=ACMRT"],
    { cwd: root, encoding: "utf8" }
  );
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = repoRoot(here);
  let ownership;
  try {
    ownership = loadOwnership(root);
  } catch (e) {
    console.error(`[ownership-guard] FATAL: ${e.message}`);
    process.exit(2);
  }

  const paths = stagedPaths(root);
  if (paths.length === 0) process.exit(0); // nothing staged

  // Logged override escape hatch (R5).
  const override = (process.env.TURNFILE_GUARD_OVERRIDE || "").trim();
  if (override) {
    const line = `${new Date().toISOString()}\toverride\treason="${override}"\tstaged=${paths.length}\n`;
    try {
      fs.appendFileSync(path.join(root, ".turnfile-guard-overrides.log"), line);
    } catch {
      /* best-effort audit; never block on log write */
    }
    console.error(
      `[ownership-guard] OVERRIDE in effect — reason: "${override}". ` +
        `Record this in working-session/WORKLOG.md (PRD-033 R5.2).`
    );
    process.exit(0);
  }

  const { agent, source } = resolveIdentity(root);
  const result = classifyCommit({ agent, stagedPaths: paths, ownership });

  if (result.reason === "unresolved-identity") {
    console.error(
      "[ownership-guard] BLOCKED: committing agent identity is unresolved (fail-closed).\n" +
        "  Set it for this clone:   echo claude > .turnfile-agent   (or codex / gemini)\n" +
        "  Or per commit:           TURNFILE_AGENT=claude git commit ...\n" +
        "  Maintainer commits:      TURNFILE_AGENT=maintainer git commit ...\n" +
        "  Explicit override:       TURNFILE_GUARD_OVERRIDE=\"<reason>\" git commit ..."
    );
    process.exit(1);
  }

  if (!result.ok) {
    console.error(
      `[ownership-guard] BLOCKED: agent "${agent}" (via ${source}) staged peer-owned path(s):`
    );
    for (const v of result.violations) {
      console.error(`  ✗ ${v.path}  (owned by: ${v.owner})`);
    }
    console.error(
      "PRD-033 R6: the owning agent applies peer contributions to its own bundle.\n" +
        "Unstage the peer-owned path(s), or route the content via mailbox/review,\n" +
        "or (Maintainer only) TURNFILE_AGENT=maintainer / TURNFILE_GUARD_OVERRIDE=\"<reason>\"."
    );
    process.exit(1);
  }

  process.exit(0);
}

// Run as CLI only when executed directly, not when imported by evals.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
