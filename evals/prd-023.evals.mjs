// PRD-023 RED evals: out-of-band activity reconciliation.
// Eval author: Codex. Intended implementer/reviewer split: Claude implements,
// Codex reviews. These tests are expected to fail until PRD-023 is implemented.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

test("R2: PRD-023 defines the portable minimum reconciliation fields", () => {
  const s = read("docs/prds/PRD-023-out-of-band-activity-reconciliation-contract.md");
  for (const phrase of [
    "Date or date range",
    "Actor, when known",
    "changed artifact classes",
    "Whether governance state changed",
    "Follow-up owner",
  ]) {
    assert.match(s, new RegExp(phrase, "i"));
  }
});

test("R6: boot files and skill bundles require boot-time drift reconciliation before stale-state reliance", () => {
  for (const file of [
    "working-session/boot-codex.md",
    "working-session/boot-claude.md",
    "skills/codex/SKILL.md",
    "skills/claude/SKILL.md",
  ]) {
    const s = read(file);
    assert.match(s, /out-of-band|drift check|reconciliation note/i, `${file} missing PRD-023 drift reconciliation language`);
    assert.match(s, /governance state|decision-required/i, `${file} missing governance-state block/escalation rule`);
  }
});

test("R6: session charter or closeout template carries an optional last checkpoint field", () => {
  const candidates = [
    "working-session/SESSION_CHARTER.md",
    "templates/session-charter.md",
    "templates/handoff.md",
    "templates/working-session/WORKLOG.md",
  ];
  const combined = candidates.filter(exists).map(read).join("\n");
  assert.match(combined, /last checkpoint|checkpoint note|out-of-band activity/i);
});

test("R3/R4: reconciliation helper reports unrecorded governance drift as decision-required", () => {
  const tool = "tools/validate-out-of-band-reconciliation.mjs";
  assert.ok(exists(tool), `${tool} missing`);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd023-"));
  const worklog = path.join(dir, "WORKLOG.md");
  const evidence = path.join(dir, "evidence.json");
  fs.writeFileSync(worklog, "# Worklog\n\n## 2026-06-01 close checkpoint\n\nNo follow-up.\n", "utf8");
  fs.writeFileSync(evidence, JSON.stringify({
    activity: [
      {
        date: "2026-06-02",
        actor: "Maintainer",
        artifact_class: "PRD state",
        governance_state_changed: true,
        summary: "PRD-999 accepted out of band"
      }
    ]
  }), "utf8");

  const result = spawnSync(process.execPath, [tool, "--worklog", worklog, "--evidence", evidence, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.notEqual(result.status, 0, "governance drift should not exit cleanly without reconciliation");
  assert.match(output, /decision-required/i);
  assert.match(output, /PRD-999/);
});

test("R4: reconciliation helper treats non-governance drift as warning, not blocker", () => {
  const tool = "tools/validate-out-of-band-reconciliation.mjs";
  assert.ok(exists(tool), `${tool} missing`);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd023-"));
  const worklog = path.join(dir, "WORKLOG.md");
  const evidence = path.join(dir, "evidence.json");
  fs.writeFileSync(worklog, "# Worklog\n\n## 2026-06-01 close checkpoint\n\nNo follow-up.\n", "utf8");
  fs.writeFileSync(evidence, JSON.stringify({
    activity: [
      {
        date: "2026-06-02",
        actor: "Maintainer",
        artifact_class: "README typo",
        governance_state_changed: false,
        summary: "Corrected prose typo"
      }
    ]
  }), "utf8");

  const result = spawnSync(process.execPath, [tool, "--worklog", worklog, "--evidence", evidence, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, output);
  assert.match(output, /warning/i);
  assert.doesNotMatch(output, /decision-required/i);
});
