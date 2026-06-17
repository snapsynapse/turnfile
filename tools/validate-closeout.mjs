#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const TERMINAL_STATUSES = new Set(["closed", "resolved", "superseded", "withdrawn", "abandoned"]);
const DEFAULT_RETENTION_SESSIONS = 2;

function usage() {
  return [
    "Usage: node tools/validate-closeout.mjs --turnfile <tf> --mailbox <mb>",
    "       [--retention-sessions <N>] [--defer <item>]...",
  ].join("\n");
}

function parseArgs(argv) {
  const args = {
    turnfile: null,
    mailbox: null,
    retentionSessions: DEFAULT_RETENTION_SESSIONS,
    deferred: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--turnfile") {
      args.turnfile = argv[++i] || null;
    } else if (arg === "--mailbox") {
      args.mailbox = argv[++i] || null;
    } else if (arg === "--retention-sessions") {
      args.retentionSessions = Number.parseInt(argv[++i] || "", 10);
    } else if (arg === "--defer") {
      args.deferred.push(argv[++i] || "");
    } else if (arg === "-h" || arg === "--help") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!args.turnfile || !args.mailbox) throw new Error("--turnfile and --mailbox are required");
  if (!Number.isInteger(args.retentionSessions) || args.retentionSessions < 1) {
    throw new Error("--retention-sessions must be a positive integer");
  }
  return args;
}

function parseRow(line) {
  if (!line.trim().startsWith("|")) return null;
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
    if (predicate(lines[i], i)) return i;
  }
  return -1;
}

function findLineInRange(lines, start, end, predicate) {
  for (let i = start; i < end; i += 1) {
    if (predicate(lines[i], i)) return i;
  }
  return -1;
}

function parseTableAt(lines, tableHeaderIndex) {
  const header = parseRow(lines[tableHeaderIndex]);
  if (!header) return { rows: [], endIndex: tableHeaderIndex };

  const headerKeys = header.map((h) => toKey(h));
  let i = tableHeaderIndex + 1;
  if (i < lines.length && parseRow(lines[i])) i += 1;

  const rows = [];
  for (; i < lines.length; i += 1) {
    const row = parseRow(lines[i]);
    if (!row) break;
    if (row.length !== headerKeys.length) continue;
    const obj = {};
    for (let c = 0; c < headerKeys.length; c += 1) obj[headerKeys[c]] = row[c];
    rows.push(obj);
  }
  return { rows, endIndex: i };
}

function parseSectionTable(lines, headingText) {
  const headingTexts = Array.isArray(headingText) ? headingText : [headingText];
  const headingIndex = lines.findIndex((line) => headingTexts.includes(line.trim()));
  if (headingIndex < 0) return [];
  const sectionEnd = findLine(lines, headingIndex + 1, (line) => line.trim().startsWith("## "));
  const rangeEnd = sectionEnd >= 0 ? sectionEnd : lines.length;
  const tableHeaderIndex = findLineInRange(lines, headingIndex + 1, rangeEnd, (line) =>
    line.trim().startsWith("|"),
  );
  if (tableHeaderIndex < 0) return [];
  return parseTableAt(lines, tableHeaderIndex).rows;
}

function normalizeInboxRows(rows) {
  return rows.map((row) => {
    const unread = Number.parseInt(row.unread ?? "", 10);
    return {
      agent: row.agent ?? "",
      unread: Number.isNaN(unread) ? row.unread ?? "" : unread,
      oldest_unread: row.oldest_unread ?? "",
      needs_response_by: row.needs_response_by ?? "",
    };
  });
}

function addStandardKeys(rows) {
  return rows.map((row) => ({
    id: row.id ?? "",
    date: row.date ?? "",
    from_to: row.from_to ?? "",
    type: row.type ?? "",
    priority: row.pri ?? row.priority ?? "",
    due: row.due ?? "",
    status: row.status ?? "",
    subject: row.subject ?? "",
    final_status: row.final_status ?? "",
    outcome: row.outcome ?? "",
  }));
}

function collectBullets(lines, startIndex) {
  const items = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("**") || line.startsWith("### ") || line.startsWith("## ")) break;
    if (line.startsWith("- ")) items.push(line.slice(2).trim());
  }
  return items;
}

