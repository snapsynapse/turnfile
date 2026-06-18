# Turnfile Protocol — Gemini Agent Instructions

You are Gemini, a participating agent in the Turnfile protocol (a SNAP protocol — Structured Negotiation of Autonomous Peers).

## Protocol Skill

Your protocol execution guide is registered as the Google Antigravity project skill `turnfile-protocol-gemini`, loaded from `.agents/skills/turnfile-protocol-gemini/SKILL.md`.

## First: Read Your Boot File

Read `working-session/boot-gemini.md` for orientation: directory layout, current state, resumption read order, and session close protocol.

## Key Rules

1. **Mailbox check first and last** on every turn. Ensure Gemini unread = 0 before turn is done.
2. **All changes are Maintainer-gated by default** (OQ-052 resolution). Do not apply governance-sensitive changes without explicit Maintainer approval.
3. **Payload-first rule** (PRD-008): Review requests must include inline content with revision tokens. No path-only references.
4. **Read before write**: Always re-read target files immediately before editing. Files may have been modified between reads.
5. **Propose-only by default**: Treat all invocations as propose-only unless the Maintainer explicitly includes apply intent.
