// PRD-039 implementation evals — Perplexity Computer Onboarding Deltas.
// Proposer/eval-author: Claude. Implementer/executor: Codex. Reviewer: Gemini.
// EXPECTED TO FAIL on draft acceptance until:
//   (1) PRD-039 is promoted to docs/prds/
//   (2) ONBOARDING_TEST_SUITE.md has OT-009/010/011 candidate-agnostic addenda
//   (3) Perplexity proposal packet artifact exists with R1 deltas declared
//   (4) Per-rung evidence directory exists for Perplexity candidate runs
//
// Pinned contract surfaces (PRD-039):
//   - R1 (delta over PRD-015 R1): proposal packet declares instruction-load mechanism,
//     citation surface, tool surface.
//   - R2: citation/source-URL discipline contract.
//   - R3 #1/#2/#3: OT-009 instruction-load / OT-010 citation / OT-011 no-hidden-authority.
//   - R4: candidate-agnostic generalization of OT-009/010/011.
//   - R5: four-rung ladder OBSERVER -> PROVISIONAL CHECKER -> PROVISIONAL CONSTRAINED WRITER -> FULL-ACTIVE.
//   - R6 #3: Perplexity not in PRD_STATUS.policy.required_reviewers absent explicit Maintainer add.

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const PRD_DRAFT = path.join(root, "working-session/docs/PRD-039-perplexity-onboarding-deltas.md");
const PRD_PROMOTED = path.join(root, "docs/prds/PRD-039-perplexity-onboarding-deltas.md");
const SUITE = path.join(root, "working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md");
const PRD_STATUS = path.join(root, "working-session/docs/PRD_STATUS.json");
const PRD_015 = path.join(root, "docs/prds/PRD-015-agent-onboarding-vetting-contract.md");

function readIfExists(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

// ===== R0: PRD-039 must exist as a draft or promoted PRD =====

test("R0: PRD-039 draft (working-session/docs) or promoted (docs/prds) exists", () => {
  const draft = readIfExists(PRD_DRAFT);
  const promoted = readIfExists(PRD_PROMOTED);
  assert.ok(draft || promoted, "PRD-039 not found in working-session/docs or docs/prds");
});

test("R0: PRD-039 references PRD-015 as substrate (specialization, not replacement)", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text, "PRD-039 missing");
  assert.match(text, /PRD-015/, "PRD-039 must reference PRD-015 substrate");
  assert.match(text, /specialization|substrate|delta/i, "PRD-039 must declare itself a specialization/delta of PRD-015");
  // Anti-match: PRD-039 must not actively replace PRD-015 (Non-goals stating "Replacing PRD-015" as a non-goal is OK).
  assert.doesNotMatch(text, /PRD-039 replaces PRD-015|This PRD supersedes PRD-015/i, "PRD-039 must not declare it replaces PRD-015");
});

// ===== R1: proposal packet deltas =====

test("R1: PRD-039 R1 names instruction-load mechanism + citation surface + tool surface deltas", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text, "PRD-039 missing");
  assert.match(text, /instruction-load mechanism/i);
  assert.match(text, /citation surface/i);
  assert.match(text, /tool surface/i);
});

// ===== R2: citation/source-URL discipline =====

test("R2: PRD-039 R2 names citation discipline as contract obligation, not quality bar", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /citation\/source URL|source[- ]URL/i);
  assert.match(text, /no-external-source/);
  assert.match(text, /contract obligation/i);
});

test("R2: PRD-039 R2 confidence field is tied to source quality, not model self-report", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /confidence/i);
  assert.match(text, /NOT to model self-report|not to model self[- ]report|source quality/i);
});

// ===== R3: OT-009 / OT-010 / OT-011 =====

test("R3 #1: OT-009 instruction-load evidence scenario defined in PRD-039", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-009/);
  assert.match(text, /instruction-load/i);
});

test("R3 #2: OT-010 citation discipline scenario defined in PRD-039", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-010/);
  assert.match(text, /citation discipline/i);
});

test("R3 #3: OT-011 no-hidden-authority scenario defined in PRD-039", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OT-011/);
  assert.match(text, /no-hidden-authority|decision-bound/i);
});

test("R3: OT-009/010/011 added to ONBOARDING_TEST_SUITE.md as candidate-agnostic addenda (RED until added)", () => {
  const text = readIfExists(SUITE);
  assert.ok(text, "ONBOARDING_TEST_SUITE.md missing");
  assert.match(text, /OT-009/, "OT-009 not yet referenced in test suite");
  assert.match(text, /OT-010/, "OT-010 not yet referenced in test suite");
  assert.match(text, /OT-011/, "OT-011 not yet referenced in test suite");
});

// ===== R5: four-rung ladder =====

test("R5: PRD-039 names four-rung ladder OBSERVER -> PROVISIONAL CHECKER -> PROVISIONAL CONSTRAINED WRITER -> FULL-ACTIVE", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /OBSERVER/);
  assert.match(text, /PROVISIONAL CHECKER/);
  assert.match(text, /PROVISIONAL CONSTRAINED WRITER/);
  assert.match(text, /FULL-ACTIVE/);
});

test("R5 #2: PROVISIONAL CHECKER has no governance-write authority + no PRD authorship", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /NO governance-write authority/i);
  assert.match(text, /NO PRD authorship/i);
});

test("R5 #3: PROVISIONAL CONSTRAINED WRITER sandboxed to own-paths set, not shared control-plane", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /sandboxed own-paths|sandboxed.*paths/i);
  assert.match(text, /may NOT write to MAILBOX/i);
});

// ===== R6: required-reviewers boundary =====

test("R6 #3: PRD_STATUS.policy.required_reviewers does NOT include perplexity (until separate Maintainer decision)", () => {
  const text = readIfExists(PRD_STATUS);
  assert.ok(text, "PRD_STATUS.json missing");
  const json = JSON.parse(text);
  const reviewers = json?.policy?.required_reviewers ?? [];
  assert.ok(
    !reviewers.includes("perplexity"),
    `Perplexity unexpectedly in required_reviewers: ${JSON.stringify(reviewers)}`,
  );
});

// ===== R8: audit trail =====

test("R8: PRD-039 R8 requires citation-discipline violations recorded as evidence artifacts, not silent", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  assert.match(text, /Citation-discipline.*violations.*evidence artifacts|R2 violations recorded as evidence/i);
  assert.match(text, /not silent/i);
});

// ===== Cross-reference: PRD-015 substrate intact =====

test("PRD-015 (substrate) remains promoted; PRD-039 does not rewrite it", () => {
  const prd015 = readIfExists(PRD_015);
  assert.ok(prd015, "PRD-015 substrate missing");
  assert.match(prd015, /Status:\s*Actioned/);
});

// ===== Acceptance criteria (PRD-039 self-consistency) =====

test("Acceptance: PRD-039 lists all six AC items including eval-suite assignment", () => {
  const text = readIfExists(PRD_PROMOTED) ?? readIfExists(PRD_DRAFT);
  assert.ok(text);
  const acSection = text.split(/^##\s+Acceptance criteria/m)[1] ?? "";
  assert.ok(acSection.length > 100, "Acceptance section too short or missing");
  for (const n of ["1.", "2.", "3.", "4.", "5.", "6."]) {
    assert.match(acSection, new RegExp(`^${n.replace(".", "\\.")}`, "m"), `AC item ${n} missing`);
  }
});
