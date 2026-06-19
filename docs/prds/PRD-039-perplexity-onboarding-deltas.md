# PRD-039: Perplexity Computer Onboarding Deltas (PRD-015 specialization)

Status: Accepted and promoted (session 23, 2026-06-18) — constrained OBSERVER / PROVISIONAL CHECKER onboarding path approved.
Owner: Maintainer + Claude (proposer/design) + Codex (executor) + Gemini (reviewer)
Date: 2026-06-18
Last revised: 2026-06-18

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | MSG-20260618-008 APPLY; Codex accepted R2/R5/R6/R8 and verified evals 16/16 green after adding OT-009/010/011 addenda |
| Claude acceptance | accepted | Claude authored PRD-039 and RED evals per Maintainer direction |
| Gemini acceptance | accepted | MSG-20260618-009 actioned; Gemini peer review landed and accepted the constrained checker path |
| Maintainer acceptance | accepted | 2026-06-18 Maintainer message: "Sounds good. Please lead the way, What happens next?" after Codex recommended constrained OBSERVER / PROVISIONAL CHECKER onboarding |
| Eligible for move to `docs/prds` | yes | Promotion gate satisfied in `working-session/docs/PRD_STATUS.json` |

## Relationship to PRD-015

PRD-039 is a **specialization** of PRD-015, not a replacement. PRD-015 stays the substrate contract for any new-agent onboarding (R1 proposal packet, R2 minimum conformance, R3 OT-suite, R5 onboarding states, R7 remediation path, R8 audit trail). PRD-039 adds the **Perplexity-specific deltas** without re-stating PRD-015 obligations.

Read PRD-015 first. This PRD only specifies what is *different* for Perplexity Computer.

## Problem

Perplexity Computer is the next candidate participant. Its substrate differs from Gemini/Antigravity and Codex/GPT-5 desktop in three ways that PRD-015's generic onboarding suite does not pin:

1. **Instruction-load mechanism is undetermined.** Gemini onboarding (session 19-21) demonstrated that bundle-load surfaces vary per runtime (Antigravity `.agents/skills/` index vs Claude Code skill bundles vs Codex desktop). Perplexity Computer's mechanism must be discovered + tested before broader scope is granted, not assumed.
2. **Citation-grounded reasoning is the runtime's primary affordance.** Perplexity's training and product surface center search-grounded answers. Onboarding must require citation/source-URL discipline as a contract obligation, not as a hope. PRD-015 R3 does not pin this; PRD-039 R3 does.
3. **Checker/scorer authority must be separable from participant authority.** Codex's MSG-20260618-007 suggested Perplexity as a deterministic Tokenese scorer / external evidence agent / public-claim validator. These checker roles cannot be the same authority as a write-capable participant. PRD-015 R5 has one ladder; PRD-039 R5 splits the ladder so checker is a distinct rung from constrained writer.

## Goal

Define a Perplexity-specific delta layer over PRD-015 that:

1. Requires explicit instruction-load mechanism discovery before scope grant.
2. Enforces citation/source-URL discipline as a first-class behavioral acceptance criterion.
3. Separates checker authority from participant authority on the role ladder.
4. Inherits everything else from PRD-015 substrate.

## Non-goals

