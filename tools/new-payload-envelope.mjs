#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";

const MAX_BYTES = 16 * 1024;
const MAX_LINES = 300;

function usage() {
  console.error(
    "Usage: node tools/new-payload-envelope.mjs --topic <slug> --format <unified-diff|full-text> --scope <full|critical-only|interface-only> --files <a,b,c> [--seq <id>] [--part <n/m>] [--ask <value>] [--payload-file <path>]",
  );
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const val = argv[i + 1];
    if (!val || val.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = val;
    i += 1;
  }
  return args;
}

function sanitizeTopic(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizePayload(raw) {
  return raw.replace(/\r\n/g, "\n");
}

function checksum8(payload) {
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex").slice(0, 8);
}

function parsePart(partRaw) {
  if (!partRaw) {
    return null;
  }
  const m = /^(\d+)\/(\d+)$/.exec(partRaw.trim());
  if (!m) {
    throw new Error("--part must be in n/m format, e.g. 1/3");
  }
  const index = Number.parseInt(m[1], 10);
  const total = Number.parseInt(m[2], 10);
  if (index < 1 || total < 1 || index > total) {
    throw new Error("--part values are invalid");
  }
  return { index, total };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const args = parseArgs(process.argv);

  const topic = sanitizeTopic(args.topic || "");
  const format = args.format || "unified-diff";
  const scope = args.scope || "full";
  const seq = args.seq || "01";
  const ask = args.ask || "apply-or-counter";
  const files = (args.files || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!topic) {
    usage();
    throw new Error("--topic is required");
  }
  if (!["unified-diff", "full-text"].includes(format)) {
    throw new Error("--format must be unified-diff or full-text");
  }
  if (!["full", "critical-only", "interface-only"].includes(scope)) {
    throw new Error("--scope must be full, critical-only, or interface-only");
  }
  if (files.length === 0) {
    throw new Error("--files requires at least one comma-separated path");
  }

  const part = parsePart(args.part);
  let payload = "";

  if (args["payload-file"]) {
    payload = fs.readFileSync(args["payload-file"], "utf8");
  } else if (!process.stdin.isTTY) {
    payload = await readStdin();
  }

  payload = normalizePayload(payload);
  if (!payload.trim()) {
    payload = "<insert payload>\n";
  }

  const payloadBytes = Buffer.byteLength(payload, "utf8");
  const payloadLines = payload.split("\n").length;

  if ((payloadBytes > MAX_BYTES || payloadLines > MAX_LINES) && !part) {
    throw new Error(
      `Payload exceeds cap (${MAX_BYTES} bytes / ${MAX_LINES} lines). Provide --part n/m and split payload.`,
    );
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const hash = checksum8(payload);
  let revision = `REV-${date}-${topic}-${seq}-h${hash}`;
  if (part) {
    revision = `${revision}-p${part.index}of${part.total}`;
  }

  const fence = format === "unified-diff" ? "diff" : "text";
  const partLine = part ? `Part: ${part.index}/${part.total}\n` : "";

  const out = [
    `Revision: ${revision}`,
    `Format: ${format}`,
    `Review scope: ${scope}`,
    `Ask: ${ask}`,
    partLine ? partLine.trimEnd() : null,
    "Files:",
    ...files.map((f) => `  - ${f}`),
    "",
    `\`\`\`${fence}`,
    payload.endsWith("\n") ? payload.slice(0, -1) : payload,
    "```",
    "",
  ]
    .filter((v) => v !== null)
    .join("\n");

  process.stdout.write(out);
}

main().catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

