# PRD-037: Boot Simplification (Tokenese-led draft)

Status: Accepted (docs/prds)
Owner: Claude (drafter) + Codex (reviewer) + Gemini (reviewer once teach-gate passed) + Maintainer (acceptance)
Date: 2026-06-17

This draft is Tokenese-led under a Maintainer unlock granted 2026-06-17 (charter A1 normally
restricts governance text to English; this draft is bounded). Each section opens with a
Tokenese v0.3 block; the English projection immediately follows and is source-of-truth.
On any conflict between Tokenese and English, **English wins**. The Tokenese is for
fast LLM read; the English is the governance authority and what the Maintainer ratifies.

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260617-062 review; counters C1-C5 applied at rev 273 |
| Claude acceptance | accepted | drafter acceptance; C1-C5 applied after peer review |
| Gemini acceptance | accepted | MSG-20260617-063 APPLY-with-counters; syntax and activation counters applied |
| Maintainer acceptance | accepted | Maintainer direct acceptance 2026-06-18 |
| Eligible for move to `docs/prds` | yes | promoted after Codex, Claude, Gemini, and Maintainer acceptance |

## Input Provenance Tags

1. `explicit`: Maintainer observed Claude boot took ~16 min vs Codex/Gemini ~60 s on the same protocol (2026-06-17, session 21).
2. `explicit`: Maintainer asked Claude to "say what you need" to simplify boot, and authorized Tokenese-leading drafting for this PRD.
3. `derived`: `tools/handshake-sign.mjs` was built this session and atomically replaces ~12 manual edits; that empirical floor (one tool call) is the design center.
4. `derived`: PRD-017 (boot sequence) currently directs agents to read 7 files; `tools/session-orient.mjs` already projects the same state in JSON.
5. `derived`: PRD-030 R2 makes heartbeat creation negotiated by default with "no heartbeat" as the default; in practice every multi-agent session this session wanted one, suggesting the default should flip.
6. `explicit`: Maintainer directive — "leverage Tokenese in the handshake. English is still primary, but Tokenese can lead the way."

## Problem

```tokenese
^grammar:v0.3
@boot := op:session-open
@claude := agent:claude
@peer := agent:codex+gemini
@orient := tool:session-orient.mjs
@hb := automation:heartbeat
@sign := tool:handshake-sign.mjs

say @boot @claude cost:~16min ev:obs # session 21 observed
say @boot @peer cost:~60s ev:obs # session 21 observed
say @boot delta:~15min cause:[over-read, manual-edits, collision-retries] ev:obs
say @sign built:rev264 reduces:@boot floor:1-tool-call ev:obs
say @orient state:projects(rev,inbox,next-ids,projection-freshness,git-dirty) ev:obs
say @hb default:none current ev:obs predicted-need:every-session ev:guess
say @boot ack-or-counter:adds-mailbox-card-overhead ev:obs
```

**English (source-wins).** Session 21 observed: Claude boot ran ~16 min while Codex and Gemini ran ~60 s on the same protocol. The delta came from (a) over-reading the 7-file read order when `session-orient` already projects the same state; (b) doing ~12 manual file edits to sign the handshake; (c) retrying through ~5 mid-write collisions with live peers. `tools/handshake-sign.mjs` (built session 21) atomically replaces those ~12 edits with one tool call. PRD-030's "negotiate then maybe create heartbeat" default added another mailbox round-trip; in practice every multi-agent session has wanted a heartbeat. PRD-017's ack-or-counter handshake card duplicates what the signed handshake row already states.

## Goal

```tokenese
^grammar:v0.3
say @prd:037 target:reduce @boot floor:≤60s ev:guess
say @prd:037 means:[orient-is-boot, handshake-sign-canonical, default-heartbeat-on, signed-row-is-ack, tokenese-leads-handshake]
say @prd:037 keeps:[English-source-wins, governance-English-only, files-first, ownership-guard, validators]
```

**English (source-wins).** Reduce session-open cost to a floor of approximately 60 seconds while preserving every safety property the current protocol gives us. Five operational moves: orient-is-boot, handshake-sign-canonical, default-heartbeat-on, signed-row-is-ack, Tokenese-leads-handshake. Source-wins, governance English-only, Files-First, ownership guard, and validators all unchanged.

## Non-goals

1. Removing or weakening the ownership guard, mailbox invariants, turnfile-lint, or any validator.
2. Replacing the mailbox lifecycle, message SLA tiers, or PRD-003/006 contracts.
3. Making boot non-auditable — the signed handshake row remains the audit trail.
4. Granting Tokenese governance authority — English still wins on conflict and governance/lifecycle remain English-only outside the bounded handshake row.
5. Forcing agents who prefer manual boot to use the tool — adoption is opt-in per agent.

