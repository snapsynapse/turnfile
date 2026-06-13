// PRD-028 implementation evals — Tokenese dual-artifact sync + legibility.
// Proposer: Codex (eval author). Implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until implementation completes (PRD-006 A1, step 6).
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

function readPrd(id, fallbackPath) {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const entry = registry.prds.find((p) => p.id === id);
  return read(entry?.path || fallbackPath);
}

function sha256(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function writeFixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd028-tokenese-"));
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(dir, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
  }
  return dir;
}

function runPairValidator(files) {
  const tool = path.join(root, "tools/validate-tokenese-pairs.mjs");
  if (!fs.existsSync(tool)) {
    return {
      status: 1,
      output:
        "missing tools/validate-tokenese-pairs.mjs; cannot validate missing English source, tokenese-ahead, diverged, or Tokenese-only decision fixtures",
    };
  }
  const fixture = writeFixture(files);
  const result = spawnSync(process.execPath, [tool, "--root", fixture], {
    cwd: root,
    encoding: "utf8",
  });
  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  };
}

function tokeneseTwin({ state = "in-sync", english = "docs/example.md", tokenese = "docs/example.tk.md", body = "TK: request only" } = {}) {
  return [
    "---",
    "pair_id: REV-20990101-tokenese-fixture-001-abcd",
    `english_source: ${english}`,
    `tokenese_clone: ${tokenese}`,
    `source_hash: sha256:${sha256("English: request only\n")}`,
    `clone_hash: sha256:${sha256(`${body}\n`)}`,
    `sync_state: ${state}`,
    "last_sync_actor: codex",
    "last_sync_evidence: prd-028-eval-fixture",
    "---",
    "",
    body,
    "",
  ].join("\n");
}

test("R1: PRD-027 gate tracks whether PRD-028 implementation is done", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const prd027 = registry.prds.find((p) => p.id === "PRD-027");
  const prd028 = registry.prds.find((p) => p.id === "PRD-028");
  assert.ok(prd027, "PRD-027 missing from registry");
  assert.ok(prd028, "PRD-028 missing from registry");
  const blockers = prd027.blocking_items.join("\n");
  if (prd028.implementation?.state === "done") {
    assert.doesNotMatch(blockers, /PRD-028.*implementation done/i);
  } else {
    assert.match(blockers, /PRD-028.*implementation done/i);
  }
});

test("R2/R7/R11: PRD-028 documents stable pair metadata and sync states", () => {
  const s = readPrd("PRD-028", "working-session/docs/PRD-028-tokenese-dual-artifact-sync-and-maintainer-legibility-contract.md");
  for (const field of [
    "pair_id",
    "English source path",
    "Tokenese clone path",
    "source revision or content hash",
    "clone revision or content hash",
    "sync state",
    "last sync actor",
    "last sync evidence",
  ]) {
    assert.match(s, new RegExp(field, "i"), `missing pair metadata field: ${field}`);
  }
  for (const state of ["not-tokenized", "paired", "in-sync", "english-ahead", "tokenese-ahead", "diverged", "suspended"]) {
    assert.match(s, new RegExp(state), `missing sync state: ${state}`);
  }
});

test("R3/R4/R5/R6: PRD-028 preserves English authority, peer semantics, ownership, and legibility", () => {
  const s = readPrd("PRD-028", "working-session/docs/PRD-028-tokenese-dual-artifact-sync-and-maintainer-legibility-contract.md");
  assert.match(s, /English governs/i);
  assert.match(s, /request.*propose|propose.*request/is);
  assert.match(s, /may not command|may not .*order/i);
  assert.match(s, /Agents may not write peer-owned English or Tokenese files/i);
  assert.match(s, /Maintainer can inspect the current English state/i);
});

test("R9: promoted PRD-024 profile table includes Tokenese paired artifacts", () => {
  const s = read("docs/prds/PRD-024-human-legibility-invariant-and-encoding-profiles-contract.md");
  assert.match(s, /Tokenese paired artifacts/i);
  assert.match(s, /Always paired to a legible English source/i);
  assert.match(s, /never authoritative/i);
});

test("R11: Tokenese pair validator is registered", () => {
  assert.ok(exists("tools/validate-tokenese-pairs.mjs"), "missing tools/validate-tokenese-pairs.mjs");
});

test("R11: validator rejects a Tokenese twin whose English source is missing", () => {
  const result = runPairValidator({
    "docs/orphan.tk.md": tokeneseTwin({ english: "docs/missing.md", tokenese: "docs/orphan.tk.md" }),
  });
  assert.notEqual(result.status, 0, "validator accepted a Tokenese twin without a paired English source");
  assert.match(result.output, /missing|English source|paired English/i);
});

test("R11: validator rejects tokenese-ahead or diverged protocol-relevant pairs", () => {
  for (const state of ["tokenese-ahead", "diverged"]) {
    const result = runPairValidator({
      "docs/example.md": "English: request only\n",
      "docs/example.tk.md": tokeneseTwin({ state }),
    });
    assert.notEqual(result.status, 0, `validator accepted ${state} as usable`);
    assert.match(result.output, new RegExp(state), `diagnostic did not name ${state}`);
  }
});

test("R11: validator rejects Tokenese-only decision state", () => {
  const result = runPairValidator({
    "docs/decision.tk.md": tokeneseTwin({
      english: "docs/decision.md",
      tokenese: "docs/decision.tk.md",
      body: "TK: DECISION accepted by compressed-only lane",
    }),
  });
  assert.notEqual(result.status, 0, "validator accepted a Tokenese-only decision");
  assert.match(result.output, /decision|English|source/i);
});

test("R11: validator accepts a complete in-sync sidecar pair", () => {
  const result = runPairValidator({
    "docs/example.md": "English: request only\n",
    "docs/example.tk.md": tokeneseTwin(),
  });
  assert.equal(result.status, 0, result.output);
});

test("AC11: registry records this eval suite for PRD-028", () => {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  const prd028 = registry.prds.find((p) => p.id === "PRD-028");
  assert.equal(prd028.implementation?.evals, "evals/prd-028.evals.mjs");
  assert.equal(prd028.implementation?.eval_author, "codex");
  assert.equal(prd028.implementation?.implementer, "claude");
  assert.equal(prd028.implementation?.reviewer, "codex");
});
