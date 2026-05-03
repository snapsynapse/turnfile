#!/usr/bin/env node

import fs from "node:fs";

const DEFAULT_MAILBOX = "working-session/MAILBOX.md";
const TERMINAL_STATUSES = new Set([
  "closed",
  "resolved",
  "superseded",
  "withdrawn",
  "abandoned",
]);
const OPEN_QUEUE_STATUSES = new Set(["unread", "acknowledged", "blocked", "actioned"]);

function usage() {
  console.error("Usage: node tools/validate-mailbox-invariants.mjs [--mailbox <path>]");
}

function parseArgs(argv) {
  const args = { mailbox: DEFAULT_MAILBOX };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--mailbox") {
      args.mailbox = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    }
    console.error(`Unknown argument: ${token}`);
    usage();
    process.exit(2);
  }
  return args;
}

function parseRow(line) {
  if (!line.trim().startsWith("|")) {
    return null;
  }
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function toKey(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function findLine(lines, start, predicate) {
  for (let i = start; i < lines.length; i += 1) {
    if (predicate(lines[i], i)) {
      return i;
    }
  }
  return -1;
}

function findLineInRange(lines, start, end, predicate) {
  for (let i = start; i < end; i += 1) {
    if (predicate(lines[i], i)) {
      return i;
    }
  }
  return -1;
}

function parseTableAt(lines, tableHeaderIndex) {
  const header = parseRow(lines[tableHeaderIndex]);
  if (!header) {
    return { rows: [], endIndex: tableHeaderIndex };
  }

  const headerKeys = header.map((h) => toKey(h));
  let i = tableHeaderIndex + 1;
  if (i < lines.length && parseRow(lines[i])) {
    i += 1;
  }

  const rows = [];
  for (; i < lines.length; i += 1) {
    const row = parseRow(lines[i]);
    if (!row) {
      break;
    }
    if (row.length !== headerKeys.length) {
      continue;
    }
    const obj = {};
    for (let c = 0; c < headerKeys.length; c += 1) {
      obj[headerKeys[c]] = row[c];
    }
    rows.push(obj);
  }
  return { rows, endIndex: i };
}

function findSectionRange(lines, headingText) {
  const headingIndex = lines.findIndex((line) => line.trim() === headingText);
  if (headingIndex < 0) {
    return null;
  }
  const sectionEnd = findLine(lines, headingIndex + 1, (line) =>
    line.trim().startsWith("## "),
  );
  return {
    start: headingIndex + 1,
    end: sectionEnd >= 0 ? sectionEnd : lines.length,
  };
}

function parseSectionTable(lines, headingText) {
  const range = findSectionRange(lines, headingText);
  if (!range) {
    return [];
  }
  const headerIndex = findLineInRange(
    lines,
    range.start,
    range.end,
    (line) => line.trim().startsWith("|"),
  );
  if (headerIndex < 0) {
    return [];
  }
  return parseTableAt(lines, headerIndex).rows;
}

function parseInboxSnapshot(lines) {
  const rows = parseSectionTable(lines, "## Inbox Snapshot");
  return rows.map((row) => ({
    agent: row.agent || "",
    unread: Number.parseInt(row.unread || "0", 10) || 0,
    oldest_unread: row.oldest_unread || "",
    needs_response_by: row.needs_response_by || "",
  }));
}

function parseOpenQueue(lines) {
  const rows = parseSectionTable(lines, "## Open Queue (Newest First)");
  return rows
    .map((row) => ({
      id: row.id || "",
      from_to: row.from_to || "",
      priority: row.priority || "",
      subject: row.subject || "",
    }))
    .filter((row) => row.id !== "");
}

function parseActiveMessages(lines) {
  const range = findSectionRange(lines, "## Active Messages (Newest First)");
  if (!range) {
    return [];
  }

  const messages = [];
  for (let i = range.start; i < range.end; i += 1) {
    const line = lines[i].trim();
    if (!line.startsWith("### MSG-")) {
      continue;
    }
    const id = line.replace(/^###\s+/, "").trim();
    const nextIdx = findLineInRange(
      lines,
      i + 1,
      range.end,
      (candidate) => candidate.trim().startsWith("### MSG-"),
    );
    const msgEnd = nextIdx >= 0 ? nextIdx : range.end;

    let from = "";
    let to = "";
    let date = "";
    let type = "";
    let priority = "";
    let status = "";
    let subject = "";
    for (let j = i + 1; j < msgEnd; j += 1) {
      const candidate = lines[j].trim();
      const fromMatch = /^\*\*From:\*\*\s*(.+?)\s*->\s*(.+?)\s*$/.exec(candidate);
      if (fromMatch) {
        from = fromMatch[1].trim();
        to = fromMatch[2].trim();
      }
      const dateMatch = /^\*\*Date:\*\*\s*(.+?)\s*$/.exec(candidate);
      if (dateMatch) {
        date = dateMatch[1].trim();
      }
      const typeMatch = /^\*\*Type:\*\*\s*(.+?)\s*$/.exec(candidate);
      if (typeMatch) {
        type = typeMatch[1].trim().toLowerCase();
      }
      const priorityMatch = /^\*\*Priority:\*\*\s*(.+?)\s*$/.exec(candidate);
      if (priorityMatch) {
        priority = priorityMatch[1].trim();
      }
      const statusMatch = /^\*\*Status:\*\*\s*(.+?)\s*$/.exec(candidate);
      if (statusMatch) {
        status = statusMatch[1].trim().toLowerCase();
      }
      const subjectMatch = /^\*\*Subject:\*\*\s*(.+?)\s*$/.exec(candidate);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
      }
    }

    messages.push({ id, from, to, date, type, priority, status, subject, index: messages.length });
  }
  return messages;
}

function parseClosedSummary(lines) {
  const rows = [
    ...parseSectionTable(lines, "## Closed Summary"),
    ...parseSectionTable(lines, "## Closed Summary (Newest First)"),
  ];
  return rows.map((row) => ({
    id: row.id || "",
    date: row.date || "",
    from_to: row.from_to || "",
    final_status: row.final_status || "",
    outcome: row.outcome || "",
  }));
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.mailbox)) {
    console.error(`Mailbox file not found: ${args.mailbox}`);
    process.exit(2);
  }

  const raw = fs.readFileSync(args.mailbox, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");

  const inbox = parseInboxSnapshot(lines);
  const openQueue = parseOpenQueue(lines);
  const active = parseActiveMessages(lines);
  const closedSummary = parseClosedSummary(lines);

  const errors = [];
  const warnings = [];

  const seen = new Set();
  const closedSummaryIds = new Set();
  for (const msg of active) {
    if (seen.has(msg.id)) {
      errors.push(`Duplicate active message ID: ${msg.id}`);
    }
    seen.add(msg.id);

    if (TERMINAL_STATUSES.has(msg.status)) {
      errors.push(
        `Closed/terminal message ${msg.id} remains in Active Messages (move body to MAILBOX_ARCHIVE.md and keep a Closed Summary row).`,
      );
    }
  }

  for (const row of closedSummary) {
    if (!row.id) {
      errors.push("Closed Summary row missing ID");
      continue;
    }
    if (closedSummaryIds.has(row.id)) {
      errors.push(`Duplicate Closed Summary message ID: ${row.id}`);
    }
    closedSummaryIds.add(row.id);

    const missing = [];
    if (!row.date) missing.push("Date");
    if (!row.from_to) missing.push("From -> To");
    if (!row.final_status) missing.push("Final status");
    if (!row.outcome) missing.push("Outcome");
    if (missing.length > 0) {
      errors.push(`Closed Summary row ${row.id} missing required field(s): ${missing.join(", ")}`);
    }
  }

  for (const entry of openQueue) {
    const match = active.find((msg) => msg.id === entry.id);
    if (!match) {
      errors.push(`Open queue references unknown active message ID: ${entry.id}`);
      continue;
    }
    if (TERMINAL_STATUSES.has(match.status)) {
      errors.push(
        `Open queue entry ${entry.id} has terminal status '${match.status}' (should not remain in open queue).`,
      );
    }
  }

  const openQueueIds = new Set(openQueue.map((entry) => entry.id));
  for (const msg of active) {
    if (OPEN_QUEUE_STATUSES.has(msg.status) && !openQueueIds.has(msg.id)) {
      errors.push(
        `Active non-terminal message ${msg.id} has status '${msg.status}' but is missing from Open Queue.`,
      );
    }
  }

  for (const row of inbox) {
    const unread = active.filter(
      (msg) => msg.to === row.agent && msg.status === "unread",
    );
    const expectedUnread = unread.length;
    const expectedOldest = expectedUnread > 0 ? unread[unread.length - 1].id : "none";

    if (row.unread !== expectedUnread) {
      errors.push(
        `Inbox mismatch for ${row.agent}: snapshot unread=${row.unread}, expected=${expectedUnread}.`,
      );
    }
    if (row.oldest_unread !== expectedOldest) {
      errors.push(
        `Inbox oldest_unread mismatch for ${row.agent}: snapshot='${row.oldest_unread}', expected='${expectedOldest}'.`,
      );
    }
    if (row.unread === 0 && row.needs_response_by !== "none") {
      warnings.push(
        `Inbox row for ${row.agent} has unread=0 but needs_response_by='${row.needs_response_by}' (expected 'none').`,
      );
    }
  }

  console.log(`Mailbox: ${args.mailbox}`);
  console.log(
    `Summary: inbox_agents=${inbox.length}, open_queue=${openQueue.length}, active_messages=${active.length}, closed_summary=${closedSummary.length}`,
  );
  console.log("");

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.log(`  \u26a0  ${warning}`);
    }
    console.log("");
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const error of errors) {
      console.log(`  \u2717  ${error}`);
    }
    console.log("");
    console.log("MAILBOX INVARIANTS: FAIL");
    process.exit(1);
  }

  console.log("MAILBOX INVARIANTS: PASS");
}

main();
