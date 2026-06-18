# Release Checklist — Turnfile

Turnfile coordinates autonomous agents over shared files, so a release touches an
agent-facing, security-relevant surface. Run this checklist before tagging.

## 1. Gates (must pass on the commit being tagged)

```bash
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml \
  --schema schemas/turnfile/turnfile-v0.schema.json   # schema + lint PASS
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md  # PASS
node tools/validate-prd-promotion.mjs                 # exit 0
node tools/validate-public-surface-snapshot.mjs       # public-surface snapshot gate (exit 0)
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml \
  --mailbox working-session/MAILBOX.md                # clean or recorded deferral
npm run -s validate:skills                            # PREFLIGHT PASS
npm test                                              # PRD eval suites green
```

A failing gate blocks the tag unless the Maintainer records an explicit deferral
with reason and next owner.

## 2. Version + surface propagation

Per the cross-portfolio versioning rule, bump the version and propagate it to
every surface that displays a version or date:

- `CHANGELOG.md` — new entry (version, ISO date, summary), prior entries preserved.
- `README.md` — version/status references and the PRD status index.
- `docs/index.html` — version block, byline date, JSON-LD `dateModified`,
  `article:modified_time`, last-revision stamp.
- `docs/llms.txt` and `assistant-guide.txt` (+ `.well-known/` copy) — `Updated:`
  date; if `assistant-guide.txt` content changed, recompute SHA-256 and update
  both the manifest sidecars (verify byte-identical).
- Affected `skills/<agent>/MANIFEST.yaml` — bundle version + recomputed hashes.

## 3. Security / integrity

- Confirm no secrets or `.env` are tracked.
- Confirm `robots.txt` still permits the intended AI/LLM crawlers.
- Confirm the ownership guard (PRD-033, once implemented) is configured and
  `core.hooksPath` points at the Maintainer-owned shared hook (drift = decision-required).
- Confirm the assistant-guide trust-anchored pair is byte-identical.

## 4. Tag + GitHub Release

```bash
git tag -a vX.Y.Z -m "Brief release title"
git push origin vX.Y.Z
gh release create vX.Y.Z --title "vX.Y.Z — title" --notes-file <(...)
gh release list --limit 5
```

A commit without a tag is not a release; a tag without `gh release create` is not
a release. Both are required.

## 5. Close-out grep

```bash
grep -rnE "<old-version>" . \
  --include="*.md" --include="*.txt" --include="*.html" \
  --include="*.json" --include="*.yaml" --include="*.yml" \
  | grep -v ".git/" | grep -v "node_modules/" | grep -v "CHANGELOG"
```

Result must be empty except for CHANGELOG history and intentional pedagogical examples.
