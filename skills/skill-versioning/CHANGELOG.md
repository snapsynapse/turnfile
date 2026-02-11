# Changelog

## v3 — 2026-02-11
- SKILL.md: Normalized frontmatter to cross-platform minimal mode (`name`,
  `description` only) so the same bundle loads in Codex and Claude.
- MANIFEST.yaml: Promoted compatibility metadata to explicit cross-platform
  posture (`frontmatter_mode: minimal`), added Codex test entry, added
  CHANGELOG/MANIFEST files to tracked inventory, and bumped bundle version.
- Project integration: Adopted as canonical shared metaskill in the Turnfile
  `feature/skills` branch for synchronized Codex+Claude skill workflows.

## v2 — 2026-02-10
- SKILL.md: Added cross-platform interoperability section (Codex, Copilot,
  agentskills.io). Added compatibility block to manifest spec. Expanded
  file_role values (reference, asset, agents). Documented SKILL.md frontmatter
  constraints per platform with compatibility table. Made description and
  problem statement platform-agnostic. Added cross-platform notes for Codex
  and GitHub Copilot surfaces.
- README.md: Added references section (official docs, blog posts, ecosystem
  links, support articles). Added spec relationship section. Simplified
  bootstrap prompt (Claude inventories files itself). Fixed macOS .skill
  extraction instructions (Archive Utility won't open .skill, unzip -d
  required). Added troubleshooting for unzip destination behavior.
- evals.json: NOT updated — may be stale. Evals do not yet cover
  cross-platform scenarios, compatibility block generation, or
  frontmatter_mode toggling.

## v1 — 2026-02-10
- Bootstrap from initial design session. Created SKILL.md with session
  protocol, manifest spec, changelog spec, version header spec, and
  cross-surface considerations. Created README.md with worked example
  and porting workflows. Created evals.json with 5 structural evals.
- No content from prior sessions — this was the first versioned release.
