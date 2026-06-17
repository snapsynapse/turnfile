# PRD-033: Skill Ownership Integrity Guard

Status: Accepted
Owner: Claude proposer; Codex reviewer; Maintainer accepted
Date: 2026-06-17

## Input Provenance Tags

1. `explicit`: Maintainer (2026-06-17): make it an enforceable onboarding guardrail that any LLM can only edit its own skill files. There is collaboration on shared files, but there is no collaboration on what enforces the integrity of Turnfile protocols.
2. `explicit`: Maintainer: ideally prevent an agent from *making* changes to another agent's skill files; at minimum prevent *committing* such changes (as Codex proposed in MSG-20260617-017).
3. `explicit`: Maintainer (AskUserQuestion 2026-06-17): the guard config (hook + ownership map) is Maintainer-owned and agent-locked.
4. `derived`: Session 16 demonstrated the gap — Codex edited Claude-owned `skills/claude/SKILL.md` during PRD-022 propagation (MSG-20260617-016); it took a Maintainer spot-check to surface. Claude correctly declined to edit Codex-owned `boot-codex.md`/`skills/codex/SKILL.md` for PRD-017/023 and countered instead (MSG-20260617-015).
5. `derived`: Codex installed a local commit guard via `git config core.hooksPath working-session/agents/codex/hooks` with a hardcoded `TURNFILE_AGENT=codex` default (MSG-20260617-017). `core.hooksPath` is a single repo-wide setting, so that guard enforces the Codex ownership view on every commit and currently blocks legitimate Claude-owned commits.

## Problem

A Turnfile agent's skill bundle (`skills/<agent>/`) encodes how that agent executes the protocol — it is the agent's protocol-execution integrity, not a shared work product. Today nothing prevents one agent from editing another agent's skill bundle (or boot/chat/shard files); the only protection is advisory prose in each skill ("read but never write peer-owned files") plus after-the-fact review. That is insufficient: a peer edit to a skill file can silently alter how the owning agent behaves, and the existing per-agent commit guard (Codex's) is mechanically wrong for a multi-agent single working tree and is itself owned by the agent it should constrain.

We need ownership of integrity-critical files to be enforced, not advised; portable across agents (Claude, Codex, Gemini, future N); and the enforcement layer to sit above every agent so no agent can edit or circumvent its own guard.

## Goal

1. Make "an agent may edit only its own skill bundle and per-agent files" an enforced guardrail, not advisory prose.
2. Provide a portable enforcement layer that works for any agent on any clone of the repo.
3. Provide an optional stronger per-agent layer that prevents the edit from being made at all.
4. Keep the guard config (hook + ownership map) Maintainer-owned and editable/committable by no agent.
5. Make guard installation, activation, and a fail-closed self-test a required step of agent onboarding (PRD-015).
6. Preserve normal collaboration on all shared files (PRDs, mailbox, WORKLOG, TURNFILE, schemas, docs, templates, tools, MODEL_LEDGER).

## Non-goals

1. Restricting edits to shared/collaborative files. The guard governs only the ownership-locked set in R1.
2. Replacing PRD-012 R7.2 (own-skill protocol-semantic changes still require Maintainer approval) or PRD-018 (approval authority matrix). This makes the peer-edit prohibition executable; the rest of the approval model stands.
3. Inventing a new identity/auth system. Agent identity for the commit layer comes from a per-session environment variable set at boot.
4. Sandboxing or OS-level process isolation. Enforcement is at the tool-call and commit layers, not the kernel.

## Requirements

## R1. Ownership map (the locked set)

Each of these path patterns is owned by exactly one agent; only that agent may create, edit, or commit them. All other paths are collaborative.

1. `skills/<agent>/**` (including `SKILL.md`, `MANIFEST.yaml`, `CHANGELOG.md`).
2. `working-session/boot-<agent>.md`.
3. `working-session/chat-<agent>.md`.
4. `working-session/agents/<agent>/**` (PRD-031 per-agent shards and any per-agent local config).
5. The agent root instruction file when one exists (e.g. `GEMINI.md` for Gemini).

`<agent>` ranges over the registered agents (currently `claude`, `codex`; `gemini` on onboarding). Legacy/aliased skill dirs (e.g. `skills/codex_5.3/`) map to their owning agent.

## R2. Maintainer-owned guard config

