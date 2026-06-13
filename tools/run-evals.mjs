#!/usr/bin/env node

import assert from "node:assert/strict";
import crypto from "node:crypto";
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

function sha256(content) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
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

function expectPass(result) {
  assert.equal(result.status, 0, result.output);
}

function expectFail(result, snippet) {
  assert.notEqual(result.status, 0, result.output);
  if (snippet) {
    assert.match(result.output, snippet);
  }
}

function repoTurnfileFixture(mutator) {
  const dir = tmpDir("turnfile");
  const filePath = path.join(dir, "TURNFILE.yaml");
  let raw = fs.readFileSync(path.join(repoRoot, "working-session/TURNFILE.yaml"), "utf8");
  raw = mutator(raw);
  writeFile(filePath, raw);
  return filePath;
}

function mailboxFixture(activeBlocks, options = {}) {
  const dir = tmpDir("mailbox");
  const closedRows = options.closedRows || [];
  const openRows = options.openRows || [];
  const inboxRows = options.inboxRows || [
    "| Codex | 0 | none | none |",
    "| Claude | 0 | none | none |",
    "| Maintainer | 0 | none | none |",
  ];
  const filePath = path.join(dir, "MAILBOX.md");
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
      ...activeBlocks,
      "",
      "## Closed Summary",
      "",
      "| ID | Date | From -> To | Final status | Outcome |",
      "|----|------|------------|--------------|---------|",
      ...closedRows,
      "",
    ].join("\n"),
  );
  return filePath;
}

function activeMessage({
  id = "MSG-20260503-001",
  from = "Claude",
  to = "Codex",
  type = "request",
  priority = "P1",
  status = "unread",
  subject = "Fixture message",
} = {}) {
  return [
    "---",
    "",
    `### ${id}`,
    "",
    `**From:** ${from} -> ${to}`,
    "**Date:** 2026-05-03",
    `**Type:** ${type}`,
    `**Priority:** ${priority}`,
    `**Status:** ${status}`,
    `**Subject:** ${subject}`,
    "**Closure owner:** Claude",
    "**Response needed by:** next session turn",
    "",
    "Fixture body.",
  ].join("\n");
}

function skillFixture({
  versioningName = "skill-versioning",
  mode = "minimal",
  bundleVersion = 1,
  hash = null,
  global = false,
} = {}) {
  const dir = tmpDir("skills");
  const turnfileSkill = [
    "---",
    "name: turnfile-codex-collaboration",
    "description: Fixture Turnfile skill.",
    "---",
    "",
    "# Fixture",
    "",
  ].join("\n");
  const versioningFrontmatter =
    mode === "metadata"
      ? [
          "---",
          `name: ${versioningName}`,
          "description: Fixture versioning skill.",
          "metadata:",
          `  skill_bundle: ${versioningName}`,
          "  file_role: skill",
          "  version: 1",
          "---",
          "",
        ].join("\n")
      : [
          "---",
          `name: ${versioningName}`,
          "description: Fixture versioning skill.",
          "---",
          "",
        ].join("\n");
  const versioningSkill = `${versioningFrontmatter}# Fixture\n`;
  const manifestHash = hash === "valid" ? `sha256:${sha256(versioningSkill)}` : hash;
  const manifest = [
    `bundle: ${versioningName}`,
    `bundle_version: ${JSON.stringify(bundleVersion)}`,
    "compatibility:",
    `  frontmatter_mode: ${mode}`,
    "files:",
    "  - path: SKILL.md",
    "    role: skill",
    `    hash: ${manifestHash === null ? "null" : manifestHash}`,
    "",
  ].join("\n");

  const repoTurnfileSkill = path.join(dir, "repo-turnfile/SKILL.md");
  const repoVersioningDir = path.join(dir, "repo-versioning");
  writeFile(repoTurnfileSkill, turnfileSkill);
  writeFile(path.join(repoVersioningDir, "SKILL.md"), versioningSkill);
  writeFile(path.join(repoVersioningDir, "MANIFEST.yaml"), manifest);

  const globalSkillsDir = path.join(dir, "global-skills");
  if (global) {
    writeFile(path.join(globalSkillsDir, "turnfile-codex-collaboration/SKILL.md"), turnfileSkill);
    writeFile(path.join(globalSkillsDir, versioningName, "SKILL.md"), versioningSkill);
    writeFile(path.join(globalSkillsDir, versioningName, "MANIFEST.yaml"), manifest);
  }

  return { repoTurnfileSkill, repoVersioningDir, globalSkillsDir };
}

