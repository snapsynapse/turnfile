#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULTS = {
  mailbox: "working-session/MAILBOX.md",
  mailboxJson: "working-session/MAILBOX.json",
  turnfile: "working-session/TURNFILE.yaml",
  phase: "end",
  format: "human",
};

const CHECKS = [
  {
    id: "mailbox-file-present",
    boundary: "start,end",
    catches: "MAILBOX.md missing or path typo.",
  },
  {
    id: "mailbox-invariants",
    boundary: "start,end",
    catches: [
      "closed or terminal message left in Active Messages",
      "non-terminal active card missing from Open Queue",
      "Open Queue row pointing at a missing Active Message body",
      "Open Queue row pointing at a terminal message",
      "Inbox Snapshot unread count mismatch",
      "Inbox Snapshot oldest_unread mismatch",
      "duplicate active message IDs",
      "duplicate Closed Summary IDs",
      "Closed Summary rows missing ID, Date, From -> To, Final status, or Outcome",
      "dense fenced blocks without immediate legible paraphrase",
      "delivery-mirror closure without required acknowledgement/lapse evidence",
    ],
  },
  {
    id: "mailbox-json-fresh",
    boundary: "start,end",
    catches: "MAILBOX.json stale relative to MAILBOX.md after mailbox edits.",
  },
  {
    id: "turnfile-revision-projection",
    boundary: "start,end",
    catches: "TURNFILE.yaml header revision and coordination.revision diverged.",
  },
  {
    id: "active-card-owner-review",
    boundary: "end",
    catches: "selected agent still owns actioned active cards that require close/defer review.",
  },
  {
    id: "selected-agent-unread-clean-close",
    boundary: "end",
    catches: "selected agent still has unread mailbox work at session close or before yielding complete.",
  },
];

function usage() {
  console.error([
    "Usage: node tools/validate-mailbox-session-gate.mjs [--phase start|end] [--agent <id>] [--format human|json] [--list]",
    "       [--mailbox working-session/MAILBOX.md] [--mailbox-json working-session/MAILBOX.json] [--turnfile working-session/TURNFILE.yaml]",
  ].join("\n"));
}

