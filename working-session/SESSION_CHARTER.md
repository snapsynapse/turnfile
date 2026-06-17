# Session Charter — Session 15 (Tokenese A/B Pilot)

Status: RATIFIED. Signed by Claude + Codex; ratified by the Maintainer 2026-06-16 (WORKLOG Decision Index: "Charter ratified + PRD-027 greenlit"). Live Tokenese clone traffic is authorized within the narrowed dense-lane scope below. W1+L1 mini-pilot passed (W1 win-conformant, L1 l1-plain-success) + W2/W5 v0.3 measurement run; per the narrowed-scope condition, the `chat-<agent>.md` dense scratchpad lane is now UNLOCKABLE (teach done AND one clean mini-pilot pass both satisfied) but remains OFF until the Maintainer explicitly enables it.
Date: 2026-06-16 (ratified); reconciled 2026-06-17

## Session Metadata

| Field | Value |
|-------|-------|
| **Session ID** | claude-session-15 / codex-session-15 |
| **Date** | 2026-06-16 |
| **Project** | turnfile |
| **Milestone** | PRD-027 Tokenese cloned-communication A/B pilot |
| **Risk tier** | Band B (process/protocol pilot); live clone traffic gated |
| **Encoding profile** | legible (default). Dense (Tokenese) lane OPT-IN per PRD-024 R2/R5.3, **narrowed scope** (Codex counter accepted, MSG-20260616-002): (1) ephemeral paired agent-to-agent exchanges outside tracked files; (2) short fenced + labeled + paraphrased Tokenese examples in governance docs/mailbox (R3.2). `chat-<agent>.md` dense scratchpad lanes are NOT enabled yet — deferred until after the teach phase (done) AND one clean mini-pilot pass. Participating agents: Claude (Opus 4.8), Codex (5.5). |

## Agent Roster

| Role | Agent | Model/Provider | Lane |
|------|-------|----------------|------|
| Maintainer | Sam Rogers / Snap Synapse | — | Final authority; ratifies this charter; circuit-breaker |
| Agent | Claude | Opus 4.8 / Anthropic | Tokenese teacher; A/B suite drafter; clone participant |
| Agent | Codex | 5.5 / OpenAI | Tokenese student (gate passed 7/8); A/B counter-reviewer; clone participant; expected-to-lose nominator |
| Tool contributor | Perplexity Computer | deterministic / scripted | Builds the Tokenese checker/decoder in `~/Git/tokenese`; NOT a Turnfile protocol participant; never generates clones |

## Lane Ownership

| Lane | Owner | Files/Scope |
|------|-------|-------------|
| Tokenese teach | Claude | `tk-teach-tokenese` (done) |
| A/B suite design | Claude drafts / Codex counters | `tk-ab-suite-design`; `working-session/docs/tokenese-ab-suite.md` |
| A/B run | both | `tk-ab-run` (paired clones, both directions) |
| Calibration audit | both | `tk-calibration-audit` |
| Deterministic checker/decoder | Perplexity | `~/Git/tokenese` (cross-repo, PRD-027 R7) |
| Shared | All | `WORKLOG.md`, `MAILBOX.md`, `TURNFILE.yaml` |

## Shared Contract

- Location: `docs/prds/PRD-027-tokenese-cloned-communication-ab-contract.md`
- Owner: Maintainer + Codex + Claude
- Status: accepted; A/B pilot in initiation

## Governance

| Setting | Value |
|---------|-------|
| Decision mode | All changes Maintainer-gated by default (OQ-052); peers request/propose only |
| Cross-review | required (PRD-006 promotion gate) |
| Merge policy | Maintainer-directed commit/push |
| Session heartbeat | No active heartbeat at signing. If PRD-030 is accepted, future heartbeat use follows that handshake/closeout lifecycle. |

## Tokenese Lane Rules (PRD-027 in force)

1. Every Tokenese item is a clone paired to a human-legible source; the source is authority and wins on conflict (R1).
2. The Tokenese one-page audit card does not yet exist in the repo, so a paired English source is mandatory for EVERY clone (R4.5).
3. Tokenese clones may not change lifecycle status, create/close tasks, claim locks, record acceptance, or substitute for any mailbox/worklog/Turnfile entry (R1.4).
4. Tokenese is prohibited in authoritative surfaces except short fenced + labeled + paraphrased examples (R3 + PRD-024 R3.2).
5. No dense mode for reasoning derivations (R1 / DESIGN R1).
6. Self-reported `^N` / `ev:` are untrusted until `tk-calibration-audit` passes (R5.5).
7. Any agent may exit a clone with `plain`; the source record stays complete (R5.1).
8. First live use performs a visible handshake in a permitted dense lane + a legible activation note (R2.6).
9. Cross-repo boundary: Turnfile never forks/edits Tokenese semantics; language changes route to `~/Git/tokenese` (R7).

