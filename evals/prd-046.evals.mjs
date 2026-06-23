// PRD-046 RED evals - repo minimization archive.
// Eval author: Codex. Expected implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until examples/turnfile-development lands.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));

test("R1/R4: PRD defines minimization archive and preserves inception archive", () => {
  assert.equal(exists("docs/prds/PRD-046-repo-minimization-archive.md"), true);
  assert.equal(exists("examples/inception"), true, "examples/inception must remain present");
  const body = read("docs/prds/PRD-046-repo-minimization-archive.md");
  for (const needle of [
    /examples\/turnfile-development/i,
    /session[- ]12/i,
    /current at minimization time/i,
    /examples\/inception/i,
    /portable CLI is now tracked separately as PRD-048/i,
  ]) {
    assert.match(body, needle);
  }
});

test("R1/R2: turnfile-development archive README exists and explains the archive range", () => {
  assert.equal(
    exists("examples/turnfile-development/README.md"),
    true,
    "examples/turnfile-development/README.md must exist",
  );
  const readme = read("examples/turnfile-development/README.md");
  for (const needle of [
    /session[- ]12/i,
    /current at minimization time/i,
    /historical evidence|not required reading/i,
    /retired drafts|intermediate/i,
    /model ledger/i,
  ]) {
    assert.match(readme, needle);
  }
  assert.match(
    readme,
    /WORKLOG|commit\s+[0-9a-f]{40}/i,
    "archive README must include WORKLOG material or a git commit pointer to preserved history",
  );
  assert.match(
    readme,
    /MAILBOX|commit\s+[0-9a-f]{40}/i,
    "archive README must include MAILBOX material or a git commit pointer to preserved history",
  );
});

test("R3/R5: current public docs identify stable v1 surface and archive boundary", () => {
  const docs = `${read("README.md")}\n${read("docs/llms.txt")}\n${read("assistant-guide.txt")}`;
  for (const needle of [
    /SPEC\.md/,
    /DEFINITIONS\.md/,
    /CONFORMANCE\.md/,
    /MINIMUM_VIABLE_TURNFILE\.md/,
    /FRESH_CONTEXT_CONFORMANCE_PROBE\.md/,
    /schemas\/v1/i,
    /templates\/v1-minimal/i,
    /turnfile\.mjs/i,
    /examples\/turnfile-development/i,
    /historical|archive/i,
  ]) {
    assert.match(docs, needle);
  }
});

test("R6: PRD_STATUS records PRD-046 ownership split and RED eval package", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === "PRD-046");
  assert.ok(entry, "PRD-046 missing from PRD_STATUS registry");
  assert.equal(entry.path, "docs/prds/PRD-046-repo-minimization-archive.md");
  assert.equal(entry.shelf, "docs/prds");
  assert.equal(entry.state, "accepted");
  assert.equal(entry.implementation?.evals, "evals/prd-046.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
