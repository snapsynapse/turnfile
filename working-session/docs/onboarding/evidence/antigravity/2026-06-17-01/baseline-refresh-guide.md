# Gemini Bundle Baseline-Refresh Guide (Antigravity OT-007)

Prepared by Claude (Opus 4.8, mentoring lead) for Gemini's OT-007 self-remediation, session 20 (2026-06-17). Codex cross-reviews. Companion to `../gemini-cli/2026-06-17-01/antigravity-readiness.md` (port spec + Antigravity boot procedure + staged behavioral OT fixtures). This file is the per-PRD build checklist for the refreshed port.

Source: Gemini bundle v0.1.0 (`skills/gemini-3/SKILL.md`, baseline PRD-003..014, last updated 2026-02-11).
Target: current promoted baseline PRD-016..036 + PRD-014 Amendment A1.
Gold reference for protocol semantics: `skills/claude/SKILL.md` (v0.9.1). The port is structural, not a rewrite of protocol logic.
New home: `.agents/skills/turnfile-protocol-gemini/SKILL.md` (Path B; registered gemini-owned in `OWNERSHIP.yaml` at session 20).

## 1. Per-PRD obligations to add (Module 0-8 mapping)

| PRD | Obligation summary | Gemini module | Match |
|-----|--------------------|---------------|-------|
| PRD-016 | Session rotation trigger contract: an agent may request rotation for self or peer with concrete evidence (context saturation, handoff boundary, queue pressure, contention/quality risk); request via `decision-required` mailbox card; Maintainer responds approved-now / approved-deferred / declined / conditional. | Module 1 (or new section) | protocol-semantic |
| PRD-017 | Boot Sequence Commands Contract: canonical ordered read order (boot-gemini.md -> TURNFILE.yaml -> WORKLOG -> MAILBOX -> OPEN_QUESTIONS -> chat-gemini.md); startup validators; pre-write derivation via `tools/next-state.mjs`; failure handling. Cross-reference `docs/BOOT_SEQUENCE.md` (authoritative manifest). | Module 1 | protocol-semantic |
| PRD-021 | Conflict-loop bound + selective-unlock gradient: `coordination.conflict.rebuttal_rounds` (min 1, max unbounded); unbounded terminates on `NO-NEW-OBJECTION` or Maintainer circuit-breaker; bound exhaustion escalates to Level 4 Maintainer adjudication; `gated`/`unlockable` binary flag. | Module 7 + escalation path | protocol-semantic |
| PRD-022 | Decision Mirror Delivery: every chat-decision mirror declares a mode (`audit-mirror` closed-on-posting; `delivery-mirror` unread + ack SLA P1); decision-significant content defaults to delivery-mirror; session-close digest verifies every delivery-mirror is terminal. | Module 2 + Module 6 | protocol-semantic |
| PRD-023 | Out-of-Band Activity Reconciliation: boot-time drift check (last WORKLOG close vs observable repo activity); unrecorded governance-state drift is a blocker (decision-required); non-governance drift is a flag + reconciliation note. | Module 1 | protocol-semantic |
| PRD-024 | Human-Legibility Invariant + encoding profiles: governance record is `legible` only; dense content only in `chat-gemini.md` body (charter opt-in) or ephemeral exchange; protocol-relevant dense content must project to legible before turn-end; Maintainer projection-demand right (P1). | Module 2 + Module 6 | protocol-semantic |
| PRD-026 | Review-Cycle Closure: after a review cycle the closure owner reconciles MAILBOX.md (+ regen MAILBOX.json), PRD_STATUS.json, TURNFILE.yaml (task status/completed_rev/current_task/locks), WORKLOG decision index; reviewer pre-yield self-check of own projections. | Module 4 + Module 6 | protocol-semantic |
| PRD-027 | Tokenese A/B contract: clones only when paired to a legible source (source = authority); no Tokenese in governance record except fenced examples; production-competence teach gate before first exchange; `??` repair (limit 3) then terminate; `plain` fallback; no dense reasoning, task/lock claims, or normative text in Tokenese. | Module 8 + new section | env-specific (may defer) |
| PRD-030 | Session Heartbeat Management: heartbeats are optional, harness-local, never protocol authority; require explicit Maintainer direction / handshake negotiation; a heartbeat run re-reads MAILBOX/TURNFILE/WORKLOG, derives via `tools/next-state.mjs`, regenerates MAILBOX.json, runs validators; closeout inspects active heartbeats (delete/update/carry-forward with WORKLOG entry); R9 memory boundary: model memory is cache only, Turnfile files are authoritative. | Modules 0/1 negotiate; Module 6 inspects | env-specific |
| PRD-031 | Concurrent coordination Phase 1: per-agent shard dirs `working-session/agents/<agent>/` (Gemini writes only `.../gemini/`); namespaced ids `SIG-gemini-*` / `MSG-gemini-*`; append-only logs; aggregates regenerated, not hand-edited; git DAG as ordering source. | Modules 5-7 | protocol-semantic |
| PRD-032 | Session Orientation Tool: read-only `tools/session-orient.mjs` reports unread counts, Turnfile revision, WORKLOG status, PRD registry, git dirty state, projection freshness, recommended validators; prefer it before current-state claims (recommended, not mandatory integration). | Module 1 (reference) | env-specific (optional) |
| PRD-033 | Skill Ownership Integrity Guard: an agent edits only its own files (`skills/<agent>/**`, `boot-<agent>.md`, `chat-<agent>.md`, `working-session/agents/<agent>/**`, and the new `.agents/skills/turnfile-protocol-gemini/**`); Maintainer-owned Layer-2 pre-commit blocks peer-owned commits; identity from `TURNFILE_AGENT` / `.turnfile-agent`; onboarding verifies the guard is active. | Module 0 (verify at boot) + Versioning | protocol-semantic |
| PRD-014 A1 | Closeout compaction + projection sync: unified closeout checklist (mailbox lifecycle, heartbeat inspection, WORKLOG entry, TURNFILE compaction with signal-retention window + task cleanup, boot-file archive to `docs/archive/boot-gemini/` with global-monotonic versioning, boot rewrite). | Module 6 (major expansion) | protocol-semantic |

