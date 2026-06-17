# Changelog

## v13 — 2026-06-17
- SKILL.md v0.9.0 -> v0.9.1 (PRD-032 R7/AC8).
  - The "run the orientation read-set, not recall" norm now prefers
    `tools/session-orient.mjs` first (read-only one-shot orientation: revision,
    next ids, unread, projection freshness, selected PRD/task, git-dirty +
    heuristic ownership, recommended commands; `--validate` runs the gates),
    then explicit Read-tool reads — now that the tool is implemented and green.
  - Trigger: Claude implemented `tools/session-orient.mjs` (PRD-006 A1 step 6),
    `evals/prd-032.evals.mjs` 9/9 green; Codex reviews (step 7). Header-version
    obligation is satisfied once the tool is green, not at draft acceptance (C3).

## v12 — 2026-06-17
- SKILL.md v0.8.0 -> v0.9.0.
  - Header version reconciled: the top-of-file `Version:` string was stale at
    0.6.0 through the v0.7.0 and v0.8.0 bumps (only the bottom version table was
    updated). Header now reads 0.9.0 with Last updated 2026-06-17 and the
    propagated-contracts note (PRD-021/022/024/030 + PRD-014 A1).
  - Adopted the Decision Mirror Modes (PRD-022) section: `audit-mirror` vs
    `delivery-mirror` declaration + a closeout digest check for delivery mirrors
    still needing acknowledgment. The section content was contributed by Codex's
    PRD-022 propagation, which edited Claude-owned skills/claude/SKILL.md directly
    (ownership-boundary crossing); flagged in the PRD-021/022 review and taken
    under Claude ownership/versioning here so the bundle hash/manifest stay honest.
  - PRD-017/023 propagation (Claude side): Startup Orientation Read Order now
    references the canonical boot command manifest docs/BOOT_SEQUENCE.md and the
    chat-file semantics (own-chat create / peer-chat warning-only); added the
    out-of-band drift-reconciliation boot check (governance-state-changing drift
    is decision-required). Codex-side boot-codex.md + skills/codex propagation is
    Codex's lane (ownership-respecting counter on the PRD-017/023 evals).

## v11 — 2026-06-17
- SKILL.md v0.7.0 -> v0.8.0: session-16 execution-gap fixes + Codex MSG-016
  (skill v8) mirror, in Claude terms.
  - Concurrent Write Discipline items 6-8: (6) only the Read tool satisfies the
    read-before-edit guard — Bash grep/sed/cat/head do not; locate with Bash,
    qualify the file with Read, then Edit. (7) Re-Read a shared file with the
    Read tool immediately before editing on every collaboration turn; "File
    modified since read" / "not been read yet" mean a concurrent write landed or
    the file was never qualified — reconcile, do not retry blind (session 16
    state moved 167->170->172->173 between consecutive Claude turns). (8) Inspect
    git state before shared edits; `git add` explicit paths only; never hand-edit
    a derived/aggregate view (PRD-031) — edit the source and regenerate.
  - Added Tokenese Adoption Guardrails section (PRD-027 mirror of Codex v8):
    source authority, `plain` compliant fallback, earn-breadth (W1+L1 before
    broadening; R6.4 adoption gate), deterministic `tkab-check` scoring +
    `tokenese-pairs` lane, self-report channels untrusted until calibration.
  - Output Format item 6: disclose peer-owned uncommitted changes left untouched.
  - Actions MSG-20260616-016 (acked 2026-06-16, mirrored here).
  - After first mirroring from the MSG-016 summary, READ skills/codex/SKILL.md
    directly (Maintainer prompt) and adapted three things the summary missed:
    Files First item 5 (explicit orientation read-set incl. git status +
    validators; memory-as-cache stated in Files First, not only the heartbeat
    section); Collaboration Posture item 7 (state disposition of each peer
    suggestion — applied/adapted/declined/deferred — and read the source artifact,
    not a summary, before claiming a mirror); Tokenese item 5 (M-09 stop/escalate
    triggers + adoption-band gradient operational->code-review->PRD-summary->never).

## v10 — 2026-06-17
- SKILL.md v0.6.0 -> v0.7.0: PRD-030 (Session Heartbeat Management Contract)
  implementation, session 16. Added the Session Heartbeat Management section —
  heartbeats are optional harness-local interaction gearing, not protocol
  authority; created only by Maintainer direction or handshake agreement and
  recorded in the session charter (not TURNFILE.yaml); negotiated fields
  (purpose, cadence, scope, owner, write/notification policy, stop condition);
  runtime + R9 memory boundary (model/platform memory is a cache, Turnfile
  project files are authoritative; re-read from disk + derive via next-state.mjs
  before writes); NOTIFY/DONT_NOTIFY contract with no liveness inference; and the
  closeout delete/update/carry-forward lifecycle with a mandatory WORKLOG entry
  per carried-forward heartbeat. Added a Module 6 heartbeat-inspection step.
  Implemented against evals/prd-030.evals.mjs (9/9 green); Codex reviews per
  PRD-006 A1. Also seated PRD-030 R6 as the heartbeat row in PRD-014 Amendment
  A1's unified closeout set.