function parseActiveMessagesProjection(lines) {
  const start = lines.findIndex((line) => line.trim() === "## Active Messages (Newest First)");
  if (start < 0) return [];
  const end = lines.findIndex(
    (line, idx) =>
      idx > start && ["## Closed Summary (Newest First)", "## Closed Summary"].includes(line.trim()),
  );
  const section = lines.slice(start + 1, end >= 0 ? end : lines.length);

  const messages = [];
  for (let i = 0; i < section.length; i += 1) {
    const line = section[i].trim();
    if (!line.startsWith("### MSG-")) continue;
    const nextMessageIdx = findLine(section, i + 1, (candidate) => candidate.trim().startsWith("### MSG-"));
    const messageEnd = nextMessageIdx >= 0 ? nextMessageIdx : section.length;
    const id = line.replace(/^###\s+/, "").trim();
    const tableStart = findLineInRange(section, i + 1, messageEnd, (candidate) => candidate.trim() === "| Field | Value |");

    if (tableStart < 0) {
      messages.push({ id });
      continue;
    }

    const parsed = parseTableAt(section, tableStart);
    const fields = {};
    for (const row of parsed.rows) {
      const key = toKey(row.field || "");
      if (key) fields[key] = row.value || "";
    }
    const summaryIdx = findLineInRange(section, parsed.endIndex, messageEnd, (candidate) => candidate.trim() === "**Summary**");
    const ackIdx = findLineInRange(section, parsed.endIndex, messageEnd, (candidate) => candidate.trim() === "**Ack**");
    const replyIdx = findLineInRange(section, parsed.endIndex, messageEnd, (candidate) => candidate.trim() === "**Reply**");
    messages.push({
      id,
      fields,
      summary: summaryIdx >= 0 ? collectBullets(section, summaryIdx + 1) : [],
      ack: ackIdx >= 0 ? collectBullets(section, ackIdx + 1) : [],
      reply: replyIdx >= 0 ? collectBullets(section, replyIdx + 1) : [],
    });
  }
  return messages;
}

function projectedMailboxJson(mailboxPath, mailboxText) {
  const lines = mailboxText.replace(/\r\n/g, "\n").split("\n");
  return {
    format_version: "mailbox-compact-v1",
    inbox_snapshot: normalizeInboxRows(parseSectionTable(lines, "## Inbox Snapshot")),
    open_queue: addStandardKeys(parseSectionTable(lines, "## Open Queue (Newest First)")),
    active_messages: parseActiveMessagesProjection(lines),
    closed_summary: addStandardKeys(parseSectionTable(lines, ["## Closed Summary (Newest First)", "## Closed Summary"])),
    source_file: mailboxPath,
  };
}

function comparableMailboxJson(data) {
  return {
    format_version: data?.format_version ?? "",
    inbox_snapshot: data?.inbox_snapshot ?? [],
    open_queue: data?.open_queue ?? [],
    active_messages: data?.active_messages ?? [],
    closed_summary: data?.closed_summary ?? [],
    source_file: data?.source_file ?? "",
  };
}

function parseActiveMessageStatuses(mailboxText) {
  const lines = mailboxText.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === "## Active Messages (Newest First)");
  if (start < 0) return [];
  const end = lines.findIndex(
    (line, idx) =>
      idx > start && ["## Closed Summary (Newest First)", "## Closed Summary"].includes(line.trim()),
  );
  const rangeEnd = end >= 0 ? end : lines.length;
  const messages = [];

  for (let i = start + 1; i < rangeEnd; i += 1) {
    const heading = lines[i].trim();
    if (!heading.startsWith("### MSG-")) continue;
    const id = heading.replace(/^###\s+/, "").trim();
    const next = findLineInRange(lines, i + 1, rangeEnd, (candidate) => candidate.trim().startsWith("### MSG-"));
    const msgEnd = next >= 0 ? next : rangeEnd;
    let status = "";
    for (let j = i + 1; j < msgEnd; j += 1) {
      const match = /^\*\*Status:\*\*\s*(.+?)\s*$/.exec(lines[j].trim());
      if (match) status = match[1].trim().toLowerCase();
    }
    messages.push({ id, status });
  }
  return messages;
}

function parseTurnfileSignals(turnfileText) {
  const lines = turnfileText.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === "messages:");
  if (start < 0) return [];
  const signals = [];
  let current = null;

  function flush() {
    if (current) signals.push(current);
    current = null;
  }

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const idMatch = /^  - id:\s*"?([^"]+?)"?\s*$/.exec(line);
    if (idMatch) {
      flush();
      current = { id: idMatch[1], from: "", signal: "", rev: 0 };
      continue;
    }
    if (!current) continue;
    const fieldMatch = /^    ([A-Za-z_]+):\s*(?:"([^"]*)"|(.+?))\s*$/.exec(line);
    if (!fieldMatch) continue;
    const value = (fieldMatch[2] ?? fieldMatch[3] ?? "").trim();
    if (fieldMatch[1] === "from") current.from = value;
    if (fieldMatch[1] === "signal") current.signal = value;
    if (fieldMatch[1] === "rev") current.rev = Number.parseInt(value, 10) || 0;
  }
  flush();
  return signals;
}

