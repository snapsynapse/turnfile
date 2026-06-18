// PRD-035 implementation evals - Tokenese Integration and Upstream Result Sync Contract.
// Proposer/eval-author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until TKAB JSON artifacts are validator-covered, a fresh
// Tokenese observed-state/result-package artifact exists, and calibration gates are recorded.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-tkab-results.mjs");

const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const assertFile = (p) => assert.equal(fs.existsSync(path.join(root, p)), true, `${p} must exist`);

function tmp(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `prd035-${name}-`));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function registryEntry(id) {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  return registry.prds.find((p) => p.id === id);
}

function turnfileTask(id) {
  const s = read("working-session/TURNFILE.yaml");
  const match = s.match(new RegExp(`    ${id}:\\n([\\s\\S]*?)(?=\\n    [a-zA-Z0-9_-]+:|\\n\\nlocks:)`));
  if (!match) return null;
  return match[1];
}

function basePair(overrides = {}) {
  return {
    source_id: "TKAB-WX-v03",
    clone_id: "TKAB-WX-v03.codex.claude.fixture1",
    pair_id: "TKAB-WX-v03.codex.fixture1",
    arm: "W4",
    direction: "codex->claude",
    author: "codex",
    artifact_type: "structured-code-review-finding",
    predicted_outcome: "win",
    source_text: "English source text.",
    clone_text: "^grammar:v0.3\nsay fixture status:ok ev:obs",
    ...overrides,
  };
}

function baseResult(overrides = {}) {
  return {
    schema_version: "tkab-check-1.1",
    source_id: "TKAB-WX-v03",
    clone_id: "TKAB-WX-v03.codex.claude.fixture1",
    pair_id: "TKAB-WX-v03.codex.fixture1",
    direction: "codex->claude",
    author: "codex",
    artifact_type: "structured-code-review-finding",
    scorer: "perplexity-deterministic-checker",
    arm: "W4",
    predicted_outcome: "win",
    conformance_level: "L3",
    token_counts: {
      source: { o200k: 10, anthropic: 12 },
      clone: { o200k: 8, anthropic: 9 },
      savings: { o200k_ratio: 0.8, anthropic_ratio: 0.75 },
    },
    repair_events: [],
    misparse_family: { by_family: { binding: 0, scope: 0, sense: 0, triangulation: 0 }, hits: [] },
    outcome: "indeterminate",
    grammar_version: "v0.3",
    frameset_validation: {
      schema_version: "tokenese-framesets-0.1",
      status: "experimental-report-only",
      checked_statement_count: 1,
      checked_ops: ["say"],
      issues: [],
    },
    provenance: {
      checker_version: "tkab-check-1.1",
      tkab_schema_version: "tkab-check-1.1",
      grammar_version_supported: "v0.3",
      grammar_version_detected: "v0.3",
    },
    source_text: "English source text.",
    clone_text: "^grammar:v0.3\nsay fixture status:ok ev:obs",
    ...overrides,
  };
}

function tkabFixture({ pair = basePair(), result = baseResult() } = {}) {
  const dir = tmp("tkab");
  writeJson(path.join(dir, "working-session/tokenese-pairs/TKAB-WX-v03.codex.claude.fixture1.pair.json"), pair);
  writeJson(path.join(dir, "working-session/tokenese-pairs/TKAB-WX-v03.codex.claude.fixture1.result.json"), result);
  return dir;
}

function runValidator(args, cwd = root) {
  assert.equal(fs.existsSync(TOOL), true, "tools/validate-tkab-results.mjs must exist");
  return spawnSync(process.execPath, [TOOL, ...args], { cwd, encoding: "utf8" });
}

test("R1-R6: PRD-035 pins observation, TKAB validation, result packaging, calibration, and upstream boundaries", () => {
  const s = read("docs/prds/PRD-035-tokenese-integration-and-upstream-result-sync-contract.md");
  for (const needle of [
    /tokenese-version-observation\.md/,
    /validate-tkab-results\.mjs/,
    /working-session\/tokenese-pairs\/\*\.pair\.json/,
    /frameset_validation/,
    /report-only/,
    /result package for Tokenese upstream review/,
    /tk-calibration-audit/,
    /No Tier-B Tokenese lane may be opened/,
    /not edit Tokenese files from the Turnfile repo/i,
    /new, separate validator/i,
    /does not extend, replace, or change `tools\/validate-tokenese-pairs\.mjs`/,
    /derived from `working-session\/docs\/tk-ab-run-results\.md`/,
    /must not re-key token counts|must not re-key/i,
    /single calibration authority/i,
    /PRD-034 owns what Turnfile public and agent-facing surfaces may assert/i,
  ]) {
    assert.match(s, needle);
  }
});

