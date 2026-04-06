# Gemini CLI Onboarding — Working Session

Status: Artifacts staged (awaiting Maintainer go-ahead + Codex cross-review)
Owner: Claude (mentoring lead) + Codex (cross-review) + Maintainer (governance gate)
Date: 2026-02-11

## Purpose

Gemini-specific onboarding artifacts for the Turnfile protocol. This directory holds instruction files, boot documentation, skill bundles, and planning artifacts specific to onboarding Google Gemini CLI as a third agent.

General (candidate-agnostic) onboarding test scenarios and evidence templates live at:
- `working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md`
- `working-session/docs/onboarding/ONBOARDING_EVIDENCE_TEMPLATE.md`

Gemini-specific evidence will be recorded at:
- `working-session/docs/onboarding/evidence/gemini-cli/`

## Planned Artifacts

| Artifact | Description | Status |
|----------|-------------|--------|
| `GEMINI.md` (project root) | Minimal bootstrap instruction file for Gemini CLI | **done** |
| `working-session/boot-gemini.md` | Boot/resume documentation adapted from `boot-claude.md` v6 | **done** |
| `skills/gemini-3/SKILL.md` | Protocol skill bundle (v0.1.0, 9 modules) | **done** |
| `skills/gemini-3/MANIFEST.yaml` | Skill bundle manifest | **done** |
| `skills/gemini-3/CHANGELOG.md` | Skill bundle changelog | **done** |
| `vetting-plan.md` | PRD-015 vetting scenario plan with Gemini-specific OT mapping | **done** |

## Governance

All Gemini onboarding work is **Band C** per PRD-018 — Maintainer approval required before:
1. Gemini gets write access to shared coordination artifacts.
2. Any onboarding state transitions in Turnfile.
3. PRD-015 R4 vetting scenarios are finalized.

## Related

1. PRD-015 (agent onboarding + vetting contract) — acceptance blocked on onboarding validation evidence.
2. MSG-20260211-013 (mentoring proposal — Claude lead, Codex cross-review, agreed).
3. MSG-20260211-015 (PRD-015 acceptance rollback — Maintainer direction).
4. MSG-20260211-016 (general onboarding test suite scaffold — under review).

## Research Summary (from session 13)

Gemini CLI capabilities relevant to onboarding:
- `GEMINI.md` at project root (analogous to `CLAUDE.md`)
- Hierarchical instruction files (`~/.gemini/GEMINI.md` -> project -> subdirectory)
- `@file.md` import syntax for modular instructions
- `.gemini/` directory for project-local config + `settings.json`
- Terminal-first, open source (Apache 2.0), MCP client support
- 1M token context window, file read/write tools, shell access
- Free tier: 60 req/min, 1,000/day

Key differences from Claude/Codex:
- Uses `sandboxed` mode by default for file writes (plan-approval workflow)
- MCP server support allows external tool integration
- No native `SKILL.md` concept — instructions are flat `GEMINI.md` files with `@import` for modularity
