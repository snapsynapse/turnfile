#!/usr/bin/env node
// PRD status lookup — single source of truth for "what's open right now."
// Boot files MUST NOT hardcode specific PRD acceptance/done state. Call this instead.
//
// Usage:
//   node tools/prd-status-summary.mjs                       # human-readable summary
//   node tools/prd-status-summary.mjs --format json         # machine-readable
//   node tools/prd-status-summary.mjs --filter blocked      # only blocked PRDs
//   node tools/prd-status-summary.mjs --filter unratified   # only unaccepted-by-maintainer
//   node tools/prd-status-summary.mjs --filter draft        # only working-session/docs shelf
//   node tools/prd-status-summary.mjs --id PRD-043          # full record for one PRD
//   node tools/prd-status-summary.mjs --gates v1            # v1 R9 gate readiness snapshot

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const statusPath = path.join(root, "working-session/docs/PRD_STATUS.json");

const args = parseArgs(process.argv.slice(2));
const data = JSON.parse(fs.readFileSync(statusPath, "utf8"));

if (args.id) {
  const entry = data.prds.find((p) => p.id === args.id);
  if (!entry) {
    process.stderr.write(`unknown PRD id: ${args.id}\n`);
    process.exit(1);
  }
  emit({ prd: entry });
  process.exit(0);
}

if (args.gates === "v1") {
  emit(v1GateSnapshot(data));
  process.exit(0);
}

const filtered = applyFilter(data.prds, args.filter);
const summary = {
  total: data.prds.length,
  by_shelf: countBy(data.prds, "shelf"),
  by_impl_state: countBy(data.prds, (p) => p.implementation?.state || "(none)"),
  maintainer_accepted: data.prds.filter((p) => p.acceptance?.maintainer?.status === "accepted").length,
  maintainer_pending: data.prds.filter((p) => p.acceptance?.maintainer?.status === "pending").length,
  unblocked_drafts: data.prds.filter((p) => p.shelf === "working-session/docs" && (p.blocking_items || []).length === 0).map((p) => p.id),
  with_blockers: data.prds.filter((p) => (p.blocking_items || []).length > 0).map((p) => ({ id: p.id, blockers: p.blocking_items })),
  filtered_count: filtered.length,
  filtered: filtered.map((p) => ({
    id: p.id,
    title: p.title,
    shelf: p.shelf,
    state: p.state,
    impl_state: p.implementation?.state,
    maintainer: p.acceptance?.maintainer?.status,
    blockers: p.blocking_items || [],
  })),
};

emit(summary);

function applyFilter(prds, filter) {
  if (!filter) return prds;
  if (filter === "blocked") return prds.filter((p) => (p.blocking_items || []).length > 0);
  if (filter === "unratified") return prds.filter((p) => p.acceptance?.maintainer?.status !== "accepted");
  if (filter === "draft") return prds.filter((p) => p.shelf === "working-session/docs");
  if (filter === "promoted") return prds.filter((p) => p.shelf === "docs/prds");
  if (filter === "archived") return prds.filter((p) => p.shelf === "docs/archive/prds");
  if (filter === "open") return prds.filter((p) => p.implementation?.state !== "done" && (p.blocking_items || []).length > 0);
  process.stderr.write(`unknown filter: ${filter}. valid: blocked|unratified|draft|promoted|archived|open\n`);
  process.exit(1);
  return prds;
}