test("C1-C4: PRD-035 applies Claude counter boundaries", () => {
  const s = read("docs/prds/PRD-035-tokenese-integration-and-upstream-result-sync-contract.md");
  assert.match(s, /derived from `working-session\/docs\/tk-ab-run-results\.md`[\s\S]*`working-session\/tokenese-pairs\/\*\.result\.json`/);
  assert.match(s, /must not re-key token counts, ratios, outcome values, or version tags/i);
  assert.match(s, /working-session\/docs\/tk-calibration-audit\.md` as the single calibration authority/i);
  assert.match(s, /PRD-035 owns only the packaging and adoption-gate use/i);
  assert.match(s, /new, separate validator for TKAB JSON artifacts/i);
  assert.match(s, /does not extend, replace, or change `tools\/validate-tokenese-pairs\.mjs`/);
  assert.match(s, /PRD-035 produces the observed fact; PRD-034 enforces the public-surface claim/i);
});

test("AC1: Tokenese observed-state artifact records current version, previous baseline, grammar, TKAB schema, report-only framesets, and GuideCheck conflicts", () => {
  assertFile("working-session/docs/tokenese-version-observation.md");
  const s = read("working-session/docs/tokenese-version-observation.md");
  assert.match(s, /\/Users\/snap\/Git\/tokenese|~\/Git\/tokenese/);
  assert.match(s, /current(ly)? observed|observed Tokenese version|Tokenese version/i);
  assert.match(s, /previous baseline|draft-time|supersedes|v0\.3\.2|0\.3\.2/i);
  assert.match(s, /grammar version|grammar[^.\n]*v[0-9]+\.[0-9]+/i);
  assert.match(s, /tkab-check-[0-9.]+|TKAB [0-9.]+|TKAB schema/i);
  assert.match(s, /frameset[^.\n]*report-only|report-only[^.\n]*frameset/i);
  assert.match(s, /GuideCheck[\s\S]*conflict|conflict[\s\S]*GuideCheck/i);
  assert.match(s, /git revision|commit|HEAD|tag/i);
  assert.match(s, /observational|non-authoritative/i);
});

test("AC2-AC4: TKAB validator rejects mismatched IDs, missing frameset_validation, and text drift", () => {
  const mismatch = tkabFixture({ result: baseResult({ source_id: "TKAB-OTHER" }) });
  const mismatchResult = runValidator(["--root", mismatch, "--format", "json"]);
  assert.notEqual(mismatchResult.status, 0, `${mismatchResult.stdout}${mismatchResult.stderr}`);
  assert.match(`${mismatchResult.stdout}${mismatchResult.stderr}`, /source_id|mismatch/i);

  const noFrameset = tkabFixture({ result: baseResult({ frameset_validation: undefined }) });
  const noFramesetResult = runValidator(["--root", noFrameset, "--format", "json"]);
  assert.notEqual(noFramesetResult.status, 0, `${noFramesetResult.stdout}${noFramesetResult.stderr}`);
  assert.match(`${noFramesetResult.stdout}${noFramesetResult.stderr}`, /frameset_validation|report-only/i);

  const drift = tkabFixture({ result: baseResult({ source_text: "Mutated source text." }) });
  const driftResult = runValidator(["--root", drift, "--format", "json"]);
  assert.notEqual(driftResult.status, 0, `${driftResult.stdout}${driftResult.stderr}`);
  assert.match(`${driftResult.stdout}${driftResult.stderr}`, /source_text|clone_text|verbatim/i);
});

test("R2: TKAB validator accepts the current active pair/result artifacts", () => {
  const result = runValidator(["--root", root, "--format", "json"]);
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(result.stdout, /tokenese-pairs|TKAB|checked/i);
  assert.doesNotMatch(result.stdout, /Tokenese twins checked:\s*0/i, "TKAB JSON artifacts must be covered, not ignored by the PRD-028 twin scanner");
});

test("AC5: result publication package summarizes the session-17 pilot without claiming it satisfies Tokenese N2", () => {
  assertFile("working-session/docs/tokenese-pilot-result-package.md");
  const s = read("working-session/docs/tokenese-pilot-result-package.md");
  for (const id of ["W1", "L1", "W2", "W3", "W4", "W5", "L2", "L3"]) {
    assert.match(s, new RegExp(`\\b${id}\\b`), `result package missing ${id}`);
  }
  assert.match(s, /grammar version|checker version|schema version|tokenizer/i);
  assert.match(s, /misparse|repair/i);
  assert.match(s, /compression|ratio/i);
  assert.match(s, /pilot evidence/i);
  assert.match(s, /does not satisfy|not satisfy|not the full.*N2/i);
  assert.doesNotMatch(s, /satisfies Tokenese N2|N2 validating experiment complete/i);
  assert.match(s, /derived|generated/i);
  assert.doesNotMatch(s, /manual re-key|hand-keyed/i);
});

test("AC6/R4/R5: tk-calibration-audit is complete before any Tier-B adoption recommendation", () => {
  const task = turnfileTask("tk-calibration-audit");
  assert.ok(task, "tk-calibration-audit task missing from TURNFILE.yaml");
  assert.match(task, /status:\s+"done"/, "tk-calibration-audit must be complete before Tier-B recommendation");
  const worklog = read("working-session/WORKLOG.md");
  assert.match(worklog, /tk-calibration-audit[\s\S]*(complete|done|passed)/i);
  if (/Tier-B[\s\S]{0,220}(AUTHORIZED|authorized|recommend|open(ed)?)/i.test(worklog)) {
    assert.match(
      worklog,
      /Tier-B[\s\S]{0,260}(AUTHORIZED|authorized)[\s\S]{0,260}(tk-calibration-audit|calibration)[\s\S]{0,160}(complete|peer-confirmed|satisfied)/i,
      "Tier-B authorization must cite completed calibration evidence",
    );
  }
});

test("AC7/R6: Turnfile public surfaces avoid unverified Tokenese GuideCheck Level 4 claims", () => {
  const surfaces = `${read("README.md")}\n${read("docs/index.html")}\n${read("docs/llms.txt")}\n${read("assistant-guide.txt")}`;
  assert.doesNotMatch(surfaces, /Tokenese[\s\S]{0,160}GuideCheck[\s\S]{0,80}Level 4/i);
  assert.doesNotMatch(surfaces, /GuideCheck[\s\S]{0,80}Level 4[\s\S]{0,160}Tokenese/i);
});

test("AC registry: PRD_STATUS records PRD-035 eval authorship and expected A1 ownership", () => {
  const entry = registryEntry("PRD-035");
  assert.ok(entry, "PRD-035 missing from registry");
  assert.equal(entry.implementation?.evals, "evals/prd-035.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
