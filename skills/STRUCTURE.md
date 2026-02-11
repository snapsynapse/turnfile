# Skill Structure (PRD-012)

This file defines the repository-managed skill layout.

## Per-Agent Skill Files

1. `skills/claude-opus_4.6/SKILL.md` — Claude-owned skill implementation (v0.2.0).
2. `skills/codex_5.3/SKILL.md` — Codex-owned skill implementation.

Both files must encode the same protocol outcomes while using agent-specific tooling and instructions. New agents should copy `templates/SKILL.md` to `skills/<agent>/SKILL.md`.

## Shared Metaskills

1. `skills/skill-versioning/` — shared cross-agent metaskill for skill bundle version tracking (`SKILL.md`, `MANIFEST.yaml`, `CHANGELOG.md`, `README.md`, `evals.json`).

This metaskill is jointly consumed by Codex and Claude and versioned as part of the Turnfile repository.

## Shared Policy Assertions

Policy test evidence from the inception pilot is archived in `examples/inception/skills/policy-tests/`.

New sessions should create policy test artifacts in the active working session as needed.

## Ownership Rule

1. Each agent edits its own skill file.
2. Shared metaskills and shared policy assertion files are joint-review artifacts.
3. If semantics diverge, PRD requirements and policy assertions are source of truth.
