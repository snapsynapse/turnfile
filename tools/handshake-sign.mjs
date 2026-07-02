#!/usr/bin/env node
// handshake-sign.mjs — session handshake sign-off (PRD-017 + PRD-030 boot).
//
// Replaces the manual 12+ edit boot ceremony with one tool call. Reads TURNFILE,
// WORKLOG, and NEXT_SESSION_HANDSHAKE, derives next-state, then writes them
// with a hash-based pre-write collision guard. Writes are sequential (not
// atomic-or-nothing); on a mid-write fs failure the script prints a PARTIAL
// WRITE warning and exits non-zero so the agent can verify and re-run.
// Validators run after writes to catch any inconsistency. Emits a Tokenese-
// leading dense block alongside the English source-wins row (Tier-B; charter
// A1; PRD-027/PRD-024 govern the bounded Tokenese exception).
//
// Scope: signing a session-N handshake row + opening agent state + heartbeat
// negotiation summary. Does NOT touch mailbox lifecycle (separate concern).

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const ROOT = process.cwd();
const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TURNFILE = "working-session/TURNFILE.yaml";
const WORKLOG = "working-session/WORKLOG.md";
const HANDSHAKE = "working-session/NEXT_SESSION_HANDSHAKE.md";
const MAILBOX = "working-session/MAILBOX.md";
const PRD_STATUS = "working-session/docs/PRD_STATUS.json";

function usage(code = 0) {
  const out = code === 0 ? console.log : console.error;
  out(`Usage: node tools/handshake-sign.mjs --agent <claude|codex|gemini> [mode flags] [--dry-run]

Two input modes (PRD-044). Pick one.

PAYLOAD MODE (JSON file or stdin):
  node tools/handshake-sign.mjs --agent claude --payload payload.json
  node tools/handshake-sign.mjs --agent claude --payload -

  Payload schema (JSON):
  {
    "session": 21,
    "model": "Opus 4.8",
    "surface": "Claude Code",
    "scope_ack": ["gov-peer-conv", "infra-031", "tk-035"],
    "heartbeat": {"cadence": "5m", "policy": "notify-material", "stop": "close", "owner": "self"},
    "gates": "ok",
    "tokenese_lead": true
  }

DIRECT FLAG MODE (preferred for human-driven session opens, PRD-044 R1). Example:
  node tools/handshake-sign.mjs --agent claude --session 29 \\
    --model "Opus 4.7" --surface "Claude Code" \\
    --scope stable-release --scope protocol-refinement

  Flags:
    --session <N>                   required
    --model <label>                 required
    --surface <label>               required
    --scope <value>                 required (repeatable for multiple lanes)
    --instance <id>                 optional same-family instance id (PRD-049)
    --heartbeat-cadence <value>     default "5m"
    --heartbeat-policy <value>      default "notify-material"
    --heartbeat-stop <value>        default "close"
    --heartbeat-owner <value>       default "self"
    --tokenese-lead                 set tokenese_lead=true (default)
    --no-tokenese-lead              set tokenese_lead=false
    --gates <value>                 default "ok"

  Defaults match the 5m self-owned read-only steward terms used since session 21.

  --payload cannot be combined with --session/--model/--surface/--scope (R3).

Common:
  --dry-run                        emit JSON describing the planned write; no files touched
  -h, --help                       this help`);
  process.exit(code);
}

const DIRECT_PAYLOAD_FLAGS = new Set([
  "--session", "--model", "--surface", "--scope", "--instance",
  "--heartbeat-cadence", "--heartbeat-policy", "--heartbeat-stop", "--heartbeat-owner",
  "--tokenese-lead", "--no-tokenese-lead", "--gates",
]);