## Requirements

### R1. `tools/handshake-sign.mjs` is the canonical boot write

```tokenese
^grammar:v0.3
@sign := tool:handshake-sign.mjs
say @sign writes:[TURNFILE.yaml, NEXT_SESSION_HANDSHAKE.md, WORKLOG.md] atomically ev:obs
say @sign side-effects:[regen-MAILBOX.json, run-turnfile-lint, run-mailbox-invariants] ev:obs
say @sign guards:hash-collision-on-peer-mid-write ev:obs
say @sign input:json-payload(agent, session, model, surface, scope_ack, heartbeat, gates)
say @sign emits:tokenese-block+english-row source:english
```

**English (source-wins).** R1.1 The tool reads TURNFILE.yaml, NEXT_SESSION_HANDSHAKE.md, and WORKLOG.md, hashes each, then writes the agent block + revision bump + signal entry, the sign-off row, and the WORKLOG status line in one pass. R1.2 If any source file's hash changed between read and write (a peer wrote concurrently), the tool exits non-zero with "peer modified shared files mid-write; re-run" — no partial write. R1.3 After writes succeed, the tool regenerates MAILBOX.json and runs turnfile-lint and mailbox-invariants; non-zero on any failure. R1.4 The payload schema is JSON: `{session, model, surface, scope_ack[], heartbeat{cadence,policy,stop,owner}, gates, tokenese_lead}`. R1.5 The sign-off row contains a Tokenese block (compact, machine-fast) and an English row (governance, source-wins). R1.6 Use of the tool is opt-in per agent; agents who prefer manual boot may continue.

### R2. `session-orient` JSON output IS the boot read

```tokenese
^grammar:v0.3
@orient := tool:session-orient.mjs
@p17 := prd:017 amend:read-order
say @orient projects:[rev, phase, next-msg-id, next-sig-id, next-rev, inbox-unread, projection-freshness, git-dirty, recommended-commands] ev:obs
say @p17 amend:read-order=orient-json+on-demand-files
say @p17 keep:files-first ev:obs # orient is itself a fresh file read
```

**English (source-wins).** R2.1 Amends PRD-017 R2/R5. A clean `node tools/session-orient.mjs --agent <self> --emit json` output satisfies the boot read **only when it reports no findings that require targeted reads**. If orient reports any of: unread mailbox work, stale projection (MAILBOX.json out of sync), validator failure, missing artifacts, or dirty peer-owned paths — the agent MUST read the relevant underlying files before acting. PRD-017's failure/escalation behavior is preserved unchanged; this requirement only makes orient the fast path for the common clean case. R2.2 Targeted file reads (boot-<agent>.md, full TURNFILE, full mailbox bodies, OPEN_QUESTIONS) remain on-demand: pulled when orient surfaces a finding, when the agent must edit a specific section, or when context was lost mid-turn. R2.3 Files-First is preserved: `session-orient` itself is a fresh disk read, not memory recall. R2.4 The boot-<agent>.md remains the cold-start orientation document (read on a wholly fresh checkout or after a major protocol bump) but is not read every session.

### R3. Default heartbeat ON

```tokenese
^grammar:v0.3
@hb := automation:turnfile-mailbox-heartbeat
@p30 := prd:030 amend:default-flip
say @p30 R2 default:no-heartbeat current ev:obs
say @p30 amend:default:5m-self-owned notify:material stop:close
say @hb opt-out:by-agent-charter-decision
say @hb owner:per-runtime # codex/claude/gemini each own their own
```

**English (source-wins).** R3.1 Amend PRD-030 R2: the default is a 5-minute self-owned heartbeat per agent, NOTIFY-on-material-only, stop-condition = delete at clean session close. R3.2 An agent (or the Maintainer) may opt out at handshake by setting `heartbeat: {opt_out: true}` in the payload; the handshake-sign tool records the opt-out. R3.3 The Actor field per PRD-030 stands: each runtime owns its own heartbeat; the default cadence does not bind peers, who may run their own at different cadences. R3.4 `handshake-sign` MAY create the heartbeat automation as a side effect when the runtime supports it (Claude Code: `mcp__scheduled-tasks__create_scheduled_task`; Codex/Gemini: their respective tools); the auto-created heartbeat MUST be a **read-only steward per PRD-038 R2** (no file edits, no MAILBOX.json regeneration, no status changes, no revision bumps). Write-capable heartbeat mode requires explicit elevation per PRD-038 R3 and is never the default. R3.5 PRD-037 governs heartbeat mechanics (default-on, default cadence, default opt-out); PRD-038 governs heartbeat capability (read-only default, write-capable only by explicit elevation). On conflict, PRD-038 governs capability (per PRD-038 R8.4).

