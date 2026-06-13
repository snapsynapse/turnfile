// PRD-021 implementation evals — conflict loop bound + selective-unlock gradient
// Proposer: Claude (eval author). Implementer: Codex. Reviewer: Claude.
// These evals verify R5 documentation propagation and acceptance criteria.
// They are EXPECTED TO FAIL until implementation completes (8-step loop, step 6).
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("R5.1: CONFLICT_RESOLUTION.md Level 2 references rebuttal_rounds", () => {
  assert.match(read("docs/CONFLICT_RESOLUTION.md"), /rebuttal_rounds/);
});

test("R5.1: CONFLICT_RESOLUTION.md routes bound exhaustion to Level 4, Level 3 explicit-only", () => {
  const s = read("docs/CONFLICT_RESOLUTION.md");
  assert.match(s, /Level 4/);
  assert.match(s, /exhaust/i);
  assert.match(s, /explicit Maintainer instruction/i);
});

test("R5.1: NO-NEW-OBJECTION convergence marker documented with staleness rule", () => {
  const s = read("docs/CONFLICT_RESOLUTION.md");
  assert.match(s, /NO-NEW-OBJECTION/);
  assert.match(s, /stale/i);
});

test("R1.1: TURNFILE.yaml carries coordination.conflict.rebuttal_rounds", () => {
  const s = read("working-session/TURNFILE.yaml");
  assert.match(s, /conflict:\s*\n\s+rebuttal_rounds:/);
});

test("R1.1: turnfile schema admits coordination.conflict.rebuttal_rounds (integer>=1 or 'unbounded')", () => {
  const schema = JSON.parse(read("schemas/turnfile/turnfile-v0.schema.json"));
  const conflict = schema?.properties?.coordination?.properties?.conflict
    ?? schema?.definitions?.coordination?.properties?.conflict
    ?? schema?.$defs?.coordination?.properties?.conflict;
  assert.ok(conflict, "schema has no coordination.conflict definition");
  const rr = conflict?.properties?.rebuttal_rounds;
  assert.ok(rr, "schema has no rebuttal_rounds under coordination.conflict");
});

test("R4: promoted PRD-018 matrix carries gated/unlockable flag column", () => {
  const s = read("docs/prds/PRD-018-maintainer-approval-authority-matrix-contract.md");
  assert.match(s, /unlockable/);
  assert.match(s, /gated/);
});

test("R5.4: active boot files reference the configurable bound and the gradient flag", () => {
  for (const f of ["working-session/boot-claude.md", "working-session/boot-codex.md"]) {
    const s = read(f);
    assert.match(s, /rebuttal_rounds/, `${f} missing rebuttal_rounds reference`);
    assert.match(s, /unlockable|gradient/i, `${f} missing gradient reference`);
  }
});

test("AC6: three worked examples exist (converge, exhaust+escalate, unbounded NO-NEW-OBJECTION)", () => {
  const s = read("docs/prds/PRD-021-conflict-loop-bound-and-selective-unlock-gradient-contract.md");
  assert.match(s, /## Worked examples/i, "PRD-021 has no Worked examples section");
  assert.match(s, /converge/i);
  assert.match(s, /exhaust/i);
  assert.match(s, /unbounded/i);
});

test("Multi-agent wording: R2 says 'all participating agents', not 'both agents'", () => {
  const s = read("docs/prds/PRD-021-conflict-loop-bound-and-selective-unlock-gradient-contract.md");
  assert.match(s, /all participating agents/);
  assert.doesNotMatch(s, /Both agents post a `NO-NEW-OBJECTION`/);
});
