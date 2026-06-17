// PRD-036 implementation evals - PRD Eval Runner Contract.
// Proposer/eval-author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until the aggregate PRD eval runner is portable, dry-run
// introspectable, and documented separately from repo readiness validators.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RUNNER = path.join(root, "tools/run-prd-evals.mjs");

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd036-${name}-`));
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function pkg() {
  return JSON.parse(read("package.json"));
}

function registryEntry(id) {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  return registry.prds.find((p) => p.id === id);
}

function runNode(args, cwd = root) {
  return spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
}

function runNpm(args, cwd = root) {
  return spawnSync("npm", args, { cwd, encoding: "utf8" });
}

function assertRunnerExists() {
  assert.equal(fs.existsSync(RUNNER), true, "tools/run-prd-evals.mjs must exist");
}

test("R1-R5: PRD-036 defines aggregate runner, taxonomy, CI policy, PRD-006 alignment, and regression coverage", () => {
  const s = read("working-session/docs/PRD-036-prd-eval-runner-contract.md");
  for (const needle of [
    /npm run evals:prd/,
    /every file matching `evals\/\*\.evals\.mjs`/,
    /fail if no PRD eval files are found/,
    /Repo readiness validators/,
    /PRD implementation evals/,
    /Focused PRD evals/,
    /CI runs PRD evals by default|CI intentionally excludes PRD evals|separate steps/i,
    /dry-run mode|fixture/i,
  ]) {
    assert.match(s, needle);
  }
});

test("AC1/R1: package script uses the portable aggregate PRD eval runner, not a directory test target", () => {
  const script = pkg().scripts?.["evals:prd"];
  assert.ok(script, "package.json must define evals:prd");
  assert.doesNotMatch(script, /\bevals\/\s*$/, "evals:prd must not invoke node --test on the evals directory");
  assert.match(script, /run-prd-evals\.mjs/, "evals:prd should invoke the portable PRD eval wrapper");
});

test("AC1/R5: aggregate runner dry-run resolves all current PRD eval files without recursion", () => {
  const result = runNpm(["run", "-s", "evals:prd", "--", "--dry-run", "--format", "json"]);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(result.stdout, /\{[\s\S]*"files"/, "dry-run must emit JSON with a files array");
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.ok, true);
  assert.ok(Array.isArray(parsed.files), "dry-run JSON must include files array");
  for (const file of [
    "evals/prd-032.evals.mjs",
    "evals/prd-033.evals.mjs",
    "evals/prd-034.evals.mjs",
    "evals/prd-035.evals.mjs",
    "evals/prd-036.evals.mjs",
  ]) {
    assert.ok(parsed.files.includes(file), `dry-run missing ${file}`);
  }
});

test("AC2/R1: aggregate runner fails clearly when no eval files exist", () => {
  assertRunnerExists();
  const dir = tmp("empty");
  fs.mkdirSync(path.join(dir, "evals"), { recursive: true });
  const result = runNode([RUNNER, "--root", dir, "--dry-run", "--format", "json"]);
  assert.notEqual(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /no PRD eval files|no eval files|none found/i);
});

test("AC3/R2: validation docs distinguish repo readiness, PRD implementation evals, and focused evals", () => {
  const docs = `${read("README.md")}\n${read("docs/VALIDATION.md")}`;
  assert.match(docs, /repo readiness validators|readiness validators/i);
  assert.match(docs, /PRD implementation evals|PRD evals/i);
  assert.match(docs, /focused PRD evals|focused eval/i);
  assert.match(docs, /npm run evals:prd/);
  assert.match(docs, /node --test evals\/prd-032\.evals\.mjs/);
});

test("AC4: PRD-006 references the actual canonical aggregate command", () => {
  const prd006 = read("docs/prds/PRD-006-session-promotion-pipeline.md");
  const script = pkg().scripts?.["evals:prd"];
  assert.match(prd006, /npm run evals:prd/);
  assert.ok(script?.includes("run-prd-evals.mjs"), "evals:prd must identify the implemented runner");
});

test("AC5/R3: CI policy for PRD evals is explicit", () => {
  const workflow = read(".github/workflows/validate.yml");
  const validationDocs = `${read("README.md")}\n${read("docs/VALIDATION.md")}\n${workflow}`;
  assert.match(validationDocs, /evals:prd|PRD evals/i, "CI or docs must explicitly name PRD eval policy");
  assert.match(
    validationDocs,
    /CI[\s\S]{0,240}(runs|excludes|separate step|release gate)|evals:prd[\s\S]{0,240}(CI|release gate|validate)/i,
    "PRD eval CI policy must be explicit, not implicit",
  );
});

test("AC6: focused PRD-032 and PRD-033 eval commands still pass", () => {
  const result = runNode(["--test", "evals/prd-032.evals.mjs", "evals/prd-033.evals.mjs"]);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test("AC registry: PRD_STATUS records PRD-036 eval authorship and expected A1 ownership", () => {
  const entry = registryEntry("PRD-036");
  assert.ok(entry, "PRD-036 missing from registry");
  assert.equal(entry.implementation?.evals, "evals/prd-036.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