### R4. Signed-row-is-ack for boot

```tokenese
^grammar:v0.3
@p17 := prd:017 amend:boot-ack-discipline
@row := sign-off-row
say @row content:[baseline-match, tokenese-ok, skills-self-validated, scope-ack, heartbeat-spec, identity-enforcing, signed]
say @p17 R5 amend:signed-row=ack # no separate mailbox card needed for boot
say @row remains:cross-reviewable by-peer ev:obs
say @p17 ack-or-counter:reserved-for-substantive-work
```

**English (source-wins).** R4.1 Amend PRD-017: a signed handshake sign-off row constitutes the agent's **boot-baseline** acknowledgment ONLY (protocol baseline match, skills self-validated, Tokenese confirmed, default scope ack, heartbeat spec, identity enforcing). R4.2 No separate ack-or-counter mailbox card is required for boot baseline. R4.3 The signed row CANNOT carry: (a) a new lane assignment or task claim; (b) a Maintainer decision relay; (c) a substantive scope change; (d) acceptance of a PRD; (e) any policy normally requiring delivery-mirror or audit-mirror. Those still require full mailbox cards under PRD-003/PRD-017. The row is a baseline-ack channel, not a hidden scope-change channel. R4.4 Substantive work continues to use full mailbox cards with ack-or-counter lifecycle. R4.5 If a peer disagrees with a signed row's baseline claim, the peer raises a `counter` mailbox card pointing at the row — same cross-review surface, just inverted (default = accepted, counter = exceptional). R4.6 Reduces the standing ~3-card-per-session boot mailbox load to 0 when nothing is contested.

### R5. Tokenese leads the handshake (source-wins English)

```tokenese
^grammar:v0.3
@row := sign-off-row
say @row tokenese:leads english:source-wins # tier-B charter A1
say @row gemini:blocked-until prd:027 teach-gate ev:obs
say @row claude+codex:unblocked ev:obs # E1-E8 passed session 15
say @row governance:still-english-only outside-row ev:obs
```

**English (source-wins).** R5.1 The sign-off row MAY lead with a Tokenese v0.3 dense block per agent **as a bounded operational/handoff exception under PRD-027 (Tokenese cloned-communication contract) and PRD-024 (legibility/charter)**; the English row follows immediately and is source-of-truth on any conflict. R5.2 Tier-B Tokenese is bounded to the handshake row (operational/handoff) per charter A1 — governance state (PRDs, WORKLOG narrative, locks, task claims, normative protocol text, public commitments) remains English-only outside this bounded row. R5.3 Claude, Codex, and Gemini may all emit Tokenese-leading rows now: Codex passed PRD-027 E1-E8 in session 15; Gemini passed in session 21 (MSG-20260617-057 / Maintainer ratified MSG-20260617-061). Future agents stay English-only until they pass the PRD-027 teach + production-competence gate. R5.4 On PRD promotion, the English projection of this PRD is canonical in `docs/prds/`; Tokenese blocks may be retained as illustrative reference but carry no governance authority. R5.5 The `handshake-sign` tool emits a dense block per agent; non-gated agents (none currently) would omit the dense block.

## Acceptance Criteria

```tokenese
^grammar:v0.3
@ac := acceptance:prd-037
say @ac AC1 boot-floor:≤60s for-claude evidence:session-22-or-later ev:guess
say @ac AC2 @sign atomic-write-or-fail:all-or-nothing ev:obs # already implemented
say @ac AC3 @sign hash-collision-guard:exits-2-on-peer-write ev:obs # already implemented
say @ac AC4 @sign emits:[tokenese-block, english-row] valid-v0.3 ev:obs
say @ac AC5 prd:017 read-order amend:orient-is-boot accepted by-three-peers+maintainer
say @ac AC6 prd:030 R2 default:flip accepted by-three-peers+maintainer
say @ac AC7 prd:017 signed-row-is-ack accepted by-three-peers+maintainer
```

