// PRD-043 RED evals - Turnfile v1 Minimal Governance Profile and PRD shelf reconciliation.
// Eval author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until the v1 docs, starter template, schema freeze, shelf reconciliation,
// and validate-v1-profile tool are implemented.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const node = process.execPath;

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));
const requiredPrdIds = Array.from({ length: 43 }, (_, i) => `PRD-${String(i + 1).padStart(3, "0")}`);

function run(args, cwd = root) {
  return spawnSync(node, args, { cwd, encoding: "utf8" });
}

function tmpCopyTemplate() {
  const source = path.join(root, "templates/v1-minimal");
  assert.equal(fs.existsSync(source), true, "templates/v1-minimal must exist before fixture copy tests run");
  const dest = fs.mkdtempSync(path.join(os.tmpdir(), "turnfile-v1-template-"));
  fs.cpSync(source, dest, { recursive: true });
  return dest;
}

function parseJsonRun(args, cwd = root) {
  const result = run(args, cwd);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  return JSON.parse(result.stdout);
}

test("R1/R2: SPEC and minimum viable guide define v1 without historical PRD required reading", () => {
  assert.equal(exists("docs/MINIMUM_VIABLE_TURNFILE.md"), true, "docs/MINIMUM_VIABLE_TURNFILE.md must exist");
  const spec = read("SPEC.md");
  const mvt = read("docs/MINIMUM_VIABLE_TURNFILE.md");
  assert.match(spec, /Version:\s*v?1\.0\.0|version:\s*["']?1\.0\.0/i, "SPEC.md must declare v1.0.0");
  for (const needle of [
    /thin governance layer/i,
    /maintainer authority/i,
    /peer disagreement|counter-recommendation/i,
    /plain files|file-based source of truth/i,
    /evidence-backed|closeout evidence/i,
    /worked.*example|example.*open[\s\S]*mid-turn[\s\S]*close/i,
  ]) {
    assert.match(`${spec}\n${mvt}`, needle);
  }
  assert.doesNotMatch(mvt, /must read `?PRD-0[0-4][0-9]/i, "minimal guide must not require historical PRDs");
  assert.ok(mvt.split(/\r?\n/).length <= 250, "minimum viable guide must stay under 250 lines");
});

test("R3: PRD shelf reconciliation classifies every PRD through PRD-043", () => {
  assert.equal(
    exists("docs/prds/PRD_SHELF_RECONCILIATION.json"),
    true,
    "docs/prds/PRD_SHELF_RECONCILIATION.json must exist",
  );
  const data = JSON.parse(read("docs/prds/PRD_SHELF_RECONCILIATION.json"));
  assert.ok(Array.isArray(data.prds), "reconciliation artifact must expose prds array");
  const byId = new Map(data.prds.map((p) => [p.id, p]));
  const allowed = new Set(["core-v1", "optional-profile", "historical", "deferred", "superseded", "draft"]);
  for (const id of requiredPrdIds) {
    assert.ok(byId.has(id), `${id} missing from PRD shelf reconciliation`);
    const row = byId.get(id);
    assert.ok(allowed.has(row.classification), `${id} has invalid classification`);
    assert.equal(typeof row.required_for_minimal_profile, "boolean", `${id} must set required_for_minimal_profile`);
    assert.equal(typeof row.v1_surface, "string", `${id} must explain v1_surface`);
    assert.ok(Object.hasOwn(row, "profile"), `${id} must include profile field`);
  }
});

test("R4/R5: v1 starter template and schema freeze exist and are minimal", () => {
  for (const file of [
    "templates/v1-minimal/README.md",
    "templates/v1-minimal/working-session/TURNFILE.yaml",
    "templates/v1-minimal/working-session/MAILBOX.md",
    "templates/v1-minimal/working-session/WORKLOG.md",
    "schemas/v1/turnfile-v1.schema.json",
  ]) {
    assert.equal(exists(file), true, `${file} must exist`);
  }
  const templateFiles = fs
    .readdirSync(path.join(root, "templates/v1-minimal/working-session"), { recursive: true })
    .map(String)
    .sort();
  assert.deepEqual(
    templateFiles,
    ["MAILBOX.md", "NEXT_SESSION_HANDSHAKE.md", "TURNFILE.yaml", "WORKLOG.md"],
    "minimal starter working-session must contain only the required core files",
  );
});

test("R6/AC2: validate-v1-profile passes the starter template and emits JSON", () => {
  assert.equal(exists("tools/validate-v1-profile.mjs"), true, "tools/validate-v1-profile.mjs must exist");
  const output = parseJsonRun([
    "tools/validate-v1-profile.mjs",
    "--root",
    "templates/v1-minimal",
    "--format",
    "json",
  ]);
  assert.equal(output.ok, true);
  assert.equal(output.profile, "v1-minimal");
  assert.ok(Array.isArray(output.checks), "validator JSON must include checks");
});

test("R6/AC3: validator fails clearly when a required minimal artifact is missing", () => {
  const fixture = tmpCopyTemplate();
  fs.rmSync(path.join(fixture, "working-session/MAILBOX.md"));
  const result = run(["tools/validate-v1-profile.mjs", "--root", fixture, "--format", "json"]);
  assert.notEqual(result.status, 0, `${result.stdout}${result.stderr}`);
  const output = JSON.parse(result.stdout || "{}");
  assert.equal(output.ok, false);
  assert.match(JSON.stringify(output), /MAILBOX\.md/);
});

test("R6/AC4: validator rejects historical PRD required-reading leakage in the minimal profile", () => {
  const fixture = tmpCopyTemplate();
  fs.appendFileSync(
    path.join(fixture, "README.md"),
    "\nRequired reading: docs/prds/PRD-001-maintainer-interaction-model.md\n",
  );
  const result = run(["tools/validate-v1-profile.mjs", "--root", fixture, "--format", "json"]);
  assert.notEqual(result.status, 0, `${result.stdout}${result.stderr}`);
  const output = JSON.parse(result.stdout || "{}");
  assert.equal(output.ok, false);
  assert.match(JSON.stringify(output), /historical PRD|required reading|PRD-001/i);
  assert.match(JSON.stringify(output), /README\.md|line|PRD-001/i, "failure must identify path, line, and matched PRD id");
});

test("R8: fresh adopter fixture contains no historical PRD documents but still validates", () => {
  const fixture = tmpCopyTemplate();
  const files = fs.readdirSync(fixture, { recursive: true }).map(String);
  assert.ok(!files.some((f) => /PRD-0[0-4][0-9].*\.md$/.test(f)), "starter must not copy historical PRD docs");
  const output = parseJsonRun(["tools/validate-v1-profile.mjs", "--root", fixture, "--format", "json"]);
  assert.equal(output.ok, true);
});

test("R7: README, CONFORMANCE, and ROADMAP distinguish core v1 from optional profiles", () => {
  const docs = `${read("README.md")}\n${read("CONFORMANCE.md")}\n${read("ROADMAP.md")}`;
  for (const needle of [
    /core v1|v1 core|Minimal Governance Profile/i,
    /optional profiles?/i,
    /historical|archive/i,
    /Tokenese[\s\S]{0,120}optional|optional[\s\S]{0,120}Tokenese/i,
    /heartbeat[\s\S]{0,120}optional|optional[\s\S]{0,120}heartbeat/i,
  ]) {
    assert.match(docs, needle);
  }
});

test("R9: version-bump guardrail is documented before final v1 status can land", () => {
  const prd = read("docs/prds/PRD-043-turnfile-v1-minimal-governance-profile.md");
  assert.match(prd, /Version-bump guardrail/i);
  assert.match(prd, /validate-v1-profile\.mjs/);
  assert.match(prd, /two agents?|2 agents?/i);
  assert.match(prd, /Maintainer.*ratif/i);
  assert.match(prd, /SPEC\.md[\s\S]*schemas\/v1[\s\S]*turnfile\.version[\s\S]*CHANGELOG\.md/i);
});

test("R10: fresh-context conformance probe exists and is recorded as evidence", () => {
  assert.equal(
    exists("docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md"),
    true,
    "docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md must define the five-question fresh-context probe",
  );
  const probe = read("docs/FRESH_CONTEXT_CONFORMANCE_PROBE.md");
  assert.match(probe, /SPEC\.md/);
  assert.match(probe, /DEFINITIONS\.md/);
  assert.match(probe, /MINIMUM_VIABLE_TURNFILE\.md/);
  assert.match(probe, /CONFORMANCE\.md/);
  const questionCount = (probe.match(/\?/g) || []).length;
  assert.ok(questionCount >= 5, "fresh-context probe must include at least five questions");
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-043");
  assert.match(entry?.implementation?.notes || "", /fresh-context conformance probe/i);
  const evidenceFiles = fs
    .readdirSync(path.join(root, "working-session/docs"))
    .filter((name) => /^v1-fresh-context-probe-\d{4}-\d{2}-\d{2}-.+\.md$/.test(name));
  assert.ok(
    evidenceFiles.length > 0,
    "at least one working-session/docs/v1-fresh-context-probe-<date>-<agent>.md evidence artifact must exist",
  );
});

test("R9/R10: validate-v1-release wrapper exposes the final evidence gate", () => {
  assert.equal(exists("tools/validate-v1-release.mjs"), true, "tools/validate-v1-release.mjs must exist");
  const result = run(["tools/validate-v1-release.mjs", "--format", "json"]);
  const output = JSON.parse(result.stdout || "{}");
  assert.ok(Array.isArray(output.checks), "release validator JSON must include checks");
  const check = output.checks.find((row) => row.id === "prd-043-r10-fresh-context-evidence");
  assert.ok(check, "release validator must expose the PRD-043 R10 fresh-context evidence gate");
  assert.match(check.detail || "", /v1-fresh-context-probe|found/i);
});

test("R9: validate-v1-release explains MSG-028 as Maintainer ratification blocker", () => {
  const result = run(["tools/validate-v1-release.mjs", "--format", "json"]);
  const output = JSON.parse(result.stdout || "{}");
  assert.ok(Array.isArray(output.checks), "release validator JSON must include checks");
  const mailboxEnd = output.checks.find((row) => row.id === "mailbox-session-end");
  assert.ok(mailboxEnd, "release validator must include mailbox session end check");
  if (!output.ok && /MSG-20260623-028/.test(mailboxEnd.detail || "")) {
    assert.match(
      mailboxEnd.detail,
      /Maintainer dogfood evidence ratification/i,
      "MSG-20260623-028 release-gate failure must identify the concrete ratification blocker",
    );
  }
});

test("A1 registry: PRD_STATUS records PRD-043 promoted ownership and expected implementation split", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-043");
  assert.ok(entry, "PRD-043 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-043-turnfile-v1-minimal-governance-profile.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.evals, "evals/prd-043.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
