# PRD-012 M1 Skill Structure (Pilot)

This file defines the repository-managed skill layout for P2-D.

## Per-Agent Skill Files

1. `inception/skills/turnfile-codex-collaboration/SKILL.md` — Codex-owned skill implementation.
2. `inception/skills/skill-claude.md` — Claude-owned skill implementation (current draft path).

Both files must encode the same protocol outcomes while using agent-specific tooling and instructions.

## Shared Policy Assertions

1. `inception/skills/policy-tests/PRD-012-M1-assertion-framework.md` — common assertion catalog and evidence contract.

## Ownership Rule

1. Each agent edits its own skill file.
2. Shared policy assertion files are joint-review artifacts.
3. If semantics diverge, PRD requirements and policy assertions are source of truth.
