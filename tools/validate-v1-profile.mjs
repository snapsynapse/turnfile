#!/usr/bin/env node
// PRD-043 R6: v1 Minimal Governance Profile conformance validator.
// Verifies required artifacts, mailbox inbox/open-queue consistency, absence of
// historical-PRD dependencies (per Claude C2 — regex/path/line/id precise), and
// TURNFILE.yaml conformance against schemas/v1/turnfile-v1.schema.json (per Codex
// MSG-20260623-015 step-7 verdict — schema enforcement required by R5 + CONFORMANCE.md).

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.root || ".");
const format = args.format || "human";

const HISTORICAL_PRD_RE = /\bPRD-0(0[1-9]|[1-3][0-9]|4[0-2])\b/g;
const PROVENANCE_HEADER_RE = /^\s*#{1,6}\s+(provenance|optional profiles?|historical|archive)\b/i;
const SECTION_RESET_RE = /^\s*#{1,6}\s+/;

const REQUIRED = [
  "working-session/TURNFILE.yaml",
  "working-session/MAILBOX.md",
  "working-session/WORKLOG.md",
];

const checks = [];
const failures = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  if (!ok) failures.push({ name, detail });
}

// Check 1: required artifacts
for (const rel of REQUIRED) {
  const abs = path.join(root, rel);
  const ok = fs.existsSync(abs);
  record(`required-artifact:${rel}`, ok, ok ? "present" : `missing required v1 artifact ${rel}`);
}

// Check 2: mailbox inbox-snapshot ↔ open-queue consistency
const mailboxPath = path.join(root, "working-session/MAILBOX.md");
if (fs.existsSync(mailboxPath)) {
  const text = fs.readFileSync(mailboxPath, "utf8");
  const snapshotRows = extractTableRows(text, "Inbox Snapshot");
  const queueRows = extractTableRows(text, "Open Queue");
  const queueAgents = new Map();
  for (const r of queueRows) {
    const m = /->\s*([A-Za-z][\w-]*)/.exec(r.cells[1] || "");
    if (m) {
      const key = m[1].toLowerCase();
      queueAgents.set(key, (queueAgents.get(key) || 0) + 1);
    }
  }
  let inconsistent = null;
  for (const r of snapshotRows) {
    const agent = (r.cells[0] || "").trim().toLowerCase();
    const unread = parseInt((r.cells[1] || "0").trim(), 10);
    if (Number.isNaN(unread)) continue;
    const queued = queueAgents.get(agent) || 0;
    if (unread !== queued) {
      inconsistent = { agent, unread, queued };
      break;
    }
  }
  record(
    "mailbox-inbox-queue-consistency",
    inconsistent === null,
    inconsistent
      ? `inbox snapshot says ${inconsistent.agent} unread=${inconsistent.unread} but open queue has ${inconsistent.queued} matching rows`
      : "inbox snapshot matches open queue counts",
  );
}

// Check 3: TURNFILE.yaml schema conformance against schemas/v1/turnfile-v1.schema.json
const turnfilePath = path.join(root, "working-session/TURNFILE.yaml");
if (fs.existsSync(turnfilePath)) {
  const schemaPath = locateV1Schema();
  if (!schemaPath) {
    record("v1-schema-conformance", false, "schemas/v1/turnfile-v1.schema.json not found; cannot enforce v1 schema");
  } else {
    try {
      const yaml = require("js-yaml");
      const Ajv2020 = require("ajv/dist/2020");
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      const ajv = new Ajv2020({ strict: false, allErrors: true });
      const validate = ajv.compile(schema);
      const data = yaml.load(fs.readFileSync(turnfilePath, "utf8"));
      const ok = validate(data);
      if (!ok) {
        const errs = (validate.errors || [])
          .slice(0, 8)
          .map((e) => `${e.instancePath || "/"} ${e.message}`)
          .join("; ");
        record(
          "v1-schema-conformance",
          false,
          `TURNFILE.yaml fails schemas/v1/turnfile-v1.schema.json: ${errs}`,
        );
      } else {
        record("v1-schema-conformance", true, "TURNFILE.yaml validates against schemas/v1/turnfile-v1.schema.json");
      }
      const version = data && data.turnfile && data.turnfile.version;
      const majorOk = typeof version === "string" && /^1\./.test(version);
      record(
        "v1-version-major",
        majorOk,
        majorOk
          ? `turnfile.version=${version} (major 1)`
          : `turnfile.version=${JSON.stringify(version)} does not declare major version 1; v1 conformance requires "1.x" or "1.x.y"`,
      );
    } catch (e) {
      record("v1-schema-conformance", false, `schema validation error: ${e.message}`);
    }
  }
}