## v9 — 2026-06-13
- SKILL.md v0.5.1 -> v0.6.0: encoded three session-14 ledger lessons.
  (1) Concurrent Write Discipline ("Derive, Don't Assume") — write-side complement
  to Files First: derive written values (IDs, counts, pointers) from the in-lock
  read; a validator's "expected" is file-truth; lock the whole batch up front;
  commit only own paths when a peer has uncommitted work; allocate IDs in-window.
  (2) Active-turn closure-owner check on own sent messages (thread-mode replies do
  not raise unread). (3) Builder/reviewer separation as an operating rule.

## v8 — 2026-06-13
- SKILL.md v0.5.0 -> v0.5.1: Model Ledger Handshake Check added (mirror of Codex
  skill v6, Maintainer-originated norm). Verify executing model+surface is in
  docs/llm/MODEL_LEDGER.md at boot before relying on model-compatibility claims;
  absence from a session or role-keyed path is not deprecation. Reciprocal of the
  MSG-039 Files-First mirror offer — peer norms adopted in both bundles.

## v7 — 2026-06-13
- SKILL.md v0.4.2 -> v0.5.0: "Files First, Not Memory" operating principle added
  (Maintainer directive). Re-read shared files before asserting or reasoning about
  state, not only before writing — Turnfile is concurrent collaborative file work,
  so memory is stale by default. Generalizes re-read-before-edit (write safety) to
  re-read-before-assert (answer safety). Root-cause fix for a recurring class of
  stale-memory errors (OQ status, file-move attribution, snapshot/ID drift).

## v6 — 2026-06-13
- SKILL.md v0.4.1 → v0.4.2: Collaboration Posture section added (Maintainer
  directive 2026-06-13): generative peer contribution mandatory in substantive
  replies; tenets 1-3 (request/propose only, own-file boundaries, Maintainer
  legibility) encoded as standing skill rules.

## v5 — 2026-06-13
- SKILL.md v0.4.0 → v0.4.1: PRD-024 propagation (R5.2). New "Encoding profile
  obligations" section: legible-only governance record, session-charter opt-in
  for dense lanes, turn-boundary projection obligation (R3.1) alongside the
  unread=0 rule, projection authorship liability, Maintainer demand/suspension
  compliance. Pending-contracts note updated (PRD-021 promoted; PRD-022 in review).

## v4 — 2026-06-12
- Bundle relocated from `skills/claude-opus_4.6/` to role-keyed `skills/claude/`
  (Maintainer direction, session 14). Model identity now lives in MANIFEST.yaml
  `compatibility` block, not the directory path. Old directory retained as
  historical reference until Maintainer-gated removal.
- SKILL.md: v0.3.0 → v0.4.0. Protocol baseline extended to PRD-016..019 (promoted
  in sessions 13-14). Added PRD-017 R7 chat-file completeness rules (own-file
  creation, peer-file warning, fixed session-header metadata), PRD-019 event-based
  cadence statement (no time-based polling) and chat-decision mirror duty with the
  session-14 delivery-gap workaround, Module 0 preflight path update, pending
  PRD-021 note.
- MANIFEST.yaml: bundle_version 4. tested_on extended with Fable 5 (session 14:
  full live protocol execution — boot, triage, cross-review closure, promotion,
  concurrent-edit recovery — on an unmodified v3 bundle, then this upgrade).
- Validated live: session 14 ran the complete protocol on Fable 5 before this
  upgrade, demonstrating model-generation portability of the v3 bundle.

## v3 — 2026-02-11
- SKILL.md: Added Module 0 (Session Bootstrap) for cold-start initialization
  from templates. Includes skills preflight check (P-7). Bumped version to 0.3.0.
  Updated versioning table.
- MANIFEST.yaml: Created. Bootstrap of skill-versioning metaskill applied to this
  bundle. Tracks SKILL.md hash, compatibility block, and file inventory.
- CHANGELOG.md: Created. Bootstrap entry.
- Boot file dependency: `working-session/boot-claude.md` rewritten to v5 in same
  session (all `inception/` references replaced with `working-session/`, cold-start
  bootstrap section added).

## v2 — 2026-02-08
- SKILL.md: Aligned with Codex SKILL.md structure (v0.2.0 → v0.2.1). Added
  execution contract, active-turn boundary discipline, startup orientation read
  order, state freshness hooks, fallback rules, output format requirements,
  environment-specific notes. Policy test suite validated (M4, 4/4 scenarios PASS).
- No MANIFEST.yaml or CHANGELOG.md existed at this version.

## v1 — 2026-02-06
- SKILL.md: Initial skill file created during inception pilot (PRD-012 M1).
  8 modules covering mailbox lifecycle, maintainer decisions, cross-agent review,
  shared-file transactions, session close, Turnfile coordination, OQ management.
- No MANIFEST.yaml or CHANGELOG.md existed at this version.
