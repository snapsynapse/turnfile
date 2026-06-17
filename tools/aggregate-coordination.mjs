#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const CLOSED_STATES = new Set(["read", "acknowledged", "actioned", "closed"]);
const SNAPSHOT_RECIPIENTS = ["Codex", "Claude", "Maintainer"];

function usage() {
  return "usage: node tools/aggregate-coordination.mjs --shards <dir> [--emit json|mailbox-md|mailbox-json]";
}

function parseArgs(argv) {
  const args = { emit: "json", shards: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--shards") {
      args.shards = argv[++i] || null;
    } else if (arg === "--emit") {
      args.emit = argv[++i] || null;
    } else if (arg === "-h" || arg === "--help") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!args.shards) throw new Error("--shards is required");
  if (!["json", "mailbox-md", "mailbox-json"].includes(args.emit)) {
    throw new Error(`unsupported --emit mode: ${args.emit}`);
  }
  return args;
}

function readJsonl(file, conflicts) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  const rows = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      conflicts.push({
        kind: "parse-error",
        detail: `${file}:${index + 1}: ${error.message}`,
      });
    }
  }
  return rows;
}

function sortedShardAgents(shardsDir) {
  return fs
    .readdirSync(shardsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function signalNamespace(id) {
  const match = /^SIG-([A-Za-z0-9_-]+)-(\d{4,})$/.exec(String(id || ""));
  if (!match) return null;
  return { owner: match[1], seq: Number(match[2]) };
}

function messageNamespace(id) {
  const match = /^MSG-([A-Za-z0-9_-]+)-(\d{8})-(\d{4,})$/.exec(String(id || ""));
  if (!match) return null;
  return { owner: match[1], date: match[2], seq: Number(match[3]) };
}

function ensureNamespace(namespaces, agent) {
  if (!namespaces[agent]) namespaces[agent] = { max_sig: 0, max_msg: {} };
  return namespaces[agent];
}

function recordDuplicate(id, seen, conflicts, kind) {
  if (!id) return;
  if (seen.has(id)) {
    conflicts.push({
      kind: "duplicate-id",
      detail: `${kind} id ${id} appears in both ${seen.get(id)} and current shard`,
    });
  } else {
    seen.set(id, kind);
  }
}

function baseCompare(a, b) {
  const ats = String(a.ts || "");
  const bts = String(b.ts || "");
  if (ats !== bts) return ats < bts ? -1 : 1;
  const aid = String(a.id || "");
  const bid = String(b.id || "");
  if (aid !== bid) return aid < bid ? -1 : 1;
  return 0;
}

function causalOrder(events) {
  const nodes = events.slice().sort(baseCompare);
  const byId = new Map(nodes.map((event) => [event.id, event]));
  const indegree = new Map(nodes.map((event) => [event.id, 0]));
  const outgoing = new Map(nodes.map((event) => [event.id, []]));

  for (const event of nodes) {
    for (const dep of Array.isArray(event.deps) ? event.deps : []) {
      if (!byId.has(dep) || dep === event.id) continue;
      indegree.set(event.id, indegree.get(event.id) + 1);
      outgoing.get(dep).push(event.id);
    }
  }

  let ready = nodes.filter((event) => indegree.get(event.id) === 0).sort(baseCompare);
  const ordered = [];
  const emitted = new Set();

  while (ready.length) {
    const event = ready.shift();
    if (emitted.has(event.id)) continue;
    emitted.add(event.id);
    ordered.push(event);

    const nextIds = outgoing.get(event.id) || [];
    for (const nextId of nextIds) {
      indegree.set(nextId, indegree.get(nextId) - 1);
      if (indegree.get(nextId) === 0) ready.push(byId.get(nextId));
    }
    ready.sort(baseCompare);
  }

  const remainder = nodes.filter((event) => !emitted.has(event.id)).sort(baseCompare);
  return ordered.concat(remainder);
}

function latestReadStates(readStates) {
  const latest = new Map();
  for (const event of readStates) {
    const reader = String(event.reader || "").toLowerCase();
    const msgId = event.msg_id;
    if (!reader || !msgId) continue;
    const key = `${reader}\u0000${msgId}`;
    const prior = latest.get(key);
    if (!prior || String(event.ts || "") >= String(prior.ts || "")) latest.set(key, event);
  }
  return latest;
}

function attachReadState(messages, readStates) {
  const byMessage = new Map();
  for (const event of latestReadStates(readStates).values()) {
    if (!byMessage.has(event.msg_id)) byMessage.set(event.msg_id, {});
    byMessage.get(event.msg_id)[String(event.reader).toLowerCase()] = event.state;
  }
  return messages.map((message) => ({
    ...message,
    read_by: byMessage.get(message.id) || {},
  }));
}

function isAddressedTo(message, recipient) {
  const to = String(message.to || "").toLowerCase();
  const from = String(message.from || "").toLowerCase();
  const target = recipient.toLowerCase();
  return to === target || (to === "all" && from !== target);
}

function deriveSnapshot(messages) {
  const snapshot = {};
  const byAge = messages.slice().sort(baseCompare);
  for (const recipient of SNAPSHOT_RECIPIENTS) {
    const key = recipient.toLowerCase();
    const unread = byAge.filter((message) => {
      if (!isAddressedTo(message, key)) return false;
      return !CLOSED_STATES.has(message.read_by?.[key]);
    });
    snapshot[recipient] = {
      unread: unread.length,
      oldest_unread: unread[0]?.id || "none",
    };
  }
  return snapshot;
}

function aggregate(shardsDir) {
  const agents = sortedShardAgents(shardsDir);
  const signals = [];
  const outbox = [];
  const readStates = [];
  const conflicts = [];
  const namespaces = {};
  const seenIds = new Map();

  for (const agent of agents) {
    const ns = ensureNamespace(namespaces, agent);
    const dir = path.join(shardsDir, agent);

    for (const event of readJsonl(path.join(dir, "signals.jsonl"), conflicts)) {
      const parsed = signalNamespace(event.id);
      if (!parsed) {
        conflicts.push({ kind: "namespace-violation", detail: `${agent} signal id ${event.id} is malformed` });
      } else {
        if (parsed.owner !== agent) {
          conflicts.push({
            kind: "namespace-violation",
            detail: `${agent} shard contains signal id ${event.id} owned by ${parsed.owner}`,
          });
        }
        ns.max_sig = Math.max(ns.max_sig, parsed.seq);
      }
      recordDuplicate(event.id, seenIds, conflicts, "signal");
      signals.push(event);
    }

    for (const event of readJsonl(path.join(dir, "outbox.jsonl"), conflicts)) {
      const parsed = messageNamespace(event.id);
      if (!parsed) {
        conflicts.push({ kind: "namespace-violation", detail: `${agent} message id ${event.id} is malformed` });
      } else {
        if (parsed.owner !== agent) {
          conflicts.push({
            kind: "namespace-violation",
            detail: `${agent} shard contains message id ${event.id} owned by ${parsed.owner}`,
          });
        }
        ns.max_msg[parsed.date] = Math.max(ns.max_msg[parsed.date] || 0, parsed.seq);
      }
      recordDuplicate(event.id, seenIds, conflicts, "message");
      outbox.push(event);
    }

    readStates.push(...readJsonl(path.join(dir, "read-state.jsonl"), conflicts));
  }

  const messages = causalOrder(attachReadState(outbox, readStates));
  return {
    agents,
    signals: causalOrder(signals),
    messages,
    snapshot: deriveSnapshot(messages),
    namespaces,
    conflicts: conflicts.sort((a, b) => {
      const ak = `${a.kind}\u0000${a.detail}`;
      const bk = `${b.kind}\u0000${b.detail}`;
      return ak < bk ? -1 : ak > bk ? 1 : 0;
    }),
  };
}

function renderMailboxMd(data) {
  const lines = [
    "# Mailbox (Derived)",
    "",
    "## Inbox Snapshot",
    "",
    "| Agent | Unread | Oldest unread |",
    "|---|---:|---|",
  ];
  for (const recipient of SNAPSHOT_RECIPIENTS) {
    const row = data.snapshot[recipient];
    lines.push(`| ${recipient} | ${row.unread} | ${row.oldest_unread} |`);
  }
  lines.push("", "## Open Queue", "", "| ID | From -> To | Priority | Subject |", "|---|---|---|---|");
  for (const message of data.messages.slice().sort((a, b) => -baseCompare(a, b))) {
    lines.push(
      `| ${message.id} | ${message.from || ""} -> ${message.to || ""} | ${message.priority || ""} | ${message.subject || ""} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function renderMailboxJson(data) {
  return {
    snapshot: data.snapshot,
    messages: data.messages,
    conflicts: data.conflicts,
  };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const data = aggregate(path.resolve(args.shards));
  if (args.emit === "mailbox-md") {
    process.stdout.write(renderMailboxMd(data));
  } else if (args.emit === "mailbox-json") {
    process.stdout.write(`${JSON.stringify(renderMailboxJson(data), null, 2)}\n`);
  } else {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  }
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(1);
}