// Check 4: historical-PRD dependency scan (Claude C2)
const scanned = scanMarkdownFiles(root);
const leakage = [];
for (const file of scanned) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  let inExclusion = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (PROVENANCE_HEADER_RE.test(line)) {
      inExclusion = true;
      continue;
    }
    if (inExclusion && SECTION_RESET_RE.test(line) && !PROVENANCE_HEADER_RE.test(line)) {
      inExclusion = false;
    }
    if (inExclusion) continue;
    HISTORICAL_PRD_RE.lastIndex = 0;
    let m;
    while ((m = HISTORICAL_PRD_RE.exec(line)) !== null) {
      leakage.push({ path: rel, line: i + 1, id: m[0] });
    }
  }
}
record(
  "historical-PRD-required-reading",
  leakage.length === 0,
  leakage.length === 0
    ? "no historical PRD required-reading dependencies detected"
    : `historical PRD required reading detected: ${leakage
        .map((l) => `${l.path}:${l.line} ${l.id}`)
        .join("; ")}`,
  );
if (leakage.length > 0) failures[failures.length - 1].leakage = leakage;

// Assemble output
const ok = failures.length === 0;
const output = {
  ok,
  profile: "v1-minimal",
  root: root,
  checks,
  failures,
};

if (format === "json") {
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
} else {
  process.stdout.write(`v1-minimal validator @ ${root}\n`);
  for (const c of checks) {
    process.stdout.write(`  [${c.ok ? "ok" : "FAIL"}] ${c.name} — ${c.detail}\n`);
  }
  process.stdout.write(ok ? "PASS\n" : "FAIL\n");
}

process.exit(ok ? 0 : 1);

function locateV1Schema() {
  const candidates = [
    path.join(root, "schemas/v1/turnfile-v1.schema.json"),
    path.join(process.cwd(), "schemas/v1/turnfile-v1.schema.json"),
    path.resolve(path.dirname(new URL(import.meta.url).pathname), "../schemas/v1/turnfile-v1.schema.json"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") out.root = argv[++i];
    else if (a === "--format") out.format = argv[++i];
  }
  return out;
}

function extractTableRows(text, sectionHeader) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  let inSection = false;
  let pastHeader = false;
  for (const line of lines) {
    if (new RegExp(`^##\\s+${sectionHeader}`, "i").test(line)) {
      inSection = true;
      pastHeader = false;
      continue;
    }
    if (inSection && /^##\s+/.test(line)) break;
    if (!inSection) continue;
    if (/^\|/.test(line)) {
      if (!pastHeader) {
        pastHeader = true;
        continue;
      }
      if (/^\|\s*-+/.test(line) || /^\|\s*:?-+:?\s*\|/.test(line)) continue;
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.length > 0) rows.push({ cells });
    }
  }
  return rows;
}

function scanMarkdownFiles(rootDir) {
  const out = [];
  const skip = new Set(["node_modules", ".git", "docs/prds", "examples", "tokenese-pairs", "evals"]);
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      const rel = path.relative(rootDir, abs);
      if (skip.has(rel) || rel.split(path.sep)[0] === "docs" && rel.includes("prds")) continue;
      if (e.isDirectory()) walk(abs);
      else if (e.isFile() && e.name.endsWith(".md")) out.push(abs);
    }
  }
  walk(rootDir);
  return out;
}