test("turnfile-lint reports malformed messages as schema errors, not crashes", () => {
  const turnfile = repoTurnfileFixture((raw) =>
    raw.replace(/  - id: "SIG-030"/, '  - {}\n  - id: "SIG-030"'),
  );
  const result = run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]);
  expectFail(result, /Schema: \/messages\/\d+ must have required property 'id'/);
  assert.doesNotMatch(result.output, /TypeError|Cannot read properties/);
});

test("turnfile-lint fails duplicate signal IDs", () => {
  const turnfile = repoTurnfileFixture((raw) => raw.replace('id: "SIG-029"', 'id: "SIG-030"'));
  expectFail(run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]), /Duplicate signal ID: SIG-030/);
});

test("turnfile-lint warns on out-of-order signal IDs", () => {
  const turnfile = repoTurnfileFixture((raw) => raw.replace('id: "SIG-030"', 'id: "SIG-000"'));
  const result = run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]);
  expectPass(result);
  assert.match(result.output, /Expected newest-first ordering/);
});

test("turnfile-lint warns on stale locks", () => {
  const turnfile = repoTurnfileFixture((raw) =>
    raw.replace(
      "locks: {}",
      [
        "locks:",
        "  stale-lock:",
        "    files: [\"working-session/MAILBOX.md\"]",
        "    holder: \"codex\"",
        "    acquired_rev: 1",
        "    lease_revs: 2",
        "    reason: \"fixture\"",
      ].join("\n"),
    ),
  );
  const result = run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]);
  expectPass(result);
  assert.match(result.output, /Lock 'stale-lock' is stale/);
});

test("turnfile-lint fails unknown lock holders", () => {
  const turnfile = repoTurnfileFixture((raw) =>
    raw.replace(
      "locks: {}",
      [
        "locks:",
        "  bad-lock:",
        "    files: [\"working-session/MAILBOX.md\"]",
        "    holder: \"unknown-agent\"",
        "    acquired_rev: 30",
        "    lease_revs: 2",
        "    reason: \"fixture\"",
      ].join("\n"),
    ),
  );
  expectFail(run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]), /held by unknown agent 'unknown-agent'/);
});

test("turnfile-lint warns when claimed task has unfinished dependency", () => {
  const turnfile = repoTurnfileFixture((raw) =>
    raw
      .replace("depends_on: []", 'depends_on: ["prd-015-maintainer-acceptance"]')
      .replace('status: "done"', 'status: "claimed"'),
  );
  const result = run(["tools/turnfile-lint.mjs", "--turnfile", turnfile]);
  expectPass(result);
  assert.match(result.output, /dependency 'prd-015-maintainer-acceptance' is 'in_progress'/);
});

test("mailbox validator fails closed messages left active", () => {
  const mailbox = mailboxFixture([activeMessage({ status: "closed" })]);
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /remains in Active Messages/);
});

test("mailbox validator fails non-terminal active messages missing from Open Queue", () => {
  const mailbox = mailboxFixture([activeMessage({ status: "acknowledged" })]);
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /missing from Open Queue/);
});

test("mailbox validator fails Open Queue rows pointing at missing messages", () => {
  const mailbox = mailboxFixture([], {
    openRows: ["| MSG-20260503-404 | Claude -> Codex | P1 | Missing |"],
  });
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /references unknown active message ID/);
});

test("mailbox validator fails Open Queue rows pointing at terminal messages", () => {
  const mailbox = mailboxFixture([activeMessage({ status: "closed" })], {
    openRows: ["| MSG-20260503-001 | Claude -> Codex | P1 | Fixture message |"],
  });
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /terminal status 'closed'/);
});

