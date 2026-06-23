#!/usr/bin/env node
// PRD-045 R7: stale-agent reconciliation tool.
// Modes:
//   detect — read-only; emit suspected-stale indicators
//   plan   — read-only; emit proposed shared-state patch + maintainer-authorization requirement
//   apply  — write shared control-plane changes (agents.<id> + signal); refuses without
//            --maintainer-authorization; never touches peer-owned boot/chat/shard/skill files.
//
// Boundary (PRD-045 R3/R6 + OQ-069): only agents.<id> + signal entries are mutated.
// Peer-owned paths (boot-<agent>.md, chat-<agent>.md, working-session/agents/<agent>/,
// skills/<agent>/, .agents/skills/turnfile-protocol-<agent>/) are never opened for write.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const ROOT = process.cwd();
const TURNFILE = path.join(ROOT, "working-session/TURNFILE.yaml");

if (!args.agent) fail("--agent <id> required");
if (!["detect", "plan", "apply"].includes(args.mode)) fail("--mode must be detect|plan|apply");

const tfText = fs.readFileSync(TURNFILE, "utf8");
const tf = parseTurnfile(tfText);
const agentBlock = tf.agents[args.agent];
if (!agentBlock) fail(`agent '${args.agent}' not found in TURNFILE.yaml`);

const indicators = detectIndicators(args.agent, tf);
const sessionLabel = agentBlock.session_id || `${args.agent}-session-unknown`;
const reconciler = args.maintainerAuthorization ? "maintainer" : "self";
const nextRev = tf.coordination.revision + 1;
const marker = `${sessionLabel}-stale-reconciled-by-${reconciler}-rev${nextRev}`;

if (args.mode === "detect") {
  emit({
    agent: args.agent,
    mode: "detect",
    status: indicators.length > 0 ? "suspected-stale" : "active",
    indicators,
    peer_owned_files_touched: false,
  });
  process.exit(0);
}

if (args.mode === "plan") {
  emit({
    agent: args.agent,
    mode: "plan",
    requires_maintainer_authorization: true,
    proposed_changes: {
      agents: {
        [args.agent]: {
          status: "offline",
          current_task: null,
          session_id: null,
        },
      },
      last_seen_marker: marker,
      signal: `add SIG entry recording stale-reconciliation evidence at rev ${nextRev}`,
    },
    indicators,
    peer_owned_files_touched: false,
  });
  process.exit(0);
}

// apply
if (!args.maintainerAuthorization) {
  fail("apply mode requires --maintainer-authorization <evidence-string> (PRD-045 R3)");
}

const newTf = applyReconciliation(tfText, args.agent, marker, nextRev, args.maintainerAuthorization);
fs.writeFileSync(TURNFILE, newTf);
emit({
  agent: args.agent,
  mode: "apply",
  applied: true,
  prev_rev: tf.coordination.revision,
  next_rev: nextRev,
  last_seen_marker: marker,
  maintainer_authorization: args.maintainerAuthorization,
  peer_owned_files_touched: false,
});
process.exit(0);

// ===== helpers =====

function parseArgs(argv) {
  const out = { mode: "detect", format: "human" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--agent") out.agent = argv[++i];
    else if (a === "--mode") out.mode = argv[++i];
    else if (a === "--format") out.format = argv[++i];
    else if (a === "--maintainer-authorization") out.maintainerAuthorization = argv[++i];
  }
  return out;
}

function fail(msg) {
  process.stderr.write(`reconcile-stale-agent: ${msg}\n`);
  if (args && args.format === "json") {
    process.stdout.write(JSON.stringify({ ok: false, error: msg }) + "\n");
  }
  process.exit(1);
}

function emit(obj) {
  if (args.format === "json") {
    process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
  } else {
    process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
  }
}

function parseTurnfile(text) {
  const out = { agents: {}, maintainer: {}, coordination: { revision: 0 } };
  const lines = text.split(/\r?\n/);
  let section = null;
  let currentAgent = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^agents:\s*$/.test(line)) { section = "agents"; continue; }
    if (/^maintainer:\s*$/.test(line)) { section = "maintainer"; continue; }
    if (/^coordination:\s*$/.test(line)) { section = "coordination"; continue; }
    if (/^[a-z]/.test(line)) { section = null; continue; }

    if (section === "agents") {
      const agentMatch = /^  ([a-z][\w-]*):\s*$/.exec(line);
      if (agentMatch) {
        currentAgent = agentMatch[1];
        out.agents[currentAgent] = {};
        continue;
      }
      const kvMatch = /^    (\w+):\s*(.*)$/.exec(line);
      if (kvMatch && currentAgent) {
        out.agents[currentAgent][kvMatch[1]] = parseValue(kvMatch[2]);
      }
    } else if (section === "coordination") {
      const m = /^  revision:\s*(\d+)/.exec(line);
      if (m) out.coordination.revision = Number(m[1]);
    } else if (section === "maintainer") {
      const m = /^  last_seen:\s*"([^"]+)"/.exec(line);
      if (m) out.maintainer.last_seen = m[1];
    }
  }
  return out;
}

