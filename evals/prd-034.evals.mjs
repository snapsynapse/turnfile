// PRD-034 implementation evals - Public and Agent-Facing Surface Snapshot Reconciliation Contract.
// Proposer/eval-author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until the public-surface validator exists and current
// public/agent-facing surfaces are reconciled with PRD_STATUS and manifests.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-public-surface-snapshot.mjs");

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd034-${name}-`));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function registry() {
  return JSON.parse(read("working-session/docs/PRD_STATUS.json"));
}

function registryEntry(id) {
  return registry().prds.find((p) => p.id === id);
}

function promotedCount() {
  return registry().prds.filter((p) => p.shelf === "docs/prds").length;
}

function skillBundleVersion(agent) {
  const manifest = read(`skills/${agent}/MANIFEST.yaml`);
  const match = manifest.match(/^bundle_version:\s*(.+)$/m);
  assert.ok(match, `${agent} manifest must declare bundle_version`);
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function runValidator(args, cwd = root) {
  assert.equal(fs.existsSync(TOOL), true, "tools/validate-public-surface-snapshot.mjs must exist");
  return spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: "utf8" });
}

function surfaceFixture({ staleCurrent = false, staleArchive = false } = {}) {
  const dir = tmp("surface");
  const promoted = 29;
  const currentCount = staleCurrent ? 27 : promoted;
  const archiveCount = staleArchive ? 27 : promoted;
  const guide = `# Assistant Guide

Turnfile current public snapshot: ${currentCount} promoted PRDs.
Claude bundle 13. Codex bundle 9.
`;
  const guideHash = sha256(guide);
  const manifest = `path: assistant-guide.txt