test("mailbox validator fails inbox unread mismatch", () => {
  const mailbox = mailboxFixture([activeMessage({ status: "unread" })], {
    openRows: ["| MSG-20260503-001 | Claude -> Codex | P1 | Fixture message |"],
  });
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /Inbox mismatch for Codex/);
});

test("mailbox validator fails duplicate Closed Summary IDs", () => {
  const mailbox = mailboxFixture([], {
    closedRows: [
      "| MSG-20260503-001 | 2026-05-03 | Claude -> Codex | closed | One |",
      "| MSG-20260503-001 | 2026-05-03 | Claude -> Codex | closed | Two |",
    ],
  });
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /Duplicate Closed Summary message ID/);
});

test("mailbox validator fails Closed Summary rows missing required fields", () => {
  const mailbox = mailboxFixture([], {
    closedRows: ["| MSG-20260503-001 | 2026-05-03 |  | closed | Fixture |"],
  });
  expectFail(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]), /missing required field\(s\): From -> To/);
});

test("mailbox validator passes empty active mailbox with Closed Summary", () => {
  const mailbox = mailboxFixture([], {
    closedRows: ["| MSG-20260503-001 | 2026-05-03 | Claude -> Codex | closed | Fixture |"],
  });
  expectPass(run(["tools/validate-mailbox-invariants.mjs", "--mailbox", mailbox]));
});

test("mailbox export supports Closed Summary heading variants", () => {
  for (const heading of ["## Closed Summary", "## Closed Summary (Newest First)"]) {
    const dir = tmpDir("export");
    const input = path.join(dir, "MAILBOX.md");
    const output = path.join(dir, "MAILBOX.json");
    writeFile(
      input,
      [
        "# Mailbox",
        "",
        "## Inbox Snapshot",
        "",
        "| Agent | Unread | Oldest unread | Needs response by |",
        "|---|---|---|---|",
        "| Codex | 0 | none | none |",
        "",
        "## Open Queue (Newest First)",
        "",
        "| ID | From -> To | Priority | Subject |",
        "|---|---|---|---|",
        "",
        "## Active Messages (Newest First)",
        "",
        heading,
        "",
        "| ID | Date | From -> To | Final status | Outcome |",
        "|---|---|---|---|---|",
        "| MSG-20260503-001 | 2026-05-03 | Claude -> Codex | closed | Fixture |",
        "",
      ].join("\n"),
    );
    expectPass(run(["tools/export-mailbox-json.mjs", input, output]));
    const exported = JSON.parse(fs.readFileSync(output, "utf8"));
    assert.equal(exported.closed_summary.length, 1);
  }
});

test("mailbox export parses field table active messages", () => {
  const dir = tmpDir("export-table");
  const input = path.join(dir, "MAILBOX.md");
  const output = path.join(dir, "MAILBOX.json");
  writeFile(
    input,
    [
      "# Mailbox",
      "",
      "## Inbox Snapshot",
      "",
      "| Agent | Unread | Oldest unread | Needs response by |",
      "|---|---|---|---|",
      "| Codex | 0 | none | none |",
      "",
      "## Open Queue (Newest First)",
      "",
      "| ID | From -> To | Priority | Subject |",
      "|---|---|---|---|",
      "",
      "## Active Messages (Newest First)",
      "",
      "### MSG-20260503-001",
      "",
      "| Field | Value |",
      "|---|---|",
      "| From | Claude -> Codex |",
      "| Status | acknowledged |",
      "",
      "**Summary**",
      "- Fixture summary",
      "",
      "## Closed Summary",
      "",
      "| ID | Date | From -> To | Final status | Outcome |",
      "|---|---|---|---|---|",
      "",
    ].join("\n"),
  );
  expectPass(run(["tools/export-mailbox-json.mjs", input, output]));
  const exported = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.equal(exported.active_messages[0].id, "MSG-20260503-001");
  assert.equal(exported.active_messages[0].fields.status, "acknowledged");
  assert.deepEqual(exported.active_messages[0].summary, ["Fixture summary"]);
});

