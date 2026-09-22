#!/usr/bin/env node
// validate-public-surface-snapshot.mjs - PRD-034 public and agent-facing surface
// snapshot reconciliation contract.
//
// Detection-only validator. It derives the promoted-PRD count from the registry
// (working-session/docs/PRD_STATUS.json, the single source of truth) and checks
// the current public/agent-facing surfaces for stale promoted-count claims and
// machine-readable freshness markers. Historical surfaces under docs/archive/**
// are excluded: only current public-surface drift fails the gate.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const SURFACES = [
  "README.md",
  "docs/index.html",
  "docs/llms.txt",
  "assistant-guide.txt",
];

const ARCHIVE_PREFIX = path.join("docs", "archive") + path.sep;
const GUIDE_PATH = "assistant-guide.txt";
const SERVED_GUIDE_PATH = "docs/.well-known/assistant-guide.txt";
const MANIFEST_PATH = "assistant-guide-manifest.txt";
const SERVED_MANIFEST_PATH = "docs/.well-known/assistant-guide-manifest.txt";

function usage(exitCode = 0) {
  const out = exitCode === 0 ? console.log : console.error;
  out("Usage: node tools/validate-public-surface-snapshot.mjs [--root <dir>] [--format json]");
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { root: process.cwd(), format: "text" };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage(0);
    } else if (arg === "--root") {
      args.root = argv[i + 1];
      i += 1;
    } else if (arg === "--format") {
      args.format = argv[i + 1];
      i += 1;
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage(1);
    }
  }
  if (!args.root) usage(1);
  if (args.format !== "text" && args.format !== "json") {
    console.error("--format must be text or json");
    process.exit(1);
  }
  return args;
}

function promotedCount(root) {
  const registryPath = path.join(root, "working-session/docs/PRD_STATUS.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  return registry.prds.filter((p) => p.shelf === "docs/prds").length;
}

// A surface path that lives under docs/archive/** is historical and excluded.
function isArchive(relPath) {
  const normalized = relPath.split(path.posix.sep).join(path.sep);
  return normalized.startsWith(ARCHIVE_PREFIX);
}

function checkSurface(root, relPath, expected) {
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs)) return [];
  if (isArchive(relPath)) return [];
  const text = fs.readFileSync(abs, "utf8");
  const findings = [];

  // Machine-readable freshness marker: turnfile:prd-promoted=<N>.
  for (const m of text.matchAll(/turnfile:prd-promoted=(\d+)/g)) {
    const found = Number(m[1]);
    if (found !== expected) {
      findings.push(
        `${relPath}: stale promoted-count marker turnfile:prd-promoted=${found} (registry promoted count is ${expected})`,
      );
    }
  }

  // Human-readable claim: "<N> promoted PRDs".
  for (const m of text.matchAll(/\b(\d+)\s+promoted PRDs\b/gi)) {
    const found = Number(m[1]);
    if (found !== expected) {
      findings.push(
        `${relPath}: stale promoted-count claim "${found} promoted PRDs" (registry promoted count is ${expected})`,
      );
    }
  }

  return findings;
}

function fieldOccurrences(text, field) {
  const pattern = new RegExp(`^${field}(?::|=|\\s|$)`);
  return text.split("\n").filter((line) => pattern.test(line));
}

function exactFieldValue(text, field) {
  const matches = text.match(new RegExp(`^${field}: (\\S(?:.*\\S)?)$`, "gm")) ?? [];
  return matches.length === 1 ? matches[0].slice(field.length + 2) : undefined;
}

function validIsoDate(value) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value
  );
}

