#!/usr/bin/env node
// PRD-023 out-of-band activity reconciliation helper (read-only).
// Compares an out-of-band activity evidence file against the WORKLOG and reports
// whether each entry is reconciled. Governance-state-changing drift that is NOT
// recorded in the worklog is decision-required (blocks, exit nonzero, flag-AND-block);
// non-governance drift is a warning only (flag-not-block, exit 0).
//
//   node tools/validate-out-of-band-reconciliation.mjs --worklog <wl> --evidence <json>
//        [--format human|json]
//
// Evidence shape: { "activity": [ { date, actor, artifact_class,
//                                   governance_state_changed: bool, summary } ] }
import fs from "node:fs";

function parseArgs(argv) {
  const args = { worklog: null, evidence: null, format: "human" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--worklog") args.worklog = argv[++i] || null;
    else if (a === "--evidence") args.evidence = argv[++i] || null;
    else if (a === "--format") args.format = argv[++i] || "human";
    else if (a === "-h" || a === "--help") { console.log("see header"); process.exit(0); }
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.worklog || !args.evidence) throw new Error("--worklog and --evidence are required");
  return args;
}

// Pull stable identifiers (PRD ids, MSG ids) out of a summary string for reconciliation matching.
function identifiers(summary) {
  const ids = [];
  for (const m of String(summary).matchAll(/\bPRD-\d+\b|\bMSG-\d{8}-\d{3,}\b|\bOQ-\d+\b/g)) ids.push(m[0]);
  return ids;
}

function isReconciled(entry, worklogText) {
  const ids = identifiers(entry.summary);
  if (ids.length) return ids.every((id) => worklogText.includes(id));
  // No stable id — fall back to a summary-substring match.
  return entry.summary ? worklogText.includes(String(entry.summary).trim()) : false;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const worklogText = fs.readFileSync(args.worklog, "utf8");
  let evidence;
  try { evidence = JSON.parse(fs.readFileSync(args.evidence, "utf8")); } catch (e) {
    throw new Error(`evidence parse error: ${e.message}`);
  }
  const findings = [];
  for (const entry of evidence.activity || []) {
    if (isReconciled(entry, worklogText)) continue;
    const tag = [identifiers(entry.summary).join(" "), entry.summary].filter(Boolean).join(" — ");
    if (entry.governance_state_changed) {
      findings.push({
        level: "decision-required",
        date: entry.date || "unknown",
        actor: entry.actor || "unknown",
        detail: `unreconciled governance-state change (decision-required): ${tag}`,
      });
    } else {
      findings.push({
        level: "warning",
        date: entry.date || "unknown",
        actor: entry.actor || "unknown",
        detail: `unreconciled non-governance drift (warning): ${tag}`,
      });
    }
  }
  const blocking = findings.filter((f) => f.level === "decision-required");
  const report = { findings, blocking_count: blocking.length, clean: blocking.length === 0 };
  if (args.format === "json") process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    if (!findings.length) process.stdout.write("out-of-band reconciliation: clean\n");
    else for (const f of findings) process.stdout.write(`[${f.level}] ${f.date} ${f.actor}: ${f.detail}\n`);
  }
  process.exit(report.clean ? 0 : 1);
}

main();