test("mailbox export has predictable compact bold-field behavior", () => {
  const mailbox = mailboxFixture([activeMessage({ status: "acknowledged" })], {
    openRows: ["| MSG-20260503-001 | Claude -> Codex | P1 | Fixture message |"],
  });
  const output = path.join(path.dirname(mailbox), "MAILBOX.json");
  expectPass(run(["tools/export-mailbox-json.mjs", mailbox, output]));
  const exported = JSON.parse(fs.readFileSync(output, "utf8"));
  assert.equal(exported.active_messages.length, 1);
  assert.equal(exported.active_messages[0].id, "MSG-20260503-001");
});

test("skills preflight passes minimal frontmatter and integer bundle version", () => {
  const fixture = skillFixture({ mode: "minimal", bundleVersion: 1 });
  expectPass(run([
    "tools/validate-skills-preflight.mjs",
    "--repo-turnfile-skill",
    fixture.repoTurnfileSkill,
    "--repo-versioning-dir",
    fixture.repoVersioningDir,
    "--global-skills-dir",
    fixture.globalSkillsDir,
  ]));
});

test("skills preflight passes metadata frontmatter and semver bundle version", () => {
  const fixture = skillFixture({
    versioningName: "skill-provenance",
    mode: "metadata",
    bundleVersion: "4.9.1",
  });
  expectPass(run([
    "tools/validate-skills-preflight.mjs",
    "--repo-turnfile-skill",
    fixture.repoTurnfileSkill,
    "--repo-versioning-dir",
    fixture.repoVersioningDir,
    "--global-skills-dir",
    fixture.globalSkillsDir,
  ]));
});

test("skills preflight fails unknown versioning skill names", () => {
  const fixture = skillFixture({ versioningName: "other-skill" });
  expectFail(
    run([
      "tools/validate-skills-preflight.mjs",
      "--repo-turnfile-skill",
      fixture.repoTurnfileSkill,
      "--repo-versioning-dir",
      fixture.repoVersioningDir,
      "--global-skills-dir",
      fixture.globalSkillsDir,
    ]),
    /Repo versioning skill name mismatch/,
  );
});

test("skills preflight fails manifest hash mismatches", () => {
  const fixture = skillFixture({ hash: "sha256:deadbeef" });
  expectFail(
    run([
      "tools/validate-skills-preflight.mjs",
      "--repo-turnfile-skill",
      fixture.repoTurnfileSkill,
      "--repo-versioning-dir",
      fixture.repoVersioningDir,
      "--global-skills-dir",
      fixture.globalSkillsDir,
    ]),
    /hash mismatch/,
  );
});

test("skills preflight only requires global skills in strict mode", () => {
  const fixture = skillFixture();
  expectPass(run([
    "tools/validate-skills-preflight.mjs",
    "--repo-turnfile-skill",
    fixture.repoTurnfileSkill,
    "--repo-versioning-dir",
    fixture.repoVersioningDir,
    "--global-skills-dir",
    fixture.globalSkillsDir,
  ]));
  expectFail(
    run([
      "tools/validate-skills-preflight.mjs",
      "--repo-turnfile-skill",
      fixture.repoTurnfileSkill,
      "--repo-versioning-dir",
      fixture.repoVersioningDir,
      "--global-skills-dir",
      fixture.globalSkillsDir,
      "--strict-global",
    ]),
    /Required global skill missing/,
  );
});

test("skills preflight passes strict mode when required globals exist", () => {
  const fixture = skillFixture({ global: true });
  expectPass(run([
    "tools/validate-skills-preflight.mjs",
    "--repo-turnfile-skill",
    fixture.repoTurnfileSkill,
    "--repo-versioning-dir",
    fixture.repoVersioningDir,
    "--global-skills-dir",
    fixture.globalSkillsDir,
    "--strict-global",
  ]));
});

test("end-to-end current workspace validation passes", () => {
  expectPass(run(["tools/turnfile-lint.mjs"]));
  expectPass(run(["tools/validate-mailbox-invariants.mjs"]));
  expectPass(run(["tools/validate-prd-promotion.mjs"]));
  expectPass(run(["tools/validate-skills-preflight.mjs"]));
});
