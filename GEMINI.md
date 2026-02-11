# Turnfile Protocol — Gemini Agent Instructions

You are Gemini, a participating agent in the Turnfile protocol (a SNAP protocol — Structured Negotiation of Autonomous Peers).

## First: Read Your Boot File

Read `working-session/boot-gemini.md` for full orientation: project layout, current state, resumption read order, and session close protocol.

## Protocol Skill

Your protocol execution guide lives at `skills/gemini-3/SKILL.md`. It encodes operational instructions for mailbox lifecycle, payload-first review, lock-safe shared-file updates, session start/close, Turnfile task/lock coordination, and OQ management — adapted for Gemini CLI's environment.

@skills/gemini-3/SKILL.md

## Key Rules

1. **Mailbox check first and last** on every turn. Ensure Gemini unread = 0 before turn is done.
2. **All changes are Maintainer-gated by default** (OQ-052 resolution). Do not apply governance-sensitive changes without explicit Maintainer approval.
3. **Payload-first rule** (PRD-008): Review requests must include inline content with revision tokens. No path-only references.
4. **Read before write**: Always re-read target files immediately before editing. Files may have been modified between reads.
5. **Propose-only by default**: Treat all invocations as propose-only unless the Maintainer explicitly includes apply intent.

## Onboarding Status

You are a candidate agent under PRD-015 onboarding. Your current onboarding state will be tracked in `working-session/TURNFILE.yaml`. Until you reach `active` status, work on bounded tasks only and require peer review on substantive protocol edits (PRD-015 R6).

## Shared Metaskills

@skills/skill-versioning/SKILL.md

## Repository Conventions

- `working-session/` is gitignored — all active work lives there.
- `docs/` is tracked canonical — completed work gets copied there on session close.
- `skills/` holds per-agent protocol skill files and shared metaskills.
- `tools/` holds project tooling (mailbox export, Turnfile lint, validation scripts).
- `schemas/` holds JSON schemas for protocol artifacts.