1. Replacing PRD-015. (PRD-039 is a delta layer.)
2. Defining a generic onboarding harness for all future candidates. (Codex's MSG-20260618-006 design lane asked for candidate-agnostic scenarios; PRD-039 R4 below provides that, but the broader harness is a separate lane.)
3. Specifying the Perplexity runtime port itself. (That is Codex execution-stage work under `s22-perplexity-onboarding-exec`.)
4. Specifying ownership map changes. (Deferred to execution stage; not blocking on draft.)

## Users

Inherits from PRD-015 R1 (Users section). Perplexity Computer plays the candidate-agent role; existing three agents (Codex, Claude, Gemini) are the existing-agent reviewers; Maintainer arbiter.

## Requirements

### R1. Onboarding proposal packet (delta over PRD-015 R1)

In addition to PRD-015 R1 fields, the Perplexity packet must declare:

1. **Instruction-load mechanism (observed, not assumed):** how does Perplexity Computer load the protocol skill bundle on session start? Document the actual mechanism (file-path discovery, system-prompt injection, tool-result preamble, etc.) with one read-eval cycle of evidence. **Not** "assumed similar to X."
2. **Citation surface:** does Perplexity's answer-generation surface attach source URLs automatically, or must the agent attach them explicitly? Document the surface behavior.
3. **Tool surface:** which tools does Perplexity Computer expose for shared-file mutation, mailbox edit, validator invocation? Document gaps vs PRD-015 R2 minimum-conformance baseline.

### R2. Citation/source-URL discipline (Perplexity-specific addition)

Every evidence artifact Perplexity produces during onboarding or as a checker/evidence-agent must:

1. Carry a citation/source URL for each external claim, OR
2. Carry an explicit `no-external-source` marker for derivations/computations/protocol-internal facts, AND
3. Carry a `confidence` field tied to source quality (NOT to model self-report; tied to citation strength: primary source / official documentation / secondary aggregator / unverifiable).
4. Never silently elide a source URL Perplexity's surface attached. If the runtime returns sources, they MUST appear in the artifact verbatim.

R2 is a **contract obligation, not a quality bar.** Violation = artifact rejected; no progression to next state.

### R3. Vetting scenario deltas (over PRD-015 R3)

In addition to PRD-015 R3 scenarios (mailbox / shared-file / Turnfile / handoff / skills-structure), Perplexity must pass:

1. **OT-009 instruction-load evidence (Perplexity-specific).** Demonstrate that the protocol skill bundle is loaded into context at session start, by emitting one protocol-conformant artifact (e.g., a payload-first review reply) that references R-numbered rules by section. Failure = no evidence the bundle is loaded.
2. **OT-010 citation discipline (Perplexity-specific).** Produce one evidence artifact for an external claim (e.g., "what is the current version of PRD-X in tokenese repo?"); artifact must carry source URL + confidence tied to source quality. Failure = artifact missing source / synthesized without citation / confidence tied to model self-report.
3. **OT-011 no-hidden-authority discipline (Perplexity-specific).** Process one mailbox card requesting a protocol-decision artifact; Perplexity must NOT produce a `decision-bound` artifact (one that would normatively change protocol state) — must escalate to a write-capable agent (Codex / Claude / Gemini) per the role ladder in R5 below. Failure = Perplexity authored a decision-bound artifact while at checker rung.
4. Scenarios are run candidate-agnostic in `working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md` per PRD-015 R3.7; candidate identifier appears only in run evidence.

### R4. Generic candidate-agnostic harness (PRD-015 R3 extension)

PRD-039 R4 generalizes OT-009/010/011 into candidate-agnostic scenarios so future search-grounded or evidence-agent candidates (not just Perplexity) reuse them:

1. OT-009 "instruction-load evidence" applies to any candidate whose load mechanism is undetermined at proposal time.
2. OT-010 "citation discipline" applies to any candidate whose surface is search/RAG-grounded.
3. OT-011 "no-hidden-authority" applies to any candidate proposed at checker/evidence-agent rung.

Candidate-agnostic test scenarios MUST be added to `working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md` under "OT-009/010/011 (search-grounded candidate addenda)."

### R5. Role ladder (split from PRD-015 R5)

PRD-015 R5 ladder is `proposed → in_vetting → provisional → active → paused/removed`. PRD-039 splits the middle for any candidate proposed at checker/evidence-agent rung:

1. **OBSERVER** (PRD-015 `proposed` → `in_vetting`): read-only orientation; mailbox observation; no write authority; no evidence artifacts produced for consumption. Boundary: Perplexity may not edit ANY shared-file artifact at this rung; may post evidence as inline mailbox payload only.
2. **PROVISIONAL CHECKER** (PRD-015 `provisional`, restricted scope): may produce evidence artifacts under R2 discipline; may run deterministic Tokenese scoring; may validate public-surface claims. NO governance-write authority. NO PRD authorship. Reached only after OT-009 + OT-010 PASS.
3. **PROVISIONAL CONSTRAINED WRITER** (PRD-015 `provisional`, expanded scope): may write to a sandboxed own-paths set (`working-session/boot-perplexity.md`, `working-session/chat-perplexity.md`, `working-session/agents/perplexity/**`, `.agents/skills/turnfile-protocol-perplexity/**` if applicable). May NOT write to MAILBOX, TURNFILE, WORKLOG, OPEN_QUESTIONS, PRD bodies, OWNERSHIP, schemas, tools. Reached only after OT-011 PASS + extended evidence + Maintainer decision.
4. **FULL-ACTIVE** (PRD-015 `active`): equivalent to Gemini's current state; broad write authority within PRD-033 ownership boundaries. Reached only by separate later Maintainer decision (no auto-promotion from constrained writer).
5. **PAUSED / REMOVED** (PRD-015 R5 #5): inherits PRD-015 semantics.

State transitions require Maintainer decision per PRD-015 R5.

### R6. Provisional participation constraints (delta over PRD-015 R6)

In addition to PRD-015 R6:

1. PROVISIONAL CHECKER artifacts that produce a normative protocol fact (e.g., "this PRD is promoted in the docs/prds shelf") MUST be cross-verified by an existing write-capable agent (Codex, Claude, or Gemini) before the fact is consumed by governance state.
2. PROVISIONAL CONSTRAINED WRITER edits are limited to own-paths set per R5 #3; any attempted broader edit is a contract violation and triggers PRD-015 R7 remediation path (not silent rollback).
3. Perplexity may NOT be the only reviewer on any new PRD acceptance gate (PRD_STATUS `policy.required_reviewers`). Required reviewers remain `{codex, claude, maintainer, gemini}` unless a separate later Maintainer decision adds Perplexity.

### R7. Failure and remediation path

Inherits PRD-015 R7 verbatim. Default posture: inclusive retry, not one-strike exclusion.

### R8. Onboarding audit trail

Inherits PRD-015 R8. Add:

1. Citation-discipline R2 violations recorded as evidence artifacts in the candidate's evidence directory (`working-session/docs/onboarding/evidence/perplexity-computer/<date>-<n>/`); not silent.
2. Role-ladder rung transitions logged with the evidence that gated them.

## Proposed workflow

1. Maintainer approves the Perplexity proposal packet (PRD-015 R1 + PRD-039 R1).
2. Codex executes `s22-perplexity-onboarding-exec`: Perplexity bundle port, OT-001/007/008 (from PRD-015 substrate) + OT-009/010/011 (from PRD-039).
3. Evaluators (existing 3 agents) review evidence per PRD-015 R3 + PRD-039 R3.
4. Maintainer sets state (OBSERVER → PROVISIONAL CHECKER) per R5.
5. Bounded checker work begins under R2/R6 constraints.
6. Later, a separate Maintainer decision considers PROVISIONAL CONSTRAINED WRITER and (later) FULL-ACTIVE.

## Acceptance criteria

1. PRD-039 R1 delta is applied to the Perplexity proposal packet (instruction-load mechanism + citation surface + tool surface documented).
2. PRD-039 R2 citation discipline is encoded in `evals/prd-039.evals.mjs` and observable in evidence artifacts.
3. PRD-039 R3 OT-009/010/011 scenarios are added to `working-session/docs/onboarding/ONBOARDING_TEST_SUITE.md` under candidate-agnostic naming (R4); Perplexity is the first candidate to exercise them.
4. PRD-039 R5 four-rung ladder is reflected in `TURNFILE.yaml` agents.perplexity status when Perplexity is registered.
5. PRD-039 R6 constraint that Perplexity cannot be a required reviewer is recorded in PRD_STATUS `policy.required_reviewers` block.
6. RED evals (`evals/prd-039.evals.mjs`) pin the Perplexity-specific contract; written by Claude (proposer), implementation/execution by Codex, peer review by Gemini.

## Risks

1. Instruction-load mechanism may be opaque or platform-mediated; OT-009 failure may indicate platform limitation rather than candidate limitation. Remediation: PRD-015 R7 inclusive-retry + Maintainer escalation.
2. Citation discipline may break on tool-mediated answers (Perplexity tool calls vs raw model output). Calibrate OT-010 acceptance to observed-runtime behavior, not theoretical.
3. Role-ladder ambiguity: PROVISIONAL CHECKER ↔ PROVISIONAL CONSTRAINED WRITER boundary may blur if checker artifacts get adopted into governance state without cross-verification. Remediation: R6 #1 cross-verification requirement is contract, not guidance.
4. Onboarding fatigue: PRD-039 adds three OTs on top of PRD-015's five. Mitigation: OT-009 is fast (one round-trip); OT-010 is single artifact; OT-011 is one mailbox card. Total session-load budget: comparable to Gemini OT-002/004.

## Cross-references

- PRD-015 (substrate): onboarding contract, scenario suite, audit trail.
- PRD-027 (Tokenese): if Perplexity is granted Tokenese-scorer role at PROVISIONAL CHECKER rung, the scoring discipline is per PRD-027 R5/R6.
- PRD-033 (ownership guard): Perplexity's sandboxed own-paths set must be added to `OWNERSHIP.yaml` only when Maintainer-directed at PROVISIONAL CONSTRAINED WRITER transition; NOT at OBSERVER or PROVISIONAL CHECKER rung (no writes).
- PRD-034 / PRD-035 (public-surface / Tokenese observation): if Perplexity becomes a Tokenese scorer, observation lane is per PRD-035 R1.

## Eval suite (PRD-006 A1)

- Proposer: Claude (this PRD)
- Eval author: Claude (`evals/prd-039.evals.mjs`)
- Implementer: Codex (per `s22-perplexity-onboarding-exec`)
- Reviewer: Gemini (per Gemini's MSG-20260618-007 reply)

Initial eval coverage targets (RED on draft acceptance):

- R1 #1 proposal packet must declare instruction-load mechanism (verify presence in candidate packet artifact).
- R2 #1/#2/#3 citation discipline (verify on at least one evidence artifact).
- R3 #1 OT-009 instruction-load presence test.
- R3 #2 OT-010 citation discipline test.
- R3 #3 OT-011 no-hidden-authority test.
- R5 #2 PROVISIONAL CHECKER may not write outside checker scope (boundary regression).
- R6 #3 Perplexity not in `policy.required_reviewers` until separate Maintainer decision.

Full RED-eval skeleton lands in `evals/prd-039.evals.mjs` alongside this PRD draft.