function parseArgs(argv) {
  const a = { dryRun: false, direct: {} };
  let sawDirect = false;
  for (let i = 2; i < argv.length; i += 1) {
    const v = argv[i];
    if (v === "-h" || v === "--help") usage(0);
    else if (v === "--agent") a.agent = argv[++i];
    else if (v === "--payload") a.payload = argv[++i];
    else if (v === "--dry-run") a.dryRun = true;
    else if (v === "--session") { a.direct.session = Number(argv[++i]); sawDirect = true; }
    else if (v === "--model") { a.direct.model = argv[++i]; sawDirect = true; }
    else if (v === "--surface") { a.direct.surface = argv[++i]; sawDirect = true; }
    else if (v === "--instance") { a.direct.instance = argv[++i]; sawDirect = true; }
    else if (v === "--scope") {
      a.direct.scope_ack = a.direct.scope_ack || [];
      a.direct.scope_ack.push(argv[++i]);
      sawDirect = true;
    }
    else if (v === "--heartbeat-cadence") { a.direct.cadence = argv[++i]; sawDirect = true; }
    else if (v === "--heartbeat-policy") { a.direct.policy = argv[++i]; sawDirect = true; }
    else if (v === "--heartbeat-stop") { a.direct.stop = argv[++i]; sawDirect = true; }
    else if (v === "--heartbeat-owner") { a.direct.owner = argv[++i]; sawDirect = true; }
    else if (v === "--tokenese-lead") { a.direct.tokenese_lead = true; sawDirect = true; }
    else if (v === "--no-tokenese-lead") { a.direct.tokenese_lead = false; sawDirect = true; }
    else if (v === "--gates") { a.direct.gates = argv[++i]; sawDirect = true; }
    else { console.error(`unknown arg: ${v}`); usage(1); }
  }
  if (!a.agent) usage(1);
  if (!["claude", "codex", "gemini"].includes(a.agent)) {
    console.error("--agent must be claude|codex|gemini"); process.exit(1);
  }
  // R3: payload mode and direct payload flags cannot be combined.
  if (a.payload && sawDirect) {
    console.error("handshake-sign: cannot combine --payload with direct payload flags (--session/--model/--surface/--scope/--heartbeat-*). Pick one input mode (PRD-044 R3).");
    process.exit(1);
  }
  if (!a.payload && !sawDirect) usage(1);
  a.sawDirect = sawDirect;
  return a;
}

function payloadFromDirect(d) {
  if (typeof d.session !== "number" || Number.isNaN(d.session)) {
    console.error("--session <number> is required in direct flag mode"); process.exit(1);
  }
  if (!d.model) { console.error("--model <label> is required in direct flag mode"); process.exit(1); }
  if (!d.surface) { console.error("--surface <label> is required in direct flag mode"); process.exit(1); }
  if (!d.scope_ack || d.scope_ack.length === 0) {
    console.error("--scope must be supplied at least once in direct flag mode"); process.exit(1);
  }
  return {
    session: d.session,
    model: d.model,
    surface: d.surface,
    instance: d.instance || null,
    scope_ack: d.scope_ack,
    heartbeat: {
      cadence: d.cadence || "5m",
      policy: d.policy || "notify-material",
      stop: d.stop || "close",
      owner: d.owner || "self",
    },
    gates: d.gates || "ok",
    tokenese_lead: d.tokenese_lead === undefined ? true : d.tokenese_lead,
  };
}

function read(p) { return fs.readFileSync(p, "utf8"); }
function sha(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }

function prdCount() {
  if (!fs.existsSync(PRD_STATUS)) {
    const existing = fs.existsSync(HANDSHAKE) ? read(HANDSHAKE) : "";
    const match = existing.match(/PRD_STATUS\s+(\d+)\s+PRDs/);
    return match ? Number(match[1]) : 0;
  }
  const registry = JSON.parse(read(PRD_STATUS));
  return Array.isArray(registry.prds) ? registry.prds.length : 0;
}

function loadPayload(spec) {
  const text = spec === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(spec, "utf8");
  return JSON.parse(text);
}

