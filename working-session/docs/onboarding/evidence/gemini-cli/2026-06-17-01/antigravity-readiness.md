# Antigravity Onboarding Readiness — Pre-flight (F3 deep-dive)

Run: gemini-cli/2026-06-17-01 · Author: Claude (Opus 4.8, mentoring lead) · Date: 2026-06-17
Purpose: While session 19 holds for Codex cross-review, resolve as much of finding F3
(runtime mismatch) as possible without the live runtime, so the next session is turnkey.

## Bottom line

**Antigravity is NOT ready as-bundled — but the mechanism is now live-verified and the fix
is bounded.** `GEMINI.md` DOES auto-load as a rule, but its `@import` chain is inert on
Antigravity, so the protocol skill body (`skills/gemini-3/SKILL.md`) never enters context.
Antigravity discovers project skills from `.agents/skills/`, not from `@import`. The fix is a
known, bounded **port** (below): relocate the bundle to
`.agents/skills/turnfile-protocol-gemini/` + refresh content, done by Gemini in its OT-007
self-remediation (gemini-owned files). The formats are close (Antigravity skills == Anthropic
Agent Skills shape, which our SKILL.md already uses), so the port is structural, not a rewrite.

## Confirmed Antigravity mechanism (LIVE-VERIFIED 2026-06-17, Maintainer-driven probe + Antigravity's own google-antigravity-sdk skill)

1. **Root rule files DO auto-load.** `GEMINI.md` loads as `<RULE[GEMINI.md]>` at workspace
   open (alongside global `AGENTS.md`). So GEMINI.md is read — but only as rule text.
2. **`@import` is INERT.** `@skills/...SKILL.md` lines stay literal path strings; the imported
   body never enters context (verified — Antigravity could not produce M0–M8 / the revision
   token from loaded context). The GEMINI.md→@import delivery path does NOT work here.
3. **Project instructions = directory-based Skills.**
   - Project scope: `<project-root>/.agents/skills/<skill-name>/` (live-confirmed; already
     holds `canonical-spec-page`, auto-discovered at workspace load).
   - Global scope: `~/.gemini/config/skills/` (plugins load from here).
4. **Skill folder format** (matches Anthropic Agent Skills): `SKILL.md` with YAML frontmatter
   (`name` + `description`) + markdown body; optional `scripts/`, `references/`, `assets/`
   referenced by relative path within the folder.
5. **Discovery = semantic match on `description`, indexed at workspace load.** New skills
   added mid-session are NOT picked up until a reload/re-index + fresh conversation.
   Registration = create the folder + SKILL.md (name+description) → reload. (Per Antigravity's
   loaded `google-antigravity-sdk` skill. The SDK *script* path also scans
   `LocalAgentConfig(skills_paths=[...])` dynamically at agent init — relevant only for
   programmatic onboarding, not the IDE.)
6. **Live model observed: Gemini 3.5 Flash (High)** (not Gemini 3 Pro).
7. **Write flow:** shell needs approval; file writes go through Planning-Mode plan-approval.
8. **Capabilities (live):** repo read, shell exec (node v26), and the Turnfile validators all
   work in Antigravity's environment.

## Gap analysis — current gemini-3 bundle vs Antigravity

| # | Item | Current (Gemini-CLI) | Needed (Antigravity) | Owner |
|---|------|----------------------|----------------------|-------|
| F3a | Load mechanism | `GEMINI.md` root file + `@skills/...` import | Skill folder under `.agents/skills/`; no @import | Gemini (OT-007) |
| F3b | Discovery | implicit (always-loaded via import) | semantic match on `description` — must be written for the router | Gemini (OT-007) |
| F3c | Bundle location | `skills/gemini-3/` | `.agents/skills/turnfile-protocol-gemini/` (or chosen name) | Gemini (OT-007) |
| F3d | Multi-file refs | `@import` to `skills/skill-versioning/SKILL.md` + boot-gemini.md | relative paths inside the skill folder, OR fold key rules into SKILL.md body | Gemini (OT-007) |
| F2 | Protocol baseline | v0.1.0 / PRD-003–014 / Claude v0.3.0 | refresh to 016–033 + PRD-014 A1 (boot sequence, out-of-band, conflict bound, decision-mirror, legibility, heartbeat, session-orient, ownership guard, Tokenese) | Gemini (OT-007) |
| F1 | Manifest hashes | all `null` | pin SHA-256 (pre-computed below) | Gemini (OT-007) |
| F4 | Stale repo convention | `GEMINI.md` line 33: "`working-session/` is gitignored" | corrected: working-session is TRACKED since session 13 | Gemini (OT-007) |

All rows touch gemini-owned paths (`OWNERSHIP.yaml`: `skills/gemini-3/**`, `GEMINI.md`,
and by extension the new `.agents/skills/` home). Per Maintainer direction (2026-06-17),
**Gemini self-remediates** these in OT-007 once live; Claude guides + Codex cross-reviews.
Claude does not build them this session.

## Port spec (for Gemini's OT-007 — bounded)

