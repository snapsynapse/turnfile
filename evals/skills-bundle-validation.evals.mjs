// skills-bundle-validation.evals.mjs — RED evals for a generic agent-bundle
// validation gate on tools/validate-skills-preflight.mjs.
// Eval author: Claude (proposer/eval-author) per PRD-006 A1 step 4.
// Intended implementer: Codex.
//
// TARGET behavior (does NOT exist yet — these tests are EXPECTED TO FAIL):
//   A NEW `--repo-skill-bundle <dir>` flag that hash-validates an ARBITRARY
//   agent skill bundle (SKILL.md + MANIFEST.yaml with files[] sha256), mirroring
//   .agents/skills/turnfile-protocol-gemini. Unlike --repo-versioning-dir it does
//   NOT name-check the bundle, so any agent bundle name passes. It reuses the
//   existing manifest validation (sha256 match on disk, self-hash null allowed)
//   and accepts minimal (name + description) frontmatter.
//
// Invariants this suite PINS (hermetic temp bundles, sha256 computed in-test):
//   1. Valid bundle (manifest hashes match disk, self-hash null) => PASS, no errors.
//   2. Hash MISMATCH (file tampered after pinning) => error, nonzero exit.
//   3. Missing SKILL.md in the bundle => error, nonzero exit.
//   4. Minimal frontmatter (name + description only) is accepted.
//   5. NO name-check: an arbitrary bundle name (not turnfile-*) still PASSES.
//
// These FAIL now because: --repo-skill-bundle is an unknown argument, so parseArgs
// throws "Unknown argument: --repo-skill-bundle" and the process exits 2 (Fatal)
// without ever running the bundle (it would also drag in the default
// repo-turnfile-skill check, which we suppress by pointing it at our own SKILL.md).
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-skills-preflight.mjs");

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

// Mirror .agents/skills/turnfile-protocol-gemini: SKILL.md (minimal frontmatter:
// name + description), CHANGELOG.md, MANIFEST.yaml with bundle_version + files[]
// carrying sha256:* hashes for SKILL.md/CHANGELOG.md and null self-hash.
//
// opts.name        — bundle name in SKILL.md frontmatter (default arbitrary, NOT turnfile-*)
// opts.omitSkill   — when true, do not write SKILL.md (drives invariant 3)
// opts.tamper      — when true, rewrite SKILL.md AFTER pinning its hash (invariant 2)
function makeBundle(label, opts = {}) {
  const name = opts.name ?? "some-vendor-agent-bundle";
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `skill-bundle-${label}-`));

  const skillBody = `---
name: ${name}
description: Hermetic fixture skill bundle for preflight validation. Minimal frontmatter only.
---

# ${name}

Fixture body. Not a real skill.
`;
  const changelogBody = "# Changelog\n\n- Initial fixture entry.\n";

  const skillPath = path.join(dir, "SKILL.md");
  const changelogPath = path.join(dir, "CHANGELOG.md");

  if (!opts.omitSkill) fs.writeFileSync(skillPath, skillBody, "utf8");
  fs.writeFileSync(changelogPath, changelogBody, "utf8");

  // Pin hashes against what is currently on disk.
  const files = [];
  if (!opts.omitSkill) {
    files.push({ path: "SKILL.md", role: "skill", version: 1, hash: `sha256:${sha256File(skillPath)}` });
  }
  files.push({ path: "CHANGELOG.md", role: "reference", version: 1, hash: `sha256:${sha256File(changelogPath)}` });
  files.push({ path: "MANIFEST.yaml", role: "reference", version: 1, hash: null });

  const filesYaml = files
    .map((f) => {
      const hashVal = f.hash === null ? "null" : f.hash;
      return [
        `  - path: ${f.path}`,
        `    role: ${f.role}`,
        `    version: ${f.version}`,
        `    hash: ${hashVal}`,
      ].join("\n");
    })
    .join("\n");

  const manifest = `bundle: ${name}
bundle_version: 2
bundle_date: 2026-06-17
description: Hermetic fixture bundle.

compatibility:
  spec_version: agentskills.io/1.0
  frontmatter_mode: minimal

files:
${filesYaml}
`;
  fs.writeFileSync(path.join(dir, "MANIFEST.yaml"), manifest, "utf8");

  // Tamper AFTER pinning so the on-disk hash no longer matches the manifest.
  if (opts.tamper && !opts.omitSkill) {
    fs.appendFileSync(skillPath, "\nTampered content appended after hash pinning.\n", "utf8");
  }

  return dir;
}

// Run preflight against the bundle while neutralizing the default
// repo-turnfile-skill gate: we point --repo-turnfile-skill at the bundle's own
// SKILL.md is NOT valid (name mismatch), so instead we suppress unrelated noise
// by asserting specifically on bundle-scoped output. We keep the run hermetic by
// running from a temp cwd that has no global skills dir surprises.
function runBundle(bundleDir, extra = []) {
  return spawnSync(
    process.execPath,
    [TOOL, "--repo-skill-bundle", bundleDir, "--global-skills-dir", path.join(bundleDir, "__no_global__"), ...extra],
    { cwd: root, encoding: "utf8" },
  );
}

// --- Invariant 1 + 4 + 5: valid arbitrary-named minimal bundle => PASS ------

test("valid arbitrary-named bundle (minimal frontmatter, hashes match) PASSES with no bundle errors", () => {
  const dir = makeBundle("valid");
  const result = runBundle(dir);
  const out = `${result.stdout}${result.stderr}`;

  assert.notEqual(
    result.status,
    2,
    `tool crashed (Fatal) — --repo-skill-bundle is not implemented yet: ${out}`,
  );
  assert.equal(result.status, 0, `expected PASS for a valid bundle, got nonzero. Output:\n${out}`);
  assert.match(out, /PASS/);
  // No name-check: the arbitrary bundle name must NOT produce a name-mismatch error.
  assert.doesNotMatch(out, /name mismatch/i);
  assert.doesNotMatch(out, /hash mismatch/i);
});

test("bundle name is NOT name-checked: a non-turnfile bundle name still PASSES", () => {
  const dir = makeBundle("named", { name: "totally-unrelated-bundle-xyz" });
  const result = runBundle(dir);
  const out = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, `arbitrary bundle name should pass. Output:\n${out}`);
  assert.doesNotMatch(out, /name mismatch/i);
});

// --- Invariant 2: hash mismatch => error -----------------------------------

test("tampered file (hash mismatch vs manifest) reports an ERROR and exits nonzero", () => {
  const dir = makeBundle("tamper", { tamper: true });
  const result = runBundle(dir);
  const out = `${result.stdout}${result.stderr}`;
  assert.notEqual(result.status, 0, `tampered bundle must fail. Output:\n${out}`);
  assert.match(out, /hash mismatch/i);
  assert.match(out, /SKILL\.md/);
});

// --- Invariant 3: missing SKILL.md => error --------------------------------

test("bundle missing SKILL.md reports an ERROR and exits nonzero", () => {
  const dir = makeBundle("noskill", { omitSkill: true });
  const result = runBundle(dir);
  const out = `${result.stdout}${result.stderr}`;
  assert.notEqual(result.status, 0, `bundle missing SKILL.md must fail. Output:\n${out}`);
  assert.match(out, /SKILL\.md/i);
});
