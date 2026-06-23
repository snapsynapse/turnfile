#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const node = process.execPath;

function tmpDir(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `turnfile-${name}-`));
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function run(args, options = {}) {
  const result = spawnSync(node, args, {
    cwd: repoRoot,
    encoding: "utf8",
    ...options,
  });
  return {
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    output: `${result.stdout || ""}${result.stderr || ""}`,
  };
}

function turnfileFixture(dir) {
  const filePath = path.join(dir, "TURNFILE.yaml");
  writeFile(
    filePath,
    [
      "# Last modified revision: 7",
      "turnfile:",
      "  version: 0.1",
      "coordination:",
      "  revision: 7",
      "messages: []",
      "",
    ].join("\n"),
  );
  return filePath;
}

function activeMessage({ status = "acknowledged", to = "Codex" } = {}) {
  return [
    "### MSG-20260623-001",
    "",
    "| Field | Value |",
    "|-------|-------|",
    "| From | Claude |",
    `| To | ${to} |`,
    "| Type | request |",
    "| Priority | P1 |",
    `| Status | ${status} |`,
    "| Subject | Fixture handoff |",
    "",
    "**From:** Claude -> Codex",
    "**Date:** 2026-06-23",
    "**Type:** request",
    "**Priority:** P1",
    `**Status:** ${status}`,
    "**Subject:** Fixture handoff",
    "**Closure owner:** Claude",
    "**Response needed by:** next session turn",
    "",
    "**Summary**",
    "- Fixture body.",
    "",
  ].join("\n");
}

function mailboxFixture(dir, { status = "acknowledged", unread = 0, openQueue = true } = {}) {
  const filePath = path.join(dir, "MAILBOX.md");
  const openRows = openQueue ? ["| MSG-20260623-001 | Claude -> Codex | P1 | Fixture handoff |"] : [];
  const inboxRows = [
    `| Codex | ${unread} | ${unread ? "MSG-20260623-001" : "none"} | none |`,
    "| Claude | 0 | none | none |",
    "| Maintainer | 0 | none | none |",
  ];
  writeFile(
    filePath,
    [
      "# Mailbox (Turnfile, Compact)",
      "",
      "## Inbox Snapshot",
      "",
      "| Agent | Unread | Oldest unread | Needs response by |",
      "|-------|--------|---------------|-------------------|",
      ...inboxRows,
      "",
      "## Open Queue (Newest First)",
      "",
      "| ID | From -> To | Priority | Subject |",
      "|----|------------|----------|---------|",
      ...openRows,
      "",
      "## Active Messages (Newest First)",
      "",
      activeMessage({ status }),
      "",
      "## Closed Summary",
      "",
      "| ID | Date | From -> To | Final status | Outcome |",
      "|----|------|------------|--------------|---------|",
      "",
    ].join("\n"),
  );
  const exportResult = run(["tools/export-mailbox-json.mjs", filePath, filePath.replace(/\.md$/, ".json")]);
  assert.equal(exportResult.status, 0, exportResult.output);
  return filePath;
}

test("mailbox session gate lists the start and end failure taxonomy", () => {
  const start = run(["tools/validate-mailbox-session-gate.mjs", "--phase", "start", "--list"]);
  assert.equal(start.status, 0, start.output);
  assert.match(start.stdout, /mailbox-invariants/);
  assert.match(start.stdout, /Open Queue row pointing at a missing Active Message body/);
  assert.doesNotMatch(start.stdout, /selected-agent-unread-clean-close/);

  const end = run(["tools/validate-mailbox-session-gate.mjs", "--phase", "end", "--list"]);
  assert.equal(end.status, 0, end.output);
  assert.match(end.stdout, /active-card-owner-review/);
  assert.match(end.stdout, /selected-agent-unread-clean-close/);
});

test("mailbox session gate passes a consistent start fixture", () => {
  const dir = tmpDir("mailbox-session-pass");
  const mailbox = mailboxFixture(dir);
  const turnfile = turnfileFixture(dir);
  const result = run([
    "tools/validate-mailbox-session-gate.mjs",
    "--phase",
    "start",
    "--agent",
    "codex",
    "--mailbox",
    mailbox,
    "--turnfile",
    turnfile,
  ]);
  assert.equal(result.status, 0, result.output);
  assert.match(result.stdout, /MAILBOX SESSION GATE: PASS/);
});

test("mailbox session gate catches an open queue row without an active body", () => {
  const dir = tmpDir("mailbox-session-open-queue");
  const mailbox = mailboxFixture(dir);
  const raw = fs.readFileSync(mailbox, "utf8").replace("### MSG-20260623-001", "### MSG-20260623-999");
  fs.writeFileSync(mailbox, raw, "utf8");
  const turnfile = turnfileFixture(dir);
  const result = run([
    "tools/validate-mailbox-session-gate.mjs",
    "--phase",
    "start",
    "--mailbox",
    mailbox,
    "--turnfile",
    turnfile,
  ]);
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /Open queue references unknown active message ID: MSG-20260623-001/);
});

test("mailbox session gate blocks end phase when selected agent has unread work", () => {
  const dir = tmpDir("mailbox-session-unread");
  const mailbox = mailboxFixture(dir, { status: "unread", unread: 1 });
  const turnfile = turnfileFixture(dir);
  const result = run([
    "tools/validate-mailbox-session-gate.mjs",
    "--phase",
    "end",
    "--agent",
    "codex",
    "--mailbox",
    mailbox,
    "--turnfile",
    turnfile,
  ]);
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /selected-agent-unread-clean-close/);
  assert.match(result.output, /codex unread=1/);
});