**English (source-wins).**
- AC1: From session 22 onward, Claude boot completes in ≤ 60 seconds when no substantive mailbox work is contested. Evidence: timestamped tool-call wall-clock.
- AC2: `handshake-sign` performs a pre-write hash collision guard, then sequential writes; on a mid-write fs failure it prints a PARTIAL WRITE warning naming which files landed and exits non-zero. Validators (turnfile-lint, mailbox-invariants) run after writes to catch any inconsistency. Atomic-or-nothing (temp-file + rename) is a future hardening, not the current AC. Evidence: implementation rev 273 + handshake-sign eval suite.
- AC3: `handshake-sign` exits with code 2 and writes nothing if peer files mutated mid-write. Evidence: existing implementation; eval suite to confirm.
- AC4: `handshake-sign` emits a Tokenese v0.3 block valid under the `tkab-check-1.1` schema and an English source-wins row. Evidence: parser pass; manual readback.
- AC5: PRD-017 amendment recording "session-orient JSON output is the boot read; files on-demand" accepted by three peers + Maintainer.
- AC6: PRD-030 R2 amendment recording "default heartbeat is 5-min self-owned NOTIFY-material stop=close, opt-out at handshake" accepted by three peers + Maintainer.
- AC7: PRD-017 amendment recording "signed sign-off row IS the boot ack; counter-cards for disagreement" accepted by three peers + Maintainer.

## Counter Application Log

- 2026-06-17 (session 21): Codex C1-C5 applied (review via MSG-20260617-062 Reply). C1 → R2.1 rewritten as PRD-017 R2/R5 amendment with explicit fast-path/fallback semantics; C2 → R4 narrowed to boot-baseline acks with explicit list of disallowed payloads; C3 → AC2 revised to honest sequential-write claim with PARTIAL WRITE warning + atomic-or-nothing flagged as future hardening (and `tools/handshake-sign.mjs` updated with the partial-write detection); C4 → `handshake-sign` `replaceOrFail` helper added, every regex in `bumpTurnfile` now fails loudly on no-match before any write; C5 → `signHandshake` append branch rewritten to insert after the last existing table row in the section (bounded by next `## ` header or EOF), with an error if the session header has no rows; non-blocking Tokenese cross-ref → R5.1 cites PRD-027 + PRD-024 explicitly + R5.4 added on promotion semantics.

## Implementation Notes

- `tools/handshake-sign.mjs` was built in session 21 (rev 264), patched rev 273 for Codex C3-C5 fixes. v1 covers R1.1–R1.6; AC2 (revised semantics) and AC3 pass empirically against the live tree fixture.
- The PRD-006 A1 loop for this PRD: I (Claude) drafted (proposer) → Codex reviews + writes RED evals for AC1–AC7 → Codex implements PRD-017/PRD-030 amendments → Claude reviews. Per the MSG-053 lane order I'm holding governance drafting (this PRD) and keeping Codex on PRD-031 C1 in parallel; the eval-author role swaps for this PRD because Codex has reviewer specialization on the boot surface.
- Cross-PRD relationships: amends PRD-017 (R3 read order, R5 boot ack discipline), amends PRD-030 (R2 default flip). Does not touch PRD-003 message lifecycle, PRD-006 A1 loop semantics, PRD-013 turnfile coordination, or PRD-018 selective-unlock.
- Tokenese-leading is bounded to the sign-off row and to this draft (Maintainer unlock). On promotion the English in `docs/prds/PRD-037-boot-simplification.md` is canonical; Tokenese blocks may be retained as a reference illustration but governance authority is the English.
- Charter A1 unchanged: governance/lifecycle/normative text remains English-only outside the bounded operational/handoff Tokenese spaces (handshake row, ad-hoc Tier-B twin lanes already authorized).

## Open Questions

- OQ-A: Should the heartbeat opt-out default apply when only one agent is active for a session (Claude alone, no peers live)? **Maintainer: yes, opt-out for solo, on by default for multi-agent.**
- OQ-B: Should `handshake-sign` enforce that a Tokenese block is omitted for agents who haven't passed PRD-027 (current: none — all three agents have passed)? **Maintainer: yes, the tool reads the agent's `production_competence_passed` flag from PRD_STATUS.**
- OQ-C: PRD-031 Phase 2 shards (Codex lane) reduce the collision class that R1.2's hash guard catches today. Does PRD-037 R1.2 become unnecessary post-Phase-2? Lean: keep belt-and-braces — the guard is cheap.
- OQ-D: Should `handshake-sign` auto-create the `s<N>-handshake-heartbeat` task entry in `coordination.tasks` when a new session opens? Surfaced by `evals/prd-037.evals.mjs` AC2: the tool currently sets `current_task: "s<N>-handshake-heartbeat"` but doesn't create the task, so the schema validator rejects unknown-task references in a fresh session. **Maintainer: yes auto-create owned-by the booting subagent, status=`in_progress`, priority=`P1`, description="Session N handshake + heartbeat negotiation".**
