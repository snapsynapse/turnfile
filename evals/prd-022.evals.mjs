// PRD-022 implementation evals — decision-mirror delivery contract
// Proposer: Claude (eval author). Implementer: Codex. Reviewer: Claude.
// EXPECTED TO FAIL until implementation completes (8-step loop, step 6).
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function runMailboxValidator(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd022-"));
  const f = path.join(dir, "MAILBOX.md");
  fs.writeFileSync(f, content, "utf8");
  const r = spawnSync(process.execPath, ["tools/validate-mailbox-invariants.mjs", "--mailbox", f], { cwd: root, encoding: "utf8" });
  return { status: r.status, output: `${r.stdout}${r.stderr}` };
}

const SKELETON = (card) => `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
${card}
`;

test("R5.1: promoted PRD-019 R4 carries the mirror mode field", () => {
  const s = read("docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md");
  assert.match(s, /audit-mirror/);
  assert.match(s, /delivery-mirror/);
});

test("R5.2: working-session mailbox template documents the Mode line for mirrors", () => {
  const s = read("templates/working-session/MAILBOX.md");
  assert.match(s, /Mode:.*audit-mirror.*delivery-mirror|audit-mirror.*delivery-mirror/s);
});

test("R5.3: both skill bundles encode mode-selection rule and session-close digest check", () => {
  for (const f of ["skills/claude/SKILL.md", "skills/codex/SKILL.md"]) {
    const s = read(f);
    assert.match(s, /delivery-mirror/, `${f} missing delivery-mirror`);
    assert.match(s, /digest/i, `${f} missing digest check`);
  }
});

test("R5.4: validator errors on closed delivery-mirror lacking acks or recorded lapse", () => {
  const card = `| MSG-20990101-001 | 2099-01-01 | Claude -> all | closed | bad mirror |`;
  // Full closed card lives in archive; the validator inspects active+summary. Simulate
  // an active closed delivery-mirror card, which must be rejected for missing acks.
  const active = `### MSG-20990101-001

**From:** Claude -> Codex
**Date:** 2099-01-01
**Type:** notify
**Mode:** delivery-mirror
**Priority:** P1
**Status:** closed
**Subject:** test mirror
**Closure owner:** Claude
`;
  const content = SKELETON(card).replace("## Active Messages (Newest First)\n", `## Active Messages (Newest First)\n\n${active}\n`);
  const r = runMailboxValidator(content);
  assert.notEqual(r.status, 0, `validator accepted a closed delivery-mirror with no acks/lapse:\n${r.output}`);
});

test("R5.4: validator warns on mirror card without a declared mode", () => {
  const card = `| MSG-20990101-002 | 2099-01-01 | Claude -> all | closed | Chat decision mirror — test |`;
  const r = runMailboxValidator(SKELETON(card));
  assert.match(r.output, /mode/i, "no mode-related diagnostic for mirror without mode");
});

test("AC5: live worked examples exist — delivery cycle and audit pattern referenced in PRD", () => {
  const s = read("docs/prds/PRD-022-decision-mirror-delivery-contract.md");
  assert.match(s, /## Worked examples/i, "PRD-022 has no Worked examples section");
  assert.match(s, /MSG-20260613-030|MSG-20260613-031/, "delivery-mirror example not referencing a live session 14 case");
  assert.match(s, /MSG-20260211-007/, "audit-mirror example missing");
  assert.match(s, /lapse/i, "SLA-lapse example missing");
});