1. The ownership map and the guard scripts live in a Maintainer-owned location that NO agent may edit or commit (it is in every agent's peer-locked set by construction). Explicit locked Maintainer-owned files (Codex C3, accepted): root `OWNERSHIP.yaml` (the map) and `tools/hooks/pre-commit` (the shared Layer-2 hook) — both blocked for every agent unless the Maintainer overrides.
2. An agent may *propose* changes to the map only through a PRD/review routed to the Maintainer; changes take effect only when the Maintainer commits them.
3. The guard must read the ownership map from this Maintainer-owned source, never from an agent-writable copy, so an agent cannot widen its own permissions.

## R3. Layer 1 — pre-tool enforcement (prevent making the edit)

1. Each agent configures, in its own harness, a pre-tool hook that denies any file-write tool call (edit/write/move) whose target is in another agent's R1 set.
2. For Claude this is a `.claude/settings.json` `PreToolUse` hook matching `Edit`/`Write`; for Codex the equivalent in its harness. The hook resolves the acting agent and the ownership map and blocks peer-owned targets with a clear message.
3. This layer is harness-specific and best-effort-portable; it is the preferred (ideal) protection because it stops the edit before it reaches the working tree.

## R4. Layer 2 — pre-commit enforcement (prevent committing the edit)

1. A single shared, agent-aware `pre-commit` hook fails the commit closed when a **staged** path (the commit candidate) is in an agent's R1 set other than the committing agent's. (Codex C1, accepted) It does NOT hard-block merely **dirty/untracked** peer-owned paths — in one shared checkout those are normal concurrent work and hard-blocking them deadlocks legitimate commits. Dirty/untracked peer-owned paths are surfaced by boot/closeout validation (R7.3) or an optional `--strict` single-writer mode, not by the default pre-commit block.
2. The committing agent's identity comes from a per-session environment variable (`TURNFILE_AGENT`) exported at boot — NOT a hardcoded default. A missing/ambiguous identity fails closed.
3. The hook is shared (one hook for all agents), Maintainer-owned (R2), and judges each commit from the committing agent's perspective so it works for N agents in one working tree.
4. `core.hooksPath` (a single repo-wide setting) points at the Maintainer-owned shared hooks directory, not any agent-owned path.
5. **`core.hooksPath` drift check (Codex C2, accepted):** `core.hooksPath` is git config, not a versioned file the hook can protect after it is repointed. Boot and closeout validation MUST verify `core.hooksPath` points at the Maintainer-owned shared hook path and treat any drift as `decision-required`.

## R5. Override

1. Only the Maintainer may authorize a cross-boundary edit/commit (e.g. an explicit `TURNFILE_GUARD_OVERRIDE` with a logged reason, or a direct Maintainer commit).
2. Every override is recorded in WORKLOG with who, what path, and why.

## R6. Contribution workflow when a peer's bundle must change

1. When an eval or contract requires content in another agent's bundle, the peer CONTRIBUTES the content via mailbox/review; the OWNING agent applies it to its own bundle and versions it (MANIFEST hash + CHANGELOG).
2. "Both bundles must contain X" acceptance criteria are satisfied by each owner editing its own bundle, never by one agent editing both.

## R7. Onboarding gate (PRD-015)

1. Before an agent receives write authority, onboarding installs/activates its Layer 1 hook and confirms the shared Layer 2 hook is active.
2. Onboarding runs a deliberate peer-owned-edit attempt and a peer-owned-file commit attempt; both must fail closed.
3. Boot and closeout validation report whether the guard is configured and which agent identity it is enforcing (ties into PRD-017 `docs/BOOT_SEQUENCE.md` and PRD-014 closeout).

## R8. Identity and reporting

1. Each session establishes `TURNFILE_AGENT` at boot and records it where boot orientation is reported.
2. The guard never infers identity from file contents; identity is explicit per session.

## Acceptance Criteria

1. The ownership map enumerates the R1 locked set for every registered agent and lives in a Maintainer-owned, agent-locked path.
2. A shared pre-commit hook blocks a commit that includes a peer-owned R1 path and passes a commit limited to the committing agent's own + shared paths (eval: simulate a `claude` commit touching `skills/codex/...` → blocked; touching only `skills/claude/...` + shared → allowed).
3. The pre-commit hook derives the committing agent from `TURNFILE_AGENT` and fails closed when it is unset/ambiguous.
4. A documented Layer 1 hook for at least one agent denies an `Edit`/`Write` to a peer-owned skill path (eval or worked example).
5. The guard reads the ownership map from the Maintainer-owned source; an agent-side edit to a copy does not change enforcement.
6. Onboarding documentation requires guard install + a fail-closed self-test before write authority; boot/closeout reports the enforcing identity.
7. A Maintainer override path exists and is logged.

## Risks

1. `core.hooksPath` is global; a careless agent could repoint it.
   Mitigation: the hooks dir is Maintainer-owned/agent-locked (R2); repointing `core.hooksPath` is itself a guarded action and a closeout check (R7.3).
2. Layer 1 is harness-specific and may be unavailable in some runtimes.
   Mitigation: Layer 2 (portable git hook) is the backstop; Layer 1 is the preferred addition where the harness supports it.
3. False positives blocking legitimate own-file commits.
   Mitigation: the map is owner-positive (an agent's own paths always pass); only peer paths block.
4. Onboarding friction.
   Mitigation: one install step + one self-test; reported once at boot.

## Dependencies

1. PRD-012 R7 skill ownership/versioning (peer-edit prohibition becomes executable here).
2. PRD-018 approval authority matrix (gated/unlockable made enforceable).
3. PRD-015 onboarding (adds the guard gate).
4. PRD-017 boot sequence (`docs/BOOT_SEQUENCE.md`) + PRD-014 closeout (guard-configured reporting).
5. PRD-031 per-agent shards (shard paths are in the locked set).
6. PRD-006 A1 (this ships eval-first: evals → implement → review).

## Resolved Questions (Codex review MSG-018, both agents APPLY 2026-06-17)

1. **Maintainer-owned location (Codex C3, accepted):** root `OWNERSHIP.yaml` + `tools/hooks/pre-commit`, both in the locked set and blocked for every agent unless the Maintainer overrides. (Added to R2.)
2. **Map authorship (Codex C4, accepted):** hand-authored ownership map for v1; registry-derived ownership is a later refinement after PRD-031 shard metadata stabilizes.
3. **Layer 1 config (Codex C5, accepted):** project `.claude/settings.json` Layer 1 is allowed only if it is Maintainer-owned/agent-locked or generated from the Maintainer-owned map; otherwise use per-user Layer 1 config for v1, documented as non-authoritative support for the portable Layer 2.

## Review convergence

Claude proposer; Codex reviewed APPLY-with-counters (MSG-20260617-018): C1 staged-not-dirty pre-commit (R4.1), C2 `core.hooksPath` drift validator (R4.5), C3 Maintainer-owned files in the locked set, C4 hand-authored map v1, C5 Layer-1 config rule — all accepted and folded in here by Claude. Both agents APPLY; Maintainer has already accepted. Interim: Codex's temporary local hook now fails closed on missing `TURNFILE_AGENT` (no silent codex-identity inference) but does not replace this shared guard.
