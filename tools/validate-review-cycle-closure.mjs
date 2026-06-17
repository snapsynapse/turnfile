#!/usr/bin/env node
// PRD-026 review-cycle closure + task-state consistency helper (read-only).
// Flags closure/task-state drift in one report; never repairs in place (R5):
// cross-owner / non-owner drift is reported, never edited by a non-owner.
//
//   node tools/validate-review-cycle-closure.mjs [--turnfile <tf>] [--mailbox <mb>]
//        [--prd-status <json>] [--format human|json]
//
// Findings (exit nonzero if any):
//   - a `done` task with a null completed_rev
//   - a non-`done` task carrying a completed_rev
//   - an agent current_task pointing at a missing task
//   - an agent current_task pointing at a `done` task
//   - a PRD acceptance evidence reference to a MSG id absent from the mailbox
//   - a PRD with all reviewers accepted but non-empty blocking_items
import fs from "node:fs";

function parseArgs(argv) {
  const args = { turnfile: null, mailbox: null, prdStatus: null, format: "human" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--turnfile") args.turnfile = argv[++i] || null;
    else if (a === "--mailbox") args.mailbox = argv[++i] || null;
    else if (a === "--prd-status") args.prdStatus = argv[++i] || null;
    else if (a === "--format") args.format = argv[++i] || "human";
    else if (a === "-h" || a === "--help") { console.log("see header"); process.exit(0); }
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

// Tolerant block parser: returns blocks [{name, indent, children:{key:value}}] for any
// `name:` header followed by deeper-indented `key: value` lines. Handles arbitrary nesting.
function parseBlocks(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i += 1) {
    const h = /^(\s*)([A-Za-z0-9_-]+):\s*$/.exec(lines[i]);
    if (!h) continue;
    const indent = h[1].length;
    const block = { name: h[2], indent, children: {} };
    for (let j = i + 1; j < lines.length; j += 1) {
      if (!lines[j].trim()) continue;
      const childIndent = (/^(\s*)/.exec(lines[j]) || [, ""])[1].length;
      if (childIndent <= indent) break;
      const kv = /^\s*([A-Za-z0-9_-]+):\s*(.+?)\s*$/.exec(lines[j]);
      if (kv && childIndent === indent + 2) block.children[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
    }
    blocks.push(block);
  }
  return blocks;
}

function isNullish(v) {
  return v === undefined || v === null || v === "null" || v === "~" || v === "";
}

function turnfileFindings(text) {
  const findings = [];
  const blocks = parseBlocks(text);
  // Tasks: blocks carrying completed_rev (task rows). Agents: blocks carrying current_task.
  const tasks = blocks.filter((b) => "completed_rev" in b.children || "claim_rev" in b.children);
  const taskByName = new Map(tasks.map((t) => [t.name, t]));
  for (const t of tasks) {
    const status = (t.children.status || "").toLowerCase();
    const completed = t.children.completed_rev;
    if (status === "done" && isNullish(completed)) {
      findings.push({ level: "blocker", kind: "task-state", detail: `done task ${t.name} has a null completed_rev` });
    }
    if (status && status !== "done" && !isNullish(completed)) {
      findings.push({ level: "blocker", kind: "task-state", detail: `non-done task ${t.name} carries a completed_rev (${completed})` });
    }
  }
  const agents = blocks.filter((b) => "current_task" in b.children);
  for (const a of agents) {
    const ct = a.children.current_task;
    if (isNullish(ct)) continue;
    if (!taskByName.has(ct)) {
      findings.push({ level: "blocker", kind: "agent-pointer", detail: `agent ${a.name} current_task points at a missing task: ${ct}` });
    } else if ((taskByName.get(ct).children.status || "").toLowerCase() === "done") {
      findings.push({ level: "blocker", kind: "agent-pointer", detail: `agent ${a.name} current_task points at a done task: ${ct}` });
    }
  }
  return findings;
}

function mailboxMsgIds(text) {
  const ids = new Set();
  for (const m of text.matchAll(/MSG-\d{8}-\d{3,}/g)) ids.add(m[0]);
  return ids;
}

function registryFindings(prdStatusText, mailboxText) {
  const findings = [];
  let registry;
  try { registry = JSON.parse(prdStatusText); } catch (e) {
    return [{ level: "blocker", kind: "registry", detail: `PRD_STATUS.json parse error: ${e.message}` }];
  }
  const knownMsgs = mailboxText ? mailboxMsgIds(mailboxText) : null;
  for (const prd of registry.prds || []) {
    const acc = prd.acceptance || {};
    const reviewers = Object.values(acc);
    // Registry evidence references a MSG id absent from the mailbox.
    if (knownMsgs) {
      for (const [role, a] of Object.entries(acc)) {
        for (const ev of a.evidence || []) {
          for (const ref of String(ev).matchAll(/MSG-\d{8}-\d{3,}/g)) {
            if (!knownMsgs.has(ref[0])) {
              findings.push({ level: "blocker", kind: "registry-evidence", detail: `${prd.id} ${role} evidence references ${ref[0]} which is absent from the mailbox` });
            }
          }
        }
      }
    }
    // All reviewers accepted but a blocker remains (stale blocker contradiction).
    const allAccepted = reviewers.length > 0 && reviewers.every((r) => (r.status || "").toLowerCase() === "accepted");
    if (allAccepted && Array.isArray(prd.blocking_items) && prd.blocking_items.length > 0) {
      findings.push({ level: "blocker", kind: "stale-blocker", detail: `${prd.id} has all reviewers accepted but non-empty blocking_items (stale blocker): ${prd.blocking_items.join("; ")}` });
    }
  }
  return findings;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const findings = [];
  if (args.turnfile) findings.push(...turnfileFindings(fs.readFileSync(args.turnfile, "utf8")));
  if (args.prdStatus) {
    const mb = args.mailbox ? fs.readFileSync(args.mailbox, "utf8") : "";
    findings.push(...registryFindings(fs.readFileSync(args.prdStatus, "utf8"), mb));
  }
  const report = { findings, clean: findings.length === 0 };
  if (args.format === "json") process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    if (report.clean) process.stdout.write("review-cycle closure: clean\n");
    else for (const f of findings) process.stdout.write(`[${f.level}] ${f.kind}: ${f.detail}\n`);
  }
  process.exit(report.clean ? 0 : 1);
}

main();
