#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const DEFAULT_REPO_TURNFILE_SKILL = "skills/codex/SKILL.md";
const VERSIONING_SKILL_NAMES = new Set(["skill-versioning", "skill-provenance"]);
const DEFAULT_REQUIRED_GLOBAL_SKILLS = [
  "turnfile-codex-collaboration",
  "skill-versioning|skill-provenance",
];

function defaultGlobalSkillsDir() {
  const codexHome = process.env.CODEX_HOME || path.join(process.env.HOME || "", ".codex");
  return path.join(codexHome, "skills");
}

function usage() {
  console.error(
    [
      "Usage: node tools/validate-skills-preflight.mjs [options]",
      "",
      "Options:",
      "  --repo-turnfile-skill <path>   Repo-local Turnfile skill file (default: skills/codex/SKILL.md)",
      "  --repo-versioning-dir <path>   Repo-local versioning bundle directory",
      "  --global-skills-dir <path>      Global Codex skills dir (default: $CODEX_HOME/skills or ~/.codex/skills)",
      "  --strict-global                 Require global skills install + parity checks",
      "  --help, -h                      Show help",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const args = {
    repoTurnfileSkill: DEFAULT_REPO_TURNFILE_SKILL,
    repoVersioningDir: null,
    globalSkillsDir: defaultGlobalSkillsDir(),
    strictGlobal: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--repo-turnfile-skill") {
      args.repoTurnfileSkill = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--repo-versioning-dir") {
      args.repoVersioningDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--global-skills-dir") {
      args.globalSkillsDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--strict-global") {
      args.strictGlobal = true;
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

function mustReadText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function parseFrontmatterNameAndKeys(filePath) {
  const raw = mustReadText(filePath);
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    return { name: null, keys: [] };
  }

  const block = match[1];
  const keys = block
    .split("\n")
    .map((line) => line.match(/^([a-zA-Z0-9_-]+)\s*:/))
    .filter(Boolean)
    .map((m) => m[1]);

  const nameLine = block.match(/^name:\s*(.+)$/m);
  const name = nameLine ? nameLine[1].trim() : null;
  return { name, keys };
}

function validateMinimalFrontmatter(keys, label, errors) {
  const allowed = new Set(["name", "description"]);
  for (const key of keys) {
    if (!allowed.has(key)) {
      errors.push(`${label}: SKILL.md frontmatter key '${key}' is not allowed for minimal mode`);
    }
  }
}

function validateFrontmatterForMode(keys, mode, label, errors) {
  if (mode === "minimal") {
    validateMinimalFrontmatter(keys, label, errors);
    return;
  }

  if (mode === "metadata") {
    const allowed = new Set(["name", "description", "metadata"]);
    for (const key of keys) {
      if (!allowed.has(key)) {
        errors.push(`${label}: SKILL.md frontmatter key '${key}' is not allowed for metadata mode`);
      }
    }
    return;
  }

  errors.push(`${label}: unsupported frontmatter mode '${mode}'`);
}

function isIntegerOrSemver(value) {
  if (Number.isInteger(value)) {
    return true;
  }
  return typeof value === "string" && /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(value);
}

function validateManifest(bundleDir, label, errors, warnings) {
  const manifestPath = path.join(bundleDir, "MANIFEST.yaml");
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${label}: missing MANIFEST.yaml`);
    return;
  }

  let yaml;
  try {
    yaml = require("js-yaml");
  } catch (e) {
    errors.push("js-yaml not available; cannot parse MANIFEST.yaml");
    return;
  }

  let manifest;
  try {
    manifest = yaml.load(mustReadText(manifestPath));
  } catch (e) {
    errors.push(`${label}: invalid MANIFEST.yaml (${e.message})`);
    return;
  }

  if (!manifest || typeof manifest !== "object") {
    errors.push(`${label}: manifest root must be an object`);
    return;
  }

  if (!manifest.bundle) {
    errors.push(`${label}: manifest missing 'bundle'`);
  }
  if (!isIntegerOrSemver(manifest.bundle_version)) {
    errors.push(`${label}: manifest 'bundle_version' must be an integer or semver string`);
  }
  if (!Array.isArray(manifest.files)) {
    errors.push(`${label}: manifest 'files' must be an array`);
    return;
  }

  const frontmatterMode = manifest.compatibility?.frontmatter_mode;
  if (!["minimal", "metadata"].includes(frontmatterMode)) {
    errors.push(`${label}: manifest frontmatter_mode is '${frontmatterMode ?? "unset"}' (expected 'minimal' or 'metadata')`);
  }

  for (const entry of manifest.files) {
    const relPath = String(entry.path || "").trim();
    if (!relPath) {
      errors.push(`${label}: manifest file entry with empty path`);
      continue;
    }

    if (path.isAbsolute(relPath)) {
      errors.push(`${label}: manifest path must be relative, got '${relPath}'`);
      continue;
    }

    const absPath = path.join(bundleDir, relPath);
    if (!fs.existsSync(absPath)) {
      errors.push(`${label}: manifest references missing file '${relPath}'`);
      continue;
    }

    if (typeof entry.hash === "string") {
      if (!entry.hash.startsWith("sha256:")) {
        errors.push(`${label}: file '${relPath}' hash must start with 'sha256:'`);
      } else {
        const expected = entry.hash.slice("sha256:".length);
        const actual = sha256File(absPath);
        if (actual !== expected) {
          errors.push(`${label}: file '${relPath}' hash mismatch`);
        }
      }
    } else if (entry.hash !== null) {
      warnings.push(`${label}: file '${relPath}' hash is ${String(entry.hash)} (expected sha256:* or null)`);
    }
  }
}

function readManifestMode(bundleDir) {
  const manifestPath = path.join(bundleDir, "MANIFEST.yaml");
  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  try {
    const yaml = require("js-yaml");
    const manifest = yaml.load(mustReadText(manifestPath));
    return manifest?.compatibility?.frontmatter_mode || null;
  } catch {
    return null;
  }
}

function listGlobalSkillFiles(globalSkillsDir) {
  if (!fs.existsSync(globalSkillsDir)) {
    return [];
  }

  const out = [];
  const entries = fs.readdirSync(globalSkillsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const child = path.join(globalSkillsDir, entry.name);

    if (entry.name === ".system") {
      const systemEntries = fs.readdirSync(child, { withFileTypes: true });
      for (const sys of systemEntries) {
        if (!sys.isDirectory()) continue;
        const skillPath = path.join(child, sys.name, "SKILL.md");
        if (fs.existsSync(skillPath)) out.push(skillPath);
      }
      continue;
    }

    const skillPath = path.join(child, "SKILL.md");
    if (fs.existsSync(skillPath)) out.push(skillPath);
  }
  return out.sort();
}

function main() {
  const args = parseArgs(process.argv);
  const repoRoot = process.cwd();
  const errors = [];
  const warnings = [];

  const repoTurnfileSkillAbs = path.resolve(repoRoot, args.repoTurnfileSkill);

  if (!fs.existsSync(repoTurnfileSkillAbs)) {
    errors.push(`Missing repo Turnfile skill: ${args.repoTurnfileSkill}`);
  }

  if (fs.existsSync(repoTurnfileSkillAbs)) {
    const { name, keys } = parseFrontmatterNameAndKeys(repoTurnfileSkillAbs);
    if (name !== "turnfile-codex-collaboration") {
      errors.push(`Repo Turnfile skill name mismatch: expected 'turnfile-codex-collaboration', got '${name}'`);
    }
    validateMinimalFrontmatter(keys, "Repo Turnfile skill", errors);
  }

  // Validate repo versioning directory if provided
  if (args.repoVersioningDir) {
    const repoVersioningDirAbs = path.resolve(repoRoot, args.repoVersioningDir);
    const repoVersioningSkillPath = path.join(repoVersioningDirAbs, "SKILL.md");

    if (!fs.existsSync(repoVersioningDirAbs)) {
      errors.push(`Repo versioning directory not found: ${args.repoVersioningDir}`);
    } else if (!fs.existsSync(repoVersioningSkillPath)) {
      errors.push(`Repo versioning skill not found: ${path.join(args.repoVersioningDir, "SKILL.md")}`);
    } else {
      const { name, keys } = parseFrontmatterNameAndKeys(repoVersioningSkillPath);
      if (!VERSIONING_SKILL_NAMES.has(name)) {
        errors.push(`Repo versioning skill name mismatch: expected one of '${[...VERSIONING_SKILL_NAMES].join(", ")}', got '${name}'`);
      }
      const mode = readManifestMode(repoVersioningDirAbs) || "minimal";
      validateFrontmatterForMode(keys, mode, "Repo versioning skill", errors);
      validateManifest(repoVersioningDirAbs, "Repo skill-versioning bundle", errors, warnings);
    }
  }

  const globalSkillFiles = listGlobalSkillFiles(args.globalSkillsDir);
  const globalNameToPath = new Map();
  const duplicateNames = new Set();

  for (const skillFile of globalSkillFiles) {
    const { name } = parseFrontmatterNameAndKeys(skillFile);
    if (!name) {
      errors.push(`Global skill missing name frontmatter: ${skillFile}`);
      continue;
    }
    if (globalNameToPath.has(name)) {
      duplicateNames.add(name);
    } else {
      globalNameToPath.set(name, skillFile);
    }
  }

  if (args.strictGlobal) {
    for (const dup of [...duplicateNames].sort()) {
      errors.push(`Duplicate global skill name detected: '${dup}'`);
    }
  }

  if (args.strictGlobal) {
    if (!fs.existsSync(args.globalSkillsDir)) {
      errors.push(`Global skills directory not found: ${args.globalSkillsDir}`);
    }
    for (const skillName of DEFAULT_REQUIRED_GLOBAL_SKILLS) {
      const acceptableNames = skillName.split("|");
      if (!acceptableNames.some((name) => globalNameToPath.has(name))) {
        errors.push(`Required global skill missing: ${acceptableNames.join(" or ")}`);
      }
    }
  } else if (!fs.existsSync(args.globalSkillsDir)) {
    warnings.push(`Global skills directory not found: ${args.globalSkillsDir} (global checks skipped)`);
  }

  if (args.strictGlobal) {
    const globalTurnfileSkill = globalNameToPath.get("turnfile-codex-collaboration");
    if (globalTurnfileSkill && fs.existsSync(repoTurnfileSkillAbs)) {
      const globalHash = sha256File(globalTurnfileSkill);
      const repoHash = sha256File(repoTurnfileSkillAbs);
      if (globalHash !== repoHash) {
        errors.push(`Global Turnfile skill hash differs from repo canonical ${args.repoTurnfileSkill}`);
      }
    } else {
      errors.push("Cannot run Turnfile global parity check (missing global or repo skill)");
    }

    const globalVersioningSkill =
      globalNameToPath.get("skill-versioning") || globalNameToPath.get("skill-provenance");
    if (globalVersioningSkill) {
      const globalVersioningDir = path.dirname(globalVersioningSkill);
      const mode = readManifestMode(globalVersioningDir) || "minimal";
      const { name, keys } = parseFrontmatterNameAndKeys(globalVersioningSkill);
      if (!VERSIONING_SKILL_NAMES.has(name)) {
        errors.push(`Global versioning skill name mismatch: expected one of '${[...VERSIONING_SKILL_NAMES].join(", ")}', got '${name}'`);
      }
      validateFrontmatterForMode(keys, mode, "Global versioning skill", errors);
      validateManifest(globalVersioningDir, "Global skill-versioning bundle", errors, warnings);
    } else {
      errors.push("Cannot validate global versioning bundle (skill-versioning or skill-provenance not installed)");
    }
  }

  console.log("Skills Preflight");
  console.log(`- Repo turnfile skill: ${args.repoTurnfileSkill}`);
  if (args.repoVersioningDir) {
    console.log(`- Repo versioning dir: ${args.repoVersioningDir}`);
  }
  console.log(`- Global skills dir: ${args.globalSkillsDir}`);
  console.log(`- Global skills discovered: ${globalSkillFiles.length}`);
  console.log(`- Strict global mode: ${args.strictGlobal ? "on" : "off"}`);
  console.log("");

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
    console.log("");
    process.exit(1);
  }

  console.log("SKILLS PREFLIGHT: PASS");
}

try {
  main();
} catch (error) {
  console.error(`Fatal: ${error.message}`);
  process.exit(2);
}
