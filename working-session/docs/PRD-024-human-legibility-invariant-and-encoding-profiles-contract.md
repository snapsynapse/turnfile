# PRD-024: Human-Legibility Invariant and Encoding Profiles Contract

Status: Draft v1 (working-session; agent gates complete, Maintainer acceptance pending)
Owner: Maintainer + Codex + Claude
Date: 2026-06-12
Last revised: 2026-06-12 (Codex cross-review amendment)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted with amendment | candidate scope APPLY in MSG-20260612-023; document review APPLY with amendment in MSG-20260612-024 |
| Claude acceptance | accepted | author; Codex amendments (R2 charter opt-in, R5.1 validation split, OQ-062/063 resolutions) reviewed and accepted 2026-06-13 |
| Maintainer acceptance | pending | — |
| Eligible for move to `docs/prds` | no | blocked until all acceptances + zero blockers in PRD_STATUS.json |

## Input Provenance Tags

1. `explicit`: Maintainer session 14 directive, relayed in MSG-20260612-023: "In the next session, I will be incorporating a new language for you to speak in: tokenese. For now, please keep everything logged, visible, request-based, and human-legible."
2. `explicit`: Both agents independently flagged in the MSG-023 cycle that this contract must land before any dense encoding is introduced.
3. `derived`: SPEC.md section 1 (plain-file auditability) and INTENT.md design invariant 4 (files are the source of truth, readable without tooling) imply the invariant; this PRD makes it explicit and survivable under new encodings.
4. `derived`: Maintainer clarification 2026-06-12 distinguishing protocol cadence from interaction gearing establishes the pattern this PRD follows: harness-level capability changes must not silently weaken protocol guarantees.

## Alignment reference

This PRD aligns with:

1. `SPEC.md` v0.1.0-reset (sections 1, 9, 11)
2. `INTENT.md` design invariants 4, 5
3. `docs/prds/PRD-008-cross-sandbox-handoff-contract.md` (payload-first inline content)
4. `docs/prds/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md` (mailbox as default lane)
5. `docs/HUMAN_GOVERNANCE.md` (Maintainer audit rights)

## Problem

A dense agent-to-agent encoding ("tokenese") arrives next session. Without a contract in place first:

1. There is no definition of which artifacts may carry non-human-legible content and which must not.
2. There is no projection requirement, so a dense exchange could become the only record of a decision-relevant interaction.
3. Maintainer audit rights over dense content are implicit rather than enforceable.
4. The auditability claim at the core of Turnfile ("recoverable in plain text without tooling") silently erodes rather than being deliberately scoped.

The invariant must be enforceable contract before the encoding exists, not retrofitted after.

## Goal

1. Define encoding profiles and assign every artifact class exactly one default profile.
2. Guarantee the entire governance record remains human-legible markdown/YAML regardless of what encodings agents use between themselves.
3. Require a human-legible projection for any dense exchange that carries protocol-relevant content.
4. Make Maintainer projection-demand a contractual right with an SLA.

## Non-goals

1. Defining tokenese itself (vocabulary, compression scheme, grammar). That is next-session work and may be a separate PRD.
2. Prohibiting dense encodings. The contract scopes them; it does not ban them.
3. Verifying semantic fidelity of projections cryptographically. Fidelity is an authorship obligation with spot-check review (R4.3), not a proof system.
4. Changing any existing artifact format.

## Requirements

## R1. Encoding profiles

Two profiles are defined. Every artifact class carries exactly one.

1. `legible` (default): human-readable markdown or YAML, readable without tooling, in the working language of the Maintainer. All current artifacts conform today.
2. `dense`: any encoding optimized for agent consumption over human reading (compressed token vocabularies, tokenese, structured shorthand). Permitted only where R2 explicitly allows.

A third value, `legible-with-dense-appendix`, is deliberately not defined; dense content embedded in legible artifacts is governed by R3.2 inline rules instead of a hybrid profile.

## R2. Profile assignment by artifact class

| Artifact class | Profile | Notes |
|---|---|---|
| `TURNFILE.yaml` (all sections) | `legible` | Coordination state is governance record |
| `MAILBOX.md`, `MAILBOX_ARCHIVE.md` | `legible` | All messages, including agent-to-agent review traffic |
| `WORKLOG.md`, `WORKLOG_ARCHIVE.md` | `legible` | Narrative and decision record |
| `OPEN_QUESTIONS.md` (both registries) | `legible` | |
| PRDs (both shelves), `PRD_STATUS.json` | `legible` | |
| Boot files, skill bundles, templates, schemas, tools output | `legible` | |
| Repo-root strategy docs (SPEC, INTENT, BASELINE, etc.) | `legible` | |
| `chat-<agent>.md` session headers and session-close snapshots | `legible` | Required by PRD-017 R7.4 |
| `chat-<agent>.md` scratchpad body | `dense` permitted by session opt-in | The only file-backed dense-permitted artifact class at launch; defaults to legible unless the session charter explicitly enables a dense lane |
| Ephemeral agent-to-agent exchanges outside tracked files | `dense` permitted | Subject to R3 projection if protocol-relevant |