function parseValue(raw) {
  const t = raw.trim();
  if (t === "null") return null;
  const m = /^"(.*)"$/.exec(t);
  if (m) return m[1];
  return t;
}

function detectIndicators(agentId, tf) {
  const indicators = [];
  const a = tf.agents[agentId];
  if (!a) return indicators;
  if (a.status === "active") {
    const agentSession = sessionNumber(a.last_seen);
    const newerSession = otherAgents(tf, agentId).some((peer) => {
      const peerSession = sessionNumber(peer.last_seen);
      return peerSession !== null && agentSession !== null && peerSession > agentSession;
    });
    if (newerSession) {
      indicators.push(`agent.status=active but another agent is on a newer session (last_seen=${a.last_seen})`);
    }
  }
  if (a.current_task && a.status === "active") {
    indicators.push(`agent holds current_task=${a.current_task} while another session may have opened`);
  }
  const mSession = sessionNumber(tf.maintainer && tf.maintainer.last_seen);
  const aSession = sessionNumber(a.last_seen);
  if (mSession !== null && aSession !== null && mSession > aSession) {
    indicators.push(`maintainer.last_seen session ${mSession} > agent.last_seen session ${aSession}`);
  }
  return indicators;
}

function otherAgents(tf, exceptId) {
  return Object.entries(tf.agents)
    .filter(([id]) => id !== exceptId)
    .map(([, v]) => v);
}

function sessionNumber(lastSeen) {
  if (!lastSeen) return null;
  const m = /session-(\d+)/.exec(lastSeen);
  return m ? Number(m[1]) : null;
}

function applyReconciliation(text, agentId, marker, nextRev, authorization) {
  let next = text;
  const blockRe = new RegExp(
    `(  ${agentId}:\\s*\\n` +
    `    role:\\s*"[^"]*"\\s*\\n` +
    `    status:\\s*)"[^"]*"(\\s*\\n` +
    `    current_task:\\s*)(?:null|"[^"]*")(\\s*\\n` +
    `    last_seen:\\s*)"[^"]*"(\\s*\\n` +
    `    session_id:\\s*)(?:null|"[^"]*")`,
  );
  if (!blockRe.test(next)) {
    fail(`could not locate agents.${agentId} block in TURNFILE.yaml`);
  }
  next = next.replace(blockRe, `$1"offline"$2null$3"${marker}"$4null`);

  next = next.replace(/^# Last modified revision: \d+$/m, `# Last modified revision: ${nextRev}`);
  next = next.replace(/^# Modified by: \w+$/m, `# Modified by: reconcile-stale-agent`);
  next = next.replace(/(coordination:\s*\n\s*revision:\s*)\d+/, `$1${nextRev}`);

  const maxSig = (() => {
    let m = 0;
    for (const match of next.matchAll(/\bSIG-(\d{3,})\b/g)) m = Math.max(m, Number(match[1]));
    return m;
  })();
  const nextSig = `SIG-${String(maxSig + 1).padStart(3, "0")}`;
  const sigEntry =
    `  - id: "${nextSig}"\n` +
    `    from: "reconcile-stale-agent"\n` +
    `    to: "all"\n` +
    `    signal: "notify"\n` +
    `    rev: ${nextRev}\n` +
    `    detail: ${JSON.stringify(`stale-reconciliation applied to agents.${agentId}. last_seen marker: ${marker}. Maintainer authorization: ${authorization}. Boundary: shared control-plane state only; peer-owned boot/chat/shard/skill files untouched. PRD-045 R4/R6.`)}\n`;
  if (/^messages:\s*$/m.test(next)) {
    next = next.replace(/^messages:\n/m, `messages:\n${sigEntry}`);
  } else {
    next = next.replace(/^messages:\s*\[\]\s*$/m, `messages:\n${sigEntry}`);
  }

  if (!/^locks:\s*/m.test(next)) {
    next = next.replace(/^messages:/m, "locks: {}\n\nturn_queue: []\n\nmessages:");
  } else if (!/^turn_queue:\s*/m.test(next)) {
    next = next.replace(/^messages:/m, "turn_queue: []\n\nmessages:");
  }

  return next;
}