sha256: ${guideHash}
bytes: ${Buffer.byteLength(guide, "utf8")}
`;

  write(
    path.join(dir, "working-session/docs/PRD_STATUS.json"),
    `${JSON.stringify({
      schema_version: "1.0",
      prds: Array.from({ length: promoted }, (_, i) => ({
        id: `PRD-${String(i + 1).padStart(3, "0")}`,
        shelf: "docs/prds",
      })),
    }, null, 2)}\n`,
  );
  write(path.join(dir, "skills/claude/MANIFEST.yaml"), "bundle_version: 13\n");
  write(path.join(dir, "skills/codex/MANIFEST.yaml"), "bundle_version: 9\n");
  write(path.join(dir, "README.md"), `Turnfile has ${currentCount} promoted PRDs.\n`);
  write(path.join(dir, "docs/index.html"), `<meta name="description" content="${currentCount} promoted PRDs"><p>${currentCount} promoted PRDs</p>\n`);
  write(path.join(dir, "docs/llms.txt"), `Turnfile: ${currentCount} promoted PRDs.\n`);
  write(path.join(dir, "assistant-guide.txt"), guide);
  write(path.join(dir, "docs/.well-known/assistant-guide.txt"), guide);
  write(path.join(dir, "assistant-guide-manifest.txt"), manifest);
  write(path.join(dir, "docs/.well-known/assistant-guide-manifest.txt"), manifest);
  write(path.join(dir, "docs/archive/session-16/index.html"), `<p>${archiveCount} promoted PRDs</p>\n`);
  return dir;
}

test("R1/R2/R6: PRD-034 defines inventory, sources of truth, and validator scope", () => {
  const s = read("working-session/docs/PRD-034-public-and-agent-surface-snapshot-reconciliation-contract.md");
  for (const needle of [
    /README\.md/,
    /docs\/index\.html/,
    /docs\/llms\.txt/,
    /assistant-guide\.txt/,
    /PRD total, shelf, and promoted counts derive from `working-session\/docs\/PRD_STATUS\.json`/,
    /Skill bundle versions derive from `skills\/<agent>\/MANIFEST\.yaml`/,
    /validate-public-surface-snapshot\.mjs/,
    /distinguishes historical archive hits from current public-surface failures/,
  ]) {
    assert.match(s, needle);
  }
});

test("AC3: current public and agent-facing PRD count claims match PRD_STATUS", () => {
  const expected = promotedCount();
  const surfaces = [
    "README.md",
    "docs/index.html",
    "docs/llms.txt",
    "assistant-guide.txt",
  ];
  for (const file of surfaces) {
    const s = read(file);
    assert.doesNotMatch(s, /\b27 promoted PRDs\b/i, `${file} still advertises the stale session-16 count`);
    assert.match(s, new RegExp(`\\b${expected}\\s+promoted PRDs\\b`, "i"), `${file} must state the registry-derived promoted PRD count`);
  }
});

test("AC3: PRD-032 and PRD-033 are not described as draft or pending in current public surfaces", () => {
  for (const file of ["README.md", "docs/index.html", "docs/llms.txt", "assistant-guide.txt", "CHANGELOG.md"]) {
    const s = read(file);
    assert.doesNotMatch(s, /PRD-03[23][\s\S]{0,140}\b(draft|pending|under review)\b/i, `${file} has stale PRD-032/033 status text`);
  }
});

test("AC4: public skill bundle version claims match live role manifests", () => {
  const expected = {
    claude: skillBundleVersion("claude"),
    codex: skillBundleVersion("codex"),
  };
  const docs = `${read("README.md")}\n${read("docs/index.html")}\n${read("docs/llms.txt")}\n${read("assistant-guide.txt")}`;
  assert.match(docs, new RegExp(`Claude[^\\n]{0,80}(bundle\\s+)?${expected.claude}`, "i"), "public docs must expose the live Claude bundle version");
  assert.match(docs, new RegExp(`Codex[^\\n]{0,80}(bundle\\s+)?${expected.codex}`, "i"), "public docs must expose the live Codex bundle version");
  assert.doesNotMatch(docs, /Claude[^.\n]{0,120}v0\.6\.0|Claude[^.\n]{0,120}bundle 9/i, "public docs still contain stale Claude bundle claims");
  assert.doesNotMatch(docs, /Codex[^.\n]{0,120}\bv2\b/i, "public docs still contain stale Codex bundle claims");
});

test("AC5: assistant-guide root and served copies are byte-identical and manifests match", () => {
  const guide = read("assistant-guide.txt");
  const served = read("docs/.well-known/assistant-guide.txt");
  assert.equal(served, guide, "served assistant guide must match root assistant-guide.txt byte-for-byte");
  const expectedHash = sha256(guide);
  const expectedBytes = Buffer.byteLength(guide, "utf8");
  for (const file of ["assistant-guide-manifest.txt", "docs/.well-known/assistant-guide-manifest.txt"]) {
    const s = read(file);
    assert.match(s, new RegExp(expectedHash), `${file} must contain the current assistant guide sha256`);
    assert.match(s, new RegExp(`\\b${expectedBytes}\\b`), `${file} must contain the current assistant guide byte count`);
  }
});

test("AC1/AC2: public-surface validator fails stale current claims but ignores stale archive-only claims", () => {
  const stale = surfaceFixture({ staleCurrent: true, staleArchive: false });
  const staleResult = runValidator(["--root", stale, "--format", "json"]);
  assert.notEqual(staleResult.status, 0, `${staleResult.stdout}${staleResult.stderr}`);
  assert.match(`${staleResult.stdout}${staleResult.stderr}`, /README|promoted|stale|count/i);

  const archiveOnly = surfaceFixture({ staleCurrent: false, staleArchive: true });
  const archiveResult = runValidator(["--root", archiveOnly, "--format", "json"]);
  assert.equal(archiveResult.status, 0, `${archiveResult.stdout}${archiveResult.stderr}`);
});

test("AC6/AC7: baseline snapshot labeling and release gate are present", () => {
  const baseline = read("BASELINE.md");
  assert.match(baseline, /historical snapshot|point-in-time snapshot|point-in-time baseline|session 14 snapshot/i, "BASELINE.md must be clearly labeled as historical or refreshed");
  assert.match(read("README.md"), /current state[\s\S]{0,160}(PRD_STATUS\.json|WORKLOG\.md)|PRD_STATUS\.json[\s\S]{0,160}current state/i, "README quick start must point current-state readers beyond the historical baseline");
  const pkg = JSON.parse(read("package.json"));
  const scripts = Object.values(pkg.scripts || {}).join("\n");
  assert.match(scripts, /validate-public-surface-snapshot\.mjs/, "release or validate scripts must include the public-surface snapshot validator");
  assert.match(read("RELEASE_CHECKLIST.md"), /public-surface|surface snapshot|validate-public-surface-snapshot/i, "release checklist must name the public-surface gate");
});

test("AC registry: PRD_STATUS records PRD-034 eval authorship and expected A1 ownership", () => {
  const entry = registryEntry("PRD-034");
  assert.ok(entry, "PRD-034 missing from registry");
  assert.equal(entry.implementation?.evals, "evals/prd-034.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