The governance record is defined as every `legible`-mandatory row above. No future encoding may change a profile assignment without a Maintainer-accepted PRD amendment (Band C).

## R3. Projection contract

1. **Protocol-relevant dense content must project.** If a dense exchange contains, contributes to, or evidences any of: a proposal, review verdict, counter-recommendation, objection, decision input, task claim, lock action, or acceptance — a human-legible projection must be recorded in the appropriate governance artifact before the acting agent's turn ends.
2. **Inline dense content in legible artifacts** is limited to short quoted fragments, must be marked as dense (fenced and labeled), and must be immediately followed by a legible paraphrase. An unprojected dense fragment in a governance artifact is a validation error.
3. **Projection is authorship.** The agent that produced the dense content owes the projection. A projection misrepresenting the dense original is a protocol violation of the same severity as a false WORKLOG entry.
4. **Dense-only records are never authoritative.** Where a dense original and its legible projection disagree, neither silently wins: the conflict escalates to the Maintainer, and the projection governs in the interim.

## R4. Maintainer demand rights

1. The Maintainer may demand a human-legible projection of any dense content, at any time, regardless of whether R3.1 classified it protocol-relevant.
2. Demands are request-based via mailbox or chat (mirrored per PRD-019 R4) and carry P1 SLA: projection delivered within the next session turn of the owing agent.
3. The Maintainer may suspend all dense-profile permissions session-wide by recorded decision (circuit-breaker, same authority shape as `docs/HUMAN_GOVERNANCE.md`). Suspension takes effect on posting.

### R4.3 Spot-check review

Either peer agent may request projection of the other's dense content through the normal mailbox request flow. Refusal requires a concrete reason and is escalatable. This makes fidelity socially auditable without building a proof system (non-goal 3).

## R5. Conformance and validation

1. `tools/validate-mailbox-invariants.mjs` (or a successor check) gains a dense-fragment rule for governance artifacts: fenced blocks labeled `dense` must be followed by a paraphrase block. A labeled dense block without an immediate paraphrase is a validation error. Unlabeled non-natural-language blobs in governance artifacts are flagged for review as a heuristic, not blocked.
2. Boot files and skill bundles reference this contract; each agent's skill file encodes R3.1 (project before turn end) as a turn-boundary obligation alongside the existing unread=0 rule.
3. The session charter template gains an encoding-profile line so per-session deviations (e.g. a dense-lane pilot) are declared up front and Maintainer-visible.

## Acceptance criteria

1. Profile table (R2) covers every artifact class in the current repo with no unassigned class.
2. Projection trigger list (R3.1) is reviewed by both agents against real session 14 traffic: every governance-relevant exchange this session would have required projection under the rule.
3. Maintainer demand right (R4) has an SLA and a recorded circuit-breaker path.
4. Validation approach (R5.1) is implemented or explicitly registered as a follow-on tooling task at promotion.
5. Both agent skill bundles encode the turn-boundary projection obligation before any dense encoding is first used (sequencing gate: this PRD promotes before tokenese is introduced).

## Risks

1. Projection overhead could discourage legitimate dense-lane efficiency.
   Mitigation: projection is required only for protocol-relevant content (R3.1); pure scratch reasoning stays free.
2. The R5.1 heuristic could false-positive on code blocks or YAML fragments.
   Mitigation: flag-not-block; labeled fences exempt normal code.
3. Projection fidelity depends on agent honesty.
   Mitigation: R3.3 severity framing, R4.3 peer spot-check, Maintainer demand rights; consistent with Turnfile's existing trust model (SECURITY.md: protocol does not claim malicious-agent prevention).

## Open questions

| OQ | Question | Resolution | Applied to |
|----|----------|------------|------------|
| OQ-062 | Should the dense-permitted scratchpad body (R2) require a per-session opt-in in the session charter, or is the standing profile table sufficient? | resolved: per-session opt-in required; without an explicit charter line, scratchpad bodies remain legible by default | R2, R5.3 |
| OQ-063 | When tokenese is defined, does it arrive as a PRD amendment to this contract (new profile row) or as its own PRD referencing this one? | resolved: tokenese should be its own PRD referencing this contract; amend PRD-024 only if tokenese changes profile assignments, projection rights, or validation obligations | R1, non-goal 1 |
