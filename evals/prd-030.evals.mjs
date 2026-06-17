// PRD-030 implementation evals — Session Heartbeat Management Contract.
// Proposer/eval-author: Codex. Implementer: Claude. Reviewer: Codex.
// EXPECTED TO FAIL until Claude propagates PRD-030 into skills/claude and the
// PRD-014 closeout seam, then Codex mirrors any needed skill text.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

function prd030() {
  return read("docs/prds/PRD-030-session-heartbeat-management-contract.md");
}

function prd014() {
  return read("docs/prds/PRD-014-session-closeout-boot-handoff-contract.md");
}

function skillBundle(agent) {
  return read(`skills/${agent}/SKILL.md`);
}

function registryEntry(id) {
  const registry = JSON.parse(read("working-session/docs/PRD_STATUS.json"));
  return registry.prds.find((p) => p.id === id);
}

test("R1/R2/R3: PRD-030 defines heartbeats as optional negotiated session aids, not protocol authority", () => {
  const s = prd030();
  assert.match(s, /Heartbeats are optional session aids, not protocol authority/i);
  assert.match(s, /explicit Maintainer direction or explicit handshake agreement/i);
  assert.match(s, /default is no recurring heartbeat/i);
  assert.match(s, /Heartbeat state is not stored in `TURNFILE\.yaml` by default/i);
  assert.match(s, /harness-local interaction gearing, not protocol cadence/i);
});

test("R3/R4/R9: PRD-030 requires self-contained prompts, next-state derivation, projection regeneration, and file-first refresh", () => {
  const s = prd030();
  for (const needle of [
    /workspace path/i,
    /files to inspect/i,
    /what counts as new work/i,
    /validation expectations/i,
    /tools\/next-state\.mjs/i,
    /regenerate `working-session\/MAILBOX\.json`/i,
    /Run mailbox invariants and Turnfile lint/i,
    /Model, platform, thread, or automation memory is a cache only/i,
    /Turnfile project files are authoritative/i,
  ]) {
    assert.match(s, needle);
  }
});

test("R5/R6/R7/R8: PRD-030 pins closeout lifecycle, notification categories, and no-liveness-inference safety", () => {
  const s = prd030();
  assert.match(s, /Session closeout must inspect active heartbeat automations/i);
  assert.match(s, /deleted, updated, intentionally carried forward, or not applicable/i);
  assert.match(s, /Every carried-forward heartbeat requires a WORKLOG entry/i);
  assert.match(s, /NOTIFY/i);
  assert.match(s, /DONT_NOTIFY/i);
  assert.match(s, /must never infer peer liveness from silence/i);
  assert.match(s, /must not run destructive commands/i);
});

test("R9: both role skill bundles state the Turnfile memory boundary and file refresh discipline", () => {
  for (const agent of ["codex", "claude"]) {
    const s = skillBundle(agent);
    assert.match(s, /model\/platform|Model, platform|model, platform/i, `${agent} skill missing model/platform memory language`);
    assert.match(s, /memory .*cache|cache only|non-authoritative cache/i, `${agent} skill missing cache-only boundary`);
    assert.match(s, /Turnfile project files|working-session\/MAILBOX\.md/i, `${agent} skill missing Turnfile-file authority`);
    assert.match(s, /re-read|refresh .*files|read .*from disk/i, `${agent} skill missing file refresh before state claims`);
  }
});

test("R2-R5/R7: both role skill bundles define heartbeat negotiation, runtime processing, no-op reports, and closeout lifecycle", () => {
  for (const agent of ["codex", "claude"]) {
    const s = skillBundle(agent);
    assert.match(s, /heartbeat/i, `${agent} skill missing heartbeat language`);
    assert.match(s, /Maintainer direction|handshake agreement|session-handshake/i, `${agent} skill missing heartbeat authorization rule`);
    assert.match(s, /purpose/i, `${agent} skill missing heartbeat purpose field`);
    assert.match(s, /cadence/i, `${agent} skill missing heartbeat cadence field`);
    assert.match(s, /notification policy|notify/i, `${agent} skill missing heartbeat notification policy`);
    assert.match(s, /stop condition/i, `${agent} skill missing heartbeat stop condition`);
    assert.match(s, /next-state\.mjs/i, `${agent} skill missing pre-write derivation hook`);
    assert.match(s, /unread counts|current revision/i, `${agent} skill missing quiet no-op report fields`);
    assert.match(s, /carried-forward heartbeat.*WORKLOG|WORKLOG entry.*carried-forward heartbeat/is, `${agent} skill missing carried-forward WORKLOG rule`);
  }
});

test("R6: PRD-014 A1 closeout seam includes heartbeat lifecycle in the unified closeout checklist", () => {
  const s = prd014();
  assert.match(s, /heartbeat/i, "PRD-014 closeout amendment missing heartbeat seam");
  assert.match(s, /deleted, updated, intentionally carried forward, or not applicable|deleted, updated, carried forward, or not applicable/i);
  assert.match(s, /carried-forward heartbeat.*WORKLOG|WORKLOG entry.*carried-forward heartbeat/is);
  assert.match(s, /A1\.R1 Closeout compaction set[\s\S]*heartbeat/i, "heartbeat seam must live in the unified A1 closeout set");
});

test("AC7/AC8: session charter records the heartbeat decision and active-turn no-heartbeat default", () => {
  const s = read("working-session/SESSION_CHARTER.md");
  assert.match(s, /Session heartbeat/i);
  assert.match(s, /No active heartbeat/i);
  assert.match(s, /future heartbeat use follows/i);
});

test("AC6/R5: governance record preserves the worked example of deleting the obsolete session heartbeat", () => {
  const s = read("working-session/WORKLOG.md");
  assert.match(s, /turnfile-session-heartbeat/i);
  assert.match(s, /DELETED at close|deleted .*close/i);
  assert.match(s, /stop condition was satisfied/i);
});

test("AC11: registry records this eval suite and A1 implementation ownership for PRD-030", () => {
  const entry = registryEntry("PRD-030");
  assert.ok(entry, "PRD-030 missing from registry");
  assert.equal(entry.implementation?.evals, "evals/prd-030.evals.mjs");
  assert.equal(entry.implementation?.eval_author, "codex");
  assert.equal(entry.implementation?.implementer, "claude");
  assert.equal(entry.implementation?.reviewer, "codex");
});