function assertInstanceCap(agent, payload, tfRaw) {
  if (!payload.instance) return;
  let parsed;
  try {
    const yaml = require("js-yaml");
    parsed = yaml.load(tfRaw);
  } catch (error) {
    console.error(`handshake-sign: cannot inspect existing instances before boot: ${error.message}`);
    process.exit(1);
  }
  const instances = parsed?.agents?.[agent]?.instances || {};
  const liveInstances = instances && typeof instances === "object" ? Object.keys(instances) : [];
  if (!liveInstances.includes(payload.instance) && liveInstances.length >= 3) {
    console.error(
      `handshake-sign: refusing fourth same-family instance '${agent}/${payload.instance}'; ` +
      `family '${agent}' already has ${liveInstances.length} live instances ` +
      `(${liveInstances.join(", ")}); cap is 3.`,
    );
    process.exit(1);
  }
}

function deriveNextState(tf, mb) {
  const revMatch = tf.match(/^\s*revision:\s*(\d+)\s*$/m);
  if (!revMatch) { console.error("no coordination.revision in TURNFILE"); process.exit(1); }
  const rev = Number(revMatch[1]);
  let maxSig = 0;
  for (const m of tf.matchAll(/\bSIG-(\d{3,})\b/g)) maxSig = Math.max(maxSig, Number(m[1]));
  return { rev, nextRev: rev + 1, nextSig: `SIG-${String(maxSig + 1).padStart(3, "0")}` };
}

function replaceOrFail(text, re, replacement, label) {
  if (!re.test(text)) {
    throw new Error(`handshake-sign: ${label} pattern not matched; aborting (no writes performed)`);
  }
  return text.replace(re, replacement);
}

