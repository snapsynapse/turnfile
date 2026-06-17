#!/usr/bin/env node
/**
 * tools/session-orient.mjs — PRD-032 Session Orientation Tool (read-only).
 *
 * One-shot orientation snapshot for an agent at boot/mid-session. It COMPOSES the
 * existing derivation/projection tools rather than forking their logic (PRD-032 R8 /
 * Claude review counter C1):
 *   - tools/next-state.mjs        → next message/signal/revision ids + unread snapshot
 *   - tools/validate-closeout.mjs → projection block (stale MAILBOX.json, TURNFILE
 *                                   header/coordination revision match)
 *   - tools/hooks/guard-check.mjs → best-effort ownership classification of git-dirty paths
 *
 * Validators (mailbox/turnfile/prd-promotion) are RECOMMENDED by default and only
 * executed when --validate is supplied (Claude counter C2). The tool never writes.
 *
 * Usage:
 *   node tools/session-orient.mjs --mailbox <mb> --turnfile <tf> --worklog <wl>
 *        --prd-status <ps> [--agent <id>] [--emit json|human]
 *        [--prd <PRD-ID>] [--task <task-id>] [--validate]
 *
 * Exit: 0 on success; nonzero with a machine-readable JSON error on missing inputs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

import { ownerOf } from "./hooks/guard-check.mjs";

const require = createRequire(import.meta.url);
const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOLS, "..");

function parseArgs(argv) {
  const a = { emit: "human", agent: null, prd: null, task: null, validate: false };
  for (let i = 2; i < argv.length; i += 1) {
    const k = argv[i];
    const v = () => argv[++i];
    if (k === "--mailbox") a.mailbox = v();
    else if (k === "--turnfile") a.turnfile = v();
    else if (k === "--worklog") a.worklog = v();
    else if (k === "--prd-status") a.prdStatus = v();
    else if (k === "--agent") a.agent = v();
    else if (k === "--emit") a.emit = v();
    else if (k === "--prd") a.prd = v();
    else if (k === "--task") a.task = v();
    else if (k === "--validate") a.validate = true;
    else if (k === "--help" || k === "-h") {
      console.log("Usage: node tools/session-orient.mjs --mailbox <mb> --turnfile <tf> --worklog <wl> --prd-status <ps> [--agent <id>] [--emit json|human] [--prd <id>] [--task <id>] [--validate]");
      process.exit(0);
    } else {
      jsonError("unknown-argument", `Unknown argument: ${k}`);
    }
  }
  return a;
}

function jsonError(code, message) {
  process.stdout.write(`${JSON.stringify({ ok: false, error: { code, message } }, null, 2)}\n`);
  process.exit(1);
}

function runNode(scriptRelToTools, args) {
  const r = spawnSync(process.execPath, [path.join(TOOLS, scriptRelToTools), ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return r;
}

function parseJsonLoose(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function main() {
  const args = parseArgs(process.argv);

  // Default to the current repo layout when file arguments are omitted (R1/AC2).
  // Defaults are the canonical RELATIVE paths so the composed projection check matches
  // how MAILBOX.json was generated (its source_file is the relative path); passing the
  // absolute form would make validate-closeout report a false-positive stale projection
  // (PRD-032 counter MSG-20260617-028). Subprocesses run with cwd=ROOT, so relative
  // paths resolve there; local fs reads resolve against ROOT explicitly.
  args.mailbox = args.mailbox || "working-session/MAILBOX.md";
  args.turnfile = args.turnfile || "working-session/TURNFILE.yaml";
  args.worklog = args.worklog || "working-session/WORKLOG.md";
  args.prdStatus = args.prdStatus || "working-session/docs/PRD_STATUS.json";
  const resolveRoot = (p) => path.resolve(ROOT, p);

  // Required inputs — fail closed with a machine-readable error (AC7/R2).
  const required = [
    ["MAILBOX", args.mailbox],
    ["TURNFILE", args.turnfile],
    ["WORKLOG", args.worklog],
    ["PRD_STATUS", args.prdStatus],
  ];
  for (const [label, p] of required) {
    if (!p) jsonError("missing-required-file", `Missing required argument for ${label}`);
    if (!fs.existsSync(resolveRoot(p))) jsonError("missing-required-file", `Required ${label} file not found: ${p}`);
  }

  const yaml = require("js-yaml");
  const turnfileText = fs.readFileSync(resolveRoot(args.turnfile), "utf8");
  const worklogText = fs.readFileSync(resolveRoot(args.worklog), "utf8");
  const turnfileDoc = yaml.load(turnfileText) || {};
  const coordination = turnfileDoc.coordination || {};
  const prdStatus = parseJsonLoose(fs.readFileSync(resolveRoot(args.prdStatus), "utf8")) || { prds: [] };

  // Compose next-state.mjs for ids + unread snapshot.
  const nsRaw = runNode("next-state.mjs", ["--mailbox", args.mailbox, "--turnfile", args.turnfile]);
  const ns = parseJsonLoose(nsRaw.stdout);
  if (!ns) jsonError("derivation-failed", `next-state.mjs did not return JSON: ${nsRaw.stderr || nsRaw.stdout}`);

  // Compose validate-closeout.mjs for the projection block (parse stdout even when it
  // exits nonzero — a stale projection or revision mismatch is reported, not fatal).
  const vcRaw = runNode("validate-closeout.mjs", ["--turnfile", args.turnfile, "--mailbox", args.mailbox]);
  const vc = parseJsonLoose(vcRaw.stdout) || {};
  const projection = vc.projection || {
    mailbox_json: { stale: false },
    turnfile_revision: { header: null, coordination: null, match: null },
  };

  // Selected agent unread (case-insensitive against the next-state snapshot).
  const agent = args.agent;
  let selectedAgentInbox = { unread: 0, oldest_unread: "none" };
  if (agent && ns.snapshot) {
    const key = Object.keys(ns.snapshot).find((k) => k.toLowerCase() === agent.toLowerCase());
    if (key) selectedAgentInbox = ns.snapshot[key];
  }

  // git (read-only) + best-effort ownership heuristic (PRD-033 guard is authoritative).
  let dirtyPaths = [];
  let gitOk = true;
  const gitRaw = spawnSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" });
  if (gitRaw.status === 0 && typeof gitRaw.stdout === "string") {
    dirtyPaths = gitRaw.stdout.split("\n").map((l) => l.slice(3).trim()).filter(Boolean);
  } else {
    gitOk = false;
  }
  let ownership = null;
  const ownPath = path.join(ROOT, "OWNERSHIP.yaml");
  if (fs.existsSync(ownPath)) ownership = yaml.load(fs.readFileSync(ownPath, "utf8"));
  const heuristicPeerOwned = ownership
    ? dirtyPaths.filter((p) => {
        const o = ownerOf(p, ownership);
        return o && o !== agent;
      })
    : [];

  // Selected PRD / task.
  let selectedPrd = null;
  if (args.prd) {
    const prd = (prdStatus.prds || []).find((r) => r.id === args.prd);
    if (prd) {
      selectedPrd = {
        id: prd.id,
        state: prd.state,
        shelf: prd.shelf,
        eligible_for_docs_prds: prd.eligible_for_docs_prds,
        implementation: prd.implementation || { state: null },
      };
    }
  }
  let selectedTask = null;
  if (args.task) {
    const t = (coordination.tasks || {})[args.task];
    if (t) selectedTask = { id: args.task, owner: t.owner, status: t.status, priority: t.priority };
  }

  // Findings (warnings only; orientation never fails on drift).
  const findings = [];
  if (projection.mailbox_json && projection.mailbox_json.stale) {
    findings.push({ level: "warning", message: "MAILBOX.json is stale relative to MAILBOX.md — regenerate with tools/export-mailbox-json.mjs." });
  }
  if (projection.turnfile_revision && projection.turnfile_revision.match === false) {
    const r = projection.turnfile_revision;
    findings.push({ level: "warning", message: `TURNFILE header revision ${r.header} does not match coordination.revision ${r.coordination}.` });
  }
  if (!gitOk) findings.push({ level: "info", message: "git status unavailable (not a git work tree or git missing)." });
  if (agent && selectedAgentInbox.unread > 0) {
    findings.push({ level: "info", message: `${agent} has ${selectedAgentInbox.unread} unread message(s); oldest ${selectedAgentInbox.oldest_unread}.` });
  }

  const recommended_commands = [
    `node tools/next-state.mjs --mailbox ${args.mailbox} --turnfile ${args.turnfile}`,
    `node tools/validate-mailbox-invariants.mjs --mailbox ${args.mailbox}`,
    `node tools/turnfile-lint.mjs --turnfile ${args.turnfile} --schema schemas/turnfile/turnfile-v0.schema.json`,
    `node tools/validate-prd-promotion.mjs`,
    `node tools/validate-closeout.mjs --turnfile ${args.turnfile} --mailbox ${args.mailbox}`,
    `node tools/validate-ownership-guard.mjs`,
  ];

  // Validators: listed by default, executed only with --validate (C2).
  const validators = { ran: Boolean(args.validate) };
  if (args.validate) {
    const run = (script, sargs) => {
      const r = runNode(script, sargs);
      if (r.error) return { status: -1, result: "skipped" };
      return { status: r.status, result: r.status === 0 ? "pass" : "fail" };
    };
    validators.mailbox = run("validate-mailbox-invariants.mjs", ["--mailbox", args.mailbox]);
    validators.turnfile = run("turnfile-lint.mjs", ["--turnfile", args.turnfile, "--schema", path.join(ROOT, "schemas/turnfile/turnfile-v0.schema.json")]);
    validators.prd_promotion = run("validate-prd-promotion.mjs", []);
  }

  const worklogStatus = (re) => {
    const m = worklogText.match(re);
    return m ? m[1].trim() : null;
  };

  const report = {
    agent,
    findings,
    freshness: {
      mailbox_hash: ns.freshness && ns.freshness.mailbox_hash,
      turnfile_hash: ns.freshness && ns.freshness.turnfile_hash,
      max_signal_id: `SIG-${String((ns.freshness && ns.freshness.max_sig) || 0).padStart(3, "0")}`,
      next_message_id: ns.next_msg_id,
      next_signal_id: ns.next_sig_id,
      next_revision: ns.next_revision,
    },
    git: {
      available: gitOk,
      dirty_paths: dirtyPaths,
      heuristic_peer_owned_paths: heuristicPeerOwned,
      ownership_note: "best-effort heuristic from OWNERSHIP.yaml; the PRD-033 pre-commit guard is authoritative.",
    },
    inbox: {
      selected_agent: { unread: selectedAgentInbox.unread, oldest_unread: selectedAgentInbox.oldest_unread },
      snapshot: ns.snapshot || {},
    },
    prd_status: {
      total: (prdStatus.prds || []).length,
      selected: selectedPrd,
    },
    projection,
    recommended_commands,
    turnfile: {
      revision: (ns.freshness && ns.freshness.revision) ?? coordination.revision ?? null,
      active_phase: coordination.active_phase ?? null,
      active_step: coordination.active_step ?? null,
      selected_task: selectedTask,
    },
    validators,
    worklog: {
      now_working_codex: worklogStatus(/^Now Working \(Codex\):\s*(.+)$/m),
      now_working_claude: worklogStatus(/^Now Working \(Claude\):\s*(.+)$/m),
      maintainer_focus: worklogStatus(/^Maintainer Focus:\s*(.+)$/m),
    },
  };

  if (args.emit === "json") {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  // human
  const L = [];
  L.push(`Session Orientation — agent: ${agent || "(unset)"}`);
  L.push(`TURNFILE revision: ${report.turnfile.revision}  (phase ${report.turnfile.active_phase} / ${report.turnfile.active_step})`);
  L.push(`next message: ${report.freshness.next_message_id}`);
  L.push(`next signal: ${report.freshness.next_signal_id}`);
  L.push(`next revision: ${report.freshness.next_revision}`);
  L.push(`inbox unread: ${report.inbox.selected_agent.unread} (oldest ${report.inbox.selected_agent.oldest_unread})`);
  if (report.prd_status.selected) {
    const s = report.prd_status.selected;
    L.push(`selected PRD: ${s.id} — state ${s.state}, impl ${s.implementation && s.implementation.state}`);
  }
  if (report.turnfile.selected_task) {
    const t = report.turnfile.selected_task;
    L.push(`selected task: ${t.id} — owner ${t.owner}, status ${t.status}`);
  }
  L.push(`projection: MAILBOX.json stale=${report.projection.mailbox_json && report.projection.mailbox_json.stale}, revision-match=${report.projection.turnfile_revision && report.projection.turnfile_revision.match}`);
  L.push(`git dirty paths: ${report.git.dirty_paths.length} (heuristic peer-owned: ${report.git.heuristic_peer_owned_paths.length})`);
  if (findings.length) {
    L.push("findings:");
    for (const f of findings) L.push(`  [${f.level}] ${f.message}`);
  } else {
    L.push("findings: none");
  }
  L.push(`validators ran: ${validators.ran}`);
  L.push("recommended commands:");
  for (const c of recommended_commands) L.push(`  ${c}`);
  process.stdout.write(`${L.join("\n")}\n`);
}

main();
