#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const TERMINAL_STATUSES = new Set([
  "closed",
  "resolved",
  "superseded",
  "withdrawn",
  "abandoned",
]);

const COMPLETE_IMPLEMENTATION_STATES = new Set([
  "done",
  "eval-verified",
  "accepted",
  "closed",
  "superseded",
  "deferred",
]);

function usage() {
  console.error(
    "Usage: node tools/validate-heartbeat-loop.mjs --agent <agent> [--root <dir>] [--format json|human]",
  );
}

function parseArgs(argv) {
  const args = { root: ".", format: "human", agent: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--root") {
      args.root = argv[++i];
    } else if (token === "--agent") {
      args.agent = argv[++i];
    } else if (token === "--format") {
      args.format = argv[++i];
    } else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${token}`);
      usage();
      process.exit(2);
    }
  }
  if (!args.agent) {
    console.error("--agent is required");
    usage();
    process.exit(2);
  }
  return args;
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}

function findSection(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start < 0) return "";
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join("\n");
}

function parseActiveMessages(mailboxText) {
  const section = findSection(mailboxText, "## Active Messages (Newest First)");
  if (!section.trim()) return [];

  const blocks = section
    .split(/\n(?=### MSG-)/)
    .map((block) => block.trim())
    .filter((block) => block.startsWith("### MSG-"));

  return blocks.map((block) => {
    const id = /^###\s+(MSG-\d{8}-\d+)/m.exec(block)?.[1] || "";
    const status = /^\*\*Status:\*\*\s*(.+)$/m.exec(block)?.[1]?.trim().toLowerCase() || "";
    const owner = /^\*\*Closure owner:\*\*\s*(.+)$/m.exec(block)?.[1]?.trim().toLowerCase() || "";
    const hasAck = /^\*\*Ack:\*\*\s*\S/m.test(block);
    const hasReply = /^\*\*Reply:\*\*\s*\S/m.test(block);
    return { id, status, owner, hasAck, hasReply };
  });
}

function sentMessageActivity(mailboxText, agent) {
  const normalizedAgent = agent.toLowerCase();
  return parseActiveMessages(mailboxText)
    .filter((message) => message.id)
    .filter((message) => message.owner === normalizedAgent)
    .filter((message) => !TERMINAL_STATUSES.has(message.status))
    .filter((message) => message.hasAck || message.hasReply)
    .map((message) => message.id);
}

function unblockedTasks(turnfileText, agent) {
  if (!turnfileText.trim()) return [];
  const doc = yaml.load(turnfileText) || {};
  const tasks = doc.coordination?.tasks || {};
  return Object.entries(tasks)
    .filter(([, task]) => task?.owner === agent)
    .filter(([, task]) => ["pending", "claimed"].includes(task?.status))
    .filter(([, task]) => {
      const deps = Array.isArray(task.depends_on) ? task.depends_on : [];
      return deps.length > 0 && deps.every((dep) => tasks[dep]?.status === "done");
    })
    .map(([id]) => id);
}

function hasHandshakeRow(handshakeText, agent) {
  const normalizedAgent = agent.toLowerCase();
  return handshakeText
    .split("\n")
    .some((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("|")) return false;
      const cells = trimmed
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim().toLowerCase());
      return cells[0] === normalizedAgent && cells.some((cell) => cell.includes(normalizedAgent));
    });
}

function prdStatusWork(prdStatusText, agent) {
  if (!prdStatusText.trim()) return [];
  let registry;
  try {
    registry = JSON.parse(prdStatusText);
  } catch {
    return [];
  }
  const normalizedAgent = agent.toLowerCase();
  const rows = Array.isArray(registry.prds) ? registry.prds : [];
  return rows
    .filter((prd) => prd && typeof prd === "object")
    .filter((prd) => {
      if (Array.isArray(prd.blocking_items) && prd.blocking_items.length > 0) return false;
      const acceptance = prd.acceptance || {};
      const ownAcceptance = acceptance[normalizedAgent];
      if (ownAcceptance?.status === "pending") return true;

      const implementation = prd.implementation || {};
      const state = String(implementation.state || "").toLowerCase();
      if (COMPLETE_IMPLEMENTATION_STATES.has(state)) return false;
      return ["implementer", "reviewer", "eval_author"].some(
        (key) => String(implementation[key] || "").toLowerCase() === normalizedAgent,
      );
    })
    .map((prd) => prd.id)
    .filter(Boolean);
}

function buildReport(root, agent) {
  const mailbox = readIfExists(path.join(root, "working-session", "MAILBOX.md"));
  const turnfile = readIfExists(path.join(root, "working-session", "TURNFILE.yaml"));
  const handshake = readIfExists(path.join(root, "working-session", "NEXT_SESSION_HANDSHAKE.md"));
  const prdStatus = readIfExists(path.join(root, "working-session", "docs", "PRD_STATUS.json"));

  const details = {
    active_threads: sentMessageActivity(mailbox, agent),
    unblocked_tasks: unblockedTasks(turnfile, agent),
    prd_status_work: prdStatusWork(prdStatus, agent),
    pending_handshake: !hasHandshakeRow(handshake, agent),
  };

  if (details.active_threads.length > 0) {
    return { outcome: "NOTIFY", reason: "sent-message-activity", details };
  }
  if (details.unblocked_tasks.length > 0) {
    return { outcome: "NOTIFY", reason: "task-dependency", details };
  }
  if (details.prd_status_work.length > 0) {
    return { outcome: "NOTIFY", reason: "prd-status-activity", details };
  }
  if (details.pending_handshake) {
    return { outcome: "NOTIFY", reason: "pending-handshake", details };
  }
  return { outcome: "DONT_NOTIFY", reason: "idle", details };
}

function main() {
  const args = parseArgs(process.argv);
  const root = path.resolve(args.root);
  const report = buildReport(root, args.agent);
  if (args.format === "json") {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(`${report.outcome}: ${report.reason}\n`);
    if (report.outcome === "NOTIFY") {
      process.stdout.write(`${JSON.stringify(report.details, null, 2)}\n`);
    }
  }
}

main();