function parseTurnfileRevisions(turnfileText) {
  const headerMatch = /^# Last modified revision:\s*(\d+)\s*$/m.exec(turnfileText);
  const coordinationMatch = /^coordination:\s*$[\s\S]*?^  revision:\s*(\d+)\s*$/m.exec(turnfileText);
  const header = headerMatch ? Number.parseInt(headerMatch[1], 10) : null;
  const coordination = coordinationMatch ? Number.parseInt(coordinationMatch[1], 10) : null;
  return { header, coordination, match: header !== null && coordination !== null && header === coordination };
}

function signalLogReport(signals, retentionSessions) {
  const readySignals = signals
    .filter((signal) => signal.signal === "ready")
    .slice()
    .sort((a, b) => a.rev - b.rev || a.id.localeCompare(b.id));
  const threshold =
    readySignals.length > retentionSessions
      ? readySignals[readySignals.length - retentionSessions].rev
      : Number.NEGATIVE_INFINITY;

  const lastByAgent = new Map();
  for (const signal of signals) {
    const prior = lastByAgent.get(signal.from);
    if (!prior || signal.rev > prior.rev || (signal.rev === prior.rev && signal.id > prior.id)) {
      lastByAgent.set(signal.from, signal);
    }
  }
  const preserved = [...lastByAgent.values()].sort((a, b) => a.id.localeCompare(b.id));
  const preservedIds = new Set(preserved.map((signal) => signal.id));
  const eligible = signals
    .filter((signal) => signal.rev < threshold && !preservedIds.has(signal.id))
    .sort((a, b) => a.rev - b.rev || a.id.localeCompare(b.id))
    .map((signal) => signal.id);
  const preservedWouldBeEligible = preserved.some((signal) => signal.rev < threshold && eligible.includes(signal.id));

  return {
    retention_sessions: retentionSessions,
    eligible,
    preserved_last_per_agent: preserved.map((signal) => signal.id),
    ok: !preservedWouldBeEligible,
  };
}

function mailboxJsonStale(mailboxPath, mailboxText) {
  const jsonPath = mailboxPath.replace(/\.md$/i, ".json");
  if (!fs.existsSync(jsonPath)) return false;
  let actual;
  try {
    actual = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch {
    return true;
  }
  const expected = projectedMailboxJson(mailboxPath, mailboxText);
  return JSON.stringify(comparableMailboxJson(actual)) !== JSON.stringify(comparableMailboxJson(expected));
}

function buildReport(args) {
  const turnfileText = fs.readFileSync(args.turnfile, "utf8");
  const mailboxText = fs.readFileSync(args.mailbox, "utf8");
  const signals = parseTurnfileSignals(turnfileText);
  const signalLog = signalLogReport(signals, args.retentionSessions);
  const terminalInActive = parseActiveMessageStatuses(mailboxText)
    .filter((message) => TERMINAL_STATUSES.has(message.status))
    .map((message) => message.id);
  const staleMailboxJson = mailboxJsonStale(args.mailbox, mailboxText);
  const turnfileRevision = parseTurnfileRevisions(turnfileText);

  const allBlocking = [];
  if (!signalLog.ok) allBlocking.push({ item: "signal_log", reason: "last-per-agent signal would be eligible for compaction" });
  if (terminalInActive.length > 0) {
    allBlocking.push({
      item: "mailbox_archival",
      reason: `terminal active messages remain: ${terminalInActive.join(", ")}`,
    });
  }
  if (staleMailboxJson) allBlocking.push({ item: "mailbox_json", reason: "MAILBOX.json is stale relative to MAILBOX.md" });
  if (!turnfileRevision.match) {
    allBlocking.push({
      item: "turnfile_revision",
      reason: `TURNFILE header revision ${turnfileRevision.header} does not match coordination.revision ${turnfileRevision.coordination}`,
    });
  }

  const deferred = [...new Set(args.deferred.filter(Boolean))];
  const blocking = allBlocking.filter((entry) => !deferred.includes(entry.item));

  return {
    compaction: {
      signal_log: signalLog,
      mailbox_archival: {
        terminal_in_active: terminalInActive,
        ok: terminalInActive.length === 0,
      },
    },
    projection: {
      mailbox_json: { stale: staleMailboxJson },
      turnfile_revision: turnfileRevision,
    },
    blocking,
    deferred,
    clean: blocking.length === 0,
  };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const report = buildReport(args);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(report.clean ? 0 : 1);
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(2);
}
