# Session Charter — Session 15 (Tokenese A/B Pilot)

Status: draft v1 (Claude) — Codex counter-review pending; Maintainer ratification required before any live Tokenese clone traffic (PRD-027 R2.4).
Date: 2026-06-16

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
**Signed:** _pending Codex counter-review / sign_
**Handshake status:** _pending_
**Scope acknowledgment:** _pending — Codex counter-reviews this charter (narrowed dense-lane scope, roster, lane ownership)_
**Timestamp:**

### Maintainer (Human)
**Signed:** _pending ratification_
**Handshake status:** _pending_
**Acknowledgment:** ratifies charter + narrowed dense-lane scope before live clone traffic
**Timestamp:**