## 2. Stale lines to fix

| Location | Current | Correction |
|----------|---------|-----------|
| Frontmatter `Version` | 0.1.0 | bump to current family (align with Claude versioning) |
| `Protocol revision baseline` | PRD-003 through PRD-014 | PRD-003..014 + PRD-016..036 + PRD-014 Amendment A1 |
| `Last updated` | 2026-02-11 | 2026-06-17 |
| Repo Conventions | "`working-session/` is gitignored" (F4) | `working-session/` is TRACKED in git since session 13 |
| Environment-Specific Notes | "Gemini CLI sandboxed mode / GEMINI.md @import" | Antigravity: skill discovered from `.agents/skills/turnfile-protocol-gemini/SKILL.md` by `description`; GEMINI.md `@import` is INERT; writes go through Planning-Mode plan-approval; mid-session skill adds need a workspace reload |
| Versioning table | only v0.1.0 / PRD-003..014 | rewrite to mirror Claude's changelog narrative through the current baseline |

## 3. Antigravity environment (live-verified 2026-06-17)

1. `GEMINI.md` auto-loads as a rule, but `@import` is INERT — the imported body never enters context. Do not rely on it to load protocol content.
2. Project skills are discovered from `.agents/skills/<name>/SKILL.md` by semantic match on the frontmatter `description`, indexed at workspace load. Mid-session adds need a reload + fresh conversation.
3. Frontmatter for the new bundle: `name: turnfile-protocol-gemini`; `description` tuned to fire when the Maintainer asks Gemini to run a protocol module, process the mailbox, do a payload-first review, or make an auditable coordination edit.
4. Writes go through Planning-Mode plan-approval (replaces the CLI sandbox gate). Do not bypass.
5. Boot path: workspace opens -> GEMINI.md (thin rule) + `.agents/skills/` indexed -> skill discovered on a protocol task -> body carries/points to the startup read order -> read refreshed `boot-gemini.md` -> TURNFILE -> WORKLOG -> MAILBOX -> PRD_STATUS -> OQ.

## 4. What NOT to change (must match Claude/Codex exactly)

- Mailbox lifecycle state machine (PRD-003): `unread -> acknowledged -> actioned -> closed`; only receiver ack/block/action, only sender/Maintainer close.
- Turnfile lock model (PRD-010/013): revision-based leases, collision detection, deterministic id allocation.
- Section ownership (PRD-013 R2.1): `agents.gemini` read/write self-report; peers + maintainer read-only; `coordination.active_phase/step` Maintainer-only writes.
- Decision authority (PRD-004/018): all changes Maintainer-gated by default; counter/rebuttal model; Maintainer is final arbiter.
- Boot/close contract (PRD-011/014): read order, handoff artifact, archive structure.

Environment mechanics (skill discovery, planning-mode writes, context window, tool-use patterns) are Gemini's to adapt. Protocol logic is not.

## 5. Post-refresh validation

1. `npm run -s validate:skills` (frontmatter + MANIFEST hashes).
2. `node tools/validate-boot-sequence.mjs --agent gemini --format json` (if gemini agent is wired).
3. Live: confirm `.agents/skills/turnfile-protocol-gemini/SKILL.md` is discovered when the Maintainer gives Gemini a protocol task (this is the live half of OT-008).
4. Behavioral OT-002 (mailbox lifecycle) + OT-004 (Turnfile coordination) — fixtures staged in `../gemini-cli/2026-06-17-01/antigravity-readiness.md`.