function bumpTurnfile(tf, agent, payload, nextRev, nextSig) {
  const cap = agent[0].toUpperCase() + agent.slice(1);
  const session = `${agent}-session-${payload.session}`;
  const task = `s${payload.session}-handshake-heartbeat`;
  const detail =
    `${cap} (${payload.model}) session ${payload.session} booted via handshake-sign. ` +
    `Gates ${payload.gates}. ACK lanes [${payload.scope_ack.join(", ")}]. ` +
    `Heartbeat cad=${payload.heartbeat.cadence} owner=${payload.heartbeat.owner} ` +
    `notify=${payload.heartbeat.policy} stop=${payload.heartbeat.stop}. ` +
    `${cap} active on ${task}; no locks.`;

  // header (C4: verify match before replacing)
  tf = replaceOrFail(tf, /^# Last modified revision: \d+$/m, `# Last modified revision: ${nextRev}`, "header.revision");
  tf = replaceOrFail(tf, /^# Modified by: \w+$/m, `# Modified by: ${agent}`, "header.modified_by");

  // coordination.revision
  tf = replaceOrFail(tf, /(coordination:\s*\n\s*revision:\s*)\d+/, `$1${nextRev}`, "coordination.revision");

  // agent block
  const blockRe = new RegExp(
    `(  ${agent}:\\s*\\n` +
    `    role:\\s*"agent"\\s*\\n` +
    `    status:\\s*)"[^"]*"(\\s*\\n` +
    `    current_task:\\s*)(?:null|"[^"]*")(\\s*\\n` +
    `    last_seen:\\s*)(?:null|"[^"]*")(\\s*\\n` +
    `    session_id:\\s*)(?:null|"[^"]*")`
  );
  tf = replaceOrFail(tf, blockRe,
    `$1"active"$2"${task}"$3"${agent}-session-${payload.session}-open"$4"${session}"`,
    `agents.${agent}`);

  if (!new RegExp(`\\n    ${task}:\\s*\\n`).test(tf)) {
    const taskEntry =
      `    ${task}:\n` +
      `      description: ${JSON.stringify(`Session ${payload.session} handshake + heartbeat negotiation.`)}\n` +
      `      owner: ${JSON.stringify(agent)}\n` +
      `      status: "in_progress"\n` +
      `      priority: "P1"\n` +
      `      depends_on: []\n` +
      `      created_by: ${JSON.stringify(agent)}\n` +
      `      created_rev: ${nextRev}\n` +
      `      claim_rev: ${nextRev}\n` +
      `      completed_rev: null\n` +
      `      notes: ${JSON.stringify("Auto-created by handshake-sign per PRD-037 OQ-D.")}\n`;
    if (/\n  tasks:\s*\{\}\s*\n/.test(tf)) {
      tf = replaceOrFail(tf, /\n  tasks:\s*\{\}\s*\n/, `\n  tasks:\n${taskEntry}`, "coordination.tasks");
    } else {
      tf = replaceOrFail(tf, /(\n  tasks:\n)/, `$1${taskEntry}`, "coordination.tasks");
    }
  }

  // signal entry at top of messages list
  const sigEntry =
    `  - id: "${nextSig}"\n` +
    `    from: "${agent}"\n` +
    `    to: "all"\n` +
    `    signal: "ready"\n` +
    `    rev: ${nextRev}\n` +
    `    detail: ${JSON.stringify(detail)}\n`;
  if (/^messages:\s*\[\]\s*$/m.test(tf)) {
    tf = replaceOrFail(tf, /^messages:\s*\[\]\s*$/m, `messages:\n${sigEntry.trimEnd()}`, "messages.head");
  } else {
    tf = replaceOrFail(tf, /^messages:\n/m, `messages:\n${sigEntry}`, "messages.head");
  }

  return tf;
}

function denseRow(agent, payload, nextRev, count) {
  const lanes = payload.scope_ack.join(", ");
  const hb = payload.heartbeat;
  const hbMode = hb.mode === "write-capable" ? "write-capable" : "read-only-steward";
  const hbScope = hb.mode === "write-capable" && hb.write_scope ? ` scope:${String(hb.write_scope).replace(/\s+/g, "_")}` : "";
  return (
    `\`\`\`tokenese\n` +
    `^grammar:v0.3\n` +
    `@${agent} := agent:${agent} :${payload.model.replace(/\s+/g, "")} :${payload.surface.replace(/\s+/g, "")} s${payload.session}\n` +
    `say @${agent} rev:${nextRev} prd:${count} gates:${payload.gates} ev:obs\n` +
    `say @${agent} ack lanes:[${lanes}]\n` +
    `say @${agent} hb mode:${hbMode} cad:${hb.cadence} own:${hb.owner} notify:${hb.policy} stop:${hb.stop}${hbScope}\n` +
    `tokenese ok v:0.1 @${agent} session:${payload.session} ev:obs\n` +
    `\`\`\`\n`
  );
}

function englishRow(agent, payload, nextRev, count) {
  const cap = agent[0].toUpperCase() + agent.slice(1);
  const lanes = payload.scope_ack.join(", ");
  const hb = payload.heartbeat;
  const heartbeatMode = hb.mode === "write-capable"
    ? `write-capable heartbeat, scope=${hb.write_scope || "UNSPECIFIED-SCOPE"}`
    : "read-only steward, write-capable only by explicit elevated scope";
  return `| ${cap} | yes — Turnfile v0.1 (rev ${nextRev}); PRD_STATUS ${count} PRDs | yes — grammar v0.3; TKAB \`tkab-check-1.1\`; Tier-B twins authorized, English source-wins | yes — gates ${payload.gates}; model ledger ${payload.model} / ${payload.surface} | ACK — ${lanes} | ${hb.cadence} ${hb.owner}-owned ${heartbeatMode}, notify=${hb.policy}, stop=${hb.stop} | guard active; \`core.hooksPath=tools/hooks\` | ${cap} (${payload.model}) — ${new Date().toISOString().slice(0, 10)} |`;
}

function signHandshake(hs, agent, payload, nextRev) {
  const cap = agent[0].toUpperCase() + agent.slice(1);
  const sessionHeader = `## Sign-off (session ${payload.session})`;
  const count = prdCount();
  const dense = denseRow(agent, payload, nextRev, count);
  const english = englishRow(agent, payload, nextRev, count);

  // Try to replace a "pending" placeholder row
  const placeholderRe = new RegExp(`\\| ${cap} \\| pending[^\\n]*\\|`, "m");
  if (placeholderRe.test(hs)) {
    hs = hs.replace(placeholderRe, english);
  } else if (hs.includes(sessionHeader)) {
    // C5: append AFTER the last table row in this session's section.
    // Bound the section to the next "## " header or EOF.
    const idx = hs.indexOf(sessionHeader);
    const after = idx + sessionHeader.length;
    const nextSection = hs.indexOf("\n## ", after);
    const sectionEnd = nextSection === -1 ? hs.length : nextSection;
    const section = hs.slice(idx, sectionEnd);
    const lines = section.split("\n");
    // Find the LAST line that looks like a table row (starts with "|")
    let lastRowIdx = -1;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].trimStart().startsWith("|") && lines[i].trim().endsWith("|")) lastRowIdx = i;
    }
    if (lastRowIdx === -1) {
      throw new Error(`handshake-sign: session ${payload.session} header exists but no table rows found; refusing to append (no writes performed)`);
    }
    lines.splice(lastRowIdx + 1, 0, english);
    hs = hs.slice(0, idx) + lines.join("\n") + hs.slice(sectionEnd);
  } else {
    // Create section
    const block =
      `\n## Sign-off (session ${payload.session})\n\n` +
      `${dense}\n` +
      `| Agent | Protocol baseline | Tokenese | Skills | Scope | Heartbeat | Identity enforcing | Signed |\n` +
      `|-------|---|---|---|---|---|---|---|\n` +
      `${english}\n`;
    hs += block;
    return hs;
  }
  // Inject dense block once per session if not present
  const denseMarker = `@${agent} := agent:${agent}`;
  if (!hs.includes(denseMarker)) {
    const idx = hs.indexOf(sessionHeader);
    const tableStart = hs.indexOf("\n| Agent", idx);
    if (tableStart !== -1) hs = hs.slice(0, tableStart) + `\n${dense}` + hs.slice(tableStart);
  }
  return hs;
}