function v1GateSnapshot(d) {
  const prd = (id) => d.prds.find((p) => p.id === id);
  const cond = (name, ok, evidence) => ({ name, ok, evidence });
  const checks = [];
  const p043 = prd("PRD-043");
  const p044 = prd("PRD-044");
  const p045 = prd("PRD-045");
  const p046 = prd("PRD-046");
  const p047 = prd("PRD-047");
  const p048 = prd("PRD-048");
  checks.push(cond("PRD-043 R10 fresh-context probe evidence", fs.existsSync(path.join(root, "working-session/docs")) && fs.readdirSync(path.join(root, "working-session/docs")).some((f) => f.startsWith("v1-fresh-context-probe-")), "glob working-session/docs/v1-fresh-context-probe-*"));
  checks.push(cond("PRD-043 implementation", p043?.implementation?.state === "done" || p043?.implementation?.state === "eval-verified", `state=${p043?.implementation?.state}`));
  checks.push(cond("PRD-044 done", p044?.implementation?.state === "done", `state=${p044?.implementation?.state}`));
  checks.push(cond("PRD-045 done", p045?.implementation?.state === "done", `state=${p045?.implementation?.state}`));
  checks.push(cond("PRD-046 done", p046?.implementation?.state === "done" || p046?.implementation?.state === "eval-verified", `state=${p046?.implementation?.state}`));
  checks.push(cond("PRD-048 done", p048?.implementation?.state === "done", `state=${p048?.implementation?.state}`));
  const tokeneseEvidence = fs.existsSync(path.join(root, "working-session/docs")) && fs.readdirSync(path.join(root, "working-session/docs")).some((f) => f.startsWith("v1-cross-repo-test-tokenese-"));
  const paice2Evidence = fs.existsSync(path.join(root, "working-session/docs")) && fs.readdirSync(path.join(root, "working-session/docs")).some((f) => f.startsWith("v1-cross-repo-test-paice2-"));
  checks.push(cond("PRD-047 Test 1 Tokenese evidence", tokeneseEvidence, "glob working-session/docs/v1-cross-repo-test-tokenese-*"));
  checks.push(cond("PRD-047 Test 2 PAICE2 evidence", paice2Evidence, "glob working-session/docs/v1-cross-repo-test-paice2-*"));
  const p043MaintainerAccepted = p043?.acceptance?.maintainer?.status === "accepted";
  const p043StaleApprovalBlockers = (p043?.blocking_items || []).filter((b) => /maintainer (ratif|approv)|r9 version-bump guardrail/i.test(b));
  checks.push(cond("PRD-043 maintainer acceptance carries forward", p043MaintainerAccepted && p043StaleApprovalBlockers.length === 0, `maintainer=${p043?.acceptance?.maintainer?.status || "missing"} stale_approval_blockers=${JSON.stringify(p043StaleApprovalBlockers)}`));
  return {
    gate: "v1.0.0 R9 release",
    ready: checks.every((c) => c.ok),
    checks,
  };
}

function countBy(arr, keyOrFn) {
  const get = typeof keyOrFn === "function" ? keyOrFn : (x) => x[keyOrFn];
  const out = {};
  for (const item of arr) {
    const k = get(item) || "(none)";
    out[k] = (out[k] || 0) + 1;
  }
  return out;
}

function emit(obj) {
  if (args.format === "json") {
    process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
    return;
  }
  // human format
  if (obj.gate) {
    process.stdout.write(`${obj.gate} — ${obj.ready ? "READY" : "NOT READY"}\n`);
    for (const c of obj.checks) {
      process.stdout.write(`  [${c.ok ? "ok" : "FAIL"}] ${c.name} — ${c.evidence}\n`);
    }
    return;
  }
  if (obj.prd) {
    process.stdout.write(JSON.stringify(obj.prd, null, 2) + "\n");
    return;
  }
  process.stdout.write(`PRD_STATUS summary (${obj.total} total)\n`);
  process.stdout.write(`  by shelf: ${JSON.stringify(obj.by_shelf)}\n`);
  process.stdout.write(`  by impl_state: ${JSON.stringify(obj.by_impl_state)}\n`);
  process.stdout.write(`  maintainer accepted: ${obj.maintainer_accepted}\n`);
  process.stdout.write(`  maintainer pending: ${obj.maintainer_pending}\n`);
  process.stdout.write(`  unblocked drafts: ${obj.unblocked_drafts.join(", ") || "(none)"}\n`);
  process.stdout.write(`  with blockers (${obj.with_blockers.length}):\n`);
  for (const b of obj.with_blockers) {
    process.stdout.write(`    ${b.id}: ${b.blockers.join(" | ")}\n`);
  }
  if (args.filter) {
    process.stdout.write(`\nfilter "${args.filter}" → ${obj.filtered_count} matches:\n`);
    for (const f of obj.filtered) {
      process.stdout.write(`  ${f.id} [shelf=${f.shelf} impl=${f.impl_state} maintainer=${f.maintainer}] ${f.title}\n`);
      for (const b of f.blockers) process.stdout.write(`    blocker: ${b}\n`);
    }
  }
}

function parseArgs(argv) {
  const out = { format: "human" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--format") out.format = argv[++i];
    else if (a === "--filter") out.filter = argv[++i];
    else if (a === "--id") out.id = argv[++i];
    else if (a === "--gates") out.gates = argv[++i];
  }
  return out;
}
