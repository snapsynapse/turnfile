// PRD-042 implementation evals — Qwen Onboarding Deltas.
// Proposer/eval-author: Gemini. Implementer/executor: Codex. Reviewer: Claude.
// EXPECTED TO FAIL on draft acceptance until:
//   (1) PRD-042 is promoted to docs/prds/
//   (2) Qwen proposal packet artifact exists with R1 deltas declared
//   (3) Per-rung evidence directory exists for Qwen candidate runs
//
// Pinned contract surfaces (PRD-042):
//   - R1 (delta over PRD-015 R1): proposal packet declares local MLX config, instruction-load mechanism.
//   - R2: local sandbox and path-hygiene discipline.
//   - R3 #1/#2/#3: OT-012 instruction-load / OT-013 local sandbox / OT-014 escalation drill.
//   - R4: candidate-agnostic generalization of OT-012/013/014.
//   - R5: four-rung ladder OBSERVER -> PROVISIONAL CHECKER -> PROVISIONAL CONSTRAINED WRITER -> FULL-ACTIVE.
//   - R6 #2: Qwen not in PRD_STATUS.policy.required_reviewers absent explicit Maintainer add.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const PRD_DRAFT = path.join(root, "working-session/docs/PRD-042-qwen-onboarding-deltas.md");
const PRD_PROMOTED = path.join(root, "docs/prds/PRD-042-qwen-onboarding-deltas.md");
const SUITE = path.join(root, "working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md");
const PRD_STATUS = path.join(root, "working-session/docs/PRD_STATUS.json");
const PRD_015 = path.join(root, "docs/prds/PRD-015-agent-onboarding-vetting-contract.md");

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

// ===== R0: PRD-042 must exist as a draft or promoted PRD =====

test("R0: PRD-042 draft (working-session/docs) or promoted (docs/prds) exists", () => {
  const draft = readIfExists(PRD_DRAFT);
  const promoted = readIfExists(PRD_PROMOTED);
  assert.ok(draft || promoted, "PRD-042 not found in working-session/docs or docs/prds");
});

test("R0: PRD-042 references PRD-015 as substrate (specialization, not replacement)", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text, "PRD-042 missing");
  assert.match(text, /PRD-015/, "PRD-042 must reference PRD-015 substrate");
  assert.match(text, /specialization|substrate|delta/i, "PRD-042 must declare itself a specialization/delta of PRD-015");
  assert.doesNotMatch(text, /PRD-042 replaces PRD-015|This PRD supersedes PRD-015/i, "PRD-042 must not declare it replaces PRD-015");
});

// ===== R1: proposal packet deltas =====

test("R1: PRD-042 R1 names local MLX config + instruction-load mechanism deltas", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text, "PRD-042 missing");
  assert.match(text, /local MLX/i);
  assert.match(text, /instruction-load mechanism/i);
});

// ===== R2: sandbox and path-hygiene discipline =====

test("R2: PRD-042 R2 names local sandbox and path-hygiene discipline", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /local sandbox/i);
  assert.match(text, /absolute host/i);
  assert.match(text, /confidence/i);
});

// ===== R3: OT-012 / OT-013 / OT-014 =====

test("R3 #1: OT-012 local instruction-load check defined in PRD-042", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-012/);
  assert.match(text, /local instruction-load/i);
});

test("R3 #2: OT-013 local sandbox check defined in PRD-042", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-013/);
  assert.match(text, /local sandbox check/i);
});

test("R3 #3: OT-014 local escalation drill defined in PRD-042", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-014/);
  assert.match(text, /escalation drill/i);
});

test("R3: OT-012/013/014 added to ONBOARDING_TEST_SUITE.md as candidate-agnostic addenda (RED until added)", () => {
  const text = readIfExists(SUITE);
  assert.ok(text, "ONBOARDING_TEST_SUITE.md missing");
  assert.match(text, /OT-012/, "OT-012 not yet referenced in test suite");
  assert.match(text, /OT-013/, "OT-013 not yet referenced in test suite");
  assert.match(text, /OT-014/, "OT-014 not yet referenced in test suite");
});

// ===== R5: four-rung ladder =====

test("R5: PRD-042 names four-rung ladder OBSERVER -> PROVISIONAL CHECKER -> PROVISIONAL CONSTRAINED WRITER -> FULL-ACTIVE", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OBSERVER/);
  assert.match(text, /PROVISIONAL CHECKER/);
  assert.match(text, /PROVISIONAL CONSTRAINED WRITER/);
  assert.match(text, /FULL-ACTIVE/);
});

// ===== R6: required-reviewers boundary =====

test("R6 #2: PRD_STATUS.policy.required_reviewers does NOT include qwen (until separate Maintainer decision)", () => {
  const text = readIfExists(PRD_STATUS);
  assert.ok(text, "PRD_STATUS.json missing");
  const json = JSON.parse(text);
  const reviewers = json?.policy?.required_reviewers ?? [];
  assert.ok(
    !reviewers.includes("qwen"),
    `Qwen unexpectedly in required_reviewers: ${JSON.stringify(reviewers)}`,
  );
});

// ===== Cross-reference: PRD-015 substrate intact =====

test("PRD-015 (substrate) remains promoted; PRD-042 does not rewrite it", () => {
  const prd015 = readIfExists(PRD_015);
  assert.ok(prd015, "PRD-015 substrate missing");
  assert.match(prd015, /Status:\s*Actioned/);
});

// ===== Acceptance criteria =====

test("Acceptance: PRD-042 lists all six AC items including eval-suite assignment", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  const acSection = text.split(/^##\s+Acceptance criteria/m)[1] ?? "";
  assert.ok(acSection.length > 100, "Acceptance section too short or missing");
  for (const n of ["1.", "2.", "3.", "4.", "5.", "6."]) {
    assert.match(acSection, new RegExp(`^${n.replace(".", "\\.")}`, "m"), `AC item ${n} missing`);
  }
});

// ===== Codex Feedback Additions =====

test("R1: PRD-042 R1 requires Phase 0 Runtime-Readiness Preflight", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /Runtime-Readiness Preflight/i);
  assert.match(text, /Phase 0/);
});

test("R2: PRD-042 R2 requires Secret Redaction", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /Secret Redaction/i);
});

test("R2: PRD-042 R2 defines VaultPrime and LocalBrain boundaries", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /VaultPrime\/LocalBrain/i);
  assert.match(text, /context boundar/i);
});

test("R3: PRD-042 R3 requires negative-control scenario for escalation drill", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /Negative-Control Scenario/i);
});