function checkGuideContract(root) {
  const findings = [];
  const paths = [GUIDE_PATH, SERVED_GUIDE_PATH, MANIFEST_PATH, SERVED_MANIFEST_PATH];
  for (const relPath of paths) {
    if (!fs.existsSync(path.join(root, relPath))) {
      findings.push(`${relPath}: missing assistant-guide integrity surface`);
    }
  }
  if (findings.length > 0) return findings;

  const guide = fs.readFileSync(path.join(root, GUIDE_PATH));
  const servedGuide = fs.readFileSync(path.join(root, SERVED_GUIDE_PATH));
  const manifest = fs.readFileSync(path.join(root, MANIFEST_PATH), "utf8");
  const servedManifest = fs.readFileSync(path.join(root, SERVED_MANIFEST_PATH), "utf8");

  if (!guide.equals(servedGuide)) {
    findings.push(`${SERVED_GUIDE_PATH}: must be byte-identical to ${GUIDE_PATH}`);
  }
  if (manifest !== servedManifest) {
    findings.push(`${SERVED_MANIFEST_PATH}: must be byte-identical to ${MANIFEST_PATH}`);
  }

  const guideText = guide.toString("utf8");
  if (![...guide].every((byte) => byte === 0x0a || (byte >= 0x20 && byte <= 0x7e))) {
    findings.push(`${GUIDE_PATH}: must contain only LF and printable ASCII bytes`);
  }
  if (guide.byteLength > 8192) {
    findings.push(`${GUIDE_PATH}: must be 8192 bytes or smaller`);
  }
  for (const [index, line] of guideText.split("\n").entries()) {
    if (Buffer.byteLength(line, "utf8") > 120) {
      findings.push(`${GUIDE_PATH}:${index + 1}: line exceeds 120 bytes`);
    }
  }

  const compact = guideText.split("node tools/turnfile.mjs", 1)[0].toLowerCase();
  for (const concepts of [
    ["verify", "verifier"],
    ["achieved level", "guide sha-256", "blocking findings"],
    ["ask the user", "approve proceeding under the reported level"],
    ["do not execute", "before confirmation"],
  ]) {
    if (!concepts.every((concept) => compact.includes(concept))) {
      findings.push(`${GUIDE_PATH}: compact verification instruction missing ${concepts.join(" + ")}`);
    }
  }

  const updatedOccurrences = fieldOccurrences(guideText, "Updated");
  const updated = exactFieldValue(guideText, "Updated");
  if (updatedOccurrences.length !== 1 || updated === undefined || !validIsoDate(updated)) {
    findings.push(`${GUIDE_PATH}: Updated must occur once with a valid YYYY-MM-DD date`);
  }

  const assessmentTargetOccurrences = fieldOccurrences(guideText, "Assessment target");
  const assessmentTarget = exactFieldValue(guideText, "Assessment target");
  if (assessmentTargetOccurrences.length !== 1 || assessmentTarget !== "GuideCheck Level 2") {
    findings.push(`${GUIDE_PATH}: Assessment target must occur once and equal GuideCheck Level 2`);
  }

  for (const [field, expected] of [
    ["Repository", "https://github.com/snapsynapse/turnfile"],
    ["Task scope", "represent Turnfile accurately from this stable v1 reading surface."],
  ]) {
    if (fieldOccurrences(guideText, field).length !== 1 || exactFieldValue(guideText, field) !== expected) {
      findings.push(`${GUIDE_PATH}: ${field} must occur once and equal ${expected}`);
    }
  }

  const spec = fs.readFileSync(path.join(root, "SPEC.md"), "utf8");
  const specVersions = spec.match(/^Version: v(\d+\.\d+\.\d+)$/gm) ?? [];
  if (specVersions.length !== 1) {
    findings.push("SPEC.md: must declare one semantic Version line");
  } else {
    const version = specVersions[0].slice("Version: v".length);
    const guideVersionClaims = [...guideText.matchAll(/the protocol version is v([^\s.]+(?:\.[^\s.]+)*)\./gi)];
    if (guideVersionClaims.length !== 1 || guideVersionClaims[0][1] !== version) {
      findings.push(`${GUIDE_PATH}: must contain one protocol version claim matching SPEC.md v${version}`);
    }
  }

  for (const field of ["file", "sha256", "bytes", "served", "root_copy", "updated", "conformance", "trust"]) {
    if (fieldOccurrences(manifest, field).length !== 1) {
      findings.push(`${MANIFEST_PATH}: field ${field} must occur exactly once`);
    }
    if (exactFieldValue(manifest, field) === undefined) {
      findings.push(`${MANIFEST_PATH}: field ${field} must use key: non-empty-value syntax`);
    }
  }
  const expectedHash = crypto.createHash("sha256").update(guide).digest("hex");
  if (exactFieldValue(manifest, "sha256") !== expectedHash) {
    findings.push(`${MANIFEST_PATH}: sha256 must match ${GUIDE_PATH}`);
  }
  const bytes = exactFieldValue(manifest, "bytes");
  if (!/^(0|[1-9]\d*)$/.test(bytes ?? "") || Number(bytes) !== guide.byteLength) {
    findings.push(`${MANIFEST_PATH}: bytes must be an integer matching ${GUIDE_PATH}`);
  }
  const manifestUpdated = exactFieldValue(manifest, "updated");
  if (!validIsoDate(manifestUpdated ?? "")) {
    findings.push(`${MANIFEST_PATH}: updated must be a valid YYYY-MM-DD date`);
  } else if (manifestUpdated !== updated) {
    findings.push(`${MANIFEST_PATH}: updated must match ${GUIDE_PATH} Updated`);
  }
  for (const [field, expected] of [
    ["file", GUIDE_PATH],
    ["served", "https://turnfile.work/.well-known/assistant-guide.txt"],
    ["root_copy", GUIDE_PATH],
    ["conformance", "GuideCheck Level 2 local structural assessment"],
    ["trust", "legacy same-repository integrity sidecar; not an independent anchor"],
  ]) {
    if (exactFieldValue(manifest, field) !== expected) {
      findings.push(`${MANIFEST_PATH}: field ${field} must equal ${expected}`);
    }
  }

  return findings;
}

function main() {
  const args = parseArgs(process.argv);
  const root = path.resolve(args.root);

  let expected;
  try {
    expected = promotedCount(root);
  } catch (err) {
    const message = `Unable to derive promoted count from working-session/docs/PRD_STATUS.json: ${err.message}`;
    if (args.format === "json") {
      console.log(JSON.stringify({ ok: false, error: message }, null, 2));
    } else {
      console.error(message);
    }
    process.exit(2);
  }

  const findings = [];
  for (const relPath of SURFACES) {
    findings.push(...checkSurface(root, relPath, expected));
  }
  findings.push(...checkGuideContract(root));

  const ok = findings.length === 0;
  if (args.format === "json") {
    console.log(
      JSON.stringify(
        {
          ok,
          promoted_count: expected,
          surfaces: SURFACES,
          archive_excluded: "docs/archive/**",
          findings,
        },
        null,
        2,
      ),
    );
  } else if (ok) {
    console.log(`PASS: current public/agent surfaces report ${expected} promoted PRDs (registry-derived).`);
  } else {
    console.error(`FAIL: stale promoted-count claims on current public/agent surfaces (registry promoted count is ${expected}):`);
    for (const f of findings) console.error(`  - ${f}`);
  }

  process.exit(ok ? 0 : 1);
}

main();
