// Archive-shelf hygiene guard (Maintainer-approved 2026-06-13, session 14).
// Regression guard, not a PRD implementation gate: asserts the live registry
// invariant for the working-session/docs/archive terminal shelf. Green by design
// once the archive move is correct; turns red if a non-terminal or promotable PRD
// lands in the archive, or if an archived file loses its registry entry.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ARCHIVE = "docs/archive/prds";
const TERMINAL = new Set(["deferred", "superseded"]);
const registry = JSON.parse(fs.readFileSync(path.join(root, "working-session/docs/PRD_STATUS.json"), "utf8"));
const byId = Object.fromEntries(registry.prds.map((e) => [e.id, e]));

test("every archive-shelf PRD is terminal and not promotable", () => {
  const archived = registry.prds.filter((e) => e.shelf === ARCHIVE);
  assert.ok(archived.length > 0, "no archived PRDs found — fixture expects at least the session-14 set");
  for (const e of archived) {
    assert.ok(TERMINAL.has(e.state), `${e.id} in archive but state '${e.state}' is not terminal`);
    assert.equal(e.eligible_for_docs_prds, false, `${e.id} in archive but marked promotable`);
    assert.ok(e.path.startsWith(`${ARCHIVE}/`), `${e.id} path '${e.path}' does not match archive shelf`);
  }
});

test("every archived registry path exists on disk", () => {
  for (const e of registry.prds.filter((x) => x.shelf === ARCHIVE)) {
    assert.ok(fs.existsSync(path.join(root, e.path)), `${e.id} registry path missing on disk: ${e.path}`);
  }
});

test("session-14 deferred/superseded set is archived, not in the active draft shelf", () => {
  for (const id of ["PRD-002", "PRD-020"]) {
    assert.equal(byId[id].shelf, ARCHIVE, `${id} should be archived`);
  }
});

test("no archived PRD file remains directly in the active draft shelf", () => {
  const active = fs
    .readdirSync(path.join(root, "working-session/docs"))
    .filter((n) => /^PRD-\d{3}-.+\.md$/.test(n));
  for (const id of ["PRD-002", "PRD-015", "PRD-020"]) {
    assert.ok(!active.some((n) => n.startsWith(id)), `${id} still present in working-session/docs`);
  }
});