function updateWorklog(wl, agent, payload, nextRev) {
  const cap = agent[0].toUpperCase() + agent.slice(1);
  const line =
    `Now Working (${cap}): SESSION ${payload.session} OPEN (${payload.model}). ` +
    `Boot via handshake-sign tool. Gates ${payload.gates}. ` +
    `ACK lanes [${payload.scope_ack.join(", ")}]. ` +
    `Heartbeat: ${payload.heartbeat.cadence} ${payload.heartbeat.owner}-owned, ` +
    `notify=${payload.heartbeat.policy}, stop=${payload.heartbeat.stop}. ` +
    `rev advanced to ${nextRev}; ${cap} active on s${payload.session}-handshake-heartbeat; no locks.`;
  const re = new RegExp(`^Now Working \\(${cap}\\):[^\\n]*$`, "m");
  if (re.test(wl)) return wl.replace(re, line);
  // insert after the last "Now Working" line
  const lines = wl.split("\n");
  let lastIdx = -1;
  for (let i = 0; i < lines.length; i += 1) if (lines[i].startsWith("Now Working")) lastIdx = i;
  if (lastIdx >= 0) {
    lines.splice(lastIdx + 1, 0, line);
    return lines.join("\n");
  }
  return wl + "\n" + line + "\n";
}