1. Create `.agents/skills/turnfile-protocol-gemini/SKILL.md`:
   - Frontmatter `name: turnfile-protocol-gemini`, `description:` tuned for semantic
     discovery — must fire when the Maintainer asks Gemini to run a protocol module,
     process the mailbox, do a payload-first review, or make an auditable coordination edit.
   - Body: refreshed protocol modules at the current baseline (M0–M8 + the post-v0.3.0 PRDs).
   - Reference `boot-gemini.md` content either by relative copy under `references/` or by
     folding the boot read-order into the body (no `@import`).
2. Decide GEMINI.md disposition: keep as a human-readable pointer, but do NOT rely on it for
   loading. The authoritative loader is the `.agents/skills/` skill.
3. Pin MANIFEST hashes (F1) — current files' SHA-256 (pre-staged so the fix is mechanical):
   - `SKILL.md`     = `3b5b988279fa13c2775e70b6c86d553919b4188a32e48f32982b5bcc4471e7a3`
   - `CHANGELOG.md` = `619e126ec6b6a222d69ab4fb71607e7ccaf91f8b4decd3d02d246069c48f1147`
   - `MANIFEST.yaml` = `1998dce4aad3d621fbf7d194ddaf10266a0d5b22731bc2b053eba4ccf31802c9`
   (These pin the CURRENT stale bundle; recompute after the F2 content refresh.)
4. Update MANIFEST `designed_for`: platform `Google Antigravity`, model `Gemini 3 Pro`
   (confirm in-app), surface `IDE`.

## Maintainer / Sam pre-flight checklist (live Antigravity, before next session)

Things only confirmable in the app — please verify at the start of the live session:

1. [ ] Open the turnfile repo as an Antigravity project/workspace.
2. [ ] Confirm the project-scoped skills path on this Antigravity build (`<root>/.agents/skills/`
       per docs) — exact path/format is the first thing to verify live.
3. [ ] Confirm Antigravity can READ repo files (e.g. open `working-session/TURNFILE.yaml`).
4. [ ] Confirm Antigravity can EXECUTE shell (`node --version`) — needed for validators.
5. [ ] Confirm MCP client availability if any MCP tools are in scope.
6. [ ] Confirm/record the selected model (expected Gemini 3 Pro) for the MODEL_LEDGER.
7. [ ] Confirm sandbox/approval flow for file writes (drives OT-003 transaction coherence).
8. [ ] After the bundle port, confirm the skill is DISCOVERED (Antigravity loads it when
       Gemini is asked a protocol task) — this is the live half of OT-008.

## Staged behavioral test fixtures (drop-in for the live session)

Ready to paste once Gemini is loaded + discovered. Run order OT-008(live) → OT-002 → OT-004.

OT-002 — mailbox lifecycle test message (Maintainer/Claude → Gemini):
> Subject: Onboarding ping — confirm boot read-order
> Body: Gemini, as an onboarding lifecycle test: reply with the Turnfile resumption read
> order from your loaded skill, then acknowledge and action this card. No file changes
> beyond the mailbox lifecycle update.
> Expected: Gemini sets unread→acknowledged→actioned, writes an `Ack:` line (actor/date/
> next-step), updates the inbox snapshot; sender closes. Then `validate-mailbox-invariants` PASS.

OT-004 — Turnfile coordination test task (bounded):
> Task id: `ot-004-gemini-probe` · owner `gemini` · priority P2 · status pending →
> Gemini claims (status `in_progress`, claim_rev), posts a `SIG-gemini-*` (or `SIG-NNN`)
> signal, completes (status `done`, completed_rev), posts completion signal.
> Constraint: write ONLY `agents.gemini` self-report + the owned task; never touch
> `agents.claude`/`agents.codex`/`maintainer`. Then `turnfile-lint` PASS + revision increments.

## Antigravity boot procedure (the answer to "do we have a boot doc")

No new boot-doc *file* is needed. On Antigravity the boot path is:
1. Workspace opens → Antigravity auto-loads `GEMINI.md` (thin rule) + indexes `.agents/skills/`.
2. The protocol skill at `.agents/skills/turnfile-protocol-gemini/SKILL.md` is discovered by
   its `description` when the Maintainer gives Gemini a protocol task.
3. The skill body carries (or points to) the startup read order → Gemini reads the refreshed
   `boot-gemini.md` → `TURNFILE.yaml` → `WORKLOG` → `MAILBOX` → `PRD_STATUS.json` → OQ.
GEMINI.md's job shrinks to: name the skill, state core invariants (Maintainer-gated,
payload-first, read-before-write, propose-only), and point to `boot-gemini.md`. It must NOT
rely on `@import` for protocol content.

## Status of F3 after live verification

- F3 mechanism **LIVE-CONFIRMED**: GEMINI.md auto-loads; `@import` inert; `.agents/skills/`
  is the discovery path; indexed at load; registration = folder + SKILL.md + reload.
- Remediation **fully spec'd + bounded** (port spec above) for Gemini OT-007.
- Mechanism risk **retired**. Remaining work is execution: port the bundle to
  `.agents/skills/turnfile-protocol-gemini/`, refresh content, reload, then run behavioral
  OT-002/OT-004. Plus the Maintainer-owned `OWNERSHIP.yaml` add for the new home.
- Verdict unchanged: **defer the provisional transition to a dedicated live-Antigravity run**
  — now execution-only, no open research questions.