function parseArgs(argv) {
  const args = { ...DEFAULTS, list: false };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--mailbox") args.mailbox = argv[++i];
    else if (token === "--mailbox-json") args.mailboxJson = argv[++i];
    else if (token === "--turnfile") args.turnfile = argv[++i];
    else if (token === "--agent") args.agent = argv[++i];
    else if (token === "--phase") args.phase = argv[++i];
    else if (token === "--format") args.format = argv[++i];
    else if (token === "--list") args.list = true;
    else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${token}`);
      usage();
      process.exit(2);
    }
  }
  if (!["start", "end"].includes(args.phase)) {
    console.error("--phase must be start|end");
    process.exit(2);
  }
  if (!["human", "json"].includes(args.format)) {
    console.error("--format must be human|json");
    process.exit(2);
  }
  return args;
}

function runNode(script, scriptArgs) {
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
  };
}

function parseJsonLoose(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function activeChecks(phase) {
  return CHECKS.filter((check) => check.boundary.split(",").includes(phase));
}

function listPayload(phase) {
  return {
    ok: true,
    phase,
    checks: activeChecks(phase),
  };
}

function runGate(args) {
  const checks = [];

  checks.push({
    id: "mailbox-file-present",
    ok: fs.existsSync(args.mailbox),
    detail: fs.existsSync(args.mailbox) ? "present" : `missing ${args.mailbox}`,
  });

  const invariants = runNode("tools/validate-mailbox-invariants.mjs", ["--mailbox", args.mailbox]);
  checks.push({
    id: "mailbox-invariants",
    ok: invariants.ok,
    detail: invariants.ok ? "PASS" : invariants.output,
  });

  const closeoutArgs = [
    "--turnfile", args.turnfile,
    "--mailbox", args.mailbox,
    "--format", "json",
  ];
  if (args.agent) closeoutArgs.push("--agent", args.agent);
  const closeout = runNode("tools/validate-closeout.mjs", closeoutArgs);
  const closeoutJson = parseJsonLoose(closeout.stdout);

  const mailboxStale = closeoutJson?.projection?.mailbox_json?.stale;
  checks.push({
    id: "mailbox-json-fresh",
    ok: mailboxStale === false,
    detail: mailboxStale === false ? "fresh" : "MAILBOX.json is stale relative to MAILBOX.md",
  });

  const revisionMatch = closeoutJson?.projection?.turnfile_revision?.match;
  checks.push({
    id: "turnfile-revision-projection",
    ok: revisionMatch === true,
    detail: revisionMatch === true ? "header and coordination revision match" : "TURNFILE revision projection mismatch",
  });

  const ownerReview = closeoutJson?.compaction?.active_card_owner_review;
  if (args.phase === "end") {
    checks.push({
      id: "active-card-owner-review",
      ok: ownerReview ? ownerReview.ok === true : !args.agent,
      detail: ownerReview
        ? ownerReview.ok
          ? "no selected-agent actioned active cards require close/defer review"
          : `selected agent owns actioned active cards: ${(ownerReview.actioned_owned_active || []).join(", ")}`
        : "skipped; no --agent supplied",
    });

    const unread = selectedAgentUnread(args.mailbox, args.agent);
    checks.push({
      id: "selected-agent-unread-clean-close",
      ok: !args.agent || unread.unread === 0,
      detail: args.agent
        ? `${args.agent} unread=${unread.unread}, oldest=${unread.oldest_unread || "none"}`
        : "skipped; no --agent supplied",
    });
  }

  const failures = checks.filter((check) => !check.ok);
  return {
    ok: failures.length === 0,
    phase: args.phase,
    agent: args.agent || null,
    checks,
    failures,
    source: {
      mailbox: args.mailbox,
      mailbox_json: args.mailboxJson,
      turnfile: args.turnfile,
    },
  };
}

function selectedAgentUnread(mailboxPath, agent) {
  if (!agent || !fs.existsSync(mailboxPath)) {
    return { unread: 0, oldest_unread: "none" };
  }
  const raw = fs.readFileSync(mailboxPath, "utf8");
  const re = new RegExp(`\\|\\s*${escapeRegExp(agent)}\\s*\\|\\s*(\\d+)\\s*\\|\\s*([^|]+?)\\s*\\|`, "i");
  const match = re.exec(raw);
  if (!match) {
    return { unread: 0, oldest_unread: "none" };
  }
  return {
    unread: Number.parseInt(match[1], 10) || 0,
    oldest_unread: match[2].trim(),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function printHuman(report) {
  console.log(`Mailbox session gate (${report.phase})`);
  if (report.agent) console.log(`Agent: ${report.agent}`);
  console.log(`Source: ${report.source.mailbox}`);
  console.log("");
  for (const check of report.checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} ${check.id}: ${oneLine(check.detail)}`);
  }
  console.log("");
  console.log(report.ok ? "MAILBOX SESSION GATE: PASS" : "MAILBOX SESSION GATE: FAIL");
}

function printListHuman(payload) {
  console.log(`Mailbox session gate checks (${payload.phase})`);
  for (const check of payload.checks) {
    const catches = Array.isArray(check.catches) ? check.catches : [check.catches];
    console.log(`- ${check.id}:`);
    for (const item of catches) {
      console.log(`  - ${item}`);
    }
  }
}

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const args = parseArgs(process.argv);
if (args.list) {
  const payload = listPayload(args.phase);
  if (args.format === "json") console.log(JSON.stringify(payload, null, 2));
  else printListHuman(payload);
  process.exit(0);
}

const report = runGate(args);
if (args.format === "json") console.log(JSON.stringify(report, null, 2));
else printHuman(report);
process.exit(report.ok ? 0 : 1);
