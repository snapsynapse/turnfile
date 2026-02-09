#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

function usage() {
  console.error(
    "Usage: node tools/export-mailbox-json.mjs [input.md] [output.json]",
  );
}

function toKey(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
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

  // Skip delimiter row (e.g. |----|----|)
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

function parseSectionTable(lines, headingText) {
  const headingIndex = lines.findIndex((line) => line.trim() === headingText);
  if (headingIndex < 0) {
    return [];
  }

  const sectionEnd = findLine(
    lines,
    headingIndex + 1,
    (line) => line.trim().startsWith("## "),
  );
  const rangeEnd = sectionEnd >= 0 ? sectionEnd : lines.length;

  const tableHeaderIndex = findLineInRange(
    lines,
    headingIndex + 1,
    rangeEnd,
    (line) => line.trim().startsWith("|"),
  );

  if (tableHeaderIndex < 0) {
    return [];
  }

  return parseTableAt(lines, tableHeaderIndex).rows;
}

function collectBullets(lines, startIndex) {
  const items = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      // Keep scanning; bullets may have blank spacing.
      continue;
    }
    if (line.startsWith("**")) {
      break;
    }
    if (line.startsWith("### ")) {
      break;
    }
    if (line.startsWith("## ")) {
      break;
    }
    if (line.startsWith("- ")) {
      items.push(line.slice(2).trim());
    }
  }
  return items;
}

function parseActiveMessages(lines) {
  const start = lines.findIndex(
    (line) => line.trim() === "## Active Messages (Newest First)",
  );
  if (start < 0) {
    return [];
  }

  const end = lines.findIndex(
    (line, idx) => idx > start && line.trim() === "## Closed Summary (Newest First)",
  );
  const sliceEnd = end >= 0 ? end : lines.length;
  const section = lines.slice(start + 1, sliceEnd);

  const messages = [];
  for (let i = 0; i < section.length; i += 1) {
    const line = section[i].trim();
    if (!line.startsWith("### MSG-")) {
      continue;
    }

    const nextMessageIdx = findLine(
      section,
      i + 1,
      (candidate) => candidate.trim().startsWith("### MSG-"),
    );
    const messageEnd = nextMessageIdx >= 0 ? nextMessageIdx : section.length;

    const id = line.replace(/^###\s+/, "").trim();
    const tableStart = findLineInRange(
      section,
      i + 1,
      messageEnd,
      (candidate) => candidate.trim() === "| Field | Value |",
    );

    if (tableStart < 0) {
      messages.push({ id });
      continue;
    }

    const parsed = parseTableAt(section, tableStart);
    const fields = {};
    for (const row of parsed.rows) {
      const key = toKey(row.field || "");
      if (!key) {
        continue;
      }
      fields[key] = row.value || "";
    }

    const summaryIdx = findLineInRange(
      section,
      parsed.endIndex,
      messageEnd,
      (candidate) => candidate.trim() === "**Summary**",
    );
    const ackIdx = findLineInRange(
      section,
      parsed.endIndex,
      messageEnd,
      (candidate) => candidate.trim() === "**Ack**",
    );
    const replyIdx = findLineInRange(
      section,
      parsed.endIndex,
      messageEnd,
      (candidate) => candidate.trim() === "**Reply**",
    );

    const message = {
      id,
      fields,
      summary: summaryIdx >= 0 ? collectBullets(section, summaryIdx + 1) : [],
      ack: ackIdx >= 0 ? collectBullets(section, ackIdx + 1) : [],
      reply: replyIdx >= 0 ? collectBullets(section, replyIdx + 1) : [],
    };

    messages.push(message);
  }

  return messages;
}

function normalizeInboxRows(rows) {
  return rows.map((row) => {
    const unreadRaw = row.unread ?? "";
    const unreadNum = Number.parseInt(unreadRaw, 10);
    return {
      agent: row.agent ?? "",
      unread: Number.isNaN(unreadNum) ? unreadRaw : unreadNum,
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

function extractMetadata(lines) {
  const metadata = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Date initialized:")) {
      metadata.date_initialized = trimmed.replace("Date initialized:", "").trim();
    } else if (trimmed.startsWith("Protocol:")) {
      metadata.protocol = trimmed.replace("Protocol:", "").trim();
    } else if (trimmed.startsWith("Last format migration:")) {
      metadata.last_format_migration = trimmed
        .replace("Last format migration:", "")
        .trim();
    } else if (trimmed.startsWith("Full history:")) {
      metadata.full_history = trimmed.replace("Full history:", "").trim();
    }
  }
  return metadata;
}

function main() {
  const input = process.argv[2] || "working-session/MAILBOX.md";
  const output =
    process.argv[3] || input.replace(/\.md$/i, ".json");

  if (!fs.existsSync(input)) {
    usage();
    console.error(`Input file not found: ${input}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(input, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");

  const data = {
    generated_at: new Date().toISOString(),
    source_file: input,
    output_file: output,
    format_version: "mailbox-compact-v1",
    metadata: extractMetadata(lines),
    inbox_snapshot: normalizeInboxRows(
      parseSectionTable(lines, "## Inbox Snapshot"),
    ),
    open_queue: addStandardKeys(
      parseSectionTable(lines, "## Open Queue (Newest First)"),
    ),
    active_messages: parseActiveMessages(lines),
    closed_summary: addStandardKeys(
      parseSectionTable(lines, "## Closed Summary (Newest First)"),
    ),
  };

  const outputDir = path.dirname(output);
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Wrote ${output}`);
}

main();
