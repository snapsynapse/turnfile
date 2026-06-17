#!/usr/bin/env node
// PRD-017 boot-sequence validator (read-only).
// Checks that the control-plane artifacts an agent needs to boot exist, and that
// chat-file semantics hold: missing control-plane files BLOCK (exit nonzero);
// a missing PEER chat file is a WARNING only (exit 0) — boot never creates peer chats.
//
//   node tools/validate-boot-sequence.mjs --root <dir> --agent <name> [--format human|json]
//
// Control-plane (required, under <root>/working-session/): TURNFILE.yaml, MAILBOX.md, WORKLOG.md.
// Own chat: chat-<agent>.md (warning if missing). Peer chat: chat-<peer>.md (warning only).
import fs from "node:fs";
import path from "node:path";

const CONTROL_PLANE = ["TURNFILE.yaml", "MAILBOX.md", "WORKLOG.md"];

function parseArgs(argv) {
  const args = { root: ".", agent: null, format: "human" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--root") args.root = argv[++i] || ".";
    else if (a === "--agent") args.agent = argv[++i] || null;
    else if (a === "--format") args.format = argv[++i] || "human";
    else if (a === "-h" || a === "--help") { console.log("see header"); process.exit(0); }
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!args.agent) throw new Error("--agent is required");
  return args;
}

function peerOf(agent) {
  if (agent === "codex") return "claude";
  if (agent === "claude") return "codex";
  return null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const ws = path.join(args.root, "working-session");
  const findings = [];

  for (const f of CONTROL_PLANE) {
    if (!fs.existsSync(path.join(ws, f))) {
      findings.push({ level: "blocker", kind: "control-plane", detail: `required control-plane file missing: working-session/${f}` });
    }
  }

  const ownChat = `chat-${args.agent}.md`;
  if (!fs.existsSync(path.join(ws, ownChat))) {
    findings.push({ level: "warning", kind: "own-chat", detail: `own chat file missing: working-session/${ownChat} (boot may create it)` });
  }

  const peer = peerOf(args.agent);
  if (peer) {
    const peerChat = `chat-${peer}.md`;
    if (!fs.existsSync(path.join(ws, peerChat))) {
      findings.push({ level: "warning", kind: "peer-chat", detail: `peer chat file missing: working-session/${peerChat} — warning only; boot never creates peer chats` });
    }
  }

  const blocking = findings.filter((f) => f.level === "blocker");
  const report = { agent: args.agent, root: args.root, findings, clean: blocking.length === 0 };
  if (args.format === "json") process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  else {
    if (!findings.length) process.stdout.write("boot sequence: clean\n");
    else for (const f of findings) process.stdout.write(`[${f.level}] ${f.kind}: ${f.detail}\n`);
  }
  process.exit(report.clean ? 0 : 1);
}

main();