function runTool(script, args) {
  const result = spawnSync(process.execPath, [path.join(REPO_ROOT, script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe",
  });
  return {
    ok: result.status === 0,
    out: `${result.stdout || ""}${result.stderr || ""}`,
  };
}

function main() {
  const args = parseArgs(process.argv);
  const payload = args.sawDirect ? payloadFromDirect(args.direct) : loadPayload(args.payload);
  for (const k of ["session", "model", "surface", "scope_ack", "heartbeat", "gates"]) {
    if (!(k in payload)) { console.error(`payload missing: ${k}`); process.exit(1); }
  }

  const tfBefore = read(TURNFILE);
  const wlBefore = read(WORKLOG);
  const hsBefore = read(HANDSHAKE);
  const tfHash = sha(tfBefore), wlHash = sha(wlBefore), hsHash = sha(hsBefore);

  const { rev, nextRev, nextSig } = deriveNextState(tfBefore, read(MAILBOX));
  assertInstanceCap(args.agent, payload, tfBefore);

  const tfAfter = bumpTurnfile(tfBefore, args.agent, payload, nextRev, nextSig);
  const hsAfter = signHandshake(hsBefore, args.agent, payload, nextRev);
  const wlAfter = updateWorklog(wlBefore, args.agent, payload, nextRev);

  if (args.dryRun) {
    console.log(JSON.stringify({
      ok: true, dry_run: true, agent: args.agent, prev_rev: rev, next_rev: nextRev,
      next_sig: nextSig,
      payload,
      changed: {
        TURNFILE: tfAfter !== tfBefore,
        WORKLOG: wlAfter !== wlBefore,
        HANDSHAKE: hsAfter !== hsBefore,
      },
    }, null, 2));
    return;
  }

  // collision guard: re-read and confirm no peer wrote between our read and write
  if (sha(read(TURNFILE)) !== tfHash || sha(read(WORKLOG)) !== wlHash || sha(read(HANDSHAKE)) !== hsHash) {
    console.error("handshake-sign: peer modified shared files mid-write; re-run");
    process.exit(2);
  }

  // C3: sequential writes, NOT atomic-or-nothing. Pre-write collision guard
  // protects against the common case (peer wrote between read and write).
  // If a mid-write fs error occurs, the previous file(s) already landed —
  // print a PARTIAL WRITE warning so the caller can verify with validators.
  let written = [];
  try {
    fs.writeFileSync(TURNFILE, tfAfter); written.push("TURNFILE");
    fs.writeFileSync(HANDSHAKE, hsAfter); written.push("HANDSHAKE");
    fs.writeFileSync(WORKLOG, wlAfter); written.push("WORKLOG");
  } catch (e) {
    console.error(`handshake-sign: PARTIAL WRITE — wrote [${written.join(", ")}] then failed on next file: ${e.message}. Verify file integrity with turnfile-lint + mailbox-invariants + diff; re-run handshake-sign after fixing.`);
    process.exit(6);
  }

  // Re-export MAILBOX.json (no mailbox edits here, but keep projection fresh)
  const exp = runTool("tools/export-mailbox-json.mjs", [MAILBOX, "working-session/MAILBOX.json"]);
  if (!exp.ok) { console.error("export-mailbox-json failed:", exp.out); process.exit(3); }

  const lint = runTool("tools/turnfile-lint.mjs", [
    "--turnfile", TURNFILE,
    "--schema", path.join(REPO_ROOT, "schemas/turnfile/turnfile-v0.schema.json"),
  ]);
  if (!lint.ok) { console.error("turnfile-lint failed:", lint.out); process.exit(4); }
  const mbInv = runTool("tools/validate-mailbox-invariants.mjs", ["--mailbox", MAILBOX]);
  if (!mbInv.ok) { console.error("mailbox-invariants failed:", mbInv.out); process.exit(5); }

  console.log(JSON.stringify({
    ok: true, agent: args.agent, prev_rev: rev, next_rev: nextRev, sig: nextSig,
    files: { TURNFILE: "written", HANDSHAKE: "written", WORKLOG: "written" },
    validators: { turnfile_lint: "PASS", mailbox_invariants: "PASS" },
  }, null, 2));
}

main();
