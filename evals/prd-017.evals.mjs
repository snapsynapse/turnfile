// PRD-017 RED evals: boot sequence commands and documentation contract.
// Eval author: Codex. Intended implementer/reviewer split: Claude implements,
// Codex reviews. These tests are expected to fail until PRD-017 is implemented.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => fs.existsSync(path.join(root, p));

test("R1/R2: canonical boot command manifest exists with ordered commands and read order", () => {
  const manifest = "docs/BOOT_SEQUENCE.md";
  assert.ok(exists(manifest), `${manifest} missing`);
  const s = read(manifest);
  for (const phrase of [
    "git status",
    "turnfile-lint",
    "validate-mailbox-invariants",
    "export-mailbox-json",
    "TURNFILE.yaml",
    "WORKLOG.md",
    "MAILBOX.md",
    "PRD_STATUS.json",
    "OPEN_QUESTIONS.md",
  ]) {
    assert.match(s, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.match(s, /stop|continue|escalate/i);
});

test("R6: active boot files and skill bundles reference the canonical boot manifest", () => {
  for (const file of [
    "working-session/boot-codex.md",
    "working-session/boot-claude.md",
    "skills/codex/SKILL.md",
    "skills/claude/SKILL.md",
  ]) {
    const s = read(file);
    assert.match(s, /BOOT_SEQUENCE\.md|canonical boot command manifest|boot command manifest/i, `${file} missing manifest reference`);
  }
});

test("R7: active boot docs preserve own-chat creation and peer-chat warning semantics", () => {
  for (const file of ["working-session/boot-codex.md", "working-session/boot-claude.md"]) {
    const s = read(file);
    assert.match(s, /chat-<agent>|own chat|chat-codex|chat-claude/i, `${file} missing own-chat creation language`);
    assert.match(s, /peer chat.*warn|missing peer chat.*warning|warning only.*peer chat/i, `${file} missing peer-chat warning language`);
    assert.doesNotMatch(s, /create peer chat|creates peer chat/i, `${file} appears to create peer chat files`);
  }
});

test("R7.4: chat template contains fixed session header metadata fields", () => {
  const s = read("templates/working-session/chat-agent.md");
  for (const phrase of ["branch", "Turnfile revision", "phase", "session ID", "date"]) {
    assert.match(s, new RegExp(phrase, "i"));
  }
});

test("R5/R7.3: boot validator fails missing control-plane files but only warns on missing peer chat", () => {
  const tool = "tools/validate-boot-sequence.mjs";
  assert.ok(exists(tool), `${tool} missing`);

  const missingControl = fs.mkdtempSync(path.join(os.tmpdir(), "prd017-missing-control-"));
  fs.mkdirSync(path.join(missingControl, "working-session"));
  const fail = spawnSync(process.execPath, [tool, "--root", missingControl, "--agent", "codex", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(fail.status, 0, "missing control-plane artifacts must block boot validation");
  assert.match(`${fail.stdout}${fail.stderr}`, /TURNFILE|MAILBOX|WORKLOG|control-plane/i);

  const peerMissing = fs.mkdtempSync(path.join(os.tmpdir(), "prd017-peer-missing-"));
  fs.mkdirSync(path.join(peerMissing, "working-session"));
  for (const file of ["TURNFILE.yaml", "MAILBOX.md", "WORKLOG.md", "chat-codex.md"]) {
    fs.writeFileSync(path.join(peerMissing, "working-session", file), `${file}\n`, "utf8");
  }
  const warn = spawnSync(process.execPath, [tool, "--root", peerMissing, "--agent", "codex", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(warn.status, 0, `${warn.stdout}${warn.stderr}`);
  assert.match(`${warn.stdout}${warn.stderr}`, /peer chat|chat-claude/i);
  assert.match(`${warn.stdout}${warn.stderr}`, /warn/i);
});
