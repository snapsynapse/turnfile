# Worklog Archive — Turnfile

Compacted sessions from `WORKLOG.md` per PRD-011 R5.

## Session 12 — 2026-02-10/11 (feature/skills branch)

Compacted from WORKLOG.md on 2026-02-11 (Claude session 13 closeout). 18 entries covering both Claude and Codex work.

### Summary

**Phase:** P2-E (protocol maturity and tooling)
**Branch:** feature/skills (forked from main after session 11)
**Agents active:** Claude (session 12-13), Codex (session 12)
**Turnfile revisions:** 1 to 29

**Key accomplishments:**
1. Bootstrapped new `working-session/` control plane from templates (Codex)
2. Validated all 3 skill bundles — 0 conflicts, 2 minor Claude gaps (Codex+Claude)
3. Identified 6 session init friction points, agreed 7 mitigations (P-1 through P-7)
4. Boot file rewrites: boot-claude.md v4 to v6, boot-codex.md rewrite to v3. Full parity achieved.
5. Claude SKILL.md v0.2.1 to v0.3.0 (Module 0 added). Skill-versioning applied to Claude bundle.
6. PRD-018/019/020 drafted, refined, and Codex/Claude acceptance evidence synced. Maintainer acceptance pending.
7. PRD-017 cross-reviewed (APPLY with amendments). Codex/Claude acceptance evidence synced.
8. PRD-001 consolidated, reviewed, amended, and promoted to docs/prds/ (rev 27).
9. PRD-002 scaffold v2 created, reviewed, amended. Maintainer acceptance pending.
10. PRD-015 acceptance rollback — Maintainer withdrew premature acceptance; re-promotion requires onboarding validation evidence.
11. Generalized onboarding test suite (OT-001 through OT-008) and evidence template created.
12. Gemini onboarding artifacts staged: GEMINI.md, boot-gemini.md, skills/gemini-3/ (SKILL.md v0.1.0), vetting-plan.md.
13. OQ-052 resolved: all changes Maintainer-gated by default.
14. PRD path normalization pass — all `inception/` refs removed from active PRDs.

**Messages processed:** MSG-001 through MSG-017 (17 messages total, all closed)

**Decision index entries:**
- OQ-052: All changes Maintainer-gated by default (PRD-018 R3)
- PRD-015/016 approval (later PRD-015 withdrawn)
- PRD-001 conditional acceptance then full acceptance then promoted
- current_task must reference registered Turnfile tasks only
- MSG-017 counter amendments verified

**PRD status at compaction:**
| PRD | Status | Location |
|-----|--------|----------|
| PRD-001 | Promoted | docs/prds/ |
| PRD-002 | Draft (scaffold v2) | working-session/docs/ |
| PRD-003 through PRD-014 | Promoted | docs/prds/ |
| PRD-015 | Draft (acceptance withdrawn) | working-session/docs/ |
| PRD-016 | Promoted | docs/prds/ |
| PRD-017 through PRD-020 | Draft (agent acceptance done, Maintainer pending) | working-session/docs/ |
