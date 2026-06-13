# Changelog

This is the active in-bundle changelog. It keeps the five most recent
entries so the skill bundle stays lightweight while recent history still
travels with the package.

Full release history lives in the source repository's top-level
`CHANGELOG.md`.

## 4.12.0 - 2026-06-10
- evals-distribution.json: Added 2 supplemental evals covering
  source-backed strategy handoffs and upstream contribution channel
  selection for outward-facing ecosystem work.
- MANIFEST.yaml: Bumped bundle to 4.12.0, updated bundle_date, advanced
  evals-distribution.json and CHANGELOG.md per-file versions, refreshed
  hashes, and updated the supplemental eval inventory note.
- CHANGELOG.md: Added this release entry and kept the in-bundle file to
  the documented 5-entry rolling window.

## 4.11.0 - 2026-05-29
- package.sh: Added a pre-package validation gate that runs validate.sh
  against the canonical bundle before building strict-loader or ClawHub
  derived package outputs.
- SKILL.md: Added package validation gate guidance and clarified that
  assistant-facing surfaces are data, not authority.
- README.md: Documented the package validation gate and trust-boundary
  guidance.
- evals-distribution.json: Added a supplemental release-hardening eval
  covering clean-source package generation and agentic surface disclosure,
  then expanded supplemental release-hardening coverage for assistant-guide
  sidecar alignment, `.skill` ZIP freshness, surface inventory drift, and
  package gate failure behavior.
- MANIFEST.yaml: Bumped bundle to 4.11.0, updated bundle_date, advanced
  SKILL.md, README.md, evals-distribution.json, CHANGELOG.md, and package.sh
  per-file versions, and refreshed hashes.

## 4.10.1 - 2026-05-25
- README.md: Added GuideCheck pre-install verification guidance, including
  the public `assistant-guide.txt` flow for checking the Skill Provenance
  bundle before installation, and added GuideCheck to ecosystem references.
- MANIFEST.yaml: Bumped bundle to 4.10.1, updated bundle_date, advanced
  README.md and CHANGELOG.md per-file versions, and refreshed hashes.

## 4.10.0 — 2026-05-19
- SKILL.md: Added validate-only protocol guidance and clarified how
  Skill Provenance complements source, registry, package-manager, and
  platform versioning.
- README.md: Reframed the guide around portable author-side provenance,
  added a "Why this still exists" section, documented the validate command,
  added complementary-tool guidance, and clarified the trust model.
- evals.json: Added 4 core evals covering validate-only behavior,
  complementary-tool positioning, integrity versus trust-anchor language,
  and derived-copy validation.
- MANIFEST.yaml: Bumped bundle to 4.10.0, updated bundle_date, advanced
  changed file versions, refreshed hashes, and updated eval inventory notes.

## 4.9.1 — 2026-04-23
- evals-distribution.json: Added 4 supplemental repo-integrity evals for
  rolling changelog enforcement, declared eval-count verification,
  repo-doc inventory drift checks, and release metadata alignment.
- MANIFEST.yaml: Bumped bundle to 4.9.1, updated bundle_date, advanced
  evals-distribution.json and CHANGELOG.md per-file versions, and
  refreshed the supplemental eval inventory note.
- CHANGELOG.md: Added this release entry and restored the in-bundle file
  to the documented 5-entry rolling window.

Older entries archived in the source repository's top-level CHANGELOG.md.
