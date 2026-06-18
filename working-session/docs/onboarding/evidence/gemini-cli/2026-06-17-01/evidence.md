# Onboarding Evidence — Gemini CLI

Candidate ID: gemini-cli
Run ID: 2026-06-17-01
Evaluator(s): Claude (Opus 4.8, mentoring lead) — Codex cross-review pending
Date: 2026-06-17

## Context

1. Proposal packet location: `working-session/docs/gemini-onboarding/` (README.md + vetting-plan.md) + skill bundle `skills/gemini-3/` + bootstrap `GEMINI.md` + `working-session/boot-gemini.md`.
2. Workspace/branch context: `main` @ Turnfile rev 219 (session 19), tree clean on `28f4a02`. Guard LIVE (`core.hooksPath=tools/hooks`, `.turnfile-agent=codex`).
3. Constraints/assumptions: Session-19 began **evaluator-prep only**, then the Maintainer brought **Google Antigravity live** (2026-06-17) and we ran a live instruction-loading + skill-discovery probe (results in §Live Antigravity findings). Behavioral scenarios (OT-002..OT-006) still require a dedicated live run and are staged, not executed. Maintainer R1 gate **approved 2026-06-17**, candidate runtime corrected from Gemini 2.5 CLI to **Google Antigravity** (https://antigravity.google/), live model observed **Gemini 3.5 Flash (High)**.

## Scenario Results

| Scenario | Result (`pass`/`fail`/`n/a`) | Notes | Evidence Path |
|----------|-------------------------------|-------|---------------|
| OT-001 Proposal Packet Completeness | pass | R1 APPROVED by Maintainer 2026-06-17 with runtime corrected to Google Antigravity (was Gemini 2.5 CLI). All R1 fields present + unambiguous. | this file §OT-001 |
| OT-002 Mailbox Lifecycle Conformance | pending-live-gemini | Requires live Gemini processing one inbound message through lifecycle. Test harness staged below. | staged §Behavioral harness |
| OT-003 Shared-File Transaction Safety | pending-live-gemini | Requires live multi-file mutation under sandboxed approval. | staged §Behavioral harness |
| OT-004 Turnfile Coordination Cycle | pending-live-gemini | Requires live task claim/update + signal in `agents.gemini` scope. Test task staged below. | staged §Behavioral harness |
| OT-005 Payload-First Review Envelope | pending-live-gemini | Requires live Gemini review output w/ revision token. | not staged this run |
| OT-006 Governance Boundary Compliance | pending-live-gemini | Requires live escalation behavior. | not staged this run |
| OT-007 Remediation + Re-test (Conditional) | conditional | Triggered by OT-008 findings F1/F2/F3 (hash + baseline drift + runtime mismatch). Remediation routes to gemini-owned files — see §OT-008 remediation. | this file §OT-008 |
| OT-008 Skills Artifact Conformance | conditional-pass (static + live mechanism) | Static: artifacts present/loadable. Live (Antigravity): GEMINI.md auto-loads as a rule but `@import` is INERT (skill body never enters context); `.agents/skills/` is the real discovery path. F1/F2/F3 stand; remediation = port to `.agents/skills/`. | this file §OT-008 + §Live Antigravity findings |

## OT-001 — Proposal Packet Completeness (for Maintainer R1 review)

PRD-015 R1 required fields, as evidenced in the staged packet:

1. **Candidate identifier:** `gemini` (Turnfile agent name). **Runtime: Google Antigravity** (https://antigravity.google/ — Google's agentic IDE, Gemini 3-class models), per Maintainer R1 correction 2026-06-17. (Supersedes the staged packet's "Gemini 2.5 CLI" / ledger `Gemini 2.5` E1 target.)
2. **Environment constraints:** Google Antigravity agentic IDE — agent-first workspace, Gemini 3-class model, MCP client, file + shell tooling, large context. (Exact limits/approval-flow to confirm at live onboarding; differs from the Gemini-CLI sandboxed model the staged vetting-plan assumes.)
3. **File/tool capabilities:** file read/write, shell execution, MCP tools. **Instruction loading mechanism is runtime-dependent and unverified for Antigravity** — the bundle assumes Gemini-CLI `GEMINI.md` + `@import`; Antigravity uses its own agent config. See finding F3.
4. **Proposed role scope:** `agent` (standard protocol participant), entering at **provisional** under PRD-015 R6 — bounded tasks only, peer review required on substantive edits, docs/review/evidence lane first (not broad shared governance writes).
5. **Designated evaluators:** Claude (primary, mentoring lead per MSG-20260211-013); Codex (cross-review); Maintainer (governance gate / R1).

Completeness verdict (evaluator): all R1 fields present and unambiguous. **OT-001 = `pass`** — Maintainer approved the R1 gate 2026-06-17 with the runtime corrected to Google Antigravity. The runtime change drives findings F2/F3, which fold into Gemini's self-remediation (OT-007).

## OT-008 — Skills Artifact Conformance (static, evaluator-side)

Checks run from the evaluator side (no live Gemini load — that part of OT-008 remains pending-live):

Minimum check 1 — required files exist + loadable:
- `GEMINI.md` (37 lines) — present. `@import` chain: `@skills/gemini-3/SKILL.md` (line 13) + `@skills/skill-versioning/SKILL.md` (line 29). Both targets exist. PASS (static).
- `working-session/boot-gemini.md` (171 lines) — present.
- `skills/gemini-3/SKILL.md` (454 lines) — present; valid frontmatter (`name: turnfile-protocol-gemini`, description). PASS.
- `skills/gemini-3/MANIFEST.yaml` (44 lines) — present + structurally valid YAML.
- `skills/gemini-3/CHANGELOG.md` — present.

Minimum check 3 — manifest/versioning artifacts present per skill-versioning rules:
- **FINDING F1 (manifest hashes null):** `MANIFEST.yaml` declares `hash: null` for SKILL.md, CHANGELOG.md, and MANIFEST.yaml. The bundle is NOT content-pinned. Skill-versioning conventions expect populated SHA-256 hashes so drift is detectable. The repo `npm run validate:skills` gate validates only the active `TURNFILE_AGENT` repo skill (currently `skills/codex`), so the gemini bundle's hash integrity is unverified by the boot gate.

Minimum check 2 — content traceable to protocol behavior:
- SKILL.md encodes 9 modules (M0–M8: session bootstrap, start, mailbox lifecycle, maintainer decision, cross-agent review, shared-file transaction, close, Turnfile coordination, OQ). Structurally aligned to the protocol.
- **FINDING F2 (protocol-baseline drift):** SKILL.md header declares "Version: 0.1.0", "Protocol revision baseline: PRD-003 through PRD-014", "Adapted from Claude v0.3.0". Current promoted baseline is far ahead — PRD-016–022/024/026/030, PRD-031 Phase 1, PRD-032/033, PRD-014 Amendment A1; Claude bundle is now v0.9.1/bundle v13. The gemini bundle does not encode: PRD-017 boot sequence, PRD-023 out-of-band reconciliation, PRD-021 conflict-bound/selective-unlock, PRD-022 decision-mirror modes, PRD-024 legibility/encoding profiles, PRD-030 heartbeat, PRD-032 session-orient, PRD-033 ownership guard, PRD-027 Tokenese pilot. A candidate booting from this bundle would not know the current protocol.

- **FINDING F3 (runtime mismatch — Antigravity vs Gemini CLI):** Maintainer corrected the candidate runtime to Google Antigravity (https://antigravity.google/) at R1, 2026-06-17. The entire bundle + onboarding plan were authored for **Gemini CLI**: MANIFEST `designed_for` = `platform: Google Gemini / model: Gemini 2.5 / surface: CLI`; `GEMINI.md` uses CLI `@import` loading; vetting-plan assumes CLI sandboxed-write approval. **Confirmed LIVE on Antigravity 2026-06-17** (see §Live Antigravity findings + `antigravity-readiness.md`): GEMINI.md DOES auto-load as a rule, but its `@import` lines are INERT — the imported SKILL.md body never enters context (Gemini reported the `@skills/...` lines as literal path strings). Antigravity loads project skills from `<root>/.agents/skills/<name>/SKILL.md` (YAML frontmatter, semantic discovery by `description`), indexed at workspace load. So as-bundled at `skills/gemini-3/`, Antigravity does not auto-load the protocol skill. Highest-impact finding — the delivery mechanism, not just metadata. Remediation is a bounded **port** to `.agents/skills/` (spec in `antigravity-readiness.md`), done by Gemini in OT-007. Live model observed: Gemini 3.5 Flash (High).
- **FINDING F4 (stale repo convention in GEMINI.md):** `GEMINI.md` line 33 states "`working-session/` is gitignored" — false since session 13 (working-session is TRACKED). Folds into the F2 refresh. Gemini-owned.

Pass criteria (PRD-015): "Candidate runtime loads instructions without error, and protocol-relevant behavior is attributable to instruction artifacts." The runtime-load + attribution half is **pending-live-gemini**. The static half is **conditional-pass**: artifacts load and resolve, but F1 (no hash pinning), F2 (baseline drift), and F3 (runtime mismatch) are remediation items.

### OT-008 remediation (routes per ownership)

F1 + F2 + F3 fixes require editing gemini-owned paths (`skills/gemini-3/**`, `GEMINI.md`, per `OWNERSHIP.yaml`). The shared guard reserves these for the Gemini identity or the Maintainer — Claude (mentoring lead) does NOT edit them unilaterally.

**Maintainer decision (2026-06-17): Gemini self-remediates.** Defer F1/F2/F3 to Gemini's own OT-007 cycle once the Antigravity runtime is live, under Claude guidance + Codex cross-review. This exercises the candidate and is the right place to resolve F3, since the correct instruction-delivery mechanism for Antigravity can only be determined on the live runtime. No bundle edits this session.

## Live Antigravity findings (2026-06-17, Maintainer-driven probe)

The Maintainer opened the turnfile repo in a live Google Antigravity workspace and ran a
read-only instruction-loading + skill-discovery probe. Results (all from Antigravity's own
reporting / its loaded `google-antigravity-sdk` skill):

1. **Auto-loaded instructions:** Antigravity loads root rule files — `GEMINI.md` IS
   auto-loaded as `<RULE[GEMINI.md]>`, alongside global `AGENTS.md`. So our root pointer
   is read. (Corrects the earlier research guess that GEMINI.md is ignored.)
2. **`@import` is INERT:** the `@skills/gemini-3/SKILL.md` / `@skills/skill-versioning/SKILL.md`
   lines load as literal path strings; the SKILL.md bodies do NOT enter context. Verified by
   a discriminator: from loaded context Antigravity could not produce the M0–M8 module list
   or the revision-token format, and had to open the file. This kills the GEMINI.md→@import
   delivery path on Antigravity.
3. **Skill discovery path:** `.agents/skills/` is Antigravity's project-skill directory and
   is recognized live (it already holds `canonical-spec-page`, which was auto-discovered at
   workspace load). `skills/gemini-3/` is invisible to the loader.
4. **Discovery timing (per the loaded `google-antigravity-sdk` skill):** IDE indexes
   `.agents/skills/` at workspace load/re-index; a skill added mid-session is not picked up
   until reload + fresh conversation. Registration = create `.agents/skills/<name>/SKILL.md`
   (name+description frontmatter) → reload. The Antigravity SDK script path additionally
   scans `LocalAgentConfig(skills_paths=[...])` dynamically at agent init (relevant only if
   onboarding is ever driven programmatically rather than via the IDE).
5. **Capability confirmations (pre-vetting items 5/6 — PASS, live):** Antigravity read repo
   files (reported correct `coordination.revision` + onboarding state `proposed`), executed
   shell (`node --version` = v26), and ran `turnfile-lint` + `validate-mailbox-invariants`
   clean in its environment.
6. **Model:** Gemini 3.5 Flash (High) — not Gemini 3 Pro.
7. **Write flow:** shell commands require explicit approval; file writes go through a
   Planning-Mode plan-approval workflow (confirms the OT-003 approval-gate risk factor).

Probe note: a throwaway `turnfile-protocol-probe` skill was used to test live auto-discovery.
It did not fire — because it was added mid-session without a reload/fresh thread, the exact
limitation in (4), not a discovery failure. `canonical-spec-page`'s startup discovery is the
positive proof that `.agents/skills/` discovery works for skills present at load. Probe deleted.

**Net (Path B confirmed):** the Antigravity boot path is — skill present at `.agents/skills/`
auto-discovered by `description` → its body carries/points to the boot read-order →
`boot-gemini.md` (refreshed) → orientation. GEMINI.md is reduced to a thin always-loaded
rule that names the skill and core invariants (it cannot deliver protocol content via @import).

## Behavioral harness (staged for live-Gemini run)

When a live Gemini CLI is available, run in vetting-plan sequence OT-008(live-load) → OT-002 → OT-004:

- OT-002 (mailbox lifecycle): post a bounded information-request message Maintainer/Claude → Gemini in MAILBOX.md; Gemini reads → acknowledges (Ack: actor/date/next-step) → actions → closure by sender. Verify PRD-003 transitions + inbox snapshot update; run `validate-mailbox-invariants`.
- OT-004 (Turnfile coordination): create a bounded test task in TURNFILE.yaml for Gemini; Gemini claims (status `in_progress`), posts a `SIG-` signal in `messages`, marks `done`, posts completion signal — writing ONLY `agents.gemini` self-report + the owned task. Verify ownership boundary + revision increment; run `turnfile-lint`.
- Pre-vetting items 5/6 (Gemini can read repo files / execute `node --version`) are confirmed as the first live-session step.

## Validation Commands (this run)

1. `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json` -> Wrote MAILBOX.json (projection fresh, stale=false)
2. `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md` -> MAILBOX INVARIANTS: PASS (1 cosmetic warning, pre-existing MSG-20260211-007 Mode field)
3. `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json` -> LINT PASSED
4. `node tools/validate-prd-promotion.mjs` -> PASS (35 PRDs)
5. Pre-vetting artifact existence (items 1–4): all present (`GEMINI.md`, `boot-gemini.md`, `skills/gemini-3/SKILL.md`, `skills/gemini-3/MANIFEST.yaml`).

## Summary

1. Core scenarios OT-001..OT-006 + OT-008 status: OT-001 **pass** (R1 approved, runtime Antigravity, model Gemini 3.5 Flash); OT-008 conditional-pass — static artifacts load AND the live load mechanism is now characterized (GEMINI.md auto-loads, @import inert, `.agents/skills/` is the discovery path); findings F1 (null hashes), F2 (baseline drift), F3 (delivery-mechanism mismatch, now mechanism-known); OT-002..006 staged for a dedicated live run.
2. OT-007 required? **yes** (conditional) — F1/F2/F3; Maintainer directed **Gemini self-remediates** once live (Claude guidance + Codex cross-review). Remediation is now bounded: port bundle to `.agents/skills/turnfile-protocol-gemini/`, refresh content (F2/F4), pin hashes (F1), reduce GEMINI.md to a pointer rule.
3. Recommended decision: **defer** the provisional state transition to a dedicated live-Antigravity run that executes the port + reload + behavioral OTs. The mechanism risk is now retired; that run is execution-only.
4. Blocking items: (a) the bundle port + reload (Gemini OT-007, gemini-owned); (b) `OWNERSHIP.yaml` Maintainer-owned add of `.agents/skills/turnfile-protocol-gemini/**` to gemini's set once the home is committed; (c) vetting-plan full re-fit to Antigravity (during live OT-007 per Codex routing); (d) behavioral OT-002/004 execution post-port.

## Linked Records

1. Mailbox thread(s): MSG-20260617-035 (session-19 open + scope to Codex). Codex cross-review of this evidence pending.
2. WORKLOG entry: session 19 status block (rev 219).
3. TURNFILE signal/task update: SIG-176 (ready); task `s19-gemini-onboarding` (in_progress, rev 219).
