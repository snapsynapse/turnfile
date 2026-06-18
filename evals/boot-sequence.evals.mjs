// boot-sequence.evals.mjs — RED evals for three-agent boot-sequence support.
// Eval author: Claude (proposer/eval-author) per PRD-006 A1 step 4.
// Intended implementer: Codex (counterpart implements against these).
//
// TARGET behavior (does NOT exist yet — these tests are EXPECTED TO FAIL):
//   tools/validate-boot-sequence.mjs currently hardwires a single peer pair
//   (codex<->claude) and peerOf() returns null for any other --agent value, so
//   gemini gets ZERO peer-chat checks. The change generalizes the peer set to
//   "every OTHER registered agent" so a 3-agent registry (claude, codex, gemini)
//   yields N-1 = 2 peer-chat warnings when peers' chat files are absent.
//
// Invariants this suite PINS (read-only validator, hermetic temp fixtures):
//   1. --agent gemini treats claude AND codex as peers => 2 peer-chat warnings
//      when neither chat-claude.md nor chat-codex.md exists; exit 0 (warn-only).
//   2. Each registered agent sees the OTHER N-1 agents as peers (symmetry):
//      --agent codex with claude+gemini chats absent => 2 peer-chat warnings.
//   3. A missing CONTROL-PLANE file (TURNFILE/MAILBOX/WORKLOG) still BLOCKS
//      (nonzero exit), unchanged from today.
//   4. An unknown --agent value warns but does not crash (exit 0, no throw).
//
// These FAIL now because: peerOf("gemini") === null (no peer-chat findings at
// all for gemini), and there is no notion of an N-agent registry.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TOOL = path.join(root, "tools/validate-boot-sequence.mjs");
const CONTROL_PLANE = ["TURNFILE.yaml", "MAILBOX.md", "WORKLOG.md"];

// Build a hermetic workspace under a temp dir. `present` lists working-session
// file basenames to create (control-plane + any chat-<agent>.md files wanted).
function workspace(name, present) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `boot-seq-${name}-`));
  const ws = path.join(dir, "working-session");
  fs.mkdirSync(ws, { recursive: true });
  for (const f of present) {
    fs.writeFileSync(path.join(ws, f), `${f}\n`, "utf8");
  }
  return { dir, ws };
}

function runBoot(dir, agent, extra = []) {
  return spawnSync(
    process.execPath,
    [TOOL, "--root", dir, "--agent", agent, "--format", "json", ...extra],
    { cwd: root, encoding: "utf8" },
  );
}

function parseReport(result) {
  const raw = result.stdout.trim() || result.stderr.trim();
  return JSON.parse(raw);
}

function peerChatFindings(report) {
  return report.findings.filter((f) => f.kind === "peer-chat");
}

// --- Invariant 1: gemini sees claude AND codex as peers ---------------------

test("3-agent: --agent gemini yields N-1 (=2) peer-chat warnings when peers' chats are absent", () => {
  // Control-plane present + only gemini's own chat present; no peer chats.
  const { dir } = workspace("gemini", [...CONTROL_PLANE, "chat-gemini.md"]);
  const result = runBoot(dir, "gemini");

  // Warn-only: missing peer chats must NOT block boot.
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const report = parseReport(result);
  const peers = peerChatFindings(report);
  assert.equal(
    peers.length,
    2,
    `expected 2 peer-chat warnings (claude + codex) for gemini, got ${peers.length}: ` +
      JSON.stringify(report.findings),
  );
  for (const f of peers) assert.equal(f.level, "warning");
  const blob = JSON.stringify(report.findings);
  assert.match(blob, /chat-claude\.md/);
  assert.match(blob, /chat-codex\.md/);
  // gemini must NOT be reported as its own peer.
  assert.doesNotMatch(
    peerChatFindings(report).map((f) => f.detail).join("\n"),
    /chat-gemini\.md/,
  );
});

test("3-agent: when ONE peer chat exists for gemini, only the other peer warns", () => {
  // chat-codex.md present => codex peer satisfied; only claude should warn.
  const { dir } = workspace("gemini-partial", [
    ...CONTROL_PLANE,
    "chat-gemini.md",
    "chat-codex.md",
  ]);
  const result = runBoot(dir, "gemini");
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const report = parseReport(result);
  const peers = peerChatFindings(report);
  assert.equal(peers.length, 1, `expected only claude to warn, got: ${JSON.stringify(peers)}`);
  assert.match(peers[0].detail, /chat-claude\.md/);
});

// --- Invariant 2: symmetry across the registry -----------------------------

test("3-agent: --agent codex sees claude AND gemini as peers (N-1 = 2 warnings)", () => {
  const { dir } = workspace("codex", [...CONTROL_PLANE, "chat-codex.md"]);
  const result = runBoot(dir, "codex");
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const report = parseReport(result);
  const peers = peerChatFindings(report);
  assert.equal(
    peers.length,
    2,
    `expected codex to treat claude + gemini as peers, got ${peers.length}: ` +
      JSON.stringify(report.findings),
  );
  const blob = peers.map((f) => f.detail).join("\n");
  assert.match(blob, /chat-claude\.md/);
  assert.match(blob, /chat-gemini\.md/);
});

// --- Invariant 3: missing control-plane still BLOCKS ------------------------

test("missing control-plane file still BLOCKS for gemini (nonzero exit)", () => {
  // Omit WORKLOG.md from the control plane; provide all chat files so the only
  // failure source is the missing control-plane artifact.
  const { dir } = workspace("gemini-missing-control", [
    "TURNFILE.yaml",
    "MAILBOX.md",
    "chat-gemini.md",
    "chat-claude.md",
    "chat-codex.md",
  ]);
  const result = runBoot(dir, "gemini");
  assert.notEqual(result.status, 0, "missing control-plane artifact must block boot");
  assert.match(`${result.stdout}${result.stderr}`, /WORKLOG|control-plane/i);
});

// --- Invariant 4: unknown agent warns but does not crash --------------------

test("unknown --agent value warns but does not crash", () => {
  const { dir } = workspace("unknown", [...CONTROL_PLANE]);
  const result = runBoot(dir, "zarniwoop");
  // Must not throw / hard-crash (exit 2 is the Fatal path in these tools).
  assert.notEqual(result.status, 2, `tool crashed on unknown agent: ${result.stderr}`);
  // Control-plane is present, so an unknown agent should be warn-only (exit 0).
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = parseReport(result);
  assert.ok(Array.isArray(report.findings), "expected a findings array even for unknown agent");
});