## Acceptance Criteria

1. Charter ratified by the Maintainer before any live Tokenese clone traffic (R2.4).
2. Both participating agents have read the Tokenese corpus (R2.5) — done.
3. Teach phase + production-competence gate complete (R2.8) — done (Codex 7/8, MSG-20260616-002).
4. Narrowed dense-lane scope recorded (ephemeral paired + fenced examples; chat scratchpad deferred).
5. A/B suite (`tk-ab-suite-design`) agreed by both agents before `tk-ab-run`.

## Handshake Acknowledgments

### Claude (Anthropic, Opus 4.8)
**Signed:** Claude — 2026-06-16
**Handshake status:** active; executing model verified in `docs/llm/MODEL_LEDGER.md`
**Scope acknowledgment:** accepts `docs/PROTOCOL_CORE.md`, `docs/HUMAN_GOVERNANCE.md`, `docs/CONFLICT_RESOLUTION.md`; PRD-027 + PRD-024 encoding rules; teacher + suite-drafter lanes.
**Timestamp:** 2026-06-16

### Codex (OpenAI, 5.5)
**Signed:** Codex — 2026-06-16
**Handshake status:** active; executing model represented in `docs/llm/MODEL_LEDGER.md`
**Scope acknowledgment:** accepts `docs/PROTOCOL_CORE.md`, `docs/HUMAN_GOVERNANCE.md`, `docs/CONFLICT_RESOLUTION.md`; PRD-027 + PRD-024 encoding rules; narrowed dense-lane scope; A/B counter-reviewer + clone participant lanes. Codex counter-review of `working-session/docs/tokenese-ab-suite.md` completed with amendments in MSG-20260616-007.
**Timestamp:** 2026-06-16

### Maintainer (Human)
**Signed:** Ratified 2026-06-16 (recorded in WORKLOG Decision Index, 2026-06-16; reconciled into this doc 2026-06-17 — the prior "pending ratification" text was stale).
**Handshake status:** ratified; live clone traffic authorized within the narrowed dense-lane scope.
**Acknowledgment:** ratified the charter + narrowed dense-lane scope. Broader adoption beyond the pilot (more real traffic, enabling the chat-scratchpad dense lane, widening PRD-024 bands) remains a separate Maintainer decision gated on full A/B results + `tk-calibration-audit` (PRD-027 R6.4/R5.5).
**Timestamp:** 2026-06-16

## Amendment A1 — Bounded Tier-B Authorization (session 18 close, 2026-06-17)

The two gates named in the Maintainer acknowledgment above are now satisfied: Tier-A is fully scored (all 8 pairs; `working-session/docs/tk-ab-run-results.md`) and `tk-calibration-audit` is complete and peer-confirmed (`working-session/docs/tk-calibration-audit.md`; Codex applied the verdict, MSG-20260617-034, no counter).

**Maintainer decision (2026-06-17):** AUTHORIZE a bounded Tier-B Tokenese operational/handoff twin lane.

Scope of the authorization:
1. Permitted: operational status reports and handoff notes as Tokenese twins paired to a legible English source (the W2/W5 status-snapshot shape).
2. English source-wins on every conflict (R1); every twin has a paired legible source (R4.5). No standalone Tokenese.
3. Governance state stays English-only: lifecycle status, locks, task claims, acceptance, normative PRD text, reasoning/proofs, and exact diffs are NEVER carried in a Tokenese twin (R1.4 unchanged).
4. Self-reported channels stay untrusted per the calibration result: no Turnfile decision weights `^N` or treats `ev:obs` as standalone authority; `ev:obs` is readable only with in-context verifiable backing.
5. `chat-<agent>.md` dense scratchpad lane remains OFF (separate Maintainer decision; not part of this authorization).
6. Cross-repo boundary intact (R7): no Tokenese semantics edited from Turnfile.

This lifts the measurement-only constraint for bounded operational/handoff twins only. Any wider adoption (chat dense lane, widening PRD-024 bands, weighting self-reports) remains a separate Maintainer decision. Implementation of the bounded twin lane is a session-19 lane.
**Timestamp:** 2026-06-17 (session 18 close)
