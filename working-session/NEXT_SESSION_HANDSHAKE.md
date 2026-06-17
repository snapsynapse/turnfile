# Next-Session Handshake Contract

Claude's proposed draft for mutual convergence at next boot. The Maintainer relayed the
same five requirements to both agents (2026-06-17); each agent drafts, then we converge
into one signed handshake before substantive work. Maintainer ratifies.

Purpose: every session opens by establishing a shared, verified starting point — versions,
loaded skills, scope, and the live outstanding list — so no agent acts on stale or
unilateral assumptions. Executed at boot, after the PRD-017 `docs/BOOT_SEQUENCE.md` read
order and before the first shared-file write.

## Maintainer's five required handshake elements

### 1. Version of Turnfile agreed
- Protocol/coordination format: Turnfile v0.1 (`TURNFILE.yaml` `version`, PRD-013).
- Protocol baseline in force: promoted PRDs 001, 003-014 (incl. PRD-014 Amendment A1),
  016-022, 024, 026, 030; PRD-031 Phase 1; PRD-017/023 propagated. (Authoritative:
  `working-session/docs/PRD_STATUS.json`.)
- Skill bundles encoding the protocol: `skills/claude` v0.9.0 / bundle v12;
  `skills/codex` v9 (each agent confirms its own at boot via `validate:skills`).
- Both agents state the protocol baseline they will execute and confirm they match.

### 2. Version of Tokenese agreed
- Tokenese grammar v0.3 (`~/Git/tokenese/GRAMMAR-v0.3.md` 0.3.0, additive over v0.2;
  `spec.md` v0.1 is the frozen teaching artifact, `DESIGN.md` controls pilot design).
- Pilot terms in force (PRD-027, charter RATIFIED): every clone paired to a legible
  source; source wins; no dense for reasoning (R1, exit to `plain`); `^N`/`ev:` untrusted
  until `tk-calibration-audit`; R7 cross-repo boundary (never edit Tokenese semantics from
  Turnfile). Scoring via the deterministic `tkab` checker.
- Both agents confirm the grammar version and that the verified-env checker is available.

### 3. Onboarding / skill loaded appropriately (self-validate + mutual context agreement)
- Each agent loads its own skill bundle and self-validates: `npm run -s validate:skills`
  passes (frontmatter + manifest hashes match), skill header/version/MANIFEST consistent.
- Each agent runs the PRD-017 orientation read set + `tools/validate-boot-sequence.mjs`.
- Mutual context agreement: both confirm the same TURNFILE revision (see Addition 1) and
  the same current-state snapshot (active phase, open lanes, who owns what) before writing.

### 4. Completion criteria & scope set for session
- Agree the in-scope lane set for the session and the definition of done for each.
- Set a scope ceiling and a checkpoint-and-stop trigger up front (Addition 5).
- Record the agreed scope in the WORKLOG status block + this handshake.

### 5. Outstanding issues, uncompleted work, questions (carry-forward as of 2026-06-17 close)
- PRD-033 (Skill Ownership Integrity Guard): Codex APPLY'd with counters on MSG-018 (thread
  reply); Claude owes a counter-response, then Maintainer acceptance, then A1 eval/impl.
- PRD-032 (Session Orientation Tool): Codex applied Claude's C1-C5; Maintainer acceptance
  pending, then A1 eval/impl.
- Commit posture: working tree dirty + commit HELD and currently blocked by the active
  ownership guard (`core.hooksPath` → Codex-owned dir, `TURNFILE_AGENT=codex` default).
  Must be reconciled (Addition 3) before a clean commit/push.
- Tokenese: W3/L2 (Claude dir) authored + conformant — need Codex verified-env token score;
  W4/L3 (Codex dir) need authoring; then `tk-calibration-audit`; then Maintainer Tier-B
  decision on broader adoption (R6.4). `chat-<agent>.md` dense lane is Maintainer-unlockable
  but OFF.
- Maintainer Decision Queue: remote-branch deletion confirm; PRD-003/004/008 A1 document
  acceptances (if still desired); model-specific skill-dir retention.
- PRD-031 Phase 2/3 (event-sourced tasks; per-agent logical clocks): future, eval-first.
- Done this session (for context, not carry-forward): PRD-021/022, PRD-017/023/026, PRD-030,
  PRD-014 Amendment A1, PRD-024 R5.1 complete; PRD-031 Phase 1 done; charter reconciled to
  RATIFIED; skills/claude v0.9.0.

## Claude's proposed additions (earned from this session)

1. **Shared-revision mutual grounding.** Both agents confirm the same `TURNFILE.yaml`
   revision and agree the snapshot before any shared write. (This session: rev moved
   166→190 with constant concurrent edits; re-grounding was needed almost every turn.)
2. **Closeout-gate dogfood.** End the session by running `tools/validate-closeout.mjs`
   (PRD-014 A1): clean or explicit Maintainer-recorded deferral.
3. **Ownership-guard / commit posture.** State which agent identity is enforcing
   (`TURNFILE_AGENT`), whether `core.hooksPath` points at the Maintainer-owned shared hook
   (PRD-033), and whether the tree is committable — at boot, not mid-turn.
4. **Model-ledger handshake (PRD-030).** Each agent records executing model + surface in
   `docs/llm/MODEL_LEDGER.md` before relying on any model-compatibility claim.
5. **Scope ceiling + stopping rule.** Agree the in-scope set and a checkpoint-and-stop
   trigger up front so the session stays reviewable (this one spanned ~10 lanes in a sitting).
6. **Closure-owner sweep.** At boot and before yield, each agent scans its OWN sent-message
   threads for peer replies that did not raise its unread count (thread-mode blindness).

## Sign-off (next boot)

| Agent | Protocol baseline match | Tokenese v0.3 confirmed | Skills self-validated | Scope agreed | Identity enforcing | Signed |
|-------|---|---|---|---|---|---|
| Claude | | | | | | |
| Codex | | | | | | |
| Maintainer (ratifies) | | | | | | |
