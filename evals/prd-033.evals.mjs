/**
 * evals/prd-033.evals.mjs — Skill Ownership Integrity Guard (PRD-033).
 *
 * Authored by Claude (proposer/eval-author) per PRD-006 A1 step 4.
 *
 * Hermetic: imports the pure classifier from the Maintainer-owned guard brain
 * (tools/hooks/guard-check.mjs) and loads the real root OWNERSHIP.yaml. No git, network,
 * or working-tree mutation (Claude C4: hermetic fixture evals; AC1: stable schema).
 *
 * Coverage maps to PRD-033 Acceptance Criteria:
 *   AC2 — shared pre-commit blocks peer-owned staged paths, allows own + shared.
 *   AC3 — committing agent derived from identity; unresolved identity fails closed.
 *   AC5 — guard reads the Maintainer-owned map; maintainer_owned paths are agent-locked.
 *   R1  — per-agent locked set incl. boot/chat/shard files; gemini + legacy coverage.
 *   R5.1 — maintainer identity bypasses all ownership checks.
 *
 * Out of automated scope (documented worked examples, not hermetic unit tests):
 *   AC4 — harness-specific Layer-1 pre-tool hook (.claude/settings.json PreToolUse is
 *         gitignored/per-user; Codex equivalent in its harness).
 *   AC6/AC7 — onboarding doc gate + override path: see tools/hooks/README.md and the
 *         guard-check.mjs CLI (TURNFILE_GUARD_OVERRIDE), exercised manually at activation.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import {
  classifyCommit,
  ownerOf,
  globToRegExp,
} from "../tools/hooks/guard-check.mjs";

const require = createRequire(import.meta.url);
const ownership = require("js-yaml").load(
  fs.readFileSync(fileURLToPath(new URL("../OWNERSHIP.yaml", import.meta.url)), "utf8")
);

// --- R1 / map well-formedness ------------------------------------------------

test("AC1/R1: OWNERSHIP.yaml declares claude, codex, gemini and maintainer_owned", () => {
  assert.ok(ownership.agents.claude, "claude owned set present");
  assert.ok(ownership.agents.codex, "codex owned set present");
  assert.ok(ownership.agents.gemini, "gemini owned set present (locked pre-onboarding)");
  assert.ok(
    ownership.maintainer_owned.includes("OWNERSHIP.yaml"),
    "OWNERSHIP.yaml is in its own maintainer_owned set"
  );
  assert.ok(
    ownership.maintainer_owned.includes("tools/hooks/**"),
    "tools/hooks/** is maintainer_owned"
  );
});

test("R1: ownerOf resolves skill bundles, boot, chat, and shard files", () => {
  assert.equal(ownerOf("skills/claude/SKILL.md", ownership), "claude");
  assert.equal(ownerOf("skills/codex/MANIFEST.yaml", ownership), "codex");
  assert.equal(ownerOf("working-session/boot-claude.md", ownership), "claude");
  assert.equal(ownerOf("working-session/boot-codex.md", ownership), "codex");
  assert.equal(ownerOf("working-session/chat-codex.md", ownership), "codex");
  assert.equal(ownerOf("working-session/agents/codex/hooks/pre-commit", ownership), "codex");
});

test("R1: gemini + legacy dirs map to the right owner", () => {
  assert.equal(ownerOf("skills/gemini/SKILL.md", ownership), "gemini");
  assert.equal(ownerOf("GEMINI.md", ownership), "gemini");
  assert.equal(ownerOf("skills/codex_5.3/SKILL.md", ownership), "codex");
  assert.equal(ownerOf("skills/claude-opus_4.6/MANIFEST.yaml", ownership), "claude");
});

test("R1: collaborative paths have no owner", () => {
  for (const p of [
    "working-session/MAILBOX.md",
    "working-session/TURNFILE.yaml",
    "working-session/docs/PRD_STATUS.json",
    "docs/llm/MODEL_LEDGER.md",
    "tools/turnfile-lint.mjs",
    "schemas/turnfile/turnfile-v0.schema.json",
  ]) {
    assert.equal(ownerOf(p, ownership), null, `${p} should be collaborative`);
  }
});

test("glob matcher: ** spans depth, * stays in-segment, exact files anchor", () => {
  assert.ok(globToRegExp("skills/claude/**").test("skills/claude/sub/dir/x.md"));
  assert.ok(!globToRegExp("skills/claude/**").test("skills/claudex/x.md"));
  assert.ok(globToRegExp("working-session/boot-claude.md").test("working-session/boot-claude.md"));
  assert.ok(!globToRegExp("working-session/boot-claude.md").test("working-session/boot-codex.md"));
});

// --- AC2: shared pre-commit blocks peer-owned, allows own + shared -----------

test("AC2: claude commit touching skills/codex/** is BLOCKED", () => {
  const r = classifyCommit({
    agent: "claude",
    stagedPaths: ["skills/codex/SKILL.md"],
    ownership,
  });
  assert.equal(r.ok, false);
  assert.equal(r.violations.length, 1);
  assert.equal(r.violations[0].owner, "codex");
});

test("AC2: claude commit touching only own + shared paths is ALLOWED", () => {
  const r = classifyCommit({
    agent: "claude",
    stagedPaths: [
      "skills/claude/SKILL.md",
      "working-session/boot-claude.md",
      "working-session/WORKLOG.md",
      "docs/llm/MODEL_LEDGER.md",
    ],
    ownership,
  });
  assert.equal(r.ok, true);
  assert.equal(r.violations.length, 0);
});

test("AC2: codex commit touching working-session/agents/codex shard is ALLOWED; claude is BLOCKED", () => {
  const shard = ["working-session/agents/codex/hooks/pre-commit"];
  assert.equal(classifyCommit({ agent: "codex", stagedPaths: shard, ownership }).ok, true);
  assert.equal(classifyCommit({ agent: "claude", stagedPaths: shard, ownership }).ok, false);
});

test("AC2: mixed commit (own + one peer path) is BLOCKED and names only the peer path", () => {
  const r = classifyCommit({
    agent: "codex",
    stagedPaths: ["skills/codex/SKILL.md", "skills/claude/SKILL.md"],
    ownership,
  });
  assert.equal(r.ok, false);
  assert.deepEqual(
    r.violations.map((v) => v.path),
    ["skills/claude/SKILL.md"]
  );
});

// --- AC3: identity-derived; fail closed on unresolved identity --------------

test("AC3: unresolved identity fails closed even for a shared-only commit", () => {
  const r = classifyCommit({
    agent: null,
    stagedPaths: ["working-session/WORKLOG.md"],
    ownership,
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "unresolved-identity");
});

// --- AC5: maintainer-owned map is agent-locked; maintainer identity bypasses --

test("AC5: an agent staging OWNERSHIP.yaml or tools/hooks/** is BLOCKED (cannot widen own permissions)", () => {
  assert.equal(ownerOf("OWNERSHIP.yaml", ownership), "maintainer");
  assert.equal(ownerOf("tools/hooks/pre-commit", ownership), "maintainer");
  assert.equal(ownerOf("tools/hooks/guard-check.mjs", ownership), "maintainer");
  const r = classifyCommit({
    agent: "codex",
    stagedPaths: ["OWNERSHIP.yaml", "tools/hooks/guard-check.mjs"],
    ownership,
  });
  assert.equal(r.ok, false);
  assert.equal(r.violations.length, 2);
});

test("R5.1: maintainer identity bypasses every ownership check", () => {
  const r = classifyCommit({
    agent: "maintainer",
    stagedPaths: ["skills/claude/SKILL.md", "skills/codex/SKILL.md", "OWNERSHIP.yaml"],
    ownership,
  });
  assert.equal(r.ok, true);
  assert.equal(r.reason, "maintainer-bypass");
});
