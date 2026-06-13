// PRD-024 implementation evals — human-legibility invariant + encoding profiles
// Proposer: Claude (eval author). Implementer: Codex. Reviewer: Claude.
// Includes retroactive coverage of Claude's self-implemented R5.2/R5.3 propagation,
// which Codex must independently review as part of this implementation lane.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("R5.2: both skill bundles carry the turn-boundary projection obligation", () => {
  for (const f of ["skills/claude/SKILL.md", "skills/codex/SKILL.md"]) {
    const s = read(f);
    assert.match(s, /projection/i, `${f} missing projection obligation`);
    assert.match(s, /legible/i, `${f} missing legible-record rule`);
  }
});

test("R5.3: session charter template carries the encoding-profile opt-in line", () => {
  assert.match(read("templates/session-charter.md"), /Encoding profile/i);
});

test("R5.2: active boot files reference PRD-024 encoding obligations", () => {
  for (const f of ["working-session/boot-claude.md", "working-session/boot-codex.md"]) {
    assert.match(read(f), /PRD-024|encoding profile|legib/i, `${f} missing PRD-024 reference`);
  }
});

test("R5.1: validator rejects a labeled dense block with no immediate paraphrase in a governance artifact", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd024-"));
  const f = path.join(dir, "MAILBOX.md");
  fs.writeFileSync(f, `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
| MSG-20990101-003 | 2099-01-01 | Claude -> Codex | closed | dense test |

\`\`\`dense
⟦x7▸q2⟧ unprojected payload
\`\`\`
`, "utf8");
  const r = spawnSync(process.execPath, ["tools/validate-mailbox-invariants.mjs", "--mailbox", f], { cwd: root, encoding: "utf8" });
  assert.notEqual(r.status, 0, `validator accepted unparaphrased labeled dense block:\n${r.stdout}${r.stderr}`);
});

test("R5.1: validator accepts a labeled dense block immediately followed by a paraphrase", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prd024-ok-"));
  const f = path.join(dir, "MAILBOX.md");
  fs.writeFileSync(f, `# Mailbox (Turnfile, Compact)

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|
| Codex | 0 | none | none |
| Claude | 0 | none | none |
| Maintainer | 0 | none | none |

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|
| MSG-20990101-004 | 2099-01-01 | Claude -> Codex | closed | dense test ok |

\`\`\`dense
⟦x7▸q2⟧ payload
\`\`\`
Paraphrase: example dense fragment meaning "task x7 routes to queue 2".
`, "utf8");
  const r = spawnSync(process.execPath, ["tools/validate-mailbox-invariants.mjs", "--mailbox", f], { cwd: root, encoding: "utf8" });
  assert.equal(r.status, 0, `validator rejected a correctly paraphrased dense block:\n${r.stdout}${r.stderr}`);
});
