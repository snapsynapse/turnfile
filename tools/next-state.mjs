#!/usr/bin/env node
// next-state.mjs - PRD-029 pre-write state derivation helper.
//
// Read-only helper. It derives next message/signal/revision identifiers and
// mailbox unread snapshots from the current files so agents do not rely on
// remembered state inside a shared-file transaction window.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function usage(exitCode = 0) {
  const out = exitCode === 0 ? console.log : console.error;
  out("Usage: node tools/next-state.mjs --mailbox <path> --turnfile <path> [--date YYYYMMDD]");
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { date: null };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") usage(0);
    if (arg === "--mailbox") {
      args.mailbox = argv[i + 1];
      i += 1;
    } else if (arg === "--turnfile") {
      args.turnfile = argv[i + 1];
      i += 1;
    } else if (arg === "--date") {
      args.date = argv[i + 1];
      i += 1;
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage(1);
    }
  }
  if (!args.mailbox || !args.turnfile) usage(1);
  if (args.date && !/^\d{8}$/.test(args.date)) {
    console.error("--date must use YYYYMMDD");
    process.exit(1);
  }
  return args;
}

function todayYYYYMMDD() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function readFile(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (err) {
    console.error(`Failed to read ${file}: ${err.message}`);
    process.exit(1);
  }
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function collectMessageSeqs(mailboxText) {
  const byDate = {};
  for (const match of mailboxText.matchAll(/\bMSG-(\d{8})-(\d{3,})\b/g)) {
    const date = match[1];
    const seq = Number(match[2]);
    byDate[date] = Math.max(byDate[date] || 0, seq);
  }
  return byDate;
}

function collectMaxSignal(turnfileText) {
  let max = 0;
  for (const match of turnfileText.matchAll(/\bSIG-(\d{3,})\b/g)) {
    max = Math.max(max, Number(match[1]));
  }
  return max;
}

function collectRevision(turnfileText) {
  const match = turnfileText.match(/^\s*revision:\s*(\d+)\s*$/m);
  if (!match) {
    console.error("Could not find coordination.revision in TURNFILE");
    process.exit(1);
  }
  return Number(match[1]);
}

function parseSnapshotAgents(mailboxText) {
  const agents = new Set();
  const snapshot = mailboxText.match(/## Inbox Snapshot\n\n([\s\S]*?)(?:\n## |\n# |$)/);
  if (snapshot) {
    for (const line of snapshot[1].split("\n")) {
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 4 && cells[0] !== "Agent" && !cells[0].startsWith("---")) {
        agents.add(cells[0]);
      }
    }
  }
  for (const match of mailboxText.matchAll(/\*\*From:\*\*\s*([^\n]+?)\s*->\s*([^\n]+)/g)) {
    agents.add(match[1].trim());
    agents.add(match[2].trim());
  }
  return [...agents];
}

function parseActiveCards(mailboxText) {
  const activeStart = mailboxText.indexOf("## Active Messages");
  if (activeStart < 0) return [];
  const closedStart = mailboxText.indexOf("## Closed Summary", activeStart);
  const active = mailboxText.slice(activeStart, closedStart < 0 ? mailboxText.length : closedStart);
  const cards = [];
  for (const chunk of active.split(/^### /m).slice(1)) {
    const firstNewline = chunk.indexOf("\n");
    if (firstNewline < 0) continue;
    const id = chunk.slice(0, firstNewline).trim();
    if (!/^MSG-\d{8}-\d{3,}$/.test(id)) continue;
    const body = chunk.slice(firstNewline + 1);
    const fromTo = body.match(/\*\*From:\*\*\s*([^\n]+?)\s*->\s*([^\n]+)/);
    const status = body.match(/\*\*Status:\*\*\s*([^\n]+)/);
    if (!fromTo || !status) continue;
    cards.push({
      id,
      from: fromTo[1].trim(),
      to: fromTo[2].trim(),
      status: status[1].trim().toLowerCase(),
    });
  }
  return cards;
}

function compareMsgIds(a, b) {
  const ma = a.match(/^MSG-(\d{8})-(\d{3,})$/);
  const mb = b.match(/^MSG-(\d{8})-(\d{3,})$/);
  if (!ma || !mb) return a.localeCompare(b);
  if (ma[1] !== mb[1]) return ma[1].localeCompare(mb[1]);
  return Number(ma[2]) - Number(mb[2]);
}

function deriveSnapshot(mailboxText) {
  const agents = parseSnapshotAgents(mailboxText);
  const snapshot = {};
  for (const agent of agents) {
    snapshot[agent] = { unread: 0, oldest_unread: "none" };
  }
  for (const card of parseActiveCards(mailboxText)) {
    if (card.status !== "unread") continue;
    if (!snapshot[card.to]) snapshot[card.to] = { unread: 0, oldest_unread: "none" };
    snapshot[card.to].unread += 1;
    if (snapshot[card.to].oldest_unread === "none" || compareMsgIds(card.id, snapshot[card.to].oldest_unread) < 0) {
      snapshot[card.to].oldest_unread = card.id;
    }
  }
  return snapshot;
}

function main() {
  const args = parseArgs(process.argv);
  const mailboxPath = path.resolve(args.mailbox);
  const turnfilePath = path.resolve(args.turnfile);
  const date = args.date || todayYYYYMMDD();
  const mailboxText = readFile(mailboxPath);
  const turnfileText = readFile(turnfilePath);
  const maxMsgSeq = collectMessageSeqs(mailboxText);
  const nextMsgSeq = (maxMsgSeq[date] || 0) + 1;
  const maxSig = collectMaxSignal(turnfileText);
  const revision = collectRevision(turnfileText);

  const output = {
    next_msg_id: `MSG-${date}-${String(nextMsgSeq).padStart(3, "0")}`,
    next_sig_id: `SIG-${String(maxSig + 1).padStart(3, "0")}`,
    next_revision: revision + 1,
    snapshot: deriveSnapshot(mailboxText),
    freshness: {
      mailbox_path: mailboxPath,
      turnfile_path: turnfilePath,
      mailbox_hash: sha256(mailboxText),
      turnfile_hash: sha256(turnfileText),
      revision,
      max_sig: maxSig,
      max_msg_seq: maxMsgSeq,
    },
  };

  console.log(JSON.stringify(output, null, 2));
}

main();
