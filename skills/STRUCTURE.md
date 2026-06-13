# Skill Structure (PRD-012)

This file defines the repository-managed skill layout.

## Per-Agent Skill Files

1. `skills/claude/SKILL.md` — Claude-owned skill implementation (v0.4.0, role-keyed; model recorded in MANIFEST.yaml).
2. `skills/codex/SKILL.md` — Codex-owned skill implementation (v2, role-keyed; model recorded in MANIFEST.yaml).
3. `skills/gemini-3/SKILL.md` — Gemini-owned skill implementation (v0.1.0, onboarding deferred; migrates with PRD-015 resumption).
4. `skills/claude-opus_4.6/` — model-specific Claude bundle retained for models still in use outside this session.
5. `skills/codex_5.3/` — model-specific Codex bundle retained for models still in use outside this session.

All files must encode the same protocol outcomes while using agent-specific tooling and instructions. New agents should copy `templates/SKILL.md` to `skills/<agent>/SKILL.md`, where `<agent>` is the role name without a model identifier; record model compatibility in the bundle's MANIFEST.yaml.

Model-specific skill bundles are not deprecated merely because the active session uses a role-keyed bundle. No LLM, model, or model-specific skill path is deprecated unless the Maintainer explicitly declares it deprecated. Role-keyed bundles are the current session default; model-specific bundles remain valid compatibility artifacts for sessions that still need them.

## Shared Metaskills

1. `skills/skill-versioning/` — repo-local compatibility path for the shared cross-agent metaskill for skill bundle version tracking (`SKILL.md`, `MANIFEST.yaml`, `CHANGELOG.md`, `README.md`, `evals.json`).

This metaskill is jointly consumed by all agents (Codex, Claude, Gemini) and versioned as part of the Turnfile repository.
Current installs may expose the same bundle identity as `skill-provenance`; tools should accept both `skill-versioning` and `skill-provenance` while preserving `skills/skill-versioning/` as the stable repository path.

## Shared Policy Assertions

Policy test evidence from the inception pilot is archived in `examples/inception/skills/policy-tests/`.

New sessions should create policy test artifacts in the active working session as needed.

## Ownership Rule

1. Each agent edits its own skill file.
2. Shared metaskills and shared policy assertion files are joint-review artifacts.
3. If semantics diverge, PRD requirements and policy assertions are source of truth.
