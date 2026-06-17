// PRD-026 RED evals: review-cycle closure and task-state consistency.
// Eval author: Codex. Intended implementer/reviewer split: Claude implements,
// Codex reviews. These tests are expected to fail until PRD-026 is implemented.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

test("R2/R3: PRD-026 keeps closure-owner synchronization distinct from reviewer pre-yield checks", () => {
  const s = read("docs/prds/PRD-026-review-cycle-closure-and-task-state-consistency-contract.md");
  assert.match(s, /Closure-owner synchronization checklist/i);
  assert.match(s, /Reviewer responsibility before yielding/i);
  assert.match(s, /does not transfer closure-owner duties/i);
});

test("R4: closure drift validator/helper exists", () => {
  assert.ok(exists("tools/validate-review-cycle-closure.mjs"), "tools/validate-review-cycle-closure.mjs missing");
});

test("R4: closure drift helper flags task and agent-pointer drift in one report", () => {
  const tool = "tools/validate-review-cycle-closure.mjs";
  assert.ok(exists(tool), `${tool} missing`);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd026-"));
  const turnfile = path.join(dir, "TURNFILE.yaml");
  fs.writeFileSync(turnfile, `coordination:
  revision: 10
  agents:
    codex:
      status: active
      current_task: task_done_null
    claude:
      status: active
      current_task: missing_task
  tasks:
    task_done_null:
      status: done
      owner: codex
      claim_rev: 5
      completed_rev: null
    task_completed_not_done:
      status: in_progress
      owner: claude
      claim_rev: 6
      completed_rev: 9
`, "utf8");

  const result = spawnSync(process.execPath, [tool, "--turnfile", turnfile, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.notEqual(result.status, 0, "closure drift fixture should produce findings");
  assert.match(output, /done.*completed_rev|null.*completed_rev/i);
  assert.match(output, /completed_rev.*non.*done|non.*done.*completed_rev/i);
  assert.match(output, /current_task.*missing|missing_task/i);
  assert.match(output, /current_task.*done|task_done_null/i);
});

test("R4: closure drift helper flags registry evidence and blocker contradictions", () => {
  const tool = "tools/validate-review-cycle-closure.mjs";
  assert.ok(exists(tool), `${tool} missing`);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd026-"));
  const mailbox = path.join(dir, "MAILBOX.md");
  const prdStatus = path.join(dir, "PRD_STATUS.json");
  fs.writeFileSync(mailbox, `# Mailbox

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
| MSG-20990101-001 | 2099-01-01 | Codex -> Claude | closed | accepted |
`, "utf8");
  fs.writeFileSync(prdStatus, JSON.stringify({
    prds: [
      {
        id: "PRD-X",
        acceptance: {
          codex: { status: "accepted", evidence: ["MAILBOX MSG-20990101-999"] },
          claude: { status: "accepted", evidence: ["MAILBOX MSG-20990101-001"] },
          maintainer: { status: "accepted", evidence: ["chat accepted"] }
        },
        blocking_items: ["all reviewers accepted but stale blocker remains"]
      }
    ]
  }), "utf8");

  const result = spawnSync(process.execPath, [tool, "--mailbox", mailbox, "--prd-status", prdStatus, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout}${result.stderr}`;
  assert.notEqual(result.status, 0, "registry drift fixture should produce findings");
  assert.match(output, /MSG-20990101-999/);
  assert.match(output, /blocking_items|stale blocker/i);
});

test("R5: helper reports cross-owner task drift without repairing it", () => {
  const tool = "tools/validate-review-cycle-closure.mjs";
  assert.ok(exists(tool), `${tool} missing`);
  const s = read(tool);
  assert.match(s, /non-owner|cross-owner|owned by another|never repaired in place/i);
});
