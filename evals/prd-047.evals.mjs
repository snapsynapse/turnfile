// PRD-047 cross-repo v1 validation evidence and release-state regression checks.
// Eval author: Codex. Expected operator/implementer: Claude. Reviewer: Codex.
// The suite became a permanent regression gate after v1.0.0 ratification.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const listEvidence = (repo) => {
  const dir = path.join(root, "working-session/docs");
  return fs
    .readdirSync(dir)
    .filter((name) => new RegExp(`^v1-cross-repo-test-${repo}-\\d{4}-\\d{2}-\\d{2}\\.md$`).test(name))
    .map((name) => `working-session/docs/${name}`)
    .sort();
};

function assertEvidenceShape(rel, repoName, repoPathPattern) {
  const text = read(rel);
  assert.match(text, repoPathPattern, `${rel} must name the target repo path`);
  assert.match(text, /participant set|participants|roles/i, `${rel} must record participants/roles`);
  assert.match(text, /turnfile\.mjs|templates\/v1-minimal|handshake-sign/i, `${rel} must identify the v1 surface used`);
  assert.match(text, /resolved item|item resolved|resolved work|open item/i, `${rel} must identify real work resolved`);
  assert.match(text, /validation|PASS|ok:true|ok: true/i, `${rel} must include validation output`);
  assert.match(text, /TURNFILE\.yaml/i, `${rel} must point to target TURNFILE.yaml`);
  assert.match(text, /MAILBOX\.md/i, `${rel} must point to target MAILBOX.md`);
  assert.match(text, /WORKLOG\.md/i, `${rel} must point to target WORKLOG.md`);
  assert.match(text, /privacy|not copied|redacted/i, `${rel} must explain privacy/non-copying boundary`);
  assert.match(text, new RegExp(repoName, "i"), `${rel} must identify ${repoName}`);
}

test("R1/R5: promoted PRD and Tokenese/AIDR evidence files exist", () => {
  assert.equal(exists("docs/prds/PRD-047-cross-repo-v1-validation-tests.md"), true);
  assert.ok(listEvidence("tokenese").length >= 1, "missing Tokenese evidence file");
  assert.ok(listEvidence("aidr").length >= 1, "missing AIDR evidence file");
});

test("R2/R3/R4/R5: Tokenese evidence proves real in-repo v1 session", () => {
  const [rel] = listEvidence("tokenese").slice(-1);
  assert.ok(rel, "missing Tokenese evidence file");
  assertEvidenceShape(rel, "tokenese", /~\/Git\/tokenese|\/Git\/tokenese/i);
});

test("R2/R3/R4/R5: AIDR evidence proves real in-repo v1 session", () => {
  const [rel] = listEvidence("aidr").slice(-1);
  assert.ok(rel, "missing AIDR evidence file");
  assertEvidenceShape(rel, "AIDR", /~\/Git\/aidr|\/Git\/aidr/i);
});

test("R1/R6: evidence records different participant sets or roles across runs", () => {
  const [tokeneseRel] = listEvidence("tokenese").slice(-1);
  const [aidrRel] = listEvidence("aidr").slice(-1);
  assert.ok(tokeneseRel && aidrRel, "missing evidence files");
  const tokenese = read(tokeneseRel);
  const aidr = read(aidrRel);
  const roleLine = (text) =>
    text
      .split("\n")
      .find((line) => /participant set|participants|roles/i.test(line)) || "";
  assert.notEqual(
    roleLine(tokenese).trim(),
    roleLine(aidr).trim(),
    "Tokenese and AIDR evidence must not report identical participant/role lines",
  );
});

test("R6: reviewed evidence is Maintainer-ratified and its closure is recorded", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-047");
  assert.ok(entry, "PRD-047 missing from PRD_STATUS registry");
  assert.deepEqual(entry.blocking_items, [], "ratified PRD-047 must have no remaining blockers");
  assert.equal(entry.acceptance?.maintainer?.status, "accepted");

  const prd = read("docs/prds/PRD-047-cross-repo-v1-validation-tests.md");
  assert.match(
    prd,
    /Maintainer ratification:\s*Ratified by Sam Rogers \(Maintainer\) on 2026-07-02/i,
    "promoted PRD must preserve the Maintainer ratification record",
  );

  const mailbox = read("working-session/MAILBOX.md");
  assert.match(
    mailbox,
    /\| MSG-20260623-028 \| 2026-07-02 \| Codex -> Claude \| closed \|[^\n]*Maintainer ratified the dogfood evidence outcome 2026-07-02\./i,
    "MSG-20260623-028 must remain in the closed summary with ratification evidence",
  );
});

test("Registry: PRD_STATUS records PRD-047 ownership and promoted implementation", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-047");
  assert.ok(entry, "PRD-047 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-047-cross-repo-v1-validation-tests.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.eligible_for_docs_prds, true);
  assert.equal(entry.implementation?.state, "done");
  assert.equal(entry.implementation?.evals, "evals/prd-047.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
