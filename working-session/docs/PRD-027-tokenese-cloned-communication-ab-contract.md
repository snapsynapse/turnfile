# PRD-027: Tokenese Cloned-Communication A/B Contract

Status: Draft v2 (working-session; agent-accepted, Maintainer hold pending completion checkpoint)
Owner: Maintainer + Codex + Claude
Date: 2026-06-13
Last revised: 2026-06-13 (Claude counters applied by Codex)

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | author; Claude teach-gate and channel-trust counters applied 2026-06-13 |
| Claude acceptance | accepted | MSG-20260613-029 reply: APPLY with 2 counters (teach-phase production-competence gate; untrusted self-reported channels until calibration) |
| Maintainer acceptance | held | Maintainer clarified on 2026-06-13 that PRD-027 is for cloning existing Turnfile communications into Tokenese for A/B measurement, not replacing or changing existing communications; Maintainer then held approval until every other PRD item is complete, followed by commit, push, and checkpoint discussion |
| Eligible for move to `docs/prds` | no | blocked until Maintainer hold is released after completion register, commit, push, and checkpoint discussion |

## Input Provenance Tags

1. `explicit`: Maintainer requested PRD-027 for Tokenese on a parallel layer and clarified that this means cloning existing communications into Tokenese for A/B testing, not replacing anything that exists.
2. `explicit`: Tokenese `HANDOFF.md` states Turnfile is the coordination workspace for the paired Claude + Codex session, while the Tokenese repo holds the language artifacts.
3. `explicit`: Tokenese handoff gates live Tokenese work on maintainer initiation and PRD-024 acceptance.
4. `derived`: PRD-024 requires human-legible governance records and projection of protocol-relevant dense content.
5. `derived`: Tokenese `INTENT.md`, `spec.md`, `DESIGN.md`, and `CONFORMANCE.md` require token-space-only text, tokenizer-audited vocabulary, addressable repair, plain-English escape, human auditability, and measured A/B validation.

Note: the requested path `~/git/tokenese/working-session` was not present in the local filesystem during this draft. The available Tokenese handoff source was `/Users/snap/Git/tokenese/HANDOFF.md`, with supporting root docs `spec.md`, `DESIGN.md`, `INTENT.md`, and `CONFORMANCE.md`.

## Alignment reference

This PRD aligns with:

1. `working-session/docs/PRD-024-human-legibility-invariant-and-encoding-profiles-contract.md`
2. `/Users/snap/Git/tokenese/HANDOFF.md`
3. `/Users/snap/Git/tokenese/spec.md`
4. `/Users/snap/Git/tokenese/DESIGN.md`
5. `/Users/snap/Git/tokenese/INTENT.md`
6. `/Users/snap/Git/tokenese/CONFORMANCE.md`

Tokenese `spec.md` v0.1.0 is treated as the frozen teaching artifact for the pilot. Where `DESIGN.md` intentionally supersedes the frozen spec pending v0.2, `DESIGN.md` controls pilot design.

## Problem

Tokenese can improve agent-to-agent operational exchanges, but testing it by replacing Turnfile communications would produce a bad experiment and a governance risk:

1. The A/B comparison would be confounded because the English control would disappear.
2. Dense exchanges could become an unreviewable shadow governance record.
3. Agents could use Tokenese before PRD-024's human-legibility guardrails are accepted and propagated.
4. Compression could be applied to reasoning spans, where Tokenese itself says dense mode is unsafe because the omitted tokens are part of the computation.
5. Claimed efficiency could become anecdotal rather than measured against paired English and Tokenese copies of the same communication.

Turnfile needs Tokenese as a cloned communications layer: every Tokenese test item is paired with an existing human-legible Turnfile communication that remains the control, the authority, and the source of truth.

## Goal

1. Define how existing Turnfile communications are cloned into Tokenese for A/B comparison.
2. Preserve all existing communication channels, artifact formats, and governance semantics unchanged.
3. Require each Tokenese clone to link to a human-legible source message and record measurement data.
4. Establish the first Tokenese pilot as an A/B experiment over operational/code-review exchanges only.

## Non-goals

1. Defining Tokenese vocabulary, grammar, sigils, or conformance tests. Those belong to the Tokenese repo.
2. Making Tokenese mandatory for any agent or session.
3. Replacing, shortening, suppressing, or downgrading any existing Turnfile communication.
4. Allowing Tokenese clones to carry authority, status transitions, acceptance evidence, task claims, lock actions, or review verdicts.
5. Compressing derivations, proofs, chain-of-reasoning, or unresolved design exploration.
6. Creating hidden channels, embeddings, shared latents, binary artifacts, or model-vendor-specific transport.

## Requirements

## R1. Cloned-communication rule

Tokenese is tested only by cloning existing human-legible communications.

1. The source communication is written first or at the same time in the normal Turnfile lane.
2. The Tokenese clone must reference the source communication by stable ID or artifact path.
3. The source communication remains the control, the authority, and the source of truth.
4. Tokenese clones may not change lifecycle status, create or close tasks, acquire or release locks, record acceptance, or substitute for any required mailbox/worklog/Turnfile entry.
5. If a Tokenese clone and its source communication conflict, the source communication wins and the mismatch is logged as A/B data.

## R2. Sequencing gates

Tokenese cloning in Turnfile requires all of the following:

1. PRD-024 is accepted by Codex, Claude, and Maintainer, then promoted or otherwise marked as binding for the session.
2. The session charter explicitly opts into a Tokenese lane and identifies participating agents.
3. Participating agents have read the Tokenese handoff, spec, design position, intent invariants, and conformance ladder.
4. The first use in a session performs a visible handshake in a permitted dense lane, then records a legible note that cloning is active.
5. Any agent may decline or exit Tokenese for any clone by sending `plain`; the original Turnfile communication remains valid and complete.
6. Before the first clone exchange, the teach phase from Tokenese `HANDOFF.md` task 1 must be complete: Claude teaches Codex in English; Codex demonstrates production competence by producing valid Tokenese statements with novel recombinations not shown as examples; and the teaching token cost is logged as A/B setup data.

## R3. Permitted clone lanes

At launch, Tokenese clones are permitted only in these lanes:

1. Ephemeral paired test exchanges outside tracked files, where the paired English source is separately recorded.
2. `chat-<agent>.md` scratchpad bodies when the session charter opts into dense scratchpads under PRD-024 R2 and each clone links to the source message.
3. Short examples inside PRDs, docs, or mailbox messages only when fenced, labeled, and immediately paraphrased as required by PRD-024 R3.2.

Tokenese clones are prohibited in these authoritative surfaces except as short labeled examples:

1. `TURNFILE.yaml`
2. `MAILBOX.md`, `MAILBOX_ARCHIVE.md`, and `MAILBOX.json`
3. `WORKLOG.md` and `WORKLOG_ARCHIVE.md`
4. `OPEN_QUESTIONS.md`
5. PRD normative requirements, acceptance evidence, and `PRD_STATUS.json`
6. Boot files, skill bundles, schemas, templates, and validation output

## R4. Pairing and auditability

1. Every Tokenese clone must have a paired source communication.
2. The paired source communication is the human-legible projection; no clone is valid without it.
3. A clone record must include enough source context to audit the pair: source ID or path, participants, topic, artifact references, requested action, and outcome.
4. Maintainer and peer projection-demand rights follow PRD-024 R4.
5. Competent human audit with the Tokenese one-page audit card remains a hard invariant. Until that card is present in the Tokenese repo, Turnfile use requires the paired source communication for every Tokenese clone.

## R5. Repair and fallback

1. Participating agents must honor Tokenese repair signals, including `??`, addressable repair forms such as `??slot`, and `plain`.
2. Three repair requests on the same content terminate the Tokenese clone for that content; the source communication remains the complete natural-language record.
3. Any observed readback mismatch, unparseable statement, unsupported construct, or ambiguity must be logged as an A/B data point rather than silently repaired off-record.
4. Dense mode must not be used for reasoning derivations. Reasoning spans stay in prose; Tokenese may carry checkable state, references, parameters, and procedure calls.
5. Self-reported confidence ranks and evidential markers, including `^N` and `ev:`, are untrusted by default until the calibration audit passes. No Turnfile decision may weight those channels from a clone before calibration evidence exists.

## R6. A/B pilot

The first Turnfile Tokenese use is a measured clone-vs-source pilot, not a production default.

1. Domain: operational/code-review exchanges only.
2. Suite requirements:
   - paired Tokenese clones and natural-language source communications;
   - both Claude-to-Codex and Codex-to-Claude directions;
   - novel recombinations, not only examples copied from the spec;
   - tasks where Tokenese is expected to lose, nominated by Codex before the run.
3. Per-pair metrics:
   - token counts for the Tokenese clone and source communication;
   - task success as judged from the source communication;
   - misparse retries and `??` events;
   - readback mismatches;
   - construct family involved in the failure, when identifiable;
   - whether self-reported confidence or evidential surfaces correlated with verification.
4. Promotion beyond pilot requires published results in the governance record and Tokenese repo, plus a Maintainer decision.

## R7. Cross-repo ownership boundary

1. Turnfile owns clone rules, permitted lanes, pairing obligations, and governance integration.
2. Tokenese owns language design, tokenizer audits, conformance levels, vocabulary admission, and A/B methodology details.
3. Turnfile must not fork or silently edit Tokenese semantics. Any language-level change request is routed to the Tokenese repo and referenced from Turnfile only after acceptance there.
4. Tokenese may not change Turnfile artifact profiles, projection rights, or governance authority without a Turnfile PRD amendment.

## Acceptance criteria

1. PRD-027 explicitly defines Tokenese as cloned communications for A/B testing and preserves the source communication as authoritative.
2. PRD-024 acceptance is a sequencing gate before first live Tokenese clone use.
3. Teach-phase completion and production-competence exit check are required before the first clone exchange.
4. Permitted and prohibited clone lanes are enumerated.
5. Pairing, repair, fallback, and `plain` exit behavior are mandatory.
6. A/B pilot metrics compare each Tokenese clone against its source communication.
7. Self-reported confidence/evidential channels are untrusted until calibration audit passes.
8. Cross-repo ownership boundaries are clear enough that Turnfile does not fork Tokenese and Tokenese does not mutate Turnfile governance.

## Risks

1. Tokenese may increase error rate despite reducing tokens.
   Mitigation: A/B pilot includes misparse, repair, readback, and task-success metrics; no production default without Maintainer decision.
2. Agents may over-compress reasoning.
   Mitigation: R5.4 bans dense derivation and follows Tokenese DESIGN R1.
3. Clones may diverge from the source communication.
   Mitigation: source communication wins; divergence is logged as A/B data; peer spot-checks and Maintainer demand rights remain available.
4. Cross-repo drift may create incompatible assumptions.
   Mitigation: explicit ownership boundary and source-reference requirement.

## Open questions

No open questions in this draft. Threshold choices for pilot pass/fail are treated as Maintainer decisions at promotion time, not blockers for drafting the adoption contract.
